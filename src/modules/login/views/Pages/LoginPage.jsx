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
                })
            ;
        }

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
                                            <span className="kt-login__logo">
                                                <img
                                                    src={data ? appConfig.apiDomaine + data.params.fr.logo.value.url : null}/>
                                                <span style={{
                                                    color: "white",
                                                    fontSize: "1.5em",
                                                    paddingLeft: "5px"
                                                }}>
                                                {data ? data.params.fr.version.value : props.plan + appConfig.version}
                                            </span>
                                            </span>
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
                                                    © {appConfig.appFullName}
                                                    {/*&copy {appConfig.appFullName(props.plan)}*/}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="kt-grid__item kt-grid__item--fluid kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper" >
                                        <div className="kt-login__body">


                                            <div className="kt-login__form" >

                                                <div className="kt-login__title">
                                                    <div className="form-group row" style={{marginTop: '70px'}} >

                                                        <div className="col-lg-12 col-xl-6">
                                                            <div className="kt-avatar kt-avatar--outline"
                                                                 id="kt_user_add_avatar">
                                                                <div className="kt-avatar__holder w-100 h-75"
                                                                     style={{textAlign: 'center'}}>
                                                                    <img
                                                                        id="Image1"
                                                                        src={"/assets/media/users/Icon.png"}
                                                                        alt="logo"
                                                                        style={{
                                                                            maxWidth: "75px",
                                                                            maxHeight: "75px",
                                                                            textAlign: 'center'
                                                                        }}
                                                                    />

                                                                </div>
                                                                <label className="kt-avatar__upload"
                                                                       id="files"
                                                                       data-toggle="kt-tooltip"
                                                                       title="Change avatar">
                                                                    <i className="fa fa-pen"/>
                                                                    <input type="file"
                                                                           id="file"
                                                                           name="kt_user_add_user_avatar"
                                                                        // onChange={(e) => onChangeFile(e)}
                                                                    />
                                                                </label>
                                                                <span className="kt-avatar__cancel"
                                                                      data-toggle="kt-tooltip"
                                                                      title="Cancel avatar">
                                                                            <i className="fa fa-times"/>
                                                                        </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h3> {data ? data.params.fr.title.value : ""}</h3>
                                                </div>

                                                <form className="kt-form" id="kt_login__form"
                                                      style={{marginBottom: '80px'}}>
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
