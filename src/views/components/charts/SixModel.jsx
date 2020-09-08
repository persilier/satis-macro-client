import React from "react";
import ReactApexChart from "react-apexcharts";

const SixModel = ({data})  => {
    var label = [];
    var series = [];
    const getData = () => {
        data.map(el => {
            label.push(el.name["fr"]);
            series.push(el.pourcentage)
        });
    };
    getData();

    var options = {
        chart: {
            chart: {
                width: 380,
                type: 'pie',
            },
        },
        labels: label,
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
    };

    return (
        <div className="mt-4">
            <div id="graphOne" className="d-flex justify-content-center">
                <ReactApexChart options={options} series={series} type="pie" width={450}/>
            </div>
            <h5 className="text-center">Pourcentage d'utilisation des canneaux</h5>
        </div>
    );
};

export default SixModel;
