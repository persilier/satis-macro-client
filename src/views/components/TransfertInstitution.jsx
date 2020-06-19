import React, {useState} from 'react';
import axios from 'axios'
import apiConfig from "../../config/apiConfig";

const TransfertInstitution = () => {

    const [startRequest, setStartRequest] = useState(false);
    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);
        axios.post(apiConfig.apiDomaine + `/any/affect`)
            .then(response => {
                console.log(response.data)
            })
    };
    return (
        <div className="alert alert-light" style={{width: '250px'}} role="alert">

            <div className="form-group row">
                <h5> Transfert à l'institution </h5>
                <div>
                    {
                        !startRequest ? (
                            <button type="submit" onClick={(e) => onSubmit(e)}
                                    className="btn btn-primary">Transférer</button>
                        ) : (
                            <button
                                className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                type="button" disabled>
                                Chargement...
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    );

};

export default TransfertInstitution;