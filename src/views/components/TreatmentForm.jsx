import React, {useState} from "react";
import {connect} from "react-redux";
import {addTreatment} from "../../store/actions/treatmentAction";
import axios from "axios";
import appConfig from "../../config/appConfig";
import {ToastBottomEnd} from "./Toast";
import {toastAddErrorMessageConfig, toastAddSuccessMessageConfig} from "../../config/toastConfig";

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
        setStartRequest(true);
        axios.put(appConfig.apiDomaine + `/claim-assignment-staff/${props.getId}/treatment`, data)
            .then(response => {
                setStartRequest(false);
                setError(defaultError);
                ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                window.location.href="/settings/claim-assign/to-staff";
            })
            .catch(error => {
                setStartRequest(false);
                ToastBottomEnd.fire(toastAddErrorMessageConfig);
            })
        ;
    };
    return (
        <div>
            <div
                className={error.amount_returned.length ? "form-group row validated" : "form-group row"}>
                <label className="col-xl-3 col-lg-3 col-form-label"
                       htmlFor="name">Le Montant retourné</label>
                <div className="col-lg-9 col-xl-6">
                    <input
                        id="amount"
                        type="text"
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

            <div
                className={error.solution.length ? "form-group row validated" : "form-group row"}>
                <label className="col-xl-3 col-lg-3 col-form-label"
                       htmlFor="description">La Solution</label>
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
                       htmlFor="description">Le commentaire</label>
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
                       htmlFor="description">Mesure préventive</label>
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
                        Loading...
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