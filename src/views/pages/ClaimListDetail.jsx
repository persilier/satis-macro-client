import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    useParams,
    Link
} from "react-router-dom";
import {connect} from "react-redux";
import Select from "react-select";
import {loadCss, loadScript} from "../../helpers/function";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import {AUTH_TOKEN} from "../../constants/token";
import Loader from "../components/Loader";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastAssignClaimSuccessMessageConfig
} from "../../config/toastConfig";
import ReasonModal from "../components/ReasonModal";
import {AssignClaimConfirmation} from "../components/ConfirmationAlert";
import {confirmAssignConfig} from "../../config/confirmConfig";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
loadCss("/assets/css/pages/wizard/wizard-2.css");
loadScript("/assets/js/pages/custom/wizard/wizard-2.js");
loadScript("/assets/js/pages/custom/chat/chat.js");


const ClaimListDetail = (props) => {
    document.title = "Satis client - Détail plainte";
    const {id} = useParams();

    if (!verifyPermission(props.userPermissions, "assignment-claim-awaiting-treatment"))
        window.location.href = ERROR_401;

    const [claim, setClaim] = useState(null);
    const [showReason, setShowReason] = useState(false);
    const [reasonTitle, setReasonTitle] = useState("");
    const [reasonLabel, setReasonLabel] = useState("");
    const [action, setAction] = useState("");
    const [staffs, setStaffs] = useState([]);
    const [errors, setErrors] = useState([]);
    const [staff, setStaff] = useState(null);
    const [startRequest, setStartRequest] = useState(false);

    const formatStaffsOptions = (data) => {
        const newData = [];
        for (let i = 0; i < data.length; i++)
            newData.push({value: data[i].id, label: `${data[i].identite.lastname} ${data[i].identite.firstname}`});
        return newData;
    };

    useEffect(() => {
        async function fetchData() {
            await axios.get(`${appConfig.apiDomaine}/claim-awaiting-treatment/${id}/edit`)
                .then(response => {
                    setClaim(response.data.claim);
                    setStaffs(formatStaffsOptions(response.data.staffs));
                })
                .catch(error => console.log("Something is wrong"));

        }
        fetchData();
    }, [id]);

    const onChangeStaff = (selected) => {
        setStaff(selected);
    };

    const selfAssign = () => {
        AssignClaimConfirmation.fire(confirmAssignConfig)
            .then(response => {
                if (response.value) {
                    axios.put(`${appConfig.apiDomaine}/claim-awaiting-treatment/${id}/self-assignment`, {})
                        .then(response => {
                            ToastBottomEnd.fire(toastAssignClaimSuccessMessageConfig);
                            window.location.href = "/process/unit-claims";
                        })
                        .catch(error => console.log("Something is wrong"))
                }
            })
    };

    const assignClaim = () => {
        setStartRequest(true);
        axios.put(`${appConfig.apiDomaine}/claim-awaiting-treatment/${id}/assignment`, {staff_id: staff ? staff.value : ""})
            .then(response => {
                ToastBottomEnd.fire(toastAssignClaimSuccessMessageConfig);
                setStartRequest(false);
                setStaff(null);
                setErrors([]);
                window.location.href = "/process/unit-claims";
            })
            .catch(error => {
                setStartRequest(false);
                setErrors(error.response.data.error.staff_id)
            })
        ;
    };

    const showReasonInput = async (type) => {
        await setReasonTitle("Motif de rejet");
        await setReasonLabel("Le motif");
        await setAction(type);
        await setShowReason(true);
        document.getElementById("reason-modal").click();
    };

    return (
        verifyPermission(props.userPermissions, "assignment-claim-awaiting-treatment") ? (
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
                                    <Link to="/process/unit-claims" className="kt-subheader__breadcrumbs-link">
                                        Liste des plaintes
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
                                                                !claim ? "" : (
                                                                    <span
                                                                        className="mx-lg-4 kt-badge kt-badge--success  kt-badge--inline kt-badge--pill">{claim.files.length}</span>
                                                                )
                                                            }
                                                        </div>
                                                        <div className="kt-wizard-v2__nav-label-desc">
                                                            Voir les pièces jointes de la plainte
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
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

                                            {
                                                props.lead ? (
                                                    <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
                                                        <div className="kt-wizard-v2__nav-body">
                                                            <div className="kt-wizard-v2__nav-icon">
                                                                <i className="flaticon-paper-plane"/>
                                                            </div>
                                                            <div className="kt-wizard-v2__nav-label">
                                                                <div className="kt-wizard-v2__nav-label-title">
                                                                    Affectation de la plainte
                                                                </div>
                                                                <div className="kt-wizard-v2__nav-label-desc">
                                                                    Affectez la plainte à un agent
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
                                        <div className="d-flex justify-content-end">
                                            {
                                                verifyPermission(props.userPermissions, "self-assignment-claim-awaiting-treatment") ? (
                                                    <button className="btn btn-primary btn-sm mx-2"
                                                            onClick={selfAssign}>S'affecter la plainte</button>
                                                ) : ""
                                            }
                                            {
                                                verifyPermission(props.userPermissions, "rejected-claim-awaiting-treatment") ? (
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => showReasonInput("reject")}>
                                                        Rejeter la plainte
                                                    </button>
                                                ) : ""
                                            }
                                            <button id={"reason-modal"} style={{display: "none"}} type="button"
                                                    className="btn btn-bold btn-label-brand btn-sm"
                                                    data-toggle="modal" data-target="#kt_modal_4_2"/>
                                        </div>

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
                                                                            !claim ? (
                                                                                <Loader/>
                                                                            ) : (
                                                                                <a href="#"
                                                                                   className="kt-widget__username">
                                                                                    {`${claim.claimer.lastname} ${claim.claimer.firstname}`}
                                                                                    <i className="flaticon2-correct kt-font-success"/>
                                                                                </a>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="kt-widget__body">
                                                                {
                                                                    !claim ? "" : (
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
                                                            !claim ? "" : (
                                                                <div className="kt-wizard-v2__review-content">
                                                                    Canal de réception: <span
                                                                    className="mx-2">{claim.request_channel ? claim.request_channel.name["fr"] : "Pas de canal de réception"}</span><br/>
                                                                    Canal de réponse: <span
                                                                    className="mx-2">{claim.response_channel ? claim.response_channel.name["fr"] : "Pas de canal de réponse"}</span><br/>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-wizard-v2__review-title">
                                                            Cible
                                                        </div>
                                                        {
                                                            !claim ? "" : (
                                                                <div className="kt-wizard-v2__review-content">
                                                                    Institution concèrné: <span
                                                                    className="mx-2">{claim.institution_targeted.name}</span><br/>
                                                                    Unité concèrné: <span
                                                                    className="mx-2">{claim.unit_targeted ? claim.unit_targeted.name["fr"] : "Pas d'institution ciblé"}</span><br/>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-wizard-v2__review-title">
                                                            Spécification plainte
                                                        </div>
                                                        {
                                                            !claim ? "" : (
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
                                                        !claim ? "" : (
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
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="kt-wizard-v2__content"
                                             data-ktwizard-type="step-content">
                                            <div className="kt-heading kt-heading--md">Les commentaires</div>
                                            <div className="kt-grid__item kt-grid__item--fluid kt-app__content"
                                                 id="kt_chat_content">
                                                <div className="kt-chat">
                                                    <div className="kt-portlet__body" style={{padding: "0"}}>
                                                        <div className="kt-scroll kt-scroll--pull"
                                                             data-mobile-height="300">
                                                            <div className="kt-chat__messages">
                                                                <div className="kt-chat__message">
                                                                    <div className="kt-chat__user">
                                                                        <span
                                                                            className="kt-media kt-media--circle kt-media--sm">
                                                                            <img src="/assets/media/users/100_12.jpg"
                                                                                 alt="image"/>
                                                                        </span>
                                                                        <span className="kt-chat__username">Jason Muller</span>
                                                                        <span className="kt-chat__datetime">2 Hours</span>
                                                                    </div>
                                                                    <div
                                                                        className="kt-chat__text kt-bg-light-success">
                                                                        How likely are you to recommend our
                                                                        company <br/>to your friends and family?
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="kt-chat__message kt-chat__message--right">
                                                                    <div className="kt-chat__user">
                                                                        <span className="kt-chat__datetime">30 Seconds</span>
                                                                        <span
                                                                            className="kt-chat__username">You</span>
                                                                        <span
                                                                            className="kt-media kt-media--circle kt-media--sm">
                                                                            <img src="/personal/img/default-avatar.png"
                                                                                 alt="image"/>
                                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        className="kt-chat__text kt-bg-light-brand">
                                                                        Hey there, we’re just writing to let you
                                                                        know <br/>that you’ve been subscribed to
                                                                        a repository on GitHub.
                                                                    </div>
                                                                </div>
                                                                <div className="kt-chat__message">
                                                                    <div className="kt-chat__user">
                                                                        <span
                                                                            className="kt-media kt-media--circle kt-media--sm">
                                                                            <img src="/assets/media/users/100_12.jpg"
                                                                                 alt="image"/>
                                                                        </span>
                                                                        <span className="kt-chat__username">Jason Muller</span>
                                                                        <span className="kt-chat__datetime">30 Seconds</span>
                                                                    </div>
                                                                    <div
                                                                        className="kt-chat__text kt-bg-light-success">
                                                                        Ok, Understood!
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="kt-chat__message kt-chat__message--right">
                                                                    <div className="kt-chat__user">
                                                                        <span className="kt-chat__datetime">Just Now</span>
                                                                        <span
                                                                            className="kt-chat__username">You</span>
                                                                        <span
                                                                            className="kt-media kt-media--circle kt-media--sm">
                                                                            <img src="/personal/img/default-avatar.png"
                                                                                 alt="image"/>
                                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        className="kt-chat__text kt-bg-light-brand">
                                                                        You’ll receive notifications for all
                                                                        issues, pull requests!
                                                                    </div>
                                                                </div>
                                                                <div className="kt-chat__message">
                                                                    <div className="kt-chat__user">
                                                                        <span
                                                                            className="kt-media kt-media--circle kt-media--sm">
                                                                            <img src="/assets/media/users/100_12.jpg"
                                                                                 alt="image"/>
                                                                        </span>
                                                                        <span className="kt-chat__username">Jason Muller</span>
                                                                        <span className="kt-chat__datetime">2 Hours</span>
                                                                    </div>
                                                                    <div
                                                                        className="kt-chat__text kt-bg-light-success">
                                                                        You were automatically <b
                                                                        className="kt-font-brand">subscribed</b>
                                                                        <br/>because you’ve been given access to
                                                                        the repository
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="kt-chat__message kt-chat__message--right">
                                                                    <div className="kt-chat__user">
                                                                        <span className="kt-chat__datetime">30 Seconds</span>
                                                                        <span
                                                                            className="kt-chat__username">You</span>
                                                                        <span
                                                                            className="kt-media kt-media--circle kt-media--sm">
                                                                            <img src="/personal/img/default-avatar.png"
                                                                                 alt="image"/>
                                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        className="kt-chat__text kt-bg-light-brand">
                                                                        You can unwatch this repository
                                                                        immediately <br/>by clicking here: <a
                                                                        href="#"
                                                                        className="kt-font-bold kt-link">https://github.com</a>
                                                                    </div>
                                                                </div>
                                                                <div className="kt-chat__message">
                                                                    <div className="kt-chat__user">
                                                                        <span
                                                                            className="kt-media kt-media--circle kt-media--sm">
                                                                            <img src="/assets/media/users/100_12.jpg"
                                                                                 alt="image"/>
                                                                        </span>
                                                                        <span className="kt-chat__username">Jason Muller</span>
                                                                        <span className="kt-chat__datetime">30 Seconds</span>
                                                                    </div>
                                                                    <div
                                                                        className="kt-chat__text kt-bg-light-success">
                                                                        Discover what students who viewed Learn
                                                                        Figma - UI/UX Design <br/>Essential
                                                                        Training also viewed
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="kt-chat__message kt-chat__message--right">
                                                                    <div className="kt-chat__user">
                                                                        <span className="kt-chat__datetime">Just Now</span>
                                                                        <span
                                                                            className="kt-chat__username">You</span>
                                                                        <span
                                                                            className="kt-media kt-media--circle kt-media--sm">
                                                                            <img src="/personal/img/default-avatar.png"
                                                                                 alt="image"/>
                                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        className="kt-chat__text kt-bg-light-brand">
                                                                        Most purchased Business courses during
                                                                        this sale!
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="kt-portlet__foot" style={{padding: "0"}}>
                                                        <div className="kt-chat__input">
                                                            <div className="kt-chat__editor">
                                                                        <textarea style={{height: "50px"}}
                                                                                  placeholder="Votre commentaire..."/>
                                                            </div>
                                                            <div className="kt-chat__toolbar">
                                                                <div className="kt_chat__actions">
                                                                    <button type="button"
                                                                            className="btn btn-brand btn-md btn-upper btn-bold kt-chat__reply">Ajouter
                                                                        un commentaire
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            props.lead ? (
                                                <div className="kt-wizard-v2__content"
                                                     data-ktwizard-type="step-content">
                                                    <div className="kt-heading kt-heading--md">Affectation de la
                                                        plainte
                                                    </div>
                                                    <div className="kt-form__section kt-form__section--first">
                                                        <div className="kt-wizard-v2__review">
                                                            <div className="kt-wizard-v2__review-content">
                                                                <div
                                                                    className={errors.length ? "form-group validated" : "form-group"}>
                                                                    <label>Agent</label>
                                                                    <Select
                                                                        isClearable
                                                                        placeholder={"Veillez selectioner l'agent"}
                                                                        value={staff}
                                                                        onChange={onChangeStaff}
                                                                        options={staffs}
                                                                    />
                                                                    {
                                                                        errors.map((error, index) => (
                                                                            <div key={index}
                                                                                 className="invalid-feedback">
                                                                                {error}
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </div>
                                                                <div
                                                                    className="form-group d-flex justify-content-between">
                                                                    {
                                                                        !startRequest ? (
                                                                            <button className="btn btn-primary"
                                                                                    onClick={assignClaim}>Affecter la
                                                                                plainte</button>
                                                                        ) : (
                                                                            <button
                                                                                className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                                                                type="button" disabled>
                                                                                Chargement...
                                                                            </button>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
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
                                        ) : ""
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

export default connect(mapStateToProps)(ClaimListDetail);
