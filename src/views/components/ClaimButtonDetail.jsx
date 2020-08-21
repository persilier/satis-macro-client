import React from "react";
import {formatDateToTimeStampte} from "../../helpers/function";

const ClaimButtonDetail = ({claim, rejected}) => {
    return (
        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
            <div className="kt-heading kt-heading--md">Détails de la réclamation</div>
            <div className="kt-form__section kt-form__section--first">
                <div className="kt-wizard-v2__review">
                    <div className="kt-wizard-v2__review-item">
                        {
                            !claim ? null : (
                                <div className="kt-wizard-v2__review-content">
                                    <h5><span style={{color:"#48465b"}}>Référence:</span></h5>
                                    <span className="mx-2">{claim.reference ? claim.reference : "Pas de canal de référence"}</span>
                                    <br/>
                                    <br/>
                                </div>
                            )
                        }


                        {
                            rejected ? (
                                claim && claim.active_treatment && claim.active_treatment.rejected_reason ? (
                                    <div className="kt-wizard-v2__review-item">
                                        <div className="kt-wizard-v2__review-title">
                                            <h5><span style={{color:"#48465b"}}>Rejet</span></h5>
                                        </div>
                                        <div className="kt-wizard-v2__review-content">
                                            <strong>Motif</strong>: <span className="mx-2">{claim.active_treatment.rejected_reason}</span><br/>
                                            <strong>Unité</strong>: <span className="mx-2">{claim.active_treatment.responsible_unit.name["fr"]}</span><br/>
                                            <strong>Date de rejet</strong>: <span className="mx-2">{formatDateToTimeStampte(claim.active_treatment.rejected_at)}</span><br/>
                                        </div>
                                    </div>
                                ) : null
                            ) : null
                        }

                        <div className="kt-wizard-v2__review-title">
                            <h5><span style={{color:"#48465b"}}>Canaux</span></h5>
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
                            <h5><span style={{color:"#48465b"}}>Cible</span></h5>
                        </div>
                        {
                            !claim ? null : (
                                <div className="kt-wizard-v2__review-content">
                                    <strong>Institution</strong>: <span
                                    className="mx-2">{claim.institution_targeted.name}</span><br/>
                                    <strong>Unité</strong>: <span
                                    className="mx-2">{claim.unit_targeted ? claim.unit_targeted.name["fr"] : "Pas d'institution ciblé"}</span><br/>
                                </div>
                            )
                        }
                    </div>
                    <div className="kt-wizard-v2__review-item">
                        <div className="kt-wizard-v2__review-title">
                            <h5><span style={{color:"#48465b"}}>Spécifications</span></h5>
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
