import React, {useState} from "react";
import ReactApexChart from "react-apexcharts";

const FiveModel = props => {
    const data = {
        prices: [100, 200, 500, 1000, 2000, 3000],
        dates: ["25 Jun", "15 Jul", "10 Aug", "8 Sep", "5 Oct", "5 Dec"]
    };

    const [series, setSeries] = useState([
        {
            name: "Plaintes",
            data: data.prices
        }
    ]);
    const [options, setOptions] = useState({
        chart: {
            type: 'area',
            height: 350,
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: 'Suivi des plaintes',
            align: 'left'
        },
        subtitle: {
            text: 'Evolution des plaintes réçues',
            align: 'left'
        },
        labels: data.dates,
        xaxis: {
            type: 'datetime',
        },
        yaxis: {
            opposite: true
        },
        legend: {
            horizontalAlign: 'left'
        }
    });

    return (
        <div>
            <h2>Modèle 5</h2>
            <ReactApexChart options={options} series={series} type="area" height={350} />
        </div>
    )
};

export default FiveModel;
