import React, {useState} from "react";
import axios from "axios";
import {ToastBottomEnd} from "./Toast";
import {
    toastErrorMessageWithParameterConfig, toastSuccessMessageWithParameterConfig
} from "../../config/toastConfig";
import InputRequire from "../components/InputRequire";
import {Link} from "react-router-dom";
import {verifyTokenExpire} from "../../middleware/verifyToken";
import {useTranslation} from "react-i18next";

const ImportFileForm = (props) => {

    //usage of useTranslation i18n
    const {t, ready} = useTranslation()

    const defaultData = {
        file: "",
    };
    const defaultError = {
        file: [],
        etat_update: []
    };
    const optionOne = 1;
    const optionTwo = 0;

    const [stateUpdate, setStateUpdate] = useState(optionTwo);
    const [name, setName] = useState('');
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    const handleStateUpdateChange = (e) => {
        setStateUpdate(parseInt(e.target.value));
    };

    const handleChangeFile = (e) => {
        const newData = {...data};
        setName(e.target.value);
        newData.file = Object.values(e.target.files)[0];
        setData(newData);
    };

    const onSubmit = async (e) => {
        const formData = new FormData();
        formData.append("file", data.file);
        if (props.claimImport) {
            formData.append('etat_update', stateUpdate);
        }
        e.preventDefault();

        setStartRequest(true);
        if (verifyTokenExpire()) {
            await axios.post(props.submitEndpoint, formData)
                .then(response => {
                    setStartRequest(false);
                    setError(defaultError);
                    if (response.data.status) {
                        setName("");
                        setData(defaultData);
                        ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig(t("succès de l'importation")));
                    } else {
                        ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(t("Echec de l'importation")));
                    }
                })
                .catch(({response}) => {
                    setStartRequest(false);
                    if (response.data.code === 422)
                        setError({...defaultError, ...response.data.error});
                    ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(t("Echec de l'importation")));
                })
            ;
        }
    };

    return (
        ready ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                {t("Paramètre")}
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <Link to={props.pageTitleLink} className="kt-subheader__breadcrumbs-link">
                                    {props.pageTitle}
                                </Link>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link" style={{cursor: "text"}}>
                                    {t("Importation")}
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
                                            {props.panelTitle}
                                        </h3>
                                    </div>
                                </div>

                                <form method="POST" className="kt-form">
                                    <div className="kt-form kt-form--label-right">
                                        <div className="kt-portlet__body">
                                            {
                                                props.claimImport ? (
                                                    <div className={error.etat_update.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-3 col-form-label" htmlFor={"role"}>{t("Modifier")} <InputRequire/></label>
                                                        <div className="col-lg-9 col-xl-6">
                                                            <div className="kt-radio-inline">
                                                                <label className="kt-radio">
                                                                    <input type="radio" className={error.etat_update.length ? "form-control is-invalid" : "form-control"}  value={optionOne} onChange={handleStateUpdateChange} checked={optionOne === stateUpdate}/> {t("OUI")}<span/>
                                                                </label>
                                                                <label className="kt-radio">
                                                                    <input type="radio" className={error.etat_update.length ? "form-control is-invalid" : "form-control"} value={optionTwo} onChange={handleStateUpdateChange} checked={optionTwo === stateUpdate}/> {t("NON")}<span/>
                                                                </label>
                                                            </div>
                                                            {
                                                                error.etat_update.length ? (
                                                                    error.etat_update.map((error, index) => (
                                                                        <div key={index} className="invalid-feedback">
                                                                            {error}
                                                                        </div>
                                                                    ))
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>
                                                ) :  null
                                            }


                                            <div className={error.file.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="senderID">{t("Fichier")} <InputRequire/></label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <input
                                                        id="senderID"
                                                        type="file"
                                                        className={error.file.length ? "form-control is-invalid" : "form-control"}
                                                        placeholder={t("Veuillez choisier le fichier")}
                                                        value={name}
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
                                                        <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-primary">{t("Enregistrer")}</button>
                                                    ) : (
                                                        <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                                            {t("Chargement")}...
                                                        </button>
                                                    )
                                                }

                                                {
                                                    !startRequest ? (
                                                        <Link to={props.pageTitleLink} className="btn btn-secondary mx-2">
                                                            {t("Quitter")}
                                                        </Link>
                                                    ) : (
                                                        <Link to={props.pageTitleLink} className="btn btn-secondary mx-2" disabled>
                                                            {t("Quitter")}
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

export default ImportFileForm;
