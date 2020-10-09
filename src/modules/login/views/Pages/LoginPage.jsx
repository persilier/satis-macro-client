import React, {useEffect, useState} from "react";
import {forceRound, loadCss, loadScript} from "../../../../helpers/function";
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
        username: [],
        password: [],
        // grant_type:[],
        // client_id: [],
        // client_secret:[]
    };
    const [load, setLoad] = useState(true);
    const [username, setUserName] = useState("");
    const [data, setData] = useState(null);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function fetchData() {
            await axios.get(appConfig.apiDomaine + "/components/retrieve-by-name/connection")
                .then(response => {
                    setData(response.data);
                    setLoad(false);
                })
                .catch(error => {
                    setLoad(false);
                    console.log("Something is wrong");
                });}
        fetchData();
        return () => mounted = false;
    }, []);

    const onChangeUserName = (e) => {
        setUserName(e.target.value)
    };
    const onChangePassword = (e) => {
        setPassword(e.target.value)
    };
    const onClickConnectButton = async (e) => {
        e.preventDefault(e);
        setStartRequest(true);
        const formData = {
            grant_type: listConnectData[props.plan].grant_type,
            client_id: listConnectData[props.plan].client_id,
            client_secret: listConnectData[props.plan].client_secret,
            username: username,
            password: password
        };
        await axios.post(appConfig.apiDomaine + `/oauth/token`, formData)
            .then(response => {
                const token = response.data.access_token;
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
                    window.location.href = "/dashboard";
                });

            })
            .catch(error => {
                setStartRequest(false);
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
                                        style={{backgroundImage: `url(${data ? appConfig.apiDomaine + data.params.fr.background.value.url : " "})`}}>
                                        <div className="kt-grid__item">
                                            <a href="/login" className="kt-login__logo">
                                                <img
                                                    src={data ? appConfig.apiDomaine + data.params.fr.logo.value.url : null}/>
                                                <span style={{
                                                    color: "white",
                                                    fontSize: "1.5em",
                                                    paddingLeft: "5px"
                                                }}>
                                                {data ? data.params.fr.version.value : props.plan + appConfig.version}
                                            </span>
                                            </a>
                                        </div>
                                        <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver">
                                            <div className="kt-grid__item kt-grid__item--middle">
                                                <h3 className="kt-login__title"> {data ? data.params.fr.header.value + " " + data.params.fr.version.value : null}</h3>
                                                <h4 className="kt-login__subtitle"> {data ? data.params.fr.description.value + " " : null}</h4>
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
                                                    <h3> {data ? data.params.fr.title.value : ""}</h3>
                                                </div>

                                                <form className="kt-form" id="kt_login__form"
                                                      style={{marginBottom: '142px'}}>
                                                    <div
                                                        className={error.username.length ? "form-group row validated" : "form-group row"}>

                                                        <input
                                                            className={error.username.length ? "form-control is-invalid" : "form-control"}
                                                            type="email"
                                                            placeholder="Votre Email"
                                                            name="username"
                                                            onChange={(e) => onChangeUserName(e)}
                                                            value={username}
                                                        />

                                                        {
                                                            error.username.length ? (
                                                                error.username.map((error, index) => (
                                                                    <div key={index}
                                                                         className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
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
                                                            ) : null
                                                        }
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
        plan: state.plan.plan
    };
};

export default connect(mapStateToProps)(LoginPage);
