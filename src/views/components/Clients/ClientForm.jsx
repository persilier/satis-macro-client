import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Link,
    useParams
} from "react-router-dom";
import {ToastBottomEnd} from "../Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
    toastErrorMessageWithParameterConfig,
} from "../../../config/toastConfig";
import appConfig from "../../../config/appConfig";
import TagsInput from 'react-tagsinput';
import '../staff/react-tagsinput.css'
import IdentiteForm from "../IdentitéForm";
import Select from "react-select";
import {formatSelectOption} from "../../../helpers/function";
import {connect} from "react-redux";
import {addIdentite} from "../../../store/actions/IdentiteAction";

const EditClients = (props) => {
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
    const [identity, setIdentity] = useState(undefined);
    const [institutionData, setInstitutionData] = useState(undefined);
    const [unitData, setUnitData] = useState(undefined);
    const [typeClient, setTypeClient] = useState(undefined);
    const [categoryClient, setCategoryClient] = useState(undefined);
    const [institution, setInstitution] = useState([]);
    const [unit, setUnit] = useState([]);
    const [type, setType] = useState([]);
    const [category, setCategory] = useState([]);
    const {editclientid} = useParams();

    useEffect(() => {
        axios.get(appConfig.apiDomaine + '/clients/create')
            .then(response => {
                setUnitData(response.data.units);
                setInstitutionData(response.data.institutions);
                setTypeClient(response.data.type_clients);
                setCategoryClient(response.data.category_clients);
            });
        if (editclientid) {
            axios.get(appConfig.apiDomaine + `/clients/${editclientid}`)
                .then(response => {

                    const newClient = {
                        account_number: response.data.account_number,
                        units_id: response.data.unit.id,
                        type_clients_id: response.data.type_client.id,
                        category_clients_id: response.data.category_client.id,
                        institutions_id: response.data.institution.id,
                    };
                    setData(newClient);
                    const newIdentity = {
                        firstname: response.data.identite.firstname,
                        lastname: response.data.identite.lastname,
                        sexe: response.data.identite.sexe,
                        telephone: response.data.identite.telephone,
                        email: response.data.identite.email,
                        ville: response.data.identite.ville === null ? "" : response.data.identite.ville,
                        id_card: response.data.identite.id_card ? response.data.identite.id_card : [],
                    };
                    setIdentity(newIdentity);
                    props.addIdentite(newIdentity);
                    setInstitution({value: response.data.institution.id, label: response.data.institution.name});
                    setUnit({value: response.data.unit.id, label: response.data.unit.name});
                    setType({value: response.data.type_client.id, label: response.data.type_client.name});
                    setCategory({value: response.data.category_client.id, label: response.data.category_client.name});

                });
        }
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
        setStartRequest(true);
        {
            console.log(props.identite, 'DISPATCH')
        }

        const formData = {...props.identite, ...data};
        {
            console.log(formData, 'FORM')
        }
        if (editclientid) {
            axios.put(appConfig.apiDomaine + `/clients/${editclientid}`, formData)
                .then(response => {
                    setStartRequest(false);
                    setError(defaultError);
                    setData(defaultData);
                    ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                })
                .catch((errorRequest) => {

                    setStartRequest(false);
                    setError({...defaultError, ...errorRequest.response.data.error});
                    // ToastBottomEnd.fire(toastAddErrorMessageConfig);
                    ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(errorRequest.response.data.error));
                })
            ;
        } else {
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
                            <a href="#" className="kt-subheader__breadcrumbs-home"><i
                                className="flaticon2-shelter"/></a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <Link to="/settings/clients" className="kt-subheader__breadcrumbs-link">
                                Client
                            </Link>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link">
                                {
                                    editclientid ? "Modification" : "Ajout"
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
                                            editclientid ?
                                                "Modification de Clients" : " Ajout de Clients"
                                        }
                                    </h3>
                                </div>
                            </div>
                            <form method="POST" className="kt-form">

                                <div className="kt-portlet">
                                    {
                                        !editclientid ? (
                                            <IdentiteForm/>
                                        ) : (
                                            (identity) ? (
                                                <IdentiteForm
                                                    getIdentite={identity}
                                                    getLoading={true}
                                                />) : (
                                                ""
                                            )

                                        )
                                    }


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
                                                    onChange={onChangeAccount}
                                                />
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
const mapStateToProps = state => {
    return {
        identite: state.identite
    }
};

export default connect(mapStateToProps, {addIdentite})(EditClients);
