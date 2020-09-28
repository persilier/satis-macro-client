import React, {useState} from "react";
import TagsInput from "react-tagsinput";
import axios from "axios";
import {ToastBottomEnd} from "../Toast";
import {
    toastEditErrorMessageConfig,
    toastEditSuccessMessageConfig,
} from "../../../config/toastConfig";
import {formatSelectOption} from "../../../helpers/function";
import {formatInstitutions} from "../../../helpers/institution";
import Select from "react-select";
import appConfig from "../../../config/appConfig";
import {verifyPermission} from "../../../helpers/permission";
import FormInformation from "../FormInformation";

const endPointConfig = {
    PRO: {
        plan: "PRO",
        confirm: id => `${appConfig.apiDomaine}/my/identites/${id}/client`
    },
    MACRO: {
        plan: "MACRO",
        holding: {
            confirm: id => `${appConfig.apiDomaine}/any/identites/${id}/client`
        },
        filial: {
            confirm: id => `${appConfig.apiDomaine}/my/identites/${id}/client`
        }
    },
};

const ConfirmClientSaveForm = (props) => {
    let endPoint = "";
    if (props.plan === "MACRO") {
        if (verifyPermission(props.userPermissions, 'store-client-from-any-institution') || verifyPermission(props.userPermissions, 'update-client-from-any-institution'))
            endPoint = endPointConfig[props.plan].holding;
        else if (verifyPermission(props.userPermissions, 'store-client-from-my-institution') || verifyPermission(props.userPermissions, 'update-client-from-my-institution'))
            endPoint = endPointConfig[props.plan].filial
    } else
        endPoint = endPointConfig[props.plan];

    const [types, setTypes] = useState(props.types);
    const [clients, setClients] = useState(props.clients);
    const [category, setCategory] = useState(props.category);
    const [categories, setCategories] = useState(props.categories);
    const institutions = props.institutions;
    const [institution, setInstitution] = useState(props.institution);
    const [type, setType] = useState(props.type);
    const [client, setClient] = useState(props.client);

    const defaultData = {
        firstname: props.identite.identite.firstname,
        lastname: props.identite.identite.lastname,
        sexe: props.identite.identite.sexe,
        telephone: JSON.parse(props.identite.identite.telephone),
        email: JSON.parse(props.identite.identite.email),
        ville: props.identite.identite.ville === null ? "" : props.identite.identite.ville,
        type_id: props.type_id,
        client_id: props.client_id,
        category_client_id:props.category_client_id
    };
    const defaultError = {
        name: [],
        firstname: [],
        lastname: [],
        sexe: [],
        telephone: [],
        email: [],
        ville: [],
        type_id: [],
        client_id: [],
        category_client_id:[]
    };
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

    const onChangeUnit = (selected) => {
        const newData = {...data};
        newData.type_id = selected.value;
        setType(selected);
        setData(newData);
    };

    const onChangePosition = (selected) => {
        const newData = {...data};
        newData.client_id = selected.value;
        setClient(selected);
        setData(newData);
    };

    const onChangeInstitution = (selected) => {
        const newData = {...data};
        if (selected) {
            if (verifyPermission(props.userPermissions, 'store-client-from-any-institution') || verifyPermission(props.userPermissions, 'update-client-from-any-institution')) {
                newData.institution_id = selected.value;
                setInstitution(selected);
                axios.get(appConfig.apiDomaine + `/any/clients/${newData.institution_id}/institutions`)
                    .then(response => {
                        const options =
                            response.data ? response.data.map((client) => ({
                                value: client.client_id,
                                label: client.client.identite.firstname + ' ' + client.client.identite.lastname
                            })) : "";
                        setClients(options);
                    });
                setCategory([]);
                setClient([]);
                newData.firstname = "";
                newData.lastname = "";
                newData.sexe = "";
                newData.telephone = [];
                newData.email = [];
                newData.ville = "";
                newData.client_id = [];
                newData.type_id = "";
                newData.category_client_id = "";
            }
        }
        setData(newData);
    };
    const onChangeClient = (selected) => {
        const newData = {...data};
        newData.client_id = selected.value;
        setClient(selected);
        if (newData.client_id) {
            axios.get(appConfig.apiDomaine + `/any/clients/${newData.client_id}`)
                .then(response => {
                    const newIdentity = {
                        firstname: response.data.client.identite.firstname,
                        lastname: response.data.client.identite.lastname,
                        sexe: response.data.client.identite.sexe,
                        telephone: response.data.client.identite.telephone,
                        email: response.data.client.identite.email,
                        ville: response.data.client.identite.ville === null ? "" : response.data.client.identite.ville,
                        client_id: response.data.client_id,
                        institution_id: response.data.institution_id,
                        category_client_id: response.data.category_client_id
                    };
                    setData(newIdentity);
                    setCategory({
                        value: response.data.category_client ? response.data.category_client.id : "",
                        label: response.data.category_client ? response.data.category_client.name.fr : ""
                    });
                });
        }

    };

    const onSubmit = (e) => {
        e.preventDefault();

        setStartRequest(true);
        axios.post(endPoint.confirm(props.identite.id), data)
            .then(async (response) => {
                ToastBottomEnd.fire(toastEditSuccessMessageConfig);
                await setStartRequest(false);
                await setError(defaultError);
                await setTypes([]);
                await setClients([]);
                await setInstitution({});
                await setType({});
                await setClient({});
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

    const onClickClose = async (e) => {
        await setStartRequest(false);
        await setError(defaultError);
        await setTypes([]);
        await setClients([]);
        await setInstitution({});
        await setType({});
        await setClient({});
        await document.getElementById("closeButton").click();
        await props.resetFoundData();
    };

    return (
        <div className="modal fade" id="kt_modal_4" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" role="dialog" data-backdrop="false"
             style={{ display: "block", paddingRight: "17px"}} aria-modal="true">
            <div className="modal-dialog modal-lg" role="document" style={{boxShadow: "0px 4px 23px 6px rgba(0,0,0,0.75)"}}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Ajout d'un client avec des identifiants existant</h5>
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
                                        <h3 className="kt-section__title kt-section__title-lg">Informations personnelles:</h3>
                                        <div className="form-group row">
                                            <div className={error.lastname.length ? "col validated" : "col"}>
                                                <label htmlFor="lastname">Nom</label>
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
                                                    ) : null
                                                }
                                            </div>

                                            <div className={error.firstname.length ? "col validated" : "col"}>
                                                <label htmlFor="firstname">Prénom(s)</label>
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
                                                    ) : null
                                                }
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className={error.firstname.length ? "form-group col validated" : "form-group col"}>
                                                <label htmlFor="sexe">Sexe</label>
                                                <select
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
                                        </div>

                                        <div className="form-group row">
                                            <div className={error.telephone.length ? "col validated" : "col"}>
                                                <label htmlFor="telephone"> Téléphone(s)</label>
                                                <TagsInput value={data.telephone} onChange={onChangeTelephone} />
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
                                                <label htmlFor="email"> Email(s)</label>
                                                <TagsInput value={data.email} onChange={onChangeEmail} />
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

                                            <div className={error.ville.length ? "col validated" : "col"}>
                                                <label htmlFor="ville">Ville</label>
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
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="kt-section">
                                    <div className="kt-section__body">
                                        <h3 className="kt-section__title kt-section__title-lg">Informations professionnelles:</h3>
                                        <div className={"form-group"}>
                                            <div className={"form-group"}>
                                                <label htmlFor="client">Client</label>
                                                <Select
                                                    value={client}
                                                    onChange={onChangePosition}
                                                    options={formatSelectOption(clients, "name", "fr")}
                                                />
                                                {
                                                    error.client_id.length ? (
                                                        error.client_id.map((error, index) => (
                                                            <div key={index} className="invalid-feedback">
                                                                {error}
                                                            </div>
                                                        ))
                                                    ) : null
                                                }
                                            </div>
                                        </div>

                                        <div className={error.type_id.length ? "form-group row validated" : "form-group row"}>
                                            {
                                                verifyPermission(props.userPermissions, 'store-client-from-any-type') || verifyPermission(props.userPermissions, 'update-client-from-any-type') || verifyPermission(props.userPermissions, 'store-client-from-maybe-no-type') || verifyPermission(props.userPermissions, 'update-client-from-maybe-no-type') ? (
                                                    <div className="col">
                                                        <label htmlFor="institution">Institution</label>
                                                        <Select
                                                            value={institution}
                                                            onChange={onChangeInstitution}
                                                            options={formatSelectOption(formatInstitutions(institutions), "name", false)}
                                                        />
                                                        {
                                                            error.institution_id.length ? (
                                                                error.institution_id.map((error, index) => (
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
                                                <label htmlFor="type">Type de compte</label>
                                                <Select
                                                    value={type}
                                                    onChange={onChangeUnit}
                                                    options={formatSelectOption(types, "name", "fr")}
                                                />
                                                {
                                                    error.type_id.length ? (
                                                        error.type_id.map((error, index) => (
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

export default ConfirmClientSaveForm;
