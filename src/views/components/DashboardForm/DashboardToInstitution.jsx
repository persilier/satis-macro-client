import React, {useEffect, useState} from 'react';
import Chart from "react-apexcharts";
import LoadingTable from "../LoadingTable";
import {connect} from "react-redux";
import {percentage} from "../../../helpers/function";


const DashboardToInstitution = (props) => {
    console.log(props.response.data,"DATA")
    const [load, setLoad] = useState(true);
    const [institutionData, setInstitutionData] = useState("");
    let totalData=props.response.data.totalClaimsRegisteredStatistics;

    const defaultData = {
        series: institutionData ? institutionData.series : [],

        options: {
            chart: {
                height: 380,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '22px',
                        },
                        value: {
                            fontSize: '16px',
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: function (w) {
                                return totalData

                            }
                        }
                    }
                }
            },
            labels: institutionData ? institutionData.options.labels : [],

        },


    };


    useEffect(() => {
        let institutionTarget = props.response.data.institutionsTargeted;
        let institutionData = [];
        for (const processus in institutionTarget) {
            institutionData.push(processus);
        }
        let newData = {...defaultData};
        newData.options.labels = institutionData;
        newData.series = Object.values(institutionTarget).map(serie => percentage((serie.allInstitution), totalData));

        console.log(newData,"NEWS")
        console.log(totalData,"total")
        setInstitutionData(newData);
        setLoad(false)
    }, []);

    return (

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
                        <Chart options={institutionData.options} series={institutionData.series} type="radialBar"
                               width={380}/>

                    </div>
                )}
        </div>
    );
};
const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(DashboardToInstitution);
