import React, {useState} from 'react';
import axios from "axios";
import appConfig from "../../../../config/appConfig";
import {Link} from "react-router-dom";
import {ToastBottomEnd} from "../../../../views/components/Toast";
import {toastEditErrorMessageConfig, toastEditSuccessMessageConfig,} from "../../../../config/toastConfig";
import "./LoginCss.css"


const ReinitialisationForm = (props) => {
    const defaultData = {
        email: "",
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
    };
    const defaultError = {
        email: [],
        current_password: [],
        new_password: [],
        new_password_confirmation: []
    };
    const [load, setLoad] = useState(true);
    const [getDataReset, setGetDataReset] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequestForgot, setStartRequestForgot] = useState(false);

    /* useEffect(() => {

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
                         setgetDataReset(newData)
                     }
                     setLoad(false);
                 }).catch(errorRequest => {
                 setLoad(false);
                 setGetDataReset(defaultError)
             })
             ;

         }
     }, []);*/

    const onChangeEmail = (e) => {
        const newData = {...getDataReset};
        newData.email = e.target.value;
        setGetDataReset(newData);
    };
    const onChangePasswordOld = (e) => {
        const newData = {...getDataReset};
        newData.new_password = e.target.value;
        setGetDataReset(newData);
    };
    const onChangePassword = (e) => {
        const newData = {...getDataReset};
        newData.current_password = e.target.value;
        setGetDataReset(newData);
    };
    const onChangePasswordConfirm = (e) => {
        const newData = {...getDataReset};
        newData.new_password_confirmation = e.target.value;
        setGetDataReset(newData);
    };
    const onViewPassword = (e) => {
        let input = document.getElementById("password");
        let inputConfirm = document.getElementById("password_confirm");
        let icon = document.getElementById("icon");
        if (input.type === "password" || inputConfirm.type === "password") {
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

        axios.put(appConfig.apiDomaine + `/reset-password-expired`, getDataReset)
            .then(response => {
                setStartRequestForgot(false);
                setError(defaultError);
                // setGetDataReset(defaultData);
                ToastBottomEnd.fire(toastEditSuccessMessageConfig);
                window.location.href = '/login';
            })
            .catch(error => {
                console.log(error.response.data.error, "error");
                setStartRequestForgot(false);
                setError({...defaultError, ...error.response.data.error});
                ToastBottomEnd.fire(toastEditErrorMessageConfig);
            })
        ;
    };
    return (
        load ? (
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
                                id="email"
                                className="form-control"
                                type="email"
                                placeholder="Email"
                                value={getDataReset.email}
                                onChange={e => onChangeEmail(e)}
                            />
                            {
                                error.email.length ? (
                                    <div className="invalid-feedback">
                                        {error.email}
                                    </div>
                                ) : null
                            }
                        </div>
                        <div
                            className={error.current_password.length ? "form-group row input_container validated" : "form-group row input_container"}>
                            <input
                                id="password"
                                className="form-control"
                                type="password"
                                placeholder="Ancien mot de passe"
                                value={getDataReset.current_password}
                                onChange={e => onChangePassword(e)}
                            />
                            {
                                error.current_password.length ? (
                                    <div className="invalid-feedback">
                                        {error.current_password}
                                    </div>
                                ) : null
                            }
                        </div>
                        <div
                            className={error.new_password.length ? "form-group row input_container validated" : "form-group row input_container"}>

                            <input
                                id="new_password"
                                className="form-control"
                                type="password"
                                placeholder="Nouveau mot de passe"
                                value={getDataReset.new_password}
                                onChange={e => onChangePasswordOld(e)}
                            />
                            {
                                error.new_password.length ? (
                                    <div className="invalid-feedback">
                                        {error.new_password}
                                    </div>
                                ) : null
                            }
                        </div>
                        <div  className={error.new_password_confirmation.length ? "form-group row input_container validated" : "form-group row input_container"}>

                            <input
                                id="password_confirm"
                                className="form-control"
                                type="password"
                                placeholder="Confirmer le nouveau mot de passe"
                                value={getDataReset.new_password_confirmation}
                                onChange={e => onChangePasswordConfirm(e)}
                            />
                            {
                                error.new_password_confirmation.length ? (
                                    <div className="invalid-feedback">
                                        {error.new_password_confirmation}
                                    </div>
                                ) : null
                            }
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
        ) : (window.location.href = "/login")
    );

}

export default ReinitialisationForm;