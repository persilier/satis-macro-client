import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardClaimsAll from "../../APP_MACRO/Holding/DashboardClaimsAll";
import DashboardClaimsMy from "../components/DashboardForm/DashboardClaimsMy";
import DashboardClaimsUnit from "../components/DashboardForm/DashboardClaimsUnit";
import DashboardSummaryReport from "../components/DashboardForm/DashboardSummaryReport";
import DashboardStatClaim from "../components/DashboardForm/DashboardStatClaim";
import DashboardStatistic from "../components/DashboardForm/DashboardStatistic";
import GraphChannel from "../components/DashboardForm/GraphChannel";
import DashboardClaimsActivity from "../components/DashboardForm/DashboardClaimsActivity";
import ClaimToPointOfServices from "../components/DashboardForm/ClaimToPointOfServices";
import { verifyPermission } from "../../helpers/permission";
import { connect } from "react-redux";
import appConfig from "../../config/appConfig";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import LoadingTable from "../components/LoadingTable";
import Select from "react-select";
import { formatSelectOption } from "../../helpers/function";
import DashboardPieChart from "../components/DashboardForm/DashboardPieChart";
import DashboardFilterRow from "../components/DashboardForm/DashboardFilterRow";
import moment from "moment";

const Dashboards = (props) => {
  document.title = "Satis client - Dashboard";

  const defaultData = { institution_targeted_id: "" };

  const [response, setResponse] = useState(null);
  const [dataInstitution, setDataInstitution] = useState([]);
  const [institution, setInstitution] = useState([]);
  const [data, setData] = useState(defaultData);
  const [load, setLoad] = useState(true);
  const [loader, setLoader] = useState(false);
  const [component, setComponent] = useState(undefined);
  const [dateStart, setDateStart] = useState("2020-01-01");
  const [filterdate, setfilterdate] = useState("2020-01-01");
  const [spacialdate, setspacialdate] = useState("30days");
  const [dateEnd, setDateEnd] = useState(moment().format("YYYY-MM-DD"));

  const handleDateEndChange = (e) => {
    setDateEnd(e);
    setspacialdate("");
    setfilterdate("");
    if (e !== "" && dateStart !== "") {
      getResponseAxios({
        ...data,
        type: "period",
        date_start: dateStart,
        date_end: e,
      });
    }
  };

  const handleDateStartChange = (e) => {
    setDateStart(e);
    setspacialdate("");
    setfilterdate("");
    if (e !== "" && dateEnd !== "") {
      getResponseAxios({
        ...data,
        type: "period",
        date_start: e,
        date_end: dateEnd,
      });
    }
  };

  const handleFilterDateChange = (e) => {
    setfilterdate(e);
    setspacialdate("");
    if (e !== "") {
      getResponseAxios({ ...data, type: "day", day: e });
    }
  };

  const handleSpacialFilterDateChange = (e) => {
    setspacialdate(e);
    setfilterdate("");
    if (e !== "") {
      getResponseAxios({ ...data, type: e });
    }
  };

  const resetFilter = (e) => {
    getResponseAxios({ ...data });
  };

  const getResponseAxios = (data) => {
    let sentData = {
      ...(data || {}),
      type: data?.type || "30days",
    };
    if (sentData.institution_targeted_id === "") {
      delete sentData.institution_targeted_id;
    }
    setLoader(true);

    axios
      .post(appConfig.apiDomaine + "/dashboard", sentData)
      .then((response) => {
        setLoader(false);

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
          console.log("Something is wrong");
        });
    }

    if (verifyTokenExpire()) fetchData();
  }, []);

  const onChangeInstitution = (selected) => {
    const newData = { ...data };
    setLoad(true);

    if (selected) {
      newData.institution_targeted_id = selected.value;
      setInstitution(selected);
      getResponseAxios(newData);
    } else {
      newData.institution_targeted_id = "";
      setInstitution(null);
      getResponseAxios();
    }
    setData(newData);
  };
  return (
    <div
      className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor position-relative"
      id="kt_content"
    >
      <div className="kt-subheader   kt-grid__item" id="kt_subheader">
        <div className="kt-container  kt-container--fluid ">
          <div className="kt-subheader__main">
            <h3 className="kt-subheader__title">Tableau de bord</h3>
          </div>
          {verifyPermission(
            props.userPermissions,
            "show-dashboard-data-all-institution"
          ) ? (
            <div className={"col-5"}>
              <div className={"form-group row"}>
                <label
                  className="col-xl-3 col-lg-3 col-form-label"
                  htmlFor="exampleSelect1"
                >
                  Institution
                </label>
                <div className="col-lg-9 col-xl-8">
                  {dataInstitution ? (
                    <Select
                      isClearable
                      classNamePrefix="select"
                      placeholder={"Choisissez une institution pour le filtre"}
                      className="basic-single"
                      value={institution}
                      onChange={onChangeInstitution}
                      options={formatSelectOption(
                        dataInstitution,
                        "name",
                        false
                      )}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
        {response && component && !load ? (
          <div>
            <div>
              <DashboardFilterRow
                dateEnd={dateEnd}
                dateStart={dateStart}
                handleDateStartChange={handleDateStartChange}
                handleDateEndChange={handleDateEndChange}
                handleFilterDateChange={handleFilterDateChange}
                response={response}
                filterdate={filterdate}
                component={component}
                spacialdate={spacialdate}
                setspacialdate={handleSpacialFilterDateChange}
                resetFilter={resetFilter}
              />
            </div>

            {verifyPermission(
              props.userPermissions,
              "show-dashboard-data-all-institution"
            ) ? (
              <div className="kt-portlet">
                <DashboardClaimsAll
                  response={response}
                  component={component}
                  dateEnd={dateEnd}
                  dateStart={dateStart}
                  filterdate={filterdate}
                  spacialdate={spacialdate}
                />
              </div>
            ) : null}

            {verifyPermission(
              props.userPermissions,
              "show-dashboard-data-my-institution"
            ) ? (
              <div className="kt-portlet position-relative">
                {loader && (
                  <div className="overlay-loader">
                    <LoadingTable />
                  </div>
                )}

                <DashboardClaimsMy
                  response={response}
                  component={component}
                  dateEnd={dateEnd}
                  dateStart={dateStart}
                  filterdate={filterdate}
                  spacialdate={spacialdate}
                />
              </div>
            ) : null}

            {verifyPermission(
              props.userPermissions,
              "show-dashboard-data-my-unit"
            ) ? (
              <div className="kt-portlet  position-relative">
                {loader && (
                  <div className="overlay-loader">
                    <LoadingTable />
                  </div>
                )}

                <DashboardClaimsUnit
                  response={response}
                  component={component}
                  dateEnd={dateEnd}
                  dateStart={dateStart}
                  filterdate={filterdate}
                  spacialdate={spacialdate}
                />
              </div>
            ) : null}

            {verifyPermission(
              props.userPermissions,
              "show-dashboard-data-my-activity"
            ) ? (
              <div className="kt-portlet position-relative">
                {loader && (
                  <div className="overlay-loader">
                    <LoadingTable />
                  </div>
                )}

                <DashboardClaimsActivity
                  response={response}
                  component={component}
                  dateEnd={dateEnd}
                  dateStart={dateStart}
                  filterdate={filterdate}
                  spacialdate={spacialdate}
                />
              </div>
            ) : null}

            <div className=" position-relative">
              {loader && <div className="overlay-loader"></div>}

              <DashboardSummaryReport
                response={response}
                component={component}
                dateEnd={dateEnd}
                dateStart={dateStart}
                filterdate={filterdate}
                spacialdate={spacialdate}
              />
            </div>

            <div className=" position-relative">
              {loader && <div className="overlay-loader"></div>}

              <GraphChannel
                response={response}
                component={component}
                dateEnd={dateEnd}
                dateStart={dateStart}
                filterdate={filterdate}
                spacialdate={spacialdate}
              />
            </div>

            <div className=" position-relative">
              {loader && <div className="overlay-loader"></div>}

              <DashboardStatClaim
                response={response}
                component={component}
                dateEnd={dateEnd}
                dateStart={dateStart}
                filterdate={filterdate}
                spacialdate={spacialdate}
              />
            </div>

            <div className=" position-relative">
              {loader && <div className="overlay-loader"></div>}

              <DashboardStatistic
                response={response}
                component={component}
                dateEnd={dateEnd}
                dateStart={dateStart}
                filterdate={filterdate}
                spacialdate={spacialdate}
              />
            </div>
            {!data.institution_targeted_id ? (
              <div>
                {verifyPermission(
                  props.userPermissions,
                  "show-dashboard-data-all-institution"
                ) &&
                verifyPermission(
                  props.userPermissions,
                  "show-dashboard-data-my-institution"
                ) ? (
                  <div className="kt-portlet position-relative">
                    {loader && (
                      <div className="overlay-loader">
                        <LoadingTable />
                      </div>
                    )}

                    {/*<ClaimToInstitution response={response}/>*/}
                    <DashboardPieChart
                      response={response}
                      component={component}
                      dateEnd={dateEnd}
                      dateStart={dateStart}
                      filterdate={filterdate}
                      spacialdate={spacialdate}
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              ""
            )}
            <div>
              {!verifyPermission(
                props.userPermissions,
                "show-dashboard-data-all-institution"
              ) &&
              verifyPermission(
                props.userPermissions,
                "show-dashboard-data-my-institution"
              ) ? (
                <div className="kt-portlet position-relative">
                  {loader && <div className="overlay-loader"></div>}

                  <ClaimToPointOfServices
                    response={response}
                    component={component}
                    dateEnd={dateEnd}
                    dateStart={dateStart}
                    filterdate={filterdate}
                    spacialdate={spacialdate}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <LoadingTable />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userPermissions: state.user.user.permissions,
  };
};

export default connect(mapStateToProps)(Dashboards);
