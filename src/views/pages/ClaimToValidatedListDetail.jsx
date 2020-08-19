import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    useParams,
    Link
} from "react-router-dom";
import {connect} from "react-redux";
import moment from "moment";
import {debug, loadCss, loadScript, validatedClaimRule} from "../../helpers/function";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import {AUTH_TOKEN} from "../../constants/token";
import Loader from "../components/Loader";
import ReasonModal from "../components/ReasonModal";
import {ToastBottomEnd} from "../components/Toast";
import {toastErrorMessageWithParameterConfig} from "../../config/toastConfig";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
loadCss("/assets/css/pages/wizard/wizard-2.css");
loadScript("/assets/js/pages/custom/wizard/wizard-2.js");
loadScript("/assets/js/pages/custom/chat/chat.js");


const ClaimToValidatedListDetail = (props) => {
    document.title = "Satis client - Détail plainte";
    const {id} = useParams();
    const validation = validatedClaimRule(id);

    if (!(verifyPermission(props.userPermissions, 'show-claim-awaiting-validation-my-institution') ||
        verifyPermission(props.userPermissions, 'show-claim-awaiting-validation-any-institution')))
        window.location.href = ERROR_401;

    const [claim, setClaim] = useState(null);
    const [showReason, setShowReason] = useState(false);
    const [reasonTitle, setReasonTitle] = useState("");
    const [reasonLabel, setReasonLabel] = useState("");
    const [action, setAction] = useState("");
    const [startRequest, setStartRequest] = useState(true);

    useEffect(() => {
        async function fetchData() {
            let endpoint = "";
            if (verifyPermission(props.userPermissions, 'show-claim-awaiting-validation-my-institution'))
                endpoint = `${appConfig.apiDomaine}/claim-awaiting-validation-my-institution/${id}`;
            else if (verifyPermission(props.userPermissions, 'show-claim-awaiting-validation-any-institution'))
                endpoint = `${appConfig.apiDomaine}/claim-awaiting-validation-any-institution/${id}`;

            await axios.get(endpoint)
                .then(response => {
                    setStartRequest(false);
                    setClaim(response.data);
                })
                .catch(({response}) => {
                    setStartRequest(false);
                    if (response.data && response.data.code === 409)
                        ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(response.data.error));
                    else
                        console.log("Something is wrong")
                });
        }
        fetchData();
    }, [id]);

    const showReasonInput = async (type) => {
        if (type === "validateReject") {
            await setReasonTitle('Motif de rejet');
            await setReasonLabel('Le motif');
        } else if (type === "validateSolution") {
            await setReasonTitle('Solution à communiquer au client');
            await setReasonLabel('Solution');
        }
        await setAction(type);
        await setShowReason(true);
        document.getElementById("reason-modal").click();
    };

    return (
        verifyPermission(props.userPermissions, "show-claim-awaiting-validation-my-institution") ||
        verifyPermission(props.userPermissions, 'show-claim-awaiting-validation-any-institution') ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Processus
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()}
                                   className="kt-subheader__breadcrumbs-link" style={{cursor: "default"}}>
                                    Traitement
                                </a>
                                <span className="kt-subheader__separator kt-hidden"/>
                                <div className="kt-subheader__breadcrumbs">
                                    <a href="#icone" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                                    <span className="kt-subheader__breadcrumbs-separator"/>
                                    <Link to="/process/claim-to-validated" className="kt-subheader__breadcrumbs-link">
                                        Plaintes à valider
                                    </Link>
                                </div>
                            </div>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#" className="kt-subheader__breadcrumbs-home">
                                    <i className="flaticon2-shelter"/>
                                </a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#detail" onClick={e => e.preventDefault()} style={{cursor: "default"}}
                                   className="kt-subheader__breadcrumbs-link">
                                    Détail plainte
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <div className="kt-portlet">
                        <div className="kt-portlet__body kt-portlet__body--fit">
                            <div className="kt-grid  kt-wizard-v2 kt-wizard-v2--white" id="kt_wizard_v2"
                                 data-ktwizard-state="step-first">
                                <div className="kt-grid__item kt-wizard-v2__aside">
                                    <div className="kt-wizard-v2__nav">
                                        <div className="kt-wizard-v2__nav-items kt-wizard-v2__nav-items--clickable">
                                            <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step"
                                                 data-ktwizard-state="current">
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

                                            <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
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

                                            <div className="kt-wizard-v2__nav-item" href="#" data-ktwizard-type="step">
                                                <div className="kt-wizard-v2__nav-body">
                                                    <div className="kt-wizard-v2__nav-icon">
                                                        <i className="flaticon-file-2"/>
                                                    </div>
                                                    <div className="kt-wizard-v2__nav-label">
                                                        <div className="kt-wizard-v2__nav-label-title">
                                                            Pièces jointe plainte
                                                            {
                                                                startRequest ? null : (
                                                                    claim ? (
                                                                        <span className="mx-lg-4 kt-badge kt-badge--success  kt-badge--inline kt-badge--pill">{claim.files.length}</span>
                                                                    ) : null
                                                                )
                                                            }
                                                        </div>
                                                        <div className="kt-wizard-v2__nav-label-desc">
                                                            Voir les pièces jointes de la plainte
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {
                                                verifyPermission(props.userPermissions, validation[props.plan].permission) ? (
                                                    <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
                                                        <div className="kt-wizard-v2__nav-body">
                                                            <div className="kt-wizard-v2__nav-icon">
                                                                <i className="flaticon-list"/>
                                                            </div>
                                                            <div className="kt-wizard-v2__nav-label">
                                                                <div className="kt-wizard-v2__nav-label-title">
                                                                    Validation de la plainte
                                                                </div>
                                                                <div className="kt-wizard-v2__nav-label-desc">
                                                                    Valider le retour de l'agent sur la plainte
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : null
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="kt-grid__item kt-grid__item--fluid kt-wizard-v2__wrapper">
                                    <form className="kt-form" id="kt_form">
                                        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content"
                                             data-ktwizard-state="current">
                                            <div className="kt-heading kt-heading--md">Passez en revue les détails du
                                                client
                                            </div>
                                            <div className="kt-form__section kt-form__section--first">
                                                <div className="kt-wizard-v2__review">
                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-widget kt-widget--user-profile-1">
                                                            <div className="kt-widget__head">
                                                                <div className="kt-widget__media">
                                                                    <img src="/personal/img/default-avatar.png"
                                                                         alt="image"/>
                                                                </div>
                                                                <div className="kt-widget__content"
                                                                     style={{marginTop: "auto", marginBottom: "auto"}}>
                                                                    <div className="kt-widget__section">
                                                                        {
                                                                            startRequest ? (
                                                                                <Loader/>
                                                                            ) : (
                                                                                claim ? (
                                                                                    <a href="#"
                                                                                       className="kt-widget__username">
                                                                                        {`${claim.claimer.lastname} ${claim.claimer.firstname}`}
                                                                                        <i className="flaticon2-correct kt-font-success"/>
                                                                                    </a>
                                                                                ) : null
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="kt-widget__body">
                                                                {
                                                                    startRequest ? null : (
                                                                        claim ? (
                                                                            <div className="kt-widget__content">
                                                                                <div className="kt-widget__info">
                                                                                <span className="fa fa-venus-mars"
                                                                                      style={{fontSize: "1.5rem"}}/>
                                                                                    <span
                                                                                        className="kt-widget__data">{claim.claimer.sexe === 'F' ? "Féminin" : "Masculin"}</span>
                                                                                </div>
                                                                                <div className="kt-widget__info">
                                                                                <span className="fa fa-envelope"
                                                                                      style={{fontSize: "1.5rem"}}/>
                                                                                    <span className="kt-widget__data">
                                                                                {
                                                                                    claim.claimer.email.map((mail, index) => (
                                                                                        index === claim.claimer.email.length - 1 ? mail : mail + "/ "
                                                                                    ))
                                                                                }
                                                                            </span>
                                                                                </div>
                                                                                <div className="kt-widget__info">
                                                                                <span className="fa fa-phone-alt"
                                                                                      style={{fontSize: "1.5rem"}}/>
                                                                                    <span className="kt-widget__data">
                                                                                {
                                                                                    claim.claimer.telephone.map((telephone, index) => (
                                                                                        index === claim.claimer.telephone.length - 1 ? telephone : telephone + "/ "
                                                                                    ))
                                                                                }
                                                                            </span>
                                                                                </div>
                                                                                <div className="kt-widget__info">
                                                                                <span className="fa fa-location-arrow"
                                                                                      style={{fontSize: "1.5rem"}}/>
                                                                                    <span className="kt-widget__data">
                                                                                {claim.claimer.ville ? claim.claimer.ville : "Pas d'information sur la ville"}
                                                                            </span>
                                                                                </div>
                                                                            </div>
                                                                        ) : null
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
                                            <div className="kt-heading kt-heading--md">Information sur la plainte</div>
                                            <div className="kt-form__section kt-form__section--first">
                                                <div className="kt-wizard-v2__review">
                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-wizard-v2__review-title">
                                                            Canal
                                                        </div>
                                                        {
                                                            startRequest ? null : (
                                                                claim ? (
                                                                    <div className="kt-wizard-v2__review-content">
                                                                        Canal de réception: <span
                                                                        className="mx-2">{claim.request_channel ? claim.request_channel.name["fr"] : "Pas de canal de réception"}</span><br/>
                                                                        Canal de réponse: <span
                                                                        className="mx-2">{claim.response_channel ? claim.response_channel.name["fr"] : "Pas de canal de réponse"}</span><br/>
                                                                    </div>
                                                                ) : null
                                                            )
                                                        }
                                                    </div>
                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-wizard-v2__review-title">
                                                            Cible
                                                        </div>
                                                        {
                                                            startRequest ? null : (
                                                                claim ? (
                                                                    <div className="kt-wizard-v2__review-content">
                                                                        Institution concèrné: <span
                                                                        className="mx-2">{claim.institution_targeted.name}</span><br/>
                                                                        Unité concèrné: <span
                                                                        className="mx-2">{claim.unit_targeted ? claim.unit_targeted.name["fr"] : "Pas d'institution ciblé"}</span><br/>
                                                                    </div>
                                                                ) : null
                                                            )
                                                        }
                                                    </div>
                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-wizard-v2__review-title">
                                                            Spécification plainte
                                                        </div>
                                                        {
                                                            startRequest ? null : (
                                                                claim ? (
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
                                                                ) : null
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
                                            <div className="kt-heading kt-heading--md">Les pièces jointes de la
                                                plainte
                                            </div>
                                            <div className="kt-form__section kt-form__section--first">
                                                <div className="kt-wizard-v2__review">
                                                    {
                                                        startRequest ? null : (
                                                            claim ? (
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
                                                            ) : null
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            verifyPermission(props.userPermissions, validation[props.plan].permission) ? (
                                                <div className="kt-wizard-v2__content"
                                                     data-ktwizard-type="step-content">
                                                    <div className="kt-heading kt-heading--md">Validation de la
                                                        plainte
                                                    </div>
                                                    <div className="kt-form__section kt-form__section--first">
                                                        <div className="kt-wizard-v2__review">
                                                            {
                                                                !startRequest ? (
                                                                    claim ? (
                                                                        <div className="kt-wizard-v2__review-item">
                                                                            {
                                                                                claim.active_treatment.solved_at !== null ? (
                                                                                    <>
                                                                                        <div
                                                                                            className="kt-wizard-v2__review-title">
                                                                                            Traitement
                                                                                        </div>
                                                                                        <div
                                                                                            className="kt-wizard-2__veriew-content">
                                                                                            <div
                                                                                                className="kt-widget kt-widget--user-profile-3">
                                                                                                <div
                                                                                                    className="kt-widget__top">
                                                                                                    <div
                                                                                                        className="kt-widget__media kt-hidden-">
                                                                                                        <img
                                                                                                            src="/assets/media/users/100_13.jpg"
                                                                                                            alt="image"/>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="kt-widget__pic kt-widget__pic--danger kt-font-danger kt-font-boldest kt-font-light kt-hidden">
                                                                                                        JM
                                                                                                    </div>
                                                                                                    <div className="kt-widget__content">
                                                                                                        <div className="kt-widget__head">
                                                                                                        <span className="kt-widget__username">
                                                                                                            Traiter par {claim.active_treatment.responsible_staff.identite.lastname+" "+claim.active_treatment.responsible_staff.identite.firstname}
                                                                                                            <i className="flaticon2-correct"/>
                                                                                                        </span>
                                                                                                            <div
                                                                                                                className="kt-widget__action">
                                                                                                                {
                                                                                                                    verifyPermission(props.userPermissions, "validate-treatment-my-institution") ||
                                                                                                                    verifyPermission(props.userPermissions, "validate-treatment-any-institution") ? (
                                                                                                                        <button
                                                                                                                            type="button"
                                                                                                                            className="btn btn-label-success btn-sm btn-upper"
                                                                                                                            onClick={() => showReasonInput("validateReject")}>
                                                                                                                            Rejeter
                                                                                                                        </button>
                                                                                                                    ) : null
                                                                                                                }

                                                                                                                &nbsp;
                                                                                                                {
                                                                                                                    verifyPermission(props.userPermissions, "validate-treatment-my-institution") ||
                                                                                                                    verifyPermission(props.userPermissions, "validate-treatment-any-institution") ? (
                                                                                                                        <button
                                                                                                                            type="button"
                                                                                                                            className="btn btn-brand btn-sm btn-upper"
                                                                                                                            onClick={() => showReasonInput("validateSolution")}>
                                                                                                                            Valider
                                                                                                                        </button>
                                                                                                                    ) : null
                                                                                                                }

                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="kt-widget__subhead">
                                                                                                            <a href={"#info"}
                                                                                                               onClick={(e) => e.preventDefault()}
                                                                                                               style={{cursor: "text"}}>
                                                                                                                <i className="flaticon2-new-email"/>
                                                                                                                {
                                                                                                                    claim.active_treatment.responsible_staff.identite.email.map(
                                                                                                                        (mail, index) => index !== claim.active_treatment.responsible_staff.identite.email.length - 1
                                                                                                                            ? mail+"/"
                                                                                                                            : mail+""
                                                                                                                    )
                                                                                                                }
                                                                                                            </a>
                                                                                                            <a href={"#info"}
                                                                                                               onClick={(e) => e.preventDefault()}
                                                                                                               style={{cursor: "text"}}>
                                                                                                                <i className="flaticon2-calendar-2"/>
                                                                                                                Traiter
                                                                                                                le {claim.active_treatment.solved_at}
                                                                                                            </a>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="kt-widget__info">
                                                                                                            <div
                                                                                                                className="kt-widget__desc">
                                                                                                                <strong
                                                                                                                    className="mr-2">Solution: </strong>
                                                                                                                {claim.active_treatment.solution}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        {
                                                                                                            claim.active_treatment.preventive_measures ? (
                                                                                                                <div
                                                                                                                    className="kt-widget__info">
                                                                                                                    <div
                                                                                                                        className="kt-widget__desc">
                                                                                                                        <strong
                                                                                                                            className="mr-2">Mésures
                                                                                                                            préventive: </strong>
                                                                                                                        {claim.active_treatment.preventive_measures}
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            ) : ""
                                                                                                        }
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>
                                                                                ) : ""
                                                                            }

                                                                            {
                                                                                claim.active_treatment.declared_unfounded_at !== null ? (
                                                                                    <>
                                                                                        <div
                                                                                            className="kt-wizard-v2__review-title">
                                                                                            Non fondée
                                                                                        </div>
                                                                                        <div
                                                                                            className="kt-wizard-2__veriew-content">
                                                                                            <div
                                                                                                className="kt-widget kt-widget--user-profile-3">
                                                                                                <div
                                                                                                    className="kt-widget__top">
                                                                                                    <div
                                                                                                        className="kt-widget__media kt-hidden-">
                                                                                                        <img
                                                                                                            src="/assets/media/users/100_13.jpg"
                                                                                                            alt="image"/>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="kt-widget__pic kt-widget__pic--danger kt-font-danger kt-font-boldest kt-font-light kt-hidden">
                                                                                                        JM
                                                                                                    </div>
                                                                                                    <div className="kt-widget__content">
                                                                                                        <div className="kt-widget__head">
                                                                                                        <span className="kt-widget__username">
                                                                                                            Traiter par {claim.active_treatment.responsible_staff.identite.lastname+" "+claim.active_treatment.responsible_staff.identite.firstname}
                                                                                                            <i className="flaticon2-correct"/>
                                                                                                        </span>
                                                                                                            <div className="kt-widget__action">
                                                                                                                <button type="button" className="btn btn-label-success btn-sm btn-upper" onClick={() => showReasonInput("validateReject")}>
                                                                                                                    Rejeter
                                                                                                                </button>
                                                                                                                &nbsp;
                                                                                                                <button type="button" className="btn btn-brand btn-sm btn-upper" onClick={() => showReasonInput("validateSolution")}>
                                                                                                                    Valider
                                                                                                                </button>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="kt-widget__subhead">
                                                                                                            <a href={"#info"}
                                                                                                               onClick={(e) => e.preventDefault()}
                                                                                                               style={{cursor: "text"}}>
                                                                                                                <i className="flaticon2-new-email"/>
                                                                                                                {
                                                                                                                    claim.active_treatment.responsible_staff.identite.email.map(
                                                                                                                        (mail, index) => index !== claim.active_treatment.responsible_staff.identite.email.length - 1
                                                                                                                            ? mail+"/"
                                                                                                                            : mail+""
                                                                                                                    )
                                                                                                                }
                                                                                                            </a>
                                                                                                            <a href={"#info"}
                                                                                                               onClick={(e) => e.preventDefault()}
                                                                                                               style={{cursor: "text"}}>
                                                                                                                <i className="flaticon2-calendar-2"/>
                                                                                                                Rejeter le {moment(claim.active_treatment.declared_unfounded_at).format('DD MMMM YYYY')} à {moment(claim.active_treatment.declared_unfounded_at).format('HH')}h{moment(claim.active_treatment.declared_unfounded_at).format('mm')}min
                                                                                                            </a>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="kt-widget__info">
                                                                                                            <div
                                                                                                                className="kt-widget__desc">
                                                                                                                <strong
                                                                                                                    className="mr-2">Raison: </strong>
                                                                                                                {claim.active_treatment.unfounded_reason}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>
                                                                                ) : ""
                                                                            }
                                                                            <button id={"reason-modal"}
                                                                                    style={{display: "none"}} type="button"
                                                                                    className="btn btn-bold btn-label-brand btn-sm"
                                                                                    data-toggle="modal"
                                                                                    data-target="#kt_modal_4_2"/>
                                                                        </div>
                                                                    ) : null
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null
                                        }

                                        <div className="kt-form__actions">
                                            <button
                                                className="btn btn-secondary btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u"
                                                data-ktwizard-type="action-prev">
                                                PRÉCÉDENT
                                            </button>

                                            <button
                                                className="btn btn-brand btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u"
                                                data-ktwizard-type="action-next">
                                                SUIVANTE
                                            </button>
                                        </div>
                                    </form>

                                    {
                                        showReason ? (
                                            <ReasonModal
                                                plan={props.plan}
                                                id={id}
                                                action={action}
                                                reasonTitle={reasonTitle}
                                                reasonLabel={reasonLabel}
                                                onClose={() => setShowReason(false)}
                                            />
                                        ) : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : ""
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        lead: state.user.user.staff.is_lead,
        plan: state.plan.plan,
    };
};

export default connect(mapStateToProps)(ClaimToValidatedListDetail);
