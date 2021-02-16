import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {NavLink} from "react-router-dom";
import axios from "axios";
import TagsInput from "react-tagsinput";
import Select from "react-select";
import appConfig from "../../config/appConfig";
import {AUTH_TOKEN} from "../../constants/token";
import {
    filterChannel,
    formatSelectOption,
    formatToTimeStamp,
    refreshToken,
} from "../../helpers/function";
import {ERROR_401} from "../../config/errorPage";
import {verifyPermission} from "../../helpers/permission";
import {RESPONSE_CHANNEL} from "../../constants/channel";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
    toastErrorMessageWithParameterConfig
} from "../../config/toastConfig";
import ConfirmClaimAddModal from "../components/Modal/ConfirmClaimAddModal";
import InfirmationTable from "../components/InfirmationTable";
import InputRequire from "../components/InputRequire";
import WithoutCode from "../components/WithoutCode";
import Loader from "../components/Loader";
import {verifyTokenExpire} from "../../middleware/verifyToken";

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
    const [relationship, setRelationship] = useState(null);
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
    const [institution, setInstitution] = useState(null);
    const [institutions, setInstitutions] = useState([]);
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);
    const [foundData, setFoundData] = useState({});
    const [clientCash, setClientCash] = useState({searchInputValue: "", clients: []});

    const [searchList , setSearchList] = useState([]);
    const [showSearchResult, setShowSearchResult] = useState(false);
    const [searchInputValue, setSearchInputValue] = useState("");
    const [startSearch, setStartSearch] = useState(false);

    const [completionError, setCompletionError] = useState({ref: "", list: []});

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);

    const maxDate = (currentDate.toISOString()).substr(0, (currentDate.toISOString()).length - 1);

    useEffect(() => {
        async function fetchData() {
            await axios.get(endPoint.create)
                .then(response => {
                    if (verifyPermission(props.userPermissions, "store-claim-without-client"))
                        setRelationships(formatSelectOption(response.data.relationships, "name", "fr"));
                    if (verifyPermission(props.userPermissions, "store-claim-against-any-institution") || verifyPermission(props.userPermissions, "store-claim-without-client"))
                        setInstitutions(formatSelectOption(response.data.institutions, "name", false));
                    if (verifyPermission(props.userPermissions, "store-claim-against-my-institution")) {
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

        if (verifyTokenExpire()) {
            fetchData();
        }
    }, [endPoint.create, props.userPermissions]);

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

    const onChangeInstitution = (selected) => {
        const newData = {...data};
        if (selected) {
            setInstitution(selected);
            newData.institution_targeted_id = selected.value;
            if (!verifyPermission(props.userPermissions, "store-claim-without-client")) {
                if (verifyTokenExpire()) {
                    axios.get(`${appConfig.apiDomaine}/institutions/${selected.value}/clients`)
                        .then(response => {
                            setUnits(formatSelectOption(response.data.units, "name", "fr"))
                        })
                        .catch(error => {
                            console.log("Something is wrong");
                        })
                    ;
                }
            }
        }
        else {
            setUnits([]);
            setUnit(null);
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

    const handleDisabledInputChange = (e) => {
        setSearchList([]);
        setShowSearchResult(false);
        setSearchInputValue("");
        const newData = {...data};
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
        setDisabledInput(e.target.checked);
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

    const handleCustomerChange = (e, selected) => {
        const newData = {...data};
        setAccount(null);
        newData.account_targeted_id = "";
        setAccounts(formatSelectOption(selected.accounts, "number", false));
        newData.firstname = selected.identity.firstname;
        newData.lastname = selected.identity.lastname;
        newData.sexe = selected.identity.sexe;
        newData.telephone = selected.identity.telephone;
        newData.email = selected.identity.email;
        newData.ville = selected.identity.ville;
        newData.claimer_id = selected.identity.id;
        setShowSearchResult(false);
        setSearchList([]);
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
            if (verifyTokenExpire()) {
                axios.get(`${appConfig.apiDomaine}/claim-categories/${selected.value}/claim-objects`)
                    .then(response => {
                        newData.claim_object_id = "";
                        setClaimObject(null);
                        setClaimObjects(formatSelectOption(response.data.claimObjects, "name", "fr"));
                    })
                    .catch(error => console.log("Something is wrong"))
                ;
            }

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
        setRelationship(selected);
        newData.relationship_id = selected ? selected.value : null;
        setData(newData);
    };

    const handleEventOccuredAt = e => {
        const newData = {...data};
        if (new Date(e.target.value) >= new Date()) {
            ToastBottomEnd.fire(toastErrorMessageWithParameterConfig("Date invalide"));
            newData.event_occured_at = "";
        } else
            newData.event_occured_at = e.target.value;
        setData(newData);
    };

    const handleOptionChange = (e) => {
        const newData = {...data};
        newData.is_revival = parseInt(e.target.value);
        setData(newData);
    };

    const resetFountData = () => {
        resetAllData();
        setFoundData({});
        setData(defaultData);
        setError(defaultError)
    };

    const closeModal = () => {
        setFoundData({});
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

    const blur = () => {
        setTimeout(function(){ setShowSearchResult(false); }, 500);
    };

    const startSearchClient = async () => {
        setStartSearch(true);
        const value = props.plan === "PRO" ? (props.currentUserInstitution) : (verifyPermission(props.userPermissions, 'store-claim-against-my-institution') ? props.currentUserInstitution : institution.value);
        if (searchInputValue === clientCash.searchInputValue) {
            setStartSearch(false);
            setSearchList(clientCash.clients);
        } else {
            if (verifyTokenExpire()) {
                await axios.get(`${appConfig.apiDomaine}/search/institutions/${value}/clients?r=${searchInputValue}`)
                    .then(({data}) => {
                        setStartSearch(false);
                        setShowSearchResult(true);
                        if (data.length)
                            setClientCash({ "searchInputValue": searchInputValue, "clients": data});
                        setSearchList(data);
                    })
                    .catch(({response}) => {
                        setStartSearch(false);
                        console.log("Something is wrong");
                    })
                ;
            }
        }
    };

    const searchClient = () => {
        if (searchInputValue.length) {
            if (verifyPermission(props.userPermissions, "store-claim-against-any-institution")) {
                if (institution) {
                    startSearchClient();
                } else
                    ToastBottomEnd.fire(toastErrorMessageWithParameterConfig("Veillez selectioner une institution"))
            } else if (verifyPermission(props.userPermissions, "store-claim-against-my-institution")) {
                startSearchClient();
            }

        } else {
            ToastBottomEnd.fire(toastErrorMessageWithParameterConfig("Veillez renseigner le champ de recherche"))
        }
    };

    const resetAllData = async () => {
        await setInstitution(null);
        await setClaimCategory(null);
        await setCurrency(null);
        await setResponseChannel(null);
        await setReceptionChannel(null);
        await setClaimObject(null);
        await setClaimObjects([]);
        await setAccounts([]);
        await setAccount(null);
        if (props.plan !== "PRO") {
            if (verifyPermission(props.userPermissions, 'store-claim-against-my-institution') && props.plan === "MACRO") {

            } else {
                await setUnits([]);
            }
        }
        await setUnit(null);
        await setDisabledInput(false);
        await setData(defaultData);
        await setRelationship(null);
        setStartRequest(false);
        await setSearchInputValue("");
        await setError(defaultError);
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
        if (props.plan !== "HUB")
            delete newData.relationship_id;
        if (verifyTokenExpire()) {
            axios.post(endPoint.store, formatFormData(newData))
                .then(async (response) => {
                    setDisabledInput(false);
                    ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                    resetAllData();
                    document.getElementById("customFile").value = "";
                    if (response.data.errors)
                        setCompletionError({ref: response.data.claim.reference, list: response.data.errors});
                })
                .catch(async (error) => {
                    if (completionError.length)
                    if (completionError.length)
                        setCompletionError({ref: "", list: []});
                    if (error.response.data.code === 409) {
                        //Existing entity claimer
                        setFoundData(error.response.data.error);
                        setStartRequest(false);
                        await setError(defaultError);
                        await document.getElementById("confirmSaveForm").click();
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
        }
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
                                   className="kt-subheader__breadcrumbs-link" style={{cursor: "text"}}>
                                    Collecte
                                </a>
                                <span className="kt-subheader__separator kt-hidden"/>
                                <div className="kt-subheader__breadcrumbs">
                                    <a href="#icone" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                                    <span className="kt-subheader__breadcrumbs-separator"/>
                                    <a href="#button" onClick={e => e.preventDefault()}
                                       className="kt-subheader__breadcrumbs-link" style={{cursor: "text"}}>
                                        Enrégistrement réclamation
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <InfirmationTable
                        information={"Formulaire d'enregistrement d'une réclamation. Utilisez ce formulaire pour enregistrer les réclamations de vos clients."}
                    />
                    <div className="row">
                        <div className="col">
                            <div className="kt-portlet">
                                <div className="kt-portlet__head">
                                    <div className="kt-portlet__head-label">
                                        <h3 className="kt-portlet__head-title">
                                            Enregistrement réclamation
                                        </h3>
                                    </div>

                                    <div className="kt-portlet__head-toolbar">
                                        <div className="kt-portlet__head-wrapper">&nbsp;
                                            <div className="dropdown dropdown-inline">
                                                <a href={`${appConfig.apiDomaine}/download-excel/claims`} download={true} className="btn mr-1 btn-secondary">Télécharger Format</a>
                                                <NavLink to={"/process/claims/import"} className="btn ml-1 btn-primary">Importer Réclamations</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="kt-form">
                                    <div className="kt-portlet__body">

                                        {
                                            verifyPermission(props.userPermissions, 'store-claim-against-any-institution') || verifyPermission(props.userPermissions, 'store-claim-without-client') ? (
                                                <div className={error.institution_targeted_id.length ? "form-group row validated" : "form-group row"}>
                                                    <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="institution">Institution concernée <InputRequire/></label>
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
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>
                                            ) : null
                                        }

                                        <div className="kt-section">
                                            <div className="kt-section__body">
                                                <h3 className="kt-section__title kt-section__title-lg"> Client:</h3>

                                                {
                                                    !verifyPermission(props.userPermissions, 'store-claim-without-client') ? (
                                                        <div className="form-group row">
                                                            <div className={"col d-flex align-items-center mt-4"}>
                                                                <label className="kt-checkbox">
                                                                    <input type="checkbox" value={disabledInput} onChange={handleDisabledInputChange}/>
                                                                    Le client est-il déjà enregistré ?<span/>
                                                                </label>
                                                            </div>

                                                            <div className={"col"}>
                                                                <div className="row" onFocus={e => setShowSearchResult(true)} onBlur={e => blur()}>
                                                                    <div className="col d-flex">
                                                                        <input
                                                                            style={{marginTop: "2rem", borderBottomRightRadius: "0px", borderTopRightRadius: "0px"}}
                                                                            type="text"
                                                                            value={searchInputValue}
                                                                            onChange={e => setSearchInputValue(e.target.value)}
                                                                            placeholder={"Rechercher un client..."}
                                                                            className="form-control"
                                                                            disabled={!disabledInput}
                                                                        />

                                                                        <button
                                                                            style={{marginTop: "2rem", borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px"}}
                                                                            type="button"
                                                                            className="btn btn-primary btn-icon"
                                                                            disabled={!disabledInput || startSearch}
                                                                            onClick={(e) => searchClient()}
                                                                        >
                                                                            <i className="fa fa-search"/>
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {
                                                                    disabledInput ? (
                                                                        searchList.length ? (
                                                                            <div className="row">
                                                                                <div className={ showSearchResult ? `dropdown-menu show` : `dropdown-menu` } aria-labelledby="dropdownMenuButton" x-placement="bottom-start" style={{width: "100%", position: "absolute", willChange: "transform", top: "33px", left: "0px", transform: "translate3d(0px, 38px, 0px)", zIndex: "1"}}>
                                                                                    {
                                                                                        searchList.map((el, index) => (
                                                                                            <span
                                                                                                onClick={(e) => handleCustomerChange(e, el)}
                                                                                                key={index}
                                                                                                className="dropdown-item"
                                                                                                style={{cursor: "pointer"}}
                                                                                            >
                                                                                                {el.fullName}
                                                                                            </span>
                                                                                        ))
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="row">
                                                                                <div className={ showSearchResult ? `dropdown-menu show` : `dropdown-menu` } aria-labelledby="dropdownMenuButton" x-placement="bottom-start" style={{width: "100%", position: "absolute", willChange: "transform", top: "33px", left: "0px", transform: "translate3d(0px, 38px, 0px)", zIndex: "1"}}>
                                                                                    {
                                                                                        startSearch ? (
                                                                                            <span className={"mt-3 mb-3"}><Loader/></span>
                                                                                        ) : (
                                                                                            <span className="d-flex justify-content-center">Pas de resultat</span>
                                                                                        )
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    ) : null
                                                                }
                                                            </div>
                                                        </div>
                                                    ) : null
                                                }

                                                <div className="form-group row">
                                                    <div className={error.lastname.length ? "col validated" : "col"}>
                                                        <label htmlFor="lastname">Nom <InputRequire/></label>
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
                                                            ) : null
                                                        }
                                                    </div>

                                                    <div className={error.firstname.length ? "col validated" : "col"}>
                                                        <label htmlFor="firstname">Prénom (s) <InputRequire/></label>
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
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <div className={error.firstname.length ? "form-group col validated" : "form-group col"}>
                                                        <label htmlFor="sexe">Sexe <InputRequire/></label>
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
                                                            <option value="A">Autres</option>
                                                        </select>
                                                        {
                                                            error.sexe.length ? (
                                                                error.sexe.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : null
                                                        }
                                                    </div>
                                                    <div className={error.ville.length ? "col validated" : "col"}>
                                                        <label htmlFor="ville">Ville</label>
                                                        <input
                                                            disabled={disabledInput}
                                                            id="ville"
                                                            type="text"
                                                            className={error.ville.length ? "form-control is-invalid" : "form-control"}
                                                            placeholder="Veillez entrer votre ville"
                                                            value={data.ville ? data.ville : ""}
                                                            onChange={(e) => onChangeVille(e)}
                                                        />
                                                        {
                                                            error.ville.length ? (
                                                                error.ville.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <div className={error.telephone.length ? "col validated" : "col"}>
                                                        <label htmlFor="telephone">Téléphone(s)<WithoutCode/> <InputRequire/></label>
                                                        <TagsInput disabled={disabledInput} value={data.telephone} onChange={onChangeTelephone} inputProps={{className: 'react-tagsinput-input', placeholder: 'Numéro(s)'}} />
                                                        {
                                                            error.telephone.length ? (
                                                                error.telephone.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : null
                                                        }
                                                    </div>

                                                    <div className={error.email.length ? "col validated" : "col"}>
                                                        <label htmlFor="email"> Email(s) {responseChannel ? <InputRequire/> : null}</label>
                                                        <TagsInput disabled={disabledInput} value={data.email} onChange={onChangeEmail} inputProps={{className: 'react-tagsinput-input', placeholder: 'Email(s)'}}/>
                                                        {
                                                            error.email.length ? (
                                                                error.email.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : null
                                                        }
                                                    </div>


                                                </div>
                                            </div>
                                        </div>

                                        <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg"/>

                                        <div className="kt-section">
                                            <div className="kt-section__body">
                                                <h3 className="kt-section__title kt-section__title-lg"> Réclamation:</h3>
                                                {
                                                    !verifyPermission(props.userPermissions, 'store-claim-without-client') ? (
                                                        <div className="form-group row">
                                                            <div className={error.unit_targeted_id.length ? "col validated" : "col"}>
                                                                <label htmlFor="unit">Unité concernée</label>
                                                                <Select
                                                                    value={unit}
                                                                    isClearable
                                                                    placeholder={"Veuillez sélectionner l'unité concernée"}
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
                                                                    ) : null
                                                                }
                                                            </div>

                                                            <div className={error.account_targeted_id.length ? "col validated" : "col"}>
                                                                <label htmlFor="account">Numéro de compte concerné</label>
                                                                <Select
                                                                    isClearable
                                                                    value={account}
                                                                    placeholder={"Veuillez sélectionner le compte concerné"}
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
                                                                    ) : null
                                                                }
                                                            </div>
                                                        </div>
                                                    ) : null
                                                }

                                                <div className="form-group row">
                                                    <div className={error.request_channel_slug.length ? "col validated" : "col"}>
                                                        <label htmlFor="receptionChannel">Canal de réception <InputRequire/></label>
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
                                                            ) : null
                                                        }
                                                    </div>

                                                    <div className={error.response_channel_slug.length ? "col validated" : "col"}>
                                                        <label htmlFor="responseChannel">Canal de réponse <InputRequire/></label>
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
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <div className={"col"}>
                                                        <label htmlFor="claimCtegory">Catégorie de réclamation </label>
                                                        <Select
                                                            isClearable
                                                            placeholder={"Veillez selectionner la catégorie de réclamation"}
                                                            value={claimCategory}
                                                            onChange={onChangeClaimCategory}
                                                            options={claimCategories}
                                                        />
                                                    </div>

                                                    <div className={error.claim_object_id.length ? "col validated" : "col"}>
                                                        <label htmlFor="claimObject">Objet de réclamation <InputRequire/></label>
                                                        <Select
                                                            isClearable
                                                            placeholder={"Veillez selectionner l'objet de réclamation"}
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
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <div className={error.amount_disputed.length ? "col validated" : "col"}>
                                                        <label htmlFor="amount_claim">Montant réclamé (<strong className="text-danger">Laisser vide si pas de montant</strong>)</label>
                                                        <input
                                                            type={"number"}
                                                            id="amount_claim"
                                                            min="0"
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
                                                            ) : null
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
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <div className={error.event_occured_at.length ? "col validated" : "col"}>
                                                        <label htmlFor="date">Date de l'évernement <InputRequire/></label>
                                                        <input
                                                            type={"datetime-local"}
                                                            id="date"
                                                            className={error.event_occured_at.length ? "form-control is-invalid" : "form-control"}
                                                            placeholder="Veillez entrer la date de l'evernement"
                                                            value={data.event_occured_at}
                                                            max={maxDate}
                                                            onChange={(e) => handleEventOccuredAt(e)}
                                                        />
                                                        {
                                                            error.event_occured_at.length ? (
                                                                error.event_occured_at.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : null
                                                        }
                                                    </div>

                                                    {
                                                        verifyPermission(props.userPermissions, "store-claim-without-client") ? (
                                                            <div className={error.relationship_id.length ? "col validated" : "col"}>
                                                                <label htmlFor="relationship">Relation du reclamant avec l'institution <InputRequire/></label>
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
                                                                    ) : null
                                                                }
                                                            </div>
                                                        ) : null
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
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <div className={error.description.length ? "col validated" : "col"}>
                                                        <label htmlFor="description">Description <InputRequire/></label>
                                                        <textarea
                                                            rows="7"
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
                                                            ) : null
                                                        }
                                                    </div>

                                                    <div className={error.claimer_expectation.length ? "col validated" : "col"}>
                                                        <label htmlFor="claimer_expectation">Attente</label>
                                                        <textarea
                                                            rows="7"
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
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg"/>

                                        <div className="kt-section">
                                            <div className="kt-section__body">
                                                <h3 className="kt-section__title kt-section__title-lg">Relance: <InputRequire/></h3>

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

                                        {completionError.list.length ? (
                                            <div className="kt-section">
                                                <div className="kt-section__body">
                                                    <div className="form-group row">
                                                        <div className="col-12">
                                                            <div className="alert alert-warning fade show" role="alert">
                                                                <div className="alert-icon"><i
                                                                    className="flaticon-warning"/></div>
                                                                <div className="alert-text">
                                                                    <p>La réclamation a été enregistrée avec succès sous la référence <strong>{completionError.ref}</strong></p>
                                                                    <p>Cependant elle est incomplète</p>
                                                                    <p>Les informations qu'il reste à fournir sont les suivants :</p>
                                                                    <ul className="ml-4">
                                                                        {completionError.list.map((el, index) => (
                                                                            <li key={index}>-  {el.description["fr"]}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                                <div className="alert-close">
                                                                    <button type="button" className="close"
                                                                            data-dismiss="alert" aria-label="Close">
                                                                        <span aria-hidden="true"><i className="la la-close"/></span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
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
                                            <button style={{display: "none"}} id="confirmSaveForm" type="button" className="btn btn-bold btn-label-brand btn-sm" data-toggle="modal" data-target="#kt_modal_4_2">
                                                Launch Modal
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
                                            ville={foundData.entity.ville ? foundData.entity.ville : null}
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
                                            closeModal={closeModal}
                                            currency={currency}
                                            currencies={currencies}
                                            institution={institution}
                                            institutions={institutions}
                                            endPoint={endPoint}
                                            fileValue={document.getElementById("customFile").value}
                                        />
                                    ) : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan,
        currentUserInstitution: state.user.user.staff.institution_id,
    };
};

export default connect(mapStateToProps)(ClaimAdd);
