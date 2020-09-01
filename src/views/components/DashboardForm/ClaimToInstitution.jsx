import React, {useEffect, useState} from 'react';
import Chart from "react-apexcharts";
import LoadingTable from "../LoadingTable";
import {verifyPermission} from "../../../helpers/permission";
import {connect} from "react-redux";
import axios from "axios";
import appConfig from "../../../config/appConfig";


const ClaimToInstitution = (props) => {
    const [load, setLoad] = useState(true);
    const [institutionData, setInstitutionData] = useState("");

    const defaultData = {
        series: institutionData?institutionData.series:[],
        options: {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: institutionData?institutionData.options.labels:[],
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
                        let institutionTarget = response.data.institutionsTargeted;
                        let institutionData = [];
                        for (const processus in institutionTarget) {
                            institutionData.push(processus);
                        }
                        // console.log(institutionData,"institutionData");
                        let newData = {...defaultData};
                        newData.options.labels = institutionData;
                        if (verifyPermission(props.userPermissions, "show-dashboard-data-all-institution")) {
                            newData.series = Object.values(institutionTarget).map(serie => serie.allInstitution)
                        }
                        // console.log(newData,"newData");
                        setInstitutionData(newData);
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
        verifyPermission(props.userPermissions, "show-dashboard-data-all-institution") ?
            (
                <div>
                    <div className="kt-portlet__head">
                        <div className="kt-portlet__head-label">
                            <h3 className="kt-portlet__head-title">Satisfaction des institutions qui reçoivent plus de
                                réclamations sur les 30 derniers jours</h3>
                        </div>
                    </div>
                    {
                        load ? (
                            <LoadingTable/>
                        ) : (
                            <div id="chart" className="d-flex justify-content-center" style={{position: "relative"}}>
                                <Chart options={institutionData.options} series={institutionData.series} type="pie"
                                       width={380}/>
                            </div>
                        )}
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