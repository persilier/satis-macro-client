import React from "react";
import {formatDateToTimeStampte} from "../../helpers/function";

const TreatmentHistory = ({claim}) => {
    const treatments = claim ? (claim.active_treatment ? (claim.active_treatment.treatments ? claim.active_treatment.treatments : []) : [] ) : [];

    console.log("treatments:", treatments);
    return (
        <>
            <div className="kt-heading kt-heading--md">Historique de traitement</div>
            {
                treatments.map((item, index) => (
                    <div className="kt-wizard-v2__review-item mb-3" key={index}>
                        {item.invalidated_reason ? (
                            <div className="kt-wizard-v2__review-title">
                                <h5><strong>Traitement validé</strong></h5>
                            </div>
                        ) : null}

                        <div className="kt-wizard-v2__review-content jumbotron px-2 py-2 mb-0">
                            {item.unfounded_reason ? (
                                <>
                                    <strong>Raison du non fondé</strong>: <span className="mx-2">{item.unfounded_reason}</span><br/>
                                </>
                            ) : null}
                            {item.amount_returned || item.solution || item.preventive_measures || item.comments ? (
                                <>
                                    <strong>Montant</strong>: <span className={`mx-2 ${!item.invalidated_reason ? 'text-success' : ''}`}>{item.amount_returned ? item.amount_returned : '-'}</span><br/>
                                    <strong>Solution</strong>: <span className={`mx-2 ${!item.invalidated_reason ? 'text-success' : ''}`}>{item.solution ? item.solution : '-'}</span><br/>
                                    <strong>Mésure preventive</strong>: <span className={`mx-2 ${!item.invalidated_reason ? 'text-success' : ''}`}>{item.preventive_measures ? item.preventive_measures : '-'}</span><br/>
                                    <strong>Commentaire</strong>: <span className={`mx-2 ${!item.invalidated_reason ? 'text-success' : ''}`}>{item.comments ? item.comments : '-'}</span><br/>
                                </>
                            ) : null}

                            {item.solved_at ? (
                                <>
                                    <strong>Date de traitement</strong>: <span className={`mx-2 ${!item.invalidated_reason ? 'text-success' : ''}`}>{formatDateToTimeStampte(item.solved_at)}</span><br/>
                                </>
                            ) : null}


                            {item.invalidated_reason ? (
                                <>
                                    <strong>Motif du rejet</strong>: <span className="mx-2 text-danger">{item.invalidated_reason}</span><br/>
                                </>
                            ) : null}

                            {item.validated_at ? (
                                <>
                                    <strong>Date de validation du traitement</strong>: <span className={`mx-2 ${!item.invalidated_reason ? 'text-success' : ''}`}>{formatDateToTimeStampte(item.validated_at)}</span><br/>
                                </>
                            ) : null}
                        </div>
                    </div>
                ))
            }
        </>
    );
};

export default TreatmentHistory;
