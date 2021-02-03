import React from "react";
import {formatDateToTimeStampte} from "../../helpers/function";

const TreatmentButtonDetail = ({claim}) => {
    return (
        <div className="kt-wizard-v2__content"
             data-ktwizard-type="step-content">
            <div className="kt-heading kt-heading--md">Information sur le Traitement Effectué</div>
            <div className="kt-form__section kt-form__section--first">
                {claim && !claim.active_treatment ? (
                    <div className="kt-wizard-v2__review-item">
                        <div className="kt-wizard-v2__review-title"><h5 style={{color: "#48465b"}}>Aucune information</h5></div>
                    </div>
                ) : null}

                <div className="kt-wizard-v2__review">
                    {claim && claim.active_treatment && claim.active_treatment.transferred_to_targeted_institution_at ? (
                        <div className="kt-wizard-v2__review-item">
                            <div className="kt-wizard-v2__review-title"><span style={{color: "#48465b"}}>Transfert vers l'institution ciblée</span></div>
                            <div className="kt-wizard-v2__review-content">
                                <strong>Date de transfert:</strong>
                                <span className="mx-2">{formatDateToTimeStampte(claim.active_treatment.transferred_to_targeted_institution_at)}</span><br/>
                            </div>
                        </div>
                    ) : null}

                    {claim && claim.active_treatment && claim.active_treatment.transferred_to_unit_at ? (
                        <div className="kt-wizard-v2__review-item">
                            <div className="kt-wizard-v2__review-title"><span style={{color: "#48465b"}}>Unité de traitement</span></div>
                            <div className="kt-wizard-v2__review-content">
                                <strong>Unité:</strong>
                                <span className="mx-2">{claim.active_treatment.responsible_staff.unit ? claim.active_treatment.responsible_staff.unit.name.fr : "-"}</span><br/>
                                <strong>Date de transfert:</strong>
                                <span className="mx-2">{formatDateToTimeStampte(claim.active_treatment.transferred_to_unit_at)}</span>
                            </div>
                        </div>
                    ) : null}

                    {claim && claim.active_treatment && claim.active_treatment.assigned_to_staff_at ? (
                        <div className="kt-wizard-v2__review-item">
                            <div className="kt-wizard-v2__review-title"><span style={{color: "#48465b"}}>Affecté par</span></div>
                            {
                                !claim ? null : (
                                    <div className="kt-wizard-v2__review-content">
                                        <strong>Nom:</strong>
                                        <span className="mx-2">{claim.active_treatment.assigned_to_staff_by ? claim.active_treatment.assigned_to_staff_by.identite.lastname + "  " + claim.active_treatment.assigned_to_staff_by.identite.firstname : "-"}</span><br/>
                                        <strong>Date de l'affectation:</strong>
                                        <span className="mx-2">{formatDateToTimeStampte(claim.active_treatment.assigned_to_staff_at)}</span>
                                    </div>
                                )
                            }
                        </div>
                    ) : null}

                    {claim && claim.active_treatment && claim.active_treatment.assigned_to_staff_at ? (
                        <div className="kt-wizard-v2__review-item">
                            <div className="kt-wizard-v2__review-title"><span style={{color: "#48465b"}}>Chargé du traitement</span></div>
                            {
                                !claim ? null : (
                                    <div className="kt-wizard-v2__review-content">
                                        <strong>Nom:</strong>
                                        <span className="mx-2">{claim.active_treatment.responsible_staff ? claim.active_treatment.responsible_staff.identite.lastname + "  " + claim.active_treatment.responsible_staff.identite.firstname : "-"}</span><br/>
                                        <strong>Institution:</strong>
                                        <span className="mx-2">{claim.active_treatment.responsible_staff ? claim.active_treatment.responsible_staff.institution.name : '-'}</span>
                                    </div>
                                )
                            }
                        </div>
                    ) : null}

                    {claim && claim.active_treatment && (claim.active_treatment.declared_unfounded_at || claim.active_treatment.solved_at) ? (
                        <div className="kt-wizard-v2__review-item">
                            <div className="kt-wizard-v2__review-title"><span style={{color: "#48465b"}}>Traitement effectué</span></div>
                            <div className="kt-wizard-v2__review-content">
                                <strong>Est-ce une réclamation fondée ?:</strong>
                                <span className="mx-2">{claim.active_treatment.declared_unfounded_at ? "NON" : claim.active_treatment.solved_at ? "OUI" : "-"}</span><br/>

                                {claim.active_treatment.declared_unfounded_at ? (
                                    <>
                                        <strong>Raison du non fondé:</strong>
                                        <span className="mx-2">{claim.active_treatment.declared_unfounded_at ? claim.active_treatment.unfounded_reason : "-"}</span><br/>
                                    </>
                                ) : null}

                                {claim.amount_disputed && claim.active_treatment.solved_at ? (
                                    <>
                                        <strong>Montant retourné:</strong>
                                        {console.log("claim:", claim)}
                                        <span className="mx-2">{claim.active_treatment.amount_returned ? `${claim.active_treatment.amount_returned} ${claim.amount_currency ? claim.amount_currency.name["fr"] : ''}` : "-"}</span><br/>
                                    </>
                                ) : null}

                                {claim.active_treatment.solved_at ? (
                                    <>
                                        <strong>Solution:</strong>
                                        <span className="mx-2">{claim.active_treatment.solution ? claim.active_treatment.solution : "-"}</span><br/>
                                    </>
                                ) : null}

                                {claim.active_treatment.solved_at ? (
                                    <>
                                        <strong>Mesures préventives:</strong>
                                        <span className="mx-2">{claim.active_treatment.preventive_measures ? claim.active_treatment.preventive_measures : "-"}</span><br/>
                                    </>
                                ) : null}

                                {claim.active_treatment.solved_at ? (
                                    <>
                                        <strong>Commentaires:</strong>
                                        <span className="mx-2">{claim.active_treatment.comments ? claim.active_treatment.comments : "-"}</span><br/>
                                    </>
                                ) : null}

                                <strong>Date du traitement:</strong>
                                <span className="mx-2">{claim.active_treatment.declared_unfounded_at ? formatDateToTimeStampte(claim.active_treatment.declared_unfounded_at) : claim.active_treatment.solved_at ? formatDateToTimeStampte(claim.active_treatment.solved_at) : "-"}</span><br/>
                            </div>
                        </div>
                    ) : null}

                    {claim && claim.active_treatment && claim.active_treatment.validated_at ? (
                        <div className="kt-wizard-v2__review-item">
                            <div className="kt-wizard-v2__review-title"><span style={{color: "#48465b"}}>Validation du traitement</span></div>
                            {
                                !claim ? null : (
                                    <div className="kt-wizard-v2__review-content">
                                        <strong>Décision:</strong>
                                        <span className="mx-2">{claim.active_treatment.invalidated_reason ? "Invalide" : "Valide"}</span><br/>

                                        {claim.active_treatment.invalidated_reason ? (
                                            <>
                                                <strong>Raison de l'invalidation:</strong>
                                                <span className="mx-2">{claim.active_treatment.invalidated_reason}</span><br/>

                                                <strong>Date de l'invalidation:</strong>
                                                <span className="mx-2">{claim.active_treatment.validet_at ? formatDateToTimeStampte(claim.active_treatment.validated_at) : "-"}</span><br/>
                                            </>
                                        ) : (
                                            <>
                                                <strong>Solution Communiquée au client:</strong>
                                                <span className="mx-2">{claim.active_treatment.solution_communicated ? claim.active_treatment.solution_communicated : '-'}</span><br/>
                                                <strong>Date de la validation:</strong>
                                                <span className="mx-2">{claim.active_treatment.validated_at ? formatDateToTimeStampte(claim.active_treatment.validated_at) : '-'}</span><br/>
                                            </>
                                        )}
                                    </div>
                                )
                            }
                        </div>
                    ) : null}

                    {claim && claim.active_treatment && claim.active_treatment.satisfaction_measured_at ? (
                        <>
                            <div className="kt-wizard-v2__review-item">
                                <div className="kt-wizard-v2__review-title"><span style={{color: "#48465b"}}>Résultats de la mesure de satisfaction</span></div>
                                <div className="kt-wizard-v2__review-content">
                                    <strong>Le client est-t-il satisfait par le traitement ?:</strong>
                                    <span className="mx-2">{claim.active_treatment.is_claimer_satisfied ? "OUI" : "NON"}</span><br/>

                                    <strong>Raison/Commentaires:</strong>
                                    <span className="mx-2">{claim.active_treatment.unsatisfied_reason ? claim.active_treatment.unsatisfied_reason : "-"}</span><br/>
                                </div>
                            </div>

                            <div className="kt-wizard-v2__review-item">
                                <div className="kt-wizard-v2__review-title"><span style={{color: "#48465b"}}>Satisfaction mesuré par</span></div>
                                <div className="kt-wizard-v2__review-content">
                                    <strong>Nom:</strong>
                                    <span className="mx-2">{claim.active_treatment.satisfaction_measured_by ? claim.active_treatment.satisfaction_measured_by.identite.lastname + "  " + claim.active_treatment.satisfaction_measured_by.identite.firstname : "-"}</span><br/>

                                    <strong>Point de service:</strong>
                                    <span className="mx-2">{claim.active_treatment.satisfaction_measured_by ? claim.active_treatment.satisfaction_measured_by.unit.name["fr"] : "-"}</span><br/>

                                    <strong>Institution:</strong>
                                    <span className="mx-2">{claim.active_treatment.satisfaction_measured_by ? claim.active_treatment.satisfaction_measured_by.institution.name : "-"}</span><br/>

                                    <strong>Date de la mesure de satisfaction:</strong>
                                    <span className="mx-2">{formatDateToTimeStampte(claim.active_treatment.satisfaction_measured_at)}</span><br/>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    )
};

export default TreatmentButtonDetail;
