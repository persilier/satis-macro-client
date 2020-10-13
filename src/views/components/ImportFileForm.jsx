import React, {useState} from "react";
import axios from "axios";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastErrorMessageWithParameterConfig, toastSuccessMessageWithParameterConfig
} from "../../config/toastConfig";
import InputRequire from "../components/InputRequire";
import {Link} from "react-router-dom";

const ImportFileForm = (props) => {
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
        const formData = new FormData();
        formData.append("file", data.file);
        console.log("file:", formData.get('file'));
        e.preventDefault();

        setStartRequest(true);
        await axios.post(props.submitEndpoint, formData)
            .then(response => {
                setStartRequest(false);
                setError(defaultError);
                setData(defaultData);
                ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig("succès de l'importation"));
            })
            .catch(({response}) => {
                setStartRequest(false);
                console.log("coucou:", response.data);
                setError({...defaultError, ...response.data.error});
                ToastBottomEnd.fire(toastErrorMessageWithParameterConfig("Echec de l'importation"));
            })
        ;
    };

    return (
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
                            <Link to={props.pageTitleLink} className="kt-subheader__breadcrumbs-link">
                                {props.pageTitle}
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
                                        {props.panelTitle}
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
                                                    placeholder="Veillez choisier le fichier"
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
    );
};

export default ImportFileForm;
