import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    useParams,
    Link
} from "react-router-dom";
import {connect} from "react-redux";
import {loadCss, loadScript} from "../../helpers/function";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import {AUTH_TOKEN} from "../../constants/token";
import Loader from "../components/Loader";
import FusionClaim from "../components/FusionClaim";
import ReasonModal from "../components/ReasonModal";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
loadCss("/assets/css/pages/wizard/wizard-2.css");
loadScript("/assets/js/pages/custom/wizard/wizard-2.js");

const ClaimAssignDetail = (props) => {
    const {id} = useParams();
    if (!verifyPermission(props.userPermissions, "show-claim-awaiting-assignment"))
        window.location.href = ERROR_401;

    const [claim, setClaim] = useState(null);
    const [copyClaim, setCopyClaim] = useState(null);
    const [showReason, setShowReason] = useState(false);

    useEffect(() => {
        async function fetchData() {
            axios.get(`${appConfig.apiDomaine}/claim-awaiting-assignment/${id}`)
                .then(response => {
                    setClaim(response.data);
                })
                .catch(error => console.log("Something is wrong"))
        }
        fetchData();
    }, []);

    const onClickFusionButton = async (newClaim) => {
        await setCopyClaim(newClaim);
        document.getElementById(`modal-button`).click();
    };

    const showReasonInput = async () => {
        await setShowReason(true);
        document.getElementById("reason-modal").click();
    };

    const sendData = data => {
        console.log(data);
    };

    return (
        verifyPermission(props.userPermissions, "show-claim-awaiting-assignment") ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                <Link to="/settings/claim-assign" className="kt-subheader__title">
                                    Plaintes à affectées
                                </Link>
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#" className="kt-subheader__breadcrumbs-home">
                                    <i className="flaticon2-shelter"/>
                                </a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#detail" onClick={e => e.preventDefault()} style={{cursor: "default"}} className="kt-subheader__breadcrumbs-link">
                                    Détail
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <div className="kt-portlet">
                        <div className="kt-portlet__body kt-portlet__body--fit">
                            <div className="kt-grid  kt-wizard-v2 kt-wizard-v2--white" id="kt_wizard_v2" data-ktwizard-state="step-first">
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
                                                        <i className="flaticon-clipboard"/>
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
                                                                    <span className="mx-lg-4 kt-badge kt-badge--success  kt-badge--inline kt-badge--pill">{claim.files.length}</span>
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
                                                        <i className="flaticon2-copy"/>
                                                    </div>
                                                    <div className="kt-wizard-v2__nav-label">
                                                        <div className="kt-wizard-v2__nav-label-title">
                                                            Les doublons
                                                            {
                                                                !claim ? "" : (
                                                                    <span className="mx-lg-4 kt-badge kt-badge--success  kt-badge--inline kt-badge--pill">{claim.duplicates.length}</span>
                                                                )
                                                            }
                                                        </div>
                                                        <div className="kt-wizard-v2__nav-label-desc">
                                                            Voir les doublons
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
                                                <div className="kt-wizard-v2__nav-body">
                                                    <div className="kt-wizard-v2__nav-icon">
                                                        <i className="flaticon-truck"/>
                                                    </div>
                                                    <div className="kt-wizard-v2__nav-label">
                                                        <div className="kt-wizard-v2__nav-label-title">
                                                            Transfert de la plainte
                                                        </div>
                                                        <div className="kt-wizard-v2__nav-label-desc">
                                                            Transferez la plainte au destinateur
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

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
                                        </div>
                                    </div>
                                </div>

                                <div className="kt-grid__item kt-grid__item--fluid kt-wizard-v2__wrapper">
                                    <form className="kt-form" id="kt_form">
                                        <div className="d-flex justify-content-end">
                                            <button className="btn btn-primary btn-sm mx-2">S'affecter la plainte</button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => showReasonInput()}>
                                                Rejeter la plainte
                                            </button>
                                            <button id={"reason-modal"} style={{display: "none"}} type="button" className="btn btn-bold btn-label-brand btn-sm" data-toggle="modal" data-target="#kt_modal_4_2"/>
                                        </div>

                                        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content" data-ktwizard-state="current">
                                            <div className="kt-heading kt-heading--md">Passez en revue les détails du client</div>
                                            <div className="kt-form__section kt-form__section--first">
                                                <div className="kt-wizard-v2__review">
                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-widget kt-widget--user-profile-1">
                                                            <div className="kt-widget__head">
                                                                <div className="kt-widget__media">
                                                                    <img src="/personal/img/default-avatar.png" alt="image"/>
                                                                </div>
                                                                <div className="kt-widget__content" style={{marginTop: "auto", marginBottom: "auto"}}>
                                                                    <div className="kt-widget__section">
                                                                        {
                                                                            !claim ? (
                                                                                <Loader/>
                                                                            ) : (
                                                                                <a href="#" className="kt-widget__username">
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
                                                                                <span className="fa fa-venus-mars" style={{fontSize: "1.5rem"}}/>
                                                                                <span className="kt-widget__data">{claim.claimer.sexe === 'F' ? "Féminin" : "Masculin"}</span>
                                                                            </div>
                                                                            <div className="kt-widget__info">
                                                                                <span className="fa fa-envelope" style={{fontSize: "1.5rem"}}/>
                                                                                <span className="kt-widget__data">
                                                                                {
                                                                                    claim.claimer.email.map((mail, index) => (
                                                                                        index === claim.claimer.email.length - 1 ? mail : mail+"/ "
                                                                                    ))
                                                                                }
                                                                            </span>
                                                                            </div>
                                                                            <div className="kt-widget__info">
                                                                                <span className="fa fa-phone-alt" style={{fontSize: "1.5rem"}}/>
                                                                                <span className="kt-widget__data">
                                                                                {
                                                                                    claim.claimer.telephone.map((telephone, index) => (
                                                                                        index === claim.claimer.telephone.length - 1 ? telephone : telephone+"/ "
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
                                                                    Canal de réception: <span className="mx-2">{claim.request_channel ? claim.request_channel.name["fr"] : "Pas de canal de réception"}</span><br/>
                                                                    Canal de réponse: <span className="mx-2">{claim.response_channel ? claim.response_channel.name["fr"] : "Pas de canal de réponse"}</span><br/>
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
                                                                    Institution concèrné: <span className="mx-2">{claim.institution_targeted.name} 1</span><br/>
                                                                    Unité concèrné: <span className="mx-2">{claim.unit_targeted ? claim.unit_targeted.name["fr"] : "Pas d'institution ciblé"}</span><br/>
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
                                                                    Objet de plainte: <span className="mx-2">{claim.claim_object.name["fr"]}</span><br/>
                                                                    <br/>
                                                                    Numéro de compte concèrné: <span className="mx-2">{claim.account_targeted ? claim.account_targeted.number : "Pas de compte cible"}</span><br/>
                                                                    <br/>
                                                                    Montant réclamé: <span className="mx-2">{claim.amount_disputed ? `${claim.amount_disputed} ${claim.amount_currency.name["fr"]}` : "Pas de montant"}</span><br/>
                                                                    <br/>
                                                                    Date de l'évernement: <span className="mx-2">{claim.created_at}</span><br/>
                                                                    <br/>
                                                                    <strong>Description:</strong> <span className="mx-2">{claim.description}</span><br/>
                                                                    <br/>
                                                                    <strong>Attente:</strong> <span className="mx-2">{claim.claimer_expectation}</span><br/>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
                                            <div className="kt-heading kt-heading--md">Les pièces jointes de la plainte</div>
                                            <div className="kt-form__section kt-form__section--first">
                                                <div className="kt-wizard-v2__review">
                                                    {
                                                        !claim ? "" : (
                                                            claim.files.length ? (
                                                                claim.files.map((file, index) => (
                                                                    <div className="kt-wizard-v2__review-item" key={index}>
                                                                        <div className="kt-wizard-v2__review-title">
                                                                            Pièce jointe Nº{index + 1}
                                                                        </div>
                                                                        <div className="kt-wizard-v2__review-content">
                                                                            <a href={`${appConfig.apiDomaine}${file.url}`} download={true} target={"_blank"}>
                                                                                {file.title}
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="kt-wizard-v2__review-item" >
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

                                        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
                                            <div className="kt-heading kt-heading--md">Les doublons possibles pour la plainte</div>
                                            <div className="kt-form__section kt-form__section--first">
                                                <div className="kt-wizard-v2__review">
                                                    {
                                                        !claim ? "" : (
                                                            claim.duplicates.length ? (
                                                                claim.duplicates.map((newClaim, index) => (
                                                                    <div className="kt-wizard-v2__review-item" key={index}>
                                                                        <div className="kt-wizard-v2__review-content">
                                                                            <div className="kt-widget kt-widget--user-profile-3">
                                                                                <div className="kt-widget__top">
                                                                                    <div className="kt-widget__content" style={{paddingLeft: "0px"}}>
                                                                                        <div className="kt-widget__head">
                                                                                            <div className="kt-wizard-v2__review-title">Doublon Nº{index + 1}</div>
                                                                                            {
                                                                                                verifyPermission(props.userPermissions, "merge-claim-awaiting-assignment") ? (
                                                                                                    <div className="kt-widget__action">
                                                                                                        <button type="button" className="btn btn-brand btn-sm btn-upper" onClick={() => onClickFusionButton(newClaim)}>Fusioner</button>
                                                                                                    </div>
                                                                                                ) : ""
                                                                                            }
                                                                                        </div>

                                                                                        <div className="kt-widget__subhead">
                                                                                            <a href="#fullname" onClick={e => e.preventDefault()}><i className="flaticon2-calendar-3"/>{`${newClaim.claimer.lastname} ${newClaim.claimer.firstname}`}</a>
                                                                                            <a href="#datetime" onClick={e => e.preventDefault()}><i className="flaticon2-time"/>{newClaim.created_at}</a>
                                                                                        </div>

                                                                                        <div className="kt-widget__info">
                                                                                            <div className="kt-widget__desc">
                                                                                                {newClaim.description}
                                                                                            </div>
                                                                                            <div className="kt-widget__progress">
                                                                                                <div className="kt-widget__text">
                                                                                                    Pourcentage
                                                                                                </div>
                                                                                                <div className="progress" style={{height: "5px",width: newClaim.duplicate_percent+"%"}}>
                                                                                                    <div className="progress-bar kt-bg-danger" role="progressbar" style={{width: "46%"}} aria-valuenow="35" aria-valuemin="0" aria-valuemax="100"/>
                                                                                                </div>
                                                                                                <div className="kt-widget__stats">
                                                                                                    {newClaim.duplicate_percent}%
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="kt-wizard-v2__review-item" >
                                                                    <div className="kt-wizard-v2__review-title">
                                                                        Pas de doublon
                                                                    </div>
                                                                </div>
                                                            )
                                                        )
                                                    }

                                                </div>
                                            </div>
                                        </div>

                                        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
                                            <div className="kt-heading kt-heading--md">Transfert de la plainte</div>
                                            <div className="kt-form__section kt-form__section--first">
                                                <div className="kt-wizard-v2__review">
                                                    <div className="form-group">
                                                        <label>Choix du transfert</label>
                                                        <div className="kt-radio-inline">
                                                            <label className="kt-radio">
                                                                <input type="radio" name="radio2" checked={true}/> Tranferer à une unité <span/>
                                                            </label>
                                                            <label className="kt-radio">
                                                                <input type="radio" name="radio2"/> Transferer à une institution <span/>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-wizard-v2__review-title">
                                                            Tranferer à une unité
                                                        </div>
                                                        <div className="kt-wizard-v2__review-content">
                                                            <div className="form-group">
                                                                <label>Unité</label>
                                                                <select className="form-control">
                                                                    <option value="">Selectioner l'unité</option>
                                                                    <option value="overnight" selected>Unité 1</option>
                                                                    <option value="express">Unité 2</option>
                                                                    <option value="basic">Unité 3</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-wizard-v2__review-title">
                                                            Transferer à une institution
                                                        </div>
                                                        <div className="kt-wizard-v2__review-content">
                                                            <div className="form-group">
                                                                <label>Institution</label>
                                                                <select className="form-control" disabled={true}>
                                                                    <option value="">Selectionez l'institution</option>
                                                                    <option value="overnight" selected>Institution 1</option>
                                                                    <option value="express">Institution 2</option>
                                                                    <option value="basic">Institution 3</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
                                            <div className="kt-heading kt-heading--md">Affectation de la plainte</div>
                                            <div className="kt-form__section kt-form__section--first">
                                                <div className="kt-wizard-v2__review">

                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-wizard-v2__review-content">
                                                            <div className="form-group">
                                                                <label>Choisir l'agent</label>
                                                                <select className="form-control">
                                                                    <option value="">Agent 1</option>
                                                                    <option value="overnight" selected>Agent 2</option>
                                                                    <option value="express">Agent 3</option>
                                                                    <option value="basic">Agent 4</option>
                                                                </select>
                                                            </div>
                                                            <div className="form-group d-flex justify-content-between">
                                                                <button className="btn btn-primary">Affecter la plainte</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="kt-form__actions">
                                            <button className="btn btn-secondary btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u" data-ktwizard-type="action-prev">
                                                PRÉCÉDENT
                                            </button>
                                            {/*<button className="btn btn-success btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u" data-ktwizard-type="action-submit">
                                                TRANSFÉRER
                                            </button>*/}
                                            <button className="btn btn-brand btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u" data-ktwizard-type="action-next">
                                                SUIVANTE
                                            </button>
                                        </div>
                                    </form>

                                    {
                                        showReason ? (
                                            <ReasonModal
                                                reasonTitle={"Motif de rejet"}
                                                reasonLabel={"Le motif"}
                                                onClose={() => setShowReason(false)}
                                                onGetData={(data) => sendData(data)}
                                            />
                                        ) : ""
                                    }

                                    {
                                        verifyPermission(props.userPermissions, "merge-claim-awaiting-assignment") ? (
                                            <div>
                                                <button style={{display: "none"}} id={`modal-button`} type="button" className="btn btn-bold btn-label-brand btn-sm" data-toggle="modal" data-target="#kt_modal_4"/>
                                                {
                                                    copyClaim ? (
                                                        <FusionClaim
                                                            claim={claim}
                                                            copyClaim={copyClaim}
                                                            onCloseModal={() => setCopyClaim(null)}
                                                        />
                                                    ) : ""
                                                }
                                            </div>
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
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(ClaimAssignDetail);
