import React, {useState, useEffect} from "react";
import axios from "axios";
import {
    useParams,
    Link
} from "react-router-dom";
import {connect} from "react-redux";
import {ToastBottomEnd} from "./Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
    toastEditErrorMessageConfig,
    toastEditSuccessMessageConfig
} from "../../config/toastConfig";
import appConfig from "../../config/appConfig";
import Select from "react-select";
import {formatSelectOption} from "../../helpers/function";
import FormInformation from "./FormInformation";

const ClaimCategoryForm = (props) => {
    const {id} = useParams();
    const [severityLevels, setSeverityLevels] = useState([]);
    const [severityLevel, setSeverityLevel] = useState({});
    const defaultData = {
        name: "",
        description: "",
        severity_levels_id: "",
        time_limit: "",
    };
    const defaultError = {
        name: [],
        description: [],
        severity_levels_id: [],
        time_limit: []
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        if (id) {
            axios.get(`${appConfig.apiDomaine}/claim-categories/${id}/edit`)
                .then(response => {
                    console.log(response.data);
                    const newData = {
                        name: response.data.claimCategory.name.fr,
                        description: response.data.claimCategory.description.fr,
                        severity_levels_id: response.data.claimCategory.severity_levels_id,
                        time_limit: response.data.claimCategory.time_limit
                    };
                    setSeverityLevel({value: response.data.claimCategory.severity_levels_id, label: response.data.claimCategory.severity_level.name[props.language.languageSelected]});
                    setSeverityLevels(response.data.severityLevels);
                    setData(newData);
                })
                .catch(error => {
                    console.log("Something is wrong");
                })
            ;
        } else {
            axios.get(`${appConfig.apiDomaine}/severity-levels`)
                .then(response => {
                    setSeverityLevels(response.data.data);
                })
                .catch(error => {
                    console.log("Something is wrong");
                })
            ;
        }
    }, []);

    const onChangeName = (e) => {
        const newData = {...data};
        newData.name = e.target.value;
        setData(newData);
    };

    const onChangeTimeLimit = (e) => {
        const newData = {...data};
        newData.time_limit = e.target.value;
        setData(newData);
    };

    const onChangeSeverityLevel = (selected) => {
        const newData = {...data};
        newData.severity_levels_id = selected.value;
        setSeverityLevel(selected);
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
        if (id) {
            axios.put(`${appConfig.apiDomaine}/claim-categories/${id}`, data)
                .then(response => {
                    setStartRequest(false);
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
            axios.post(`${appConfig.apiDomaine}/claim-categories`, data)
                .then(response => {
                    setStartRequest(false);
                    setError(defaultError);
                    setData(defaultData);
                    ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                })
                .catch(errorRequest => {
                    setStartRequest(false);
                    setError({...defaultError, ...errorRequest.response.data.error});
                    ToastBottomEnd.fire(toastAddErrorMessageConfig);
                })
            ;
        }
    };

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
                            <a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <Link to="/settings/claim_categories" className="kt-subheader__breadcrumbs-link">
                                Catégorie de plainte
                            </Link>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link">
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
                                            id ? "Modification de catégorie de plainte" : "Ajout de catégorie de plainte"
                                        }
                                    </h3>
                                </div>
                            </div>

                            <form method="POST" className="kt-form">
                                <div className="kt-form kt-form--label-right">
                                    <div className="kt-portlet__body">
                                        <FormInformation information={"The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes."}/>

                                        <div className={error.name.length ? "form-group row validated" : "form-group row"}>
                                            <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="name">Nom de la catégorie</label>
                                            <div className="col-lg-9 col-xl-6">
                                                <input
                                                    id="name"
                                                    type="text"
                                                    className={error.name.length ? "form-control is-invalid" : "form-control"}
                                                    placeholder="Veillez entrer le nom de la catégorie"
                                                    value={data.name}
                                                    onChange={(e) => onChangeName(e)}
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

                                        <div className={error.name.length ? "form-group row validated" : "form-group row"}>
                                            <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="timeLimite">Limitation de temps</label>
                                            <div className="col-lg-9 col-xl-6">
                                                <input
                                                    id="timeLimite"
                                                    type="number"
                                                    className={error.time_limit.length ? "form-control is-invalid" : "form-control"}
                                                    placeholder="Veillez entrer la limitation de temps"
                                                    value={data.time_limit}
                                                    onChange={(e) => onChangeTimeLimit(e)}
                                                />
                                                {
                                                    error.time_limit.length ? (
                                                        error.time_limit.map((error, index) => (
                                                            <div key={index} className="invalid-feedback">
                                                                {error}
                                                            </div>
                                                        ))
                                                    ) : ""
                                                }
                                            </div>
                                        </div>

                                        <div className={error.severity_levels_id.length ? "form-group row validated" : "form-group row"}>
                                            <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="timeLimite">Limitation de temps</label>
                                            <div className="col-lg-9 col-xl-6">
                                                <Select
                                                    value={severityLevel}
                                                    onChange={onChangeSeverityLevel}
                                                    options={formatSelectOption(severityLevels, "name", "fr")}
                                                />
                                                {
                                                    error.severity_levels_id.length ? (
                                                        error.severity_levels_id.map((error, index) => (
                                                            <div key={index} className="invalid-feedback">
                                                                {error}
                                                            </div>
                                                        ))
                                                    ) : ""
                                                }
                                            </div>
                                        </div>

                                        <div className={error.description.length ? "form-group row validated" : "form-group row"}>
                                            <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="description">La description</label>
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
                                                    <Link to="/settings/claim_categories" className="btn btn-secondary mx-2">
                                                        Quitter
                                                    </Link>
                                                ) : (
                                                    <Link to="/settings/claim_categories" className="btn btn-secondary mx-2" disabled>
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

const mapDispatchToProps = (state) => {
    return {
        language: state.language
    }
};

export default connect(mapDispatchToProps)(ClaimCategoryForm);
