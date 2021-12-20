import React, {useEffect, useState} from 'react';
import axios from "axios";
import appConfig from "../../../../config/appConfig";
import {Link} from "react-router-dom";
import {ToastBottomEnd} from "../../../../views/components/Toast";
import {
    toastAddErrorMessageConfig, toastEditErrorMessageConfig,
    toastEditSuccessMessageConfig,
} from "../../../../config/toastConfig";
import "./LoginCss.css"
import Loader from "../../../../views/components/Loader";


const ReinitialisationForm = (props) => {
    const defaultData = {
        email: "",
        token: props.token,
        password: "",
        password_old: "",
        password_confirmation: ""
    };
    const defaultError = {
        email: "",
        token: "",
        password: "",
        password_old: "",
        password_confirmation: ""
    };
    const [load, setLoad] = useState(true);
    const [getTokenData, setGetTokenData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequestForgot, setStartRequestForgot] = useState(false);

    useEffect(() => {

        if (props.token) {
            axios.get(appConfig.apiDomaine + `/forgot-password/${props.token}`)
                .then(response => {
                    console.log(response.data);
                    if (response.data.code === 200) {
                        const newData = {
                            email: response.data.data.email,
                            token: response.data.data.token,
                            password: "",
                            password_confirmation: ""
                        };
                        setGetTokenData(newData)
                    }
                    setLoad(false);
                }).catch(errorRequest => {
                setLoad(false);
                setGetTokenData(defaultError)
            })
            ;

        }
    }, []);
    const onChangeEmail = (e) => {
        const newData = {...getTokenData};
        newData.email = e.target.value;
        setGetTokenData(newData);
    };
    const onChangePasswordOld = (e) => {
        const newData = {...getTokenData};
        newData.password_old = e.target.value;
        setGetTokenData(newData);
    };
    const onChangePassword = (e) => {
        const newData = {...getTokenData};
        newData.password = e.target.value;
        setGetTokenData(newData);
    };
    const onChangePasswordConfirm = (e) => {
        const newData = {...getTokenData};
        newData.password_confirmation = e.target.value;
        setGetTokenData(newData);
    };
    const onViewPassword = (e) => {
        let input = document.getElementById("password");
        let inputConfirm = document.getElementById("password_confirm");
        let icon = document.getElementById("icon");
        if (input.type === "password"||inputConfirm.type === "password") {
            input.type = "text";
            inputConfirm.type = "text";
            icon.className = "fa fa-eye"
        } else {
            input.type = "password";
            inputConfirm.type = "password";
            icon.className = "fa fa-eye-slash"
        }
    };

    const onClick = (e) => {
        setStartRequestForgot(true);

        axios.post(appConfig.apiDomaine + `/reset-password`, getTokenData)
            .then(response => {
                setStartRequestForgot(false);
                setError(defaultError);
                setGetTokenData(defaultData);
                ToastBottomEnd.fire(toastEditSuccessMessageConfig);
                window.location.href='/login';
            })
            .catch(error => {
                console.log(error.response.data.error, "error");
                setStartRequestForgot(false);
                setError({...defaultError,...error.response.data.error});
                ToastBottomEnd.fire(toastEditErrorMessageConfig);
            })
        ;
    };
    return (
        // getTokenData.token === props.token ?
        props.token === props.token ?
            <div>
                <div className="kt-login__form "
                     style={{paddingTop: "30px"}}>
                    <div className="kt-login__head">
                        <h3 className="kt-login__title">Réinitialisation du Mot de Passe </h3>
                        <div className="kt-login__desc text-center">Entrer votre nouveau mot de passe:
                        </div>
                    </div>
                    <form className="kt-form" id="kt_login__form" style={{marginBottom: '90px'}}>
                        <div className="form-group row input_container">
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Email"
                                defaultValue={getTokenData.email}
                                style={{display: 'none'}}
                            />
                        </div>
                        <div className="form-group row input_container">
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Token"
                                defaultValue={getTokenData.token}
                                style={{display: 'none'}}
                            />
                        </div>
                        <div
                            className={error.password.length ? "form-group row input_container validated" : "form-group row input_container"}>
                            {/*  <span className="input_icon">
                                 <i id="icon" className="fa fa-eye-slash" aria-hidden="true"
                                    onClick={(e) => onViewPassword(e)}></i>
                             </span>*/}

                            <input
                                id="email"
                                className="form-control"
                                type="email"
                                placeholder="Email"
                                value={getTokenData.email}
                                onChange={e => onChangeEmail(e)}
                            />

                            <input
                                id="password_old"
                                className="form-control"
                                type="password"
                                placeholder="Ancien mot de passe"
                                value={getTokenData.password_old}
                                onChange={e => onChangePasswordOld(e)}
                            />
                            <input
                                id="password"
                                className="form-control"
                                type="password"
                                placeholder="Nouveau mot de passe"
                                value={getTokenData.password}
                                onChange={e => onChangePassword(e)}
                            />
                            {
                                error.password.length ? (
                                    <div className="invalid-feedback">
                                        {error.password}
                                    </div>
                                ) : null
                            }
                        </div>
                        <div className="form-group row input_container">

                            <input
                                id="password_confirm"
                                className="form-control"
                                type="password"
                                placeholder="Confirmer le nouveau mot de passe"
                                value={getTokenData.password_confirmation}
                                onChange={e => onChangePasswordConfirm(e)}
                            />
                        </div>
                        <div className="kt-login__actions">

                            {
                                !startRequestForgot ? (
                                    <button type="submit"
                                            id="kt_login_forgot_submit"
                                            className="btn btn-brand btn-pill btn-elevate"
                                            onClick={onClick}>Modifier
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary btn-pill btn-elevate kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                        type="button" disabled>
                                        Chargement...
                                    </button>
                                )
                            }
                            <Link to={"/login"} id="kt_login_forgot_cancel"
                                  className="btn btn-outline-brand btn-pill">Quitter
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
            : load ? (
                <Loader/>
            ) : ( window.location.href = "/login")
    );

};

export default ReinitialisationForm;