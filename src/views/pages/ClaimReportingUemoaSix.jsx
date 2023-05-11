import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { verifyPermission } from "../../helpers/permission";
import InfirmationTable from "../components/InfirmationTable";
import HeaderTablePage from "../components/HeaderTablePage";
import LoadingTable from "../components/LoadingTable";
import { ERROR_401 } from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import {
  InstitutionLogoBase64,
  formatSelectOption,
  loadCss,
} from "../../helpers/function";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import { ToastBottomEnd } from "../components/Toast";
import { toastSuccessMessageWithParameterConfig } from "../../config/toastConfig";
import Select from "react-select";

import { useTranslation } from "react-i18next";
import moment from "moment";
import jsPDF from "jspdf";
import SoftLoader from "../components/shared/SoftLoader.jsx";

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const ClaimReportingUemoaSix = (props) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  if (
    !(
      verifyPermission(props.userPermissions, "system-any-efficiency-report") ||
      verifyPermission(props.userPermissions, "system-my-efficiency-report")
    )
  )
    window.location.href = ERROR_401;
  const [load, setLoad] = useState(false);
  const [loadFilter, setLoadFilter] = useState(false);

  const [loadDownloadPdf, setLoadDownloadPdf] = useState(false);

  const [treatmentefficacity, setTreatmentefficacity] = useState([]);
  const [dateStart, setDateStart] = useState(
    moment()
      .startOf("month")
      .format("YYYY-MM-DD")
  );
  const [institutionLogo, setInstitutionLogo] = useState(
    "/assets/images/satisLogo.png"
  );
  useEffect(() => {
    axios
      .get(appConfig.apiDomaine + `/any/uemoa/data-filter`)
      .then((response) => {
        setInstitutions(
          formatSelectOption(response?.data?.institutions ?? [], "name")
        );
      })
      .catch((error) => {
        console.log("Something Wrong");
      });
    return () => {};
  }, [institutionLogo]);

  const [dateEnd, setDateEnd] = useState(moment().format("YYYY-MM-DD"));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const defaultError = {
    date_start: [],
    date_end: [],
    institution_targeted_id: [],
  };

  const [error, setError] = useState(defaultError);
  const [loadDownload, setLoadDownload] = useState(false);
  const [institution, setInstitution] = useState(null);
  const [Institutions, setInstitutions] = useState([]);

  const fetchData = async (click = false) => {
    setLoadFilter(true);
    setLoad(true);
    let endpoint = "";
    let sendData = {
      date_start: dateStart ?? null,
      date_end: dateEnd ?? null,
      institution_id: institution?.value ?? null,
    };
    if (props.plan === "MACRO") {
      if (
        verifyPermission(
          props.userPermissions,
          "list-reporting-claim-any-institution"
        )
      )
        endpoint = `${appConfig.apiDomaine}/any/system-efficiency-report`;
      else endpoint = `${appConfig.apiDomaine}/my/system-efficiency-report`;

      if (props.plan === "HUB") {
      } else console.log("");
    } else if (
      verifyPermission(props.userPermissions, "system-my-efficiency-report")
    ) {
      endpoint = `${appConfig.apiDomaine}/my/system-efficiency-report`;
    }
    await axios
      .post(endpoint, sendData)
      .then((response) => {
        if (click)
          ToastBottomEnd.fire(
            toastSuccessMessageWithParameterConfig(
              ready ? t("Filtre effectué avec succès") : ""
            )
          );
        setTreatmentefficacity(response.data);
        setError(defaultError);
        setLoadFilter(false);
        setLoad(false);
        setTitle(response.data.title);
        setDescription(response.data.description);
      })
      .catch((error) => {
        console.log(error);
        setError({
          ...defaultError,
          ...error.response.data.error,
        });
        setLoadFilter(false);
        setLoad(false);
        console.log("Something is wrong");
      });
  };

  useEffect(() => {
    if (verifyTokenExpire()) {
      fetchData();
    }
  }, []);

  const handleDateEndChange = (e) => {
    setDateEnd(e.target.value);
  };

  const handleDateStartChange = (e) => {
    setDateStart(e.target.value);
  };

  const onChangeInstitution = (selected) => {
    setInstitution(selected);
  };

  const filterReporting = () => {
    setLoadFilter(true);
    setLoad(true);
    if (verifyTokenExpire()) fetchData(true);
  };

  const downloadReportingPdf = () => {
    setLoadDownloadPdf(true);
    const pdf = new jsPDF("l", "pt", "a4");
    const input = document.getElementById("tablable");
    let pWidth = pdf.internal.pageSize.width;
    let srcWidth = input.scrollWidth;
    let margin = 18;
    let scale = (pWidth - margin * 2) / srcWidth;
    pdf.setFont("times", "normal");
    pdf.html(input, {
      callback: function(pdf) {
        pdf.save("Rapport Efficacité traitement.pdf");
        setLoadDownloadPdf(false);
      },
      x: margin,
      y: margin,
      html2canvas: {
        scale: scale,
      },
    });
  };
  return ready ? (
    verifyPermission(
      props.userPermissions,
      "list-regulatory-reporting-claim-any-institution"
    ) ||
    verifyPermission(
      props.userPermissions,
      "list-reporting-claim-any-institution"
    ) ||
    verifyPermission(
      props.userPermissions,
      "list-regulatory-reporting-claim-my-institution"
    ) ? (
      <div
        className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
        id="kt_content"
      >
        <div className="kt-subheader   kt-grid__item" id="kt_subheader">
          <div className="kt-container  kt-container--fluid ">
            <div className="kt-subheader__main">
              <h3 className="kt-subheader__title">{t("Processus")}</h3>
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
                  {t("Efficacité traitement")}
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
                  "État complet de toutes les réclamations reçues sur une période donnée"
                )}
              </div>
            }
          />

          <div className="kt-portlet">
            <HeaderTablePage title={t("Rapport Efficacité traitement")} />
            <div className="kt-portlet__body">
              <div className="row">
                {verifyPermission(
                  props.userPermissions,
                  "list-reporting-claim-any-institution"
                ) && (
                  <div className="col">
                    <div
                      className={
                        error?.unit_targeted_id?.length
                          ? "form-group validated"
                          : "form-group"
                      }
                    >
                      <label htmlFor="">{t("Institution concernées")}</label>
                      <Select
                        isClearable
                        clearValue
                        value={institution}
                        isLoading={load}
                        placeholder={t("Veuillez sélectionner l'institution")}
                        onChange={onChangeInstitution}
                        options={Institutions?.length ? Institutions : []}
                      />
                      {Institutions.length > 3 ? (
                        <p
                          className={"mt-1"}
                          style={{
                            color: "red",
                            fontSize: "10px",
                            textAlign: "end",
                          }}
                        >
                          Vous avez atteint le nombre maximal d'institution à
                          sélectionner
                        </p>
                      ) : null}

                      {error.institution_targeted_id.length
                        ? error.unit_targeted_id.map((error, index) => (
                            <div key={index} className="invalid-feedback">
                              {error}
                            </div>
                          ))
                        : null}
                    </div>
                  </div>
                )}
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="">{t("Date de début")}</label>
                    <input
                      type="date"
                      onChange={handleDateStartChange}
                      className={
                        error.date_start.length
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      value={dateStart}
                    />

                    {error.date_start.length
                      ? error.date_start.map((error, index) => (
                          <div key={index} className="invalid-feedback">
                            {error}
                          </div>
                        ))
                      : null}
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    <label htmlFor="">{t("Date de fin")}</label>
                    <input
                      type="date"
                      onChange={handleDateEndChange}
                      className={
                        error.date_end.length
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      value={dateEnd}
                    />

                    {error.date_end.length
                      ? error.date_end.map((error, index) => (
                          <div key={index} className="invalid-feedback">
                            {error}
                          </div>
                        ))
                      : null}
                  </div>
                </div>

                {/*Bouton PDF EXCEL*/}
                <div className="col-md-12">
                  <div className="form-group d-flex justify-content-end">
                    <a
                      className="d-none"
                      href="/#"
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
                        {t("Chargement...")}
                      </button>
                    ) : (
                      <button
                        onClick={filterReporting}
                        className="btn btn-primary"
                        disabled={loadDownload || loadDownloadPdf}
                      >
                        {t("Filtrer le rapport")}
                      </button>
                    )}

                    {loadDownload ? (
                      <button
                        className="btn btn-secondary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--dark ml-3"
                        type="button"
                        disabled
                      >
                        {t("Chargement...")}
                      </button>
                    ) : (
                      <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="btn btn-secondary ml-3"
                        table="myExcel"
                        filename="rapport_efficacité-traitement"
                        sheet="efficacité-traitement"
                        buttonText="EXCEL"
                      />
                    )}

                    {loadDownloadPdf ? (
                      <button
                        className="btn btn-secondary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--dark ml-3"
                        type="button"
                        disabled
                      >
                        {t("Chargement...")}
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
                  className="dataTables_wrapper dt-bootstrap4 position-relative"
                >
                  <SoftLoader loader={loadDownloadPdf} />
                  <div id="tablable" className="row">
                    <div
                      className="col-12"
                      style={{ display: loadDownloadPdf ? "block" : "none" }}
                    >
                      <div
                        style={{ display: "block" }}
                        id="headReport"
                        className="headRapport ml-5 mt-5"
                      >
                        <div
                          className="mb-5 d-flex flex-column justify-content-center align-items-center"
                          style={{ textAlign: "justify" }}
                        >
                          <h4 style={{ textAlign: "center", marginBottom: 10 }}>
                            {title ? title.toUpperCase() : "-"}
                          </h4>
                          <img
                            id="Image1"
                            src={institutionLogo}
                            alt="logo"
                            className="mb-3"
                            style={{
                              maxWidth: "115px",
                              maxHeight: "115px",
                              textAlign: "center",
                            }}
                          />
                          <h6 className="mt-3 text-center">
                            Période : DU{" "}
                            {moment(dateStart).format("DD/MM/YYYY") +
                              " au " +
                              moment(dateEnd).format("DD/MM/YYYY")}
                          </h6>
                          <p style={{ textAlign: "left" }}>
                            {description ? description : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      id="myTable"
                      className="ml-3 col-sm-12"
                      style={{
                        overflowX: "auto",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      <table
                        id="myExcel"
                        className="table table-striped table-bordered table-hover table-checkable dataTable dtr-inline"
                        role="grid"
                        aria-describedby="kt_table_1_info"
                        style={{ width: "952px" }}
                      >
                        <thead>
                          <tr role="row">
                            <th
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              style={{ textAlign: "center" }}
                              aria-label="Country: activate to sort column ascending"
                            >
                              {t("Libellés")}
                            </th>
                            <th
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              style={{ textAlign: "center" }}
                              aria-label="Country: activate to sort column ascending"
                            >
                              {t("Valeurs")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>
                              {t(
                                "Nombre de plaintes reçues et non traitées sur la période"
                              )}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {treatmentefficacity.totalUntreatedClaims !==
                                undefined &&
                              treatmentefficacity.totalUntreatedClaims !== null
                                ? treatmentefficacity.totalUntreatedClaims
                                : "-"}
                            </td>
                          </tr>

                          <tr>
                            <td style={{ fontWeight: "bold" }}>
                              {t(
                                "Nombre de plaintes traitées sur la période et dans le délai"
                              )}{" "}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {treatmentefficacity.totalTreatedClaimsInTime !==
                                undefined &&
                              treatmentefficacity.totalTreatedClaimsInTime !==
                                null
                                ? treatmentefficacity.totalTreatedClaimsInTime
                                : "-"}
                            </td>
                          </tr>

                          <tr>
                            <td style={{ fontWeight: "bold" }}>
                              {t(
                                "Nombre de plaintes traitées sur la période et hors délai"
                              )}{" "}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {treatmentefficacity.totalTreatedClaimsOutOfTime !==
                                undefined &&
                              treatmentefficacity.totalTreatedClaimsOutOfTime !==
                                null
                                ? treatmentefficacity.totalTreatedClaimsOutOfTime
                                : "-"}
                            </td>
                          </tr>

                          <tr>
                            <td style={{ fontWeight: "bold" }}>
                              {t("Nombre de relance de la part des clients")}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {treatmentefficacity.totalRevivalClaims !==
                                undefined &&
                              treatmentefficacity.totalRevivalClaims !== null
                                ? treatmentefficacity.totalRevivalClaims
                                : "-"}
                            </td>
                          </tr>

                          <tr>
                            <td style={{ fontWeight: "bold" }}>
                              {t("Taux de satisfaction sur la période")}{" "}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {treatmentefficacity.rateOfSatisfaction !==
                                undefined &&
                              treatmentefficacity.rateOfSatisfaction !== null
                                ? treatmentefficacity.rateOfSatisfaction + "%"
                                : "-"}
                            </td>
                          </tr>

                          <tr>
                            <td style={{ fontWeight: "bold" }}>
                              {t("Taux de non satisfaction sur la période")}{" "}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {treatmentefficacity.rateOfNotSatisfaction !==
                                undefined &&
                              treatmentefficacity.rateOfNotSatisfaction !== null
                                ? treatmentefficacity.rateOfNotSatisfaction +
                                  "%"
                                : "-"}
                            </td>
                          </tr>

                          <tr>
                            <td style={{ fontWeight: "bold" }}>
                              {" "}
                              {t(
                                "Nombre de jour moyen de traitement d'une plainte"
                              )}{" "}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {treatmentefficacity.averageNumberOfDaysForTreatment !==
                                undefined &&
                              treatmentefficacity.averageNumberOfDaysForTreatment !==
                                null
                                ? treatmentefficacity.averageNumberOfDaysForTreatment
                                : "-"}
                            </td>
                          </tr>

                          {props.plan === "MACRO" &&
                          verifyPermission(
                            props.userPermissions,
                            "list-reporting-claim-any-institution"
                          ) ? (
                            <>
                              <tr>
                                <td style={{ fontWeight: "bold" }}>
                                  {" "}
                                  {t(
                                    "Taux de satisfaction des réclamations sur la période"
                                  )}{" "}
                                </td>
                                <td
                                  style={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {" "}
                                  965
                                </td>
                              </tr>

                              <tr>
                                <td style={{ fontWeight: "bold" }}>
                                  {" "}
                                  {t(
                                    "Nombre de jour moyen de traitement d'une plainte"
                                  )}{" "}
                                </td>
                                <td
                                  style={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {" "}
                                  14756
                                </td>
                              </tr>
                            </>
                          ) : null}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th>{t("Libellés")}</th>
                            <th style={{ textAlign: "center" }}>
                              {t("Valeurs")}
                            </th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ) : null
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    plan: state.plan.plan,
    userPermissions: state.user.user.permissions,
    activePilot: state.user.user.staff.is_active_pilot,
  };
};

export default connect(mapStateToProps)(ClaimReportingUemoaSix);
