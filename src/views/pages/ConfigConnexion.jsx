import React, {useEffect, useState} from "react";
import {loadCss} from "../../helpers/function";
import {connect} from "react-redux";
import InfirmationTable from "../components/InfirmationTable";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import Loader from "../components/Loader";
import InputRequire from "../components/InputRequire";
import {verifyTokenExpire} from "../../middleware/verifyToken";
import axios from "axios";
import appConfig from "../../config/appConfig";
import {ToastBottomEnd} from "../components/Toast";
import {toastEditErrorMessageConfig, toastEditSuccessMessageConfig} from "../../config/toastConfig";



loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const ConfigConnexion = (props) => {
    document.title = "Satis client - Paramètre Connexion";

    if (!verifyPermission(props.userPermissions, "update-components-parameters"))
        window.location.href = ERROR_401;

    const defaultData = {
        inactivity_time: 0,
        password_expiration_time: 0,
        history_max_passwords: 0,
        days_before_expiration: 0,
        msg_imminent_password_expiration: "",
        msg_for_password_expiration: "",
        max_missing_attempts: 0,
        max_time_between_attempts: 0,
        waiting_time_after_max_attempts: 0,
    };
    const defaultError = {
        inactivity_time: [],
        password_expiration_time: [],
        history_max_passwords: [],
        days_before_expiration: [],
        msg_imminent_password_expiration: [],
        msg_for_password_expiration: [],
        max_missing_attempts: [],
        max_time_between_attempts: [],
        waiting_time_after_max_attempts: [],

    };

    const [load, setLoad] = useState(false);
    const [startRequest, setStartRequest] = useState(false);

    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [isInactivityTime, setIsInactivityTime] = useState(false);
    const [isPasswordExpiration, setIsPasswordExpiration] = useState(false);
    const [isMissingLoginAttempts, setIsMissingLoginAttempts] = useState(false);

    // Begin useEffect

    useEffect(() => {
        async function fetchData () {
            setLoad(true);
            await axios.get(`${appConfig.apiDomaine}/configurations/reject-unit-transfer-limitation`)
                .then(response => {
                    setData({
                        inactivity_time: 0,
                        password_expiration_time: 0,
                        history_max_passwords: 0,
                        days_before_expiration: 0,
                        msg_imminent_password_expiration: "",
                        msg_for_password_expiration: "",
                        max_missing_attempts: 0,
                        max_time_between_attempts: 0,
                        waiting_time_after_max_attempts: 0,
                    })
                    console.log(response);
                    setLoad(false);
                })
                .catch(error => {
                    console.log("Something is wrong");
                    setLoad(false);
                })
        }

        if (verifyTokenExpire())
            fetchData();
    }, [])

    // Begin On Submit
    const onSubmit = async (e) => {
        e.preventDefault();
        const sendData = {...data};
        setStartRequest(true);

        if (verifyTokenExpire()) {
            await axios.put(`${appConfig.apiDomaine}/configurations/`, sendData)
                .then(response => {
                    setStartRequest(false);
                    setError(defaultError);
                    ToastBottomEnd.fire(toastEditSuccessMessageConfig);
                })
                .catch(errorRequest => {
                    setStartRequest(false);
                    setError({...defaultError, ...errorRequest.response.data.error});
                    ToastBottomEnd.fire(toastEditErrorMessageConfig);
                })
            ;
        }

    }

    // Begin Inactivity

    const onChangeIsInactivityTime = (e) => {
        const newData = {...data};
        newData.inactivity_time = 0;
        setData(newData);
        setIsInactivityTime(e.target.checked);
    }

    const onChangeInactivityTime = (e) => {
        const newData = {...data};
        newData.inactivity_time = e.target.value;
        setData(newData);
    }

    // Begin Password Expiration

    const onChangeIsPasswordExpiration = (e) => {
        const newData = {...data};
        newData.password_expiration_time = 0;
        newData.history_max_passwords = 0;
        newData.days_before_expiration = 0;
        newData.msg_imminent_password_expiration = "";
        newData.msg_for_password_expiration = "";
        setData(newData);
        setIsPasswordExpiration(e.target.checked);
    }

    const onChangePasswordExpirationTime = (e) => {
        const newData = {...data};
        newData.password_expiration_time = e.target.value;
        setData(newData);
    }

    const onChangeHistoryMaxPasswords = (e) => {
        const newData = {...data};
        newData.history_max_passwords = e.target.value;
        setData(newData);
    }

    const onChangeDaysBeforeExpiration = (e) => {
        const newData = {...data};
        newData.days_before_expiration = e.target.value;
        setData(newData);
    }

    const onChangeMessageImminentPasswordExpiration = (e) => {
        const newData = {...data};
        newData.msg_imminent_password_expiration = e.target.value;
        setData(newData);
    }

    const onChangeMessageForPasswordExpiration = (e) => {
        const newData = {...data};
        newData.msg_for_password_expiration = e.target.value;
        setData(newData);
    }

    // Begin Missing Login Attempts

    const onChangeIsMissingLoginAttempts = (e) => {
        const newData = {...data};
        newData.max_missing_attempts = 0;
        newData.max_time_between_attempts = 0;
        newData.waiting_time_after_max_attempts = 0;
        setData(newData);
        setIsMissingLoginAttempts(e.target.checked);
    }

    const onChangeMaxMissingAttempts = (e) => {
        const newData = {...data};
        newData.max_missing_attempts = e.target.value;
        setData(newData);
    }

    const onChangeMaxTimeBetweenAttempts = (e) => {
        const newData = {...data};
        newData.max_time_between_attempts = e.target.value;
        setData(newData);
    }

    const onChangeWaitingTimeAfterMaxAttempts = (e) => {
        const newData = {...data};
        newData.waiting_time_after_max_attempts = e.target.value;
        setData(newData);
    }

    return (
        load ? (
            <Loader/>
        ) : (
            verifyPermission(props.userPermissions, 'update-min-fusion-percent-parameters') ? (
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
                                    <a href="#button" onClick={e => e.preventDefault()}
                                       className="kt-subheader__breadcrumbs-link">
                                        Configurer connexion
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">

                        <InfirmationTable
                            information={"Configuration du processus de connexion"}
                        />

                        <div className="row">
                            <div className="col">
                                <div className="kt-portlet">

                                    <div className="kt-portlet__head">
                                        <div className="kt-portlet__head-label">
                                            <h3 className="kt-portlet__head-title">
                                                Configurer connexion
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="kt-form">

                                        <div className="kt-portlet__body">

                                            <div className="kt-section">
                                                <div className="kt-section__body">
                                                    <h3 className="kt-section__title kt-section__title-lg">Temps d'inactivité</h3>

                                                    <div className="form-group row">
                                                        <label className="col-4 col-form-label">Contrôle du temps d'inactivité <InputRequire/></label>
                                                        <div className="col-3">
                                                            <span className="kt-switch">
                                                                <label>
                                                                    <input
                                                                        id="is_inactivity_time"
                                                                        type="checkbox"
                                                                        value={isInactivityTime}
                                                                        onChange={(e => onChangeIsInactivityTime(e))}
                                                                    />
                                                                    <span />
                                                                </label>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className={error.inactivity_time.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="inactivity_time">Durée d'inactivité maximale tolérée <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <input
                                                                disabled={!isInactivityTime}
                                                                required={isInactivityTime}
                                                                id="inactivity_time"
                                                                type="number"
                                                                className={error.inactivity_time.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.inactivity_time}
                                                                onChange={(e => onChangeInactivityTime(e))}
                                                            />
                                                            {
                                                                error.inactivity_time.length ? (
                                                                    error.inactivity_time.map((error, index) => (
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
                                                    <h3 className="kt-section__title kt-section__title-lg">Expiration du mot de passe</h3>

                                                    <div className="form-group row">
                                                        <label className="col-4 col-form-label">Expiration du mot de passe <InputRequire/></label>
                                                        <div className="col-3">
                                                            <span className="kt-switch">
                                                                <label>
                                                                    <input
                                                                        id="is_password_expiration"
                                                                        type="checkbox"
                                                                        value={isPasswordExpiration}
                                                                        onChange={(e => onChangeIsPasswordExpiration(e))}
                                                                    />
                                                                    <span />
                                                                </label>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className={error.password_expiration_time.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="password_expiration_time">Durée de vie d'un mot de passe <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <input
                                                                disabled={!isPasswordExpiration}
                                                                required={isPasswordExpiration}
                                                                id="password_expiration_time"
                                                                type="number"
                                                                className={error.password_expiration_time.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.password_expiration_time}
                                                                onChange={(e => onChangePasswordExpirationTime(e))}
                                                            />
                                                            {
                                                                error.password_expiration_time.length ? (
                                                                    error.password_expiration_time.map((error, index) => (
                                                                        <div key={index} className="invalid-feedback">
                                                                            {error}
                                                                        </div>
                                                                    ))
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className={error.history_max_passwords.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="history_max_passwords">Nombre maximal de mot de passe dans l'historique des mot de passe  <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <input
                                                                disabled={!isPasswordExpiration}
                                                                required={isPasswordExpiration}
                                                                id="history_max_passwords"
                                                                type="number"
                                                                className={error.history_max_passwords.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.history_max_passwords}
                                                                onChange={(e => onChangeHistoryMaxPasswords(e))}
                                                            />
                                                            {
                                                                error.history_max_passwords.length ? (
                                                                    error.history_max_passwords.map((error, index) => (
                                                                        <div key={index} className="invalid-feedback">
                                                                            {error}
                                                                        </div>
                                                                    ))
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className={error.days_before_expiration.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="days_before_expiration">Nombre de jours restants avant expiration du mot de passe à partir duquel on peut notifier l'utilisateur <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <input
                                                                disabled={!isPasswordExpiration}
                                                                required={isPasswordExpiration}
                                                                id="days_before_expiration"
                                                                type="number"
                                                                className={error.days_before_expiration.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.days_before_expiration}
                                                                onChange={(e => onChangeDaysBeforeExpiration(e))}
                                                            />
                                                            {
                                                                error.days_before_expiration.length ? (
                                                                    error.days_before_expiration.map((error, index) => (
                                                                        <div key={index} className="invalid-feedback">
                                                                            {error}
                                                                        </div>
                                                                    ))
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className={error.msg_imminent_password_expiration.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="imminent_password_expiration">Message texte à envoyer à l'utilisateur pour le notifier que l'expiration de son mot de passe est imminent <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <textarea
                                                                disabled={!isPasswordExpiration}
                                                                required={isPasswordExpiration}
                                                                rows="7"
                                                                id="imminent_password_expiration"
                                                                className={error.msg_imminent_password_expiration.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.msg_imminent_password_expiration}
                                                                onChange={(e) => onChangeMessageImminentPasswordExpiration(e)}
                                                            />
                                                            {
                                                                error.msg_imminent_password_expiration.length ? (
                                                                    error.msg_imminent_password_expiration.map((error, index) => (
                                                                        <div key={index} className="invalid-feedback">
                                                                            {error}
                                                                        </div>
                                                                    ))
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className={error.msg_for_password_expiration.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="for_password_expiration">Message texte à envoyer à l'utilisateur le jour de l'expiration de son mot de passe <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <textarea
                                                                disabled={!isPasswordExpiration}
                                                                required={isPasswordExpiration}
                                                                rows="7"
                                                                id="for_password_expiration"
                                                                className={error.msg_for_password_expiration.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.msg_for_password_expiration}
                                                                onChange={(e) => onChangeMessageForPasswordExpiration(e)}
                                                            />
                                                            {
                                                                error.msg_for_password_expiration.length ? (
                                                                    error.msg_for_password_expiration.map((error, index) => (
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
                                                    <h3 className="kt-section__title kt-section__title-lg">Tentatives de connexion</h3>

                                                    <div className="form-group row">
                                                        <label className="col-4 col-form-label">Tentatives de connexion manquées <InputRequire/></label>
                                                        <div className="col-3">
                                                            <span className="kt-switch">
                                                                <label>
                                                                    <input
                                                                        id="is_missing_login_attempts"
                                                                        type="checkbox"
                                                                        value={isMissingLoginAttempts}
                                                                        onChange={(e => onChangeIsMissingLoginAttempts(e))}
                                                                    />
                                                                    <span />
                                                                </label>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className={error.max_missing_attempts.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="max_missing_attempts">Nombre maximal de tentatives manquées tolérable <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <input
                                                                disabled={!isMissingLoginAttempts}
                                                                required={isMissingLoginAttempts}
                                                                id="max_missing_attempts"
                                                                type="number"
                                                                className={error.max_missing_attempts.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.max_missing_attempts}
                                                                onChange={(e => onChangeMaxMissingAttempts(e))}
                                                            />
                                                            {
                                                                error.max_missing_attempts.length ? (
                                                                    error.max_missing_attempts.map((error, index) => (
                                                                        <div key={index} className="invalid-feedback">
                                                                            {error}
                                                                        </div>
                                                                    ))
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className={error.max_time_between_attempts.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="max_time_between_attempts">Durée maximale requise entre deux tentatives  <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <input
                                                                disabled={!isMissingLoginAttempts}
                                                                required={isMissingLoginAttempts}
                                                                id="max_time_between_attempts"
                                                                type="number"
                                                                className={error.max_time_between_attempts.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.max_time_between_attempts}
                                                                onChange={(e => onChangeMaxTimeBetweenAttempts(e))}
                                                            />
                                                            {
                                                                error.max_time_between_attempts.length ? (
                                                                    error.max_time_between_attempts.map((error, index) => (
                                                                        <div key={index} className="invalid-feedback">
                                                                            {error}
                                                                        </div>
                                                                    ))
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className={error.waiting_time_after_max_attempts ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="waiting_time_after_max_attempts">Temps d'attente après atteinte du nombre maximal de tentatives manquées tolérable <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <input
                                                                disabled={!isMissingLoginAttempts}
                                                                required={isMissingLoginAttempts}
                                                                id="waiting_time_after_max_attempts"
                                                                type="number"
                                                                className={error.waiting_time_after_max_attempts.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.waiting_time_after_max_attempts}
                                                                onChange={(e => onChangeWaitingTimeAfterMaxAttempts(e))}
                                                            />
                                                            {
                                                                error.waiting_time_after_max_attempts.length ? (
                                                                    error.waiting_time_after_max_attempts.map((error, index) => (
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

                                        <div className="kt-portlet__foot">
                                            <div className="kt-form__actions">
                                                {
                                                    !startRequest ? (
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary"
                                                        >
                                                            Enregistrer
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                                            type="button" disabled>
                                                            Chargement...
                                                        </button>
                                                    )
                                                }

                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            ) : null
        )
    )
}

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan,
    };
};

export default connect(mapStateToProps)(ConfigConnexion);