import React, {useEffect, useState} from 'react';
import {verifyPermission} from "../../../helpers/permission";
import axios from "axios";
import appConfig from "../../../config/appConfig";
import {connect} from "react-redux";
import {percentageData} from "../../../helpers/function";
import LoadingTable from "../LoadingTable";
import {verifyTokenExpire} from "../../../middleware/verifyToken";
import {NavLink} from "react-router-dom";

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token');

const DashboardClaimsMy = (props) => {

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
                        setTotalData(response.data.statistics.totalRegistered.myInstitution);
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
        verifyPermission(props.userPermissions, "show-dashboard-data-my-institution") ?
            (
                <div>
                    <div className="kt-portlet__head">
                        <div className="kt-portlet__head-label">
                            <h5 className="kt-portlet__head-title">
                                Statistiques des Réclamations de mon Institution sur les 30 derniers jours
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
                                            {/*<NavLink exact to="/process/my-total-claim-register">*/}
                                                <div className="kt-widget24__details">
                                                    <div className="kt-widget24__info">
                                                        <h5 className="kt-widget24__title">
                                                            Total Réclamations Enregistrées
                                                        </h5>
                                                        <span className="kt-widget24__desc"/>
                                                    </div>
                                                    <span className="kt-widget24__stats kt-font-brand">
                                                    {data.totalRegistered ? data.totalRegistered.myInstitution : ""}
                                                </span>
                                                </div>
                                            {/*</NavLink>*/}
                                        </div>
                                    </div>

                                    <div className="col-md-12 col-lg-3 col-xl-3">
                                        <div className="kt-widget24">
                                            {/*<NavLink exact to="/process/my-total-incomplete-claim">*/}
                                                <div className="kt-widget24__details">
                                                    <div className="kt-widget24__info">
                                                        <h5 className="kt-widget24__title">
                                                            Total Réclamations Incomplètes
                                                        </h5>
                                                        <span className="kt-widget24__desc"/>
                                                    </div>
                                                    <span className="kt-widget24__stats kt-font-danger">
                                                    {data.totalIncomplete ? data.totalIncomplete.myInstitution : ""}
                                                </span>
                                                </div>
                                            {/*</NavLink>*/}

                                            <div className="progress progress--sm">
                                                {
                                                    data.totalIncomplete ?
                                                        <div className="progress-bar kt-bg-danger" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalIncomplete.myInstitution), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalIncomplete.myInstitution), totalData)}}>
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
                                                {percentageData((data.totalIncomplete.myInstitution), totalData)}
                                           </span>
                                                        : null
                                                }

                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12 col-lg-3 col-xl-3">
                                        <div className="kt-widget24">
                                            {/*<NavLink exact to="/process/my-total-complete-claim">*/}
                                                <div className="kt-widget24__details">
                                                    <div className="kt-widget24__info">
                                                        <h5 className="kt-widget24__title">
                                                            Total Réclamations Complètes
                                                        </h5>
                                                        <span className="kt-widget24__desc"/>
                                                    </div>
                                                    <span className="kt-widget24__stats ktkt-bg-success">
                                                    {data.totalComplete ? data.totalComplete.myInstitution : ""}
                                                </span>
                                                </div>
                                            {/*</NavLink>*/}

                                            <div className="progress progress--sm">
                                                {
                                                    data.totalComplete ?
                                                        <div className="progress-bar kt-bg-success" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalComplete.myInstitution), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalComplete.myInstitution), totalData)}}>
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
                                                {percentageData((data.totalComplete.myInstitution), totalData)}
                                           </span>
                                                        : null
                                                }
								    </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12 col-lg-3 col-xl-3">
                                        <div className="kt-widget24">
                                            {/*<NavLink exact to="/process/my-total-claim-transfer-to-unit">*/}
                                                <div className="kt-widget24__details">
                                                    <div className="kt-widget24__info">
                                                        <h5 className="kt-widget24__title">
                                                            Total Réclamations Transférées à une Unité
                                                        </h5>
                                                        <span className="kt-widget24__desc"/>
                                                    </div>
                                                    <span className="kt-widget24__stats kt-font-brand">
                                                    {data.totalTransferredToUnit ? data.totalTransferredToUnit.myInstitution : ""}
                                                </span>
                                                </div>
                                            {/*</NavLink>*/}

                                            <div className="progress progress--sm">

                                                {
                                                    data.totalTransferredToUnit ?
                                                        <div className="progress-bar kt-bg-brand" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalTransferredToUnit.myInstitution), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalTransferredToUnit.myInstitution), totalData)}}>
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
                                                {percentageData((data.totalTransferredToUnit.myInstitution), totalData)}
                                           </span>
                                            : null
                                    }
								</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12 col-lg-3 col-xl-3">
                                        <div className="kt-widget24">
                                            {/*<NavLink exact to="/process/my-total-claim-in-treatment">*/}
                                                <div className="kt-widget24__details">
                                                    <div className="kt-widget24__info">
                                                        <h5 className="kt-widget24__title">
                                                            Total Réclamations en Cours de Traitement
                                                        </h5>
                                                        <span className="kt-widget24__desc"/>
                                                    </div>
                                                    <span className="kt-widget24__stats kt-font-warning">
                                                    {data.totalBeingProcess ? data.totalBeingProcess.myInstitution : ""}
                                                </span>
                                                </div>
                                            {/*</NavLink>*/}

                                            <div className="progress progress--sm">
                                                {
                                                    data.totalBeingProcess ?
                                                        <div className="progress-bar kt-bg-warning" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalBeingProcess.myInstitution), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalBeingProcess.myInstitution), totalData)}}>
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
                                                {percentageData((data.totalBeingProcess.myInstitution), totalData)}
                                           </span>
                                            : null
                                    }
								</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12 col-lg-3 col-xl-3">
                                        <div className="kt-widget24">
                                            {/*<NavLink exact to="/process/my-total-claim-treat">*/}
                                                <div className="kt-widget24__details">
                                                    <div className="kt-widget24__info">
                                                        <h5 className="kt-widget24__title">
                                                            Total Réclamations Traitées
                                                        </h5>
                                                        <span className="kt-widget24__desc"/>
                                                    </div>
                                                    <span className="kt-widget24__stats kt-font-success">
                                                    {data.totalTreated ? data.totalTreated.myInstitution : ""}
                                                </span>
                                                </div>
                                            {/*</NavLink>*/}

                                            <div className="progress progress--sm">
                                                {
                                                    data.totalTreated ?
                                                        <div className="progress-bar kt-bg-success" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalTreated.myInstitution), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalTreated.myInstitution), totalData)}}>
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
                                                {percentageData((data.totalTreated.myInstitution), totalData)}
                                           </span>
                                            : null
                                    }
								</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12 col-lg-3 col-xl-3">
                                        <div className="kt-widget24">
                                            {/*<NavLink exact to="/process/my-total-unfounded-claim">*/}
                                                <div className="kt-widget24__details">
                                                    <div className="kt-widget24__info">
                                                        <h5 className="kt-widget24__title">
                                                            Total Réclamations Non Fondées
                                                        </h5>
                                                        <span className="kt-widget24__desc"/>
                                                    </div>
                                                    <span className="kt-widget24__stats kt-font-success">
                                                    {data.totalUnfounded ? data.totalUnfounded.myInstitution : ""}
                                                </span>
                                                </div>
                                            {/*</NavLink>*/}

                                            <div className="progress progress--sm">
                                                {
                                                    data.totalUnfounded ?
                                                        <div className="progress-bar kt-bg-success" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalUnfounded.myInstitution), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalUnfounded.myInstitution), totalData)}}>
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
                                                {percentageData((data.totalUnfounded.myInstitution), totalData)}
                                           </span>
                                            : null
                                    }
								</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12 col-lg-3 col-xl-3">
                                        <div className="kt-widget24">
                                            {/*<NavLink exact to="/process/my-total-claim-satisfaction-measure">*/}
                                                <div className="kt-widget24__details">
                                                    <div className="kt-widget24__info">
                                                        <h5 className="kt-widget24__title">
                                                            Total Satisfaction Mesurée
                                                        </h5>
                                                        <span className="kt-widget24__desc"/>
                                                    </div>
                                                    <span className="kt-widget24__stats kt-font-danger">
                                                    {data.totalMeasuredSatisfaction ? data.totalMeasuredSatisfaction.myInstitution : ""}
                                                </span>
                                                </div>
                                            {/*</NavLink>*/}

                                            <div className="progress progress--sm">
                                                {
                                                    data.totalMeasuredSatisfaction ?
                                                        <div className="progress-bar kt-bg-danger" role="progressbar"
                                                             aria-valuenow={percentageData((data.totalMeasuredSatisfaction.myInstitution), totalData)}
                                                             aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: percentageData((data.totalMeasuredSatisfaction.myInstitution), totalData)}}>
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
                                                {percentageData((data.totalMeasuredSatisfaction.myInstitution), totalData)}
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

export default connect(mapStateToProps)(DashboardClaimsMy);
