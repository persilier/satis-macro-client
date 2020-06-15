import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {
    Link,
    useParams
} from "react-router-dom";
import {ToastBottomEnd} from "./Toast";
import {
    toastAddSuccessMessageConfig,
    toastErrorMessageWithParameterConfig
} from "../../config/toastConfig";
import appConfig from "../../config/appConfig";
import {ERROR_401} from "../../config/errorPage";
import {verifyPermission} from "../../helpers/permission";

axios.defaults.headers.common['Authorization'] = "Bearer "+localStorage.getItem('token');


const CategoryClientForm = (props) => {
    const {editcategoryid} = useParams();

    if (!editcategoryid) {
        if (!verifyPermission(props.userPermissions, 'store-category-client'))
            window.location.href = ERROR_401;
    } else {
        if (!verifyPermission(props.userPermissions, 'update-category-client'))
            window.location.href = ERROR_401;
    }
    const defaultData = {
        name: "",
        description: "",
    };
    const defaultError = {
        name: [],
        description: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {

        if (editcategoryid) {
            axios.get(appConfig.apiDomaine + `/category-clients/${editcategoryid}`)
                .then(response => {
                    const newCategory = {
                        name: response.data.name.fr,
                        description: response.data.description.fr
                    };
                    setData(newCategory);
                })
        }

    });

    const onChangeName = (e) => {
        const newData = {...data};
        newData.name = e.target.value;
        setData(newData);
    };

    const onChangeDescription = (e) => {
        const newData = {...data};
        newData.description = e.target.value;
        setData(newData);
    };


    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);

        if (editcategoryid) {
            axios.put(appConfig.apiDomaine + `/category-clients/${editcategoryid}`, data)
                .then(response => {
                    setStartRequest(false);
                    setError(defaultError);
                    setData(defaultData);
                    ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                })
                .catch(error => {
                    setStartRequest(false);
                    setError({...defaultError});
                    // ToastBottomEnd.fire(toastAddErrorMessageConfig);
                    ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(error.response.data.error));
                })
            ;
        } else {
            axios.post(appConfig.apiDomaine + `/category-clients`, data)
                .then(response => {
                    setStartRequest(false);
                    setError(defaultError);
                    setData(defaultData);
                    ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                })
                .catch(error => {
                    setStartRequest(false);
                    setError({...defaultError});
                    // ToastBottomEnd.fire(toastAddErrorMessageConfig);
                    ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(error.response.data.error));
                })
            ;
        }

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
                            <Link to="/settings/clients/category" className="kt-subheader__breadcrumbs-link">
                                Catégorie Client
                            </Link>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="#button" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link">
                                {
                                    editcategoryid ? "Modification" : "Ajout"
                                }
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
                                        {
                                            editcategoryid ? "Modification Catégorie Client" : "Ajout de Catégorie Client"
                                        }
                                    </h3>
                                </div>
                            </div>

                            <form method="POST" className="kt-form">
                                <div className="kt-portlet__body">
                                    <div className="tab-content">
                                        <div className="tab-pane active" id="kt_user_edit_tab_1" role="tabpanel">
                                            <div className="kt-form kt-form--label-right">
                                                <div className="kt-form__body">
                                                    <div className="kt-section kt-section--first">
                                                        <div className="kt-section__body">

                                                            <div
                                                                className={error.name.length ? "form-group row validated" : "form-group row"}>
                                                                <label className="col-xl-3 col-lg-3 col-form-label"
                                                                       htmlFor="name">Le Nom</label>
                                                                <div className="col-lg-9 col-xl-6">
                                                                    <input
                                                                        id="name"
                                                                        type="text"
                                                                        className={error.name.length ? "form-control is-invalid" : "form-control"}
                                                                        placeholder="Veillez entrer le nom"
                                                                        value={data.name}
                                                                        onChange={(e) => onChangeName(e)}
                                                                    />
                                                                    {
                                                                        error.name.length ? (
                                                                            error.name.map((error, index) => (
                                                                                <div key={index}
                                                                                     className="invalid-feedback">
                                                                                    {error}
                                                                                </div>
                                                                            ))
                                                                        ) : ""
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div
                                                                className={error.description.length ? "form-group row validated" : "form-group row"}>
                                                                <label className="col-xl-3 col-lg-3 col-form-label"
                                                                       htmlFor="description">La Description'</label>
                                                                <div className="col-lg-9 col-xl-6">
                                                                <textarea
                                                                    id="description"
                                                                    className={error.description.length ? "form-control is-invalid" : "form-control"}
                                                                    placeholder="Veillez entrer la description"
                                                                    cols="30"
                                                                    rows="5"
                                                                    value={data.description}
                                                                    onChange={(e) => onChangeDescription(e)}
                                                                />
                                                                    {
                                                                        error.description.length ? (
                                                                            error.description.map((error, index) => (
                                                                                <div key={index}
                                                                                     className="invalid-feedback">
                                                                                    {error}
                                                                                </div>
                                                                            ))
                                                                        ) : ""
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="kt-portlet__foot">
                                                            <div className="kt-form__actions text-right">
                                                                {
                                                                    !startRequest ? (
                                                                        <button type="submit"
                                                                                onClick={(e) => onSubmit(e)}
                                                                                className="btn btn-primary">Envoyer</button>
                                                                    ) : (
                                                                        <button
                                                                            className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                                                            type="button" disabled>
                                                                            Loading...
                                                                        </button>
                                                                    )
                                                                }
                                                                {
                                                                    !startRequest ? (
                                                                        <Link to="/settings/clients/category"
                                                                              className="btn btn-secondary mx-2">
                                                                            Quitter
                                                                        </Link>
                                                                    ) : (
                                                                        <Link to="/settings/clients/category"
                                                                              className="btn btn-secondary mx-2"
                                                                              disabled>
                                                                            Quitter
                                                                        </Link>
                                                                    )
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
        editcategoryid ?
            verifyPermission(props.userPermissions, 'update-category-client') ? (
                printJsx()
            ) : ""
            : verifyPermission(props.userPermissions, 'store-category-client') ? (
                printJsx()
            ) : ""
    );

};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions
    }
};

export default connect(mapStateToProps)(CategoryClientForm);
