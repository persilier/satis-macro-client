import React from 'react';
import Chart from "react-apexcharts";
import LoadingTable from "../LoadingTable";


const ClaimToInstitution = () => {
    const defaultData = {
        series: [44, 55, 13, 43, 22],
        options: {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
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
    return (
        <div className="kt-portlet">
            <div className="kt-portlet__head">
                <div className="kt-portlet__head-label">
                    <h3 className="kt-portlet__head-title">Satisfaction des institutions qui traitent plus de réclamation</h3>
                </div>
            </div>

            <div id="chart" className="kt-portlet__body">
                <Chart options={defaultData.options} series={defaultData.series} type="pie" width={380}/>
            </div>

        </div>

    );
};

export default ClaimToInstitution;