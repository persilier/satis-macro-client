import React, {useState} from "react";
import {connect} from "react-redux";
import {addTreatment} from "../../store/actions/treatmentAction";

const TreatmentForm=(props)=>{
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

    const onChangeAmount=(e)=>{
        const newData = {...data};
        newData.amount_returned = e.target.value;
        setData(newData);
        props.addTreatment(newData)
    };

    const onChangeSolution=(e)=>{
        const newData = {...data};
        newData.solution = e.target.value;
        setData(newData);
        props.addTreatment(newData)
    };

    const onChangeComments=(e)=>{
        const newData = {...data};
        newData.comments = e.target.value;
        setData(newData);
        props.addTreatment(newData)
    };

    const onChangePreventiveMeasures=(e)=>{
        const newData = {...data};
        newData.preventive_measures = e.target.value;
        setData(newData);
        props.addTreatment(newData)
    };
    return(
        <div>
            <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
                <div className="kt-heading kt-heading--md">Traitement de la plainte</div>
                <div className="kt-form__section kt-form__section--first">
                    <div className="kt-wizard-v2__review">
                        <div className="kt-wizard-v2__review-content">
                            <div
                                className={error.amount_returned.length ? "form-group row validated" : "form-group row"}>
                                <label className="col-xl-3 col-lg-3 col-form-label"
                                       htmlFor="name">Le Montant retourné</label>
                                <div className="col-lg-9 col-xl-6">
                                    <input
                                        id="amount"
                                        type="text"
                                        className={error.amount_returned.length ? "form-control is-invalid" : "form-control"}
                                        placeholder="Veillez entrer le nom"
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
                        </div>
                        <div
                            className={error.solution.length ? "form-group row validated" : "form-group row"}>
                            <label className="col-xl-3 col-lg-3 col-form-label"
                                   htmlFor="description">La Solution</label>
                            <div className="col-lg-9 col-xl-6">
                                                                <textarea
                                                                    id="solution"
                                                                    className={error.solution.length ? "form-control is-invalid" : "form-control"}
                                                                    placeholder="Veillez entrer la description"
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
                                                                    placeholder="Veillez entrer la description"
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
                                                                    placeholder="Veillez entrer la description"
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
                    </div>
                </div>
            </div>
        </div>
    )
};
const mapStateToProps = state => {
    return {
        treatment: state.treatment,
    };
};

export default connect(mapStateToProps, {addTreatment})(TreatmentForm);