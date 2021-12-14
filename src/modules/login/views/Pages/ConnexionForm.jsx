import React from 'react';
import appConfig from "../../../../config/appConfig";
import {Link, Route} from "react-router-dom";

const ConnexionForm =({componentData,data,error,startRequest,onChangeUserName,onViewPassword,onChangePassword,onClickConnectButton})=>{
        return (
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

        );
};
export default ConnexionForm;