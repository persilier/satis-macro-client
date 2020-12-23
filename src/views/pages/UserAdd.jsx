import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import Select from "react-select";
import {Link} from "react-router-dom";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
    toastSuccessMessageWithParameterConfig,
} from "../../config/toastConfig";
import appConfig from "../../config/appConfig";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import InputRequire from "../components/InputRequire";
import {formatSelectOption} from "../../helpers/function";
import {AUTH_TOKEN} from "../../constants/token";
import {verifyTokenExpire} from "../../middleware/verifyToken";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

const UserAdd = (props) => {
    document.title = "Satis client - Paramètre Envoie de mail";
    if (!(verifyPermission(props.userPermissions, 'store-user-any-institution') || verifyPermission(props.userPermissions, "store-user-my-institution")))
        window.location.href = ERROR_401;

    const optionOne = 1;
    const optionTwo = 0;
    const defaultData = {
        identite_id: "",
        roles: [],
        activate: optionTwo,
        institution_id: "",
        password: "",
        password_confirmation: "",
    };
    const defaultError = {
        identite_id: [],
        roles: [],
        activate: [],
        institution_id: [],
        password: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);
    const [institutions, setInstitutions] = useState([]);
    const [institution, setInstitution] = useState(null);
    const [identities, setIdentities] = useState([]);
    const [identity, setIdentity] = useState(null);
    const [roles, setRoles] = useState([]);
    const [role, setRole] = useState([]);
    const activePilot = institution ? institution.value === props.activeUserInstitution : "" === props.activeUserInstitution;

    useEffect(() => {
        async function fetchData () {
            let endpoint = "";
            if (props.plan === "MACRO") {
                if (verifyPermission(props.userPermissions, "store-user-any-institution"))
                    endpoint = `${appConfig.apiDomaine}/any/users/create`;
                if (verifyPermission(props.userPermissions, "store-user-my-institution"))
                    endpoint = `${appConfig.apiDomaine}/my/users/create`;
            }
            else if(props.plan === "HUB")
                endpoint = `${appConfig.apiDomaine}/any/users/create`;
            else if(props.plan === "PRO")
                endpoint = `${appConfig.apiDomaine}/my/users/create`;

            await axios.get(endpoint)
                .then(({data}) => {
                    if (verifyPermission(props.userPermissions, "store-user-any-institution"))
                        setInstitutions(formatSelectOption(data, "name", false));
                    else {
                        setRoles(formatSelectOption(data.roles, "name", false, "name"));
                        setIdentities(formatSelectOption(formatIdentities(data.identites), "fullName", false));
                    }

                })
                .catch(error => {
                    console.log("Something is wrong");
                })
            ;
        }
        if (verifyTokenExpire())
            fetchData();
    }, [props.plan, appConfig.apiDomaine]);

    const handleIdentityChange = (selected) => {
        const newData = {...data};
        newData.identite_id = selected ? selected.value : "";
        setIdentity(selected);
        setData(newData);
    };

    const formatSelected = (selected) => {
        const newSelected = [];
        selected.map(s => newSelected.push(s.value));
        return newSelected;
    };

    const handleRoleChange = (selected) => {
        const newData = {...data};
        newData.roles = selected ? formatSelected(selected) : [];
        setRole(selected);
        setData(newData);
    };

    const handleOptionChange = (e) => {
        const newData = {...data};
        newData.activate = parseInt(e.target.value);
        setData(newData);
    };

    const handlePasswordChange = (e) => {
        const newData = {...data};
        newData.password = e.target.value;
        setData(newData);
    };

    const handlePasswordConfirmationChange = (e) => {
        const newData = {...data};
        newData.password_confirmation = e.target.value;
        setData(newData);
    };

    const formatStaff = function (options, labelKey, valueKey = "id") {
        const newOptions = [];
        for (let i = 0; i < options.length; i++) {
            newOptions.push({value: (options[i])[valueKey], label: (options[i])[labelKey], staff_id: options[i].staff.id});
        }
        return newOptions;
    };

    const formatIdentities = (identityList) => {
        for (let i = 0; i < identityList.length; i++)
            identityList[i].fullName = `${identityList[i].lastname} ${identityList[i].firstname}`;
        return identityList
    };

    const loadStaff = async (institutionId) => {
        if (institutionId) {
            if (verifyTokenExpire()) {
                await axios.get(`${appConfig.apiDomaine}/any/users/${institutionId}/create`)
                    .then(({data}) => {
                        setRoles(formatSelectOption(data.roles, "name", false, "name"));
                        setIdentities(formatStaff(formatIdentities(data.identites), "fullName"));
                    })
                    .catch(() => console.log("Something is wrong"))
                ;
            }
        }
    };

    const handleInstitutionChange = (selected) => {
        const newData = {...defaultData, roles: []};
        newData.institution_id = selected ? selected.value : "";
        setInstitution(selected);
        setRole(null);
        setIdentity(null);
        setData(newData);
        loadStaff(selected ? selected.value : null);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setStartRequest(true);
        let endpoint = "";
        if (props.plan === "MACRO") {
            if (verifyPermission(props.userPermissions, "store-user-any-institution"))
                endpoint = `${appConfig.apiDomaine}/any/users`;
            if (verifyPermission(props.userPermissions, "store-user-my-institution"))
                endpoint = `${appConfig.apiDomaine}/my/users`;
        }
        else if(props.plan === "HUB")
            endpoint = `${appConfig.apiDomaine}/any/users`;
        else if(props.plan === "PRO")
            endpoint = `${appConfig.apiDomaine}/my/users`;

        if (verifyTokenExpire()) {
            if ((data.roles.includes("pilot-filial") || data.roles.includes('pilot-holding')) && activePilot) {
                const addUser = await axios.post(endpoint, data)
                    .then(response => {
                        setStartRequest(false);
                        setError(defaultError);
                        setData(defaultData);
                        setRole(null);
                        setInstitution(null);
                        return true;
                    })
                    .catch(errorRequest => {
                        setStartRequest(false);
                        setError({...defaultError, ...errorRequest.response.data.error});
                        ToastBottomEnd.fire(toastAddErrorMessageConfig);
                        return false;
                    })
                ;

                if (addUser) {
                    if (data.activate === 1) {
                        setStartRequest(true);
                        const active = await axios.put(`${appConfig.apiDomaine}/active-pilot/institutions/${data.institution_id}`, {staff_id: identity.staff_id})
                            .then(({data}) => {
                                setStartRequest(false);
                                setIdentity(null);
                                return true;
                            })
                            .catch(({response}) => {
                                setStartRequest(false);
                                setIdentity(null);
                                return false;
                            })
                        ;

                        if (addUser && active) {
                            ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig("Utilisateur enregistré et désigné comme pilote"));
                        }

                        if (addUser && !active) {
                            ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig("Utilisateur enregistré mais non défini comme pilote actif"));
                        }
                    } else {
                        setIdentity(null);
                        ToastBottomEnd.fire(toastAddSuccessMessageConfig)
                    }
                }
            } else {
                const addUser = await axios.post(endpoint, data)
                    .then(response => {
                        setStartRequest(false);
                        setError(defaultError);
                        setData(defaultData);
                        setRole(null);
                        setInstitution(null);
                        return true;
                    })
                    .catch(errorRequest => {
                        setStartRequest(false);
                        setError({...defaultError, ...errorRequest.response.data.error});
                        ToastBottomEnd.fire(toastAddErrorMessageConfig);
                        return false;
                    })
                ;

                if (addUser) {
                    setIdentity(null);
                    ToastBottomEnd.fire(toastAddSuccessMessageConfig)
                }
            }
        }
    };

    return (
        verifyPermission(props.userPermissions, 'store-user-any-institution') || verifyPermission(props.userPermissions, "store-user-my-institution") ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Paramètre
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <Link to="/settings/users" className="kt-subheader__breadcrumbs-link">
                                    Utilisateur
                                </Link>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link" style={{cursor: "text"}}>
                                    Ajout
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
                                            Utilisateur
                                        </h3>
                                    </div>
                                </div>

                                <form method="POST" className="kt-form">
                                    <div className="kt-form kt-form--label-right">
                                        <div className="kt-portlet__body">
                                            {
                                                verifyPermission(props.userPermissions, "store-user-any-institution") ? (
                                                    <div className={error.institution_id.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="institution">Institution <InputRequire/></label>
                                                        <div className="col-lg-9 col-xl-6">
                                                            <Select
                                                                isClearable
                                                                value={institution}
                                                                placeholder={"SATIS"}
                                                                onChange={handleInstitutionChange}
                                                                options={institutions}
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
                                                    </div>
                                                ) : null
                                            }

                                            <div className={error.identite_id.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="staff">Agent<InputRequire/></label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <Select
                                                        isClearable
                                                        value={identity}
                                                        placeholder={"HOUNSSOU Romaric"}
                                                        onChange={handleIdentityChange}
                                                        options={identities}
                                                    />
                                                    {
                                                        error.identite_id.length ? (
                                                            error.identite_id.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : null
                                                    }
                                                </div>
                                            </div>

                                            <div className={error.roles.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor={"role"}>Role <InputRequire/></label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <Select
                                                        isClearable
                                                        isMulti
                                                        value={role}
                                                        placeholder={"admin-satis"}
                                                        onChange={handleRoleChange}
                                                        options={roles}
                                                    />
                                                    {
                                                        error.roles.length ? (
                                                            error.roles.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : null
                                                    }
                                                </div>
                                            </div>

                                            {
                                                (data.roles.includes("pilot-filial") || data.roles.includes('pilot-holding')) && activePilot ? (
                                                    <div className={error.activate.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-3 col-form-label" htmlFor={"role"}>Pilote actif <InputRequire/></label>
                                                        <div className="col-lg-9 col-xl-6">
                                                            <div className="kt-radio-inline">
                                                                <label className="kt-radio">
                                                                    <input type="radio" className={error.activate.length ? "form-control is-invalid" : "form-control"}  value={optionOne} onChange={handleOptionChange} checked={optionOne === data.activate}/> OUI<span/>
                                                                </label>
                                                                <label className="kt-radio">
                                                                    <input type="radio" className={error.activate.length ? "form-control is-invalid" : "form-control"} value={optionTwo} onChange={handleOptionChange} checked={optionTwo === data.activate}/> NON<span/>
                                                                </label>
                                                            </div>
                                                            {
                                                                error.activate.length ? (
                                                                    error.activate.map((error, index) => (
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

                                            <div className={error.password.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="password">Mot de passe <InputRequire/></label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <input
                                                        id="password"
                                                        type="password"
                                                        className={error.password.length ? "form-control is-invalid" : "form-control"}
                                                        placeholder="************"
                                                        value={data.password}
                                                        onChange={(e) => handlePasswordChange(e)}
                                                    />
                                                    {
                                                        error.password.length ? (
                                                            error.password.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : null
                                                    }
                                                </div>
                                            </div>

                                            <div className={"form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="password_confirmation">Confirmation <InputRequire/></label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <input
                                                        id="password_confirmation"
                                                        type="password"
                                                        className={"form-control"}
                                                        placeholder="************"
                                                        value={data.password_confirmation}
                                                        onChange={(e) => handlePasswordConfirmationChange(e)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="kt-portlet__foot">
                                            <div className="kt-form__actions text-right">
                                                {
                                                    !startRequest ? (
                                                        <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-primary">Enregistrer</button>
                                                    ) : (
                                                        <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                                            Chargement...
                                                        </button>
                                                    )
                                                }

                                                <Link to={"/settings/users"} className="btn btn-secondary mx-2">Quitter</Link>
                                            </div>
                                        </div>
                                    </div>
                                </form>
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
        activeUserInstitution: state.user.user.institution.id,
        plan: state.plan.plan
    };
};

export default connect(mapStateToProps)(UserAdd);
