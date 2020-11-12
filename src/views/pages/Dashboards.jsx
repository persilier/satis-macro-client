import React from 'react';
import InfirmationTable from "../components/InfirmationTable";
import DashboardClaimsAll from "../../APP_MACRO/Holding/DashboardClaimsAll";
import DashboardClaimsMy from "../components/DashboardForm/DashboardClaimsMy";
import DashboardClaimsUnit from "../components/DashboardForm/DashboardClaimsUnit";
import DashboardSummaryReport from "../components/DashboardForm/DashboardSummaryReport";
import DashboardStatClaim from "../components/DashboardForm/DashboardStatClaim";
import DashboardStatistic from "../components/DashboardForm/DashboardStatistic";
import GraphChannel from "../components/DashboardForm/GraphChannel";
import DashboardClaimsActivity from "../components/DashboardForm/DashboardClaimsActivity";
import ClaimToInstitution from "../components/DashboardForm/ClaimToInstitution";
import ClaimToPointOfServices from "../components/DashboardForm/ClaimToPointOfServices";
import {verifyPermission} from "../../helpers/permission";
import {connect} from "react-redux";


const Dashboards = (props) => {
    document.title = "Satis client - Dashboard";

    return (
        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            Tableau de bord
                        </h3>
                    </div>
                </div>
            </div>

            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                {/*<InfirmationTable information={"Représentation graphique des statiques des collectes et traitements des réclamations sur les 30 derniers jours"} />*/}
                <div>
                    <div className="kt-portlet">
                        <DashboardClaimsAll/>
                    </div>

                    <div className="kt-portlet">
                        <DashboardClaimsMy/>
                    </div>

                    <div className="kt-portlet">
                        <DashboardClaimsUnit/>
                    </div>

                    <div className="kt-portlet">
                        <DashboardClaimsActivity/>
                    </div>

                    <div>
                        <DashboardSummaryReport/>
                    </div>

                    <div>
                        <GraphChannel/>
                    </div>

                    <div>
                        <DashboardStatClaim/>
                    </div>

                    <div>
                        <DashboardStatistic/>
                    </div>

                    <div>
                        {
                            verifyPermission(props.userPermissions, "show-dashboard-data-all-institution") &&
                            (verifyPermission(props.userPermissions, "show-dashboard-data-my-institution")) ?
                                <div className="kt-portlet">
                                    <ClaimToInstitution/>
                                </div> : null
                        }
                        {
                            !verifyPermission(props.userPermissions, "show-dashboard-data-all-institution") &&
                            verifyPermission(props.userPermissions, "show-dashboard-data-my-institution") ?
                                <div className="kt-portlet">
                                    <ClaimToPointOfServices/>
                                </div> : null
                        }


                    </div>
                </div>

            </div>
        </div>

    );

};

const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(Dashboards);
