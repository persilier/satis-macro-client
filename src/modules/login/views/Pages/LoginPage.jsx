import React, {useEffect, useState} from "react";
import {getToken, loadCss, loadScript} from "../../../../helpers/function";
import appConfig from "../../../../config/appConfig";
import axios from "axios";
import {connect} from 'react-redux';
import {ToastBottomEnd} from "../../../../views/components/Toast";
import {
    BrowserRouter, Switch, Route, Link
} from "react-router-dom";

import {
    toastErrorMessageWithParameterConfig,
    toastConnectErrorMessageConfig,
    toastConnectSuccessMessageConfig,
} from "../../../../config/toastConfig";
// import {listConnectData} from "../../../../config/appConfig";
import Loader from "../../../../views/components/Loader";
import "./LoginCss.css"
import ForgotForm from "./ForgotForm";
import ReinitialisationForm from "./ReinitialisationForm";

loadCss("/assets/css/pages/login/login-1.css");
loadScript("/assets/js/pages/custom/login/login-1.js");


const LoginPage = (props) => {
    const tokenData = getToken(window.location.href);

    const defaultError = {
        username: "",
        password: ""
    };
    const defaultData = {
        username: "",
        password: ""
    };
    const [load, setLoad] = useState(true);
    const [data, setData] = useState(defaultData);
    const [componentData, setComponentData] = useState(undefined);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function fetchData() {
            await axios.get(appConfig.apiDomaine + "/components/retrieve-by-name/connection")
                .then(response => {
                    // console.log(response.data,"DATA")
                    setComponentData(response.data);
                    setLoad(false);
                })
                .catch(error => {
                    setLoad(false);
                    console.log("Something is wrong");
                })
            ;
        }

        fetchData();
        return () => mounted = false;
    }, []);

    const onChangeUserName = (e) => {
        const newData = {...data};
        newData.username = e.target.value;
        setData(newData);
    };

    const onChangePassword = (e) => {
        const newData = {...data};
        newData.password = e.target.value;
        setData(newData);
    };
    const onViewPassword = (e) => {
        let input = document.getElementById("password");
        let icon = document.getElementById("icon");
        if (input.type === "password") {
            input.type = "text";
            icon.className = "fa fa-eye"
        } else {
            input.type = "password";
            icon.className = "fa fa-eye-slash"
        }
    };

    const onClickConnectButton = async (e) => {
        e.preventDefault(e);
        setStartRequest(true);

        const formData = {
            grant_type: appConfig.listConnectData[props.plan].grant_type,
            client_id: appConfig.listConnectData[props.plan].client_id,
            client_secret: appConfig.listConnectData[props.plan].client_secret,
            username: data.username,
            password: data.password
        };
        await axios.post(appConfig.apiDomaine + `/oauth/token`, formData)
            .then(response => {

                const token = response.data.access_token;
                const refresh_token = response.data.refresh_token;
                const expire_in = response.data.expires_in;
                axios.get(appConfig.apiDomaine + `/login`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }).then(response => {

                    setError(defaultError);
                    setStartRequest(false);
                    ToastBottomEnd.fire(toastConnectSuccessMessageConfig);
                    const user = response.data;
                    localStorage.setItem("userData", JSON.stringify(response.data));
                    localStorage.setItem('token', token);
                    localStorage.setItem('expire_in', expire_in);
                    var date = new Date();
                    date.setSeconds(date.getSeconds() + expire_in - 180);
                    localStorage.setItem('date_expire', date);
                    localStorage.setItem('refresh_token', refresh_token);
                    window.location.href = "/dashboard";
                });

            })
            .catch(error => {
                setStartRequest(false);

                setError({
                    username: "Email ou mot de passe incorrecte",
                    password: "Email ou mot de passe incorrecte"
                });
                if (error.response.data.code === 429) {
                    ToastBottomEnd.fire(toastErrorMessageWithParameterConfig("Trop de tentative de connexion. Veuillez ressayer dans 5mn."));
                } else {
                    ToastBottomEnd.fire(toastConnectErrorMessageConfig);
                }

            })
        ;
    };
    return (
        load ? (
            <Loader/>
        ) : (
            <BrowserRouter>
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
                                            style={{backgroundImage: `url(${componentData && componentData.params.fr.background.value !== null ? appConfig.apiDomaine + componentData.params.fr.background.value.url : " "})`}}>
                                            <div className="kt-grid__item">
                                            <span className="kt-login__logo">
                                                <img
                                                    src={componentData ? appConfig.apiDomaine + componentData.params.fr.logo.value.url: "/assets/images/satisLogo.png" }/>
                                                <span style={{
                                                    color: "white",
                                                    fontSize: "1em",
                                                    paddingLeft: "5px"
                                                }}>
                                                {componentData ? componentData.params.fr.version.value : props.plan + appConfig.version}
                                            </span>
                                            </span>
                                            </div>
                                            <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver">
                                                <div className="kt-grid__item kt-grid__item--middle">
                                                    <h3 className="kt-login__title"> {componentData ? componentData.params.fr.header.value + componentData.params.fr.version.value : null}</h3>
                                                    <h4 className="kt-login__subtitle"> {componentData ? componentData.params.fr.description.value + " " : null}</h4>
                                                </div>
                                            </div>
                                            <div className="kt-grid__item">
                                                <div className="kt-login__info">
                                                    <div className="kt-login__copyright">
                                                        © {appConfig.appFullName(props.year)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="kt-grid__item kt-grid__item--fluid kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper">
                                            <div className="kt-login__body">

                                                <Switch>
                                                    <Route exact path="/">
                                                        <div className="kt-login__form" style={{paddingTop: '15px'}}>

                                                            <div className="kt-login__title">
                                                                <div className="form-group row"
                                                                     style={{marginTop: '50px'}}>

                                                                    <div className="col-lg-12 col-xl-6">
                                                                        <img
                                                                            id="Image1"
                                                                            src={componentData && componentData.params.fr.owner_logo.value !== null ? appConfig.apiDomaine + componentData.params.fr.owner_logo.value.url : null}
                                                                            alt="logo"
                                                                            style={{
                                                                                maxWidth: "65px",
                                                                                maxHeight: "65px",
                                                                                textAlign: 'center'
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <h3> {componentData ? componentData.params.fr.title.value : ""}</h3>
                                                            </div>

                                                            <form className="kt-form" id="kt_login__form"
                                                                  style={{marginBottom: '90px'}}>
                                                                <div
                                                                    className={error.username.length ? "form-group row validated" : "form-group row"}>

                                                                    <input
                                                                        className={error.username.length ? "form-control is-invalid" : "form-control"}
                                                                        type="email"
                                                                        placeholder="Votre Email"
                                                                        name="username"
                                                                        onChange={(e) => onChangeUserName(e)}
                                                                        value={data.username}
                                                                    />
                                                                    {
                                                                        error.username.length ? (
                                                                            <div className="invalid-feedback">
                                                                                {error.username}
                                                                            </div>
                                                                        ) : null
                                                                    }
                                                                </div>
                                                                <div
                                                                    className={error.password.length ? "form-group row validated input_container" : "form-group row input_container"}>
                                                        <span className="input_icon">
                                                            <i id="icon" className="fa fa-eye-slash" aria-hidden="true"
                                                               onClick={(e) => onViewPassword(e)}></i>
                                                        </span>
                                                                    <input
                                                                        className={error.password.length ? "form-control is-invalid" : "form-control"}
                                                                        type="password"
                                                                        id="password"
                                                                        placeholder="Votre Mot de Passe"
                                                                        name="password"
                                                                        onChange={(e) => onChangePassword(e)}
                                                                        value={data.password}
                                                                    />
                                                                    {
                                                                        error.password.length ? (
                                                                            <div className="invalid-feedback">
                                                                                {error.password}
                                                                            </div>
                                                                        ) : null
                                                                    }
                                                                </div>

                                                                <div className="kt-login__extra text-right mt-2">

                                                                    <Link to="/login/forgot" id="forgot_btn">
                                                                        Mot de passe oublié?
                                                                    </Link>
                                                                </div>
                                                                <div className="kt-login__actions">
                                                                    {
                                                                        !startRequest ? (
                                                                            <button type="submit"
                                                                                    id="kt_login_signin_submit"
                                                                                    className="btn btn-primary btn-elevate kt-login__btn-primary"
                                                                                    onClick={onClickConnectButton}> Se
                                                                                connecter
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
                                                            </form>
                                                        </div>
                                                    </Route>
                                                    <Route exact path="/login">
                                                        <div className="kt-login__form" style={{paddingTop: '15px'}}>

                                                            <div className="kt-login__title">
                                                                <div className="form-group row"
                                                                     style={{marginTop: '50px'}}>

                                                                    <div className="col-lg-12 col-xl-6">
                                                                        <img
                                                                            id="Image1"
                                                                            src={componentData ? appConfig.apiDomaine + componentData.params.fr.owner_logo.value.url : null}
                                                                            alt="logo"
                                                                            style={{
                                                                                maxWidth: "65px",
                                                                                maxHeight: "65px",
                                                                                textAlign: 'center'
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <h3> {componentData ? componentData.params.fr.title.value : ""}</h3>
                                                            </div>

                                                            <form className="kt-form" id="kt_login__form"
                                                                  style={{marginBottom: '90px'}}>
                                                                <div
                                                                    className={error.username.length ? "form-group row validated" : "form-group row"}>

                                                                    <input
                                                                        className={error.username.length ? "form-control is-invalid" : "form-control"}
                                                                        type="email"
                                                                        placeholder="Votre Email"
                                                                        name="username"
                                                                        onChange={(e) => onChangeUserName(e)}
                                                                        value={data.username}
                                                                    />
                                                                    {
                                                                        error.username.length ? (
                                                                            <div className="invalid-feedback">
                                                                                {error.username}
                                                                            </div>
                                                                        ) : null
                                                                    }
                                                                </div>
                                                                <div
                                                                    className={error.password.length ? "form-group row validated input_container" : "form-group row input_container"}>
                                                        <span className="input_icon">
                                                            <i id="icon" className="fa fa-eye-slash" aria-hidden="true"
                                                               onClick={(e) => onViewPassword(e)}></i>
                                                        </span>
                                                                    <input
                                                                        className={error.password.length ? "form-control is-invalid" : "form-control"}
                                                                        type="password"
                                                                        id="password"
                                                                        placeholder="Votre Mot de Passe"
                                                                        name="password"
                                                                        onChange={(e) => onChangePassword(e)}
                                                                        value={data.password}
                                                                    />
                                                                    {
                                                                        error.password.length ? (
                                                                            <div className="invalid-feedback">
                                                                                {error.password}
                                                                            </div>
                                                                        ) : null
                                                                    }
                                                                </div>

                                                                <div className="kt-login__extra text-right mt-2">

                                                                    <Link to="/login/forgot" id="forgot_btn">
                                                                        Mot de passe oublié?
                                                                    </Link>
                                                                </div>
                                                                <div className="kt-login__actions">
                                                                    {
                                                                        !startRequest ? (
                                                                            <button type="submit"
                                                                                    id="kt_login_signin_submit"
                                                                                    className="btn btn-primary btn-elevate kt-login__btn-primary"
                                                                                    onClick={onClickConnectButton}> Se
                                                                                connecter
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
                                                            </form>
                                                        </div>
                                                    </Route>
                                                    <Route exact path="/login/forgot">
                                                        <ForgotForm/>
                                                    </Route>

                                                    <Route exact path={`/forgot-password/${tokenData}`}>
                                                        <ReinitialisationForm
                                                            token={tokenData}
                                                        />
                                                    </Route>
                                                </Switch>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </BrowserRouter>
        )
    );
};

const mapStateToProps = state => {
    return {
        plan: state.plan.plan,
        year: state.year.year
    };
};

export default connect(mapStateToProps)(LoginPage);
