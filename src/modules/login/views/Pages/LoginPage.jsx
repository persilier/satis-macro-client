import React, {useEffect} from "react";
import {loadCss, loadScript} from "../../../../helpers/function";

const LoginPage = () => {

    useEffect(() => {
        loadCss("/assets/css/pages/login/login-1.css");
        loadScript("/assets/js/pages/custom/login/login-1.js");
    }, []);

    return (
        <div className="kt-grid kt-grid--ver kt-grid--root kt-page">
			<div className="kt-grid kt-grid--hor kt-grid--root  kt-login kt-login--v1" id="kt_login">
				<div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile">

					<div className="kt-grid__item kt-grid__item--order-tablet-and-mobile-2 kt-grid kt-grid--hor kt-login__aside" style={{ backgroundImage: "url(assets/media/bg/bg-4.jpg)"}}>
						<div className="kt-grid__item">
							<a href="/login" className="kt-login__logo">
								<img src="/assets/images/satisLogo.png"/>
                                <span style={{color: "white", fontSize: "1.5em", paddingLeft: "5px"}}>2020.1</span>
							</a>
						</div>
						<div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver">
							<div className="kt-grid__item kt-grid__item--middle">
								<h3 className="kt-login__title">Bienvenue sur SATIS 2020.1!</h3>
								<h4 className="kt-login__subtitle">Votre nouvel outil de gestion des plaintes.</h4>
							</div>
						</div>
						<div className="kt-grid__item">
							<div className="kt-login__info">
								<div className="kt-login__copyright">
									&copy SATIS 2020.1
								</div>
								<div className="kt-login__menu">
									<a href="#" className="kt-link">Privacy</a>
									<a href="#" className="kt-link">Legal</a>
									<a href="#" className="kt-link">Contact</a>
								</div>
							</div>
						</div>
					</div>

					<div className="kt-grid__item kt-grid__item--fluid kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper">
						<div className="kt-login__body">

							<div className="kt-login__form">
								<div className="kt-login__title" style={{marginTop: '142px'}}>
									<h3>Connexion</h3>
								</div>

								<form className="kt-form" action="" noValidate="novalidate" id="kt_login_form" style={{ marginBottom: '142px' }}>
									<div className="form-group">
										<input
                                            className="form-control"
                                            type="text"
                                            placeholder="Votre nom d'utilisateur"
                                            name="username"
                                            autoComplete="off"
                                        />
									</div>
									<div className="form-group">
										<input
                                            className="form-control"
                                            type="password"
                                            placeholder="Votre Mot de Passe"
                                            name="password"
                                            autoComplete="off"
                                        />
									</div>

									<div className="kt-login__actions">
										<a href="#" className="kt-link kt-login__link-forgot">
											Mot de passe oublié ?
										</a>
										<button
                                            id="kt_login_signin_submit"
                                            className="btn btn-primary btn-elevate kt-login__btn-primary">
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
    );
};

export default LoginPage;
