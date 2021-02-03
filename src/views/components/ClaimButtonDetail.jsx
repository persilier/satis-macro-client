import React from "react";
import {connect} from "react-redux";
import {formatDateToTimeStampte} from "../../helpers/function";

const ClaimButtonDetail = ({claim, plan}) => {
    return (
        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
            <div className="kt-heading kt-heading--md">Détails de la réclamation</div>
            <div className="kt-form__section kt-form__section--first">
                <div className="kt-wizard-v2__review">
                    <div className="kt-wizard-v2__review-item">
                        <div className="kt-wizard-v2__review-item">
                            <div className="kt-wizard-v2__review-title">
                                <h5 style={{color:"#48465b"}}>Référence</h5>
                            </div>
                            {!claim ? null : (
                                <div className="kt-wizard-v2__review-content">
                                    <strong>Référence:</strong>
                                    <span className="mx-2">{claim.reference ? claim.reference : "-"}</span><br/>
                                    <strong>Catégorie de réclamation:</strong>
                                    <span className="mx-2">{claim.claim_object.claim_category.name ? claim.claim_object.claim_category.name["fr"] : '-'}</span><br/>
                                    <strong>Objet de réclamations:</strong>
                                    <span className="mx-2">{claim.claim_object.name["fr"]}</span><br/>
                                    <strong>Date de survenu de l'incident:</strong>
                                    <span className="mx-2">{claim.event_occured_at ? formatDateToTimeStampte(claim.event_occured_at) : "-"}</span><br/>
                                    {plan === "HUB" && (
                                        <>
                                            <strong>Relation entretenue avec le réclamant:</strong>
                                            <span className="mx-2">{claim.relationship ? formatDateToTimeStampte(claim.relationship.name["fr"]) : "-"}</span><br/>
                                        </>
                                    )}
                                    <strong>Montant réclamé:</strong>
                                    <span className="mx-2">{claim.amount_disputed ? `${claim.amount_disputed} ${claim.amount_currency ? claim.amount_currency.name["fr"] : ''}` : "-"}</span><br/>
                                    <strong>Description:</strong>
                                    <span className="mx-2">{claim.description ? claim.description : "-"}</span><br/>
                                    <strong>Attente:</strong>
                                    <span className="mx-2">{claim.claimer_expectation ? claim.claimer_expectation : "-"}</span><br/>
                                    <strong>Est-ce une relance ?:</strong>
                                    <span className="mx-2">{claim.is_revival ? "Oui" : "Non"}</span><br/>
                                </div>
                            )}
                        </div>

                        <div className="kt-wizard-v2__review-item">
                            <div className="kt-wizard-v2__review-title">
                                <h5><span style={{color:"#48465b"}}>Cible</span></h5>
                            </div>
                            {
                                !claim ? null : (
                                    <div className="kt-wizard-v2__review-content">
                                        <strong>Institution:</strong>
                                        <span className="mx-2">{claim.institution_targeted.name}</span><br/>
                                        <strong>Point de service</strong>:
                                        <span className="mx-2">{claim.unit_targeted ? claim.unit_targeted.name["fr"] : "-"}</span><br/>
                                        {claim.account_targeted ? (
                                            <>
                                                <strong>Compte concerné:</strong>
                                                <span className="mx-2">{claim.account_targeted ? claim.account_targeted.number : "-"}</span><br/>
                                            </>
                                        ) : null}
                                    </div>
                                )
                            }
                        </div>

                        <div className="kt-wizard-v2__review-item">
                            <div className="kt-wizard-v2__review-title">
                                <h5><span style={{color:"#48465b"}}>Canaux</span></h5>
                            </div>
                            {!claim ? null : (
                                <div className="kt-wizard-v2__review-content">
                                    <strong>Canal de réception:</strong>
                                    <span className="mx-2">{claim.request_channel ? claim.request_channel.name["fr"] : "-"}</span><br/>
                                    <strong>Canal de réponse préférentiel:</strong>
                                    <span className="mx-2">{claim.response_channel ? claim.response_channel.name["fr"] : "-"}</span><br/>
                                </div>
                            )}
                        </div>

                        <div className="kt-wizard-v2__review-item">
                            <div className="kt-wizard-v2__review-title">
                                <h5><span style={{color:"#48465b"}}>Enregistré par</span></h5>
                            </div>
                            {!claim ? null : (
                                <div className="kt-wizard-v2__review-content">
                                    <strong>Nom:</strong>
                                    <span className="mx-2">{`${claim.created_by.identite ? claim.created_by.identite.firstname+" "+claim.created_by.identite.lastname : "-"} `}</span><br/>
                                    <strong>Point de service:</strong>
                                    <span className="mx-2">{claim.created_by.unit ? claim.created_by.unit.name["fr"] : "-"}</span><br/>
                                    <strong>Institution:</strong>
                                    <span className="mx-2">{claim.created_by.institution ? claim.created_by.institution.name : "-"}</span><br/>
                                    <strong>Date de réception:</strong>
                                    <span className="mx-2">{claim.created_at ? formatDateToTimeStampte(claim.created_at) : "-"}</span><br/>
                                </div>
                            )}
                        </div>

                        {claim && claim.completed_at ? (
                            <div className="kt-wizard-v2__review-item">
                                <div className="kt-wizard-v2__review-title">
                                    <h5><span style={{color:"#48465b"}}>Complété par</span></h5>
                                </div>
                                <div className="kt-wizard-v2__review-content">
                                    <strong>Nom:</strong>
                                    <span className="mx-2">{`${claim.completed_by.identite ? claim.completed_by.identite.firstname+" "+claim.completed_by.identite.lastname : "-"} `}</span><br/>
                                    <strong>Point de service:</strong>
                                    <span className="mx-2">{claim.completed_by.unit ? claim.completed_by.unit.name["fr"] : "-"}</span><br/>
                                    <strong>Institution:</strong>
                                    <span className="mx-2">{claim.completed_by.institution ? claim.completed_by.institution.name : "-"}</span><br/>
                                    <strong>Date de complétion:</strong>
                                    <span className="mx-2">{claim.completed_at ? formatDateToTimeStampte(claim.completed_at) : "-"}</span><br/>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        plan: state.plan.plan,
    };
};

export default connect(mapStateToProps)(ClaimButtonDetail);
