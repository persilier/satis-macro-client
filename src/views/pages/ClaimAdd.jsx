import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import FormInformation from "../components/FormInformation";
import TagsInput from "react-tagsinput";
import Select from "react-select";
import appConfig from "../../config/appConfig";
import {AUTH_TOKEN} from "../../constants/token";
import {filterChannel, formatSelectOption, formatToTimeStamp} from "../../helpers/function";
import {ERROR_401} from "../../config/errorPage";
import {verifyPermission} from "../../helpers/permission";
import {RESPONSE_CHANNEL} from "../../constants/channel";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
} from "../../config/toastConfig";
import ConfirmClaimAddModal from "../components/Modal/ConfirmClaimAddModal";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

const endPointConfig = {
    PRO: {
        plan: "PRO",
        create: `${appConfig.apiDomaine}/my/claims/create`,
        store: `${appConfig.apiDomaine}/my/claims`,
        storeKnowingIdentity: id => `${appConfig.apiDomaine}/my/identites/${id}/claims`,
    },
    MACRO: {
        holding: {
            create: `${appConfig.apiDomaine}/any/claims/create`,
            store: `${appConfig.apiDomaine}/any/claims`,
            storeKnowingIdentity: id => `${appConfig.apiDomaine}/any/identites/${id}/claims`,
        },
        filial: {
            create: `${appConfig.apiDomaine}/my/claims/create`,
            store: `${appConfig.apiDomaine}/my/claims`,
            storeKnowingIdentity: id => `${appConfig.apiDomaine}/my/identites/${id}/claims`,
        }
    },
    HUB: {
        plan: "HUB",
        create: `${appConfig.apiDomaine}/without-client/claims/create`,
        store: `${appConfig.apiDomaine}/without-client/claims`,
        storeKnowingIdentity: id => `${appConfig.apiDomaine}/without-client/identites/${id}/claims`,
    }
};

const ClaimAdd = props => {
    document.title = "Satis client - Enrégistrement de réclamation";
    if (!(verifyPermission(props.userPermissions, 'store-claim-against-any-institution') || verifyPermission(props.userPermissions, "store-claim-against-my-institution") || verifyPermission(props.userPermissions, "store-claim-without-client")))
        window.location.href = ERROR_401;

    let endPoint = "";
    if (props.plan === "MACRO") {
        if (verifyPermission(props.userPermissions, 'store-claim-against-any-institution'))
            endPoint = endPointConfig[props.plan].holding;
        else if (verifyPermission(props.userPermissions, 'store-claim-against-my-institution'))
            endPoint = endPointConfig[props.plan].filial
    } else
        endPoint = endPointConfig[props.plan];
    const defaultData = {
        firstname: "",
        lastname: "",
        sexe: "",
        telephone: [],
        email: [],
        ville: "",
        unit_targeted_id: "",
        institution_targeted_id: "",
        account_targeted_id: "",
        relationship_id: "",
        claim_object_id: "",
        request_channel_slug: "",
        response_channel_slug: "",
        claimer_expectation: "",
        description: "",
        amount_currency_slug: "",
        amount_disputed: "",
        claimer_id: "",
        event_occured_at: "",
        is_revival: 0,
        file: []
    };
    const defaultError = {
        firstname: [],
        lastname: [],
        sexe: [],
        telephone: [],
        email: [],
        ville: [],
        unit_targeted_id: [],
        institution_targeted_id: [],
        relationship_id: [],
        account_targeted_id: [],
        claim_object_id: [],
        request_channel_slug: [],
        response_channel_slug: [],
        claimer_expectation: [],
        description: [],
        amount_currency_slug: [],
        amount_disputed: [],
        claimer_id: [],
        event_occured_at: [],
        is_revival: [],
        file: []
    };

    const option1 = 1;
    const option2 = 0;

    const [claimObject, setClaimObject] = useState(null);
    const [claimObjects, setClaimObjects] = useState([]);
    const [claimCategory, setClaimCategory] = useState(null);
    const [claimCategories, setClaimCategories] = useState([]);
    const [relationship, setRelationship] = useState({});
    const [relationships, setRelationships] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [account, setAccount] = useState(null);
    const [units, setUnits] = useState([]);
    const [unit, setUnit] = useState(null);
    const [responseChannels, setResponseChannels] = useState([]);
    const [channels, setChannels] = useState([]);
    const [responseChannel, setResponseChannel] = useState(null);
    const [receptionChannel, setReceptionChannel] = useState(null);
    const [currency, setCurrency] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [disabledInput, setDisabledInput] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [possibleCustomers, setPossibleCustomers] = useState([]);
    const [institution, setInstitution] = useState(null);
    const [institutions, setInstitutions] = useState([]);
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);
    const [foundData, setFoundData] = useState({});

    useEffect(() => {
        async function fetchData() {
            await axios.get(endPoint.create)
                .then(response => {
                    if (verifyPermission(props.userPermissions, "store-claim-without-client"))
                        setRelationships(formatSelectOption(response.data.relationships, "name", "fr"));
                    if (verifyPermission(props.userPermissions, "store-claim-against-any-institution") || verifyPermission(props.userPermissions, "store-claim-without-client"))
                        setInstitutions(formatSelectOption(response.data.institutions, "name", false));
                    if (verifyPermission(props.userPermissions, "store-claim-against-my-institution")) {
                        setPossibleCustomers(formatPossibleCustomers(response.data.client_institutions));
                        setUnits(formatSelectOption(response.data.units, "name", "fr"))
                    }
                    setClaimCategories(formatSelectOption(response.data.claimCategories, "name", "fr"));
                    setCurrencies(formatSelectOption(response.data.currencies, "name", "fr", "slug"));
                    setChannels(formatSelectOption(response.data.channels, "name", "fr", "slug"));
                    setResponseChannels(formatSelectOption(filterChannel(response.data.channels, RESPONSE_CHANNEL), "name", "fr", "slug"))
                })
                .catch(error => {
                    console.log("Something is wrong");
                });
        }
        fetchData();
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

    const onChangeFile = (e) => {
        const newData = {...data};
        newData.file = Object.values(e.target.files);
        setData(newData);
    };

    const formatPossibleCustomers = customers => {
        const newCustomers = [];
        for (let i = 0; i < customers.length; i++) {
            newCustomers.push(
                {
                    claimer_id: customers[i].client.identite.id,
                    value: customers[i].id,
                    label: `${customers[i].client.identite.lastname} ${customers[i].client.identite.firstname}`,
                    lastname: customers[i].client.identite.lastname,
                    firstname: customers[i].client.identite.firstname,
                    sexe: customers[i].client.identite.sexe,
                    telephone: customers[i].client.identite.telephone,
                    email: customers[i].client.identite.email,
                    ville: customers[i].client.identite.ville ? customers[i].client.identite.ville : "",
                    accounts: [...customers[i].accounts]
                }
            );
        }
        return newCustomers;
    };

    const onChangeInstitution = (selected) => {
        const newData = {...data};
        if (selected) {
            setInstitution(selected);
            newData.institution_targeted_id = selected.value;
            if (!verifyPermission(props.userPermissions, "store-claim-without-client")) {
                axios.get(`${appConfig.apiDomaine}/institutions/${selected.value}/clients`)
                    .then(response => {
                        setPossibleCustomers(formatPossibleCustomers(response.data.client_institutions));
                        setUnits(formatSelectOption(response.data.units, "name", "fr"))
                    })
                    .catch(error => {
                        console.log("Something is wrong");
                    });
            }
        }
        else {
            setUnits([]);
            setUnit(null);
            setPossibleCustomers([]);
            setCustomer(null);
            setInstitution(null);
            setAccount(null);
            setAccounts([]);
            newData.firstname = "";
            newData.lastname = "";
            newData.sexe = "";
            newData.telephone = [];
            newData.email = [];
            newData.ville = "";
            newData.unit_targeted_id = "";
            newData.claimer_id = "";
            newData.account_targeted_id = "";
            newData.institution_targeted_id = "";
        }
        setData(newData);
    };

    const handleDisabledInputChange = () => {
        const newData = {...data};
        setCustomer(null);
        setAccount(null);
        setAccounts([]);
        newData.firstname = "";
        newData.lastname = "";
        newData.sexe = "";
        newData.telephone = [];
        newData.email = [];
        newData.ville = "";
        newData.claimer_id = "";
        newData.account_targeted_id = "";
        setData(newData);
        setDisabledInput(!disabledInput);
    };

    const onChangeUnit = selected => {
        const newData = {...data};
        if (selected) {
            setUnit(selected);
            newData.unit_targeted_id = selected.value;
        } else {
            newData.unit_targeted_id = "";
            setUnit(null)
        }
        setData(newData);
    };

    const handleCustomerChange = (selected) => {
        const newData = {...data};
        if (selected) {
            setCustomer(selected);
            setAccount(null);
            newData.account_targeted_id = "";
            setAccounts(formatSelectOption(selected.accounts, "number", false));
            newData.firstname = selected.firstname;
            newData.lastname = selected.lastname;
            newData.sexe = selected.sexe;
            newData.telephone = selected.telephone;
            newData.email = selected.email;
            newData.ville = selected.ville;
            newData.claimer_id = selected.claimer_id;
        } else {
            newData.firstname = "";
            newData.lastname = "";
            newData.sexe = "";
            newData.telephone = [];
            newData.email = [];
            newData.ville = "";
            setCustomer(null);
            setAccount(null);
            setAccounts([]);
            newData.claimer_id = "";
            newData.account_targeted_id = "";
        }
        setData(newData);
    };

    const onChangeAccount = selected => {
        const newData = {...data};
        if (selected) {
            setAccount(selected);
            newData.account_targeted_id = selected.value;
        } else {
           setAccount(null);
           newData.account_targeted_id = ""
        }
        setData(newData);
    };

    const onChangeClaimObject = selected => {
        const newData = {...data};
        if (selected) {
            setClaimObject(selected);
            newData.claim_object_id = selected.value;
        } else {
            setClaimObject(null);
            newData.claim_object_id = "";
        }
        setData(newData);
    };

    const onChangeReceptionChannel = selected => {
        const newData = {...data};
        if (selected) {
            setReceptionChannel(selected);
            newData.request_channel_slug = selected.value;
        } else {
            setReceptionChannel(null);
            newData.request_channel_slug = ""
        }
        setData(newData);
    };

    const onChangeResponseChannel = selected => {
        const newData = {...data};
        if (selected) {
            setResponseChannel(selected);
            newData.response_channel_slug = selected.value;
        } else {
            setResponseChannel(null);
            newData.response_channel_slug = "";
        }
        setData(newData);
    };

    const onChangeClaimCategory = selected => {
        const newData = {...data};
        if (selected) {
            setClaimCategory(selected);
            axios.get(`${appConfig.apiDomaine}/claim-categories/${selected.value}/claim-objects`)
                .then(response => {
                    newData.claim_object_id = "";
                    setClaimObject(null);
                    setClaimObjects(formatSelectOption(response.data.claimObjects, "name", "fr"));
                })
                .catch(error => console.log("Something is wrong"))
        } else {
            setClaimObjects([]);
            setClaimObject(null);
            setClaimCategory(null);
            newData.claim_object_id = "";
        }
        setData(newData)
    };

    const onChangeClaimerExpectation = e => {
        const newData = {...data};
        newData.claimer_expectation = e.target.value;
        setData(newData);
    };

    const onChangeDescription = e => {
        const newData = {...data};
        newData.description = e.target.value;
        setData(newData);
    };

    const onChangeAmountDisputed = e => {
        const newData = {...data};
        newData.amount_disputed = e.target.value;
        setData(newData);
    };

    const onChangeAmountCurrency = selected => {
        const newData = {...data};
        if (selected) {
            setCurrency(selected);
            newData.amount_currency_slug = selected.value;
        } else {
            setCurrency(null);
            newData.amount_currency_slug = "";
        }
        setData(newData);
    };

    const onChangeRelationShip = selected => {
        const newData = {...data};
        if (selected) {
            setRelationship(selected);
            newData.relationship_id = selected.value;
        } else {
            setRelationship(null);
            newData.relationship_id = "";
        }
        setData(newData);
    };

    const onChangeEventOccuredAt = e => {
        const newData = {...data};
        newData.event_occured_at = e.target.value;
        setData(newData);
    };

    const handleOptionChange = (e) => {
        const newData = {...data};
        newData.is_revival = parseInt(e.target.value);
        setData(newData);
    };

    const resetFountData = () => {
        setFoundData({});
        setData(defaultData);
        setError(defaultError)
    };

    const formatFormData = (newData) => {
        const formData = new FormData();
        formData.append("_method", "post");
        for (const key in newData) {
            if (key === "file") {
                for (let i = 0; i < (newData.file).length; i++)
                    formData.append("file[]", (newData[key])[i], ((newData[key])[i]).name);
            }
            else if (key === "telephone") {
                for (let i = 0; i < (newData.telephone).length; i++)
                    formData.append("telephone[]", (newData[key])[i]);
            }
            else if (key === "email") {
                for (let i = 0; i < (newData.email).length; i++)
                    formData.append("email[]", (newData[key])[i]);
            }
            else
                formData.set(key, newData[key]);
        }
        return formData;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const newData = {...data};
        newData.event_occured_at = formatToTimeStamp(data.event_occured_at);
        setStartRequest(true);
        if (!newData.file.length)
            delete newData.file;
        if (!newData.response_channel_slug)
            delete newData.response_channel_slug;
        if (!newData.unit_targeted_id)
            delete newData.unit_targeted_id;
        if (!newData.account_targeted_id)
            delete newData.account_targeted_id;
        if (!verifyPermission(props.userPermissions, "store-claim-without-client"))
            delete newData.relationship_id;
        axios.post(endPoint.store, formatFormData(newData))
            .then(async () => {
                ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                await setInstitution(null);
                await setClaimCategory(null);
                await setCurrency(null);
                await setResponseChannel(null);
                await setReceptionChannel(null);
                await setClaimObject(null);
                await setClaimObjects([]);
                await setAccounts([]);
                await setAccount(null);
                await setUnits([]);
                await setUnit(null);
                await setDisabledInput(false);
                await setCustomer(null);
                await setRelationship(null);
                await setPossibleCustomers([]);
                await setStartRequest(false);
                await setError(defaultError);
                await setData(defaultData);
                document.getElementById("customFile").value = "";
            })
            .catch(async (error) => {
                if (error.response.data.code === 409) {
                    //Existing entity claimer
                    setFoundData(error.response.data.error);
                    await document.getElementById("confirmSaveForm").click();
                    //Reset form
                    await setInstitution(null);
                    await setClaimCategory(null);
                    await setCurrency(null);
                    await setResponseChannel(null);
                    await setReceptionChannel(null);
                    await setClaimObject(null);
                    await setClaimObjects([]);
                    await setAccounts([]);
                    await setAccount(null);
                    await setUnits([]);
                    await setUnit(null);
                    await setDisabledInput(false);
                    await setCustomer(null);
                    await setPossibleCustomers([]);
                    await setData(defaultData);
                    await setRelationship(null);
                    setStartRequest(false);
                } else {
                    setStartRequest(false);
                    let fileErrors = [];
                    let i = 0;
                    for (const key in error.response.data.error) {
                        if (key === `file.${i}`) {
                            fileErrors = [...fileErrors, ...error.response.data.error[`file.${i}`]];
                            i++;
                        }
                    }
                    setError({...defaultError, ...error.response.data.error, file: fileErrors});
                    ToastBottomEnd.fire(toastAddErrorMessageConfig);
                }
            })
        ;
    };

    return (
        verifyPermission(props.userPermissions, 'store-claim-against-any-institution') || verifyPermission(props.userPermissions, "store-claim-against-my-institution") || verifyPermission(props.userPermissions, "store-claim-without-client") ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Processus
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()}
                                   className="kt-subheader__breadcrumbs-link" style={{cursor: "default"}}>
                                    Collecte
                                </a>
                                <span className="kt-subheader__separator kt-hidden"/>
                                <div className="kt-subheader__breadcrumbs">
                                    <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                        className="flaticon2-shelter"/></a>
                                    <span className="kt-subheader__breadcrumbs-separator"/>
                                    <a href="#button" onClick={e => e.preventDefault()}
                                       className="kt-subheader__breadcrumbs-link" style={{cursor: "default"}}>
                                        Enrégistrement réclamation
                                    </a>
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
                                            Enregistrement réclamation
                                        </h3>
                                    </div>
                                </div>

                                <form method="POST" className="kt-form">
                                    <div className="kt-portlet__body">
                                        <FormInformation
                                            information={"Formulaire d'enregistrement d'une réclamation. Utilisez ce formulaire pour enregistrer les réclamations de vos clients."}
                                        />

                                        {
                                            verifyPermission(props.userPermissions, 'store-claim-against-any-institution') || verifyPermission(props.userPermissions, 'store-claim-without-client') ? (
                                                <div className={error.institution_targeted_id.length ? "form-group row validated" : "form-group row"}>
                                                    <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="institution">Institution concernée</label>
                                                    <div className="col-lg-9 col-xl-6">
                                                        <Select
                                                            isClearable
                                                            value={institution}
                                                            placeholder={"Veuillez sélectionner l'institution"}
                                                            onChange={onChangeInstitution}
                                                            options={institutions}
                                                        />
                                                        {
                                                            error.institution_targeted_id.length ? (
                                                                error.institution_targeted_id.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : ""
                                                        }
                                                    </div>
                                                </div>
                                            ) : ""
                                        }

                                        <div className="kt-section">
                                            <div className="kt-section__body">
                                                <h3 className="kt-section__title kt-section__title-lg">Informations Client:</h3>

                                                {
                                                    !verifyPermission(props.userPermissions, 'store-claim-without-client') ? (
                                                        <div className="form-group row">
                                                            <div className={"col d-flex align-items-center mt-4"}>
                                                                <label className="kt-checkbox">
                                                                    <input type="checkbox" value={disabledInput} onChange={handleDisabledInputChange}/>
                                                                    Client déjà enregistrer<span/>
                                                                </label>
                                                            </div>

                                                            <div className={"col"}>
                                                                <label htmlFor="client">Selectionez le client</label>
                                                                <Select
                                                                    isClearable
                                                                    isDisabled={!disabledInput}
                                                                    placeholder={"Veuillez sélectionner le client"}
                                                                    value={customer}
                                                                    onChange={handleCustomerChange}
                                                                    options={possibleCustomers}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : ""
                                                }

                                                <div className="form-group row">
                                                    <div className={error.lastname.length ? "col validated" : "col"}>
                                                        <label htmlFor="lastname">Votre nom de famille</label>
                                                        <input
                                                            disabled={disabledInput}
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
                                                            disabled={disabledInput}
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
                                                            disabled={disabledInput}
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
                                                        <TagsInput disabled={disabledInput} value={data.telephone} onChange={onChangeTelephone} inputProps={{className: 'react-tagsinput-input', placeholder: 'Numéro(s)'}} />
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
                                                        <TagsInput disabled={disabledInput} value={data.email} onChange={onChangeEmail} inputProps={{className: 'react-tagsinput-input', placeholder: 'Email(s)'}}/>
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
                                                            disabled={disabledInput}
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

                                        <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg"/>

                                        <div className="kt-section">
                                            <div className="kt-section__body">
                                                <h3 className="kt-section__title kt-section__title-lg">Informations Réclamation:</h3>
                                                {
                                                    !verifyPermission(props.userPermissions, 'store-claim-without-client') ? (
                                                        <div className="form-group row">
                                                            <div className={error.unit_targeted_id.length ? "col validated" : "col"}>
                                                                <label htmlFor="unit">Unité concèrner</label>
                                                                <Select
                                                                    value={unit}
                                                                    isClearable
                                                                    placeholder={"Veuillez sélectionner l'unité concèrner"}
                                                                    onChange={onChangeUnit}
                                                                    options={units}
                                                                />
                                                                {
                                                                    error.unit_targeted_id.length ? (
                                                                        error.unit_targeted_id.map((error, index) => (
                                                                            <div key={index} className="invalid-feedback">
                                                                                {error}
                                                                            </div>
                                                                        ))
                                                                    ) : ""
                                                                }
                                                            </div>

                                                            <div className={error.account_targeted_id.length ? "col validated" : "col"}>
                                                                <label htmlFor="account">Numéro de compte concèrner</label>
                                                                <Select
                                                                    isClearable
                                                                    value={account}
                                                                    placeholder={"Veuillez sélectionner le compte concèrner"}
                                                                    onChange={onChangeAccount}
                                                                    options={accounts}
                                                                />
                                                                {
                                                                    error.account_targeted_id.length ? (
                                                                        error.account_targeted_id.map((error, index) => (
                                                                            <div key={index} className="invalid-feedback">
                                                                                {error}
                                                                            </div>
                                                                        ))
                                                                    ) : ""
                                                                }
                                                            </div>
                                                        </div>
                                                    ) : ""
                                                }

                                                <div className="form-group row">
                                                    <div className={error.request_channel_slug.length ? "col validated" : "col"}>
                                                        <label htmlFor="receptionChannel">Canal de réception</label>
                                                        <Select
                                                            isClearable
                                                            value={receptionChannel}
                                                            placeholder={"Veuillez sélectionner le canal de réceoption"}
                                                            onChange={onChangeReceptionChannel}
                                                            options={channels}
                                                        />
                                                        {
                                                            error.request_channel_slug.length ? (
                                                                error.request_channel_slug.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : ""
                                                        }
                                                    </div>

                                                    <div className={error.response_channel_slug.length ? "col validated" : "col"}>
                                                        <label htmlFor="responseChannel">Canal de réponse</label>
                                                        <Select
                                                            isClearable
                                                            placeholder={"Veillez selectionner le canal de réponse"}
                                                            value={responseChannel}
                                                            onChange={onChangeResponseChannel}
                                                            options={responseChannels}
                                                        />
                                                        {
                                                            error.response_channel_slug.length ? (
                                                                error.response_channel_slug.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : ""
                                                        }
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <div className={"col"}>
                                                        <label htmlFor="claimCtegory">Catégorie de plainte</label>
                                                        <Select
                                                            isClearable
                                                            placeholder={"Veillez selectionner la catégorie de plainte"}
                                                            value={claimCategory}
                                                            onChange={onChangeClaimCategory}
                                                            options={claimCategories}
                                                        />
                                                    </div>

                                                    <div className={error.claim_object_id.length ? "col validated" : "col"}>
                                                        <label htmlFor="claimObject">Objet de plainte</label>
                                                        <Select
                                                            isClearable
                                                            placeholder={"Veillez selectionner l'objet de plainte"}
                                                            value={claimObject}
                                                            onChange={onChangeClaimObject}
                                                            options={claimObjects}
                                                        />
                                                        {
                                                            error.claim_object_id.length ? (
                                                                error.claim_object_id.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : ""
                                                        }
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <div className={error.amount_disputed.length ? "col validated" : "col"}>
                                                        <label htmlFor="amount_claim">Montant réclamé</label>
                                                        <input
                                                            type={"number"}
                                                            id="amount_claim"
                                                            className={error.amount_disputed.length ? "form-control is-invalid" : "form-control"}
                                                            placeholder="Veillez entrer le Montant réclamé"
                                                            value={data.amount_disputed}
                                                            onChange={(e) => onChangeAmountDisputed(e)}
                                                        />
                                                        {
                                                            error.amount_disputed.length ? (
                                                                error.amount_disputed.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : ""
                                                        }
                                                    </div>

                                                    <div className={error.amount_currency_slug.length ? "col validated" : "col"}>
                                                        <label htmlFor="currency">Devise du montant réclamé</label>
                                                        <Select
                                                            isClearable
                                                            placeholder={"Veillez selectionner la devise du montant réclamé"}
                                                            value={currency}
                                                            onChange={onChangeAmountCurrency}
                                                            options={currencies}
                                                        />
                                                        {
                                                            error.amount_currency_slug.length ? (
                                                                error.amount_currency_slug.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : ""
                                                        }
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <div className={error.event_occured_at.length ? "col validated" : "col"}>
                                                        <label htmlFor="date">Date de l'évernement</label>
                                                        <input
                                                            type={"datetime-local"}
                                                            id="date"
                                                            className={error.event_occured_at.length ? "form-control is-invalid" : "form-control"}
                                                            placeholder="Veillez entrer la date de l'evernement"
                                                            value={data.event_occured_at}
                                                            onChange={(e) => onChangeEventOccuredAt(e)}
                                                        />
                                                        {
                                                            error.event_occured_at.length ? (
                                                                error.event_occured_at.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : ""
                                                        }
                                                    </div>

                                                    {
                                                        verifyPermission(props.userPermissions, "store-claim-without-client") ? (
                                                            <div className={error.relationship_id.length ? "col validated" : "col"}>
                                                                <label htmlFor="relationship">Relation du reclamant avec l'institution</label>
                                                                <Select
                                                                    isClearable
                                                                    value={relationship}
                                                                    placeholder={"Veillez selectioner la relation du reclamant avec l'institution"}
                                                                    onChange={onChangeRelationShip}
                                                                    options={relationships}
                                                                />
                                                                {
                                                                    error.relationship_id.length ? (
                                                                        error.relationship_id.map((error, index) => (
                                                                            <div key={index} className="invalid-feedback">
                                                                                {error}
                                                                            </div>
                                                                        ))
                                                                    ) : ""
                                                                }
                                                            </div>
                                                        ) : ""
                                                    }

                                                    <div className="col">
                                                        <label htmlFor="file">Pièces jointes</label>
                                                        <input
                                                            onChange={onChangeFile}
                                                            type="file"
                                                            className={error.file.length ? "form-control is-invalid" : "form-control"}
                                                            id="customFile"
                                                            multiple={true}
                                                        />
                                                        {
                                                            error.file.length ? (
                                                                error.file.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : ""
                                                        }
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <div className={error.description.length ? "col validated" : "col"}>
                                                        <label htmlFor="description">Description</label>
                                                        <textarea
                                                            id="description"
                                                            className={error.description.length ? "form-control is-invalid" : "form-control"}
                                                            placeholder="Veillez entrer la description"
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

                                                    <div className={error.claimer_expectation.length ? "col validated" : "col"}>
                                                        <label htmlFor="claimer_expectation">Attente du réclamant</label>
                                                        <textarea
                                                            id="claimer_expectation"
                                                            className={error.claimer_expectation.length ? "form-control is-invalid" : "form-control"}
                                                            placeholder="Veillez entrer l'attente du réclamant"
                                                            value={data.claimer_expectation}
                                                            onChange={(e) => onChangeClaimerExpectation(e)}
                                                        />
                                                        {
                                                            error.claimer_expectation.length ? (
                                                                error.claimer_expectation.map((error, index) => (
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

                                        <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg"/>

                                        <div className="kt-section">
                                            <div className="kt-section__body">
                                                <h3 className="kt-section__title kt-section__title-lg">Relance:</h3>

                                                <div className="form-group row">
                                                    <label className="col-3 col-form-label">Est-ce une relance ?</label>
                                                    <div className="col-9">
                                                        <div className="kt-radio-inline">
                                                            <label className="kt-radio">
                                                                <input type="radio" value={option1} onChange={handleOptionChange} checked={option1 === data.is_revival}/> Oui<span/>
                                                            </label>
                                                            <label className="kt-radio">
                                                                <input type="radio" value={option2} onChange={handleOptionChange} checked={option2 === data.is_revival}/> Non<span/>
                                                            </label>
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
                                                    <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-primary">Enregistrer</button>
                                                ) : (
                                                    <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                                        Chargement...
                                                    </button>
                                                )
                                            }
                                            <button style={{display: "none"}} id="confirmSaveForm" type="button" className="btn btn-bold btn-label-brand btn-sm" data-toggle="modal" data-target="#kt_modal_4">
                                                Launch Modal
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                {
                                    foundData.entity ? (
                                        <ConfirmClaimAddModal
                                            message={foundData.message}
                                            id={foundData.entity.id}
                                            firstname={foundData.entity.firstname}
                                            lastname={foundData.entity.lastname}
                                            sexe={foundData.entity.sexe}
                                            telephone={foundData.entity.telephone}
                                            email={foundData.entity.email}
                                            ville={foundData.entity.ville ? foundData.entity.ville : ""}
                                            unit_targeted_id={data.unit_targeted_id}
                                            institution_targeted_id={data.institution_targeted_id}
                                            account_targeted_id={data.account_targeted_id}
                                            claim_object_id={data.claim_object_id}
                                            request_channel_slug={data.request_channel_slug}
                                            response_channel_slug={data.response_channel_slug}
                                            claimer_expectation={data.claimer_expectation}
                                            description={data.description}
                                            amount_currency_slug={data.amount_currency_slug}
                                            amount_disputed={data.amount_disputed}
                                            claimer_id={data.claimer_id}
                                            relationship_id={data.relationship_id}
                                            event_occured_at={data.event_occured_at}
                                            is_revival={data.is_revival}
                                            file={data.file}
                                            resetFoundData={resetFountData}
                                            claimObject={claimObject}
                                            claimObjects={claimObjects}
                                            claimCategory={claimCategory}
                                            claimCategories={claimCategories}
                                            accounts={accounts}
                                            account={account}
                                            units={units}
                                            unit={unit}
                                            relationships={relationships}
                                            relationship={relationship}
                                            responseChannels={responseChannels}
                                            channels={channels}
                                            responseChannel={responseChannel}
                                            receptionChannel={receptionChannel}
                                            currency={currency}
                                            currencies={currencies}
                                            disabledInput={disabledInput}
                                            customer={customer}
                                            possibleCustomers={possibleCustomers}
                                            institution={institution}
                                            institutions={institutions}
                                            endPoint={endPoint}
                                            fileValue={document.getElementById("customFile").value}
                                        />
                                    ) : ""
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : ""
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan,
    };
};

export default connect(mapStateToProps)(ClaimAdd);
