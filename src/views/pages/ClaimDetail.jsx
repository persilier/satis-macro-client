import React, {useEffect, useState, useRef} from "react";
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
import ClientButton from "../components/ClientButton";
import ClaimButton from "../components/ClaimButton";
import AttachmentsButton from "../components/AttachmentsButton";
import ClientButtonDetail from "../components/ClientButtonDetail";
import ClaimButtonDetail from "../components/ClaimButtonDetail";
import AttachmentsButtonDetail from "../components/AttachmentsButtonDetail";
import TreatmentButtonDetail from "../components/TreatmentButtonDetail";
import {verifyTokenExpire} from "../../middleware/verifyToken";
import RelaunchModal from "../components/RelaunchModal";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
loadCss("/assets/css/pages/wizard/wizard-2.css");
loadScript("/assets/js/pages/custom/wizard/wizard-2.js");
loadScript("/assets/js/pages/custom/chat/chat.js");

const ClaimDetail = (props) => {
    document.title = "Satis client - Détail plainte";
    const {id} = useParams();
    const ref = useRef(null);

    const [claim, setClaim] = useState(null);

    if (!(verifyPermission(props.userPermissions, 'search-claim-any-reference') ||
        verifyPermission(props.userPermissions, "search-claim-my-reference")))
        window.location.href = ERROR_401;

    useEffect(() => {
        var endpoint = "";
        if (verifyPermission(props.userPermissions, 'search-claim-any-reference'))
            endpoint = `${appConfig.apiDomaine}/any/search-claim/${id}`;
        if (verifyPermission(props.userPermissions, 'search-claim-my-reference'))
            endpoint = `${appConfig.apiDomaine}/my/search-claim/${id}`;
        async function fetchData() {
            await axios.get(endpoint)
                .then(response => {
                    console.log("id:", id);
                    console.log("response:", response);
                    setClaim(response.data[0]);
                })
                .catch(error => console.log("Something is wrong"))
            ;
        }

        if (verifyTokenExpire())
            fetchData();
    }, []);

    return (
        verifyPermission(props.userPermissions, "search-claim-any-reference") ||
        verifyPermission(props.userPermissions, "search-claim-my-reference") ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid "/>
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
                                        </div>
                                    </div>
                                </div>

                                <div className="kt-grid__item kt-grid__item--fluid kt-wizard-v2__wrapper">
                                    <form className="kt-form" id="kt_form">
                                        <div className="d-flex justify-content-md-end">
                                            {verifyPermission(props.userPermissions, 'revive-staff') && (
                                                <button onClick={() => {ref.current.click()}} type="button" className="btn btn-outline-warning btn-sm">
                                                    Relancer
                                                </button>
                                            )}
                                            <button ref={ref} type="button" data-keyboard="false" data-backdrop="static" data-toggle="modal" data-target="#kt_modal_4" className="d-none btn btn-outline-warning btn-sm">
                                                Relancer
                                            </button>

                                            <RelaunchModal id={claim ? claim.id : ''} onClose={() => {}}/>
                                        </div>
                                        <ClientButtonDetail claim={claim}/>

                                        <ClaimButtonDetail claim={claim}/>

                                        <AttachmentsButtonDetail claim={claim}/>

                                        <TreatmentButtonDetail archive={true} claim={claim}/>

                                        <div className="kt-form__actions">
                                            <button
                                                className="btn btn-secondary btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u"
                                                data-ktwizard-type="action-prev">
                                                PRÉCÉDENT
                                            </button>

                                            <button
                                                className="btn btn-brand btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u"
                                                data-ktwizard-type="action-next">
                                                SUIVANT
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

export default connect(mapStateToProps)(ClaimDetail);
