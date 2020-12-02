import React, {useEffect, useState} from 'react';
import {verifyPermission} from "../../helpers/permission";
import axios from "axios";
import appConfig from "../../config/appConfig";
import {connect} from "react-redux";
import {percentageData} from "../../helpers/function";
import LoadingTable from "../../views/components/LoadingTable";
import {verifyTokenExpire} from "../../middleware/verifyToken";

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token');

const DashboardClaimsAll = (props) => {

    const [data, setData] = useState("");
    const [totalData, setTotalData] = useState("");
    const [load, setLoad] = useState(true);

    useEffect(() => {
        let isCancelled = false;

        async function fetchData() {
            if (verifyTokenExpire()) {
                axios.get(appConfig.apiDomaine + "/dashboard")
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
        }
        fetchData();
        return () => {
            isCancelled = true;
        }
    }, []);

    return (
        verifyPermission(props.userPermissions, "show-dashboard-data-all-institution") ?
            (
                <div>
                    <div className="kt-portlet__head">
                        <div className="kt-portlet__head-label">
                            <h5 className="kt-portlet__head-title">
                                Statistiques des Réclamations de toutes les Institutions sur les 30 derniers jours
                            </h5>
                        </div>
                    </div>
                    {
                        load ? (
                            <LoadingTable/>
                        ) : (
                            <div className="kt-portlet__body kt-portlet__body--fit">
                                <div className="row row-no-padding row-col-separator-sm">
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
									{data.totalRegistered ? data.totalRegistered.allInstitution : ""}
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
									{data.totalIncomplete ? data.totalIncomplete.allInstitution : ""}
								</span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalIncomplete ?
                                                        <div className="progress-bar kt-bg-danger" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalIncomplete.allInstitution), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalIncomplete.allInstitution), totalData)}}>
                                                        </div>
                                                        : null
                                                }
                                            </div>
                                            <div className="kt-widget24__action">
								<span className="kt-widget24__change">

									% Réclamations Incomplètes

								</span>

                                                {
                                                    data.totalIncomplete ?
                                                        <span className="kt-widget24__number">
                                                {percentageData((data.totalIncomplete.allInstitution), totalData)}
                                           </span>
                                                        : null
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
									{data.totalComplete ? data.totalComplete.allInstitution : ""}
								</span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalComplete ?
                                                        <div className="progress-bar kt-bg-success" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalComplete.allInstitution), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalComplete.allInstitution), totalData)}}>
                                                        </div>
                                                        : null
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
                                                {percentageData((data.totalComplete.allInstitution), totalData)}
                                           </span>
                                            : null
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
                                        {data.totalTransferredToUnit ? data.totalTransferredToUnit.allInstitution : ""}
								</span>
                                            </div>
                                            <div className="progress progress--sm">

                                                {
                                                    data.totalTransferredToUnit ?
                                                        <div className="progress-bar kt-bg-brand" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalTransferredToUnit.allInstitution), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalTransferredToUnit.allInstitution), totalData)}}>
                                                        </div>
                                                        : null
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
                                                {percentageData((data.totalTransferredToUnit.allInstitution), totalData)}
                                           </span>
                                            : null
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
									   {data.totalBeingProcess ? data.totalBeingProcess.allInstitution : ""}

								</span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalBeingProcess ?
                                                        <div className="progress-bar kt-bg-warning" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalBeingProcess.allInstitution), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalBeingProcess.allInstitution), totalData)}}>
                                                        </div>
                                                        : null
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
                                                {percentageData((data.totalBeingProcess.allInstitution), totalData)}
                                           </span>
                                            : null
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
                                        {data.totalTreated ? data.totalTreated.allInstitution : ""}
                                    </span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalTreated ?
                                                        <div className="progress-bar kt-bg-success" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalTreated.allInstitution), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalTreated.allInstitution), totalData)}}>
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
                                                {percentageData((data.totalTreated.allInstitution), totalData)}
                                           </span>
                                            : null
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
                                        {data.totalUnfounded ? data.totalUnfounded.allInstitution : ""}
								</span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalUnfounded ?
                                                        <div className="progress-bar kt-bg-success" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalUnfounded.allInstitution), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalUnfounded.allInstitution), totalData)}}>
                                                        </div>
                                                        : null
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
                                                {percentageData((data.totalUnfounded.allInstitution), totalData)}
                                           </span>
                                            : null
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
                                        {data.totalMeasuredSatisfaction ? data.totalMeasuredSatisfaction.allInstitution : ""}

								</span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalMeasuredSatisfaction ?
                                                        <div className="progress-bar kt-bg-danger" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalMeasuredSatisfaction.allInstitution), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalMeasuredSatisfaction.allInstitution), totalData)}}>
                                                        </div>
                                                        : null
                                                }
                                            </div>
                                            <div className="kt-widget24__action">
								<span className="kt-widget24__change">
									%  Satisfaction Mesurée
								</span>
                                                <span className="kt-widget24__number">
									{
                                        data.totalMeasuredSatisfaction ?
                                            <span className="kt-widget24__number">
                                                {percentageData((data.totalMeasuredSatisfaction.allInstitution), totalData)}
                                           </span>
                                            : null
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

            ) : null
    )
};

const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(DashboardClaimsAll);
