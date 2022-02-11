import React, {useState} from "react";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import axios from "axios";
import appConfig from "../../../config/appConfig";
import {ToastBottomEnd} from "../Toast";
import {
    toastEditErrorMessageConfig,
    toastEditSuccessMessageConfig
} from "../../../config/toastConfig";

const PersonalInfo = ({data, handleLastNameChange, handleFirstNameChange, handleTelephoneChange, handleEmailChange, handleVilleChange}) => {
    const [startRequest, setStartRequest] = useState(false);

    const defaultError = {
        firstname: [],
        lastname: [],
        sexe: [],
        telephone: [],
        email: [],
        ville: []
    };
    const [error, setError] = useState(defaultError);

    const updateProfile = async (e) => {
        e.preventDefault();
        setStartRequest(true);
        const coucou = await axios.put(`${appConfig.apiDomaine}/update-profil`, data)
            .then(({data}) => {
                setStartRequest(false);
                setError(defaultError);
                ToastBottomEnd.fire(toastEditSuccessMessageConfig);
                return true
            })
            .catch(({response}) => {
                setStartRequest(false);
                setError({...defaultError, ...response.data.error});
                ToastBottomEnd.fire(toastEditErrorMessageConfig);
                return false
            })
        ;
        console.log("coucou:", coucou);
    };

    return (
        <div className="kt-portlet">
            <div className="kt-portlet__head">
                <div className="kt-portlet__head-label">
                    <h3 className="kt-portlet__head-title">Informations personnelles</h3>
                </div>
            </div>
            <form className="kt-form kt-form--label-right">
                <div className="kt-portlet__body mb-0">
                    <div className="kt-section kt-section--first mb-0">
                        <div className="kt-section__body">
                            <div className="row">
                                <label className="col-xl-3"/>
                                <div className="col-lg-9 col-xl-6">
                                    <h3 className="kt-section__title kt-section__title-sm">Information identité</h3>
                                </div>
                            </div>
                            {/*<div className="form-group row">
                                <label className="col-xl-3 col-lg-3 col-form-label">Avatar</label>
                                <div className="col-lg-9 col-xl-6">
                                    <div className="kt-avatar kt-avatar--outline"
                                         id="kt_user_avatar">
                                        <div className="kt-avatar__holder" style={{backgroundImage: 'url(/assets/media/users/default.jpg)'}}/>
                                        <label className="kt-avatar__upload" data-toggle="kt-tooltip" title="" data-original-title="Change avatar">
                                            <i className="fa fa-pen"/>
                                            <input type="file" name="profile_avatar" accept=".png, .jpg, .jpeg"/>
                                        </label>
                                        <span className="kt-avatar__cancel" data-toggle="kt-tooltip" title="" data-original-title="Cancel avatar">
                                            <i className="fa fa-times"/>
                                        </span>
                                    </div>
                                </div>
                            </div>*/}
                            <div className={error.lastname.length ? "form-group row validated" : "form-group row"}>
                                <label className="col-xl-3 col-lg-3 col-form-label">Nom</label>
                                <div className="col-lg-9 col-xl-6">
                                    <input className={error.lastname.length ? "form-control is-invalid" : "form-control"} type="text" placeholder="HOUNSSOU" value={data.lastname} onChange={e => handleLastNameChange(e.target.value)}/>
                                    {
                                        error.lastname.length ? (
                                            error.lastname.map((error, index) => (
                                                <div key={index} className="invalid-feedback">
                                                    {error}
                                                </div>
                                            ))
                                        ) : null
                                    }
                                </div>
                            </div>
                            <div className={error.firstname.length ? "form-group row validated" : "form-group row"}>
                                <label className="col-xl-3 col-lg-3 col-form-label">Prénom</label>
                                <div className="col-lg-9 col-xl-6">
                                    <input className={error.firstname.length ? "form-control is-invalid" : "form-control"} type="text" placeholder="Romaric" value={data.firstname} onChange={e => handleFirstNameChange(e.target.value)}/>
                                    {
                                        error.firstname.length ? (
                                            error.firstname.map((error, index) => (
                                                <div key={index} className="invalid-feedback">
                                                    {error}
                                                </div>
                                            ))
                                        ) : null
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-xl-3"/>
                                <div className="col-lg-9 col-xl-6">
                                    <h3 className="kt-section__title kt-section__title-sm">Informations de contact</h3>
                                </div>
                            </div>
                            <div className={error.telephone.length ? "form-group row validated" : "form-group row"}>
                                <label className="col-xl-3 col-lg-3 col-form-label">Téléphone</label>
                                <div className="col-lg-9 col-xl-6">
                                    <ReactTagInput
                                        tags={data.telephone}
                                        placeholder={"Tapez et appuyez sur Entrée"}
                                        onChange={(newTags) => handleTelephoneChange(newTags)}
                                    />
                                    {
                                        error.telephone.length ? (
                                            error.telephone.map((error, index) => (
                                                <div key={index} className="invalid-feedback">
                                                    {error}
                                                </div>
                                            ))
                                        ) : null
                                    }
                                </div>
                            </div>

                            <div className={error.email.length ? "form-group row validated" : "form-group row"}>
                                <label className="col-xl-3 col-lg-3 col-form-label">Adresse Mail</label>
                                <div className="col-lg-9 col-xl-6">
                                    <ReactTagInput
                                        tags={data.email}
                                        placeholder={"Tapez et appuyez sur Entrée"}
                                        onChange={(newTags) => handleEmailChange(newTags)}
                                    />
                                    {
                                        error.email.length ? (
                                            error.email.map((error, index) => (
                                                <div key={index} className="invalid-feedback">
                                                    {error}
                                                </div>
                                            ))
                                        ) : null
                                    }
                                </div>
                            </div>

                            <div className={error.ville.length ? "form-group row validated" : "form-group row"}>
                                <label className="col-xl-3 col-lg-3 col-form-label">Ville</label>
                                <div className="col-lg-9 col-xl-6">
                                    <input className={error.ville.length ? "form-control is-invalid" : "form-control"} type="text" placeholder="Cotonou" value={data.ville} onChange={e => handleVilleChange(e.target.value)}/>
                                    {
                                        error.ville.length ? (
                                            error.ville.map((error, index) => (
                                                <div key={index} className="invalid-feedback">
                                                    {error}
                                                </div>
                                            ))
                                        ) : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="kt-portlet__foot">
                    <div className="kt-form__actions">
                        <div className="row">
                            <div className="col-lg-3 col-xl-3">
                            </div>
                            <div className="col-lg-9 col-xl-9">
                                {
                                    !startRequest ? (
                                        <button type="submit" onClick={(e) => updateProfile(e)} className="btn btn-primary">
                                            Modifier
                                        </button>
                                    ) : (
                                        <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                            Chargement...
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
};

export default PersonalInfo;
