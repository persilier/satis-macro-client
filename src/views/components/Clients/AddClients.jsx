import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Link
} from "react-router-dom";
import {ToastBottomEnd} from "../Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
    toastErrorMessageWithParameterConfig
} from "../../../config/toastConfig";
import appConfig from "../../../config/appConfig";
import TagsInput from 'react-tagsinput'
import Select from "react-select";
import {formatSelectOption} from '../../../helper/function';
import IdentiteForm from "../IdentitéForm";
import {connect} from "react-redux"


const AddClients = (props) => {

    const defaultData = {
        institutions_id: "",
        account_number: [],
        units_id: "",
        type_clients_id: "",
        category_clients_id: "",
    };
    const defaultError = {
        institutions_id: [],
       account_number: [],
        units_id: [],
        type_clients_id: [],
        category_clients_id: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);
    const [institutionData, setInstitutionData] = useState(undefined);
    const [institution, setInstitution] = useState([]);
    const [unitData, setUnitData] = useState(undefined);
    const [unit, setUnit] = useState([]);
    const [typeClient, setTypeClient] = useState(undefined);
    const [type, setType] = useState([]);
    const [categoryClient, setCategoryClient] = useState(undefined);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        axios.get(appConfig.apiDomaine + '/institutions')
            .then(response => {
                console.log(response.data, "RESPONSE");
                setInstitutionData(response.data.data)
            });
    }, []);

    const onChangeInstitution = (selected) => {
        const newData = {...data};
        newData.institutions_id = selected.value;
        setInstitution(selected);
        setData(newData);
        axios.get(appConfig.apiDomaine + '/clients/create', {params: {institution: newData.institutions_id}})
            .then(response => {
                setUnitData(response.data.units);

                setTypeClient(response.data.type_clients);
                setCategoryClient(response.data.category_clients);
            })

    };
    const onChangeUnite = (selected) => {
        const newData = {...data};
        newData.units_id = selected.value;
        setUnit(selected);
        setData(newData);
    };
    const onChangeAccount = (account) => {
        const newData = {...data};
        newData.account_number = account;
        setData(newData);
        {
            console.log(newData, 'ACCOUNT')
        }
    };

    const onChangeCategoryClient = (selected) => {
        const newData = {...data};
        newData.category_clients_id = selected.value;
        setCategory(selected);
        setData(newData);
    };
    const onChangeTypeClient = (selected) => {
        const newData = {...data};
        newData.type_clients_id = selected.value;
        setType(selected);
        setData(newData);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        {console.log(props.identite, 'DISPATCH')}

        const formData= {...props.identite,...data};

        {console.log(formData, 'FORMDATA')}
        setStartRequest(true);
        axios.post(appConfig.apiDomaine + `/clients`, formData)
            .then(response => {
                setStartRequest(false);
                setError(defaultError);
                setData(defaultData);
                ToastBottomEnd.fire(toastAddSuccessMessageConfig);
            })
            .catch(async (errorRequest) => {

                console.log(errorRequest.response.data.identite, 'ERROR');

                if (errorRequest.response.data.identite) {
                    await axios.post(appConfig.apiDomaine + `/identites/${errorRequest.response.data.identite.id}/client`, data)
                        .then(response => {
                            setStartRequest(false);
                            setError(defaultError);
                            setData(defaultData);
                            ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                        })
                } else if (errorRequest.response.data.client) {
                    setStartRequest(false);
                    ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(
                        errorRequest.response.data.client.identite.lastname + " " + errorRequest.response.data.client.identite.firstname + ": " + errorRequest.response.data.message)
                    );
                } else {
                    setStartRequest(false);
                    setError({...defaultError, ...errorRequest.response.data.error});
                    ToastBottomEnd.fire(toastAddErrorMessageConfig);
                }
            });
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
                            <div className="dropdown dropdown-inline" data-toggle="kt-tooltip" title="Quick actions"
                                 data-placement="left">
                                <a href="#" className="btn btn-icon" data-toggle="dropdown" aria-haspopup="true"
                                   aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                        <g fill="none" fill-rule="evenodd">
                                            <path d="M0 0h24v24H0z"/>
                                            <path
                                                d="M5.857 2h7.88a1.5 1.5 0 01.968.355l4.764 4.029A1.5 1.5 0 0120 7.529v12.554c0 1.79-.02 1.917-1.857 1.917H5.857C4.02 22 4 21.874 4 20.083V3.917C4 2.127 4.02 2 5.857 2z"
                                                fill="#000" fill-rule="nonzero" opacity=".3"/>
                                            <path
                                                d="M11 14H9a1 1 0 010-2h2v-2a1 1 0 012 0v2h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2z"
                                                fill="#000"/>
                                        </g>
                                    </svg>
                                </a>
                                <div className="dropdown-menu dropdown-menu-fit dropdown-menu-md dropdown-menu-right">
                                    <ul className="kt-nav">
                                        <li className="kt-nav__head">
                                            Add anything or jump to:
                                            <i className="flaticon2-information" data-toggle="kt-tooltip"
                                               data-placement="right" title="Click to learn more..."/>
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
                                            <a className="btn btn-clean btn-bold btn-sm" href="#"
                                               data-toggle="kt-tooltip" data-placement="right"
                                               title="Click to learn more...">Learn more</a>
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
                                        Ajout de Clients
                                    </h3>
                                </div>
                            </div>

                            <form method="POST" className="kt-form">

                                <div className="kt-portlet">

                                            <IdentiteForm/>

                                    <div className="kt-portlet__body">
                                        <div className="kt-section kt-section--first">
                                            <h5 className="kt-section__title kt-section__title-lg">
                                                Informations Techniques
                                            </h5>
                                            <div className="form-group row">
                                                <div className={error.institutions_id.length ? "col validated" : "col"}>
                                                    <label htmlFor="exampleSelect1">Institution</label>
                                                    {institutionData ?
                                                        (
                                                            <Select
                                                                value={institution}
                                                                onChange={onChangeInstitution}
                                                                options={formatSelectOption(institutionData, "name", false)}
                                                            />
                                                        ) : (<select name="institution"
                                                                     className={error.institutions_id.length ? "form-control is-invalid" : "form-control"}
                                                                     id="institution">
                                                            <option value=""></option>
                                                        </select>)
                                                    }
                                                    {
                                                        error.institutions_id.length ? (
                                                            error.institutions_id.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>
                                                <div className={error.units_id.length ? "col validated" : "col"}>
                                                    <label htmlFor="exampleSelect1">Unité</label>
                                                    {unitData ? (
                                                        <Select
                                                            value={unit}
                                                            onChange={onChangeUnite}
                                                            options={formatSelectOption(unitData, 'name', 'fr')}
                                                        />
                                                    ) : (<select name="unit"
                                                                 className={error.units_id.length ? "form-control is-invalid" : "form-control"}
                                                                 id="unit">
                                                        <option value=""></option>
                                                    </select>)
                                                    }

                                                    {
                                                        error.units_id.length ? (
                                                            error.units_id.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className={error.type_clients_id.length ? "col validated" : "col"}>
                                                    <label htmlFor="exampleSelect1">Type Client</label>
                                                    {typeClient ? (
                                                        <Select
                                                            value={type}
                                                            onChange={onChangeTypeClient}
                                                            options={formatSelectOption(typeClient, 'name', 'fr')}
                                                        />
                                                    ) : (<select name="unit"
                                                                 className={error.type_clients_id.length ? "form-control is-invalid" : "form-control"}
                                                                 id="typeClient">
                                                        <option value=""></option>
                                                    </select>)
                                                    }

                                                    {
                                                        error.type_clients_id.length ? (
                                                            error.type_clients_id.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>

                                                <div
                                                    className={error.category_clients_id.length ? "col validated" : "col"}>
                                                    <label htmlFor="exampleSelect1">Catégorie Client</label>

                                                    {categoryClient ? (
                                                        <Select
                                                            value={category}
                                                            onChange={onChangeCategoryClient}
                                                            options={formatSelectOption(categoryClient, 'name', 'fr')}
                                                        />
                                                    ) : (<select name="unit"
                                                                 className={error.category_clients_id.length ? "form-control is-invalid" : "form-control"}
                                                                 id="category">
                                                        <option value=""></option>
                                                    </select>)
                                                    }

                                                    {
                                                        error.category_clients_id.length ? (
                                                            error.category_clients_id.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>
                                            </div>

                                            <div
                                                className={error.account_number.length ? "form-group validated" : "form-group"}>
                                                <label htmlFor="account">Numero de compte</label>
                                                <TagsInput
                                                    value={data.account_number}
                                                    onChange={onChangeAccount}/>
                                                {
                                                    error.account_number.length ? (
                                                        error.account_number.map((error, index) => (
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
                                <div className="kt-portlet__foot">
                                    <div className="kt-form__actions text-right">
                                        {
                                            !startRequest ? (
                                                <button type="submit" onClick={(e) => onSubmit(e)}
                                                        className="btn btn-primary">Envoyer</button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                                    type="button" disabled>
                                                    Loading...
                                                </button>
                                            )
                                        }
                                        {
                                            !startRequest ? (
                                                <Link to="/settings/clients" className="btn btn-secondary mx-2">
                                                    Quitter
                                                </Link>
                                            ) : (
                                                <Link to="/settings/clients" className="btn btn-secondary mx-2"
                                                      disabled>
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
const mapStateToProps= state=>{
    return{
        identite:state.identite
    }
};
export default connect(mapStateToProps)(AddClients);
