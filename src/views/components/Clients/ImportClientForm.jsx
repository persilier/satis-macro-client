import React, {useState} from "react";
import axios from "axios";
import {
    Link,
} from "react-router-dom";
import {ToastBottomEnd} from "../Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
} from "../../../config/toastConfig";
import appConfig from "../../../config/appConfig";
import InputRequire from "../InputRequire";
import {connect} from "react-redux";
import {verifyPermission} from "../../../helpers/permission";
import {ERROR_401} from "../../../config/errorPage";
import {verifyTokenExpire} from "../../../middleware/verifyToken";

const endPointConfig = {
    PRO: {
        plan: "PRO",
        store: `${appConfig.apiDomaine}/my/import-clients`,
    },
    MACRO: {
        holding: {
            store: `${appConfig.apiDomaine}/any/import-clients`,
        },
        filial: {
            store: `${appConfig.apiDomaine}/my/import-clients`,
        }
    },
    HUB: {
        plan: "HUB",
        store: `${appConfig.apiDomaine}/any/import-clients `,
    }
};

const ImportClientForm = (props) => {
    document.title = "Satis client - Importation de fichier excel";

    if (!(verifyPermission(props.userPermissions, 'store-client-from-any-institution') ||
        verifyPermission(props.userPermissions, 'store-client-from-my-institution')))
        window.location.href = ERROR_401;

    let endPoint = "";
    if (props.plan === "MACRO") {
        if (verifyPermission(props.userPermissions, 'store-client-from-any-institution'))
            endPoint = endPointConfig[props.plan].holding;
        else if (verifyPermission(props.userPermissions, 'store-client-from-my-institution'))
            endPoint = endPointConfig[props.plan].filial
    } else
        endPoint = endPointConfig[props.plan];


    const option1 = 1;
    const option2 = 0;

    const defaultData = {
        file: "",
        etat_update: "",
        stop_identite_exist: "",
    };
    const defaultError = {
        file: [],
        etat_update: "",
        stop_identite_exist: "",
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    const onChangeFile = (e) => {
        const newData = {...data};
        newData.file = Object.values(e.target.files)[0];
        setData(newData);
    };

    const onChangeOption = (e) => {
        const newData = {...data};
        newData.stop_identite_exist = e.target.value;
        setData(newData);
    };
    const onChangeEtatOption = (e) => {
        const newData = {...data};
        newData.etat_update = e.target.value;
        setData(newData);
    };

    const formatFormData = (newData) => {
        const formData = new FormData();
        formData.append("_method", "post");
        for (const key in newData) {
            // console.log(`${key}:`, newData[key]);
            if (key === "file") {
                formData.append("file", newData.file);
            } else
                formData.set(key, newData[key]);
        }
        console.log(formData.get('file'), 'FORMDATA');
        return formData;

    };

    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);

        if (verifyTokenExpire()) {
            axios.post(endPoint.store, formatFormData(data))
                .then(response => {
                    setStartRequest(false);
                    setError(defaultError);
                    setData(defaultData);
                    ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                })
                .catch(error => {
                    setStartRequest(false);
                    setError({...defaultError, ...error.response.data.error});
                    ToastBottomEnd.fire(toastAddErrorMessageConfig);
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
                                <a href="#" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link">
                                    Importation
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
                                            Importation de clients
                                        </h3>
                                    </div>
                                </div>
                                {console.log(data, "DATA_OPTION")}
                                <form method="POST" className="kt-form">
                                    <div className="kt-portlet__body">

                                        <div
                                            className={error.stop_identite_exist.length ? "form-group row validated" : "form-group row"}>
                                            <label className="col-xl-3 col-lg-3 col-form-label">Identité existe déjà
                                                ? <InputRequire/></label>
                                            <div className="kt-radio-inline col-lg-9 col-xl-6">

                                                <label className="kt-radio kt-radio--bold kt-radio--success">
                                                    <input
                                                        className={error.stop_identite_exist.length ? "form-control is-invalid" : "form-control"}
                                                        type="radio"
                                                        name="radio3"
                                                        value={option1}
                                                        onChange={(e) => onChangeOption(e)}
                                                    /> Oui
                                                    <span/>
                                                </label>
                                                <label className="kt-radio kt-radio--bold kt-radio--danger">
                                                    <input
                                                        className={error.stop_identite_exist.length ? "form-control is-invalid" : "form-control"}
                                                        type="radio"
                                                        name="radio3"
                                                        value={option2}
                                                        onChange={(e) => onChangeOption(e)}
                                                    /> Non
                                                    <span/>
                                                </label>
                                            </div>
                                            {
                                                error.stop_identite_exist.length ? (
                                                    error.stop_identite_exist.map((error, index) => (
                                                        <div key={index}
                                                             className="invalid-feedback">
                                                            {error}
                                                        </div>
                                                    ))
                                                ) : null
                                            }
                                        </div>

                                        <div
                                            className={error.etat_update.length ? "form-group row validated" : "form-group row"}>
                                            <label className="col-xl-3 col-lg-3 col-form-label">Est ce une mise a
                                                jour? <InputRequire/></label>
                                            <div className="kt-radio-inline col-lg-9 col-xl-6">

                                                <label className="kt-radio kt-radio--bold kt-radio--success">
                                                    <input
                                                        className={error.etat_update.length ? "form-control is-invalid" : "form-control"}
                                                        type="radio"
                                                        name="radio4"
                                                        value={option1}
                                                        onChange={(e) => onChangeEtatOption(e)}
                                                    /> Oui
                                                    <span/>
                                                </label>
                                                <label className="kt-radio kt-radio--bold kt-radio--danger">
                                                    <input
                                                        className={error.etat_update.length ? "form-control is-invalid" : "form-control"}
                                                        type="radio"
                                                        name="radio4"
                                                        value={option2}
                                                        onChange={(e) => onChangeEtatOption(e)}
                                                    /> Non
                                                    <span/>
                                                </label>
                                            </div>
                                            {
                                                error.etat_update.length ? (
                                                    error.etat_update.map((error, index) => (
                                                        <div key={index}
                                                             className="invalid-feedback">
                                                            {error}
                                                        </div>
                                                    ))
                                                ) : null
                                            }
                                        </div>

                                        <div
                                            className={error.file.length ? "form-group row validated" : "form-group row"}>
                                            <label className="col-xl-3 col-lg-3 col-form-label"
                                                   htmlFor="file">Fichier <InputRequire/></label>
                                            <div className="col-md-9 mb-3">
                                                <input
                                                    id="file"
                                                    type="file"
                                                    className={error.file.length ? "form-control is-invalid" : "form-control"}
                                                    placeholder="Veillez télécharger le fichier excel"
                                                    onChange={(e) => onChangeFile(e)}
                                                />
                                                {
                                                    error.file.length ? (
                                                        error.file.map((error, index) => (
                                                            <div key={index} className="invalid-feedback">
                                                                {error}
                                                            </div>
                                                        ))
                                                    ) : null
                                                }
                                            </div>
                                        </div>

                                    </div>
                                    <div className="kt-portlet__foot text-right">
                                        <div className="kt-form__actions">
                                            {
                                                !startRequest ? (
                                                    <button type="submit" onClick={(e) => onSubmit(e)}
                                                            className="btn btn-primary">Enregistrer</button>
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
                                                    <Link to="/settings/clients"
                                                          className="btn btn-secondary mx-2">
                                                        Quitter
                                                    </Link>
                                                ) : (
                                                    <Link to="/settings/clients"
                                                          className="btn btn-secondary mx-2" disabled>
                                                        Quitter
                                                    </Link>
                                                )
                                            }

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
        verifyPermission(props.userPermissions, 'store-client-from-any-institution') ||
        verifyPermission(props.userPermissions, 'store-client-from-my-institution') ?
            printJsx()
            : null
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan,
    }
};

export default connect(mapStateToProps)(ImportClientForm);
