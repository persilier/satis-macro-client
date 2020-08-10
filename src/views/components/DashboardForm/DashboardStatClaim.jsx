import React, {useEffect, useState} from 'react';
import Chart from "react-apexcharts";
import {verifyPermission} from "../../../helpers/permission";
import axios from "axios";
import appConfig from "../../../config/appConfig";
import {connect} from "react-redux";
import LoadingTable from "../LoadingTable";


const DashboardStatClaim = (props) => {

    const [satisfactionData, setSatisfactionData] = useState("");
    const [load, setLoad] = useState(true);

    const tooltipHoverFormatter = (val, opts) => {
        return val + ' : ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
    };

    const defaultData = {
        series: [

            {
                name: "Satisfaisantes",
                data: satisfactionData ? satisfactionData.series.data1 : []
            },
            {
                name: "Non Satisfaisantes",
                data: satisfactionData ? satisfactionData.series.data2 : []
            },
            {
                name: 'Mesure Satisfaction',
                data: satisfactionData ? satisfactionData.series.data3 : []
            }
        ],
        options: {
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: [3, 5, 3],
                curve: 'smooth',
                dashArray: [0, 3, 3]
            },
            title: {
                text: 'Evolution des satisfactions par mois',
                align: 'left'
            },
            legend: {
                tooltipHoverFormatter
            },

            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.2
                },
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                title: {
                    text: 'Month'
                }
            },

        },
    };

    useEffect(() => {
        let isCancelled = false;

        async function fetchData() {
            axios.get(appConfig.apiDomaine + "/dashboard")
                .then(response => {
                    if (!isCancelled) {
                        let claimSatifaction = response.data.claimerSatisfactionEvolution;
                        let satisfiedData = [];
                        for (const satisfied in claimSatifaction[1]) {
                            satisfiedData.push(satisfied);
                        }
                        let newData = [];
                        for (const key in claimSatifaction) {
                            let totalSatisfaction = claimSatifaction[key];
                            if (verifyPermission(props.userPermissions, "show-dashboard-data-all-institution")) {
                                newData.push({
                                    month: key,
                                    data0: totalSatisfaction.satisfied.allInstitution,
                                    data1: totalSatisfaction.unsatisfied.allInstitution,
                                    data2: totalSatisfaction.measured.allInstitution
                                })
                            } else if (verifyPermission(props.userPermissions, "show-dashboard-data-my-institution")) {
                                newData.push({
                                    month: key,
                                    data0: totalSatisfaction.satisfied.myInstitution,
                                    data1: totalSatisfaction.unsatisfied.myInstitution,
                                    data2: totalSatisfaction.measured.myInstitution
                                })
                            }
                        }

                        let newSatisfaction = {...defaultData};
                        for (var i = 0; i <= satisfiedData.length - 1; i++) {
                            newSatisfaction.series[i].data = Object.values(newData).map(serie => serie['data' + i]);
                        }
                        setSatisfactionData(newSatisfaction);
                        setLoad(false)
                    }
                })
                .catch(error => {
                    setLoad(false);
                    console.log("Something is wrong");
                });
        }

        fetchData();
        return () => {
            isCancelled = true;
        }
    }, []);

    return (
        (verifyPermission(props.userPermissions, "show-dashboard-data-all-institution") ||
            verifyPermission(props.userPermissions, "show-dashboard-data-my-institution")) ?
            <div className="kt-portlet">
                <div className="kt-portlet__head">
                    <div className="kt-portlet__head-label">
                        <h3 className="kt-portlet__head-title">Evolution de la satisfaction des réclamants</h3>
                    </div>
                </div>
                {
                    load ? (
                        <LoadingTable/>
                    ) : (
                    satisfactionData ?
                        <div id="chart" className="kt-portlet__body">
                            <Chart options={satisfactionData.options} series={satisfactionData.series} type="line"
                                   height={350}/>
                        </div>
                        : ""
                    )
                }
            </div>
            : ""
    )

};

const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(DashboardStatClaim);