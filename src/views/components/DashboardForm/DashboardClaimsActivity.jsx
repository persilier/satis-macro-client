import React, {useEffect, useState} from 'react';
import {verifyPermission} from "../../../helpers/permission";
import axios from "axios";
import appConfig from "../../../config/appConfig";
import {connect} from "react-redux";
import {percentageData} from "../../../helpers/function";
import LoadingTable from "../LoadingTable";
import {verifyTokenExpire} from "../../../middleware/verifyToken";

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token');

const DashboardClaimsActivity = (props) => {

    const [data, setData] = useState("");
    const [totalData, setTotalData] = useState("");
    const [load, setLoad] = useState(true);
    const [componentData, setComponentData] = useState("");


    useEffect(() => {
        let isCancelled = false;

        async function fetchData() {
            if (!isCancelled) {
                setComponentData(props.component);
                setData(props.response.data.statistics);
                setTotalData(props.response.data.statistics.totalRegistered.allInstitution);
                setLoad(false);
            }
        }

        if (verifyTokenExpire())
            fetchData();
        return () => {
            isCancelled = true;
        }

    }, []);

    return (
        verifyPermission(props.userPermissions, "show-dashboard-data-my-activity") ?
            (
                <div>
                    <div className="kt-portlet__head">
                        <div className="kt-portlet__head-label">
                            <h3 className="kt-portlet__head-title">
                                {/*Statistiques des Réclamations des Activités sur les 30 derniers jours */}
                                {componentData ? componentData.params.fr.title_activity.value : ""}
                            </h3>
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
                                                        {/*Total Réclamations Enregistrées*/}
                                                        {componentData ? componentData.params.fr.total_enreg.value : ""}
                                                    </h5>
                                                    <span className="kt-widget24__desc">

									</span>
                                                </div>
                                                <span className="kt-widget24__stats kt-font-brand">
									{data.totalRegistered ? data.totalRegistered.myActivity : ""}
								</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-lg-3 col-xl-3">
                                        <div className="kt-widget24">
                                            <div className="kt-widget24__details">
                                                <div className="kt-widget24__info">
                                                    <h5 className="kt-widget24__title">
                                                        {/*Total Réclamations Incomplètes*/}
                                                        {componentData ? componentData.params.fr.total_incomplete.value : ""}
                                                    </h5>
                                                    <span className="kt-widget24__desc">
									</span>
                                                </div>
                                                <span className="kt-widget24__stats kt-font-danger">
									{data.totalIncomplete ? data.totalIncomplete.myActivity : ""}
								</span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalIncomplete ?
                                                        <div className="progress-bar kt-bg-danger" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalIncomplete.myActivity), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalIncomplete.myActivity), totalData)}}>
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
                                                {percentageData((data.totalIncomplete.myActivity), totalData)}
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
                                                        {/*Total Réclamations Complètes*/}
                                                        {componentData ? componentData.params.fr.total_complet.value : ""}
                                                    </h5>
                                                    <span className="kt-widget24__desc">
									</span>
                                                </div>
                                                <span className="kt-widget24__stats kt-font-success">
									{data.totalComplete ? data.totalComplete.myActivity : ""}
								</span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalComplete ?
                                                        <div className="progress-bar kt-bg-success" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalComplete.myActivity), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalComplete.myActivity), totalData)}}>
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
                                                {percentageData((data.totalComplete.myActivity), totalData)}
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
                                                        {componentData ? componentData.params.fr.total_to_unit.value : ""}
                                                        {/*Total Réclamations Transférées à une Unité*/}
                                                    </h5>
                                                    <span className="kt-widget24__desc">

									</span>
                                                </div>
                                                <span className="kt-widget24__stats kt-font-brand">
                                        {data.totalTransferredToUnit ? data.totalTransferredToUnit.myActivity : ""}
								</span>
                                            </div>
                                            <div className="progress progress--sm">

                                                {
                                                    data.totalTransferredToUnit ?
                                                        <div className="progress-bar kt-bg-brand" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalTransferredToUnit.myActivity), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalTransferredToUnit.myActivity), totalData)}}>
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
                                                {percentageData((data.totalTransferredToUnit.myActivity), totalData)}
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
                                                        {/*Total Réclamations en Cours de Traitement*/}
                                                        {componentData ? componentData.params.fr.total_in_treatment.value : ""}
                                                    </h5>
                                                    <span className="kt-widget24__desc">

									</span>
                                                </div>
                                                <span className="kt-widget24__stats kt-font-warning">
									   {data.totalBeingProcess ? data.totalBeingProcess.myActivity : ""}

								</span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalBeingProcess ?
                                                        <div className="progress-bar kt-bg-warning" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalBeingProcess.myActivity), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalBeingProcess.myActivity), totalData)}}>
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
                                                {percentageData((data.totalBeingProcess.myActivity), totalData)}
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
                                                        {/*Total Réclamations Traitées*/}
                                                        {componentData ? componentData.params.fr.total_treat.value : ""}
                                                    </h5>
                                                    <span className="kt-widget24__desc">

									</span>
                                                </div>
                                                <span className="kt-widget24__stats kt-font-success">
                                        {data.totalTreated ? data.totalTreated.myActivity : ""}
                                    </span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalTreated ?
                                                        <div className="progress-bar kt-bg-success" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalTreated.myActivity), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalTreated.myActivity), totalData)}}>
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
                                                {percentageData((data.totalTreated.myActivity), totalData)}
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
                                                        {/*Total Réclamations Non Fondées*/}
                                                        {componentData ? componentData.params.fr.total_unfound.value : ""}
                                                    </h5>
                                                    <span className="kt-widget24__desc">

									</span>
                                                </div>
                                                <span className="kt-widget24__stats kt-font-success">
                                        {data.totalUnfounded ? data.totalUnfounded.myActivity : ""}
								</span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalUnfounded ?
                                                        <div className="progress-bar kt-bg-success" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalUnfounded.myActivity), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalUnfounded.myActivity), totalData)}}>
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
                                                {percentageData((data.totalUnfounded.myActivity), totalData)}
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
                                                        {/*Total Satisfaction Mesurée*/}
                                                        {componentData ? componentData.params.fr.total_satisfated.value : ""}
                                                    </h5>
                                                    <span className="kt-widget24__desc">

									</span>
                                                </div>
                                                <span className="kt-widget24__stats kt-font-danger">
                                        {data.totalMeasuredSatisfaction ? data.totalMeasuredSatisfaction.myActivity : null}

								</span>
                                            </div>
                                            <div className="progress progress--sm">
                                                {
                                                    data.totalMeasuredSatisfaction ?
                                                        <div className="progress-bar kt-bg-danger" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalMeasuredSatisfaction.myActivity), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalMeasuredSatisfaction.myActivity), totalData)}}>
                                                        </div>
                                                        : null
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
                                                {percentageData((data.totalMeasuredSatisfaction.myActivity), totalData)}
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

export default connect(mapStateToProps)(DashboardClaimsActivity);
