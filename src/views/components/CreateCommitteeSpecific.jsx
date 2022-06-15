import React, {useEffect, useState} from "react";
import axios from "axios";
import appConfig from "../../config/appConfig";
import {ToastBottomEnd} from "./Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
} from "../../config/toastConfig";
import {verifyPermission} from "../../helpers/permission";
import {connect} from "react-redux";
import {verifyTokenExpire} from "../../middleware/verifyToken";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import InputRequire from "./InputRequire";

const CreateCommitteeSpecific = (props) => {

    //usage of useTranslation i18n
    const {t, ready} = useTranslation()

    const defaultData = {
        closed_reason: ""
    };
    const defaultError = {
        closed_reason: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [disabledInput, setDisabledInput] = useState(false);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        if (props.activeTreatment) {
            setData({
                closed_reason: props.activeTreatment.closed_reason ? props.activeTreatment.closed_reason : "",
            });
        }
    }, [props.activeTreatment]);

    const onChangeDescription = (e) => {
        const newData = {...data};
        newData.closed_reason = e.target.value;
        setData(newData);
    };

    const onChangeSolution = (e) => {
        const newData = {...data};
        newData.solution_communicated = e.target.value;
        setData(newData);
    };

    const onChangeLastName = (e) => {
        const newData = {...data};
        newData.name = e.target.value;
        setData(newData);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);
        if (verifyTokenExpire()) {
            if (verifyPermission(props.userPermissions, "close-my-claims")){
                axios.put(appConfig.apiDomaine + `/my/claim-unsatisfied/close/${props.getId}`, data)
                    .then(response => {
                        setStartRequest(false);
                        ToastBottomEnd.fire(toastAddSuccessMessageConfig());
                        window.location.href="/process/claim-dissatisfied"
                    }).catch(error => {
                    setStartRequest(false);
                    setError({...defaultError,...error.response.data.error});
                    ToastBottomEnd.fire(toastAddErrorMessageConfig());
                })
            }else{
                axios.put(appConfig.apiDomaine + `/claim-assignment-staff/${props.getId}/unfounded`, data)
                    .then(response => {
                        setStartRequest(false);
                        ToastBottomEnd.fire(toastAddSuccessMessageConfig());
                        window.location.href="/process/claim-dissatisfied/to-staff"
                    }).catch(error => {
                    setStartRequest(false);
                    setError({...defaultError,...error.response.data.error});
                    ToastBottomEnd.fire(toastAddErrorMessageConfig());
                })
            }
        }
    };
    return (
        ready ? (
            <div>
                <div className="modal fade" id="exampleModalCommittee" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{t("Création du comité spécifique")}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">

                             {/*   <div className={error.closed_reason.length ? "form-group validated" : "form-group"}>
                                    <label htmlFor="description">{t("Motif")} <span style={{color:"red"}}>*</span></label>
                                    <textarea
                                        id="description"
                                        className={error.closed_reason.length ? "form-control is-invalid" : "form-control"}
                                        placeholder={t("Veuillez entrer la description du motif")}
                                        cols="62"
                                        rows="7"
                                        value={data.closed_reason}
                                        onChange={(e) => onChangeDescription(e)}
                                    />
                                    {
                                        error.closed_reason.length ? (
                                            error.closed_reason.map((error, index) => (
                                                <div key={index}
                                                     className="invalid-feedback">
                                                    {error}
                                                </div>
                                            ))
                                        ) : ""
                                    }
                                </div>*/}

                                <div className="form-group row">
                                    <div className={error.name?.length ? "col validated" : "col"}>
                                    <label
                                        htmlFor="name">{t("Nom")}
                                        <InputRequire/>:</label>
                                    <input
                                        disabled={disabledInput}
                                        id="name"
                                        type="text"
                                        className={error.name?.length ? "form-control is-invalid" : "form-control"}
                                        placeholder={"Veuillez entrer le nom du comité"}
                                        value={data.name}
                                        onChange={(e) => onChangeLastName(e)}
                                    />
                                    {
                                        error.name?.length ? (
                                            error.name.map((error, index) => (
                                                <div key={index} className="invalid-feedback">
                                                    {error}
                                                </div>
                                            ))
                                        ) : null
                                    }
                                </div>
                                </div>

                                <div className="form-group row ">
                                    <div className={"col-lg-9 col-md-9 col-sm-12 m-auto"}>
                                        <label htmlFor="">{t("Agents concernés")}</label>
                                        <Select
                                            isClearable
                                            isMulti
                                            clearValue
                                            //value={unit}
                                            //isLoading={isLoad}
                                            placeholder={t("Veuillez sélectionner les agents")}
                                            //onChange={onChangeUnit}
                                            //options={ (!unit || (unit && unit.length < 4))  ? units : [] }
                                            //options={unit}
                                        />
                                        {/*   {
                                                                 unit.length > 3 ? (
                                                                     <p className={"mt-1"} style={{ color:"red", fontSize:"10px", textAlign:"end"}}>Vous avez atteint le nombre maximal d'agences à sélectionner</p>
                                                                 ) : null
                                                               }
                                                         */}

                                        {/*   {
                                                                 error.unit_targeted_id.length ? (
                                                                     error.unit_targeted_id.map((error, index) => (
                                                                         <div key={index} className="invalid-feedback">
                                                                             {error}
                                                                         </div>
                                                                     ))
                                                                 ) : null
                                                             }
                                                         */}
                                    </div>
                                </div>




                                {/*     {
                                    verifyPermission(props.userPermissions, "unfounded-claim-awaiting-assignment")?(
                                        <div
                                            className={error.solution_communicated.length ? "form-group validated" : "form-group"}>
                                            <label htmlFor="description">{t("Solution")} <span style={{color:"red"}}>*</span></label>
                                            <textarea
                                                id="description"
                                                className={error.solution_communicated.length ? "form-control is-invalid" : "form-control"}
                                                placeholder={t("Message à communiquer au client")}
                                                cols="30"
                                                rows="7"
                                                value={data.solution_communicated}
                                                onChange={(e) => onChangeSolution(e)}
                                            />
                                            {
                                                error.solution_communicated.length ? (
                                                    error.solution_communicated.map((error, index) => (
                                                        <div key={index}
                                                             className="invalid-feedback">
                                                            {error}
                                                        </div>
                                                    ))
                                                ) : ""
                                            }

                                        </div>
                                    ):""
                                }*/}

                            </div>
                            <div className="modal-footer">

                                {
                                    !startRequest ? (
                                        <button type="submit"
                                                onClick={(e) => onSubmit(e)}
                                                className="btn btn-primary">{("Transférer")}</button>
                                    ) : (
                                        <button
                                            className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                            type="button" disabled>
                                            {t("Chargement")}...
                                        </button>
                                    )
                                }

                                <button type="button" className="btn btn-secondary" data-dismiss="modal">{t("Quitter")}</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null
    )
};
const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,

    };
};

export default connect(mapStateToProps)(CreateCommitteeSpecific);
