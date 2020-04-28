import React, {useEffect, useState} from "react";
import TagsInput from "react-tagsinput";
import axios from "axios";
import apiConfig from "../../../config/apiConfig";
import {formatUnits} from "../../../helper/unit";
import {formatPositions} from "../../../helper/position";
import {ToastBottomEnd} from "../Toast";
import {
    toastEditErrorMessageConfig,
    toastEditSuccessMessageConfig,
    toastErrorMessageWithParameterConfig
} from "../../../config/toastConfig";

const ConfirmSaveForm = (props) => {

    const [units, setUnits] = useState(props.units);
    const [positions, setPositions] = useState(props.positions);
    const institutions = props.institutions;
    const [institution_id, setInstitution_id] = useState(props.institution_id);

    const defaultData = {
        firstname: props.identite.firstname,
        lastname: props.identite.lastname,
        sexe: props.identite.sexe,
        telephone: JSON.parse(props.identite.telephone),
        email: JSON.parse(props.identite.email),
        ville: props.identite.ville === null ? "" : props.identite.ville,
        unit_id: props.unit_id,
        position_id: props.position_id,
    };
    const defaultError = {
        name: [],
        firstname: [],
        lastname: [],
        sexe: [],
        telephone: [],
        email: [],
        ville: [],
        unit_id: [],
        position_id: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    const onChangeFirstName = (e) => {
        const newData = {...data};
        newData.firstname = e.target.value;
        setData(newData);
    };

    const onChangeLastName = (e) => {
        const newData = {...data};
        newData.lastname = e.target.value;
        setData(newData);
    };

    const onChangeSexe = (e) => {
        const newData = {...data};
        newData.sexe = e.target.value;
        setData(newData);
    };

    const onChangeVille = (e) => {
        const newData = {...data};
        newData.ville = e.target.value;
        setData(newData);
    };

    const onChangeTelephone = (tel) => {
        const newData = {...data};
        newData.telephone = tel;
        setData(newData);
    };

    const onChangeEmail = (mail) => {
        const newData = {...data};
        newData.email = mail;
        setData(newData);
    };

    const onChangeUnit = (e) => {
        const newData = {...data};
        newData.unit_id = e.target.value;
        setData(newData);
    };

    const onChangePosition = (e) => {
        const newData = {...data};
        newData.position_id = e.target.value;
        setData(newData);
    };

    const resetUnitsAndPositions = () => {
        const newData = {...data};
        newData.position_id = "";
        newData.unit_id = "";
        setData(newData);
    };

    const onChangeInstitution = (e) => {
        setInstitution_id(e.target.value);
        axios.get(`${apiConfig.baseUrl}/institutions/${e.target.value}/positions-units`)
            .then(response => {
                resetUnitsAndPositions();
                setUnits(formatUnits(response.data.units));
                setPositions(formatPositions(response.data.positions));
                // resetUnitsAndPositions(response.data);
            })
            .catch(errorRequest => {
                console.log(errorRequest.response.data);
                ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(errorRequest.response.data.error));
            })
        ;
    };

    const onSubmit = (e) => {
        e.preventDefault();

        setStartRequest(true);
        axios.post(`http://127.0.0.1:8000/identites/${props.identite.id}/staff`, data)
            .then(response => {
                setStartRequest(false);
                setError(defaultError);
                ToastBottomEnd.fire(toastEditSuccessMessageConfig);
                document.getElementById("closeConfirmSaveForm").click();
            })
            .catch(errorRequest => {
                setStartRequest(false);
                setError({...defaultError, ...errorRequest.response.data.error});
                ToastBottomEnd.fire(toastEditErrorMessageConfig);
            })
        ;
    };

    return (
        <div className="modal fade" id="kt_modal_4" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Ajout d'un agent avec des identifiants existant</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="kt-portlet__body">
                                <div className="form-group form-group-last">
                                    <div className="alert alert-secondary" role="alert">
                                        <div className="alert-icon">
                                            <i className="flaticon-warning kt-font-brand"/>
                                        </div>
                                        <div className="alert-text">
                                            {
                                                props.message
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className={error.lastname.length ? "col validated" : "col"}>
                                        <label htmlFor="lastnameEdit">Votre nom de famille</label>
                                        <input
                                            id="lastnameEdit"
                                            type="text"
                                            className={error.lastname.length ? "form-control is-invalid" : "form-control"}
                                            placeholder="Veillez entrer le nom de famille"
                                            value={data.lastname}
                                            onChange={(e) => onChangeLastName(e)}
                                        />
                                        {
                                            error.lastname.length ? (
                                                error.lastname.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                            ) : ""
                                        }
                                    </div>

                                    <div className={error.firstname.length ? "col validated" : "col"}>
                                        <label htmlFor="firstnameEdit">Votre prénom</label>
                                        <input
                                            id="firstnameEdit"
                                            type="text"
                                            className={error.firstname.length ? "form-control is-invalid" : "form-control"}
                                            placeholder="Veillez entrer le prénom"
                                            value={data.firstname}
                                            onChange={(e) => onChangeFirstName(e)}
                                        />
                                        {
                                            error.firstname.length ? (
                                                error.firstname.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                            ) : ""
                                        }
                                    </div>
                                </div>

                                <div className="row">
                                    <div className={error.firstname.length ? "form-group col validated" : "form-group col"}>
                                        <label htmlFor="sexeEdit">Votre sexe</label>
                                        <select
                                            id="sexeEdit"
                                            className={error.sexe.length ? "form-control is-invalid" : "form-control"}
                                            value={data.sexe}
                                            onChange={(e) => onChangeSexe(e)}
                                        >
                                            <option value="" disabled={true}>Veiller choisir le sexe</option>
                                            <option value="F">Féminin</option>
                                            <option value="M">Masculin</option>
                                        </select>
                                        {
                                            error.sexe.length ? (
                                                error.sexe.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                            ) : ""
                                        }
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className={error.telephone.length ? "col validated" : "col"}>
                                        <label htmlFor="telephoneEdit">Votre Téléphone(s)</label>
                                        <TagsInput value={data.telephone} onChange={onChangeTelephone} />
                                        {
                                            error.telephone.length ? (
                                                error.telephone.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                            ) : ""
                                        }
                                    </div>

                                    <div className={error.email.length ? "col validated" : "col"}>
                                        <label htmlFor="email">Votre Email(s)</label>
                                        <TagsInput value={data.email} onChange={onChangeEmail} />
                                        {
                                            error.email.length ? (
                                                error.email.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                            ) : ""
                                        }
                                    </div>

                                    <div className={error.ville.length ? "col validated" : "col"}>
                                        <label htmlFor="ville">Votre ville</label>
                                        <input
                                            id="ville"
                                            type="text"
                                            className={error.ville.length ? "form-control is-invalid" : "form-control"}
                                            placeholder="Veillez entrer votre ville"
                                            value={data.ville}
                                            onChange={(e) => onChangeVille(e)}
                                        />
                                        {
                                            error.ville.length ? (
                                                error.ville.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                            ) : ""
                                        }
                                    </div>
                                </div>

                                <div className={"form-group"}>
                                    <label htmlFor="institutionEdit">Institution</label>
                                    <select
                                        id="institutionEdit"
                                        className={"form-control"}
                                        value={institution_id}
                                        onChange={(e) => onChangeInstitution(e)}
                                    >
                                        <option value="" disabled={true}>Veillez selectionez l'institution</option>
                                        {
                                            institutions.map((institution, index) => (
                                                <option key={index} value={institution.id}>{institution.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className={error.unit_id.length ? "form-group row validated" : "form-group row"}>
                                    <div className="col">
                                        <label htmlFor="unitEdit">Unité</label>
                                        <select
                                            id="unitEdit"
                                            className={error.unit_id.length ? "form-control is-invalid" : "form-control"}
                                            value={data.unit_id}
                                            onChange={(e) => onChangeUnit(e)}
                                        >
                                            <option value="" disabled={true}>Veillez selectionnez l'unité</option>
                                            {
                                                units.map((unit, index) => (
                                                    <option key={index} value={unit.id}>{unit.name.fr}</option>
                                                ))
                                            }
                                        </select>
                                        {
                                            error.unit_id.length ? (
                                                error.unit_id.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                            ) : ""
                                        }
                                    </div>

                                    <div className="col">
                                        <label htmlFor="positionEdit">Position</label>
                                        <select
                                            id="positionEdit"
                                            className={error.position_id.length ? "form-control is-invalid" : "form-control"}
                                            value={data.position_id}
                                            onChange={(e) => onChangePosition(e)}
                                        >
                                            <option value="" disabled={true}>Veillez selectionnez la position</option>
                                            {
                                                positions.map((position, index) => (
                                                    <option key={index} value={position.id}>{position.name.fr}</option>
                                                ))
                                            }
                                        </select>
                                        {
                                            error.position_id.length ? (
                                                error.position_id.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                            ) : ""
                                        }
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        {
                            !startRequest ? (
                                <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-primary">Submit</button>
                            ) : (
                                <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                    Loading...
                                </button>
                            )
                        }
                        <button id="closeConfirmSaveForm" style={{display: "none"}} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmSaveForm;
