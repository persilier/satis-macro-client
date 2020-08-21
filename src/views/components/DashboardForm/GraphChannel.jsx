import React, {useEffect, useState} from 'react';
import Chart from "react-apexcharts";
import axios from "axios";
import appConfig from "../../../config/appConfig";
import {verifyPermission} from "../../../helpers/permission";
import {connect} from "react-redux";
import LoadingTable from "../LoadingTable";

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token');

const GraphChannel = (props) => {

    const [channelData, setChannelData] = useState("");
    const [load, setLoad] = useState(true);

    const defaultData = {

        series: [{
            name: 'Total',
            data: channelData ? channelData.series.data : []
        }],
        options: {
            chart: {
                height: 350,
                type: 'bar',
                events: {
                    click: function (chart, w, e) {
                    }
                }
            },
            // colors: "#f3f3f8",
            plotOptions: {
                bar: {
                    columnWidth: '45%',
                    distributed: true
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            xaxis: {
                categories: channelData ? channelData.options.xaxis.categories : [],
                labels: {
                    style: {
                        fontSize: '12px'
                    }
                }
            }
        },


    };


    useEffect(() => {
        let isCancelled = false;

        async function fetchData() {
            axios.get(appConfig.apiDomaine + "/dashboard")
                .then(response => {
                    console.log(response.data, "CANAL_STAT")
                    if (!isCancelled) {
                        let channels = [];
                        for (const channel in response.data.channelsUse) {
                            channels.push(channel);
                        }
                        let newChannels = {...defaultData};
                        newChannels.options.xaxis.categories = channels;
                        if (verifyPermission(props.userPermissions, "show-dashboard-data-all-institution")) {
                            newChannels.series[0].data = Object.values(response.data.channelsUse).map(serie => serie.allInstitution)
                        } else if (verifyPermission(props.userPermissions, "show-dashboard-data-my-institution")) {
                            newChannels.series[0].data = Object.values(response.data.channelsUse).map(serie => serie.myInstitution)
                        }
                        setChannelData(newChannels);
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
        (verifyPermission(props.userPermissions, "show-dashboard-data-all-institution") ||
            verifyPermission(props.userPermissions, "show-dashboard-data-my-institution")) ?
            <div className="kt-portlet">
                <div className="kt-portlet__head">
                    <div className="kt-portlet__head-label">
                        <h3 className="kt-portlet__head-title">Total Réclamations Reçues Par Canal</h3>
                    </div>
                </div>
                {
                    load ? (
                        <LoadingTable/>
                    ) : (
                        channelData ?
                            <div id="chart" className="kt-portlet__body">
                                <Chart options={channelData.options} series={channelData.series} type="bar"
                                       height={350}/>
                            </div>
                            : ""
                    )
                }

            </div>
            : ""
    );
};

const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(GraphChannel);