import React, {useEffect, useState} from 'react';
import InfirmationTable from "../components/InfirmationTable";
import DashboardClaimsAll from "../../APP_MACRO/Holding/DashboardClaimsAll";
import DashboardClaimsMy from "../components/DashboardForm/DashboardClaimsMy";
import DashboardClaimsUnit from "../components/DashboardForm/DashboardClaimsUnit";
import DashboardSummaryReport from "../components/DashboardForm/DashboardSummaryReport";
import DashboardStatClaim from "../components/DashboardForm/DashboardStatClaim";
import DashboardStatistic from "../components/DashboardForm/DashboardStatistic";
import GraphChannel from "../components/DashboardForm/GraphChannel";
import DashboardClaimsActivity from "../components/DashboardForm/DashboardClaimsActivity";


const Dashboards = () => {

    return (
        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            Dashboard
                        </h3>
                        <span className="kt-subheader__separator kt-hidden"/>
                        <div className="kt-subheader__breadcrumbs">
                            <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                className="flaticon2-shelter"/></a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="#button" onClick={e => e.preventDefault()}
                               className="kt-subheader__breadcrumbs-link">
                                Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                <InfirmationTable information={"A common UI paradigm to use with interactive tables is to present buttons that will trigger some action. See official documentation"}/>
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
                        <GraphChannel/>
                    </div>

                    <div>
                        <DashboardStatClaim/>
                    </div>

                    <div>
                        <DashboardSummaryReport/>
                    </div>

                    <div>
                        <DashboardStatistic/>
                    </div>
                </div>

            </div>
        </div>

    );

};

export default Dashboards;
