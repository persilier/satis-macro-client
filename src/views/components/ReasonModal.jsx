import React, {useState} from "react";

const ReasonModal = props => {
    const [description, setDescription] = useState("");

    const sendData = () => {
        props.onGetData(description);
        props.onClose();
        document.getElementById("close-button-reason").click();
    };

    return (
        <div className="modal fade show" id="kt_modal_4_2" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" style={{display: "block", paddingRight: "17px"}} aria-modal="true">
            <div className="modal-dialog modal-xl" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{props.reasonTitle}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="message-text" className="form-control-label">{props.reasonLabel}:</label>
                                <textarea
                                    className="form-control"
                                    id="message-text"
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button id={"close-button-reason"} type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => props.onClose()}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={() => sendData()}>Envoyer</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReasonModal;
