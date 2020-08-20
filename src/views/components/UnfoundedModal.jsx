import React, {useState} from "react";
import axios from "axios";
import appConfig from "../../config/appConfig";
import {ToastBottomEnd} from "./Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
} from "../../config/toastConfig";

const UnfoundedModal = (props) => {

    const defaultData = {
        unfounded_reason: "",
    };
    const defaultError = {
        unfounded_reason: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    const onChangeDescription = (e) => {
        const newData = {...data};
        newData.unfounded_reason = e.target.value;
        setData(newData);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);
        axios.put(appConfig.apiDomaine + `/claim-assignment-staff/${props.getId}/unfounded`, data)
            .then(response => {
                setStartRequest(false);
                setError(defaultError);
                setData(defaultData);
                ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                window.location.href="/process/claim-assign/to-staff"
            })
            .catch(error => {
                setStartRequest(false);
                setError({...defaultError});
                ToastBottomEnd.fire(toastAddErrorMessageConfig);
            })
        ;
    };
    return (
        <div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog"
                 aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Réclamation non Fondée</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div
                                className={error.unfounded_reason.length ? "form-group validated" : "form-group"}>
                                <label htmlFor="description">Description du motif <span style={{color:"red"}}>*</span></label>
                                <textarea
                                    id="description"
                                    className={error.unfounded_reason.length ? "form-control is-invalid" : "form-control"}
                                    placeholder="Veillez entrer la description du motif"
                                    cols="62"
                                    rows="7"
                                    value={data.unfounded_reason}
                                    onChange={(e) => onChangeDescription(e)}
                                />
                                {
                                    error.unfounded_reason.length ? (
                                        error.unfounded_reason.map((error, index) => (
                                            <div key={index}
                                                 className="invalid-feedback">
                                                {error}
                                            </div>
                                        ))
                                    ) : ""
                                }

                            </div>
                        </div>
                        <div className="modal-footer">

                            {
                                !startRequest ? (
                                    <button type="submit"
                                            onClick={(e) => onSubmit(e)}
                                            className="btn btn-primary">Enregistrer</button>
                                ) : (
                                    <button
                                        className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                        type="button" disabled>
                                        Chargement...
                                    </button>
                                )
                            }

                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Quitter</button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default UnfoundedModal;