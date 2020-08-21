import React, {useState} from "react";
import axios from "axios";
import appConfig from "../../config/appConfig";
import {ToastBottomEnd} from "./Toast";
import {toastMergeSuccessMessageConfig} from "../../config/toastConfig";
import {formatDateToTimeStampte} from "../../helpers/function";

const FusionClaim = props => {
    const [startRequest, setStartRequest] = useState(false);

    const onClickFusion = () => {
        setStartRequest(true);
        axios.put(`${appConfig.apiDomaine}/claim-awaiting-assignment/${props.claim.id}/merge/${props.copyClaim.id}`, {})
            .then(response => {
                ToastBottomEnd.fire(toastMergeSuccessMessageConfig);
                setStartRequest(false);
                document.getElementById("close-button").click();
                window.location.href = `/process/claim-assign/${response.data.id}/detail`;
            })
            .catch(error => {
                setStartRequest(false);
                console.log("Something is wrong")
            })
        ;
    };

    const onClickCloseButton = () => {
        document.getElementById("close-button").click();
        props.onCloseModal();
    };

    return (
        <div className="modal fade" id="kt_modal_4" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Fusion de réclamation</h5>
                        <button disabled={startRequest} onClick={() => onClickCloseButton()} type="button" className="close"/>
                    </div>
                    <div className="modal-body">
                        <form>
                            <table className="table table-bordered text-center">
                                <thead>
                                    <tr>
                                        <th><strong>Paramètre</strong></th>
                                        <th><strong>Réclamation</strong></th>
                                        <th><strong>Doublon</strong></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Réclamant</strong></td>
                                        <td>{props.claim.claimer ? `${props.claim.claimer.lastname} ${props.claim.claimer.firstname}` : "Pas de reclamant"}</td>
                                        <td>{props.copyClaim.claimer ? `${props.copyClaim.claimer.lastname} ${props.copyClaim.claimer.firstname}` : "Pas de reclamant"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Montant réclamé</strong></td>
                                        <td>{props.claim.amount_disputed ? `${props.claim.amount_disputed} ${props.claim.amount_currency ? props.claim.amount_currency.name["fr"] : ""}` : "Pas de montant"}</td>
                                        <td>{props.copyClaim.amount_disputed ? `${props.copyClaim.amount_disputed} ${props.copyClaim.amount_currency ? props.copyClaim.amount_currency.name["fr"] : ""}` : "Pas de montant"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Date de réception</strong></td>
                                        <td>{props.claim.created_at ? formatDateToTimeStampte(props.claim.created_at) : "Pas de date de reclamation"}</td>
                                        <td>{props.copyClaim.created_at ? formatDateToTimeStampte(props.copyClaim.created_at) : "Pas de date de reclamation"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Date de l'évernement</strong></td>
                                        <td>{props.claim.event_occured_at ? formatDateToTimeStampte(props.claim.event_occured_at) : "Pas de date"}</td>
                                        <td>{props.copyClaim.event_occured_at ? formatDateToTimeStampte(props.copyClaim.event_occured_at) : "Pas de date"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Objet de reclamation</strong></td>
                                        <td>{props.claim.claim_object ? props.claim.claim_object.name["fr"] : "Pas d'objet de Réclamation"}</td>
                                        <td>{props.copyClaim.claim_object ? props.copyClaim.claim_object.name["fr"] : "Pas d'objet de Réclamation"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Description</strong></td>
                                        <td>{props.claim.description ? props.claim.description: "Pas de description"}</td>
                                        <td>{props.copyClaim.description ? props.copyClaim.description : "Pas de description"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Attente</strong></td>
                                        <td>{props.claim.claimer_expectation ? props.claim.claimer_expectation : "Pas d'attente"}</td>
                                        <td>{props.copyClaim.claimer_expectation ? props.copyClaim.claimer_expectation : "Pas d'attente"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button disabled={startRequest} onClick={() => onClickCloseButton()} type="button" className="btn btn-secondary">Fermer</button>
                        <button style={{display: "none"}} id={"close-button"} type="button" className="btn btn-secondary" data-dismiss="modal">Fermer</button>
                        {
                            !startRequest ? (
                                <button type="button" className="btn btn-primary" onClick={() => onClickFusion()}>Fusioner</button>
                            ) : (
                                <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                    Chargement...
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FusionClaim;
