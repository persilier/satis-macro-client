import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    useParams,
    Link
} from "react-router-dom";
import {connect} from "react-redux";
import Select from "react-select";
import {formatSelectOption, loadCss, loadScript} from "../../helpers/function";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import {AUTH_TOKEN} from "../../constants/token";
import FusionClaim from "../components/FusionClaim";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig, toastErrorMessageWithParameterConfig
} from "../../config/toastConfig";
import ClientButton from "../components/ClientButton";
import ClaimButton from "../components/ClaimButton";
import AttachmentsButton from "../components/AttachmentsButton";
import DoubleButton from "../components/DoubleButton";
import ClientButtonDetail from "../components/ClientButtonDetail";
import ClaimButtonDetail from "../components/ClaimButtonDetail";
import DoubleButtonDetail from "../components/DoubleButtonDetail";
import AttachmentsButtonDetail from "../components/AttachmentsButtonDetail";
import UnfoundedModal from "../components/UnfoundedModal";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
loadCss("/assets/css/pages/wizard/wizard-2.css");
loadScript("/assets/js/pages/custom/wizard/wizard-2.js");
loadScript("/assets/js/pages/custom/chat/chat.js");

const endPointConfig = {
    PRO: {
        plan: "PRO",
        edit: id => `${appConfig.apiDomaine}/transfer-claim-to-circuit-unit/${id}`,
        update: id => `${appConfig.apiDomaine}/transfer-claim-to-circuit-unit/${id}`,
    },
    MACRO: {
        plan: "MACRO",
        edit: id => `${appConfig.apiDomaine}/transfer-claim-to-circuit-unit/${id}`,
        update: id => `${appConfig.apiDomaine}/transfer-claim-to-circuit-unit/${id}`,

    },
    HUB: {
        plan: "HUB",
        edit: id => `${appConfig.apiDomaine}/transfer-claim-to-unit/${id}`,
        update: id => `${appConfig.apiDomaine}/transfer-claim-to-unit/${id}`,
    }
};


const ClaimAssignDetail = (props) => {
    document.title = "Satis client - Détail réclamation";
    const {id} = useParams();

    if (!(verifyPermission(props.userPermissions, "show-claim-awaiting-assignment") && props.activePilot))
        window.location.href = ERROR_401;

    let endPoint = endPointConfig[props.plan];

    const defaultError = {
       unit_id: [],
    };
    const [error, setError] = useState(defaultError);

    const [claim, setClaim] = useState(null);
    const [copyClaim, setCopyClaim] = useState(null);
    const [dataId, setDataId] = useState("");
    const [data, setData] = useState({unit_id: null});
    const [unitsData, setUnitsData] = useState({});
    const [unit, setUnit] = useState(null);
    const [startRequest, setStartRequest] = useState(false);
    const [startRequestToUnit, setStartRequestToUnit] = useState(false);

    useEffect(() => {
        async function fetchData() {
            await axios.get(`${appConfig.apiDomaine}/claim-awaiting-assignment/${id}`)
                .then(response => {
                    setClaim(response.data);
                    setDataId(response.data.institution_targeted.name);
                })
                .catch(error => console.log("Something is wrong"))
            ;

            if (verifyPermission(props.userPermissions, "transfer-claim-to-circuit-unit") || verifyPermission(props.userPermissions, "transfer-claim-to-unit")) {
                await axios.get(endPoint.edit(`${id}`))
                    .then(response => {
                        let newUnit = Object.values(response.data.units);
                        setUnitsData(formatSelectOption(newUnit, "name", "fr"))
                    })
                    .catch(error => console.log("Something is wrong"))
                ;
            }

        }

        fetchData();
    }, []);

    const onClickToTranfertInstitution = async (e) => {
        e.preventDefault();
        setStartRequest(true);
        await axios.put(`${appConfig.apiDomaine}/transfer-claim-to-targeted-institution/${id}`)
            .then(response => {
                setStartRequest(false);
                ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                window.location.href = "/process/claim-assign";
            })
            .catch(error => {
                setStartRequest(false);
                ToastBottomEnd.fire(toastAddErrorMessageConfig)
            })
        ;
    };

    const onClickToTranfert = (e) => {
        e.preventDefault();
        setStartRequestToUnit(true);

        async function fetchData() {
            await axios.put(endPoint.update(`${id}`), data)
                .then(response => {
                    setStartRequestToUnit(false);
                    ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                    window.location.href = "/process/claim-assign";
                })
                .catch(error => {
                    setError({...defaultError,...error.response.data.error});
                    setStartRequestToUnit(false);
                    ToastBottomEnd.fire(toastAddErrorMessageConfig);
                    // ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(error.response.data.error.unit_id))
                })
            ;
        }

        fetchData()
    };

    const onChangeUnits = (selected) => {
        const newData = {...data};
        newData.unit_id = selected ? selected.value : null;
        setUnit(selected);
        setData(newData);
        console.log(newData.unit_id,"UNIT")
    };

    const onClickFusionButton = async (newClaim) => {
        await setCopyClaim(newClaim);
        document.getElementById(`modal-button`).click();
    };

    return (
        verifyPermission(props.userPermissions, "show-claim-awaiting-assignment") && props.activePilot ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Traitement
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <span className="kt-subheader__separator kt-hidden"/>
                                <div className="kt-subheader__breadcrumbs">
                                    <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                        className="flaticon2-shelter"/></a>
                                    <span className="kt-subheader__breadcrumbs-separator"/>
                                    <Link to="/process/claim-assign" className="kt-subheader__breadcrumbs-link">
                                        Réclamation à Transférer
                                    </Link>
                                </div>
                            </div>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#" className="kt-subheader__breadcrumbs-home">
                                    <i className="flaticon2-shelter"/>
                                </a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#detail" onClick={e => e.preventDefault()} style={{cursor: "default"}}
                                   className="kt-subheader__breadcrumbs-link">
                                    Détail
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <div className="kt-portlet">
                        <div className="kt-portlet__body kt-portlet__body--fit">
                            <div className="kt-grid  kt-wizard-v2 kt-wizard-v2--white" id="kt_wizard_v2"
                                 data-ktwizard-state="step-first">
                                <div className="kt-grid__item kt-wizard-v2__aside">
                                    <div className="kt-wizard-v2__nav">
                                        <div className="kt-wizard-v2__nav-items kt-wizard-v2__nav-items--clickable">
                                            {
                                                claim ? (
                                                    claim.active_treatment && claim.active_treatment.rejected_reason && claim.active_treatment.rejected_at ? (
                                                        <div className="d-flex justify-content-start">
                                                            <span className="kt-badge kt-badge--danger kt-badge--inline"
                                                                  style={{fontWeight: "bold"}}>RECLAMATION  REJETEE</span>
                                                        </div>
                                                    ) : null
                                                ) : null
                                            }<br/>

                                            <ClientButton/>

                                            <ClaimButton/>

                                            <AttachmentsButton claim={claim}/>

                                            <DoubleButton claim={claim}/>

                                            <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
                                                <div className="kt-wizard-v2__nav-body">
                                                    <div className="kt-wizard-v2__nav-icon">
                                                        <i className="flaticon-truck"/>
                                                    </div>
                                                    <div className="kt-wizard-v2__nav-label">
                                                        <div className="kt-wizard-v2__nav-label-title">
                                                            Transfert
                                                        </div>
                                                        <div className="kt-wizard-v2__nav-label-desc">
                                                            Transferer la réclamation
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="kt-grid__item kt-grid__item--fluid kt-wizard-v2__wrapper">
                                    <form className="kt-form" id="kt_form">
                                        {
                                            verifyPermission(props.userPermissions, "unfounded-claim-awaiting-assignment") ? (
                                                <div className="d-flex justify-content-md-end">
                                                    <button type="button"
                                                            data-toggle="modal" data-target="#exampleModal"
                                                            className="btn btn-success">
                                                        NON FONDÉ
                                                    </button>
                                                    {
                                                        claim ? (
                                                            <UnfoundedModal
                                                                activeTreatment={
                                                                    claim.active_treatment ? (
                                                                        claim.active_treatment
                                                                    ) : null
                                                                }
                                                                getId={`${id}`}
                                                            />
                                                        ) : (
                                                            <UnfoundedModal
                                                                getId={`${id}`}
                                                            />
                                                        )
                                                    }

                                                </div>
                                            ) : ""
                                        }


                                        <ClientButtonDetail claim={claim}/>

                                        <ClaimButtonDetail claim={claim}
                                                           rejected={claim && claim.active_treatment && claim.active_treatment.rejected_reason ? true : false}/>

                                        <AttachmentsButtonDetail claim={claim}/>

                                        <DoubleButtonDetail
                                            claim={claim}
                                            onClickFusionButton={onClickFusionButton}
                                            userPermissions={props.userPermissions}
                                        />

                                        <div className="kt-wizard-v2__content"
                                             data-ktwizard-type="step-content">
                                            <div className="kt-heading kt-heading--md">Transfert de la réclamation
                                            </div>
                                            <div className="kt-form__section kt-form__section--first">
                                                <div className="kt-wizard-v2__review">
                                                    {
                                                        verifyPermission(props.userPermissions, "transfer-claim-to-targeted-institution") ?
                                                            <div className="kt-wizard-v2__review-item">
                                                                <div className="kt-wizard-v2__review-content"
                                                                     style={{fontSize: "15px"}}>
                                                                    <label
                                                                        className="col-xl-6 col-lg-6 col-form-label"><strong>Institution
                                                                        concernée</strong></label>
                                                                    <span
                                                                        className="kt-widget__data">{dataId}</span>
                                                                </div>
                                                                <div className="modal-footer">
                                                                    {
                                                                        !startRequest ? (
                                                                            <button
                                                                                className="btn btn-outline-success"
                                                                                onClick={onClickToTranfertInstitution}>
                                                                                TRANSFÉRER A L'INSTITUTION
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
                                                            </div>
                                                            : null
                                                    }
                                                    {
                                                        (verifyPermission(props.userPermissions, "transfer-claim-to-circuit-unit") ||
                                                            verifyPermission(props.userPermissions, "transfer-claim-to-unit")) ?
                                                            <div className="kt-wizard-v2__review-item">
                                                                <div className="kt-wizard-v2__review-title">
                                                                    Tranferer à une unité
                                                                </div>
                                                                <div className="kt-wizard-v2__review-content">
                                                                    <div
                                                                        className={error.unit_id.length ? "form-group validated" : "form-group"}>
                                                                        <label>Unité</label>
                                                                        <Select
                                                                            isClearable
                                                                            value={unit}
                                                                            onChange={onChangeUnits}
                                                                            options={unitsData}
                                                                            placeholder={"Veuillez sélectionner l'unité de traitement"}
                                                                        />
                                                                        {
                                                                            error.unit_id.length ? (
                                                                                error.unit_id.map((error, index) => (
                                                                                    <div key={index}
                                                                                         className="invalid-feedback">
                                                                                        {error}
                                                                                    </div>
                                                                                ))
                                                                            ) : ""
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="modal-footer">
                                                                    {
                                                                        !startRequestToUnit ? (
                                                                            <button
                                                                                className="btn btn-outline-success"
                                                                                onClick={onClickToTranfert}>
                                                                                TRANSFÉRER A UNE UNITÉ
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
                                                            </div>
                                                            : null
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="kt-form__actions">
                                            <button
                                                className="btn btn-secondary btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u"
                                                data-ktwizard-type="action-prev">
                                                PRÉCÉDENT
                                            </button>

                                            <button
                                                className="btn btn-brand btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u"
                                                data-ktwizard-type="action-next">
                                                SUIVANTE
                                            </button>
                                        </div>
                                    </form>

                                    {
                                        verifyPermission(props.userPermissions, "merge-claim-awaiting-assignment") ? (
                                            <div>
                                                <button style={{display: "none"}} id={`modal-button`} type="button"
                                                        className="btn btn-bold btn-label-brand btn-sm"
                                                        data-toggle="modal" data-target="#kt_modal_4"/>
                                                {
                                                    copyClaim ? (
                                                        <FusionClaim
                                                            claim={claim}
                                                            copyClaim={copyClaim}
                                                            onCloseModal={() => setCopyClaim(null)}
                                                        />
                                                    ) : null
                                                }
                                            </div>
                                        ) : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        lead: state.user.user.staff.is_lead,
        plan: state.plan.plan,
        activePilot: state.user.user.staff.is_active_pilot
    };
};

export default connect(mapStateToProps)(ClaimAssignDetail);
