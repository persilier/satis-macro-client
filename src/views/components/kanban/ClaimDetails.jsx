import React, {useState} from "react";
import axios from "axios";
import {loadCss, loadScript} from "../../../helpers/function";
import {AUTH_TOKEN} from "../../../constants/token";
import appConfig from "../../../config/appConfig";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
loadCss("/assets/css/pages/wizard/wizard-2.css");
loadScript("/assets/js/pages/custom/wizard/wizard-2.js");
loadScript("/assets/js/pages/custom/chat/chat.js");


const ClaimDetails = (props) => {

    console.log(props.claim);
    const claim = props.claim;

    const [first, setFist] = useState("current");
    const [second, setSecond] = useState("pending");
    const [third, setThird] = useState("pending");
    const [last, setLast] = useState("pending");

    const onClickFirst = () => {
        setFist("current");
        setSecond("pending");
        setThird("pending");
        setLast("pending");
    };

    const onClickSecond = () => {
        setFist("done");
        setSecond("current");
        setThird("pending");
        setLast("pending");
    };

    const onClickThird = () => {
        setFist("done");
        setSecond("done");
        setThird("current");
        setLast("pending");
    };

    const onClickLast = () => {
        setFist("done");
        setSecond("done");
        setThird("done");
        setLast("current");
    };

    const onClickPrevious = (e) => {
        e.preventDefault();
        if (last === "current")
            onClickThird();
        else if (third === "current")
            onClickSecond();
        else if (second === "current")
            onClickFirst();
    };

    const onClickNext = (e) => {
        e.preventDefault();
        if (first === "current")
            onClickSecond();
        else if (second === "current")
            onClickThird();
        else if (third === "current")
            onClickLast()
    };

    return (
        <div className="kt-portlet__body kt-portlet__body--fit w-100">
            <div className="kt-grid  kt-wizard-v2 kt-wizard-v2--white" id="kt_wizard_v2" data-ktwizard-state={first === "current" ? "step-first" : last === "current" ? "last" : "between"}>
                <div className="kt-grid__item kt-wizard-v2__aside">
                    <div className="kt-wizard-v2__nav">
                        <div className="kt-wizard-v2__nav-items kt-wizard-v2__nav-items--clickable">
                            <div onClick={() => onClickFirst() } className="kt-wizard-v2__nav-item" data-ktwizard-type="step" data-ktwizard-state={first}>
                                <div className="kt-wizard-v2__nav-body">
                                    <div className="kt-wizard-v2__nav-icon">
                                        <i className="flaticon-user-settings"/>
                                    </div>
                                    <div className="kt-wizard-v2__nav-label">
                                        <div className="kt-wizard-v2__nav-label-title">
                                            Information client
                                        </div>
                                        <div className="kt-wizard-v2__nav-label-desc">
                                            Voir les détails du compte client
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div onClick={() => onClickSecond() } className="kt-wizard-v2__nav-item" data-ktwizard-type="step" data-ktwizard-state={second}>
                                <div className="kt-wizard-v2__nav-body">
                                    <div className="kt-wizard-v2__nav-icon">
                                        <i className="flaticon-book"/>
                                    </div>
                                    <div className="kt-wizard-v2__nav-label">
                                        <div className="kt-wizard-v2__nav-label-title">
                                            Information Plainte
                                        </div>
                                        <div className="kt-wizard-v2__nav-label-desc">
                                            Voir les détails de la plainte
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div onClick={() => onClickThird() } className="kt-wizard-v2__nav-item" href="#" data-ktwizard-type="step" data-ktwizard-state={third}>
                                <div className="kt-wizard-v2__nav-body">
                                    <div className="kt-wizard-v2__nav-icon">
                                        <i className="flaticon-file-2"/>
                                    </div>
                                    <div className="kt-wizard-v2__nav-label">
                                        <div className="kt-wizard-v2__nav-label-title">
                                            Pièces jointe plainte
                                            <span className="mx-lg-4 kt-badge kt-badge--success  kt-badge--inline kt-badge--pill">{claim.files.length}</span>
                                        </div>
                                        <div className="kt-wizard-v2__nav-label-desc">
                                            Voir les pièces jointes de la plainte
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                props.claim.myStatus !== "toComplete" ? (
                                    <div onClick={() => onClickLast() } className="kt-wizard-v2__nav-item" data-ktwizard-type="step" data-ktwizard-state={last}>
                                        <div className="kt-wizard-v2__nav-body">
                                            <div className="kt-wizard-v2__nav-icon">
                                                <i className="flaticon-chat-1"/>
                                            </div>
                                            <div className="kt-wizard-v2__nav-label">
                                                <div className="kt-wizard-v2__nav-label-title">
                                                    Commentaire
                                                </div>
                                                <div className="kt-wizard-v2__nav-label-desc">
                                                    Voire ou ajouter un commentaire
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : ""
                            }
                        </div>
                    </div>
                </div>

                <div className="kt-grid__item kt-grid__item--fluid kt-wizard-v2__wrapper">
                    <form className="kt-form" id="kt_form">

                        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content" data-ktwizard-state={first === "current" ? "current" : "pending"}>
                            <div className="kt-heading kt-heading--md">Passez en revue les détails du client</div>
                            <div className="kt-form__section kt-form__section--first">
                                <div className="kt-wizard-v2__review">
                                    <div className="kt-wizard-v2__review-item">
                                        <div className="kt-widget kt-widget--user-profile-1">
                                            <div className="kt-widget__head">
                                                <div className="kt-widget__media">
                                                    <img src="/personal/img/default-avatar.png" alt="image"/>
                                                </div>
                                                <div className="kt-widget__content"
                                                     style={{marginTop: "auto", marginBottom: "auto"}}>
                                                    <div className="kt-widget__section">
                                                        <a href="#"
                                                           className="kt-widget__username">
                                                            {`${claim.claimer.lastname} ${claim.claimer.firstname}`}
                                                            <i className="flaticon2-correct kt-font-success"/>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="kt-widget__body">
                                                <div className="kt-widget__content">
                                                    <div className="kt-widget__info">
                                                        <span className="fa fa-venus-mars" style={{fontSize: "1.5rem"}}/>
                                                        <span className="kt-widget__data">{claim.claimer.sexe === 'F' ? "Féminin" : "Masculin"}</span>
                                                    </div>
                                                    <div className="kt-widget__info">
                                                        <span className="fa fa-envelope" style={{fontSize: "1.5rem"}}/>
                                                        <span className="kt-widget__data">
                                                                    {
                                                                        claim.claimer.email.map((mail, index) => (
                                                                            index === claim.claimer.email.length - 1 ? mail : mail + "/ "
                                                                        ))
                                                                    }
                                                                </span>
                                                    </div>
                                                    <div className="kt-widget__info">
                                                        <span className="fa fa-phone-alt" style={{fontSize: "1.5rem"}}/>
                                                        <span className="kt-widget__data">
                                                                    {
                                                                        claim.claimer.telephone.map((telephone, index) => (
                                                                            index === claim.claimer.telephone.length - 1 ? telephone : telephone + "/ "
                                                                        ))
                                                                    }
                                                                </span>
                                                    </div>
                                                    <div className="kt-widget__info">
                                                        <span className="fa fa-location-arrow" style={{fontSize: "1.5rem"}}/>
                                                        <span className="kt-widget__data">
                                                                    {claim.claimer.ville ? claim.claimer.ville : "Pas d'information sur la ville"}
                                                                </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content" data-ktwizard-state={second === "current" ? "current" : "pending"}>
                            <div className="kt-heading kt-heading--md">Information sur la plainte</div>
                            <div className="kt-form__section kt-form__section--first">
                                <div className="kt-wizard-v2__review">
                                    <div className="kt-wizard-v2__review-item">
                                        <div className="kt-wizard-v2__review-title">
                                            Canal
                                        </div>
                                        <div className="kt-wizard-v2__review-content">
                                            Canal de réception: <span
                                            className="mx-2">{claim.request_channel ? claim.request_channel.name["fr"] : "Pas de canal de réception"}</span><br/>
                                            Canal de réponse: <span
                                            className="mx-2">{claim.response_channel ? claim.response_channel.name["fr"] : "Pas de canal de réponse"}</span><br/>
                                        </div>
                                    </div>
                                    <div className="kt-wizard-v2__review-item">
                                        <div className="kt-wizard-v2__review-title">
                                            Cible
                                        </div>
                                        <div className="kt-wizard-v2__review-content">
                                            Institution concèrné: <span
                                            className="mx-2">{claim.institution_targeted.name} 1</span><br/>
                                            Unité concèrné: <span
                                            className="mx-2">{claim.unit_targeted ? claim.unit_targeted.name["fr"] : "Pas d'institution ciblé"}</span><br/>
                                        </div>
                                    </div>
                                    <div className="kt-wizard-v2__review-item">
                                        <div className="kt-wizard-v2__review-title">
                                            Spécification plainte
                                        </div>
                                        <div className="kt-wizard-v2__review-content">
                                            Objet de plainte: <span
                                            className="mx-2">{claim.claim_object.name["fr"]}</span><br/>
                                            <br/>
                                            Numéro de compte concèrné: <span
                                            className="mx-2">{claim.account_targeted ? claim.account_targeted.number : "Pas de compte cible"}</span><br/>
                                            <br/>
                                            Montant réclamé: <span
                                            className="mx-2">{claim.amount_disputed ? `${claim.amount_disputed} ${claim.amount_currency.name["fr"]}` : "Pas de montant"}</span><br/>
                                            <br/>
                                            Date de l'évernement: <span
                                            className="mx-2">{claim.created_at}</span><br/>
                                            <br/>
                                            <strong>Description:</strong> <span
                                            className="mx-2">{claim.description}</span><br/>
                                            <br/>
                                            <strong>Attente:</strong> <span
                                            className="mx-2">{claim.claimer_expectation}</span><br/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content" data-ktwizard-state={third === "current" ? "current" : "pending"}>
                            <div className="kt-heading kt-heading--md">Les pièces jointes de la
                                plainte
                            </div>
                            <div className="kt-form__section kt-form__section--first">
                                <div className="kt-wizard-v2__review">
                                    {
                                        claim.files.length ? (
                                            claim.files.map((file, index) => (
                                                <div className="kt-wizard-v2__review-item"
                                                     key={index}>
                                                    <div className="kt-wizard-v2__review-title">
                                                        Pièce jointe Nº{index + 1}
                                                    </div>
                                                    <div className="kt-wizard-v2__review-content">
                                                        <a href={`${appConfig.apiDomaine}${file.url}`}
                                                           download={true} target={"_blank"}>
                                                            {file.title}
                                                        </a>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="kt-wizard-v2__review-item">
                                                <div className="kt-wizard-v2__review-title">
                                                    Pas de pièce jointe
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        {
                            props.claim.myStatus !== "toComplete" ? (
                                <div className="kt-wizard-v2__content" data-ktwizard-type="step-content" data-ktwizard-state={last === "current" ? "current" : "pending"}>
                                    <div className="kt-heading kt-heading--md">Les commentaires</div>
                                    <div className="kt-grid__item kt-grid__item--fluid kt-app__content" id="kt_chat_content">
                                        <div className="kt-chat">
                                            <div className="kt-portlet__body" style={{padding: "0"}}>
                                                <div className="kt-scroll kt-scroll--pull" data-mobile-height="300">
                                                    <div className="kt-chat__messages">
                                                        <div className="kt-chat__message">
                                                            <div className="kt-chat__user">
                                                                <span className="kt-media kt-media--circle kt-media--sm">
                                                                    <img src="/assets/media/users/100_12.jpg" alt="image"/>
                                                                </span>
                                                                <span className="kt-chat__username">Jason Muller</span>
                                                                <span className="kt-chat__datetime">2 Hours</span>
                                                            </div>
                                                            <div className="kt-chat__text kt-bg-light-success">
                                                                How likely are you to recommend our company <br/>to your friends and family?
                                                            </div>
                                                        </div>
                                                        <div className="kt-chat__message kt-chat__message--right">
                                                            <div className="kt-chat__user">
                                                                <span className="kt-chat__datetime">30 Seconds</span>
                                                                <span className="kt-chat__username">You</span>
                                                                <span className="kt-media kt-media--circle kt-media--sm">
                                                                    <img src="/personal/img/default-avatar.png" alt="image"/>
                                                                </span>
                                                            </div>
                                                            <div className="kt-chat__text kt-bg-light-brand">
                                                                Hey there, we’re just writing to let you know <br/>that you’ve been subscribed to a repository on GitHub.
                                                            </div>
                                                        </div>
                                                        <div className="kt-chat__message">
                                                            <div className="kt-chat__user">
                                                                <span className="kt-media kt-media--circle kt-media--sm">
                                                                    <img src="/assets/media/users/100_12.jpg" alt="image"/>
                                                                </span>
                                                                <span className="kt-chat__username">Jason Muller</span>
                                                                <span className="kt-chat__datetime">30 Seconds</span>
                                                            </div>
                                                            <div className="kt-chat__text kt-bg-light-success">
                                                                Ok, Understood!
                                                            </div>
                                                        </div>
                                                        <div className="kt-chat__message kt-chat__message--right">
                                                            <div className="kt-chat__user">
                                                                <span className="kt-chat__datetime">Just Now</span>
                                                                <span className="kt-chat__username">You</span>
                                                                <span className="kt-media kt-media--circle kt-media--sm">
                                                                    <img src="/personal/img/default-avatar.png" alt="image"/>
                                                                </span>
                                                            </div>
                                                            <div className="kt-chat__text kt-bg-light-brand">
                                                                You’ll receive notifications for all issues, pull requests!
                                                            </div>
                                                        </div>
                                                        <div className="kt-chat__message">
                                                            <div className="kt-chat__user">
                                                                <span className="kt-media kt-media--circle kt-media--sm">
                                                                    <img src="/assets/media/users/100_12.jpg" alt="image"/>
                                                                </span>
                                                                <span className="kt-chat__username">Jason Muller</span>
                                                                <span className="kt-chat__datetime">2 Hours</span>
                                                            </div>
                                                            <div className="kt-chat__text kt-bg-light-success">
                                                                You were automatically <b className="kt-font-brand">subscribed</b> <br/>because you’ve been given access to the repository
                                                            </div>
                                                        </div>
                                                        <div className="kt-chat__message kt-chat__message--right">
                                                            <div className="kt-chat__user">
                                                                <span className="kt-chat__datetime">30 Seconds</span>
                                                                <span className="kt-chat__username">You</span>
                                                                <span className="kt-media kt-media--circle kt-media--sm">
                                                                    <img src="/personal/img/default-avatar.png" alt="image"/>
                                                                </span>
                                                            </div>
                                                            <div className="kt-chat__text kt-bg-light-brand">
                                                                You can unwatch this repository immediately <br/>by clicking here: <a href="#" className="kt-font-bold kt-link">https://github.com</a>
                                                            </div>
                                                        </div>
                                                        <div className="kt-chat__message">
                                                            <div className="kt-chat__user">
                                                                <span className="kt-media kt-media--circle kt-media--sm">
                                                                    <img src="/assets/media/users/100_12.jpg" alt="image"/>
                                                                </span>
                                                                <span className="kt-chat__username">Jason Muller</span>
                                                                <span className="kt-chat__datetime">30 Seconds</span>
                                                            </div>
                                                            <div className="kt-chat__text kt-bg-light-success">
                                                                Discover what students who viewed Learn Figma - UI/UX Design <br/>Essential Training also viewed
                                                            </div>
                                                        </div>
                                                        <div className="kt-chat__message kt-chat__message--right">
                                                            <div className="kt-chat__user">
                                                                <span className="kt-chat__datetime">Just Now</span>
                                                                <span className="kt-chat__username">You</span>
                                                                <span className="kt-media kt-media--circle kt-media--sm">
                                                                    <img src="/personal/img/default-avatar.png" alt="image"/>
                                                                </span>
                                                            </div>
                                                            <div className="kt-chat__text kt-bg-light-brand">
                                                                Most purchased Business courses during this sale!
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : ""
                        }

                        {/*<div className="kt-form__actions">
                            <button onClick={(e) => onClickPrevious(e)} className="btn btn-secondary btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u" data-ktwizard-type="action-prev">
                                PRÉCÉDENT
                            </button>

                            <button onClick={(e) => onClickNext(e)} className="btn btn-brand btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u" data-ktwizard-type="action-next">
                                SUIVANTE
                            </button>
                        </div>*/}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClaimDetails;
