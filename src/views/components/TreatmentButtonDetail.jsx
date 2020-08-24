import React from "react";
import appConfig from "../../config/appConfig";

const TreatmentButtonDetail = ({claim}) => {
    return (
        <div className="kt-wizard-v2__content"
             data-ktwizard-type="step-content">
            <div className="kt-heading kt-heading--md">Information sur le
                Traitement Effectué
            </div>
            <div className="kt-form__section kt-form__section--first">
                <div className="kt-wizard-v2__review">
                    <div className="kt-wizard-v2__review-item">
                        <div className="kt-wizard-v2__review-title">
                            <span style={{color:"#48465b"}}>Agent</span>
                        </div>
                        {
                            !claim ? "" : (
                                <div className="kt-wizard-v2__review-content">
                                    <strong>Nom :</strong> <span
                                    className="mx-2">{claim.active_treatment.responsible_staff ? claim.active_treatment.responsible_staff.identite.lastname + "  " + claim.active_treatment.responsible_staff.identite.firstname : "Pas de traitant"}</span><br/>
                                    <strong>Unité:</strong> <span
                                    className="mx-2">{claim.active_treatment.responsible_staff.unit ? claim.active_treatment.responsible_staff.unit.name.fr : ""}</span>
                                </div>
                            )
                        }
                    </div>
                    <div className="kt-wizard-v2__review-item">
                        <div className="kt-wizard-v2__review-title" >
                            <span style={{color:"#48465b"}}>Traitement</span>
                        </div>

                        {
                            !claim ? "" : (
                                <div className="kt-wizard-v2__review-content">
                                    <strong>Montant retourné:</strong> <span
                                    className="mx-2">{claim.active_treatment.amount_returned ? claim.active_treatment.amount_returned : "Aucun montant retourné"}</span><br/>
                                    <br/>
                                    <strong>Solution :</strong>
                                    <span className="mx-2">
                                                                    {claim.active_treatment ? claim.active_treatment.solution : ""}
                                                                    </span><br/><br/>
                                    <strong>Commentaires:</strong> <span
                                    className="mx-2">{claim.active_treatment.comments ? claim.active_treatment.comments : "Aucun commentaire"}</span><br/>
                                    <br/>
                                    <strong>Mesures préventives:</strong> <span
                                    className="mx-2">{claim.active_treatment.preventive_measures ? claim.active_treatment.preventive_measures : "Aucune mesure préventive"}</span><br/>
                                </div>
                            )
                        }
                    </div>
                    <div className="kt-wizard-v2__review-item">
                        <div className="kt-wizard-v2__review-title">
                            <span style={{color:"#48465b"}}> Solution Communiquée</span>
                        </div>
                        {
                            !claim ? "" : (
                                <div className="kt-wizard-v2__review-content">
                                                                    <span
                                                                        className="mx-2">{claim.active_treatment.solution_communicated}</span><br/>
                                </div>
                            )
                        }
                    </div>
                    {localStorage.getItem("page")==="ClaimsArchived"?(
                            <div className="kt-wizard-v2__review-item">
                                <div className="kt-wizard-v2__review-title">
                                    <span style={{color:"#48465b"}}>  Mesure de Satisfaction</span>
                                </div>
                                {
                                    !claim ? "" : (
                                        <div
                                            className="kt-wizard-v2__review-content">
                                            {
                                                claim.active_treatment.is_claimer_satisfied === 1 ?
                                                    <span className="mx-2">
                                                                                                Le Client <strong>est satisfait</strong> de la soltion communiquée
                                                                                            </span>
                                                    :
                                                    <span className="mx-2">
                                                                                                Le Client <strong>n'est pas satisfait</strong>  de la soltion communiquée
                                                                                            </span>
                                            }
                                            <br/>
                                        </div>
                                    )
                                }
                            </div>
                    )
                    :""
                    }

                </div>
            </div>
        </div>
    )
};

export default TreatmentButtonDetail;
