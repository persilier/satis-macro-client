import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    useParams,
    Link
} from "react-router-dom";
import {connect} from "react-redux";
import moment from "moment";
import Select from "react-select";
import {formatSelectOption, loadCss, loadScript, validatedClaimRule} from "../../helpers/function";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import {AUTH_TOKEN} from "../../constants/token";
import Loader from "../components/Loader";
import FusionClaim from "../components/FusionClaim";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig, toastAssignClaimSuccessMessageConfig
} from "../../config/toastConfig";
import ReasonModal from "../components/ReasonModal";
import {AssignClaimConfirmation} from "../components/ConfirmationAlert";
import {confirmAssignConfig} from "../../config/confirmConfig";
import UnfoundedModal from "../components/UnfoundedModal";
import TreatmentForm from "../components/TreatmentForm";
import ReasonSatisfaction from "../components/ReasonSatisfaction";

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
    document.title = "Satis client - Détail plainte";
    const {id} = useParams();
    const validation = validatedClaimRule(id);

    if (!(verifyPermission(props.userPermissions, "show-claim-awaiting-assignment") ||
        verifyPermission(props.userPermissions, 'assignment-claim-awaiting-treatment') ||
        verifyPermission(props.userPermissions, ' show-claim-archived') ||
        verifyPermission(props.userPermissions, 'update-claim-satisfaction-measured')))
        window.location.href = ERROR_401;

    let endPoint = endPointConfig[props.plan];

    const defaultData = {
        unit_id: []
    };

    const [claim, setClaim] = useState(null);
    const [copyClaim, setCopyClaim] = useState(null);
    const [dataId, setDataId] = useState("");
    const [data, setData] = useState(defaultData);
    const [unitsData, setUnitsData] = useState({});
    const [unit, setUnit] = useState({});
    const [showReason, setShowReason] = useState(false);
    const [reasonTitle, setReasonTitle] = useState("");
    const [reasonLabel, setReasonLabel] = useState("");
    const [action, setAction] = useState("");
    const [staffs, setStaffs] = useState([]);
    const [errors, setErrors] = useState([]);
    const [staff, setStaff] = useState(null);
    const [startRequest, setStartRequest] = useState(false);
    const [startRequestToUnit, setStartRequestToUnit] = useState(false);

    const formatStaffsOptions = (data) => {
        const newData = [];
        for (let i = 0; i < data.length; i++)
            newData.push({value: data[i].id, label: `${data[i].identite.lastname} ${data[i].identite.firstname}`});
        return newData;
    };

    useEffect(() => {
        async function fetchData() {
            let endpoint = "";
            if (!localStorage.getItem("page"))
                endpoint = `${appConfig.apiDomaine}/claim-awaiting-assignment/${id}`;
            else if (localStorage.getItem("page") === "ClaimListPage")
                endpoint = `${appConfig.apiDomaine}/claim-awaiting-treatment/${id}/edit`;
            else if (localStorage.getItem("page") === "ClaimToStaffPage")
                endpoint = `${appConfig.apiDomaine}/claim-assignment-staff/${id}`;
            else if (localStorage.getItem("page") === "SatisfactionMeasure")
                endpoint = `${appConfig.apiDomaine}/claim-satisfaction-measured/${id}`;
            else if (localStorage.getItem("page") === "ClaimsArchived")
                endpoint = `${appConfig.apiDomaine}/claim-archived/${id}`;
            else if (localStorage.getItem("page") === "ClaimToValidatedListPage") {
                if (verifyPermission(props.userPermissions, 'show-claim-awaiting-validation-my-institution'))
                    endpoint = `${appConfig.apiDomaine}/claim-awaiting-validation-my-institution/${id}`;
                else if (verifyPermission(props.userPermissions, 'show-claim-awaiting-validation-any-institution'))
                    endpoint = `${appConfig.apiDomaine}/claim-awaiting-validation-any-institution/${id}`;
            } else
                endpoint = `${appConfig.apiDomaine}/claim-awaiting-assignment/${id}`;
            await axios.get(endpoint)
                .then(response => {
                    if (localStorage.getItem("page") === "ClaimListPage") {
                        setClaim(response.data.claim);
                        setStaffs(formatStaffsOptions(response.data.staffs));
                    }

                    if (localStorage.getItem("page") === "ClaimToStaffPage") {
                        setClaim(response.data);
                    }

                    if (localStorage.getItem("page") === "SatisfactionMeasure") {
                        setClaim(response.data);
                    }

                    if (localStorage.getItem("page") === "ClaimsArchived") {
                        setClaim(response.data);
                    }

                    if (localStorage.getItem("page") === "claimAssign" || localStorage.getItem("page") === "ClaimToValidatedListPage") {
                        setClaim(response.data);
                        setDataId(response.data.institution_targeted.name)
                    }
                })
                .catch(error => console.log("Something is wrong"));

            if (localStorage.getItem("page") === "claimAssign" && (verifyPermission(props.userPermissions, "transfer-claim-to-circuit-unit") ||
                verifyPermission(props.userPermissions, "transfer-claim-to-unit"))) {
                await axios.get(endPoint.edit(`${id}`))
                    .then(response => {
                        let newUnit = Object.values(response.data.units);
                        console.log(newUnit, "UNIT");
                        setUnitsData(formatSelectOption(newUnit, "name", "fr"))
                    })
                    .catch(error => console.log("Something is wrong"));
            }

        }

        fetchData();
    }, []);

    const onClickToTranfertInstitution = (e) => {
        e.preventDefault();
        setStartRequest(true);

        async function fetchData() {
            await axios.put(`${appConfig.apiDomaine}/transfer-claim-to-targeted-institution/${id}`)
                .then(response => {
                    console.log(response);
                    setStartRequest(false);
                    ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                    window.location.href = "/process/claim-assign";
                })
                .catch(error => ToastBottomEnd.fire(toastAddErrorMessageConfig));
        }

        fetchData()
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
                .catch(error => ToastBottomEnd.fire(toastAddErrorMessageConfig));
        }

        fetchData()
    };

    const onChangeUnits = (selected) => {
        const newData = {...data};
        newData.unit_id = selected.value;
        setUnit(selected);
        setData(newData)
    };

    const onChangeStaff = (selected) => {
        setStaff(selected);
    };

    const onClickFusionButton = async (newClaim) => {
        await setCopyClaim(newClaim);
        document.getElementById(`modal-button`).click();
    };

    const selfAssign = () => {
        AssignClaimConfirmation.fire(confirmAssignConfig)
            .then(response => {
                if (response.value) {
                    axios.put(`${appConfig.apiDomaine}/claim-awaiting-treatment/${id}/self-assignment`, {})
                        .then(response => {
                            ToastBottomEnd.fire(toastAssignClaimSuccessMessageConfig);
                            window.location.href = "/process/unit-claims";
                        })
                        .catch(error => console.log("Something is wrong"))
                }
            })
    };

    const assignClaim = () => {
        setStartRequest(true);
        axios.put(`${appConfig.apiDomaine}/claim-awaiting-treatment/${id}/assignment`, {staff_id: staff ? staff.value : ""})
            .then(response => {
                ToastBottomEnd.fire(toastAssignClaimSuccessMessageConfig);
                setStartRequest(false);
                setStaff(null);
                setErrors([]);
                window.location.href = "/process/unit-claims";
            })
            .catch(error => {
                setStartRequest(false);
                setErrors(error.response.data.error.staff_id)
            })
        ;
    };

    const showReasonInput = async (type) => {
        if (type === "reject") {
            await setReasonTitle("Motif de rejet");
            await setReasonLabel("Le motif");
        } else if (type === "validateReject") {
            await setReasonTitle('Motif de rejet');
            await setReasonLabel('Le motif');
        } else if (type === "validateSolution") {
            await setReasonTitle('Solution à communiquer au client');
            await setReasonLabel('Solution');
        }
        await setAction(type);
        await setShowReason(true);
        document.getElementById("reason-modal").click();
    };

    return (
        verifyPermission(props.userPermissions, "show-claim-awaiting-assignment") ||
        verifyPermission(props.userPermissions, 'assignment-claim-awaiting-treatment') ||
        verifyPermission(props.userPermissions, 'update-claim-satisfaction-measured') ||
        verifyPermission(props.userPermissions, "show-claim-assignment-to-staff") ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Processus
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()}
                                   className="kt-subheader__breadcrumbs-link" style={{cursor: "default"}}>
                                    Traitement
                                </a>
                                <span className="kt-subheader__separator kt-hidden"/>
                                <div className="kt-subheader__breadcrumbs">
                                    <a href="#icone" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                                    <span className="kt-subheader__breadcrumbs-separator"/>
                                    {
                                        localStorage.getItem('page') === "claimAssign" ? (
                                            <Link to="/process/claim-assign" className="kt-subheader__breadcrumbs-link">
                                                Plaintes à affectées
                                            </Link>
                                        ) : ""
                                    }

                                    {
                                        localStorage.getItem('page') === "ClaimListPage" ? (
                                            <Link to="/process/unit-claims" className="kt-subheader__breadcrumbs-link">
                                                Liste des plaintes
                                            </Link>
                                        ) : ""
                                    }

                                    {
                                        localStorage.getItem('page') === "ClaimToValidatedListPage" ? (
                                            <Link to="/process/claim-to-validated" className="kt-subheader__breadcrumbs-link">
                                                Plaintes à valider
                                            </Link>
                                        ) : ""
                                    }
                                    {
                                        localStorage.getItem('page') === "ClaimToStaffPage" ? (
                                            <Link to="/process/claim-assign/to-staff" className="kt-subheader__breadcrumbs-link">
                                                Plaintes à traitrer
                                            </Link>
                                        ) : ""
                                    }
                                    {
                                        localStorage.getItem('page') === "SatisfactionMeasure" ? (
                                            <Link to="/process/claim_measure" className="kt-subheader__breadcrumbs-link">
                                                Mesure de Satisfaction
                                            </Link>
                                        ) : ""
                                    }
                                    {
                                        localStorage.getItem('page') === "ClaimsArchived" ? (
                                            <Link to="/process/claim_archived" className="kt-subheader__breadcrumbs-link">
                                                Archivage
                                            </Link>
                                        ) : ""
                                    }
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
                                    Détail plainte
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
                                            <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step"
                                                 data-ktwizard-state="current">
                                                <div className="kt-wizard-v2__nav-body">
                                                    <div className="kt-wizard-v2__nav-icon">
                                                        <i className="flaticon-user-settings"/>
                                                    </div>
                                                    <div className="kt-wizard-v2__nav-label">
                                                        <div className="kt-wizard-v2__nav-label-title">
                                                            Information client
                                                        </div>
                                                        <div className="kt-wizard-v2__nav-label-desc">
                                                            Voir les détails du compte client
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
                                                <div className="kt-wizard-v2__nav-body">
                                                    <div className="kt-wizard-v2__nav-icon">
                                                        <i className="flaticon-book"/>
                                                    </div>
                                                    <div className="kt-wizard-v2__nav-label">
                                                        <div className="kt-wizard-v2__nav-label-title">
                                                            Information Plainte
                                                        </div>
                                                        <div className="kt-wizard-v2__nav-label-desc">
                                                            Voir les détails de la plainte
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="kt-wizard-v2__nav-item" href="#" data-ktwizard-type="step">
                                                <div className="kt-wizard-v2__nav-body">
                                                    <div className="kt-wizard-v2__nav-icon">
                                                        <i className="flaticon-file-2"/>
                                                    </div>
                                                    <div className="kt-wizard-v2__nav-label">
                                                        <div className="kt-wizard-v2__nav-label-title">
                                                            Pièces jointe plainte
                                                            {
                                                                !claim ? "" : (
                                                                    <span
                                                                        className="mx-lg-4 kt-badge kt-badge--success  kt-badge--inline kt-badge--pill">{claim.files.length}</span>
                                                                )
                                                            }
                                                        </div>
                                                        <div className="kt-wizard-v2__nav-label-desc">
                                                            Voir les pièces jointes de la plainte
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {
                                                localStorage.getItem('page') === "claimAssign" ? (
                                                    <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
                                                        <div className="kt-wizard-v2__nav-body">
                                                            <div className="kt-wizard-v2__nav-icon">
                                                                <i className="flaticon2-copy"/>
                                                            </div>
                                                            <div className="kt-wizard-v2__nav-label">
                                                                <div className="kt-wizard-v2__nav-label-title">
                                                                    Les doublons
                                                                    {
                                                                        !claim ? "" : (
                                                                            <span
                                                                                className="mx-lg-4 kt-badge kt-badge--success  kt-badge--inline kt-badge--pill">{claim.duplicates.length}</span>
                                                                        )
                                                                    }
                                                                </div>
                                                                <div className="kt-wizard-v2__nav-label-desc">
                                                                    Voir les doublons
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : ""
                                            }

                                            {
                                                localStorage.getItem('page') === "ClaimListPage" ? (
                                                    <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
                                                        <div className="kt-wizard-v2__nav-body">
                                                            <div className="kt-wizard-v2__nav-icon">
                                                                <i className="flaticon-chat-1"/>
                                                            </div>
                                                            <div className="kt-wizard-v2__nav-label">
                                                                <div className="kt-wizard-v2__nav-label-title">
                                                                    Commentaire
                                                                </div>
                                                                <div className="kt-wizard-v2__nav-label-desc">
                                                                    Voire ou ajouter un commentaire
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : ""
                                            }

                                            {
                                                localStorage.getItem('page') === "claimAssign" ? (
                                                    <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
                                                        <div className="kt-wizard-v2__nav-body">
                                                            <div className="kt-wizard-v2__nav-icon">
                                                                <i className="flaticon-truck"/>
                                                            </div>
                                                            <div className="kt-wizard-v2__nav-label">
                                                                <div className="kt-wizard-v2__nav-label-title">
                                                                    Transfert de la plainte
                                                                </div>
                                                                <div className="kt-wizard-v2__nav-label-desc">
                                                                    Transferez la plainte au destinateur
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : ""
                                            }

                                            {
                                                props.lead && localStorage.getItem('page') === "ClaimListPage" ? (
                                                    <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
                                                        <div className="kt-wizard-v2__nav-body">
                                                            <div className="kt-wizard-v2__nav-icon">
                                                                <i className="flaticon-paper-plane"/>
                                                            </div>
                                                            <div className="kt-wizard-v2__nav-label">
                                                                <div className="kt-wizard-v2__nav-label-title">
                                                                    Affectation de la plainte
                                                                </div>
                                                                <div className="kt-wizard-v2__nav-label-desc">
                                                                    Affectez la plainte à un agent
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : null
                                            }

                                            {
                                                localStorage.getItem('page') === "ClaimToStaffPage" && verifyPermission(props.userPermissions, "show-claim-assignment-to-staff") ? (
                                                    <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
                                                        <div className="kt-wizard-v2__nav-body">
                                                            <div className="kt-wizard-v2__nav-icon">
                                                                <i className="flaticon-clipboard"/>
                                                            </div>
                                                            <div className="kt-wizard-v2__nav-label">
                                                                <div className="kt-wizard-v2__nav-label-title">
                                                                    Traitement de la plainte
                                                                </div>
                                                                <div className="kt-wizard-v2__nav-label-desc">
                                                                    Procédez au traitement de la plainte
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : ""
                                            }

                                            {
                                                localStorage.getItem("page") === "ClaimToValidatedListPage" && verifyPermission(props.userPermissions, validation[props.plan].permission) ? (
                                                    <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
                                                        <div className="kt-wizard-v2__nav-body">
                                                            <div className="kt-wizard-v2__nav-icon">
                                                                <i className="flaticon-list"/>
                                                            </div>
                                                            <div className="kt-wizard-v2__nav-label">
                                                                <div className="kt-wizard-v2__nav-label-title">
                                                                    Validation de la plainte
                                                                </div>
                                                                <div className="kt-wizard-v2__nav-label-desc">
                                                                    Valider le retour de l'agent sur la plainte
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : ""
                                            }
                                            {
                                                (localStorage.getItem("page") === "SatisfactionMeasure" && verifyPermission(props.userPermissions, "update-claim-satisfaction-measured")) ||
                                                (localStorage.getItem("page") === "ClaimsArchived" && verifyPermission(props.userPermissions, "show-claim-archived")) ? (
                                                    <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
                                                        <div className="kt-wizard-v2__nav-body">
                                                            <div className="kt-wizard-v2__nav-icon">
                                                                <i className="flaticon-list"/>
                                                            </div>
                                                            <div className="kt-wizard-v2__nav-label">
                                                                <div className="kt-wizard-v2__nav-label-title">
                                                                    Traitement Effectué
                                                                </div>
                                                                <div className="kt-wizard-v2__nav-label-desc">
                                                                    Détails du traitement effectué
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : ""
                                            }
                                            {
                                                localStorage.getItem("page") === "SatisfactionMeasure" && verifyPermission(props.userPermissions, "update-claim-satisfaction-measured") ? (
                                                    <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
                                                        <div className="kt-wizard-v2__nav-body">
                                                            <div className="kt-wizard-v2__nav-icon">
                                                                <i className="flaticon-list"/>
                                                            </div>
                                                            <div className="kt-wizard-v2__nav-label">
                                                                <div className="kt-wizard-v2__nav-label-title">
                                                                    Mesure de Satisfaction
                                                                </div>
                                                                <div className="kt-wizard-v2__nav-label-desc">
                                                                    Mesurer la satisfaction du client
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : ""
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="kt-grid__item kt-grid__item--fluid kt-wizard-v2__wrapper">
                                    <form className="kt-form" id="kt_form">
                                        {
                                            localStorage.getItem('page') === "ClaimToStaffPage" && verifyPermission(props.userPermissions, "show-claim-assignment-to-staff") ? (
                                                <div className="d-flex justify-content-end">
                                                    <button type="button"
                                                            data-toggle="modal" data-target="#exampleModal"
                                                            className="btn btn-success">
                                                        NON FONDÉ
                                                    </button>
                                                    <UnfoundedModal
                                                        getId={`${id}`}
                                                    />
                                                </div>
                                            ) : ""
                                        }

                                        {
                                            localStorage.getItem('page') === "ClaimListPage" ? (
                                                <div className="d-flex justify-content-end">
                                                    {
                                                        verifyPermission(props.userPermissions, "self-assignment-claim-awaiting-treatment") ? (
                                                            <button className="btn btn-primary btn-sm mx-2"
                                                                    onClick={selfAssign}>S'affecter la plainte</button>
                                                        ) : ""
                                                    }
                                                    {
                                                        verifyPermission(props.userPermissions, "rejected-claim-awaiting-treatment") ? (
                                                            <button
                                                                className="btn btn-secondary btn-sm"
                                                                onClick={() => showReasonInput("reject")}>
                                                                Rejeter la plainte
                                                            </button>
                                                        ) : ""
                                                    }
                                                    <button id={"reason-modal"} style={{display: "none"}} type="button"
                                                            className="btn btn-bold btn-label-brand btn-sm"
                                                            data-toggle="modal" data-target="#kt_modal_4_2"/>
                                                </div>
                                            ) : ""
                                        }

                                        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content"
                                             data-ktwizard-state="current">
                                            <div className="kt-heading kt-heading--md">Passez en revue les détails du
                                                client
                                            </div>
                                            <div className="kt-form__section kt-form__section--first">
                                                <div className="kt-wizard-v2__review">
                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-widget kt-widget--user-profile-1">
                                                            <div className="kt-widget__head">
                                                                <div className="kt-widget__media">
                                                                    <img src="/personal/img/default-avatar.png"
                                                                         alt="image"/>
                                                                </div>
                                                                <div className="kt-widget__content"
                                                                     style={{marginTop: "auto", marginBottom: "auto"}}>
                                                                    <div className="kt-widget__section">
                                                                        {
                                                                            !claim ? (
                                                                                <Loader/>
                                                                            ) : (
                                                                                <a href="#"
                                                                                   className="kt-widget__username">
                                                                                    {`${claim.claimer.lastname} ${claim.claimer.firstname}`}
                                                                                    <i className="flaticon2-correct kt-font-success"/>
                                                                                </a>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="kt-widget__body">
                                                                {
                                                                    !claim ? "" : (
                                                                        <div className="kt-widget__content">
                                                                            <div className="kt-widget__info">
                                                                                <span className="fa fa-venus-mars"
                                                                                      style={{fontSize: "1.5rem"}}/>
                                                                                <span
                                                                                    className="kt-widget__data">{claim.claimer.sexe === 'F' ? "Féminin" : "Masculin"}</span>
                                                                            </div>
                                                                            <div className="kt-widget__info">
                                                                                <span className="fa fa-envelope"
                                                                                      style={{fontSize: "1.5rem"}}/>
                                                                                <span className="kt-widget__data">
                                                                                {
                                                                                    claim.claimer.email.map((mail, index) => (
                                                                                        index === claim.claimer.email.length - 1 ? mail : mail + "/ "
                                                                                    ))
                                                                                }
                                                                            </span>
                                                                            </div>
                                                                            <div className="kt-widget__info">
                                                                                <span className="fa fa-phone-alt"
                                                                                      style={{fontSize: "1.5rem"}}/>
                                                                                <span className="kt-widget__data">
                                                                                {
                                                                                    claim.claimer.telephone.map((telephone, index) => (
                                                                                        index === claim.claimer.telephone.length - 1 ? telephone : telephone + "/ "
                                                                                    ))
                                                                                }
                                                                            </span>
                                                                            </div>
                                                                            <div className="kt-widget__info">
                                                                                <span className="fa fa-location-arrow"
                                                                                      style={{fontSize: "1.5rem"}}/>
                                                                                <span className="kt-widget__data">
                                                                                {claim.claimer.ville ? claim.claimer.ville : "Pas d'information sur la ville"}
                                                                            </span>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
                                            <div className="kt-heading kt-heading--md">Information sur la plainte</div>
                                            <div className="kt-form__section kt-form__section--first">
                                                <div className="kt-wizard-v2__review">
                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-wizard-v2__review-title">
                                                            Canal
                                                        </div>
                                                        {
                                                            !claim ? "" : (
                                                                <div className="kt-wizard-v2__review-content">
                                                                    Canal de réception: <span
                                                                    className="mx-2">{claim.request_channel ? claim.request_channel.name["fr"] : "Pas de canal de réception"}</span><br/>
                                                                    Canal de réponse: <span
                                                                    className="mx-2">{claim.response_channel ? claim.response_channel.name["fr"] : "Pas de canal de réponse"}</span><br/>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-wizard-v2__review-title">
                                                            Cible
                                                        </div>
                                                        {
                                                            !claim ? "" : (
                                                                <div className="kt-wizard-v2__review-content">
                                                                    Institution concernée: <span
                                                                    className="mx-2">{claim.institution_targeted.name} 1</span><br/>
                                                                    Unité concèrné: <span
                                                                    className="mx-2">{claim.unit_targeted ? claim.unit_targeted.name["fr"] : "Pas d'institution ciblé"}</span><br/>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-wizard-v2__review-title">
                                                            Spécification plainte
                                                        </div>
                                                        {
                                                            !claim ? "" : (
                                                                <div className="kt-wizard-v2__review-content">
                                                                    Objet de plainte: <span
                                                                    className="mx-2">{claim.claim_object.name["fr"]}</span><br/>
                                                                    <br/>
                                                                    Numéro de compte concèrné: <span
                                                                    className="mx-2">{claim.account_targeted ? claim.account_targeted.number : "Pas de compte cible"}</span><br/>
                                                                    <br/>
                                                                    Montant réclamé: <span
                                                                    className="mx-2">{claim.amount_disputed ? `${claim.amount_disputed} ${claim.amount_currency.name["fr"]}` : "Pas de montant"}</span><br/>
                                                                    <br/>
                                                                    Date de l'évernement: <span
                                                                    className="mx-2">{claim.created_at}</span><br/>
                                                                    <br/>
                                                                    <strong>Description:</strong> <span
                                                                    className="mx-2">{claim.description}</span><br/>
                                                                    <br/>
                                                                    <strong>Attente:</strong> <span
                                                                    className="mx-2">{claim.claimer_expectation}</span><br/>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
                                            <div className="kt-heading kt-heading--md">Les pièces jointes de la
                                                plainte
                                            </div>
                                            <div className="kt-form__section kt-form__section--first">
                                                <div className="kt-wizard-v2__review">
                                                    {
                                                        !claim ? "" : (
                                                            claim.files.length ? (
                                                                claim.files.map((file, index) => (
                                                                    <div className="kt-wizard-v2__review-item"
                                                                         key={index}>
                                                                        <div className="kt-wizard-v2__review-title">
                                                                            Pièce jointe Nº{index + 1}
                                                                        </div>
                                                                        <div className="kt-wizard-v2__review-content">
                                                                            <a href={`${appConfig.apiDomaine}${file.url}`}
                                                                               download={true} target={"_blank"}>
                                                                                {file.title}
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="kt-wizard-v2__review-item">
                                                                    <div className="kt-wizard-v2__review-title">
                                                                        Pas de pièce jointe
                                                                    </div>
                                                                </div>
                                                            )
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            localStorage.getItem('page') === "claimAssign" ? (
                                                <div className="kt-wizard-v2__content"
                                                     data-ktwizard-type="step-content">
                                                    <div className="kt-heading kt-heading--md">Les doublons possibles
                                                        pour la
                                                        plainte
                                                    </div>
                                                    <div className="kt-form__section kt-form__section--first">
                                                        <div className="kt-wizard-v2__review">
                                                            {
                                                                !claim ? "" : (
                                                                    claim.duplicates.length ? (
                                                                        claim.duplicates.map((newClaim, index) => (
                                                                            <div className="kt-wizard-v2__review-item"
                                                                                 key={index}>
                                                                                <div
                                                                                    className="kt-wizard-v2__review-content">
                                                                                    <div
                                                                                        className="kt-widget kt-widget--user-profile-3">
                                                                                        <div className="kt-widget__top">
                                                                                            <div
                                                                                                className="kt-widget__content"
                                                                                                style={{paddingLeft: "0px"}}>
                                                                                                <div
                                                                                                    className="kt-widget__head">
                                                                                                    <div
                                                                                                        className="kt-wizard-v2__review-title">Doublon
                                                                                                        Nº{index + 1}</div>
                                                                                                    {
                                                                                                        verifyPermission(props.userPermissions, "merge-claim-awaiting-assignment") ? (
                                                                                                            <div
                                                                                                                className="kt-widget__action">
                                                                                                                <button
                                                                                                                    type="button"
                                                                                                                    className="btn btn-brand btn-sm btn-upper"
                                                                                                                    onClick={() => onClickFusionButton(newClaim)}>Fusioner
                                                                                                                </button>
                                                                                                            </div>
                                                                                                        ) : ""
                                                                                                    }
                                                                                                </div>

                                                                                                <div
                                                                                                    className="kt-widget__subhead">
                                                                                                    <a href="#fullname"
                                                                                                       onClick={e => e.preventDefault()}><i
                                                                                                        className="flaticon2-calendar-3"/>{`${newClaim.claimer.lastname} ${newClaim.claimer.firstname}`}
                                                                                                    </a>
                                                                                                    <a href="#datetime"
                                                                                                       onClick={e => e.preventDefault()}><i
                                                                                                        className="flaticon2-time"/>{newClaim.created_at}
                                                                                                    </a>
                                                                                                </div>

                                                                                                <div
                                                                                                    className="kt-widget__info">
                                                                                                    <div
                                                                                                        className="kt-widget__desc">
                                                                                                        {newClaim.description}
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="kt-widget__progress">
                                                                                                        <div
                                                                                                            className="kt-widget__text">
                                                                                                            Pourcentage
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="progress"
                                                                                                            style={{
                                                                                                                height: "5px",
                                                                                                                width: newClaim.duplicate_percent + "%"
                                                                                                            }}>
                                                                                                            <div
                                                                                                                className="progress-bar kt-bg-danger"
                                                                                                                role="progressbar"
                                                                                                                style={{width: "46%"}}
                                                                                                                aria-valuenow="35"
                                                                                                                aria-valuemin="0"
                                                                                                                aria-valuemax="100"/>
                                                                                                        </div>
                                                                                                        <div
                                                                                                            className="kt-widget__stats">
                                                                                                            {newClaim.duplicate_percent}%
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div className="kt-wizard-v2__review-item">
                                                                            <div className="kt-wizard-v2__review-title">
                                                                                Pas de doublon
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )
                                                            }

                                                        </div>
                                                    </div>
                                                </div>
                                            ) : ""
                                        }

                                        {
                                            (localStorage.getItem("page") === "SatisfactionMeasure" && verifyPermission(props.userPermissions, "update-claim-satisfaction-measured")) ||
                                            (localStorage.getItem("page") === "ClaimsArchived" && verifyPermission(props.userPermissions, "show-claim-archived")) ? (

                                                <div className="kt-wizard-v2__content"
                                                     data-ktwizard-type="step-content">
                                                    <div className="kt-heading kt-heading--md">Information sur la
                                                        Traitement Effectué
                                                    </div>
                                                    <div className="kt-form__section kt-form__section--first">
                                                        <div className="kt-wizard-v2__review">
                                                            <div className="kt-wizard-v2__review-item">
                                                                <div className="kt-wizard-v2__review-title">
                                                                    Le Staff
                                                                </div>
                                                                {
                                                                    !claim ? "" : (
                                                                        <div className="kt-wizard-v2__review-content">
                                                                            Nom du traitant: <span
                                                                            className="mx-2">{claim.completed_by ? claim.completed_by.identite.lastname + "" + claim.completed_by.identite.firstname : "Pas de traitant"}</span><br/>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                            <div className="kt-wizard-v2__review-item">
                                                                <div className="kt-wizard-v2__review-title">
                                                                    Unité du traitant
                                                                </div>
                                                                {
                                                                    !claim ? "" : (
                                                                        <div className="kt-wizard-v2__review-content">
                                                                            Nom de l'unité: <span
                                                                            className="mx-2">{claim.completed_by.unit.name["fr"]}</span><br/>
                                                                            Solution Proposée:

                                                                            {/*Description de l'unité: <span*/}
                                                                            {/*className="mx-2">{claim.completed_by.unit.description["fr"]}</span><br/>*/}
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                            <div className="kt-wizard-v2__review-item">
                                                                <div className="kt-wizard-v2__review-title">
                                                                    Solution Communiquée
                                                                </div>
                                                                {
                                                                    !claim ? "" : (
                                                                        <div className="kt-wizard-v2__review-content">
                                                                            {/*<strong>Description:</strong>*/}
                                                                            <span className="mx-2">
                                                                                {claim.active_treatment.solution_communicated}
                                                                            </span><br/>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                            {
                                                                (localStorage.getItem("page") === "ClaimsArchived" && verifyPermission(props.userPermissions, "show-claim-archived")) ? (
                                                                    <div className="kt-wizard-v2__review-item">
                                                                        <div className="kt-wizard-v2__review-title">
                                                                            Mesure de Satisfaction
                                                                        </div>
                                                                        {
                                                                            !claim ? "" : (
                                                                                <div
                                                                                    className="kt-wizard-v2__review-content">
                                                                                    {
                                                                                        claim.active_treatment.is_claimer_satisfied === 1 ?
                                                                                            <span className="mx-2">
                                                                                                Le Client <strong>est satisfait</strong> de la soltion communiquée
                                                                                            </span>
                                                                                            :
                                                                                            <span className="mx-2">
                                                                                                Le Client <strong>n'est pas satisfait</strong>  de la soltion communiquée
                                                                                            </span>
                                                                                    }
                                                                                    <br/>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </div>
                                                                ) : ""
                                                            }

                                                        </div>
                                                    </div>
                                                </div>
                                            ) : ""
                                        }

                                        {
                                            localStorage.getItem('page') === "ClaimListPage" ? (
                                                <div className="kt-wizard-v2__content"
                                                     data-ktwizard-type="step-content">
                                                    <div className="kt-heading kt-heading--md">Les commentaires</div>
                                                    <div className="kt-grid__item kt-grid__item--fluid kt-app__content"
                                                         id="kt_chat_content">
                                                        <div className="kt-chat">
                                                            <div className="kt-portlet__body" style={{padding: "0"}}>
                                                                <div className="kt-scroll kt-scroll--pull"
                                                                     data-mobile-height="300">
                                                                    <div className="kt-chat__messages">
                                                                        <div className="kt-chat__message">
                                                                            <div className="kt-chat__user">
                                                                        <span
                                                                            className="kt-media kt-media--circle kt-media--sm">
                                                                            <img src="/assets/media/users/100_12.jpg"
                                                                                 alt="image"/>
                                                                        </span>
                                                                                <span className="kt-chat__username">Jason Muller</span>
                                                                                <span className="kt-chat__datetime">2 Hours</span>
                                                                            </div>
                                                                            <div
                                                                                className="kt-chat__text kt-bg-light-success">
                                                                                How likely are you to recommend our
                                                                                company <br/>to your friends and family?
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="kt-chat__message kt-chat__message--right">
                                                                            <div className="kt-chat__user">
                                                                                <span className="kt-chat__datetime">30 Seconds</span>
                                                                                <span
                                                                                    className="kt-chat__username">You</span>
                                                                                <span
                                                                                    className="kt-media kt-media--circle kt-media--sm">
                                                                            <img src="/personal/img/default-avatar.png"
                                                                                 alt="image"/>
                                                                        </span>
                                                                            </div>
                                                                            <div
                                                                                className="kt-chat__text kt-bg-light-brand">
                                                                                Hey there, we’re just writing to let you
                                                                                know <br/>that you’ve been subscribed to
                                                                                a repository on GitHub.
                                                                            </div>
                                                                        </div>
                                                                        <div className="kt-chat__message">
                                                                            <div className="kt-chat__user">
                                                                        <span
                                                                            className="kt-media kt-media--circle kt-media--sm">
                                                                            <img src="/assets/media/users/100_12.jpg"
                                                                                 alt="image"/>
                                                                        </span>
                                                                                <span className="kt-chat__username">Jason Muller</span>
                                                                                <span className="kt-chat__datetime">30 Seconds</span>
                                                                            </div>
                                                                            <div
                                                                                className="kt-chat__text kt-bg-light-success">
                                                                                Ok, Understood!
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="kt-chat__message kt-chat__message--right">
                                                                            <div className="kt-chat__user">
                                                                                <span className="kt-chat__datetime">Just Now</span>
                                                                                <span
                                                                                    className="kt-chat__username">You</span>
                                                                                <span
                                                                                    className="kt-media kt-media--circle kt-media--sm">
                                                                            <img src="/personal/img/default-avatar.png"
                                                                                 alt="image"/>
                                                                        </span>
                                                                            </div>
                                                                            <div
                                                                                className="kt-chat__text kt-bg-light-brand">
                                                                                You’ll receive notifications for all
                                                                                issues, pull requests!
                                                                            </div>
                                                                        </div>
                                                                        <div className="kt-chat__message">
                                                                            <div className="kt-chat__user">
                                                                        <span
                                                                            className="kt-media kt-media--circle kt-media--sm">
                                                                            <img src="/assets/media/users/100_12.jpg"
                                                                                 alt="image"/>
                                                                        </span>
                                                                                <span className="kt-chat__username">Jason Muller</span>
                                                                                <span className="kt-chat__datetime">2 Hours</span>
                                                                            </div>
                                                                            <div
                                                                                className="kt-chat__text kt-bg-light-success">
                                                                                You were automatically <b
                                                                                className="kt-font-brand">subscribed</b>
                                                                                <br/>because you’ve been given access to
                                                                                the repository
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="kt-chat__message kt-chat__message--right">
                                                                            <div className="kt-chat__user">
                                                                                <span className="kt-chat__datetime">30 Seconds</span>
                                                                                <span
                                                                                    className="kt-chat__username">You</span>
                                                                                <span
                                                                                    className="kt-media kt-media--circle kt-media--sm">
                                                                            <img src="/personal/img/default-avatar.png"
                                                                                 alt="image"/>
                                                                        </span>
                                                                            </div>
                                                                            <div
                                                                                className="kt-chat__text kt-bg-light-brand">
                                                                                You can unwatch this repository
                                                                                immediately <br/>by clicking here: <a
                                                                                href="#"
                                                                                className="kt-font-bold kt-link">https://github.com</a>
                                                                            </div>
                                                                        </div>
                                                                        <div className="kt-chat__message">
                                                                            <div className="kt-chat__user">
                                                                        <span
                                                                            className="kt-media kt-media--circle kt-media--sm">
                                                                            <img src="/assets/media/users/100_12.jpg"
                                                                                 alt="image"/>
                                                                        </span>
                                                                                <span className="kt-chat__username">Jason Muller</span>
                                                                                <span className="kt-chat__datetime">30 Seconds</span>
                                                                            </div>
                                                                            <div
                                                                                className="kt-chat__text kt-bg-light-success">
                                                                                Discover what students who viewed Learn
                                                                                Figma - UI/UX Design <br/>Essential
                                                                                Training also viewed
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="kt-chat__message kt-chat__message--right">
                                                                            <div className="kt-chat__user">
                                                                                <span className="kt-chat__datetime">Just Now</span>
                                                                                <span
                                                                                    className="kt-chat__username">You</span>
                                                                                <span
                                                                                    className="kt-media kt-media--circle kt-media--sm">
                                                                            <img src="/personal/img/default-avatar.png"
                                                                                 alt="image"/>
                                                                        </span>
                                                                            </div>
                                                                            <div
                                                                                className="kt-chat__text kt-bg-light-brand">
                                                                                Most purchased Business courses during
                                                                                this sale!
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="kt-portlet__foot" style={{padding: "0"}}>
                                                                <div className="kt-chat__input">
                                                                    <div className="kt-chat__editor">
                                                                        <textarea style={{height: "50px"}}
                                                                                  placeholder="Votre commentaire..."/>
                                                                    </div>
                                                                    <div className="kt-chat__toolbar">
                                                                        <div className="kt_chat__actions">
                                                                            <button type="button"
                                                                                    className="btn btn-brand btn-md btn-upper btn-bold kt-chat__reply">Ajouter
                                                                                un commentaire
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : ""
                                        }

                                        {
                                            localStorage.getItem('page') === "claimAssign" ? (
                                                <div className="kt-wizard-v2__content"
                                                     data-ktwizard-type="step-content">
                                                    <div className="kt-heading kt-heading--md">Transfert de la plainte
                                                    </div>
                                                    <div className="kt-form__section kt-form__section--first">
                                                        <div className="kt-wizard-v2__review">
                                                            {
                                                                verifyPermission(props.userPermissions, "transfer-claim-to-targeted-institution") ?
                                                                    <div className="kt-wizard-v2__review-item">
                                                                        <div className="kt-wizard-v2__review-content"
                                                                             style={{fontSize: "15px"}}>
                                                                            <label
                                                                                className="col-xl-6 col-lg-6 col-form-label">Institution
                                                                                concernée</label>
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
                                                                    : ""
                                                            }
                                                            {
                                                                (verifyPermission(props.userPermissions, "transfer-claim-to-circuit-unit") ||
                                                                    verifyPermission(props.userPermissions, "transfer-claim-to-unit")) ?
                                                                    <div className="kt-wizard-v2__review-item">
                                                                        <div className="kt-wizard-v2__review-title">
                                                                            Tranferer à une unité
                                                                        </div>
                                                                        <div className="kt-wizard-v2__review-content">
                                                                            <div className="form-group">
                                                                                <label>Unité</label>
                                                                                <Select
                                                                                    value={unit}
                                                                                    onChange={onChangeUnits}
                                                                                    options={unitsData}
                                                                                />
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
                                                                    : ""
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : ""
                                        }

                                        {
                                            props.lead && localStorage.getItem('page') === "ClaimListPage" ? (
                                                <div className="kt-wizard-v2__content"
                                                     data-ktwizard-type="step-content">
                                                    <div className="kt-heading kt-heading--md">Affectation de la
                                                        plainte
                                                    </div>
                                                    <div className="kt-form__section kt-form__section--first">
                                                        <div className="kt-wizard-v2__review">
                                                            <div className="kt-wizard-v2__review-content">
                                                                <div
                                                                    className={errors.length ? "form-group validated" : "form-group"}>
                                                                    <label>Agent</label>
                                                                    <Select
                                                                        isClearable
                                                                        placeholder={"Veillez selectioner l'agent"}
                                                                        value={staff}
                                                                        onChange={onChangeStaff}
                                                                        options={staffs}
                                                                    />
                                                                    {
                                                                        errors.map((error, index) => (
                                                                            <div key={index}
                                                                                 className="invalid-feedback">
                                                                                {error}
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </div>
                                                                <div
                                                                    className="form-group d-flex justify-content-between">
                                                                    {
                                                                        !startRequest ? (
                                                                            <button className="btn btn-primary"
                                                                                    onClick={assignClaim}>Affecter la
                                                                                plainte</button>
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
                                                    </div>
                                                </div>
                                            ) : null
                                        }

                                        {
                                            localStorage.getItem('page') === "ClaimToStaffPage" && verifyPermission(props.userPermissions, "show-claim-assignment-to-staff") ? (
                                                    <div className="kt-wizard-v2__content"
                                                         data-ktwizard-type="step-content">
                                                        <div className="kt-heading kt-heading--md">Traitement de la
                                                            plainte
                                                        </div>
                                                        <div className="kt-form__section kt-form__section--first">
                                                            <div className="kt-wizard-v2__review">
                                                                <div className="kt-wizard-v2__review-content">

                                                                    <TreatmentForm
                                                                        getId={`${id}`}
                                                                    />

                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                )
                                                : ""
                                        }

                                        {
                                            localStorage.getItem("page") === "SatisfactionMeasure" && verifyPermission(props.userPermissions, "update-claim-satisfaction-measured") ? (
                                                <div className="kt-wizard-v2__content"
                                                     data-ktwizard-type="step-content">
                                                    <div className="kt-heading kt-heading--md">Mesure de Satisfaction
                                                    </div>
                                                    <div className="kt-form__section kt-form__section--first">
                                                        <div className="kt-wizard-v2__review">
                                                            <div className="kt-wizard-v2__review-content">

                                                                <ReasonSatisfaction
                                                                    getId={`${id}`}
                                                                />

                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            ) : ""
                                        }

                                        {
                                            localStorage.getItem("page") === "ClaimToValidatedListPage" && verifyPermission(props.userPermissions, validation[props.plan].permission) ? (
                                                <div className="kt-wizard-v2__content"
                                                     data-ktwizard-type="step-content">
                                                    <div className="kt-heading kt-heading--md">Validation de la
                                                        plainte
                                                    </div>
                                                    <div className="kt-form__section kt-form__section--first">
                                                        <div className="kt-wizard-v2__review">
                                                            {
                                                                claim !== null ? (
                                                                    <div className="kt-wizard-v2__review-item">
                                                                        {
                                                                            claim.active_treatment.solved_at !== null ? (
                                                                                <>
                                                                                    <div
                                                                                        className="kt-wizard-v2__review-title">
                                                                                        Traitement
                                                                                    </div>
                                                                                    <div
                                                                                        className="kt-wizard-2__veriew-content">
                                                                                        <div
                                                                                            className="kt-widget kt-widget--user-profile-3">
                                                                                            <div
                                                                                                className="kt-widget__top">
                                                                                                <div
                                                                                                    className="kt-widget__media kt-hidden-">
                                                                                                    <img
                                                                                                        src="/assets/media/users/100_13.jpg"
                                                                                                        alt="image"/>
                                                                                                </div>
                                                                                                <div
                                                                                                    className="kt-widget__pic kt-widget__pic--danger kt-font-danger kt-font-boldest kt-font-light kt-hidden">
                                                                                                    JM
                                                                                                </div>
                                                                                                <div className="kt-widget__content">
                                                                                                    <div className="kt-widget__head">
                                                                                                        <span className="kt-widget__username">
                                                                                                            Traiter par {claim.active_treatment.responsible_staff.identite.lastname+" "+claim.active_treatment.responsible_staff.identite.firstname}
                                                                                                            <i className="flaticon2-correct"/>
                                                                                                        </span>
                                                                                                        <div
                                                                                                            className="kt-widget__action">
                                                                                                            <button
                                                                                                                type="button"
                                                                                                                className="btn btn-label-success btn-sm btn-upper"
                                                                                                                onClick={() => showReasonInput("validateReject")}>
                                                                                                                Rejeter
                                                                                                            </button>
                                                                                                            &nbsp;
                                                                                                            <button
                                                                                                                type="button"
                                                                                                                className="btn btn-brand btn-sm btn-upper"
                                                                                                                onClick={() => showReasonInput("validateSolution")}>
                                                                                                                Valider
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="kt-widget__subhead">
                                                                                                        <a href={"#info"}
                                                                                                           onClick={(e) => e.preventDefault()}
                                                                                                           style={{cursor: "text"}}>
                                                                                                            <i className="flaticon2-new-email"/>
                                                                                                            {
                                                                                                                claim.active_treatment.responsible_staff.identite.email.map(
                                                                                                                    (mail, index) => index !== claim.active_treatment.responsible_staff.identite.email.length - 1
                                                                                                                        ? mail+"/"
                                                                                                                        : mail+""
                                                                                                                )
                                                                                                            }
                                                                                                        </a>
                                                                                                        <a href={"#info"}
                                                                                                           onClick={(e) => e.preventDefault()}
                                                                                                           style={{cursor: "text"}}>
                                                                                                            <i className="flaticon2-calendar-2"/>
                                                                                                            Traiter
                                                                                                            le {claim.active_treatment.solved_at}
                                                                                                        </a>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="kt-widget__info">
                                                                                                        <div
                                                                                                            className="kt-widget__desc">
                                                                                                            <strong
                                                                                                                className="mr-2">Solution: </strong>
                                                                                                            {claim.active_treatment.solution}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    {
                                                                                                        claim.active_treatment.preventive_measures ? (
                                                                                                            <div
                                                                                                                className="kt-widget__info">
                                                                                                                <div
                                                                                                                    className="kt-widget__desc">
                                                                                                                    <strong
                                                                                                                        className="mr-2">Mésures
                                                                                                                        préventive: </strong>
                                                                                                                    {claim.active_treatment.preventive_measures}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        ) : ""
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            ) : ""
                                                                        }

                                                                        {
                                                                            claim.active_treatment.declared_unfounded_at !== null ? (
                                                                                <>
                                                                                    <div
                                                                                        className="kt-wizard-v2__review-title">
                                                                                        Non fondée
                                                                                    </div>
                                                                                    <div
                                                                                        className="kt-wizard-2__veriew-content">
                                                                                        <div
                                                                                            className="kt-widget kt-widget--user-profile-3">
                                                                                            <div
                                                                                                className="kt-widget__top">
                                                                                                <div
                                                                                                    className="kt-widget__media kt-hidden-">
                                                                                                    <img
                                                                                                        src="/assets/media/users/100_13.jpg"
                                                                                                        alt="image"/>
                                                                                                </div>
                                                                                                <div
                                                                                                    className="kt-widget__pic kt-widget__pic--danger kt-font-danger kt-font-boldest kt-font-light kt-hidden">
                                                                                                    JM
                                                                                                </div>
                                                                                                <div className="kt-widget__content">
                                                                                                    <div className="kt-widget__head">
                                                                                                        <span className="kt-widget__username">
                                                                                                            Traiter par {claim.active_treatment.responsible_staff.identite.lastname+" "+claim.active_treatment.responsible_staff.identite.firstname}
                                                                                                            <i className="flaticon2-correct"/>
                                                                                                        </span>
                                                                                                        <div className="kt-widget__action">
                                                                                                            <button type="button" className="btn btn-label-success btn-sm btn-upper" onClick={() => showReasonInput("validateReject")}>
                                                                                                                Rejeter
                                                                                                            </button>
                                                                                                            &nbsp;
                                                                                                            <button type="button" className="btn btn-brand btn-sm btn-upper" onClick={() => showReasonInput("validateSolution")}>
                                                                                                                Valider
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="kt-widget__subhead">
                                                                                                        <a href={"#info"}
                                                                                                           onClick={(e) => e.preventDefault()}
                                                                                                           style={{cursor: "text"}}>
                                                                                                            <i className="flaticon2-new-email"/>
                                                                                                            {
                                                                                                                claim.active_treatment.responsible_staff.identite.email.map(
                                                                                                                    (mail, index) => index !== claim.active_treatment.responsible_staff.identite.email.length - 1
                                                                                                                        ? mail+"/"
                                                                                                                        : mail+""
                                                                                                                )
                                                                                                            }
                                                                                                        </a>
                                                                                                        <a href={"#info"}
                                                                                                           onClick={(e) => e.preventDefault()}
                                                                                                           style={{cursor: "text"}}>
                                                                                                            <i className="flaticon2-calendar-2"/>
                                                                                                            Rejeter le {moment(claim.active_treatment.declared_unfounded_at).format('DD MMMM YYYY')} à {moment(claim.active_treatment.declared_unfounded_at).format('HH')}h{moment(claim.active_treatment.declared_unfounded_at).format('mm')}min
                                                                                                        </a>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="kt-widget__info">
                                                                                                        <div
                                                                                                            className="kt-widget__desc">
                                                                                                            <strong
                                                                                                                className="mr-2">Raison: </strong>
                                                                                                            {claim.active_treatment.unfounded_reason}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            ) : ""
                                                                        }
                                                                        <button id={"reason-modal"}
                                                                                style={{display: "none"}} type="button"
                                                                                className="btn btn-bold btn-label-brand btn-sm"
                                                                                data-toggle="modal"
                                                                                data-target="#kt_modal_4_2"/>
                                                                    </div>
                                                                ) : ""
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : ""
                                        }

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
                                        showReason ? (
                                            <ReasonModal
                                                plan={props.plan}
                                                id={id}
                                                action={action}
                                                reasonTitle={reasonTitle}
                                                reasonLabel={reasonLabel}
                                                onClose={() => setShowReason(false)}
                                            />
                                        ) : ""
                                    }

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
                                                    ) : ""
                                                }
                                            </div>
                                        ) : ""
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : ""
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        lead: state.user.user.staff.is_lead,
        plan: state.plan.plan,
    };
};

export default connect(mapStateToProps)(ClaimAssignDetail);
