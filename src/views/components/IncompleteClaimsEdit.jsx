import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {
    Link,
    useParams
} from "react-router-dom";
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
    toastAddSuccessMessageConfig,
    toastEditErrorMessageConfig, toastErrorMessageWithParameterConfig,
} from "../../config/toastConfig";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

const endPointConfig = {
    PRO: {
        plan: "PRO",
        edit: id => `${appConfig.apiDomaine}/my/claims-incompletes/${id}/edit`,
        update: id => `${appConfig.apiDomaine}/my/claims-incompletes/${id}`,
    },
    MACRO: {
        holding: {
            edit: id => `${appConfig.apiDomaine}/any/claims-incompletes/${id}/edit`,
            update: id => `${appConfig.apiDomaine}/any/claims-incompletes/${id}`,
        },
        filial: {
            edit: id => `${appConfig.apiDomaine}/my/claims-incompletes/${id}/edit`,
            update: id => `${appConfig.apiDomaine}/my/claims-incompletes/${id}`,
        }
    },
    HUB: {
        plan: "HUB",
        edit: id => `${appConfig.apiDomaine}/without-client/claims-incompletes/${id}/edit`,
        update: id => `${appConfig.apiDomaine}/without-client/claims-incompletes/${id}`,
    }
};

const IncompleteClaimsEdit = props => {
    const {id} = useParams();
    if (!(verifyPermission(props.userPermissions, 'update-claim-incomplete-against-any-institution') ||
        verifyPermission(props.userPermissions, "update-claim-incomplete-against-my-institution")||
        verifyPermission(props.userPermissions, "update-claim-incomplete-without-client")))
        window.location.href = ERROR_401;

    let endPoint = "";
    if (props.plan === "MACRO") {
        if (verifyPermission(props.userPermissions, 'update-claim-incomplete-against-any-institution'))
            endPoint = endPointConfig[props.plan].holding;
        else if (verifyPermission(props.userPermissions, 'update-claim-incomplete-against-my-institution'))
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
        claim_object_id: "",
        request_channel_slug: "",
        response_channel_slug: "",
        claimer_expectation: "",
        description: "",
        amount_currency_slug: "",
        amount_disputed: "",
        claimer_id: "",
        relationship_id:"",
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
        account_targeted_id: [],
        claim_object_id: [],
        request_channel_slug: [],
        response_channel_slug: [],
        claimer_expectation: [],
        description: [],
        amount_currency_slug: [],
        amount_disputed: [],
        claimer_id: [],
        relationship_id: [],
        event_occured_at: [],
        is_revival: [],
        file: []
    };

    const option1 = 1;
    const option2 = 0;

    const [claimObject, setClaimObject] = useState({});
    const [claimObjects, setClaimObjects] = useState([]);
    const [claimCategory, setClaimCategory] = useState({});
    const [claimCategories, setClaimCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [account, setAccount] = useState([]);
    const [units, setUnits] = useState([]);
    const [unit, setUnit] = useState({});
    const [responseChannels, setResponseChannels] = useState([]);
    const [channels, setChannels] = useState([]);
    const [relationships, setRelationships] = useState([]);
    const [relationship, setRelationship] = useState({});
    const [responseChannel, setResponseChannel] = useState({});
    const [receptionChannel, setReceptionChannel] = useState({});
    const [currency, setCurrency] = useState({});
    const [currencies, setCurrencies] = useState([]);
    const [disabledInput, setDisabledInput] = useState(false);
    const [institution, setInstitution] = useState({});
    const [institutions, setInstitutions] = useState([]);
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        async function fetchData() {
            await axios.get(endPoint.edit(`${id}`))
                .then(response => {
                    console.log(response.data, "GET_DATA");
                    const newIncompleteClaim = {

                        claimer_id: response.data.claim.claimer_id,
                        firstname: response.data.claim.claimer.firstname,
                        lastname: response.data.claim.claimer.lastname,
                        sexe: response.data.claim.claimer.sexe,
                        telephone: response.data.claim.claimer.telephone,
                        email: response.data.claim.claimer.email,
                        ville: response.data.claim.claimer.ville === null ? "" : response.data.claim.claimer.ville,
                        unit_targeted_id: response.data.claim.unit_targeted_id,
                        relationship_id: response.data.claim.relationship_id,
                        account_targeted_id: response.data.claim.account_targeted_id,
                        institution_targeted_id: response.data.claim.institution_targeted_id,
                        claim_object_id: response.data.claim.claim_object_id,
                        request_channel_slug: response.data.claim.request_channel_slug,
                        response_channel_slug: response.data.claim.response_channel_slug,
                        claimer_expectation: response.data.claim.claimer_expectation === null ? "" : response.data.claim.claimer_expectation,
                        description: response.data.claim.description,
                        amount_currency_slug: response.data.claim.amount_currency_slug,
                        amount_disputed: response.data.claim.amount_disputed,
                        event_occured_at: response.data.claim.event_occured_at,
                        is_revival: response.data.claim.is_revival
                    };
                    setData(newIncompleteClaim);
                    if (verifyPermission(props.userPermissions, "update-claim-incomplete-without-client"))
                        setRelationships(formatSelectOption(response.data.relationships, "name", "fr"));

                    if (verifyPermission(props.userPermissions, "update-claim-incomplete-against-any-institution")||
                        verifyPermission(props.userPermissions, "update-claim-incomplete-without-client"))
                        setInstitutions(formatSelectOption(response.data.institutions, "name", false));

                    setClaimCategories(formatSelectOption(response.data.claimCategories, "name", "fr"));
                    setCurrencies(formatSelectOption(response.data.currencies, "name", "fr", "slug"));
                    setChannels(formatSelectOption(response.data.channels, "name", "fr", "slug"));
                    setResponseChannels(formatSelectOption(filterChannel(response.data.channels, RESPONSE_CHANNEL), "name", "fr", "slug"))

                    if (response.data.claim.request_channel !== null) {
                        setReceptionChannel({
                            value: response.data.claim.request_channel.id,
                            label: response.data.claim.request_channel.name.fr
                        });
                    }
                    if (response.data.claim.response_channel !== null) {
                        setResponseChannel({
                            value: response.data.claim.response_channel.id,
                            label: response.data.claim.response_channel.name.fr
                        });
                    }
                    if (response.data.claim.claim_object !== null) {
                        setClaimObject({
                            value: response.data.claim.claim_object.id,
                            label: response.data.claim.claim_object.name.fr
                        });
                    }
                    if (response.data.claim.claim_object.claim_category !== null) {
                        setClaimCategory({
                            value: response.data.claim.claim_object.claim_category.id,
                            label: response.data.claim.claim_object.claim_category.name.fr
                        });
                    }
                    if (response.data.claim.institution_targeted !== null) {
                        setInstitution({
                            value: response.data.claim.institution_targeted.id,
                            label: response.data.claim.institution_targeted.name
                        });
                    }
                    if (response.data.claim.amount_currency !== null) {
                        setCurrency({
                            value: response.data.claim.amount_currency.id,
                            label: response.data.claim.amount_currency.name.fr
                        });
                    }
                    if (response.data.claim.account_targeted !== null) {
                        setAccount({
                            value: response.data.claim.account_targeted.id,
                            label: response.data.claim.account_targeted.number
                        });
                    }
                    if (response.data.claim.unit_targeted !== null) {
                        setUnit({
                            value: response.data.claim.unit_targeted.id,
                            label: response.data.claim.unit_targeted.name.fr
                        });
                    }
                })
        }

        fetchData();

    }, [endPoint, props.userPermissions, id]);

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

    const onChangeUnit = selected => {
        setUnit(selected);
        const newData = {...data};
        if (selected.value !== "other")
            newData.unit_targeted_id = selected.value;
        else
            newData.unit_targeted_id = "";
        setData(newData);
    };

    const onChangeAccount = selected => {
        setAccount(selected);
        const newData = {...data};
        newData.account_targeted_id = selected.value;
        setData(newData);
    };

    const onChangeClaimObject = selected => {
        setClaimObject(selected);
        const newData = {...data};
        newData.claim_object_id = selected.value;
        setData(newData);
    };

    const onChangeReceptionChannel = selected => {
        setReceptionChannel(selected);
        const newData = {...data};
        newData.request_channel_slug = selected.value;
        setData(newData);
    };

    const onChangeResponseChannel = selected => {
        setResponseChannel(selected);
        const newData = {...data};
        newData.response_channel_slug = selected.value;
        setData(newData);
    };

    const onChangeClaimCategory = selected => {
        setClaimCategory(selected);
        axios.get(`${appConfig.apiDomaine}/claim-categories/${selected.value}/claim-objects`)
            .then(response => {
                setClaimObject({});
                setClaimObjects(formatSelectOption(response.data.claimObjects, "name", "fr"));
            })
            .catch(error => console.log("Something is wrong"))
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
        setCurrency(selected);
        const newData = {...data};
        newData.amount_currency_slug = selected.value;
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

    const onChangeFile = (e) => {
        console.log(e.target);
        const newData = {...data};
        newData.file = Object.values(e.target.files);
        setData(newData);
    };

    const formatFormData = (newData) => {
        const formData = new FormData();
        formData.append("_method", "put");
        for (const key in newData) {
            // console.log(`${key}:`, newData[key]);
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
        const newData = {...data};
        newData.event_occured_at = formatToTimeStamp(data.event_occured_at);
        e.preventDefault();
        setStartRequest(true);
        if (!newData.file.length)
            delete newData.file;
        if (!newData.response_channel_slug)
            delete newData.response_channel_slug;
        if (!newData.unit_targeted_id)
            delete newData.unit_targeted_id;
        if (!newData.account_targeted_id)
            delete newData.account_targeted_id;
        if (!verifyPermission(props.userPermissions, "update-claim-incomplete-without-client"))
            delete newData.relationship_id;
        console.log( formatFormData(newData), "DATA_UPDATE");
        axios.post(endPoint.update(`${id}`), formatFormData(newData))
            .then(async (response) => {
                ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                await setInstitution({});
                await setClaimCategory({});
                await setCurrency({});
                await setRelationship({});
                await setResponseChannel({});
                await setReceptionChannel({});
                await setClaimObject({});
                await setClaimObjects([]);
                await setAccounts([]);
                await setAccount({});
                await setUnits([]);
                await setUnit({});
                await setDisabledInput(false);
                await setStartRequest(false);
                await setError(defaultError);
                await setData(defaultData);
            })
            .catch(async (error) => {
                setStartRequest(false);
                setError({...defaultError, ...error.response.data.error});
                ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(error.response.data.error));
            })
        ;
    };

    return (
        verifyPermission(props.userPermissions, 'update-claim-incomplete-against-any-institution')
        || verifyPermission(props.userPermissions, "update-claim-incomplete-against-my-institution") ||
        verifyPermission(props.userPermissions, "update-claim-incomplete-without-client")? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Paramètres
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <Link to="/settings/staffs" className="kt-subheader__breadcrumbs-link">
                                    Réclamation
                                </Link>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()}
                                   className="kt-subheader__breadcrumbs-link">
                                    Enregistrement
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
                                            Complèter l'enregistrement de réclamation
                                        </h3>
                                    </div>
                                </div>

                                <form method="POST" className="kt-form">
                                    <div className="kt-portlet__body">
                                        <FormInformation
                                            information={"Formulaire d'enregistrement d'une réclamation. Utilisez ce formulaire pour enregistrer les réclamations de vos clients."}
                                        />

                                        {
                                            verifyPermission(props.userPermissions, 'update-claim-incomplete-against-any-institution')||
                                            verifyPermission(props.userPermissions, "update-claim-incomplete-without-client")? (
                                                <div
                                                    className={error.institution_targeted_id.length ? "form-group row validated" : "form-group row"}>
                                                    <label className="col-xl-3 col-lg-3 col-form-label"
                                                           htmlFor="institution">Institution concernée</label>
                                                    <div className="col-lg-9 col-xl-6">
                                                        <Select
                                                            classNamePrefix="select"
                                                            className="basic-single"
                                                            isDisabled={!disabledInput}
                                                            placeholder={"Veillez selectioner l'institution"}
                                                            value={institution}
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
                                        {
                                            verifyPermission(props.userPermissions, "update-claim-incomplete-against-any-institution")||
                                            verifyPermission(props.userPermissions, "update-claim-incomplete-against-my-institution")?(
                                                <div className="kt-section kt-section--first">
                                                    <div className="kt-section__body">
                                                        <h3 className="kt-section__title kt-section__title-lg">Informations
                                                            Client:</h3>

                                                        <div className="form-group row">
                                                            <div className={error.lastname.length ? "col validated" : "col"}>
                                                                <label htmlFor="lastname">Votre nom de famille</label>
                                                                <input
                                                                    disabled={!disabledInput}
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
                                                                    disabled={!disabledInput}
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
                                                            <div
                                                                className={error.firstname.length ? "form-group col validated" : "form-group col"}>
                                                                <label htmlFor="sexe">Votre sexe</label>
                                                                <select
                                                                    disabled={!disabledInput}
                                                                    id="sexe"
                                                                    className={error.sexe.length ? "form-control is-invalid" : "form-control"}
                                                                    value={data.sexe}
                                                                    onChange={(e) => onChangeSexe(e)}
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
                                                        </div>

                                                        <div className="form-group row">
                                                            <div className={error.telephone.length ? "col validated" : "col"}>
                                                                <label htmlFor="telephone">Votre Téléphone(s)</label>
                                                                <TagsInput disabled={!disabledInput} value={data.telephone}
                                                                           onChange={onChangeTelephone}/>
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
                                                                <TagsInput disabled={!disabledInput} value={data.email}
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

                                                            <div className={error.ville.length ? "col validated" : "col"}>
                                                                <label htmlFor="ville">Votre ville</label>
                                                                <input
                                                                    disabled={!disabledInput}
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

                                                    <div className="m-3" style={{borderTop: "1px solid #A0AEC0"}}/>
                                                </div>
                                        ):""
                                        }


                                        <div className="kt-section kt-section--first">
                                            <div className="kt-section__body">
                                                <h3 className="kt-section__title kt-section__title-lg">Informations
                                                    Réclamation:</h3>
                                                <div className="form-group row">
                                                    <div
                                                        className={error.unit_targeted_id.length ? "col validated" : "col"}>
                                                        <label htmlFor="unit">Unité concèrner</label>
                                                        <Select
                                                            classNamePrefix="select"
                                                            className="basic-single"
                                                            placeholder={"Veillez selectioner l'unité"}
                                                            value={unit}
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
                                                    {
                                                        !verifyPermission(props.userPermissions, "update-claim-incomplete-without-client")?(
                                                            <div
                                                                className={error.account_targeted_id.length ? "col validated" : "col"}>
                                                                <label htmlFor="account">Numéro de compte concèrner</label>
                                                                <Select
                                                                    classNamePrefix="select"
                                                                    className="basic-single"
                                                                    placeholder={"Veillez selectioner le numéro"}
                                                                    value={account}
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
                                                        ):""
                                                    }
                                                </div>

                                                <div className="form-group row">
                                                    <div
                                                        className={error.request_channel_slug.length ? "col validated" : "col"}>
                                                        <label htmlFor="receptionChannel">Canal de réception</label>
                                                        <Select
                                                            classNamePrefix="select"
                                                            className="basic-single"
                                                            placeholder={"Veillez selectioner le canal de réception"}
                                                            value={receptionChannel}
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

                                                    <div
                                                        className={error.response_channel_slug.length ? "col validated" : "col"}>
                                                        <label htmlFor="responseChannel">Canal de réponse</label>
                                                        <Select
                                                            classNamePrefix="select"
                                                            className="basic-single"
                                                            placeholder={"Veillez selectioner le canal de réponse"}
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
                                                            classNamePrefix="select"
                                                            className="basic-single"
                                                            placeholder={"Veillez selectioner la catégorie de plainte"}
                                                            value={claimCategory}
                                                            onChange={onChangeClaimCategory}
                                                            options={claimCategories}
                                                        />
                                                    </div>

                                                    <div
                                                        className={error.claim_object_id.length ? "col validated" : "col"}>
                                                        <label htmlFor="claimObject">Objet de plainte</label>
                                                        <Select
                                                            classNamePrefix="select"
                                                            className="basic-single"
                                                            placeholder={"Veillez selectioner l'objet de plainte"}
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
                                                    <div
                                                        className={error.amount_disputed.length ? "col validated" : "col"}>
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

                                                    <div
                                                        className={error.amount_currency_slug.length ? "col validated" : "col"}>
                                                        <label htmlFor="currency">Devise du montant réclamé</label>
                                                        <Select
                                                            classNamePrefix="select"
                                                            className="basic-single"
                                                            placeholder={"Veillez selectioner la devise du montant réclamé"}
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
                                                    <div
                                                        className={error.event_occured_at.length ? "col validated" : "col"}>
                                                        <label htmlFor="date">Date de l'évènement </label>
                                                        <input
                                                            id="date"
                                                            type={"datetime-local"}
                                                            className={error.event_occured_at.length ? "form-control is-invalid" : "form-control"}
                                                            placeholder="Veillez entrer la date de l'évènement"
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
                                                        verifyPermission(props.userPermissions, "update-claim-incomplete-without-client") ? (
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

                                                    <div
                                                        className={error.claimer_expectation.length ? "col validated" : "col"}>
                                                        <label htmlFor="claimer_expectation">Attente du
                                                            réclamant</label>
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

                                            <div className="m-3" style={{borderTop: "1px solid #A0AEC0"}}/>
                                        </div>

                                        <div className="kt-section kt-section--first">
                                            <div className="kt-section__body">
                                                <h3 className="kt-section__title kt-section__title-lg">Relance:</h3>

                                                <div className="form-group row">
                                                    <label className="col-3 col-form-label">Est-ce une relance ?</label>
                                                    <div className="col-9">
                                                        <div className="kt-radio-inline">
                                                            <label className="kt-radio">
                                                                <input type="radio" value={option1}
                                                                       onChange={handleOptionChange}
                                                                       checked={option1 === data.is_revival}/> Oui<span/>
                                                            </label>
                                                            <label className="kt-radio">
                                                                <input type="radio" value={option2}
                                                                       onChange={handleOptionChange}
                                                                       checked={option2 === data.is_revival}/> Non<span/>
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
                                                    <button type="submit" onClick={(e) => onSubmit(e)}
                                                            className="btn btn-primary">Envoyer</button>
                                                ) : (
                                                    <button
                                                        className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                                        type="button" disabled>
                                                        Chargement...
                                                    </button>
                                                )
                                            }
                                            {
                                                !startRequest ? (
                                                    <Link to="/settings/incomplete_claims"
                                                          className="btn btn-secondary mx-2">
                                                        Quitter
                                                    </Link>
                                                ) : (
                                                    <Link to="/settings/incomplete_claims"
                                                          className="btn btn-secondary mx-2"
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
        ) : ""
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan,
    };
};

export default connect(mapStateToProps)(IncompleteClaimsEdit);
