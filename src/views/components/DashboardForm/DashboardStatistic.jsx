import React, {useEffect, useState} from 'react';
import Chart from "react-apexcharts";
import axios from "axios";
import appConfig from "../../../config/appConfig";
import {verifyPermission} from "../../../helpers/permission";
import {connect} from "react-redux";
import LoadingTable from "../LoadingTable";

const DashboardStatistic = (props) => {
    const [data, setProcessData] = useState("");
    const [load, setLoad] = useState(true);

    const tooltipHoverFormatter = (val, opts) => {
        return val + ' : ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
    };

    const defaultData = {
        series: [{
            name: "Enregistrées",
            data: data ? data.series.data1 : []
        },
            {
                name: "Tranférées à une Unité",
                data: data ? data.series.data2 : []
            },
            {
                name: 'Non Fondées',
                data: data ? data.series.data3 : []
            },
            {
                name: 'Traitées',
                data: data ? data.series.data4 : []
            },
            {
                name: 'Mesure Satisfaction',
                data: data ? data.series.data5 : []
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
                width: [3, 5, 3, 2, 3],
                curve: 'smooth',
                dashArray: [0, 3, 3, 0, 3]
            },
            title: {
                text: 'Evolution des satisfactions par mois',
                align: 'left'
            },
            legend: {
                tooltipHoverFormatter
            },
            fill: {
                opacity: 0.05,
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.45,
                    opacityTo: 0.05,
                    stops: [20, 100, 100, 100]
                },
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.2
                },
            },
            // yaxis: {
            //     tickAmount: 2,
            //     max: 1,
            //     min: -1
            // },
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
                        let claimProcess = response.data.claimerProcessEvolution;
                        let processData = [];
                        for (const processus in claimProcess[1]) {
                            processData.push(processus);
                        }

                        let newData = [];
                        for (const key in claimProcess) {
                            let totalProcess = claimProcess[key];
                            if (verifyPermission(props.userPermissions, "show-dashboard-data-all-institution")) {
                                newData.push({
                                    month: key,
                                    data0: totalProcess.registered.allInstitution,
                                    data1: totalProcess.transferred_to_unit.allInstitution,
                                    data2: totalProcess.unfounded.allInstitution,
                                    data3: totalProcess.treated.allInstitution,
                                    data4: totalProcess.measured.allInstitution
                                })
                            } else if (verifyPermission(props.userPermissions, "show-dashboard-data-my-institution")) {
                                newData.push({
                                    month: key,
                                    data0: totalProcess.registered.myInstitution,
                                    data1: totalProcess.transferred_to_unit.myInstitution,
                                    data2: totalProcess.unfounded.myInstitution,
                                    data3: totalProcess.treated.myInstitution,
                                    data4: totalProcess.measured.myInstitution
                                })
                            }
                        }
                        let newProcess = {...defaultData};
                        for (var i = 0; i <= processData.length - 1; i++) {
                            newProcess.series[i].data = Object.values(newData).map(serie => serie['data' + i]);
                        }
                        setProcessData(newProcess);
                        setLoad(false)
                    }
                })
                .catch(error => {
                    setLoad(false)
                    console.log("Something is wrong");
                })
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
                        <h3 className="kt-portlet__head-title">Evolution de la satisfaction des réclamations</h3>
                    </div>
                </div>

                {
                    load ? (
                        <LoadingTable/>
                    ) : (
                    data ?
                        <div id="chart" className="kt-portlet__body">
                            <Chart options={data.options} series={data.series} type="area" height={350}/>
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

export default connect(mapStateToProps)(DashboardStatistic);