import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardStatistic from "../components/DashboardForm/DashboardStatistic";
import { connect } from "react-redux";
import appConfig from "../../config/appConfig";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import LoadingTable from "../components/LoadingTable";

import { useTranslation } from "react-i18next";

const CallCenter = (props) => {
  document.title = "Satis client - Dashboard";

  const { t, ready } = useTranslation();

  const [response, setResponse] = useState(null);
  const [dataInstitution, setDataInstitution] = useState([]);
  const [load, setLoad] = useState(true);
  const [component, setComponent] = useState(undefined);

  const getResponseAxios = (data) => {
    axios
      .post(appConfig.apiDomaine + "/dashboard", data)
      .then((response) => {
        setResponse(response);
        setDataInstitution(response.data.institutions);
        setLoad(false);
      })
      .catch((error) => console.log("Something is wrong"));
  };
  useEffect(() => {
    async function fetchData() {
      await getResponseAxios();
      await axios
        .get(
          appConfig.apiDomaine + "/components/retrieve-by-name/dashboard-text"
        )
        .then((response) => {
          setComponent(response.data);
          setLoad(false);
        })
        .catch((error) => {
          setLoad(false);
          //console.log("Something is wrong");
        });
    }

    if (verifyTokenExpire()) fetchData();
  }, []);

  return ready ? (
    <div
      className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
      id="kt_content"
    >
      <div className="kt-subheader   kt-grid__item" id="kt_subheader">
        <div className="kt-container  kt-container--fluid d-flex flex-column ">
          <div className="kt-subheader__main">
            <h3 className="kt-subheader__title">{t("Centre Téléphonique")}</h3>
          </div>
        </div>
      </div>

      <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
        {response && component && !load ? (
          <div>Appel en cour ...</div>
        ) : (
          <LoadingTable />
        )}
      </div>
    </div>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    userPermissions: state.user.user.permissions,
  };
};

export default connect(mapStateToProps)(CallCenter);
