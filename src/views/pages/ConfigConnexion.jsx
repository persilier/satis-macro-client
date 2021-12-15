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
        id: 0,
        inactivity_control: false,
        inactivity_time_limit: 0,
        password_expiration_control: false,
        password_lifetime: 0,
        max_password_histories: 0,
        password_notif_delay: 0,
        password_notif_msg: "",
        password_expiration_msg: "",
        block_attempt_control: false,
        max_attempt: 0,
        attempt_delay: 0,
        attempt_waiting_time: 0,
    };
    const defaultError = {
        id: [],
        inactivity_control: [],
        inactivity_time_limit: [],
        password_lifetime: [],
        max_password_histories: [],
        password_notif_delay: [],
        password_notif_msg: [],
        password_expiration_msg: [],
        max_attempt: [],
        attempt_delay: [],
        attempt_waiting_time: [],

    };

    const [load, setLoad] = useState(false);
    const [startRequest, setStartRequest] = useState(false);

    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);

    // Begin useEffect

    useEffect(() => {
        async function fetchData () {
            setLoad(true);
            await axios.get(`${appConfig.apiDomaine}/auth-config`)
                .then(({data}) => {
                    setData({
                        id: data.id ? data.id: 0,
                        inactivity_control: JSON.parse(data.data.fr).inactivity_control,
                        inactivity_time_limit: JSON.parse(data.data.fr).inactivity_time_limit,
                        password_expiration_control: JSON.parse(data.data.fr).password_expiration_control,
                        password_lifetime: JSON.parse(data.data.fr).password_lifetime,
                        max_password_histories: JSON.parse(data.data.fr).max_password_histories,
                        password_notif_delay: JSON.parse(data.data.fr).password_notif_delay,
                        password_notif_msg: JSON.parse(data.data.fr).password_notif_msg,
                        password_expiration_msg: JSON.parse(data.data.fr).password_expiration_msg,
                        block_attempt_control: JSON.parse(data.data.fr).block_attempt_control,
                        max_attempt: JSON.parse(data.data.fr).max_attempt,
                        attempt_delay: JSON.parse(data.data.fr).attempt_delay,
                        attempt_waiting_time: JSON.parse(data.data.fr).attempt_waiting_time,
                    })
                    console.log(JSON.parse(data.data.fr));
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

        if (!sendData.inactivity_control)
            delete sendData.inactivity_time_limit;

        if (!sendData.password_expiration_control) {
            delete sendData.password_lifetime;
            delete sendData.password_notif_delay;
            delete sendData.max_password_histories;
            delete sendData.password_expiration_msg;
            delete sendData.password_notif_msg;
        }

        if (!sendData.block_attempt_control) {
            delete sendData.attempt_delay;
            delete sendData.attempt_waiting_time;
            delete sendData.max_attempt;
        }

        setStartRequest(true);

        if (verifyTokenExpire()) {
            await axios.put(`${appConfig.apiDomaine}/auth-config`, sendData)
                .then(response => {
                    setStartRequest(false);
                    setError(defaultError);
                    ToastBottomEnd.fire(toastEditSuccessMessageConfig);
                })
                .catch(errorRequest => {
                    setStartRequest(false);
                    setError({...defaultError, ...errorRequest.response.data.error});
                    ToastBottomEnd.fire(toastEditErrorMessageConfig);
                });
        }

    }

    // Begin Inactivity

    const onChangeInactivityControl = (e) => {
        const newData = {...data};
        newData.inactivity_control = e.target.checked;

        setData(newData);
    }

    const onChangeInactivityTime = (e) => {
        const newData = {...data};
        newData.inactivity_time_limit = e.target.value;
        setData(newData);
    }

    // Begin Password Expiration

    const onChangePasswordExpirationControl = (e) => {
        const newData = {...data};
        newData.password_expiration_control = e.target.checked;

        setData(newData);
    }

    const onChangePasswordExpirationTime = (e) => {
        const newData = {...data};
        newData.password_lifetime = e.target.value;
        setData(newData);
    }

    const onChangeHistoryMaxPasswords = (e) => {
        const newData = {...data};
        newData.max_password_histories = e.target.value;
        setData(newData);
    }

    const onChangeDaysBeforeExpiration = (e) => {
        const newData = {...data};
        newData.password_notif_delay = e.target.value;
        setData(newData);
    }

    const onChangeMessageImminentPasswordExpiration = (e) => {
        const newData = {...data};
        newData.password_notif_msg = e.target.value;
        setData(newData);
    }

    const onChangeMessageForPasswordExpiration = (e) => {
        const newData = {...data};
        newData.password_expiration_msg = e.target.value;
        setData(newData);
    }

    // Begin Missing Login Attempts

    const onChangeBlockAttempt = (e) => {
        const newData = {...data};

        newData.block_attempt_control = e.target.checked;

        setData(newData);
    }

    const onChangeMaxMissingAttempts = (e) => {
        const newData = {...data};
        newData.max_attempt = e.target.value;
        setData(newData);
    }

    const onChangeMaxTimeBetweenAttempts = (e) => {
        const newData = {...data};
        newData.attempt_delay = e.target.value;
        setData(newData);
    }

    const onChangeWaitingTimeAfterMaxAttempts = (e) => {
        const newData = {...data};
        newData.attempt_waiting_time = e.target.value;
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
                                                                        id="inactivity_control"
                                                                        type="checkbox"
                                                                        checked={data.inactivity_control}
                                                                        onChange={(e => onChangeInactivityControl(e))}
                                                                    />
                                                                    <span />
                                                                </label>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className={error.inactivity_time_limit.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="inactivity_time_limit">Durée d'inactivité maximale tolérée en jours <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <input
                                                                disabled={!data.inactivity_control}
                                                                required={data.inactivity_control}
                                                                id="inactivity_time_limit"
                                                                type="number"
                                                                className={error.inactivity_time_limit.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.inactivity_time_limit}
                                                                onChange={(e => onChangeInactivityTime(e))}
                                                            />
                                                            {
                                                                error.inactivity_time_limit.length ? (
                                                                    error.inactivity_time_limit.map((error, index) => (
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
                                                                        checked={data.password_expiration_control}
                                                                        onChange={(e => onChangePasswordExpirationControl(e))}
                                                                    />
                                                                    <span />
                                                                </label>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className={error.password_lifetime.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="password_lifetime">Durée de vie d'un mot de passe en jours <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <input
                                                                disabled={!data.password_expiration_control}
                                                                required={data.password_expiration_control}
                                                                id="password_lifetime"
                                                                type="number"
                                                                className={error.password_lifetime.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.password_lifetime}
                                                                onChange={(e => onChangePasswordExpirationTime(e))}
                                                            />
                                                            {
                                                                error.password_lifetime.length ? (
                                                                    error.password_lifetime.map((error, index) => (
                                                                        <div key={index} className="invalid-feedback">
                                                                            {error}
                                                                        </div>
                                                                    ))
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className={error.max_password_histories.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="max_password_histories">Nombre maximal de mot de passe dans l'historique des mot de passe  <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <input
                                                                disabled={!data.password_expiration_control}
                                                                required={data.password_expiration_control}
                                                                id="max_password_histories"
                                                                type="number"
                                                                className={error.max_password_histories.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.max_password_histories}
                                                                onChange={(e => onChangeHistoryMaxPasswords(e))}
                                                            />
                                                            {
                                                                error.max_password_histories.length ? (
                                                                    error.max_password_histories.map((error, index) => (
                                                                        <div key={index} className="invalid-feedback">
                                                                            {error}
                                                                        </div>
                                                                    ))
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className={error.password_notif_delay.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="password_notif_delay">Nombre de jours restants avant expiration du mot de passe à partir duquel on peut notifier l'utilisateur <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <input
                                                                disabled={!data.password_expiration_control}
                                                                required={data.password_expiration_control}
                                                                id="password_notif_delay"
                                                                type="number"
                                                                className={error.password_notif_delay.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.password_notif_delay}
                                                                onChange={(e => onChangeDaysBeforeExpiration(e))}
                                                            />
                                                            {
                                                                error.password_notif_delay.length ? (
                                                                    error.password_notif_delay.map((error, index) => (
                                                                        <div key={index} className="invalid-feedback">
                                                                            {error}
                                                                        </div>
                                                                    ))
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className={error.password_notif_msg.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="imminent_password_expiration">Message à envoyer à l'utilisateur pour le notifier que l'expiration de son mot de passe est imminent <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <textarea
                                                                disabled={!data.password_expiration_control}
                                                                required={data.password_expiration_control}
                                                                rows="7"
                                                                id="imminent_password_expiration"
                                                                className={error.password_notif_msg.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.password_notif_msg}
                                                                onChange={(e) => onChangeMessageImminentPasswordExpiration(e)}
                                                            />
                                                            {
                                                                error.password_notif_msg.length ? (
                                                                    error.password_notif_msg.map((error, index) => (
                                                                        <div key={index} className="invalid-feedback">
                                                                            {error}
                                                                        </div>
                                                                    ))
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className={error.password_expiration_msg.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="for_password_expiration">Message à envoyer à l'utilisateur le jour de l'expiration de son mot de passe <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <textarea
                                                                disabled={!data.password_expiration_control}
                                                                required={data.password_expiration_control}
                                                                rows="7"
                                                                id="for_password_expiration"
                                                                className={error.password_expiration_msg.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.password_expiration_msg}
                                                                onChange={(e) => onChangeMessageForPasswordExpiration(e)}
                                                            />
                                                            {
                                                                error.password_expiration_msg.length ? (
                                                                    error.password_expiration_msg.map((error, index) => (
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
                                                                        checked={data.block_attempt_control}
                                                                        onChange={(e => onChangeBlockAttempt(e))}
                                                                    />
                                                                    <span />
                                                                </label>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className={error.max_attempt.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="max_attempt">Nombre maximal de tentatives manquées tolérable <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <input
                                                                disabled={!data.block_attempt_control}
                                                                required={data.block_attempt_control}
                                                                id="max_attempt"
                                                                type="number"
                                                                className={error.max_attempt.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.max_attempt}
                                                                onChange={(e => onChangeMaxMissingAttempts(e))}
                                                            />
                                                            {
                                                                error.max_attempt.length ? (
                                                                    error.max_attempt.map((error, index) => (
                                                                        <div key={index} className="invalid-feedback">
                                                                            {error}
                                                                        </div>
                                                                    ))
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className={error.attempt_delay.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="attempt_delay">Durée maximale requise entre deux tentatives en minutes <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <input
                                                                disabled={!data.block_attempt_control}
                                                                required={data.block_attempt_control}
                                                                id="attempt_delay"
                                                                type="number"
                                                                className={error.attempt_delay.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.attempt_delay}
                                                                onChange={(e => onChangeMaxTimeBetweenAttempts(e))}
                                                            />
                                                            {
                                                                error.attempt_delay.length ? (
                                                                    error.attempt_delay.map((error, index) => (
                                                                        <div key={index} className="invalid-feedback">
                                                                            {error}
                                                                        </div>
                                                                    ))
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className={error.attempt_waiting_time ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="attempt_waiting_time">Temps d'attente après atteinte du nombre maximal de tentatives manquées tolérable en minutes <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <input
                                                                disabled={!data.block_attempt_control}
                                                                required={data.block_attempt_control}
                                                                id="attempt_waiting_time"
                                                                type="number"
                                                                className={error.attempt_waiting_time.length ? "form-control is-invalid" : "form-control"}
                                                                value={data.attempt_waiting_time}
                                                                onChange={(e => onChangeWaitingTimeAfterMaxAttempts(e))}
                                                            />
                                                            {
                                                                error.attempt_waiting_time.length ? (
                                                                    error.attempt_waiting_time.map((error, index) => (
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
                                                            onClick={e => {onSubmit(e)}}
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