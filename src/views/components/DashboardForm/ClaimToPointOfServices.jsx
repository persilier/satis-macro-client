import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import LoadingTable from "../LoadingTable";
import { connect } from "react-redux";

const ClaimToInstitution = (props) => {
  const [load, setLoad] = useState(true);
  const [pointOfServiceData, setPointOfServiceData] = useState("");
  const { dateEnd, dateStart, filterdate, spacialdate } = props;

  const defaultData = {
    series: pointOfServiceData ? pointOfServiceData.series : [],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: pointOfServiceData ? pointOfServiceData.options.labels : [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  useEffect(() => {
    let pointOfService = props.response.data.pointOfServicesTargeted;
    let ServiceData = [];
    for (const processus in pointOfService) {
      ServiceData.push(processus);
    }
    let newData = { ...defaultData };

    newData.options.labels = ServiceData;
    newData.series = Object.values(pointOfService).map(
      (serie) => serie.myInstitution
    );
    setPointOfServiceData(newData);
    setLoad(false);
  }, [props.response]);

  let points = Object.keys(props.response.data?.pointOfServicesTargeted || {});
  let displayChart = false;

  for (let pi = 0; pi < points.length; pi++) {
    const element = props.response.data?.pointOfServicesTargeted[points[pi]];
    if (element.myInstitution > 0) {
      displayChart = true;
    }
  }

  return (
    <div>
      <div className="kt-portlet__head">
        <div className="kt-portlet__head-label">
          <h3 className="kt-portlet__head-title">
            Statistique les services techniques qui reçoivent plus de
            réclamations
            {spacialdate !== ""
              ? ` sur les ${spacialdate?.match(/\d+/)[0]} derniers ${
                  spacialdate?.includes("months") ? " mois" : "jours"
                }`
              : filterdate !== ""
              ? ` au ${filterdate}`
              : dateStart !== ""
              ? ` du ${dateStart} au ${dateEnd}`
              : " sur les 30 derniers jours"}
            {/* {componentData
              ? componentData.params.fr.title_stat_service.value
              : ""} */}
          </h3>
        </div>
      </div>
      {load ? (
        <LoadingTable />
      ) : (
        <div className="kt-portlet__body">
          <div
            id="chart"
            className="d-flex justify-content-center"
            style={{ position: "relative" }}
          >
            {displayChart > 0 ? (
              pointOfServiceData ? (
                <Chart
                  options={pointOfServiceData.options}
                  series={pointOfServiceData.series}
                  type="pie"
                  width={550}
                />
              ) : (
                ""
              )
            ) : (
              <p>Aucune donnée disponible</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    userPermissions: state.user.user.permissions,
  };
};

export default connect(mapStateToProps)(ClaimToInstitution);
