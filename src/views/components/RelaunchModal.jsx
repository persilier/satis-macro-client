import React, {useRef, useState} from "react";
import axios from "axios";
import {verifyTokenExpire} from "../../middleware/verifyToken";
import {ToastBottomEnd} from "./Toast";
import {toastSuccessMessageWithParameterConfig} from "../../config/toastConfig";
import appConfig from "../../config/appConfig";

const RelaunchModal = ({onClose, id}) => {
    const [description, setDescription] = useState("");
    const [error, setError] = useState([]);
    const [load, setLoad] = useState(false);
    const ref = useRef(null);

    const handleClick = (e) => {
        if (verifyTokenExpire()) {
            setLoad(true);
            axios.post(`${appConfig.apiDomaine}/revive-staff/${id}`, {text: description})
                .then(({data}) => {
                    setLoad(false);
                    ref.current.click();
                    ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig('Relance effectuer avec succès'))
                })
                .catch(({response}) => {
                    setLoad(false);
                    setError(response.data.error.text);
                })
            ;
        }
    };

    return (
        <div className="modal fade" id="kt_modal_4" data-backdrop="static" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Relance</h5>
                        <button ref={ref} onClick={() => onClose()} type="button" className="close" data-dismiss="modal" aria-label="Close"/>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="message-text" className="form-control-label">Message:</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={error.length ? "form-control is-invalid" : "form-control"}
                                    id="message-text"
                                />

                                {
                                    error.map((error, index) => (
                                        <div key={index} className="invalid-feedback">
                                            {error}
                                        </div>
                                    ))
                                }
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        {
                            !load ? (
                                <button type="button" className="btn btn-primary" onClick={handleClick}>Envoyer</button>
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

export default RelaunchModal;
