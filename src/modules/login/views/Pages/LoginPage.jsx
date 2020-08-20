import React, {useState} from "react";
import {loadCss, loadScript} from "../../../../helpers/function";
import appConfig from "../../../../config/appConfig";
import axios from "axios";
import {connect} from 'react-redux';
import {ToastBottomEnd} from "../../../../views/components/Toast";
import {
	toastConnectErrorMessageConfig,
	toastConnectSuccessMessageConfig
} from "../../../../config/toastConfig";
import {listConnectData} from "../../../../constants/userClient";

loadCss("/assets/css/pages/login/login-1.css");
loadScript("/assets/js/pages/custom/login/login-1.js");

const LoginPage = (props) => {

    const defaultError = {
        username: [],
        password: [],
        // grant_type:[],
        // client_id: [],
        // client_secret:[]
    };
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    const onChangeUserName = (e) => {
        setUserName(e.target.value)
    };
    const onChangePassword = (e) => {
        setPassword(e.target.value)
    };
    const onClickConnectButton = (e) => {
        e.preventDefault(e)
        setStartRequest(true);
        const formData = {
            grant_type: listConnectData[props.plan].grant_type,
            client_id: listConnectData[props.plan].client_id,
            client_secret: listConnectData[props.plan].client_secret,
            username: username,
            password: password
        };
        axios.post(appConfig.apiDomaine +`/oauth/token`, formData)
            .then(response => {
                const token = response.data.access_token;
                axios.get(appConfig.apiDomaine +`/login`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }).then(response => {
                    setError(defaultError);
                    setStartRequest(false);
                    ToastBottomEnd.fire(toastConnectSuccessMessageConfig);
                    const user = response.data;
                    localStorage.setItem("userData", JSON.stringify(response.data));
                    localStorage.setItem("staffData", response.data.staff.identite_id);
                    localStorage.setItem('token', token);
                    window.location.href = "/dashboard";
                });

            })
            .catch(error => {
                console.log(defaultError, error.response.data.error,"ERROR");
                // setError({...defaultError, ...error.response.data.error});
                setStartRequest(false);
				ToastBottomEnd.fire(toastConnectErrorMessageConfig);
            })
        ;
    };
    return (

        <div className="kt-grid kt-grid--ver kt-grid--root kt-page">
            <div className="kt-grid kt-grid--hor kt-grid--root  kt-login kt-login--v1" id="kt_login">
                <div
                    className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile">

                    <div className="kt-grid kt-grid--ver kt-grid--root kt-page">
                        <div className="kt-grid kt-grid--hor kt-grid--root  kt-login kt-login--v1"
                             id="kt_login">
                            <div
                                className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile">

                                <div
                                    className="kt-grid__item kt-grid__item--order-tablet-and-mobile-2 kt-grid kt-grid--hor kt-login__aside"
                                    style={{backgroundImage: "url(/assets/media/bg/bg-4.jpg)"}}>
                                    <div className="kt-grid__item">
                                        <a href="/login" className="kt-login__logo">
                                            <img src="/assets/images/satisLogo.png"/>
                                            <span style={{
                                                color: "white",
                                                fontSize: "1.5em",
                                                paddingLeft: "5px"
                                            }}>{props.plan}  {appConfig.version}</span>
                                        </a>
                                    </div>
                                    <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver">
                                        <div className="kt-grid__item kt-grid__item--middle">
                                            <h3 className="kt-login__title">Bienvenue sur {appConfig.appFullName(props.plan)}!</h3>
                                            <h4 className="kt-login__subtitle">Votre nouvel outil de gestion des
                                                plaintes.</h4>
                                        </div>
                                    </div>
                                    <div className="kt-grid__item">
                                        <div className="kt-login__info">
                                            <div className="kt-login__copyright">
                                                &copy {appConfig.appFullName(props.plan)}
                                            </div>
                                            <div className="kt-login__menu">
                                                <a href="#" className="kt-link">Privacy</a>
                                                <a href="#" className="kt-link">Legal</a>
                                                <a href="#" className="kt-link">Contact</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="kt-grid__item kt-grid__item--fluid kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper">
                                    <div className="kt-login__body">


                                        <div className="kt-login__form">
                                            <div className="kt-login__title" style={{marginTop: '175px'}}>
                                                <h3>Connexion</h3>
                                            </div>

                                            <form className="kt-form" noValidate={"novalidate"} id="kt_login__form" style={{marginBottom: '142px'}}>
                                                <div className={error.username.length ? "form-group row validated" : "form-group row"}>

                                                    <input
                                                        className={error.username.length ? "form-control is-invalid" : "form-control"}

                                                        aria-describedby={'username-error'}
                                                        type="email"
                                                           placeholder="Votre Email"
                                                           name="username"
                                                           onChange={(e) => onChangeUserName(e)}
														   value={username}
                                                    />
                                                    {/*<div id="username-error" className="error invalid-feedback">This*/}
                                                    {/*    field is required.*/}
                                                    {/*</div>*/}
                                                    {
                                                        error.username.length ? (
                                                            error.username.map((error, index) => (
                                                                <div key={index}
                                                                     className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>
                                                <div className={error.password.length ? "form-group row validated" : "form-group row"}>

                                                <input
                                                    className={error.password.length ? "form-control is-invalid" : "form-control"}
                                                       type="password"
                                                           placeholder="Votre Mot de Passe"
                                                           name="password"
                                                           onChange={(e) => onChangePassword(e)}
														   value={password}
                                                    />
                                                    {
                                                        error.password.length ? (
                                                            error.password.map((error, index) => (
                                                                <div key={index}
                                                                     className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>

                                                <div className="kt-login__actions">
                                                    <a href="#" className="kt-link kt-login__link-forgot">
                                                        Mot de passe oublié ?
                                                    </a>
                                                    {
                                                        !startRequest ? (
                                                            <button type="submit"
                                                                    id="kt_login_signin_submit"
                                                                    className="btn btn-primary btn-elevate kt-login__btn-primary"
                                                                    onClick={onClickConnectButton}> Se connecter</button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                                                type="button" disabled>
                                                                Chargement...
                                                            </button>
                                                        )
                                                    }

                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
};

const mapStateToProps = state => {
    return {
        plan: state.plan.plan
    };
};

export default connect(mapStateToProps)(LoginPage);
