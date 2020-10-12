import React, {useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastErrorMessageWithParameterConfig, toastSuccessMessageWithParameterConfig
} from "../../config/toastConfig";
import appConfig from "../../config/appConfig";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import InputRequire from "../components/InputRequire";
import {Link} from "react-router-dom";

const ClaimObjectImportPage = (props) => {
    document.title = "Satis client - Importation objet de reclamation";
    if (!verifyPermission(props.userPermissions, 'update-mail-parameters'))
        window.location.href = ERROR_401;

    const defaultData = {
        file: "",
    };
    const defaultError = {
        file: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    const handleChangeFile = (e) => {
        const newData = {...data};
        newData.file = e.target.value;
        setData(newData);
    };

    const onSubmit = async (e) => {
        const sendData = {...data};
        e.preventDefault();

        setStartRequest(true);
        await axios.put(`${appConfig.apiDomaine}/configurations/mail`, sendData)
            .then(response => {
                setStartRequest(false);
                setError(defaultError);
                setData(defaultData);
                ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig("succès de l'importation"));
            })
            .catch(({response}) => {
                setStartRequest(false);
                setError(response.data.error);
                ToastBottomEnd.fire(toastErrorMessageWithParameterConfig("Echec de l'importation"));
            })
        ;
    };

    return (
        verifyPermission(props.userPermissions, 'update-mail-parameters') ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Paramètre
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <Link to="/settings/claim_objects" className="kt-subheader__breadcrumbs-link">
                                    Objet de réclamation
                                </Link>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link" style={{cursor: "text"}}>
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
                                            Importation d'object de reclamation au format excel
                                        </h3>
                                    </div>
                                </div>

                                <form method="POST" className="kt-form">
                                    <div className="kt-form kt-form--label-right">
                                        <div className="kt-portlet__body">
                                            <div className={error.file.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="senderID">Fichier <InputRequire/></label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <input
                                                        id="senderID"
                                                        type="file"
                                                        className={error.file.length ? "form-control is-invalid" : "form-control"}
                                                        placeholder="Veiller choisier le fichier"
                                                        value={data.file}
                                                        onChange={(e) => handleChangeFile(e)}
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
                                        <div className="kt-portlet__foot">
                                            <div className="kt-form__actions text-right">
                                                {
                                                    !startRequest ? (
                                                        <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-primary">Enregistrer</button>
                                                    ) : (
                                                        <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                                            Chargement...
                                                        </button>
                                                    )
                                                }

                                                {
                                                    !startRequest ? (
                                                        <Link to="/settings/claim_objects" className="btn btn-secondary mx-2">
                                                            Quitter
                                                        </Link>
                                                    ) : (
                                                        <Link to="/settings/claim_objects" className="btn btn-secondary mx-2" disabled>
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
        ) : null
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(ClaimObjectImportPage);
