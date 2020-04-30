import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Link
} from "react-router-dom";
import {ToastBottomEnd} from "../Toast";
import {toastAddErrorMessageConfig, toastAddSuccessMessageConfig,toastErrorMessageWithParameterConfig} from "../../../config/toastConfig";
import appConfig from "../../../config/appConfig";
import TagsInput from 'react-tagsinput'

const AddClients = () => {
    const defaultData = {
        firstname: "",
        lastname: "",
        sexe: "",
        ville: "",
        telephone: [],
        institutions_id: "",
        email: [],
        account_number: [],
        units_id: "",
        type_clients_id: "",
        id_card: [],
        category_clients_id: "",
    };
    const defaultError = {
        firstname: [],
        lastname: [],
        sexe: [],
        ville: [],
        telephone: [],
        institutions_id: [],
        email: "",
        account_number: [],
        units_id: [],
        id_card: [],
        type_clients_id: [],
        category_clients_id: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);
    const [institutionData, setInstitutionData] = useState(undefined);
    const [unitData, setUnitData] = useState(undefined);
    const [typeClient, setTypeClient] = useState(undefined);
    const [categoryClient, setCategoryClient] = useState(undefined);

    useEffect(() => {
        axios.get(appConfig.apiDomaine + '/institutions')
            .then(response => {
                setInstitutionData(response.data.data)
            });


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

    const onChangePhone = (tel) => {
        const newData = {...data};
        newData.telephone = tel;
        setData(newData);
    };

    const onChangeSexe = (e) => {
        const newData = {...data};
        newData.sexe = e.target.value;
        setData(newData);
    };
    const onChangeEmail = (mail) => {
        const newData = {...data};
        newData.email = mail;
        setData(newData);
    };
    const onChangeInstitution = (e) => {
        const newData = {...data};
        newData.institutions_id = e.target.value;
        setData(newData);
        axios.get(appConfig.apiDomaine + '/clients/create', {params: {institution: newData.institutions_id}})
            .then(response => {
                setUnitData(response.data.units);
                console.log(response, 'RESPONSE');
                setTypeClient(response.data.type_clients);
                setCategoryClient(response.data.category_clients);
            })

    };
    const onChangeUnite = (e) => {
        const newData = {...data};
        newData.units_id = e.target.value;
        setData(newData);
    };
    const onChangeVille = (e) => {
        const newData = {...data};
        newData.ville = e.target.value;
        setData(newData);
    };
    const onChangeAccount = (account) => {
        const newData = {...data};
        newData.account_number = account;
        setData(newData);
        {console.log(newData, 'ACCOUNT')}
    };
    const onChangeIdCard = (card) => {
        const newData = {...data};
        newData.id_card = card;
        setData(newData);
        {console.log(newData, 'CARD')}
    };

    const onChangeCategoryClient = (e) => {
        const newData = {...data};
        newData.category_clients_id = e.target.value;
        setData(newData);
    };
    const onChangeTypeClient = (e) => {
        const newData = {...data};
        newData.type_clients_id = e.target.value;
        setData(newData);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);
        axios.post(appConfig.apiDomaine + `/clients`, data)
            .then(response => {
                setStartRequest(false);
                setError(defaultError);
                setData(defaultData);
                ToastBottomEnd.fire(toastAddSuccessMessageConfig);
            })
            .catch(async (errorRequest) => {

               console.log (errorRequest.response.data.identite, 'ERROR');

                if (errorRequest.response.data.identite)
                {
                    await axios.post(appConfig.apiDomaine + `/identites/${errorRequest.response.identite.id}/client`, data)
                        .then(response => {
                            setStartRequest(false);
                            setError(defaultError);
                            setData(defaultData);
                            ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                        })
                }else if (errorRequest.response.data.client) {
                    setStartRequest(false);
                    ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(
                        errorRequest.response.data.client.identite.lastname+" "+errorRequest.response.data.client.identite.firstname+": "+errorRequest.response.data.message)
                    );
                }
                else{
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
                                <div className="form-row" style={{margin: "20px"}}>
                                    <div className="kt-portlet col-md-6">
                                        <div className="kt-portlet__head">
                                            <div className="kt-portlet__head-label">
                                                <h3 className="kt-portlet__head-title">
                                                    Identité
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="kt-form">
                                            <div className="kt-portlet__body">
                                                <div className="kt-section kt-section--first">
                                                    <div
                                                        className={error.firstname.length ? "form-group validated" : "form-group"}>
                                                        <label htmlFor="name">le Nom</label>
                                                        <input
                                                            id="name"
                                                            type="text"
                                                            className={error.firstname.length ? "form-control is-invalid" : "form-control"}
                                                            placeholder="Veillez entrer le nom"
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

                                                    <div
                                                        className={error.lastname.length ? "form-group validated" : "form-group"}>
                                                        <label htmlFor="lastname">Le prénom'</label>
                                                        <input
                                                            id="lastname"
                                                            className={error.lastname.length ? "form-control is-invalid" : "form-control"}
                                                            placeholder="Veillez entrer l'acronyme"
                                                            type="text"
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

                                                    <div
                                                        className={error.email.length ? "form-group validated" : "form-group"}>
                                                        <label htmlFor="email">L'email</label>
                                                        <TagsInput
                                                            value={data.email}
                                                            onChange={onChangeEmail}/>

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
                                                    <div
                                                        className={error.ville.length ? "form-group validated" : "form-group"}>
                                                        <label htmlFor="ville">La ville</label>
                                                        <input
                                                            id="ville"
                                                            type="text"
                                                            className={error.ville.length ? "form-control is-invalid" : "form-control"}
                                                            placeholder="Veillez entrer la ville"
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
                                                    <div
                                                        className={error.telephone.length ? "form-group validated" : "form-group"}>
                                                        <label htmlFor="telephone">Le Téléphone</label>
                                                        <TagsInput
                                                            value={data.telephone}
                                                            onChange={onChangePhone}
                                                        />

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

                                                    <div className={error.sexe ? "form-group validated" : "form-group"}>
                                                        <label htmlFor="sexe">Sexe</label>
                                                        <select className={"form-control"}
                                                                onChange={(e) => onChangeSexe(e)}
                                                                value={data.sexe} name="sexe" id="sexe">
                                                            <option value="M">Masculin</option>
                                                            <option value="F">Féminin</option>
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
                                            </div>
                                        </div>
                                    </div>

                                    <div className="kt-portlet col-md-6">
                                        <div className="kt-portlet__head">
                                            <div className="kt-portlet__head-label">
                                                <h3 className="kt-portlet__head-title">
                                                    Informations Techniques
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="kt-form ">
                                            <div className="kt-portlet__body">
                                                <div className="kt-section kt-section--first">
                                                    <div
                                                        className={error.institutions_id.length ? "form-group validated" : "form-group"}>
                                                        <label htmlFor="exampleSelect1">Institution</label>
                                                        {institutionData ? (
                                                            <select
                                                                name="categorie"
                                                                id="categorie"
                                                                className={error.institutions_id.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.institutions_id}
                                                                onChange={(e) => onChangeInstitution(e)}>
                                                                <option value="" disabled> Sélectionnez l'institution
                                                                </option>
                                                                {institutionData.map((element, i) => (
                                                                    <option key={i}
                                                                            value={element.id}>{element.name}</option>
                                                                ))}
                                                            </select>
                                                        ) : ''
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
                                                    <div
                                                        className={error.units_id.length ? "form-group validated" : "form-group"}>
                                                        <label htmlFor="exampleSelect1">Unité</label>
                                                        {unitData ? (
                                                            <select
                                                                name="unit"
                                                                id="unit"
                                                                className={error.units_id.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.units_id}
                                                                onChange={(e) => onChangeUnite(e)}>
                                                                <option value="" disabled> Sélectionnez l'unté</option>
                                                                {unitData.map((element, i) => (
                                                                    <option key={i}
                                                                            value={element.id}>{element.name.fr}</option>
                                                                ))}
                                                            </select>
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
                                                    <div
                                                        className={error.type_clients_id.length ? "form-group validated" : "form-group"}>
                                                        <label htmlFor="exampleSelect1">Type Client</label>
                                                        {typeClient ? (
                                                            <select
                                                                name="typeClient"
                                                                id="typeClient"
                                                                className={error.type_clients_id.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.type_clients_id}
                                                                onChange={(e) => onChangeTypeClient(e)}>
                                                                <option value="" disabled> Sélectionnez le type</option>
                                                                {typeClient.map((element, i) => (
                                                                    <option key={i}
                                                                            value={element.id}>{element.name.fr}</option>
                                                                ))}
                                                            </select>
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
                                                        className={error.category_clients_id.length ? "form-group validated" : "form-group"}>
                                                        <label htmlFor="exampleSelect1">Catégorie Client</label>

                                                        {categoryClient ? (
                                                            <select
                                                                name="category"
                                                                id="category"
                                                                className={error.category_clients_id.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.category_clients_id}
                                                                onChange={(e) => onChangeCategoryClient(e)}>
                                                                <option value="" disabled> Sélectionnez la catégorie
                                                                </option>
                                                                {categoryClient.map((element, i) => (
                                                                    <option key={i}
                                                                            value={element.id}>{element.name.fr}</option>
                                                                ))}
                                                            </select>
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
                                                    <div className={error.id_card.length ? "form-group validated" : "form-group"}>
                                                        <label htmlFor="account">Numero Carte d'Identité</label>
                                                        <TagsInput
                                                            value={data.id_card}
                                                            onChange={onChangeIdCard}/>
                                                        {
                                                            error.id_card.length ? (
                                                                error.id_card.map((error, index) => (
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
                                </div>
                                <div className="kt-portlet__foot">
                                    <div className="kt-form__actions">
                                        {
                                            !startRequest ? (
                                                <button type="submit" onClick={(e) => onSubmit(e)}
                                                        className="btn btn-primary">Submit</button>
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
                                                    Cancel
                                                </Link>
                                            ) : (
                                                <Link to="/settings/clients" className="btn btn-secondary mx-2"
                                                      disabled>
                                                    Cancel
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

export default AddClients;
