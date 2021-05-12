import React, {useRef, useState} from "react";
import axios from "axios";
import appConfig from "../../config/appConfig";
import {toastErrorMessageWithParameterConfig, toastSuccessMessageWithParameterConfig} from "../../config/toastConfig";
import {ToastBottomEnd} from "./Toast";
import {verifyTokenExpire} from "../../middleware/verifyToken";

const CompleteAttachments = ({claimId}) => {
    const [error, setError] = useState([]);
    const [load, setLoad] = useState(false);
    const inputRef = useRef(null);

    const seeFormData = (formData) => {
        console.log("SEE_FORM_DATA");
        for (let input of formData.entries()) {
            console.log("element:", input[1]);
        }
    };

    const handleClick = async () => {
        setLoad(true);
        const files = inputRef.current.files;
        const formData = new FormData();
        for(let i = 0; i < files.length; i++)
            formData.append("file[]", files[i], files[i].name);

        // seeFormData(formData);

        if (verifyTokenExpire()) {
            await axios.post(`${appConfig.apiDomaine}/attach-files-to-claim/${claimId}`, formData)
                .then((response) => {
                    setLoad(false);
                    setError([]);
                    inputRef.current.files = null;
                    inputRef.current.value = null;
                    ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig('Pièce(s)  jointe(s)  ajouter avec succès'));
                    window.location.reload();
                })
                .catch(({response}) => {
                    console.log("error:", response.status);
                    console.log("response:", response);
                    setLoad(false);
                    if (response.status === 422)
                        setError(Object.values(response.data.error).map(el => el[0]));
                    if (response.status === 404)
                        ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(response.data));
                })
            ;
        }
    };

    return (
        <>
            <div className="kt-heading kt-heading--md">
                Ajouter d'autres pièces
            </div>

            <div className="kt-wizard-v2__review-item">
                <div className="kt-wizard-v2__review-content">
                    <div className="form-group">
                        <input
                            ref={inputRef}
                            multiple={true}
                            type="file"
                            className={`form-control${error.length ? ' is-invalid' : ''}`}
                        />
                        {error.length ? (
                            error.map((el, index) => (
                                <div key={index} className="invalid-feedback">
                                    {el}
                                </div>
                            ))
                        ) : null}
                    </div>

                    <div className="text-right">
                        {
                            !load ? (
                                <button type="submit" onClick={handleClick} className="btn btn-primary">Completer</button>
                            ) : (
                                <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                    Chargement...
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default CompleteAttachments;
