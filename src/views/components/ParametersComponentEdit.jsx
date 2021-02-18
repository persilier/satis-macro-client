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
import InputRequire from "../components/InputRequire";
import {verifyTokenExpire} from "../../middleware/verifyToken";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.common['Content-Type'] = "multipart/form-data";

const ParametersComponentEdit = (props) => {
    const {id} = useParams();
    const defaultLogo={
        params_logo:false,
        params_owner_logo:false,
        params_background:false
    }

    const [dataType, setDataType] = useState({});
    const [logo, setLogo] = useState(defaultLogo);

    const [data, setData] = useState({});
    const [error, setError] = useState({});
    const [startRequest, setStartRequest] = useState(false);

    const formatState = (params, paramData = null) => {
        const newState = {};
        const newDataType = {};
        const newError = {};
        params.map(param => {
            newState[`params_${param}`] = paramData ? paramData[param].type === 'image' ? (paramData[param].value!== null?paramData[param].value.url:null) : paramData[param].value : "";
            newDataType[`params_${param}`] = paramData ? paramData[param].type : "";
            newError[`params_${param}`] = [];

        });
        console.log(newDataType, "newDataType");
        setData(newState);
        setDataType(newDataType);
        setError(newError);
    };

    const initialState = (stateData) => {
        let componentParams = [];
        for (const param in stateData) {
            componentParams.push(param);
        }
        formatState(componentParams, stateData);

    };

    useEffect(() => {
        if (verifyTokenExpire()) {
            axios.get(appConfig.apiDomaine + `/components/${id}`)
                .then(response => {
                    initialState(response.data.params.fr);
                })
            ;
        }
    }, []);

    const handleChange = (e, param) => {
        const newData = {...data};
        newData[param] = e.target.value;
        setData(newData);
    };
    const handleChangeImage = (e, param) => {
        const newData = {...data};
        newData[param] = Object.values(e.target.files)[0];
        setData(newData);
        console.log(Object.values(e.target.files)[0], "NEW_DATA");
        console.log(newData[param], 'new data param');
        const newLogo={...logo};
        newLogo[param]=true;
        setLogo(newLogo);
        var reader = new FileReader();
        reader.onload = function (e) {
            var image = document.getElementById(param);
            console.log(image, 'image');
            image.src = e.target.result;
        };
        reader.readAsDataURL(newData[param]);
    };

    const executeSave = (url, saveData) => {
        if (verifyTokenExpire()) {
            axios.post(url, saveData)
                .then(response => {
                    setStartRequest(false);
                    ToastBottomEnd.fire(toastEditSuccessMessageConfig);
                    // window.location.href = "/settings/config"
                })
                .catch(errorRequest => {
                    setStartRequest(false);
                    ToastBottomEnd.fire(toastEditErrorMessageConfig);
                })
            ;
        }
    };


    const formatFormData = (newData, newType) => {
        console.log(newData,"newData");
        console.log(newType,"newType");
        const formData = new FormData();
        formData.set("_method", "put");
        for (const key in newData) {
            if (newType[key]==="image") {
                formData.append(key, newData[key]);
            }else{
                formData.set(key, newData[key]);
            }
        }
        return formData;
    };

    const saveData = (e) => {
        e.preventDefault();
        const newData = {...data};
        const newType = {...dataType};
        const newLogo={...logo};
        if (newLogo.params_logo===false){
            delete newData.params_logo;
        }
        if (newLogo.params_background===false){
            delete newData.params_background
        }
        if (newLogo.params_owner_logo===false){
            delete newData.params_owner_logo
        }
        // Debut de Log du contenu du formData
        let dataToSend = formatFormData(newData, newType);
        // console.log(dataToSend.get("params_title"),"TITLE")
        // dataToSend = dataToSend.entries();
        // let obj = dataToSend.next();
        // let retrieved = {};
        // while(undefined !== obj.value) {
        //     retrieved[obj.value[0]] = obj.value[1];
        //     obj = dataToSend.next();
        // }
        // console.log('retrieved: ',retrieved);
        // fin de Log du contenu du formData

        setStartRequest(true);
        executeSave(`${appConfig.apiDomaine}/components/${id}`, dataToSend);
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
                                            {console.log(logo,"Logo_Data")}
                                            {
                                                Object.keys(error).length ? (
                                                    Object.values(data).map((param, index) => (
                                                        dataType[Object.keys(dataType)[index]] === "image" ?
                                                            <div key={index}
                                                                 className={error[Object.keys(error)[index]].length ? "form-group row validated" : "form-group row"}>
                                                                <label className="col-xl-3 col-lg-3 col-form-label"
                                                                       htmlFor={Object.keys(data)[index]}>{(Object.keys(data)[index]).slice(7)}
                                                                    <InputRequire/></label>
                                                                {/*{console.log(error,"ERRor")}*/}
                                                                <div className="col-lg-9 col-xl-6">
                                                                    <div className="kt-avatar kt-avatar--outline"
                                                                         id="kt_user_add_avatar">
                                                                        <div className="kt-avatar__holder"
                                                                             style={{textAlign: 'center'}}>

                                                                            <img
                                                                                id={Object.keys(data)[index]}
                                                                                src={appConfig.apiDomaine + data[Object.keys(data)[index]]}
                                                                                alt={Object.keys(data)[index]}
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
                                                                                   onChange={(e) => handleChangeImage(e, Object.keys(data)[index])}
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
                                                                       htmlFor={Object.keys(data)[index]}>{(Object.keys(data)[index]).slice(7)}
                                                                    <InputRequire/></label>
                                                                <div className="col-lg-9 col-xl-6">

                                                                    <input
                                                                        id={Object.keys(data)[index]}
                                                                        type={dataType[Object.keys(dataType)[index]]}
                                                                        className={error[Object.keys(error)[index]].length ? "form-control is-invalid" : "form-control"}
                                                                        placeholder={"Veuillez entrer"+ " " +(Object.keys(data)[index]).slice(7)}
                                                                        value={data[Object.keys(data)[index]]}
                                                                        onChange={(e) => handleChange(e, Object.keys(data)[index])}
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
