import React, {useEffect, useState} from 'react';
import axios from 'axios'
import apiConfig from "../../config/apiConfig";
import Select from "react-select";
import appConfig from "../../config/appConfig";
import {formatSelectOption} from "../../helpers/function";

const TransfertInstitution = (props) => {
    const defaultData = {
        institution_targeted_id: []
    };
    const [startRequest, setStartRequest] = useState(false);
    const [error, setError] = useState(defaultData);
    const [institution, setInstitution] = useState({});
    const institutions = props.getInstitution;

    const onChangeInstitution = (selected) => {
        setInstitution(selected);
        props.getInstitutionId(selected)
    };

    return (
        <div>
            <div className="kt-wizard-v2__review-title">
                Transferer à une institution
            </div>
            <div className="kt-wizard-v2__review-content">
                <div className={error.institution_targeted_id.length ? "form-group validated" : "form-group"}>
                    <label htmlFor="exampleSelect1"> Institution</label>
                    {institutions? (
                        <Select
                            value={institution}
                            onChange={onChangeInstitution}
                            options={formatSelectOption(institutions, 'name', false)}
                        />
                    ) : (
                        <select name="institution"
                                className={error.institution_targeted_id.length ? "form-control is-invalid" : "form-control"}
                                id="institution">
                            <option value=""></option>
                        </select>
                    )
                    }

                    {
                        error.institution_targeted_id.length ? (
                            error.institution_targeted_id.map((error, index) => (
                                <div key={index} className="invalid-feedback">
                                    {error}
                                </div>
                            ))
                        ) : ""
                    }
                </div>
            </div>
        </div>
    );

};

export default TransfertInstitution;