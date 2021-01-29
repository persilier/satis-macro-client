import React, {useEffect, useState} from "react";
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
import Loader from "../../../../views/components/Loader";

loadCss("/assets/css/pages/login/login-1.css");
loadScript("/assets/js/pages/custom/login/login-1.js");


const LoginPage = (props) => {

    const defaultError = {
        username: "",
        password: ""
    };
    const defaultData = {
        username: [],
        password: []
    };
    const [load, setLoad] = useState(true);
    const [username, setUserName] = useState("");
    const [data, setData] = useState(defaultData);
    const [componentData, setComponentData] = useState(defaultData);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function fetchData() {
            await axios.get(appConfig.apiDomaine + "/components/retrieve-by-name/connection")
                .then(response => {
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
    const onClickConnectButton = async (e) => {
        e.preventDefault(e);
        setStartRequest(true);
        const formData = {
            grant_type: listConnectData[props.plan].grant_type,
            client_id: listConnectData[props.plan].client_id,
            client_secret: listConnectData[props.plan].client_secret,
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
                    localStorage.setItem("staffData", response.data.staff.identite_id);
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
                console.log(error.response.data.error, "error");
                setStartRequest(false);
                setError({
                    username: error.response.data.error?error.response.data.error:"Email ou mot de passe incorrecte",
                    password: error.response.data.error?error.response.data.error:"Email ou mot de passe incorrecte"
                });
                ToastBottomEnd.fire(toastConnectErrorMessageConfig);
            })
        ;
    };
    return (
        load ? (
            <Loader/>
        ) : (
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
                                        style={{backgroundImage: `url(${componentData ? appConfig.apiDomaine + componentData.params.fr.background.value.url : " "})`}}>
                                        <div className="kt-grid__item">
                                            <span className="kt-login__logo">
                                                <img
                                                    src={componentData ? appConfig.apiDomaine + componentData.params.fr.logo.value.url : null}/>
                                                <span style={{
                                                    color: "white",
                                                    fontSize: "1.5em",
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

                                            <div className="kt-login__form">

                                                <div className="kt-login__title">
                                                    <div className="form-group row" style={{marginTop: '70px'}}>

                                                        <div className="col-lg-12 col-xl-6">
                                                            <img
                                                                id="Image1"
                                                                src={"/assets/media/users/Icon.png"}
                                                                alt="logo"
                                                                style={{
                                                                    maxWidth: "60px",
                                                                    maxHeight: "60px",
                                                                    textAlign: 'center'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <h3> {componentData ? componentData.params.fr.title.value : ""}</h3>
                                                </div>

                                                <form className="kt-form" id="kt_login__form"
                                                      style={{marginBottom: '85px'}}>
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
                                                        {console.log(error.username.length,'Taille')}
                                                        {
                                                            error.username.length ? (
                                                                <div className="invalid-feedback">
                                                                    {error.username}
                                                                </div>
                                                            ) : null
                                                        }
                                                    </div>
                                                    <div
                                                        className={error.password.length ? "form-group row validated" : "form-group row"}>

                                                        <input
                                                            className={error.password.length ? "form-control is-invalid" : "form-control"}
                                                            type="password"
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

                                                    <div className="kt-login__extra">

                                                        <div className="text-right">
                                                            <a href="#" id="kt_login_forgot">Mot de passe oublié ?</a>
                                                        </div>
                                                    </div>

                                                    <div className="kt-login__actions">
                                                        {
                                                            !startRequest ? (
                                                                <button type="submit"
                                                                        id="kt_login_signin_submit"
                                                                        className="btn btn-primary btn-elevate kt-login__btn-primary"
                                                                        onClick={onClickConnectButton}> Se
                                                                    connecter</button>
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

                                            {/*<div className="kt-login__forgot">*/}
                                            {/*    <div className="kt-login__head">*/}
                                            {/*        <h3 className="kt-login__title">Mot de Passe oublié?</h3>*/}
                                            {/*        <div className="kt-login__desc">Entrer votre email pour récupérer votre mot de passe:*/}
                                            {/*        </div>*/}
                                            {/*    </div>*/}
                                            {/*    <div className="kt-login__form">*/}
                                            {/*        <form className="kt-form" action="">*/}
                                            {/*            <div className="form-group">*/}
                                            {/*                <input className="form-control" type="text"*/}
                                            {/*                       placeholder="Email" name="email" id="kt_email"*/}
                                            {/*                       autoComplete="off"/>*/}
                                            {/*            </div>*/}
                                            {/*            <div className="kt-login__actions">*/}
                                            {/*                <button id="kt_login_forgot_submit"*/}
                                            {/*                        className="btn btn-brand btn-pill btn-elevate">Envoyer*/}
                                            {/*                </button>*/}
                                            {/*                <button id="kt_login_forgot_cancel"*/}
                                            {/*                        className="btn btn-outline-brand btn-pill">Quitter*/}
                                            {/*                </button>*/}
                                            {/*            </div>*/}
                                            {/*        </form>*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
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
