import React, {useEffect, useState} from "react";
import axios from "axios";
import {connect} from "react-redux";
import appConfig from "../../config/appConfig";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastEditErrorMessageConfig,
    toastEditSuccessMessageConfig,
} from "../../config/toastConfig";
import {Link, useParams} from "react-router-dom";
import {AUTH_TOKEN} from "../../constants/token";
import {debug} from "../../helpers/function";
import InputRequire from "../components/InputRequire";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

const ParametersComponentEdit = props => {
    const {id} = useParams();

    const [dataType, setDataType] = useState({});
    const [defaultError, setDefaultError] = useState({});
    const [defaultParam, setDefaultParam] = useState({});
    const [logo, setLogo] = useState(undefined);

    const [data, setData] = useState({});
    const [error, setError] = useState({});
    const [startRequest, setStartRequest] = useState(false);

    const formatState = (params, paramData = null) => {
        const newState = {};
        const newDataType = {};
        const newError = {};
        // console.log(paramData, "PARAMS");
        params.map(param => {
            newState[param] = paramData ? paramData[param].type === 'image' ? paramData[param].value.url : paramData[param].value : "";
            newDataType[param] = paramData ? paramData[param].type : "";
            newError[`params.${param}`] = [];

        });
        let sendDatas = {
            "params": newState
        };
        console.log(sendDatas, "sendDatas");
        setData(sendDatas);
        setDataType(newDataType);
        setError(newError);
        setDefaultError(newError);
    };

    const initialState = (stateData) => {
        let componentParams = [];
        for (const param in stateData) {
            componentParams.push(param);
        }
        formatState(componentParams, stateData);
        setDefaultParam(componentParams)

    };

    useEffect(() => {
        axios.get(appConfig.apiDomaine + `/components/${id}`)
            .then(response => {
                // console.log(response.data, "DATA")
                initialState(response.data.params.fr);
            })
    }, []);

    const handleChange = (e, param) => {
        const newData = {...data};
        newData.params[param] = e.target.value;
        // console.log(newData, "NEW_DATA");
        setData(newData);
    };
    const handleChangeImage = (e, param) => {
        const newData = {...data};
        newData.params[param] = e.target.files[0];
        setData(newData);
        setLogo(newData);
        var reader = new FileReader();
        reader.onload = function (e) {
            var image = document.getElementById(param);
            console.log(image, 'image');
            image.src = e.target.result;
        };
        reader.readAsDataURL(newData.params[param]);
    };

    const executeSave = (url, saveData) => {
        axios.put(url, saveData)
            .then(response => {
                setStartRequest(false);
                ToastBottomEnd.fire(toastEditSuccessMessageConfig);
                window.location.href = "/settings/config"
            })
            .catch(errorRequest => {
                setStartRequest(false);
                ToastBottomEnd.fire(toastEditErrorMessageConfig);
            })
        ;
    };

    const appendArray = (form_data, values, params) => {
        if (!values && params)
            form_data.append(params, '');
        else {
            if (typeof values == 'object') {
                for (const key in values) {
                    if (typeof values[key] == 'object')
                        appendArray(form_data, values[key], params + '[' + key + ']');
                    else
                        form_data.append(params + '[' + key + ']', values[key]);
                }
            } else
                form_data.append(params, values);
        }

        return form_data;
    };

    const createFormData = (formData, key, data) => {
        if (data === Object(data) || Array.isArray(data)) {
            for (const i in data) {
                createFormData(formData, key + '[' + i + ']', data[i]);
            }
        } else {
            formData.append(key, data);
        }
    };

    const formatFormData = (newData) => {
        const formData = new FormData();
        formData.append("_method", "put");

        for (const key in newData) {
            // console.log(("params[" + key + "]", newData.params[key]), "ALLO");
            if (logo) {
                for (let i = 0; i < (newData).length; i++)
                    formData.append(`params_${key}`, (newData[key])[i], ((newData[key])[i]).name);

            }
            formData.set(`params_${key}`, newData[key]);
        }
        // return appendArray(formData, newData.params, 'params');
        return formData
    };


    const saveData = (e) => {
        e.preventDefault();
        // const newData = {...data};
        // const formData = new FormData();
        // formData.append("params", formatFormData(data));
        // if(!logo){
        //     delete newData.params.logo;
        //     delete newData.params.background
        // }
        // const sendData = {
        //     params:formatFormData(newData)
        // };
        let dataToSend = formatFormData(data.params);
        dataToSend = dataToSend.entries();
        let obj = dataToSend.next();
        let retrieved = {};
        while(undefined !== obj.value) {
            retrieved[obj.value[0]] = obj.value[1];
            obj = dataToSend.next();
        }
        // console.log('data.params: ',data.params);
        console.log('retrieved: ',retrieved);
        console.log(data, 'DATA_SEND');
        // console.log(formatFormData(data).get("title"), "TITLE");
        setStartRequest(true);
        executeSave(`${appConfig.apiDomaine}/components/${id}`, formatFormData(data.params));
    };


    const printJsx = () => {
        return (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Paramètres
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()}
                                   className="kt-subheader__breadcrumbs-link">
                                    Configuration
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <div className="row">
                        <div className="col">
                            <div className="kt-portlet">
                                <div className="kt-portlet__head">
                                    <div className="kt-portlet__head-label">
                                        <h3 className="kt-portlet__head-title">
                                            Modification Configuration
                                        </h3>
                                    </div>
                                </div>

                                <form method="POST" className="kt-form">
                                    <div className="kt-form kt-form--label-right">
                                        <div className="kt-portlet__body">
                                            {/*{console.log(data,"DATA")}*/}

                                            {
                                                Object.keys(error).length ? (
                                                    Object.values(data.params).map((param, index) => (
                                                        dataType[Object.keys(dataType)[index]] === "image" ?
                                                            <div key={index}
                                                                 className={error[Object.keys(error)[index]].length ? "form-group row validated" : "form-group row"}>
                                                                <label className="col-xl-3 col-lg-3 col-form-label"
                                                                       htmlFor={Object.keys(data.params)[index]}>{Object.keys(data.params)[index]}
                                                                    <InputRequire/></label>
                                                                <div className="col-lg-9 col-xl-6">
                                                                    <div className="kt-avatar kt-avatar--outline"
                                                                         id="kt_user_add_avatar">
                                                                        <div className="kt-avatar__holder"
                                                                             style={{textAlign: 'center'}}>

                                                                            <img
                                                                                id={Object.keys(data.params)[index]}
                                                                                src={appConfig.apiDomaine + data.params[Object.keys(data.params)[index]]}
                                                                                alt={Object.keys(data.params)[index]}
                                                                                style={{
                                                                                    maxWidth: "110px",
                                                                                    maxHeight: "110px",
                                                                                    textAlign: 'center'
                                                                                }}
                                                                            />

                                                                        </div>
                                                                        <label className="kt-avatar__upload"
                                                                               id="files"
                                                                               data-toggle="kt-tooltip"
                                                                               title="Change avatar">
                                                                            <i className="fa fa-pen"/>
                                                                            <input type="file"
                                                                                   id="file"
                                                                                   name="kt_user_add_user_avatar"
                                                                                   onChange={(e) => handleChangeImage(e, Object.keys(data.params)[index])}
                                                                            />
                                                                        </label>
                                                                        <span className="kt-avatar__cancel"
                                                                              data-toggle="kt-tooltip"
                                                                              title="Cancel avatar">
                                                                            <i className="fa fa-times"/>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div key={index}
                                                                 className={error[Object.keys(error)[index]].length ? "form-group row validated" : "form-group row"}>
                                                                <label className="col-xl-3 col-lg-3 col-form-label"
                                                                       htmlFor={Object.keys(data.params)[index]}>{Object.keys(data.params)[index]}
                                                                    <InputRequire/></label>
                                                                <div className="col-lg-9 col-xl-6">

                                                                    {/*{ console.log(Object.keys(data.params)[index], "dataParams")}*/}
                                                                    <input
                                                                        id={Object.keys(data.params)[index]}
                                                                        type={dataType[Object.keys(dataType)[index]]}
                                                                        className={error[Object.keys(error)[index]].length ? "form-control is-invalid" : "form-control"}
                                                                        placeholder={Object.keys(data.params)[index]}
                                                                        value={data.params[Object.keys(data.params)[index]]}
                                                                        onChange={(e) => handleChange(e, Object.keys(data.params)[index])}
                                                                    />
                                                                    {
                                                                        error[Object.keys(error)[index]].length ? (
                                                                            error[Object.keys(error)[index]].map((error, index) => (
                                                                                <div key={index}
                                                                                     className="invalid-feedback">
                                                                                    {error}
                                                                                </div>
                                                                            ))
                                                                        ) : null
                                                                    }
                                                                </div>
                                                            </div>
                                                    ))
                                                ) : null
                                            }
                                        </div>
                                        <div className="kt-portlet__foot">
                                            <div className="kt-form__actions text-right">
                                                {
                                                    !startRequest ? (
                                                        <button type="submit" onClick={(e) => saveData(e)}
                                                                className="btn btn-primary">{id ? "Modifier" : "Enregistrer"}</button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                                            type="button" disabled>
                                                            Chargement...
                                                        </button>
                                                    )
                                                }
                                                {
                                                    !startRequest ? (
                                                        <Link to="/settings/config"
                                                              className="btn btn-secondary mx-2">
                                                            Quitter
                                                        </Link>
                                                    ) : (
                                                        <Link to="/settings/config"
                                                              className="btn btn-secondary mx-2" disabled>
                                                            Quitter
                                                        </Link>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (

        printJsx()

    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(ParametersComponentEdit);
