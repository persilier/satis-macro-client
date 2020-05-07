import React, {useState, useEffect} from "react";
import axios from "axios";
import {
    useParams,
    Link
} from "react-router-dom";
import {Multiselect} from "multiselect-react-dropdown";
import {ToastBottomEnd} from "./Toast";
import {toastEditErrorMessageConfig, toastEditSuccessMessageConfig} from "../../config/toastConfig";
import appConfig from "../../config/appConfig";

const PositionEditForm = () => {
    const [selectedValues, setSelectedValues] = useState([]);
    const [institutions, setInstitutions] = useState([]);

    const {id} = useParams();
    const defaultData = {
        name: "",
        description: "",
        institutions: institutions.length ? institutions[0].id : ""
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
    };

    return (
        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            Base controls
                        </h3>
                        <span className="kt-subheader__separator kt-hidden"/>
                        <div className="kt-subheader__breadcrumbs">
                            <a href="#" className="kt-subheader__breadcrumbs-home">
                                <i className="flaticon2-shelter"/>
                            </a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                Forms
                            </a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                Form Controls </a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                Base Inputs
                            </a>
                        </div>
                    </div>
                    <div className="kt-subheader__toolbar">
                        <div className="kt-subheader__wrapper">
                            <a href="#" className="btn kt-subheader__btn-primary">
                                Actions &nbsp;
                            </a>
                            <div className="dropdown dropdown-inline" data-toggle="kt-tooltip" title="Quick actions" data-placement="left">
                                <a href="#" className="btn btn-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"/><path d="M5.857 2h7.88a1.5 1.5 0 01.968.355l4.764 4.029A1.5 1.5 0 0120 7.529v12.554c0 1.79-.02 1.917-1.857 1.917H5.857C4.02 22 4 21.874 4 20.083V3.917C4 2.127 4.02 2 5.857 2z" fill="#000" fill-rule="nonzero" opacity=".3"/><path d="M11 14H9a1 1 0 010-2h2v-2a1 1 0 012 0v2h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2z" fill="#000"/></g></svg>
                                </a>
                                <div className="dropdown-menu dropdown-menu-fit dropdown-menu-md dropdown-menu-right">
                                    <ul className="kt-nav">
                                        <li className="kt-nav__head">
                                            Add anything or jump to:
                                            <i className="flaticon2-information" data-toggle="kt-tooltip" data-placement="right" title="Click to learn more..."/>
                                        </li>
                                        <li className="kt-nav__separator"/>
                                        <li className="kt-nav__item">
                                            <a href="#" className="kt-nav__link">
                                                <i className="kt-nav__link-icon flaticon2-drop"/>
                                                <span className="kt-nav__link-text">Order</span>
                                            </a>
                                        </li>
                                        <li className="kt-nav__item">
                                            <a href="#" className="kt-nav__link">
                                                <i className="kt-nav__link-icon flaticon2-calendar-8"/>
                                                <span className="kt-nav__link-text">Ticket</span>
                                            </a>
                                        </li>
                                        <li className="kt-nav__item">
                                            <a href="#" className="kt-nav__link">
                                                <i className="kt-nav__link-icon flaticon2-telegram-logo"/>
                                                <span className="kt-nav__link-text">Goal</span>
                                            </a>
                                        </li>
                                        <li className="kt-nav__item">
                                            <a href="#" className="kt-nav__link">
                                                <i className="kt-nav__link-icon flaticon2-new-email"/>
                                                <span className="kt-nav__link-text">Support Case</span>
                                                <span className="kt-nav__link-badge">
                                                    <span className="kt-badge kt-badge--success">5</span>
                                                </span>
                                            </a>
                                        </li>
                                        <li className="kt-nav__separator"/>
                                        <li className="kt-nav__foot">
                                            <a className="btn btn-label-brand btn-bold btn-sm" href="#">Upgrade plan</a>
                                            <a className="btn btn-clean btn-bold btn-sm" href="#" data-toggle="kt-tooltip" data-placement="right" title="Click to learn more...">Learn more</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
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
                                        Modification de la position
                                    </h3>
                                </div>
                            </div>

                            <form method="POST" className="kt-form">
                                <div className="kt-form kt-form--label-right">
                                    <div className="kt-portlet__body">
                                        <div className="form-group form-group-last">
                                            <div className="alert alert-secondary" role="alert">
                                                <div className="alert-icon">
                                                    <i className="flaticon-warning kt-font-brand"/>
                                                </div>
                                                <div className="alert-text">
                                                    The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes.
                                                </div>
                                            </div>
                                        </div>

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
    );
};

export default PositionEditForm;
