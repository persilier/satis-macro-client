import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    useParams,
    Link
} from "react-router-dom";
import {connect} from "react-redux";
import {loadCss, loadScript} from "../../helpers/function";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import {AUTH_TOKEN} from "../../constants/token";
import UnfoundedModal from "../components/UnfoundedModal";
import TreatmentForm from "../components/TreatmentForm";
import ClientButtonDetail from "../components/ClientButtonDetail";
import ClaimButtonDetail from "../components/ClaimButtonDetail";
import AttachmentsButtonDetail from "../components/AttachmentsButtonDetail";
import ClientButton from "../components/ClientButton";
import ClaimButton from "../components/ClaimButton";
import AttachmentsButton from "../components/AttachmentsButton";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
loadCss("/assets/css/pages/wizard/wizard-2.css");
loadScript("/assets/js/pages/custom/wizard/wizard-2.js");
loadScript("/assets/js/pages/custom/chat/chat.js");


const ClaimAssignToStaffDetail = (props) => {
    document.title = "Satis client - Détail réclamation";
    const {id} = useParams();

    if (!verifyPermission(props.userPermissions, "show-claim-assignment-to-staff"))
        window.location.href = ERROR_401;

    const [claim, setClaim] = useState(null);

    useEffect(() => {
        async function fetchData() {
            await axios.get(`${appConfig.apiDomaine}/claim-assignment-staff/${id}`)
                .then(response => {
                    setClaim(response.data);
                })
                .catch(error => console.log("Something is wrong"));
        }

        fetchData();
    }, []);

    return (
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
                                    <Link to="/process/claim-assign/to-staff" className="kt-subheader__breadcrumbs-link">
                                        Réclamations à traitrer
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
                                    {claim?claim.reference: 'Detail'}
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
                                                        <i className="flaticon-clipboard"/>
                                                    </div>
                                                    <div className="kt-wizard-v2__nav-label">
                                                        <div className="kt-wizard-v2__nav-label-title">
                                                            Traitement de la réclamtion
                                                        </div>
                                                        <div className="kt-wizard-v2__nav-label-desc">
                                                            Procédez au traitement de la réclamation
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="kt-grid__item kt-grid__item--fluid kt-wizard-v2__wrapper">
                                    <form className="kt-form" id="kt_form">
                                        <div className="d-flex justify-content-end">
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

                                        <ClientButtonDetail claim={claim}/>

                                        <ClaimButtonDetail claim={claim}/>

                                        <AttachmentsButtonDetail claim={claim}/>

                                        <div className="kt-wizard-v2__content"
                                             data-ktwizard-type="step-content">
                                            <div className="kt-heading kt-heading--md">Traitement de la
                                                réclamation
                                            </div>
                                            {
                                                claim ? (
                                                    claim.active_treatment ? (
                                                        claim.active_treatment.validated_at && claim.active_treatment.invalidated_reason ? (
                                                            <div className="kt-wizard-v2__review-item mb-4">
                                                                <div className="kt-wizard-v2__review-title">
                                                                    <h5><strong className="text-danger">Traitement rejeté</strong></h5>
                                                                </div>
                                                                <div className="kt-wizard-v2__review-content">
                                                                    <strong>Motif</strong>: <span className="mx-2">{claim.active_treatment.invalidated_reason ? claim.active_treatment.invalidated_reason : "Pas de raison"}</span><br/>
                                                                    <hr/>
                                                                </div>
                                                            </div>
                                                        ) : null
                                                    ) : null
                                                ) : null
                                            }
                                            <div className="kt-form__section kt-form__section--first">
                                                <div className="kt-wizard-v2__review">
                                                    <div className="kt-wizard-v2__review-content">
                                                        {console.log(claim ,"claim_treatment" )}
                                                        {
                                                            claim ? (
                                                                <TreatmentForm
                                                                    amount_disputed={claim?claim.amount_disputed:null}
                                                                    activeTreatment={
                                                                        claim.active_treatment ? (
                                                                            claim.active_treatment
                                                                        ) : null
                                                                    }
                                                                    getId={`${id}`}
                                                                />
                                                            ) : (
                                                                <TreatmentForm
                                                                    amount_disputed={claim?claim.amount_disputed:null}
                                                                    getId={`${id}`}
                                                                />
                                                            )
                                                        }
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
        ) : null
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        lead: state.user.user.staff.is_lead,
        plan: state.plan.plan,
    };
};

export default connect(mapStateToProps)(ClaimAssignToStaffDetail);
