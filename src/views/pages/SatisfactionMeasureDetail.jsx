import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    useParams,
    Link
} from "react-router-dom";
import {connect} from "react-redux";
import {debug, loadCss, loadScript} from "../../helpers/function";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import {AUTH_TOKEN} from "../../constants/token";
import ReasonSatisfaction from "../components/ReasonSatisfaction";
import ClientButton from "../components/ClientButton";
import ClaimButton from "../components/ClaimButton";
import AttachmentsButton from "../components/AttachmentsButton";
import ClientButtonDetail from "../components/ClientButtonDetail";
import ClaimButtonDetail from "../components/ClaimButtonDetail";
import AttachmentsButtonDetail from "../components/AttachmentsButtonDetail";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
loadCss("/assets/css/pages/wizard/wizard-2.css");
loadScript("/assets/js/pages/custom/wizard/wizard-2.js");
loadScript("/assets/js/pages/custom/chat/chat.js");

const endPointConfig = {
    PRO: {
        plan: "PRO",
        edit: `${appConfig.apiDomaine}/my/claim-satisfaction-measured`,
    },
    MACRO: {
        holding: {
            edit: `${appConfig.apiDomaine}/my/claim-satisfaction-measured`,
        },
        filial: {
            edit: `${appConfig.apiDomaine}/my/claim-satisfaction-measured`,
        }
    },
    HUB: {
        plan: "HUB",
        edit: `${appConfig.apiDomaine}/any/claim-satisfaction-measured`,
    }
};


const SatisfactionMeasureDetail = (props) => {
    document.title = "Satis client - Détail plainte";
    const {id} = useParams();

    if (!(verifyPermission(props.userPermissions, 'update-satisfaction-measured-any-claim') ||
        verifyPermission(props.userPermissions, "update-satisfaction-measured-my-claim")))
        window.location.href = ERROR_401;

    let endPoint = "";
    if (props.plan === "MACRO") {
        if (verifyPermission(props.userPermissions, 'update-satisfaction-measured-my-claim'))
            endPoint = endPointConfig[props.plan].holding;
        else if (verifyPermission(props.userPermissions, 'update-satisfaction-measured-my-claim'))
            endPoint = endPointConfig[props.plan].filial
    } else
        endPoint = endPointConfig[props.plan];

    const [claim, setClaim] = useState(null);

    useEffect(() => {
        async function fetchData() {
            await axios.get(endPoint.edit + `/${id}`)
                .then(response => {
                    setClaim(response.data);
                })
                .catch(error => console.log("Something is wrong"));
        }

        fetchData();
    }, []);

    return (
        verifyPermission(props.userPermissions, "update-satisfaction-measured-my-claim") ||
        verifyPermission(props.userPermissions, "update-satisfaction-measured-my-claim") ? (
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
                                    <Link to="/process/claim_measure" className="kt-subheader__breadcrumbs-link">
                                        Mesure de Satisfaction
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
                                            <ClientButton/>

                                            <ClaimButton/>

                                            <AttachmentsButton claim={claim}/>

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
                                        </div>
                                    </div>
                                </div>

                                <div className="kt-grid__item kt-grid__item--fluid kt-wizard-v2__wrapper">
                                    <form className="kt-form" id="kt_form">
                                        <ClientButtonDetail claim={claim}/>

                                        <ClaimButtonDetail claim={claim}/>

                                        <AttachmentsButtonDetail claim={claim}/>

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
                                                                    className="mx-2">{claim.active_treatment.responsible_staff ? claim.active_treatment.responsible_staff.identite.lastname + "  " + claim.active_treatment.responsible_staff.identite.firstname : "Pas de traitant"}</span><br/>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="kt-wizard-v2__review-item">
                                                        <div className="kt-wizard-v2__review-title">
                                                            Unité du traitant
                                                        </div>
                                                        {/*{console.log(claim,'COMPLETED')}*/}
                                                        {
                                                            !claim ? "" : (
                                                                <div className="kt-wizard-v2__review-content">
                                                                   <strong>Nom de l'unité:</strong>  <span
                                                                    className="mx-2">{claim.active_treatment.responsible_staff.unit?claim.active_treatment.responsible_staff.unit.name.fr:""}</span><br/>
                                                                    <strong>Solution apportée:</strong> <span
                                                                    className="mx-2">
                                                                    {claim.active_treatment ? claim.active_treatment.solution : ""}
                                                                </span>
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
                                                                    <strong>Description:</strong> <span
                                                                    className="mx-2">{claim.active_treatment.solution_communicated}</span><br/>
                                                                    <br/>

                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="kt-wizard-v2__content"
                                             data-ktwizard-type="step-content">
                                            <div className="kt-heading kt-heading--md">Mesure de Satisfaction
                                            </div>
                                            <div className="kt-form__section kt-form__section--first">
                                                <div className="kt-wizard-v2__review">
                                                    <div className="kt-wizard-v2__review-content">

                                                        <ReasonSatisfaction
                                                            getId={`${id}`}
                                                            getEndPoint={endPoint.edit}
                                                        />

                                                    </div>
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

export default connect(mapStateToProps)(SatisfactionMeasureDetail);
