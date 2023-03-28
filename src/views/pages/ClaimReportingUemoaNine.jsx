import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { verifyPermission } from "../../helpers/permission";
import InfirmationTable from "../components/InfirmationTable";
import HeaderTablePage from "../components/HeaderTablePage";
import LoadingTable from "../components/LoadingTable";
import EmptyTable from "../components/EmptyTable";
import { ERROR_401 } from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import {
  formatSelectOption,
  getLowerCaseString,
  loadCss,
} from "../../helpers/function";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import { ToastBottomEnd } from "../components/Toast";
import { toastSuccessMessageWithParameterConfig } from "../../config/toastConfig";
import Select from "react-select";
import moment from "moment";
import InputRequire from "../components/InputRequire";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import { useTranslation } from "react-i18next";

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const ClaimReportingUemoaNine = (props) => {
  const { t, ready } = useTranslation();

  if (
    !(
      verifyPermission(
        props.userPermissions,
        "list-reporting-claim-any-institution"
      ) || verifyPermission(props.userPermissions, "bci-monthly-reports")
    )
  )
    window.location.href = ERROR_401;

  const [load, setLoad] = useState(true);
  const [claims, setClaims] = useState({});
  const [total, setTotal] = useState({});

  const [numberPerPage, setNumberPerPage] = useState(10);
  const [year, setYear] = useState({
    value: moment().format("YYYY"),
    label: moment().format("YYYY"),
  });
  const [years, setYears] = useState([]);

  const [error, setError] = useState({
    year: [],
    institution_id: [],
  });
  const defaultError = {
    year: [],
    institution_id: [],
  };
  const defaultData = { institution_targeted_id: "" };
  const [loadFilter, setLoadFilter] = useState(false);
  const [loadDownload, setLoadDownload] = useState(false);
  const [loadDownloadPdf, setLoadDownloadPdf] = useState(false);
  const [institution, setInstitution] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [data, setData] = useState(defaultData);

  const getResponseAxios = (data) => {
    var endpoint = "";
    if (
      verifyPermission(
        props.userPermissions,
        "list-reporting-claim-any-institution"
      ) ||
      verifyPermission(props.userPermissions, "bci-monthly-reports")
    ) {
      if (props.plan === "MACRO") {
        endpoint = `${appConfig.apiDomaine}/any/units/create`;
      } else {
        endpoint = `${appConfig.apiDomaine}/without/uemoa/data-filter`;
      }
    }
    if (
      verifyPermission(
        props.userPermissions,
        "list-reporting-claim-my-institution"
      )
    )
      endpoint = `${appConfig.apiDomaine}/my/uemoa/data-filter`;

    if (verifyTokenExpire()) {
      axios
        .get(endpoint)
        .then((response) => {
          if (
            verifyPermission(
              props.userPermissions,
              "list-reporting-claim-any-institution"
            )
          ) {
            setInstitutions(
              formatSelectOption(response.data.institutions, "name", false)
            );
          } else if (
            verifyPermission(props.userPermissions, "bci-monthly-reports")
          ) {
            setInstitutions(
              formatSelectOption(response.data.institutions, "name", false)
            );
          }
        })
        .catch((error) => console.log("Something is wrong"));
    }
  };
  const fetchData = async (click = false) => {
    setLoadFilter(true);
    setLoad(true);
    let endpoint = "";
    let endpointYear = `${appConfig.apiDomaine}/satis-years`;
    let sendData = {};
    if (
      verifyPermission(
        props.userPermissions,
        "list-reporting-claim-any-institution"
      ) ||
      verifyPermission(props.userPermissions, "bci-monthly-reports")
    ) {
      endpoint = `${appConfig.apiDomaine}/bci-reports/global`;
      sendData = {
        year: year ? year.value : null,
        institution_id: institution ? institution.value : null,
      };
      if (props.plan === "HUB") {
        console.log("hub");
      }
    }

    await axios
      .post(endpoint, sendData)
      .then((response) => {
        if (click)
          ToastBottomEnd.fire(
            toastSuccessMessageWithParameterConfig(
              "Filtre effectué avec succès"
            )
          );

        let groupByMonthOrder = {};
        let tableMonth = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        tableMonth.forEach((e) =>
          response.data.reportData.hasOwnProperty(e)
            ? (groupByMonthOrder[e] = response.data.reportData[e])
            : null
        );

        let responseObject = new Map(Object.entries(groupByMonthOrder));
        setClaims(responseObject);
        setTotal(response.data.reportTotal);

        setError(defaultError);
        setLoadFilter(false);
        setLoad(false);
      })
      .catch((error) => {
        //console.log("erreur", error)
        setError({
          ...defaultError,
          ...error.response?.data?.reportData?.error,
        });
        setLoadFilter(false);
        setLoad(false);
      });
    await axios
      .get(endpointYear, sendData)
      .then((response) => {
        if (click)
          ToastBottomEnd.fire(
            toastSuccessMessageWithParameterConfig(
              "Filtre effectué avec succès"
            )
          );

        setYears(response.data.years);
        setError(defaultError);
        setLoadFilter(false);
        setLoad(false);
      })
      .catch((error) => {
        //console.log("erreur", error)
        setError({
          ...defaultError,
          ...error.response?.data?.year?.error,
        });
        setLoadFilter(false);
        setLoad(false);
      });

    getResponseAxios();
  };

  useEffect(() => {
    if (verifyTokenExpire()) fetchData();
  }, [numberPerPage]);

  const filterShowListBySearchValue = (value) => {
    value = getLowerCaseString(value);
    let newClaims = [...claims];
    newClaims = newClaims.filter((el) => {
      return (
        getLowerCaseString(el.filiale ? el.filiale : "-").indexOf(value) >= 0 ||
        getLowerCaseString(el.month ? el.month : "-").indexOf(value) >= 0 ||
        getLowerCaseString(el.claimCategorie ? el.claimCategorie : "-").indexOf(
          value
        ) >= 0 ||
        getLowerCaseString(el.claimObject ? el.claimObject : "-").indexOf(
          value
        ) >= 0 ||
        getLowerCaseString(el.totalReceived + "").indexOf(value) >= 0 ||
        getLowerCaseString(el.totalTreated + "").indexOf(value) >= 0 ||
        getLowerCaseString(el.totalRemaining + "").indexOf(value) >= 0 ||
        getLowerCaseString(el.totalTreatedOutDelay + "").indexOf(value) >= 0
      );
    });

    return newClaims;
  };

  const onChangeYear = (selected) => {
    setYear(selected ?? []);
  };
  const onChangeInstitution = (selected) => {
    const newData = { ...data };
    setLoad(true);

    if (selected) {
      newData.institution_targeted_id = selected.value;
      setInstitution(selected);
      fetchData(newData);
    } else {
      newData.institution_targeted_id = "";
      setInstitution(null);
      fetchData();
    }
    setData(newData);
  };

  const filterReporting = () => {
    setLoadFilter(true);
    setLoad(true);
    if (verifyTokenExpire()) fetchData(true).then();
  };

  //const pages = arrayNumberPage();

  const printBodyClaims = (claim, key, index) => {
    var claimMap = new Map(Object.entries(claim));
    return Array.from(claimMap.keys()).map(function(key1, index1) {
      return Array.from(new Map(Object.entries(claimMap.get(key1))).keys()).map(
        function(key2, index2) {
          var temp = new Map(Object.entries(claimMap.get(key1)));
          return Array.from(temp.get(key2)).map((el, indexClaim) => (
            <>
              {index !== 0 &&
              index1 === 0 &&
              index2 === 0 &&
              indexClaim === 0 ? (
                <tr>
                  <td
                    style={{ padding: "2px", backgroundColor: "#ffe0b3" }}
                    colSpan={11}
                  >
                    {""}
                  </td>
                </tr>
              ) : null}

              <tr key={key} role="row" className="odd">
                {index1 === 0 && index2 === 0 && indexClaim === 0 ? (
                  <td
                    style={{ textAlign: "center", fontWeight: "bold" }}
                    rowSpan={returnSizeByMonth(claimMap)}
                  >
                    {key && key !== "" ? monthToFrench(key) : "0"}
                  </td>
                ) : null}

                {key1 !== "total" ? (
                  index2 === 0 && indexClaim === 0 ? (
                    <td
                      style={{ textAlign: "center", fontWeight: "bold" }}
                      rowSpan={temp.size}
                    >
                      {key1 && key1 !== "" ? key1 : "0"}
                    </td>
                  ) : null
                ) : (
                  <td
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      backgroundColor: "#f2f2f2",
                    }}
                    colSpan={2}
                  >
                    Total{" "}
                  </td>
                )}

                {key2 !== "total" ? (
                  <td style={{ textAlign: "center", fontWeight: "bold" }}>
                    {key2 && key2 !== "" ? key2 : "0"}
                  </td>
                ) : null}

                <td>
                  {el.initialStock || el.totalInitialStock
                    ? el.initialStock || el.totalInitialStock
                    : "0"}
                </td>
                <td>{el.totalReceived ? el.totalReceived : "0"}</td>
                <td>{el.totalTreated ? el.totalTreated : "0"}</td>
                <td>{el.totalRemaining ? el.totalRemaining : "0"}</td>
                <td>
                  {el.totalTreatedOutDelay ? el.totalTreatedOutDelay : "0"}
                </td>
                <td>
                  {el.totalRemainingOutDelay ? el.totalRemainingOutDelay : "0"}
                </td>
                <td>
                  {el.totalTreatedOutRegulatoryDelay
                    ? el.totalTreatedOutRegulatoryDelay
                    : "0"}
                </td>
                <td>
                  {el.totalRemainingOutRegulatoryDelay
                    ? el.totalRemainingOutRegulatoryDelay
                    : "0"}
                </td>
              </tr>
            </>
          ));
        }
      );
    });
  };

  const returnSizeByMonth = (claimMap) => {
    var size = 0;
    Array.from(claimMap.keys()).map(function(key1, index1) {
      var claimMap1 = new Map(Object.entries(claimMap.get(key1)));
      Array.from(claimMap1.keys()).map(function(key2, index1) {
        //var claimMap2 = new Map(Object.entries(claimMap1.get(key2)))
        size = size + claimMap1.get(key2).length;
      });
    });
    //console.log("return size",size)
    return size;
  };

  const monthToFrench = (month) => {
    let tableMonth = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let tableMonthFrench = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    var monthIndex = tableMonth.indexOf(month);
    return tableMonthFrench[monthIndex];
  };

  const downloadReportingPdf = () => {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    let doc = document.cloneNode(true);
    let tablePdf = doc.getElementById("myTable").outerHTML;
    let val = htmlToPdfmake(tablePdf, { tableAutoSize: true });
    let dd = {
      content: val,
      pageOrientation: "landscape",
      // pageOrientation: "portrait",
    };
    pdfMake.createPdf(dd).download();
  };

  return verifyPermission(
    props.userPermissions,
    "list-reporting-claim-any-institution"
  ) || verifyPermission(props.userPermissions, "bci-monthly-reports") ? (
    <div
      className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
      id="kt_content"
    >
      <div className="kt-subheader   kt-grid__item" id="kt_subheader">
        <div className="kt-container  kt-container--fluid ">
          <div className="kt-subheader__main">
            <h3 className="kt-subheader__title">Processus</h3>
            <span className="kt-subheader__separator kt-hidden" />
            <div className="kt-subheader__breadcrumbs">
              <a href="#icone" className="kt-subheader__breadcrumbs-home">
                <i className="flaticon2-shelter" />
              </a>
              <span className="kt-subheader__breadcrumbs-separator" />
              <a
                href="#button"
                onClick={(e) => e.preventDefault()}
                className="kt-subheader__breadcrumbs-link"
                style={{ cursor: "text" }}
              >
                Etat Suivi des réclamations
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
        <InfirmationTable
          information={
            <div>
              {t(
                "Rapport de l'état de suivi des réclamations générées mensuellement sur une année"
              )}
            </div>
          }
        />

        <div className="kt-portlet">
          <HeaderTablePage title={"Rapport Etat suivi de réclamation"} />

          <div className="kt-portlet__body">
            <div className="row">
              {verifyPermission(
                props.userPermissions,
                "show-dashboard-data-all-institution"
              ) ? (
                <div className="col">
                  <div
                    className={
                      error.institution_id.length
                        ? "form-group validated"
                        : "form-group"
                    }
                  >
                    <label htmlFor="">Institution</label>
                    <Select
                      isClearable
                      value={institution}
                      placeholder={t("Veuillez sélectionner l'institution")}
                      onChange={onChangeInstitution}
                      options={institutions}
                    />

                    {error.institution_id.length
                      ? error.institution_id.map((error, index) => (
                          <div key={index} className="invalid-feedback">
                            {error}
                          </div>
                        ))
                      : null}
                  </div>
                </div>
              ) : null}

              <div className="col">
                <div className="form-group">
                  <label htmlFor="">
                    {" "}
                    Année <InputRequire />
                  </label>
                  <Select
                    isClearable
                    value={year}
                    placeholder={"Veuillez sélectionner l'année"}
                    onChange={onChangeYear}
                    options={years}
                  />

                  {error.year.length
                    ? error.year.map((error, index) => (
                        <div key={index} className="invalid-feedback">
                          {error}
                        </div>
                      ))
                    : null}
                </div>
              </div>

              <div className="col-md-12">
                <div className="form-group d-flex justify-content-end">
                  <a
                    className="d-none"
                    href="#"
                    id="downloadButton"
                    download={true}
                  >
                    downloadButton
                  </a>
                  {loadFilter ? (
                    <button
                      className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                      type="button"
                      disabled
                    >
                      Chargement...
                    </button>
                  ) : (
                    <button
                      onClick={filterReporting}
                      className="btn btn-primary"
                      disabled={loadDownload || loadDownloadPdf}
                    >
                      Filtrer le rapport
                    </button>
                  )}

                  {loadDownload ? (
                    <button
                      className="btn btn-secondary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--dark ml-3"
                      type="button"
                      disabled
                    >
                      Chargement...
                    </button>
                  ) : (
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button"
                      className="btn btn-secondary ml-3"
                      table="myExcel"
                      filename="rapport_état_suivi-réclamation"
                      sheet="état-suivi-réclamation"
                      buttonText="EXCEL"
                    />
                  )}

                  {loadDownloadPdf ? (
                    <button
                      className="btn btn-secondary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--dark ml-3"
                      type="button"
                      disabled
                    >
                      Chargement...
                    </button>
                  ) : (
                    <button
                      onClick={downloadReportingPdf}
                      className="btn btn-secondary ml-3"
                      disabled={loadFilter || loadDownload}
                    >
                      PDF
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {load ? (
            <LoadingTable />
          ) : (
            <div className="kt-portlet__body">
              <div
                id="kt_table_1_wrapper"
                className="dataTables_wrapper dt-bootstrap4"
              >
                <div className="row">
                  <div
                    className="col-sm-12"
                    id="myTable"
                    style={{
                      overflowX: "auto",
                    }}
                  >
                    {/*  <div style={{display:"none"}} className="kt-header__brand " id="kt_header_brand">
                                                        <div className="kt-header__brand-logo">
                                                            <a href="index.html">
                                                                <img alt="Logo" className="text-right" src="/assets/images/satisLogo.png" width={"100"} height={"34"}/>
                                                                <span className="mx-2 text-white font-weight-bolder">{props.plan}</span>
                                                            </a>
                                                        </div>
                                                    </div>*/}

                    <table
                      className="mb-4 table table-striped table-bordered table-hover table-checkable dataTable dtr-inline"
                      role="grid"
                      aria-describedby="kt_table_1_info"
                      cellSpacing={"2"}
                      cellPadding={"2"}
                      width={"100%"}
                      style={{
                        display: "none",
                        width: "952px",
                        marginBottom: "20px",
                      }}
                    >
                      <thead>
                        <tr
                          className={"text-center"}
                          style={{ padding: "15px" }}
                          role={"row"}
                        >
                          <th
                            style={{
                              backgroundColor: "#fc9921",
                              width: "85%",
                              fontWeight: "bold",
                              textAlign: "center",
                              color: "white",
                            }}
                          >
                            ÉTAT DE SUIVI DES RÉCLAMATIONS
                          </th>
                          <th
                            style={{
                              width: "15%",
                              fontWeigth: "bold",
                              textAlign: "right",
                            }}
                          >
                            {year ? year.value : year.value}
                          </th>
                        </tr>
                      </thead>
                    </table>

                    <table
                      id="myExcel"
                      className="table table-striped table-bordered table-hover table-checkable dataTable dtr-inline"
                      role="grid"
                      aria-describedby="kt_table_1_info"
                      style={{ width: "952px" }}
                    >
                      <thead>
                        <tr className="tableHeader" role={"row"}>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            style={{
                              color: "white",
                              backgroundColor: "#fc9921",
                            }}
                            aria-label="Country: activate to sort column ascending"
                            rowSpan={2}
                          >
                            Mois
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            style={{
                              color: "white",
                              backgroundColor: "#fc9921",
                              width: "150px",
                            }}
                            aria-label="Country: activate to sort column ascending"
                            rowSpan={2}
                          >
                            Catégories
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            style={{
                              color: "white",
                              backgroundColor: "#fc9921",
                              width: "200px",
                            }}
                            aria-label="Country: activate to sort column ascending"
                            rowSpan={2}
                          >
                            Objets
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            style={{
                              color: "white",
                              backgroundColor: "#fc9921",
                            }}
                            aria-label="Country: activate to sort column ascending"
                            rowSpan={2}
                          >
                            Stock initial
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            style={{
                              color: "white",
                              backgroundColor: "#fc9921",
                            }}
                            aria-label="Country: activate to sort column ascending"
                            rowSpan={2}
                          >
                            Entrées
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            style={{
                              color: "white",
                              backgroundColor: "#fc9921",
                            }}
                            aria-label="Country: activate to sort column ascending"
                            rowSpan={2}
                          >
                            Sorties
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            style={{
                              color: "white",
                              backgroundColor: "#fc9921",
                            }}
                            aria-label="Country: activate to sort column ascending"
                            rowSpan={2}
                          >
                            Stock restant
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            style={{
                              color: "white",
                              backgroundColor: "#fc9921",
                            }}
                            aria-label="Country: activate to sort column ascending"
                            colSpan={2}
                          >
                            Stock réclamation en retard
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            style={{
                              color: "white",
                              backgroundColor: "#fc9921",
                            }}
                            aria-label="Country: activate to sort column ascending"
                            colSpan={2}
                          >
                            Stock en retard règlementaire
                          </th>
                        </tr>
                        <tr>
                          <th
                            className="sorting"
                            aria-controls="kt_table_1"
                            style={{
                              backgroundColor: "#cccccc",
                              color: "black",
                            }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            Sortie
                          </th>
                          <th
                            className="sorting"
                            aria-controls="kt_table_1"
                            style={{
                              backgroundColor: "#cccccc",
                              color: "black",
                            }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            Restant
                          </th>
                          <th
                            className="sorting"
                            aria-controls="kt_table_1"
                            style={{
                              backgroundColor: "#cccccc",
                              color: "black",
                            }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            Sortie
                          </th>
                          <th
                            className="sorting"
                            aria-controls="kt_table_1"
                            style={{
                              backgroundColor: "#cccccc",
                              color: "black",
                            }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            Restant
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {claims?.size ? (
                          Array.from(claims.keys()).map(function(key, index) {
                            return printBodyClaims(claims.get(key), key, index);
                          })
                        ) : (
                          <EmptyTable />
                        )}
                      </tbody>

                      <tr style={{ fontWeight: "bold" }}>
                        <th
                          style={{
                            textAlign: "center",
                            backgroundColor: "#fc9921",
                            fontWeight: "bold",
                            color: "white",
                          }}
                          colSpan={3}
                        >
                          TOTAL
                        </th>
                        <th
                          style={{ color: "white", backgroundColor: "#fc9921" }}
                        >
                          {"0"}
                        </th>
                        <th
                          style={{ color: "white", backgroundColor: "#fc9921" }}
                        >
                          {total.totalReceived ?? "0"}
                        </th>
                        <th
                          style={{ color: "white", backgroundColor: "#fc9921" }}
                        >
                          {total.totalTreated ?? "0"}
                        </th>
                        <th
                          style={{ color: "white", backgroundColor: "#fc9921" }}
                        >
                          {total.totalRemaining ?? "0"}
                        </th>
                        <th
                          style={{ color: "white", backgroundColor: "#fc9921" }}
                        >
                          {total.totalTreatedOutDelay ?? "0"}
                        </th>
                        <th
                          style={{ color: "white", backgroundColor: "#fc9921" }}
                        >
                          {total.totalRemainingOutDelay ?? "0"}
                        </th>
                        <th
                          style={{ color: "white", backgroundColor: "#fc9921" }}
                        >
                          {total.totalTreatedOutRegulatoryDelay ?? "0"}
                        </th>
                        <th
                          style={{ color: "white", backgroundColor: "#fc9921" }}
                        >
                          {total.totalRemainingOutRegulatoryDelay ?? "0"}
                        </th>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    plan: state.plan.plan,
    userPermissions: state.user.user.permissions,
    activePilot: state.user.user.staff.is_active_pilot,
  };
};

export default connect(mapStateToProps)(ClaimReportingUemoaNine);
