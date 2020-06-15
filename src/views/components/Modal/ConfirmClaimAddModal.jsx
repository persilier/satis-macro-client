import React, {useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import FormInformation from "../../components/FormInformation";
import TagsInput from "react-tagsinput";
import Select from "react-select";
import appConfig from "../../../config/appConfig";
import {AUTH_TOKEN} from "../../../constants/token";
import {formatSelectOption, formatToTimeStamp} from "../../../helpers/function";
import {ToastBottomEnd} from "../../components/Toast";
import {
    toastAddSuccessMessageConfig,
    toastEditErrorMessageConfig,
} from "../../../config/toastConfig";
import {verifyPermission} from "../../../helpers/permission";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

const ConfirmClaimAddModal = props => {
    const defaultData = {
        firstname: props.firstname,
        lastname: props.lastname,
        sexe: props.sexe,
        telephone: JSON.parse(props.telephone),
        email: JSON.parse(props.email),
        ville: props.ville,
        unit_targeted_id: props.unit_targeted_id,
        institution_targeted_id: props.institution_targeted_id,
        account_targeted_id: props.account_targeted_id,
        claim_object_id: props.claim_object_id,
        request_channel_slug: props.request_channel_slug,
        response_channel_slug: props.response_channel_slug,
        claimer_expectation: props.claimer_expectation,
        description: props.description,
        amount_currency_slug: props.amount_currency_slug,
        amount_disputed: props.amount_disputed,
        claimer_id: props.claimer_id,
        event_occured_at: props.event_occured_at,
        is_revival: props.is_revival,
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
        event_occured_at: [],
        is_revival: [],
    };

    const option1 = 1;
    const option2 = 0;

    const [claimObject, setClaimObject] = useState(props.claimObject);
    const [claimObjects, setClaimObjects] = useState(props.claimObjects);
    const [claimCategory, setClaimCategory] = useState(props.claimCategory);
    const claimCategories = props.claimCategories;
    const [accounts, setAccounts] = useState(props.accounts);
    const [account, setAccount] = useState(props.account);
    const [units, setUnits] = useState(props.units);
    const [unit, setUnit] = useState(props.unit);
    const responseChannels = props.responseChannels;
    const channels = props.channels;
    const [responseChannel, setResponseChannel] = useState(props.responseChannel);
    const [receptionChannel, setReceptionChannel] = useState(props.receptionChannel);
    const [currency, setCurrency] = useState(props.currency);
    const currencies = props.currencies;
    const [disabledInput, setDisabledInput] = useState(props.disabledInput);
    const [customer, setCustomer] = useState(props.customer);
    const [possibleCustomers, setPossibleCustomers] = useState(props.possibleCustomers);
    const [institution, setInstitution] = useState(props.institution);
    const institutions = props.institutions;
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

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
        setInstitution(selected);
        const newData = {...data};
        newData.institution_targeted_id = selected.value;
        axios.get(`${appConfig.apiDomaine}/institutions/${selected.value}/clients`)
            .then(response => {
                setPossibleCustomers(formatPossibleCustomers(response.data.client_institutions));
                setUnits([{value: "other", label: "Pas d'unité concèrner"}, ...formatSelectOption(response.data.units, "name", "fr")])
            })
            .catch(error => {
                console.log("Something is wrong");
            });
        setData(newData);
    };

    const handleDisabledInputChange = () => {
        if (disabledInput) {
            const newData = {...data};
            setCustomer({});
            setAccount({});
            setAccounts([]);
            newData.firstname = "";
            newData.lastname = "";
            newData.sexe = "";
            newData.telephone = [];
            newData.email = [];
            newData.ville = "";
            setData(newData);
        }
        setDisabledInput(!disabledInput);
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

    const handleCustomerChange = (selected) => {
        setCustomer(selected);
        const newData = {...data};
        setAccount({});
        setAccounts(formatSelectOption(selected.accounts, "number", false));
        newData.firstname = selected.firstname;
        newData.lastname = selected.lastname;
        newData.sexe = selected.sexe;
        newData.telephone = selected.telephone;
        newData.email = selected.email;
        newData.ville = selected.ville;
        newData.claimer_id = selected.claimer_id;
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

    const onSubmit = (e) => {
        const newData = {...data};
        newData.event_occured_at = formatToTimeStamp(data.event_occured_at);
        e.preventDefault();
        console.log(newData);
        setStartRequest(true);
        if (!newData.response_channelf_slug)
            delete newData.response_channel_slug;
        if (!newData.unit_targeted_id)
            delete newData.unit_targeted_id;
        if (!newData.account_targeted_id)
            delete newData.account_targeted_id;
        axios.post(props.endPoint.storeKnowingIdentity(props.id), newData)
            .then(async (response) => {
                ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                await setInstitution({});
                await setClaimCategory({});
                await setCurrency({});
                await setResponseChannel({});
                await setReceptionChannel({});
                await setClaimObject({});
                await setClaimObjects([]);
                await setAccounts([]);
                await setAccount({});
                await setUnits([]);
                await setUnit({});
                await setDisabledInput(false);
                await setCustomer({});
                await setPossibleCustomers([]);
                await setStartRequest(false);
                await setError(defaultError);
                await setData(defaultData);
                document.getElementById("closeConfirmSaveForm").click();
                await props.resetFoundData();
            })
            .catch(errorRequest => {
                setStartRequest(false);
                setError({...defaultError, ...errorRequest.response.data.error});
                ToastBottomEnd.fire(toastEditErrorMessageConfig);
            })
        ;
    };

    const onClickClose = async () => {
        await setInstitution({});
        await setClaimCategory({});
        await setCurrency({});
        await setResponseChannel({});
        await setReceptionChannel({});
        await setClaimObject({});
        await setClaimObjects([]);
        await setAccounts([]);
        await setAccount({});
        await setUnits([]);
        await setUnit({});
        await setDisabledInput(false);
        await setCustomer({});
        await setPossibleCustomers([]);
        await setData(defaultData);
        await document.getElementById("closeButton").click();
        await props.resetFoundData();
    };

    return (
        <div className="modal fade" id="kt_modal_4" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" role="dialog" data-backdrop="false"
             style={{ display: "block", paddingRight: "17px"}} aria-modal="true">
            <div className="modal-dialog modal-lg" role="document" style={{boxShadow: "0px 4px 23px 6px rgba(0,0,0,0.75)"}}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Enregistrement reclamation</h5>
                        <button onClick={(e) => onClickClose(e)} type="button" className="close"/>
                        <button id="closeButton" style={{display: "none"}} type="button" className="close" data-dismiss="modal" aria-label="Close"/>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="kt-portlet__body">
                                <FormInformation
                                    information={props.message}
                                />

                                <div className="kt-section kt-section--first">
                                    <div className="kt-section__body">
                                        {
                                            verifyPermission(props.userPermissions, 'store-claim-against-any-institution') ? (
                                                <div className={error.institution_targeted_id.length ? "form-group row validated" : "form-group row"}>
                                                    <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="institution">Institution concernée</label>
                                                    <div className="col-lg-9 col-xl-6">
                                                        <Select
                                                            classNamePrefix="select"
                                                            className="basic-single"
                                                            placeholder={"Veillez selectioner l'institution"}
                                                            value={institution}
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

                                        <div className="kt-section kt-section--first">
                                            <div className="kt-section__body">
                                                <h3 className="kt-section__title kt-section__title-lg">Informations Client:</h3>

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
                                                            classNamePrefix="select"
                                                            className="basic-single"
                                                            isDisabled={!disabledInput}
                                                            placeholder={"Veillez selectioner le client"}
                                                            value={customer}
                                                            onChange={handleCustomerChange}
                                                            options={possibleCustomers}
                                                        />
                                                    </div>
                                                </div>

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
                                                        <TagsInput disabled={disabledInput} value={data.telephone} onChange={onChangeTelephone} />
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
                                                        <TagsInput disabled={disabledInput} value={data.email} onChange={onChangeEmail} />
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

                                            <div className="m-3" style={{borderTop: "1px solid #A0AEC0"}}/>
                                        </div>

                                        <div className="kt-section kt-section--first">
                                            <div className="kt-section__body">
                                                <h3 className="kt-section__title kt-section__title-lg">Informations Réclamation:</h3>
                                                <div className="form-group row">
                                                    <div className={error.unit_targeted_id.length ? "col validated" : "col"}>
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

                                                    <div className={error.account_targeted_id.length ? "col validated" : "col"}>
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
                                                </div>

                                                <div className="form-group row">
                                                    <div className={error.request_channel_slug.length ? "col validated" : "col"}>
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

                                                    <div className={error.response_channel_slug.length ? "col validated" : "col"}>
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

                                                    <div className={error.claim_object_id.length ? "col validated" : "col"}>
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
                                                    <div className={error.event_occured_at.length ? "col validated" : "col"}>
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
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        {
                            !startRequest ? (
                                <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-primary">Submit</button>
                            ) : (
                                <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                    Loading...
                                </button>
                            )
                        }
                        <button id="closeConfirmSaveForm" style={{display: "none"}} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(ConfirmClaimAddModal);
