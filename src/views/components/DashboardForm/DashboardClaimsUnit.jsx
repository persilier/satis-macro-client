import React, {useEffect, useState} from 'react';
import {verifyPermission} from "../../../helpers/permission";
import {ERROR_401} from "../../../config/errorPage";
import axios from "axios";
import appConfig from "../../../config/appConfig";
import {connect} from "react-redux";
import {percentageData} from "../../../helpers/function";
import LoadingTable from "../LoadingTable";
import {verifyTokenExpire} from "../../../middleware/verifyToken";

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token');

const DashboardClaimsUnit = (props) => {

    const [data, setData] = useState("");
    const [totalData, setTotalData] = useState("");
    const [load, setLoad] = useState(true);

    useEffect(() => {
        let isCancelled = false;

        async function fetchData() {
           await axios.get(appConfig.apiDomaine + "/dashboard")
                .then(response => {
                    if (!isCancelled) {
                        setData(response.data.statistics);
                        setTotalData(response.data.totalClaimsRegisteredStatistics);
                        setLoad(false)
                    }
                })
                .catch(error => {
                    setLoad(false);
                    console.log("Something is wrong");
                })
            ;
        }

        if (verifyTokenExpire())
            fetchData();
        return () => {
            isCancelled = true;
        }
    }, []);

    return (
        verifyPermission(props.userPermissions, "show-dashboard-data-my-unit") ?
            (
                <div>
                    <div className="kt-portlet__head">
                        <div className="kt-portlet__head-label">
                            <h5 className="kt-portlet__head-title">
                                Statistiques des Réclamations de mon Unité sur les 30 derniers jours
                            </h5>
                        </div>
                    </div>
                    {
                        load ? (
                            <LoadingTable/>
                        ) : (
                            <div className="kt-portlet__body kt-portlet__body--fit">
                                <div className="row row-no-padding row-col-separator-lg">
                                    <div className="col-md-12 col-lg-3 col-xl-3">
                                        <div className="kt-widget24">
                                            <div className="kt-widget24__details">
                                                <div className="kt-widget24__info">
                                                    <h5 className="kt-widget24__title">
                                                        Total Réclamations Enregistrées
                                                    </h5>
                                                    <span className="kt-widget24__desc">

									</span>
                                                </div>
                                                <span className="kt-widget24__stats kt-font-brand">
									{data.totalRegistered ? data.totalRegistered.myUnit : ""}
								</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-lg-3 col-xl-3">
                                        <div className="kt-widget24">
                                            <div className="kt-widget24__details">
                                                <div className="kt-widget24__info">
                                                    <h5 className="kt-widget24__title">
                                                        Total Réclamations Incomplètes
                                                    </h5>
                                                    <span className="kt-widget24__desc">
									</span>
                                                </div>
                                                <span className="kt-widget24__stats kt-font-danger">
									{data.totalIncomplete ? data.totalIncomplete.myUnit : ""}
								</span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalIncomplete ?
                                                        <div className="progress-bar kt-bg-danger" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalIncomplete.myUnit), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalIncomplete.myUnit), totalData)}}>
                                                        </div>
                                                        : ""
                                                }
                                            </div>
                                            <div className="kt-widget24__action">
								<span className="kt-widget24__change">

									% Réclamations Incomplètes

								</span>

                                                {
                                                    data.totalIncomplete ?
                                                        <span className="kt-widget24__number">
                                                {percentageData((data.totalIncomplete.myUnit), totalData)}
                                           </span>
                                                        : ""
                                                }

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-lg-3 col-xl-3">
                                        <div className="kt-widget24">
                                            <div className="kt-widget24__details">
                                                <div className="kt-widget24__info">
                                                    <h5 className="kt-widget24__title">
                                                        Total Réclamations Complètes
                                                    </h5>
                                                    <span className="kt-widget24__desc">
									</span>
                                                </div>
                                                <span className="kt-widget24__stats kt-font-success">
									{data.totalComplete ? data.totalComplete.myUnit : ""}
								</span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalComplete ?
                                                        <div className="progress-bar kt-bg-success" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalComplete.myUnit), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalComplete.myUnit), totalData)}}>
                                                        </div>
                                                        : ""
                                                }

                                            </div>
                                            <div className="kt-widget24__action">
								<span className="kt-widget24__change">

									% Réclamations Complètes

								</span>
                                                <span className="kt-widget24__number">
									{
                                        data.totalComplete ?
                                            <span className="kt-widget24__number">
                                                {percentageData((data.totalComplete.myUnit), totalData)}
                                           </span>
                                            : ""
                                    }
								</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-lg-3 col-xl-3">
                                        <div className="kt-widget24">
                                            <div className="kt-widget24__details">
                                                <div className="kt-widget24__info">
                                                    <h5 className="kt-widget24__title">
                                                        Total Réclamations Transférées à une Unité
                                                    </h5>
                                                    <span className="kt-widget24__desc">

									</span>
                                                </div>
                                                <span className="kt-widget24__stats kt-font-brand">
                                        {data.totalTransferredToUnit ? data.totalTransferredToUnit.myUnit : ""}
								</span>
                                            </div>
                                            <div className="progress progress--sm">

                                                {
                                                    data.totalTransferredToUnit ?
                                                        <div className="progress-bar kt-bg-brand" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalTransferredToUnit.myUnit), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalTransferredToUnit.myUnit), totalData)}}>
                                                        </div>
                                                        : ""
                                                }

                                            </div>
                                            <div className="kt-widget24__action">
								<span className="kt-widget24__change">
									% Réclamations Transférées à une Unité
								</span>
                                                <span className="kt-widget24__number">
									{
                                        data.totalTransferredToUnit ?
                                            <span className="kt-widget24__number">
                                                {percentageData((data.totalTransferredToUnit.myUnit), totalData)}
                                           </span>
                                            : ""
                                    }
								</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-lg-3 col-xl-3">
                                        <div className="kt-widget24">
                                            <div className="kt-widget24__details">
                                                <div className="kt-widget24__info">
                                                    <h5 className="kt-widget24__title">
                                                        Total Réclamations en Cours de Traitement
                                                    </h5>
                                                    <span className="kt-widget24__desc">

									</span>
                                                </div>
                                                <span className="kt-widget24__stats kt-font-warning">
									   {data.totalBeingProcess ? data.totalBeingProcess.myUnit : ""}

								</span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalBeingProcess ?
                                                        <div className="progress-bar kt-bg-warning" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalBeingProcess.myUnit), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalBeingProcess.myUnit), totalData)}}>
                                                        </div>
                                                        : ""
                                                }

                                            </div>
                                            <div className="kt-widget24__action">
								<span className="kt-widget24__change">
									% Réclamations en Cours de Traitement
								</span>
                                                <span className="kt-widget24__number">
									{
                                        data.totalBeingProcess ?
                                            <span className="kt-widget24__number">
                                                {percentageData((data.totalBeingProcess.myUnit), totalData)}
                                           </span>
                                            : ""
                                    }
								</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-lg-3 col-xl-3">
                                        <div className="kt-widget24">
                                            <div className="kt-widget24__details">
                                                <div className="kt-widget24__info">
                                                    <h5 className="kt-widget24__title">
                                                        Total Réclamations Traitées
                                                    </h5>
                                                    <span className="kt-widget24__desc">

									</span>
                                                </div>
                                                <span className="kt-widget24__stats kt-font-success">
                                        {data.totalTreated ? data.totalTreated.myUnit : ""}
                                    </span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalTreated ?
                                                        <div className="progress-bar kt-bg-success" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalTreated.myUnit), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalTreated.myUnit), totalData)}}>
                                                        </div>
                                                        : ''
                                                }

                                            </div>
                                            <div className="kt-widget24__action">
								<span className="kt-widget24__change">
									% Réclamations Traitées
								</span>
                                                <span className="kt-widget24__number">
									{
                                        data.totalTreated ?
                                            <span className="kt-widget24__number">
                                                {percentageData((data.totalTreated.myUnit), totalData)}
                                           </span>
                                            : ""
                                    }
								</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-lg-3 col-xl-3">
                                        <div className="kt-widget24">
                                            <div className="kt-widget24__details">
                                                <div className="kt-widget24__info">
                                                    <h5 className="kt-widget24__title">
                                                        Total Réclamations Non Fondées
                                                    </h5>
                                                    <span className="kt-widget24__desc">

									</span>
                                                </div>
                                                <span className="kt-widget24__stats kt-font-success">
                                        {data.totalUnfounded ? data.totalUnfounded.myUnit : ""}
								</span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalUnfounded ?
                                                        <div className="progress-bar kt-bg-success" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalUnfounded.myUnit), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalUnfounded.myUnit), totalData)}}>
                                                        </div>
                                                        : ""
                                                }
                                            </div>
                                            <div className="kt-widget24__action">
								<span className="kt-widget24__change">
									% Réclamations Non Fondées
								</span>
                                                <span className="kt-widget24__number">
									{
                                        data.totalUnfounded ?
                                            <span className="kt-widget24__number">
                                                {percentageData((data.totalUnfounded.myUnit), totalData)}
                                           </span>
                                            : ""
                                    }
								</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-lg-3 col-xl-3">
                                        <div className="kt-widget24">
                                            <div className="kt-widget24__details">
                                                <div className="kt-widget24__info">
                                                    <h5 className="kt-widget24__title">
                                                        Total Satisfaction Mesurée
                                                    </h5>
                                                    <span className="kt-widget24__desc">

									</span>
                                                </div>
                                                <span className="kt-widget24__stats kt-font-danger">
                                        {data.totalMeasuredSatisfaction ? data.totalMeasuredSatisfaction.myUnit : ""}

								</span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalMeasuredSatisfaction ?
                                                        <div className="progress-bar kt-bg-danger" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalMeasuredSatisfaction.myUnit), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalMeasuredSatisfaction.myUnit), totalData)}}>
                                                        </div>
                                                        : ""
                                                }
                                            </div>
                                            <div className="kt-widget24__action">
								<span className="kt-widget24__change">
									% Satisfaction Mesurée
								</span>
                                                <span className="kt-widget24__number">
									{
                                        data.totalMeasuredSatisfaction ?
                                            <span className="kt-widget24__number">
                                                {percentageData((data.totalMeasuredSatisfaction.myUnit), totalData)}
                                           </span>
                                            : ""
                                    }
								</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>

            ) : ""
    )
};

const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(DashboardClaimsUnit);
