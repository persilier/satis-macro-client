import React, {useEffect, useState} from "react";
import axios from "axios";

const AddInstitution = () => {

    const [name, setName] = useState(undefined);
    const [acronyme, setAcronyme] = useState(undefined);
    const [isoCode, setIsoCode] = useState(undefined);
    const [logo, setLogo] = useState(undefined);
    const [loadRequest, setLoadRequest] = useState(false);


    const onChangeIsoCode = (e) => {
        setIsoCode(e.target.value);
    };
    const onChangeLogo = (e) => {
        setLogo(e.target.files[0]);
    };
    const onChangeName = (e) => {
        setName(e.target.value);
    };
    const onChangeAcronyme = (e) => {
        setAcronyme(e.target.value);
    };

    const addInstitution = () => {
        const formData = new FormData();
        formData.append('logo', logo, logo.name);
        formData.set('name', name);
        formData.set('acronyme', acronyme);
        formData.set('iso_code', isoCode);
        setLoadRequest(true);
        axios.post(`http://127.0.0.1:8000/institutions`, formData)
            .then((response) => {
                console.log(response);
                if (response.status === 201) {
                    setLoadRequest(false)
                }
            }).catch(function (response) {
            console.log(response);
        });
        window.location.reload();
    };
    return (
        <div>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">New Institution</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className={"form-row"}>
                                <div className="form-group col-md-6">
                                    <label>Name</label>
                                    <input type="text" className="form-control" aria-describedby="emailHelp"
                                           placeholder="Veillez entrer le nom" onChange={(e) => onChangeName(e)}/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Acronyme</label>
                                    <input type="text" className="form-control" aria-describedby="emailHelp"
                                           placeholder="Veillez entrer l'acronyme"
                                           onChange={(e) => onChangeAcronyme(e)}/>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="exampleInputPassword1">Iso_code</label>
                                    <input type="text" className="form-control" aria-describedby="emailHelp"
                                           placeholder="Veillez entrez l'iso_code"
                                           onChange={(e) => onChangeIsoCode(e)}/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="exampleFormControlFile1">Logo</label>
                                    <input type="file" className="form-control-file" id="exampleFormControlFile1"
                                           accept="image/*" onChange={(e) => onChangeLogo(e)}/>
                                </div>
                            </div>

                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal">
                            Close
                        </button>
                        {loadRequest===false?(
                            <button type="button"
                                    className="btn btn-primary "
                                    onClick={() => addInstitution()}>
                            Send
                        </button>):(
                            <button type="button"
                                    className="btn btn-info"
                                    id="kt_blockui_3_3">Loading...
                            </button>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
};

export default AddInstitution;