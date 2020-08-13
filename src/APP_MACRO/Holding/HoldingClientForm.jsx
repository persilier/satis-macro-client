import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Link,
    useParams
} from "react-router-dom";
import {ToastBottomEnd} from "../../views/components/Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig, toastEditErrorMessageConfig, toastEditSuccessMessageConfig,
    toastErrorMessageWithParameterConfig,
} from "../../config/toastConfig";
import appConfig from "../../config/appConfig";
import '../../views/components/staff/react-tagsinput.css'
import Select from "react-select";
import {formatSelectOption} from "../../helpers/function";
import {connect} from "react-redux";
import {AUTH_TOKEN} from "../../constants/token";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import TagsInput from "react-tagsinput";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;


const HoldingClientForm = (props) => {

    const {id} = useParams();

    if (!id) {
        if (!verifyPermission(props.userPermissions, 'store-client-from-any-institution'))
            window.location.href = ERROR_401;
    } else {
        if (!verifyPermission(props.userPermissions, 'update-client-from-any-institution'))
            window.location.href = ERROR_401;
    }

    const defaultData = {
        firstname: "",
        lastname: "",
        sexe: "",
        ville: "",
        telephone: [],
        email: [],
        client_id: [],
        institution_id: [],
        account_type_id: "",
        number: [],
        category_client_id: "",
    };

    const defaultError = {
        firstname: [],
        lastname: [],
        sexe: [],
        ville: [],
        telephone: [],
        email: [],
        client_id: [],
        institution_id: [],
        account_type_id: [],
        number: [],
        category_client_id: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);
    const [accountType, setAccountTypes] = useState(undefined);
    const [categoryClient, setCategoryClient] = useState(undefined);
    const [type, setType] = useState([]);
    const [category, setCategory] = useState([]);
    const [nameClient, setNameClient] = useState([]);
    const [client, setClient] = useState([]);
    const [institutionData, setInstitutionData] = useState(undefined);
    const [institution, setInstitution] = useState([]);
    const [disableInput,setDisableInput]=useState(true);

    useEffect(() => {

        axios.get(appConfig.apiDomaine + `/any/clients/create`)
            .then(response => {
                const options =
                    response.data.institutions.length ? response.data.institutions.map((institution) => ({
                        value: institution.id,
                        label: institution.name
                    })) : "";
                setInstitutionData(options);
            });
        axios.get(appConfig.apiDomaine + '/any/clients/create')
            .then(response => {
                setAccountTypes(response.data.accountTypes);
                setCategoryClient(response.data.clientCategories);
            });

        if (id) {
            axios.get(appConfig.apiDomaine + `/any/clients/${id}/edit`)
                .then(response => {
                    console.log(response.data, 'UPDATE_DATA')
                    const newClient = {
                        firstname: response.data.client_institution.client.identite.firstname,
                        lastname: response.data.client_institution.client.identite.lastname,
                        sexe: response.data.client_institution.client.identite.sexe,
                        telephone: response.data.client_institution.client.identite.telephone,
                        email: response.data.client_institution.client.identite.email,
                        institution_id: response.data.client_institution.institution_id,
                        ville: response.data.client_institution.client.identite.ville === null ? "" : response.data.client_institution.client.identite.ville,

                        number: response.data.client_institution.accounts[0].number,
                        account_type_id: response.data.client_institution.accounts[0].account_type_id,
                        category_client_id: response.data.client_institution.category_client_id,
                    };
                    setData(newClient);
                    setType({
                        value: response.data.client_institution.accounts[0].account_type.id,
                        label: response.data.client_institution.accounts[0].account_type.name.fr
                    });
                    setCategory({
                        value: response.data.client_institution.category_client?response.data.client_institution.category_client.id:"",
                        label: response.data.client_institution.category_client?response.data.client_institution.category_client.name.fr:""
                    });

                });
        }
    }, []);

    const onChangeAccountType = (selected) => {
        const newData = {...data};
        newData.account_type_id = selected.value;
        setType(selected);
        setData(newData);
    };
    const onChangeAccount = (e) => {
        const newData = {...data};
        newData.number = e.target.value;
        setData(newData);
    };

    const onChangeCategoryClient = (selected) => {
        const newData = {...data};
        newData.category_client_id = selected.value;
        setCategory(selected);
        setData(newData);
    };

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
    const onChangeTelephone = (tel) => {
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
    const onChangeVille = (e) => {
        const newData = {...data};
        newData.ville = e.target.value;
        setData(newData);
    };
    const onChangeInstitution = (selected) => {
        const newData = {...data};
        newData.institution_id = selected.value;
        setInstitution(selected);
        axios.get(appConfig.apiDomaine + `/any/clients/${newData.institution_id}/institutions`)
            .then(response => {
                console.log(response.data, "CLIENT D'UNE INSTITUTION");
                const options =
                    response.data ? response.data.map((client) => ({
                        value: client.client_id,
                        label: client.client.identite.firstname + ' ' + client.client.identite.lastname
                    })) : "";
                setNameClient(options);
            });
        setData(newData);
        setDisableInput(false)
    };
    const onChangeClient = (selected) => {
        const newData = {...data};
        newData.client_id = selected.value;
        setClient(selected);
        // setData(newData);
       if (newData.client_id){
           axios.get(`${appConfig.apiDomaine}/any/clients` + `/${newData.client_id}`)
               .then(response => {
                   console.log(response.data,"IDENTITE")
                   const newIdentity = {
                       firstname: response.data.client.identite.firstname,
                       lastname: response.data.client.identite.lastname,
                       sexe: response.data.client.identite.sexe,
                       telephone: response.data.client.identite.telephone,
                       email: response.data.client.identite.email,
                       ville: response.data.client.identite.ville === null ? "" : response.data.client.identite.ville,
                       client_id: response.data.client_id,
                       institution_id:response.data.institution_id,
                       category_client_id:response.data.category_client_id
                   };
                   setData(newIdentity);
                   setCategory({
                       value: response.data.category_client?response.data.category_client.id:"",
                       label: response.data.category_client?response.data.category_client.name.fr:""
                   });
               });
       }

    };

    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);
        // console.log(props.identite, "store_DATA");
        //
        // const formData = {...props.identite,...data};
        //
        // console.log(formData, "FORM_DATA");
        if (id) {
            axios.put(appConfig.apiDomaine + `/any/clients/${id}`, data)
                .then(response => {
                    setStartRequest(false);
                    setError(defaultError);
                    setData(defaultData);
                    ToastBottomEnd.fire(toastEditSuccessMessageConfig);
                })
                .catch((errorRequest) => {
                    setStartRequest(false);
                    setError({...defaultError, ...errorRequest.response.data.error});
                    ToastBottomEnd.fire(toastEditErrorMessageConfig);
                })
            ;
        } else {
            // console.log(props.identite.client_id, "CLIENT_ID")
            console.log(data.client_id, "CLIENT_ID")
            if (data.client_id!=="") {
                axios.post(appConfig.apiDomaine + `/any/accounts/${data.client_id}/clients`, data)
                    .then(response => {
                        setStartRequest(false);
                        setError(defaultError);
                        setData(defaultData);
                        setType({});
                        setCategory({});
                        ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                    })
                    .catch((errorRequest) => {
                        setStartRequest(false);
                        setError({...defaultError, ...errorRequest.response.data.error});
                        ToastBottomEnd.fire(toastAddErrorMessageConfig);
                    })
                ;
            } else {
                axios.post(appConfig.apiDomaine + `/any/clients`, data)
                    .then(response => {
                        setStartRequest(false);
                        setError(defaultError);
                        setData(defaultData);
                        setType({});
                        setCategory({});
                        ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                    })
                    .catch(async (errorRequest) => {

                        console.log(errorRequest.response.data.identite, 'ERROR');

                        if (errorRequest.response.data.identite) {
                            await axios.post(appConfig.apiDomaine + `/any/identites/${errorRequest.response.data.identite.id}/client`, data)
                                .then(response => {
                                    setStartRequest(false);
                                    setError(defaultError);
                                    setData(defaultData);
                                    setType({});
                                    setCategory({});
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
                                            id ?
                                                "Modification de Clients" : " Ajout de Clients"
                                        }
                                    </h3>
                                </div>
                            </div>
                            <form method="POST" className="kt-form">

                                <div className="kt-portlet">

                                    <div className="kt-portlet__body">
                                        <div className="kt-section kt-section--first">
                                            <h5 className="kt-section__title kt-section__title-lg">Identité:</h5>
                                            {!id ?
                                                <div className="form-group row">
                                                    {
                                                        verifyPermission(props.userPermissions, "store-client-from-any-institution") ?
                                                            <div
                                                                className={error.institution_id.length ? "col validated" : "col"}>
                                                                <label htmlFor="exampleSelect1"> Institution</label>
                                                                {console.log(nameClient,"NAME_CLIENT")}
                                                                {institutionData ? (
                                                                    <Select
                                                                        value={institution}
                                                                        placeholder={"Veillez selectionner l'institution"}
                                                                        onChange={onChangeInstitution}
                                                                        options={institutionData ? institutionData.map(name => name) : ''}
                                                                    />
                                                                ) : (
                                                                    <select name="institution"
                                                                            className={error.institution_id.length ? "form-control is-invalid" : "form-control"}
                                                                            id="institution">
                                                                        <option value=""/>
                                                                    </select>
                                                                )
                                                                }

                                                                {
                                                                    error.institution_id.length ? (
                                                                        error.institution_id.map((error, index) => (
                                                                            <div key={index} className="invalid-feedback">
                                                                                {error}
                                                                            </div>
                                                                        ))
                                                                    ) : ""
                                                                }
                                                            </div>
                                                            : ""
                                                    }
                                                    <div
                                                        className={error.client_id.length ? "col validated" : "col"}>
                                                        <label htmlFor="exampleSelect1"> Client</label>
                                                        {nameClient ? (
                                                            <Select
                                                                isDisabled={disableInput}
                                                                placeholder={"Veillez selectionner le client"}
                                                                value={client}
                                                                onChange={onChangeClient}
                                                                options={nameClient ? nameClient.map(name => name) : ''}
                                                            />
                                                        ) : (<select name="client"
                                                                     className={error.client_id.length ? "form-control is-invalid" : "form-control"}
                                                                     id="client">
                                                            <option value=""/>
                                                        </select>)
                                                        }

                                                        {
                                                            error.client_id.length ? (
                                                                error.client_id.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : ""
                                                        }
                                                    </div>
                                                </div>
                                                : ""
                                            }
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
                                                        disabled={props.getDisable ? props.getDisable : false}
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
                                                        disabled={props.getDisable ? props.getDisable : false}
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

                                            <div className="form-group row">
                                                <div className={error.sexe.length ? " col validated" : "col"}>
                                                    <label htmlFor="sexe">Votre sexe</label>
                                                    <select
                                                        id="sexe"
                                                        className={error.sexe.length ? "form-control is-invalid" : "form-control"}
                                                        value={data.sexe}
                                                        onChange={(e) => onChangeSexe(e)}
                                                        disabled={props.getDisable ? props.getDisable : false}
                                                    >
                                                        <option value="" disabled={true}>Veillez choisir le Sexe
                                                        </option>
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
                                                <div className={error.ville.length ? "col validated" : "col"}>
                                                    <label htmlFor="ville">Votre ville</label>
                                                    <input
                                                        id="ville"
                                                        type="text"
                                                        className={error.ville.length ? "form-control is-invalid" : "form-control"}
                                                        placeholder="Veillez entrer votre ville"
                                                        value={data.ville}
                                                        onChange={(e) => onChangeVille(e)}
                                                        disabled={props.getDisable ? props.getDisable : false}
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

                                            <div className="form-group row">
                                                <div className={error.telephone.length ? "col validated" : "col"}>
                                                    <label htmlFor="telephone">Votre Téléphone(s)</label>
                                                    <TagsInput
                                                        value={data.telephone}
                                                        onChange={onChangeTelephone}
                                                        disabled={props.getDisable ? props.getDisable : false}
                                                        inputProps={{className: "react-tagsinput-input", placeholder: "Numéro(s)"}}
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

                                                <div className={error.email.length ? "col validated" : "col"}>
                                                    <label htmlFor="email">Votre Email(s)</label>
                                                    <TagsInput
                                                        value={data.email}
                                                        onChange={onChangeEmail}
                                                        disabled={props.getDisable ? props.getDisable : false}
                                                        inputProps={{className: "react-tagsinput-input", placeholder: "Email(s)"}}
                                                    />
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
                                            </div>

                                        </div>
                                    </div>

                                    <div className="kt-portlet__body">
                                        <div className="kt-section kt-section--first">
                                            <h5 className="kt-section__title kt-section__title-lg">
                                                Informations Techniques
                                            </h5>
                                            <div className="form-group row">
                                                <div className={error.account_type_id.length ? "col validated" : "col"}>
                                                    <label htmlFor="exampleSelect1">Type de Compte</label>
                                                    {accountType ? (
                                                        <Select
                                                            placeholder={"Veillez selectionner le type de compte"}
                                                            value={type}
                                                            onChange={onChangeAccountType}
                                                            options={formatSelectOption(accountType, 'name', 'fr')}
                                                        />
                                                    ) : (
                                                        <select name="typeClient" className={error.account_type_id.length ? "form-control is-invalid" : "form-control"} id="typeClient">
                                                            <option value=""/>
                                                        </select>
                                                    )
                                                    }

                                                    {
                                                        error.account_type_id.length ? (
                                                            error.account_type_id.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>
                                                <div className={error.category_client_id.length ? "col validated" : "col"}>
                                                    <label htmlFor="exampleSelect1">Catégorie Client</label>

                                                    {categoryClient ? (
                                                        <Select
                                                            placeholder={"Veillez selectionner la catégorie client"}
                                                            value={category}
                                                            onChange={onChangeCategoryClient}
                                                            options={formatSelectOption(categoryClient, 'name', 'fr')}
                                                        />
                                                    ) : (
                                                        <select name="category" className={error.category_client_id.length ? "form-control is-invalid" : "form-control"} id="category">
                                                            <option value=""/>
                                                        </select>
                                                    )
                                                    }

                                                    {
                                                        error.category_client_id.length ? (
                                                            error.category_client_id.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className={error.number.length ? "col validated" : "col"}>
                                                    <label htmlFor="number">Numero de Compte</label>
                                                    <input
                                                        id="number"
                                                        type="text"
                                                        className={error.number.length ? "form-control is-invalid" : "form-control"}
                                                        placeholder="Veillez entrer le numero de compte"
                                                        value={data.number}
                                                        onChange={(e) => onChangeAccount(e)}
                                                    />
                                                    {
                                                        error.number.length ? (
                                                            error.number.map((error, index) => (
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
                                    <div className="kt-form__actions text-right">
                                        {
                                            !startRequest ? (
                                                <button type="submit" onClick={(e) => onSubmit(e)}
                                                        className="btn btn-primary">Enregistrer</button>
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
        identite: state.identity,
        userPermissions: state.user.user.permissions
    }
};

export default connect(mapStateToProps)(HoldingClientForm);
