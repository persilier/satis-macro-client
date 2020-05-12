import React, {useState, useEffect} from "react";
import axios from "axios";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastEditErrorMessageConfig,
    toastEditSuccessMessageConfig
} from "../../config/toastConfig";
import appConfig from "../../config/appConfig";
import FormInformation from "../components/FormInformation";

const SMS = () => {
    const defaultData = {
        senderID: "",
        username: "",
        indicatif: "",
        password: "",
        api: ""
    };
    const defaultError = {
        senderID: [],
        username: [],
        indicatif: [],
        password: [],
        api: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        axios.get(`${appConfig.apiDomaine}/configurations/sms`)
            .then(response => {
                const newData = {
                    enderID: "",
                    username: "",
                    indicatif: "",
                    password: "",
                    api: "",
                    ...response.data
                };
                setData(newData);
            })
            .catch(error => {
                console.log("Something is wrong");
            })
        ;
    }, []);

    const onChangeSenderID = (e) => {
        const newData = {...data};
        newData.senderID = e.target.value;
        setData(newData);
    };

    const onChangeUsername = (e) => {
        const newData = {...data};
        newData.username = e.target.value;
        setData(newData);
    };

    const onChangeIndicatif = (e) => {
        const newData = {...data};
        newData.indicatif = e.target.value;
        setData(newData);
    };

    const onChangePassword = (e) => {
        const newData = {...data};
        newData.password = e.target.value;
        setData(newData);
    };

    const onChangeApi = (e) => {
        const newData = {...data};
        newData.api = e.target.value;
        setData(newData);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        setStartRequest(true);
        axios.put(`${appConfig.apiDomaine}/configurations/sms`, data)
            .then(response => {
                setStartRequest(false);
                setError(defaultError);
                const newData = {...data};
                newData.password = "";
                setData(newData);
                ToastBottomEnd.fire(toastEditSuccessMessageConfig);
            })
            .catch(errorRequest => {
                setStartRequest(false);
                setError({...defaultError, ...errorRequest.response.data.error});
                ToastBottomEnd.fire(toastEditErrorMessageConfig);
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
                            <a href="#link" className="kt-subheader__breadcrumbs-home">
                                <i className="flaticon2-shelter"/>
                            </a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="#link" className="kt-subheader__breadcrumbs-link">
                                SMS
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
                                        SMS
                                    </h3>
                                </div>
                            </div>

                            <form method="POST" className="kt-form">
                                <div className="kt-form kt-form--label-right">
                                    <div className="kt-portlet__body">
                                        <FormInformation information={"The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes."}/>

                                        <div className={error.senderID.length ? "form-group row validated" : "form-group row"}>
                                            <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="senderID">Identifiant Expéditeur</label>
                                            <div className="col-lg-9 col-xl-6">
                                                <input
                                                    id="senderID"
                                                    type="text"
                                                    className={error.senderID.length ? "form-control is-invalid" : "form-control"}
                                                    placeholder="Veillez entrer l'identifiant de l'expéditeur"
                                                    value={data.senderID}
                                                    onChange={(e) => onChangeSenderID(e)}
                                                />
                                                {
                                                    error.senderID.length ? (
                                                        error.senderID.map((error, index) => (
                                                            <div key={index} className="invalid-feedback">
                                                                {error}
                                                            </div>
                                                        ))
                                                    ) : ""
                                                }
                                            </div>
                                        </div>
                                        <div className={error.username.length ? "form-group row validated" : "form-group row"}>
                                            <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="username">Votre nom</label>
                                            <div className="col-lg-9 col-xl-6">
                                                <input
                                                    id="username"
                                                    type="text"
                                                    className={error.username.length ? "form-control is-invalid" : "form-control"}
                                                    placeholder="Veillez entrer votre nom"
                                                    value={data.username}
                                                    onChange={(e) => onChangeUsername(e)}
                                                />
                                                {
                                                    error.username.length ? (
                                                        error.username.map((error, index) => (
                                                            <div key={index} className="invalid-feedback">
                                                                {error}
                                                            </div>
                                                        ))
                                                    ) : ""
                                                }
                                            </div>
                                        </div>
                                        <div className={error.password.length ? "form-group row validated" : "form-group row"}>
                                            <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="password">Mot de passe</label>
                                            <div className="col-lg-9 col-xl-6">
                                                <input
                                                    type="password"
                                                    className={error.password.length ? "form-control is-invalid" : "form-control"}
                                                    id="password"
                                                    placeholder=". . . . . . . . . "
                                                    value={data.password}
                                                    onChange={(e) => onChangePassword(e)}
                                                />
                                                {
                                                    error.password.length ? (
                                                        error.password.map((error, index) => (
                                                            <div key={index} className="invalid-feedback">
                                                                {error}
                                                            </div>
                                                        ))
                                                    ) : ""
                                                }
                                            </div>
                                        </div>
                                        <div className={error.indicatif.length ? "form-group row validated" : "form-group row"}>
                                            <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="indicatif">Indicatif Pays</label>
                                            <div className="col-lg-9 col-xl-6">
                                                <input
                                                    type="number"
                                                    className={error.indicatif.length ? "form-control is-invalid" : "form-control"}
                                                    id="indicatif"
                                                    placeholder="Veillez entrer l'indicatif"
                                                    value={data.indicatif}
                                                    onChange={(e) => onChangeIndicatif(e)}
                                                />
                                                {
                                                    error.indicatif.length ? (
                                                        error.indicatif.map((error, index) => (
                                                            <div key={index} className="invalid-feedback">
                                                                {error}
                                                            </div>
                                                        ))
                                                    ) : ""
                                                }
                                            </div>
                                        </div>
                                        <div className={error.api.length ? "form-group row validated" : "form-group row"}>
                                            <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="api">API</label>
                                            <div className="col-lg-9 col-xl-6">
                                                <input
                                                    type="text"
                                                    className={error.api.length ? "form-control is-invalid" : "form-control"}
                                                    id="api"
                                                    placeholder="Veillez entrer l'API"
                                                    value={data.api}
                                                    onChange={(e) => onChangeApi(e)}
                                                />
                                                {
                                                    error.api.length ? (
                                                        error.api.map((error, index) => (
                                                            <div key={index} className="invalid-feedback">
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
                                                    <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-primary">Enoyer</button>
                                                ) : (
                                                    <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                                        Chargement...
                                                    </button>
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

export default SMS;
