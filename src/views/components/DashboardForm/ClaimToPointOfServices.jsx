import React, {useEffect, useState} from 'react';
import Chart from "react-apexcharts";
import LoadingTable from "../LoadingTable";
import {verifyPermission} from "../../../helpers/permission";
import {connect} from "react-redux";
import axios from "axios";
import appConfig from "../../../config/appConfig";


const ClaimToInstitution = (props) => {
    const [load, setLoad] = useState(true);
    const [pointOfServiceData, setPointOfServiceData] = useState("");

    const defaultData = {
        series: pointOfServiceData ? pointOfServiceData.series : [],
        options: {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: pointOfServiceData ? pointOfServiceData.options.labels : [],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        },
    };

    useEffect(() => {
        let isCancelled = false;

        async function fetchData() {
            axios.get(appConfig.apiDomaine + "/dashboard")
                .then(response => {
                    if (!isCancelled) {
                        // console.log(response.data, "ProcessEvolution");
                        let pointOfService = response.data.pointOfServicesTargeted;
                        let ServiceData = [];
                        for (const processus in pointOfService) {
                            ServiceData.push(processus);
                        }
                        // console.log(pointOfServiceData,"pointOfServiceData");
                        let newData = {...defaultData};

                        newData.options.labels = ServiceData;
                        if (verifyPermission(props.userPermissions, "show-dashboard-data-my-institution")) {
                            newData.series = Object.values(pointOfService).map(serie => serie.myInstitution)
                        }
                        // console.log(newData,"newData");
                        setPointOfServiceData(newData);
                        setLoad(false)
                    }
                })
                .catch(error => {
                    setLoad(false);
                    console.log("Something is wrong");
                })
        }

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
                            <h3 className="kt-portlet__head-title">Satisfaction des points de services qui reçoivent plus de
                                réclamations</h3>
                        </div>
                    </div>
                    {
                        load ? (
                            <LoadingTable/>
                        ) : (
                            <div className="kt-portlet__body">
                                <div id="chart" className="d-flex justify-content-center" style={{position: "relative"}}>
                                    <Chart options={pointOfServiceData.options} series={pointOfServiceData.series}
                                           type="pie" width={550} />
                                </div>
                            </div>
                        )
                    }
                </div>
            ) : ""

    );
};
const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(ClaimToInstitution);