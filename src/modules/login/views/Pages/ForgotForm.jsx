import React, {useState} from 'react';
import axios from "axios";
import appConfig from "../../../../config/appConfig";
import {ToastBottomEnd} from "../../../../views/components/Toast";
import {toastAddErrorMessageConfig, toastSuccessMessageWithParameterConfig} from "../../../../config/toastConfig";
import {Link} from "react-router-dom";

const ForgotForm = () => {
    const [email, setEmail] = useState('');
    const [startRequestForgot, setStartRequestForgot] = useState(false);

    const onClickForgotPassword = (e) => {
        setStartRequestForgot(true);
        const data = {
            email: email
        };
        axios.post(appConfig.apiDomaine + `/forgot-password`, data)
            .then(response => {
                setStartRequestForgot(false);
                ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig(response.data.message));
                setEmail('')
            })
            .catch(error => {
                setStartRequestForgot(false);
                ToastBottomEnd.fire(toastAddErrorMessageConfig);
            })
        ;
    };

    return (
        
        <div>
            <div className="kt-login__form "
                 style={{paddingTop: "100px"}}>
                <div className="kt-login__head" style={{marginTop: '70px'}}>
                    <h3 className="kt-login__title">Mot de Passe oublié?</h3>
                    <div className="kt-login__desc text-center">Entrer votre email
                        pour
                        récupérer votre mot de passe:
                    </div>
                </div>
                <form className="kt-form" id="kt_login__form" style={{marginBottom: '90px'}}>
                    <div className="form-group row">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="kt-login__actions">

                        {
                            !startRequestForgot ? (
                                <button type="submit"
                                        id="kt_login_forgot_submit"
                                        className="btn btn-brand btn-pill btn-elevate"
                                        onClick={onClickForgotPassword}>Envoyer
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
    );
};

export default ForgotForm;