import React, {useEffect, useState} from 'react';
import axios from "axios";
// import InfirmationTable from "../components/InfirmationTable";
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
import appConfig from "../../config/appConfig";
import {verifyTokenExpire} from "../../middleware/verifyToken";
import LoadingTable from "../components/LoadingTable";


const Dashboards = (props) => {
    const [response, setResponse] = useState(null);
    document.title = "Satis client - Dashboard";

    useEffect(() => {
        async function fetchData() {
            await axios.get(appConfig.apiDomaine + "/dashboard")
                .then(response => {
                    setResponse(response);
                })
                .catch(error => console.log("Something is wrong"))
            ;
        }

        if (verifyTokenExpire())
            fetchData();
    }, []);

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
                {response ? (
                    <div>
                        {
                            verifyPermission(props.userPermissions, "show-dashboard-data-all-institution") ?
                                <div className="kt-portlet">
                                    <DashboardClaimsAll response={response}/>
                                </div>:null
                        }

                        {
                            verifyPermission(props.userPermissions, "show-dashboard-data-my-institution") ?
                                <div className="kt-portlet">
                                    <DashboardClaimsMy response={response}/>
                                </div>:null
                        }

                        {
                            verifyPermission(props.userPermissions, "show-dashboard-data-my-unit") ?
                                <div className="kt-portlet">
                                    <DashboardClaimsUnit response={response}/>
                                </div>:null
                        }

                        {
                            verifyPermission(props.userPermissions, "show-dashboard-data-my-activity") ?
                                <div className="kt-portlet">
                                    <DashboardClaimsActivity response={response}/>
                                </div>:null
                        }

                        <div>
                            <DashboardSummaryReport response={response}/>
                        </div>

                        <div>
                            <GraphChannel response={response}/>
                        </div>

                        <div>
                            <DashboardStatClaim response={response}/>
                        </div>

                        <div>
                            <DashboardStatistic response={response}/>
                        </div>

                        <div>
                            {
                                verifyPermission(props.userPermissions, "show-dashboard-data-all-institution") &&
                                (verifyPermission(props.userPermissions, "show-dashboard-data-my-institution")) ?
                                    <div className="kt-portlet">
                                        <ClaimToInstitution response={response}/>
                                    </div> : null
                            }
                            {
                                !verifyPermission(props.userPermissions, "show-dashboard-data-all-institution") &&
                                verifyPermission(props.userPermissions, "show-dashboard-data-my-institution") ?
                                    <div className="kt-portlet">
                                        <ClaimToPointOfServices response={response}/>
                                    </div> : null
                            }


                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="kt-portlet">
                            <div className="kt-portlet__head">
                                <div className="kt-portlet__head-label">
                                    <h3 className="kt-portlet__head-title">
                                        Statistiques des Réclamations de toutes les Institutions sur les 30 derniers jours
                                    </h3>
                                </div>
                            </div>
                            <LoadingTable/>
                        </div>

                        <div className="kt-portlet">
                            <div className="kt-portlet__head">
                                <div className="kt-portlet__head-label">
                                    <h3 className="kt-portlet__head-title">
                                        Statistiques des Réclamations de mon Institution sur les 30 derniers jours
                                    </h3>
                                </div>
                            </div>
                            <LoadingTable/>
                        </div>

                        <div className="kt-portlet">
                            <div className="kt-portlet__head">
                                <div className="kt-portlet__head-label">
                                    <h3 className="kt-portlet__head-title">
                                        Statistique des cinq (05) plus fréquents Objets de Réclamations sur les 30 derniers jours
                                    </h3>
                                </div>
                            </div>
                            <LoadingTable/>
                        </div>

                        <div className="kt-portlet">
                            <div className="kt-portlet__head">
                                <div className="kt-portlet__head-label">
                                    <h3 className="kt-portlet__head-title">
                                        Total des Réclamations reçues par Canal sur les 30 derniers jours
                                    </h3>
                                </div>
                            </div>
                            <LoadingTable/>
                        </div>

                        <div className="kt-portlet">
                            <div className="kt-portlet__head">
                                <div className="kt-portlet__head-label">
                                    <h3 className="kt-portlet__head-title">
                                        Evolution de la satisfaction des réclamants sur les 11 derniers mois
                                    </h3>
                                </div>
                            </div>
                            <LoadingTable/>
                        </div>

                        <div className="kt-portlet">
                            <div className="kt-portlet__head">
                                <div className="kt-portlet__head-label">
                                    <h3 className="kt-portlet__head-title">
                                        Evolution de la satisfaction des réclamations sur les 11 derniers mois
                                    </h3>
                                </div>
                            </div>
                            <LoadingTable/>
                        </div>

                        <div className="kt-portlet">
                            <div className="kt-portlet__head">
                                <div className="kt-portlet__head-label">
                                    <h3 className="kt-portlet__head-title">
                                        Satisfaction des institutions qui reçoivent plus de réclamations sur les 30 derniers jours
                                    </h3>
                                </div>
                            </div>
                            <LoadingTable/>
                        </div>
                    </div>
                )}
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
