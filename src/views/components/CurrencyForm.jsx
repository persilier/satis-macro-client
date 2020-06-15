import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {
    useParams,
    Link
} from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import appConfig from "../../config/appConfig";
import {ToastBottomEnd} from "./Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
    toastEditErrorMessageConfig,
    toastEditSuccessMessageConfig
} from "../../config/toastConfig";
import FormInformation from "./FormInformation";
import {ERROR_401, redirectError401Page} from "../../config/errorPage";
import {verifyPermission} from "../../helpers/permission";
import currencies from "../../constants/currencyContry";

const CurrencyForm = (props) => {
    const {id} = useParams();
    if (id) {
        if (!verifyPermission(["update-currency"], 'update-currency'))
            window.location.href = ERROR_401;
    } else {
        if (!verifyPermission(["store-currency"], 'store-currency'))
            window.location.href = ERROR_401;
    }

    const listCurrency = currencies;
    const [currency, setCurrency] = useState({value: "", label: ""});

    const defaultData = {
        name: "",
        iso_code: "",
    };
    const defaultError = {
        name: [],
        iso_code: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        async function fetchData () {
            if (id) {
                axios.get(`${appConfig.apiDomaine}/currencies/${id}`)
                    .then(response => {
                        const newData = {
                            name: response.data.name["fr"],
                            iso_code: response.data.iso_code
                        };
                        setData(newData);
                    })
                    .catch(error => {
                        console.log("Something is wrong");
                    })
                ;
            }
        }
        fetchData();
    }, []);

    const onChangeCurrency = (selected) => {
        setCurrency(selected);
        const newData = {...data};
        newData.iso_code = selected.iso_code;
        newData.name = selected.label;
        setData(newData);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);
        if (id) {
            axios.put(`${appConfig.apiDomaine}/currencies/${id}`, data)
                .then(response => {
                    setStartRequest(false);
                    setCurrency({value: "", label: ""});
                    setError(defaultError);
                    ToastBottomEnd.fire(toastEditSuccessMessageConfig);
                })
                .catch(errorRequest => {
                    setStartRequest(false);
                    setError({...defaultError, ...errorRequest.response.data.error});
                    ToastBottomEnd.fire(toastEditErrorMessageConfig);
                })
            ;
        } else {
            axios.post(`${appConfig.apiDomaine}/currencies`, data)
                .then(response => {
                    setStartRequest(false);
                    setError(defaultError);
                    setData(defaultData);
                    ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                })
                .catch(errorRequest => {
                    redirectError401Page(errorRequest.response.data.code);
                    setStartRequest(false);
                    setError({...defaultError, ...errorRequest.response.data.error});
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
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <Link to="/settings/unit_type" className="kt-subheader__breadcrumbs-link">
                                    Type d'unité
                                </Link>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link">
                                    {
                                        id ? "Modification" : "Ajout"
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
                                                id ? "Modification de la devise" : "Ajout de la devise"
                                            }
                                        </h3>
                                    </div>
                                </div>

                                <form method="POST" className="kt-form">
                                    <div className="kt-form kt-form--label-right">
                                        <div className="kt-portlet__body">
                                            <FormInformation information={"The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes."}/>

                                            <div className={error.name.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="name">Selectionnez la {id ? "nouvelle" : ""} devise</label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <Select
                                                        value={currency}
                                                        onChange={onChangeCurrency}
                                                        options={listCurrency}
                                                    />
                                                </div>
                                            </div>

                                            <div className={error.name.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="name">Nom de la devise</label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <input
                                                        disabled={true}
                                                        id="name"
                                                        type="text"
                                                        className={error.name.length ? "form-control is-invalid" : "form-control"}
                                                        placeholder="Veillez entrez le nom de la devise"
                                                        value={data.name}
                                                    />
                                                    {
                                                        error.name.length ? (
                                                            error.name.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>
                                            </div>

                                            <div className={error.iso_code.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="iso_code">ISO code de la devise</label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <input
                                                        disabled={true}
                                                        id="iso_code"
                                                        type="text"
                                                        className={error.iso_code.length ? "form-control is-invalid" : "form-control"}
                                                        placeholder="Veillez entrer l'iso code"
                                                        value={data.iso_code}
                                                    />
                                                    {
                                                        error.iso_code.length ? (
                                                            error.iso_code.map((error, index) => (
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
                                                        <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-primary">Envoyer</button>
                                                    ) : (
                                                        <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                                            Chargement...
                                                        </button>
                                                    )
                                                }
                                                {
                                                    !startRequest ? (
                                                        <Link to="/settings/currencies" className="btn btn-secondary mx-2">
                                                            Quitter
                                                        </Link>
                                                    ) : (
                                                        <Link to="/settings/currencies" className="btn btn-secondary mx-2" disabled>
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
        id ?
            verifyPermission(["update-currency"], 'update-currency') ? (
                printJsx()
            ) : ""
            : verifyPermission(["store-currency"], 'store-currency') ? (
                printJsx()
            ) : ""
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
    };
};

export default connect(mapStateToProps)(CurrencyForm);
