import React, {useState, useEffect} from "react";
import axios from "axios";
import {
    useParams,
    Link
} from "react-router-dom";
import {Multiselect} from "multiselect-react-dropdown";
import {ToastBottomEnd} from "./Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
    toastEditErrorMessageConfig,
    toastEditSuccessMessageConfig
} from "../../config/toastConfig";
import appConfig from "../../config/appConfig";
import FormInformation from "./FormInformation";

const PositionForm = () => {
    const [selectedValues, setSelectedValues] = useState([]);
    const [institutions, setInstitutions] = useState([]);

    const {id} = useParams();
    const defaultData = {
        name: "",
        description: "",
        institutions: [],
    };
    const defaultError = {
        name: [],
        description: [],
        institutions: []
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        if (id) {
            axios.get(`${appConfig.apiDomaine}/positions/${id}/edit`)
                .then(response => {
                    const newData = {
                        name: response.data.position.name.fr,
                        description: response.data.position.description.fr,
                        institutions: reformatInstitution(formatInstitutions(response.data.position.institutions))
                    };
                    setSelectedValues(formatInstitutions(response.data.position.institutions));
                    setInstitutions(formatInstitutions(response.data.institutions));
                    setData(newData);
                })
                .catch(error => {
                    console.log("Something is wrong");
                })
            ;
        } else {
            axios.get(`${appConfig.apiDomaine}/institutions`)
                .then(response => {
                    setInstitutions(formatInstitutions(response.data.data));
                })
                .catch(error => {
                    console.log("something is wrong");
                })
            ;
        }
    }, []);

    const reformatInstitution = (listInstitutions) => {
        const newListInstitution = [];
        for (let i = 0; i<listInstitutions.length; i++)
            newListInstitution.push(listInstitutions[i].id);
        return newListInstitution;
    };

    const formatInstitutions = (listInstitutions) => {
        const newListInstitution = [];
        for (let i = 0; i<listInstitutions.length; i++)
            newListInstitution.push({id: listInstitutions[i].id, name: listInstitutions[i].name});
        return newListInstitution;
    };

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

    const getSelectedValue = (items) => {
        const newData = {...data};
        newData.institutions = [];
        for (let i = 0; i<items.length; i++)
            newData.institutions.push(items[i].id);
        setData(newData);
    };

    const onRemove = (selectedList, removedItem) => {
        const newData = {...data};
        newData.institutions = [];
        for (let i = 0; i<selectedList.length; i++)
            newData.institutions.push(selectedList[i].id);
        setData(newData);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);
        if (id) {
            axios.put(`${appConfig.apiDomaine}/positions/${id}`, data)
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
            axios.post(`${appConfig.apiDomaine}/positions`, data)
                .then(response => {
                    setStartRequest(false);
                    setSelectedValues([]);
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

    const permission = "macroPermission";

    return (
        permission === "macroPermission" || permission === "hubPermission" || permission === "proPermission" ? (
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
                                <Link to="/settings/positions" className="kt-subheader__breadcrumbs-link">
                                    Postes
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
                                                id ? "Modification de la position" : "Ajout de la position"
                                            }
                                        </h3>
                                    </div>
                                </div>

                                <form method="POST" className="kt-form">
                                    <div className="kt-form kt-form--label-right">
                                        <div className="kt-portlet__body">
                                            <FormInformation information={"The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes."}/>

                                            <div className={error.name.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="name">Nom du poste</label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <input
                                                        id="name"
                                                        type="text"
                                                        className={error.name.length ? "form-control is-invalid" : "form-control"}
                                                        placeholder="Veillez entrer le nom du poste"
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

                                            <div className={error.institutions.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="institution">Institutions</label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <Multiselect
                                                        options={institutions}
                                                        displayValue="name"
                                                        onRemove={onRemove}
                                                        selectedValues={selectedValues}
                                                        onSelect={getSelectedValue}
                                                    />
                                                    {
                                                        error.institutions.length ? (
                                                            error.institutions.map((error, index) => (
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
                                                        <Link to="/settings/positions" className="btn btn-secondary mx-2">
                                                            Quitter
                                                        </Link>
                                                    ) : (
                                                        <Link to="/settings/positions" className="btn btn-secondary mx-2" disabled>
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
        ) : ""
    );
};

export default PositionForm;
