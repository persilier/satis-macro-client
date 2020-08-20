import React from "react";
import {formatDateToTimeStampte} from "../../helpers/function";

const ClaimButtonDetail = ({claim}) => {
    return (
        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
            <div className="kt-heading kt-heading--md">Détails de la réclamation</div>
            <div className="kt-form__section kt-form__section--first">
                <div className="kt-wizard-v2__review">
                    <div className="kt-wizard-v2__review-item">
                        {
                            !claim ? null : (
                                <div className="kt-wizard-v2__review-content">
                                    <strong>Référence:</strong> <span className="mx-2">{claim.reference ? claim.reference : "Pas de canal de référence"}</span>
                                    <br/>
                                    <br/>
                                </div>
                            )
                        }
                        <div className="kt-wizard-v2__review-title">
                            <h5><strong>Canaux</strong></h5>
                        </div>
                        {
                            !claim ? null : (
                                <div className="kt-wizard-v2__review-content">
                                    <strong>Canal de réception:</strong> <span
                                    className="mx-2">{claim.request_channel ? claim.request_channel.name["fr"] : "Pas de canal de réception"}</span><br/>
                                    <strong>Canal de réponse préférentiel:</strong> <span
                                    className="mx-2">{claim.response_channel ? claim.response_channel.name["fr"] : "Pas de canal de réponse"}</span><br/>
                                </div>
                            )
                        }
                    </div>
                    <div className="kt-wizard-v2__review-item">
                        <div className="kt-wizard-v2__review-title">
                            <h5><strong>Cible</strong></h5>
                        </div>
                        {
                            !claim ? null : (
                                <div className="kt-wizard-v2__review-content">
                                    <strong>Institution</strong>: <span
                                    className="mx-2">{claim.institution_targeted.name} 1</span><br/>
                                    <strong>Unité</strong>: <span
                                    className="mx-2">{claim.unit_targeted ? claim.unit_targeted.name["fr"] : "Pas d'institution ciblé"}</span><br/>
                                </div>
                            )
                        }
                    </div>
                    <div className="kt-wizard-v2__review-item">
                        <div className="kt-wizard-v2__review-title">
                            <h5><strong>Spécifications</strong></h5>
                        </div>
                        {
                            !claim ? null : (
                                <div className="kt-wizard-v2__review-content">
                                    <strong>Objet</strong>: <span
                                    className="mx-2">{claim.claim_object.name["fr"]}</span><br/>
                                    <br/>
                                    <strong>Numéro de compte </strong>: <span
                                    className="mx-2">{claim.account_targeted ? claim.account_targeted.number : "Pas de compte cible"}</span><br/>
                                    <br/>
                                    <strong>Montant réclamé</strong>: <span
                                    className="mx-2">{claim.amount_disputed ? `${claim.amount_disputed} ${claim.amount_currency.name["fr"]}` : "Pas de montant"}</span><br/>
                                    <br/>
                                    <strong>Date de réception</strong>: <span className="mx-2">{claim.created_at ? formatDateToTimeStampte(claim.created_at) : "Pas de date"}</span><br/>
                                    <br/>
                                    <strong>Date de l'évernement</strong>: <span className="mx-2">{claim.event_occured_at ? formatDateToTimeStampte(claim.event_occured_at) : "Pas de date"}</span><br/>
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
    );
};

export default ClaimButtonDetail;
