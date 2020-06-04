import React, {useState} from "react";
import {loadCss, loadScript} from "../../../../helpers/function";
import appConfig from "../../../../config/appConfig";
import axios from "axios";
import * as authActions from "../../../../store/actions/authActions";
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
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const onChangeUserName = (e) => {
        setUserName(e.target.value)
    };
    const onChangePassword = (e) => {
        setPassword(e.target.value)
    };
    const onClickConnectButton = () => {
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
                    ToastBottomEnd.fire(toastConnectSuccessMessageConfig);
                    const user = response.data;
                    localStorage.setItem("userData", JSON.stringify(response.data));
                    localStorage.setItem('token', token);
                    window.location.href = "/dashboard";
                });

            })
            .catch(error => {
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

                                            <form className="kt-form" action="" noValidate="novalidate"
                                                  id="kt_login_form"
                                                  style={{marginBottom: '142px'}}>
                                                <div className="form-group">
                                                    <input className="form-control" type="email"
                                                           placeholder="Votre Email"
                                                           name="username" autoComplete="off"
                                                           onChange={(e) => onChangeUserName(e)}
														   value={username}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <input className="form-control" type="password"
                                                           placeholder="Votre Mot de Passe"
                                                           name="password" autoComplete="off"
                                                           onChange={(e) => onChangePassword(e)}
														   value={password}
                                                    />
                                                </div>

                                                <div className="kt-login__actions">
                                                    <a href="#" className="kt-link kt-login__link-forgot">
                                                        Mot de passe oublié ?
                                                    </a>
                                                    <button id="kt_login_signin_submit"
                                                            className="btn btn-primary btn-elevate kt-login__btn-primary"
                                                            onClick={onClickConnectButton}>
                                                        Se connecter
                                                    </button>
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
