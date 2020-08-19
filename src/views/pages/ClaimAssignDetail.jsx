import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    useParams,
    Link
} from "react-router-dom";
import {connect} from "react-redux";
import Select from "react-select";
import {formatSelectOption, formatToTimeStampUpdate, loadCss, loadScript} from "../../helpers/function";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import {AUTH_TOKEN} from "../../constants/token";
import Loader from "../components/Loader";
import FusionClaim from "../components/FusionClaim";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig
} from "../../config/toastConfig";

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

    if (!verifyPermission(props.userPermissions, "show-claim-awaiting-assignment"))
        window.location.href = ERROR_401;

    let endPoint = endPointConfig[props.plan];

    const [claim, setClaim] = useState(null);
    const [copyClaim, setCopyClaim] = useState(null);
    const [dataId, setDataId] = useState("");
    const [data, setData] = useState({unit_id: ""});
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
                    setStartRequestToUnit(false);
                    ToastBottomEnd.fire(toastAddErrorMessageConfig)
                })
            ;
        }

        fetchData()
    };

    const onChangeUnits = (selected) => {
        const newData = {...data};
        newData.unit_id = selected ? selected.value : "";
        setUnit(selected);
        setData(newData)
    };

    const onClickFusionButton = async (newClaim) => {
        await setCopyClaim(newClaim);
        document.getElementById(`modal-button`).click();
    };

    return (
        verifyPermission(props.userPermissions, "show-claim-awaiting-assignment") ? (
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
                                    <a href="#icone" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
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
                                            <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step"
                                                 data-ktwizard-state="current">
                                                <div className="kt-wizard-v2__nav-body">
                                                    <div className="kt-wizard-v2__nav-icon">
                                                        <i className="flaticon-user-settings"/>
                                                    </div>
                                                    <div className="kt-wizard-v2__nav-label">
                                                        <div className="kt-wizard-v2__nav-label-title">
                                                            Client
                                                        </div>
                                                        <div className="kt-wizard-v2__nav-label-desc">
                                                            Acceder aux détails du client
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
                                                            Réclamation
                                                        </div>
                                                        <div className="kt-wizard-v2__nav-label-desc">
                                                            Acceder aux détails de la réclamation
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
                                                            Pièces jointe
                                                            {
                                                                !claim ? "" : (
                                                                    <span
                                                                        className="mx-lg-4 kt-badge kt-badge--success  kt-badge--inline kt-badge--pill">{claim.files.length}</span>
                                                                )
                                                            }
                                                        </div>
                                                        <div className="kt-wizard-v2__nav-label-desc">
                                                            Acceder à la liste des pièces jointes
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
                                                <div className="kt-wizard-v2__nav-body">
                                                    <div className="kt-wizard-v2__nav-icon">
                                                        <i className="flaticon2-copy"/>
                                                    </div>
                                                    <div className="kt-wizard-v2__nav-label">
                                                        <div className="kt-wizard-v2__nav-label-title">
                                                            Doublons
                                                            {
                                                                !claim ? "" : (
                                                                    <span
                                                                        className="mx-lg-4 kt-badge kt-badge--success  kt-badge--inline kt-badge--pill">{claim.duplicates.length}</span>
                                                                )
                                                            }
                                                        </div>
                                                        <div className="kt-wizard-v2__nav-label-desc">
                                                            Acceder à la liste des doublons
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

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

                                        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content"
                                             data-ktwizard-state="current">
                                            <div className="kt-heading kt-heading--md">Détails du client</div>
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
                                            <div className="kt-heading kt-heading--md"><strong>Détails de la réclamation</strong></div>
                                            <div className="kt-form__section kt-form__section--first">
                                                <div className="kt-wizard-v2__review">
                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-wizard-v2__review-title">
                                                           <h5><strong>Canaux</strong></h5>
                                                        </div>
                                                        {
                                                            !claim ? "" : (
                                                                <div className="kt-wizard-v2__review-content">
                                                                    <strong>Canal de réception:</strong> <span
                                                                    className="mx-2">{claim.request_channel ? claim.request_channel.name["fr"] : "Pas de canal de réception"}</span><br/>
                                                                    <strong>Canal de réponse préférentiel:</strong> <span
                                                                    className="mx-2">{claim.response_channel ? claim.response_channel.name["fr"] : "Pas de canal de réponse"}</span><br/>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-wizard-v2__review-title">
                                                            <h5><strong>Cible</strong></h5>
                                                        </div>
                                                        {
                                                            !claim ? "" : (
                                                                <div className="kt-wizard-v2__review-content">
                                                                    <strong>Institution</strong>: <span
                                                                    className="mx-2">{claim.institution_targeted.name} 1</span><br/>
                                                                    <strong>Unité</strong>: <span
                                                                    className="mx-2">{claim.unit_targeted ? claim.unit_targeted.name["fr"] : "Pas d'institution ciblé"}</span><br/>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-wizard-v2__review-title">
                                                            <h5><strong>Spécifications</strong></h5>
                                                        </div>
                                                        {
                                                            !claim ? "" : (
                                                                <div className="kt-wizard-v2__review-content">
                                                                    <strong>Objet</strong>: <span
                                                                    className="mx-2">{claim.claim_object.name["fr"]}</span><br/>
                                                                    <br/>
                                                                    <strong>Numéro de compte </strong>: <span
                                                                    className="mx-2">{claim.account_targeted ? claim.account_targeted.number : "Pas de compte cible"}</span><br/>
                                                                    <br/>
                                                                    <strong>Montant réclamé</strong>: <span
                                                                    className="mx-2">{claim.amount_disputed ? `${claim.amount_disputed} ${claim.amount_currency.name["fr"]}` : "Pas de montant"}</span><br/>
                                                                    <br/>
                                                                    <strong>Date de l'évernement</strong>: <span
                                                                    className="mx-2">{formatToTimeStampUpdate(claim.created_at)}</span><br/>
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
                                                                                Loading...
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
                                                                            isClearable
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
                                                                                Loading...
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
