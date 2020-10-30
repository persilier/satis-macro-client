import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import Select from "react-select";
import {Link, useParams} from "react-router-dom";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastEditErrorMessageConfig, toastEditSuccessMessageConfig
} from "../../config/toastConfig";
import appConfig from "../../config/appConfig";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import {formatSelectOption} from "../../helpers/function";
import {AUTH_TOKEN} from "../../constants/token";
import InputRequire from "../components/InputRequire";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

const UserEdit = (props) => {
    const {id} = useParams();

    document.title = "Satis client - Paramètre Envoie de mail";
    if (!(verifyPermission(props.userPermissions, 'show-user-any-institution') || verifyPermission(props.userPermissions, "show-user-my-institution")))
        window.location.href = ERROR_401;

    const defaultData = {
        roles: [],
        new_password: "",
        new_password_confirmation: "",
    };
    const defaultError = {
        roles: [],
        new_password: [],
    };
    const [data, setData] = useState(defaultData);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);
    const [roles, setRoles] = useState([]);
    const [role, setRole] = useState([]);

    const formatDefaultRoles = (userRoles) => {
        const listRoles = [];
        userRoles.map(r => listRoles.push(r.name));
        return listRoles;
    };

    useEffect(() => {
        async function fetchData () {
            let endpoint = "";
            if (props.plan === "MACRO" || props.plan === "HUB") {
                if (verifyPermission(props.userPermissions, "show-user-any-institution"))
                    endpoint = `${appConfig.apiDomaine}/any/users/${id}/change-role-password`;
                if (verifyPermission(props.userPermissions, "show-user-my-institution"))
                    endpoint = `${appConfig.apiDomaine}/my/users/${id}/change-role-password`;
            }
            else if(props.plan === "PRO")
                endpoint = `${appConfig.apiDomaine}/my/users/${id}/change-role-password`;

            await axios.get(endpoint)
                .then(({data}) => {
                    const newData = {...defaultData};
                    newData.roles = formatDefaultRoles(data.user.roles);
                    setRole(formatSelectOption(data.user.roles, "name", false, "name"));
                    setRoles(formatSelectOption(data.roles, "name", false, "name"));
                    setUser(data.user);
                    setData(newData);
                })
                .catch(error => {
                    console.log("Something is wrong");
                })
            ;
        }
        fetchData();
    }, [props.plan, appConfig.apiDomaine]);

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

    const handlePasswordChange = (e) => {
        const newData = {...data};
        newData.new_password = e.target.value;
        setData(newData);
    };

    const handlePasswordConfirmationChange = (e) => {
        const newData = {...data};
        newData.new_password_confirmation = e.target.value;
        setData(newData);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setStartRequest(true);
        let endpoint = "";
        if (props.plan === "MACRO" || props.plan === "HUB") {
            if (verifyPermission(props.userPermissions, "show-user-any-institution"))
                endpoint = `${appConfig.apiDomaine}/any/users/${id}/change-role-password`;
            if (verifyPermission(props.userPermissions, "show-user-my-institution"))
                endpoint = `${appConfig.apiDomaine}/my/users/${id}/change-role-password`;
        }
        else if(props.plan === "PRO")
            endpoint = `${appConfig.apiDomaine}/my/users/${id}/change-role-password`;

        await axios.put(endpoint, data)
            .then(response => {
                setStartRequest(false);
                const newData = {...data};
                newData.new_password = "";
                newData.new_password_confirmation = "";
                setError(defaultError);
                setData(newData);
                ToastBottomEnd.fire(toastEditSuccessMessageConfig);
            })
            .catch(errorRequest => {
                setStartRequest(false);
                setError({...defaultError, ...errorRequest.response.data.error});
                ToastBottomEnd.fire(toastEditErrorMessageConfig);
            })
        ;
    };

    return (
        verifyPermission(props.userPermissions, 'show-user-any-institution') || verifyPermission(props.userPermissions, "show-user-my-institution") ? (
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
                                    Modification
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
                                            <div className={error.roles.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label">
                                                    <strong>Utilisateur</strong>
                                                </label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <h4>{ user ? user.identite.lastname : "......." } { user ? user.identite.firstname : "......." }</h4>
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

                                            <div className={error.new_password.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="password">Mot de passe</label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <input
                                                        id="password"
                                                        type="password"
                                                        className={error.new_password.length ? "form-control is-invalid" : "form-control"}
                                                        placeholder="************"
                                                        value={data.new_password}
                                                        onChange={(e) => handlePasswordChange(e)}
                                                    />
                                                    {
                                                        error.new_password.length ? (
                                                            error.new_password.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : null
                                                    }
                                                </div>
                                            </div>

                                            <div className={"form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="password_confirmation">Confirmation</label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <input
                                                        id="password_confirmation"
                                                        type="password"
                                                        className={"form-control"}
                                                        placeholder="************"
                                                        value={data.new_password_confirmation}
                                                        onChange={(e) => handlePasswordConfirmationChange(e)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="kt-portlet__foot">
                                            <div className="kt-form__actions text-right">
                                                {
                                                    !startRequest ? (
                                                        <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-primary">Modifier</button>
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
        plan: state.plan.plan
    };
};

export default connect(mapStateToProps)(UserEdit);
