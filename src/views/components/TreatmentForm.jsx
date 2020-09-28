import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {addTreatment} from "../../store/actions/treatmentAction";
import axios from "axios";
import appConfig from "../../config/appConfig";
import {ToastBottomEnd} from "./Toast";
import {toastAddErrorMessageConfig, toastAddSuccessMessageConfig} from "../../config/toastConfig";
import InputRequire from "./InputRequire";

const TreatmentForm = (props) => {
    const defaultData = {
        amount_returned: "",
        solution: "",
        comments: "",
        preventive_measures: "",
    };
    const defaultError = {
        amount_returned: [],
        solution: [],
        comments: [],
        preventive_measures: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        if (props.activeTreatment) {
            setData({
                amount_returned: props.activeTreatment.amount_returned ? props.activeTreatment.amount_returned : "",
                solution: props.activeTreatment.solution ? props.activeTreatment.solution : "",
                comments: props.activeTreatment.comments ? props.activeTreatment.comments : "",
                preventive_measures: props.activeTreatment.preventive_measures ? props.activeTreatment.preventive_measures : "",
            });
        }
    }, [props.activeTreatment]);

    const onChangeAmount = (e) => {
        const newData = {...data};
        newData.amount_returned = e.target.value;
        setData(newData);
        props.addTreatment(newData)
    };

    const onChangeSolution = (e) => {
        const newData = {...data};
        newData.solution = e.target.value;
        setData(newData);
        props.addTreatment(newData)
    };

    const onChangeComments = (e) => {
        const newData = {...data};
        newData.comments = e.target.value;
        setData(newData);
        props.addTreatment(newData)
    };

    const onChangePreventiveMeasures = (e) => {
        const newData = {...data};
        newData.preventive_measures = e.target.value;
        setData(newData);
        props.addTreatment(newData)
    };
    const onClick = (e) => {
        e.preventDefault();
        console.log(data, "data");
        setStartRequest(true);
        axios.put(appConfig.apiDomaine + `/claim-assignment-staff/${props.getId}/treatment`, data)
            .then(response => {
                setStartRequest(false);
                ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                window.location.href = "/process/claim-assign/to-staff";
            })
            .catch(error => {
                setStartRequest(false);
                setError({...defaultError, ...error.response.data.error});
                ToastBottomEnd.fire(toastAddErrorMessageConfig);
            })
        ;
    };
    return (
        <div>
            {
                props.amount_disputed ?
                    <div className={error.amount_returned.length ? "form-group row validated" : "form-group row"}>
                        <label className="col-xl-3 col-lg-3 col-form-label"
                               htmlFor="name">Montant retourné
                        </label>
                        <div className="col-lg-9 col-xl-6">
                            <input
                                id="amount"
                                type="number"
                                min="0"
                                className={error.amount_returned.length ? "form-control is-invalid" : "form-control"}
                                placeholder="Veillez entrer le montant à retourner"
                                value={data.amount_returned}
                                onChange={(e) => onChangeAmount(e)}
                            />
                            {
                                error.amount_returned.length ? (
                                    error.amount_returned.map((error, index) => (
                                        <div key={index}
                                             className="invalid-feedback">
                                            {error}
                                        </div>
                                    ))
                                ) : ""
                            }
                        </div>
                    </div>
                    : ""
            }
            <div
                className={error.solution.length ? "form-group row validated" : "form-group row"}>
                <label className="col-xl-3 col-lg-3 col-form-label"
                       htmlFor="description">Solution <InputRequire/></label>
                <div className="col-lg-9 col-xl-6">
                                                                <textarea
                                                                    id="solution"
                                                                    className={error.solution.length ? "form-control is-invalid" : "form-control"}
                                                                    placeholder="Veillez entrer la solution"
                                                                    cols="30"
                                                                    rows="5"
                                                                    value={data.solution}
                                                                    onChange={(e) => onChangeSolution(e)}
                                                                />
                    {
                        error.solution.length ? (
                            error.solution.map((error, index) => (
                                <div key={index}
                                     className="invalid-feedback">
                                    {error}
                                </div>
                            ))
                        ) : ""
                    }
                </div>
            </div>
            <div
                className={error.comments.length ? "form-group row validated" : "form-group row"}>
                <label className="col-xl-3 col-lg-3 col-form-label"
                       htmlFor="description">Commentaires</label>
                <div className="col-lg-9 col-xl-6">
                                                                <textarea
                                                                    id="comments"
                                                                    className={error.comments.length ? "form-control is-invalid" : "form-control"}
                                                                    placeholder="Veillez entrer un commentaire"
                                                                    cols="30"
                                                                    rows="5"
                                                                    value={data.comments}
                                                                    onChange={(e) => onChangeComments(e)}
                                                                />
                    {
                        error.comments.length ? (
                            error.comments.map((error, index) => (
                                <div key={index}
                                     className="invalid-feedback">
                                    {error}
                                </div>
                            ))
                        ) : ""
                    }
                </div>
            </div>
            <div
                className={error.preventive_measures.length ? "form-group row validated" : "form-group row"}>
                <label className="col-xl-3 col-lg-3 col-form-label"
                       htmlFor="description">Mesures préventives</label>
                <div className="col-lg-9 col-xl-6">
                                                                <textarea
                                                                    id="measures"
                                                                    className={error.preventive_measures.length ? "form-control is-invalid" : "form-control"}
                                                                    placeholder="Veillez entrer la mesure préventive"
                                                                    cols="30"
                                                                    rows="5"
                                                                    value={data.preventive_measures}
                                                                    onChange={(e) => onChangePreventiveMeasures(e)}
                                                                />
                    {
                        error.preventive_measures.length ? (
                            error.preventive_measures.map((error, index) => (
                                <div key={index}
                                     className="invalid-feedback">
                                    {error}
                                </div>
                            ))
                        ) : ""
                    }
                </div>
            </div>

            {
                !startRequest ? (
                    <button
                        className="btn btn-success"
                        onClick={(e) => onClick(e)}
                    >
                        TRAITER
                    </button>
                ) : (
                    <button
                        className="btn btn-success kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                        type="button" disabled>
                        Chargement...
                    </button>
                )
            }

        </div>
    )
};
const mapStateToProps = state => {
    return {
        treatment: state.treatment,
    };
};

export default connect(mapStateToProps, {addTreatment})(TreatmentForm);
