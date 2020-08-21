import React, {useState} from 'react';
import axios from "axios";
import appConfig from "../../config/appConfig";
import {ToastBottomEnd} from "./Toast";
import {toastAddErrorMessageConfig, toastAddSuccessMessageConfig} from "../../config/toastConfig";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import {connect} from "react-redux";
import InputRequire from "./InputRequire";


const ReasonSatisfaction = (props) => {
    const option1 = 1;
    const option2 = 0;
    const defaultData = {
        is_claimer_satisfied: "",
        unsatisfaction_reason: "",
    };
    const defaultError = {
        is_claimer_satisfied:'',
        unsatisfaction_reason: "",
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    const onChangeReason = (e) => {
        const newData = {...data};
        newData.unsatisfaction_reason = e.target.value;
        setData(newData);
    };

    const onChangeOption = (e) => {
        const newData = {...data};
        newData.is_claimer_satisfied = e.target.value;
        setData(newData);
        console.log(newData, "OPTION")
    };

    const onClick = (e) => {
        // console.log(props.getEndPoint,'GET_ENDPOINT');
        e.preventDefault();
        setStartRequest(true);
        axios.put(props.getEndPoint + `/${props.getId}`, data)
            .then(response => {
                setStartRequest(false);
                setError(defaultError);
                ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                window.location.href = "/process/claim_measure";
            })
            .catch(error => {
                setStartRequest(false);
                console.log(error.response.data.error,"ERROR");
                setError({...defaultError,...error.response.data.error});
                ToastBottomEnd.fire(toastAddErrorMessageConfig);
            })
        ;
    };

    return (
        <div>
            <div className={error.is_claimer_satisfied.length ? "form-group validated" : "form-group"}>
                <label>Client Satisfait?  <InputRequire/></label>
                <div className="kt-radio-inline">

                    <label className="kt-radio kt-radio--bold kt-radio--success">
                        <input
                            className={error.is_claimer_satisfied.length ? "form-control is-invalid" : "form-control"}
                            type="radio"
                            name="radio6"
                            value={option1}
                            onChange={(e) => onChangeOption(e)}
                        /> Oui
                        <span></span>
                    </label>
                    <label className="kt-radio kt-radio--bold kt-radio--danger">
                        <input
                            type="radio"
                            name="radio6"
                            value={option2}
                            onChange={(e) => onChangeOption(e)}
                        /> Non
                        <span></span>
                    </label>
                </div>
                {
                    error.unsatisfaction_reason.length ? (
                        error.unsatisfaction_reason.map((error, index) => (
                            <div key={index}
                                 className="invalid-feedback">
                                {error}
                            </div>
                        ))
                    ) : ""
                }
            </div>
            <div
                className={error.unsatisfaction_reason.length ? "form-group row validated" : "form-group row"}>
                <label className="col-xl-3 col-lg-3 col-form-label"
                       htmlFor="raison">Raison <InputRequire/></label>
                <div className="col-lg-9 col-xl-6">
                                                                <textarea
                                                                    id="measures"
                                                                    className={error.unsatisfaction_reason.length ? "form-control is-invalid" : "form-control"}
                                                                    placeholder="Veillez entrer la raison"
                                                                    cols="30"
                                                                    rows="10"
                                                                    value={data.unsatisfaction_reason}
                                                                    onChange={(e) => onChangeReason(e)}
                                                                />
                    {
                        error.unsatisfaction_reason.length ? (
                            error.unsatisfaction_reason.map((error, index) => (
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
                        Enregistrer
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
    );

};
const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan,
    };
};

export default connect(mapStateToProps)(ReasonSatisfaction);
