import React, {useState, useEffect} from "react";
import axios from "axios";
import {
    Link
} from "react-router-dom";
import TagsInput from 'react-tagsinput'
import {ToastBottomEnd} from "../Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
    toastErrorMessageWithParameterConfig
} from "../../../config/toastConfig";
import {formatInstitutions} from "../../../helper/institution";
import {formatUnits} from "../../../helper/unit";
import {formatPositions} from "../../../helper/position";
import apiConfig from "../../../config/apiConfig";
import './react-tagsinput.css';
import ConfirmSaveForm from "./ConfirmSaveForm";
import Select from "react-select";
import {formatSelectOption} from "../../../helper/function";

const StaffAddForm = () => {
    const [units, setUnits] = useState([]);
    const [positions, setPositions] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [institution_id, setInstitution_id] = useState("");
    const [foundData, setFoundData] = useState({});
    const [institution, setInstitution] = useState({});
    const [unit, setUnit] = useState({});
    const [position, setPosition] = useState({});

    const defaultData = {
        firstname: "",
        lastname: "",
        sexe: "",
        telephone: [],
        email: [],
        ville: "",
        unit_id: "",
        position_id: "",
    };

    const defaultError = {
        name: [],
        firstname: [],
        lastname: [],
        sexe: [],
        telephone: [],
        email: [],
        ville: [],
        unit_id: [],
        position_id: [],
    };
    const [data, setData] = useState(defaultData);

    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        axios.get(`${apiConfig.baseUrl}/institutions`)
            .then(response => {
                const newData = {...data};
                setInstitutions(formatInstitutions(response.data.data));
                setData(newData);
            })
            .catch(error => {
                console.log("something is wrong");
            })
        ;
    }, []);

    const onChangeFirstName = (e) => {
        const newData = {...data};
        newData.firstname = e.target.value;
        setData(newData);
    };

    const onChangeLastName = (e) => {
        const newData = {...data};
        newData.lastname = e.target.value;
        setData(newData);
    };

    const onChangeSexe = (e) => {
        const newData = {...data};
        newData.sexe = e.target.value;
        setData(newData);
    };

    const onChangeVille = (e) => {
        const newData = {...data};
        newData.ville = e.target.value;
        setData(newData);
    };

    const onChangeTelephone = (tel) => {
        const newData = {...data};
        newData.telephone = tel;
        setData(newData);
    };

    const onChangeEmail = (mail) => {
        const newData = {...data};
        newData.email = mail;
        setData(newData);
    };

    const onChangeUnit = (selected) => {
        const newData = {...data};
        newData.unit_id = selected.value;
        setUnit(selected);
        setData(newData);
    };

    const onChangePosition = (selected) => {
        const newData = {...data};
        newData.position_id = selected.value;
        setPosition(selected);
        setData(newData);
    };

    const resetUnitsAndPositions = () => {
        const newData = {...data};
        newData.position_id = "";
        newData.unit_id = "";
        setUnit({});
        setPosition({});
        setData(newData);
    };

    const onChangeInstitution = (selected) => {
        setInstitution_id(selected.value);
        setInstitution(selected);
        axios.get(`${apiConfig.baseUrl}/institutions/${selected.value}/positions-units`)
            .then(response => {
                resetUnitsAndPositions();
                setUnits(formatUnits(response.data.units));
                setPositions(formatPositions(response.data.positions));
            })
            .catch(errorRequest => {
                ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(errorRequest.response.data.error));
            })
        ;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);
        axios.post(`${apiConfig.baseUrl}/staff`, data)
            .then(response => {
                setStartRequest(false);
                setError(defaultError);
                setData(defaultData);
                ToastBottomEnd.fire(toastAddSuccessMessageConfig);
            })
            .catch(async (errorRequest) => {
                if (errorRequest.response.data.identite)
                {
                    await setFoundData(errorRequest.response.data);
                    await document.getElementById("confirmSaveForm").click();
                    setStartRequest(false);
                    setError(defaultError);
                    setData(defaultData);
                } else if (errorRequest.response.data.staff) {
                    setStartRequest(false);
                    ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(
                        errorRequest.response.data.staff.identite.lastname+" "+errorRequest.response.data.staff.identite.firstname+": "+errorRequest.response.data.message)
                    );
                } else {
                    setStartRequest(false);
                    setError({...defaultError, ...errorRequest.response.data.error});
                    ToastBottomEnd.fire(toastAddErrorMessageConfig);
                }
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
                                        Ajout d'un Agent
                                    </h3>
                                </div>
                            </div>

                            <form method="POST" className="kt-form">
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

                                    <div className="kt-section kt-section--first">
                                        <div className="kt-section__body">
                                            <h3 className="kt-section__title kt-section__title-lg">Informations personnelles:</h3>
                                            <div className="form-group row">
                                                <div className={error.lastname.length ? "col validated" : "col"}>
                                                    <label htmlFor="lastname">Votre nom de famille</label>
                                                    <input
                                                        id="lastname"
                                                        type="text"
                                                        className={error.lastname.length ? "form-control is-invalid" : "form-control"}
                                                        placeholder="Veillez entrer le nom de famille"
                                                        value={data.lastname}
                                                        onChange={(e) => onChangeLastName(e)}
                                                    />
                                                    {
                                                        error.lastname.length ? (
                                                            error.lastname.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>

                                                <div className={error.firstname.length ? "col validated" : "col"}>
                                                    <label htmlFor="firstname">Votre prénom</label>
                                                    <input
                                                        id="firstname"
                                                        type="text"
                                                        className={error.firstname.length ? "form-control is-invalid" : "form-control"}
                                                        placeholder="Veillez entrer le prénom"
                                                        value={data.firstname}
                                                        onChange={(e) => onChangeFirstName(e)}
                                                    />
                                                    {
                                                        error.firstname.length ? (
                                                            error.firstname.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className={error.firstname.length ? "form-group col validated" : "form-group col"}>
                                                    <label htmlFor="sexe">Votre sexe</label>
                                                    <select
                                                        id="sexe"
                                                        className={error.sexe.length ? "form-control is-invalid" : "form-control"}
                                                        value={data.sexe}
                                                        onChange={(e) => onChangeSexe(e)}
                                                    >
                                                        <option value="" disabled={true}>Veillez choisir le Sexe</option>
                                                        <option value="F">Féminin</option>
                                                        <option value="M">Masculin</option>
                                                    </select>
                                                    {
                                                        error.sexe.length ? (
                                                            error.sexe.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className={error.telephone.length ? "col validated" : "col"}>
                                                    <label htmlFor="telephone">Votre Téléphone(s)</label>
                                                    <TagsInput value={data.telephone} onChange={onChangeTelephone} />
                                                    {
                                                        error.telephone.length ? (
                                                            error.telephone.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>

                                                <div className={error.email.length ? "col validated" : "col"}>
                                                    <label htmlFor="email">Votre Email(s)</label>
                                                    <TagsInput value={data.email} onChange={onChangeEmail} />
                                                    {
                                                        error.email.length ? (
                                                            error.email.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>

                                                <div className={error.ville.length ? "col validated" : "col"}>
                                                    <label htmlFor="ville">Votre ville</label>
                                                    <input
                                                        id="ville"
                                                        type="text"
                                                        className={error.ville.length ? "form-control is-invalid" : "form-control"}
                                                        placeholder="Veillez entrer votre ville"
                                                        value={data.ville}
                                                        onChange={(e) => onChangeVille(e)}
                                                    />
                                                    {
                                                        error.ville.length ? (
                                                            error.ville.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="kt-section">
                                        <div className="kt-section__body">
                                            <h3 className="kt-section__title kt-section__title-lg">Informations professionnelles:</h3>
                                            <div className={"form-group"}>
                                                <label htmlFor="institution">Institution</label>
                                                <Select
                                                    value={institution}
                                                    onChange={onChangeInstitution}
                                                    options={formatSelectOption(formatInstitutions(institutions), "name", false)}
                                                />
                                            </div>

                                            <div className={error.unit_id.length ? "form-group row validated" : "form-group row"}>
                                                <div className="col">
                                                    <label htmlFor="unit">Unité</label>
                                                    <Select
                                                        value={unit}
                                                        onChange={onChangeUnit}
                                                        options={formatSelectOption(units, "name", "fr")}
                                                    />
                                                    {
                                                        error.unit_id.length ? (
                                                            error.unit_id.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>

                                                <div className="col">
                                                    <label htmlFor="position">Position</label>
                                                    <Select
                                                        value={position}
                                                        onChange={onChangePosition}
                                                        options={formatSelectOption(positions, "name", "fr")}
                                                    />
                                                    {
                                                        error.position_id.length ? (
                                                            error.position_id.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="kt-portlet__foot">
                                    <div className="kt-form__actions">
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
                                                <Link to="/settings/staffs" className="btn btn-secondary mx-2">
                                                    Quitter
                                                </Link>
                                            ) : (
                                                <Link to="/settings/staffs" className="btn btn-secondary mx-2" disabled>
                                                    Quitter
                                                </Link>
                                            )
                                        }
                                        <button style={{display: "none"}} id="confirmSaveForm" type="button" className="btn btn-bold btn-label-brand btn-sm"
                                                data-toggle="modal" data-target="#kt_modal_4">Launch Modal
                                        </button>
                                    </div>
                                </div>
                            </form>
                            {
                                foundData.identite ? (
                                    <ConfirmSaveForm
                                        message={foundData.message}
                                        identite={foundData.identite}
                                        units={units}
                                        positions={positions}
                                        institutions={institutions}
                                        unit_id={data.unit_id}
                                        position_id={data.position_id}
                                        institution_id={institution_id}
                                    />
                                ) : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffAddForm;
