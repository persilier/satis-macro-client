import React, {useEffect, useState} from "react";
import ReactFC from "react-fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import FusionCharts from "fusioncharts";
import LoadingTable from "../LoadingTable";
import {percentage} from "../../../helpers/function";

charts(FusionCharts);

const DashboardClaimToInstitution = (props) => {
    const [load, setLoad] = useState(true);
    const [institutionData, setInstitutionData] = useState(undefined);
    let totalData=props.response.data.totalClaimsRegisteredStatistics;

    const dataSource = {
        chart: {
            showvalues: "1",
            showpercentintooltip: "0",
            numberSuffix: "%",
            enablemultislicing: "1",
            theme: "fusion"
        },
        data: institutionData ? institutionData.data : [],
    };

    useEffect(() => {

        let institutionTarget = props.response.data.institutionsTargeted;
        let dataInstitution = [];
        for (const processus in institutionTarget) {
            dataInstitution.push(processus);
        }
        let newData = {...dataSource};
        if (institutionData === undefined) {
            for (var i = 0; i < dataInstitution.length; i++) {
                newData.data.push({
                    label: dataInstitution[i],
                    value:percentage(Object.values(institutionTarget)[i].allInstitution,totalData)
                })
            }
            setInstitutionData(newData);
        }
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

                    <ReactFC
                        type="pie3d"
                        width="50%"
                        height="50%"
                        dataFormat="JSON"
                        dataSource={dataSource}
                    />


                )}
        </div>

    );

};

export default DashboardClaimToInstitution;