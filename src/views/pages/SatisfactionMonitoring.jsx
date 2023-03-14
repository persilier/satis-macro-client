import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import InfirmationTable from "../components/InfirmationTable";
import HeaderTablePage from "../components/HeaderTablePage";
import Select from "react-select";
import { ToastBottomEnd } from "../components/Toast";
import {
  toastInvalidPeriodMessageConfig,
  toastValidPeriodMessageConfig,
} from "../../config/toastConfig";
import { verifyPermission } from "../../helpers/permission";
import EmptyTable from "../components/EmptyTable";
import Pagination from "../components/Pagination";
import { ERROR_401 } from "../../config/errorPage";
import axios from "axios";
import appConfig from "../../config/appConfig";
import {
  forceRound,
  getLowerCaseString,
  truncateString,
  formatDateToTime,
  showDatePassed2,
  formatSelectOption,
  loadCss,
  loadScript,
  formatDate,
} from "../../helpers/function";

import { verifyTokenExpire } from "../../middleware/verifyToken";
import HtmlDescription from "../components/DescriptionDetail/HtmlDescription";
import HtmlDescriptionModal from "../components/DescriptionDetail/HtmlDescriptionModal";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Loader from "../components/Loader";
import { platform } from "chart.js";

loadCss("/assets/plugins/custom/kanban/kanban.bundle.css");
loadCss("/assets/css/pages/wizard/wizard-2.css");
loadScript("/assets/js/pages/custom/wizard/wizard-2.js");
loadScript("/assets/js/pages/custom/chat/chat.js");

const SatisfactionMonitoring = (props) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  document.title = "Satis client - " + ready ? t("Commentaires des réseaux sociaux") : "";
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startDate, setStartDate] = useState(
    moment()
      .startOf("month")
      .format("YYYY-MM-DD")
  );
  const [keyword, setkeyword] = useState("");
  const [claims, setClaims] = useState([]);
  const [numberPerPage, setNumberPerPage] = useState(10);
  const [activeNumberPage, setActiveNumberPage] = useState(1);
  const [search, setSearch] = useState(false);
  const [numberPage, setNumberPage] = useState(10);
  const [showList, setShowList] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [Canaux, setCanaux] = useState([]);
  const [isLoad, setLoad] = useState(false);
  const [api_key, set_api_key] = useState(null);

  useEffect(() => {
    axios
      .get(`${appConfig.apiDomaine}/configurations/satisfaction-data-config`)
      .then((res) => set_api_key(res.data.api_key));
  }, []);

  useEffect(() => {
    if (verifyTokenExpire() && api_key) {
      axios
        .get(
          `http://212.83.146.159:5550/api/v1/dash/tweets?page=${activeNumberPage ??
            0}&size=${numberPage ?? 10}&platform=${Canaux?.map?.(
            (item) => item?.value
          )?.join?.(",")}&startDate=${startDate ?? ""}&endDate=${endDate ??
            ""}&keyword=${keyword ?? ""}`,
          {
            headers: {
              Authorization: `Bearer ${api_key}`,
              "App-name": `${appConfig?.enterprise}`,
            },
          }
        )
        .then((response) => {
          setNumberPage(forceRound(response.data.count / numberPerPage));
          setShowList(response.data.results.data.slice(0, numberPerPage));
          setClaims(response.data.results.data);
          setTotal(response.data.count);
          setPrevUrl(response.data.previous);
          setNextUrl(response.data.next);
          setLoad(false);
        })
        .catch((error) => {
          setLoad(false);
          console.log("Something is wrong");
        });
    }
  }, [
    numberPage,
    Canaux,
    activeNumberPage,
    api_key,
    keyword,
    endDate,
    startDate,
  ]);

  const onChangeStartDate = (e) => {
    if (endDate && e.target.value) {
      if (!(new Date(endDate) >= new Date(e.target.value)))
        ToastBottomEnd.fire(toastInvalidPeriodMessageConfig());
      else ToastBottomEnd.fire(toastValidPeriodMessageConfig());
    }
    setStartDate(e.target.value);
  };

  const onChangeEndDate = (e) => {
    if (startDate && e.target.value) {
      if (!(new Date(startDate) <= new Date(e.target.value)))
        ToastBottomEnd.fire(toastInvalidPeriodMessageConfig());
      else ToastBottomEnd.fire(toastValidPeriodMessageConfig());
    }
    setEndDate(e.target.value);
  };

  const onChangeNumberPerPage = (e) => {
    e.persist();
    setNumberPerPage(parseInt(e.target.value));
  };

  const onClickPage = (e, page) => {
    e.preventDefault();
    setActiveNumberPage(page);
  };

  const onClickNextPage = (e) => {
    e.preventDefault();
    if (activeNumberPage <= numberPage && nextUrl !== null) {
      setActiveNumberPage(activeNumberPage + 1);
    }
  };

  const onClickPreviousPage = (e) => {
    e.preventDefault();
    if (activeNumberPage >= 1 && prevUrl !== null) {
      setActiveNumberPage(activeNumberPage - 1);
    }
  };

  const arrayNumberPage = () => {
    const pages = [];
    for (let i = 0; i < numberPage; i++) {
      pages[i] = i;
    }
    return pages;
  };

  const pages = arrayNumberPage();

  const printBodyTable = (item, index) => {
    return (
      <tr key={index} role="row" className="odd">
        <td>{index}</td>
        <td>{item.author}</td>
        <td>
          <span style={{ display: "flex", alignItems: "center" }}>
            {item.source === "twitter" ? (
              <i
                style={{ fontSize: "18px", color: "rgba(0,0,255,.6)" }}
                className="socicon-twitter mt-2 mr-2"
              />
            ) : (
              <i
                style={{ fontSize: "18px", color: "rgba(0,0,255,.6)" }}
                className="socicon-facebook mt-2 mr-2"
              />
            )}
            {item.source}
          </span>
        </td>
        <td>{item.text}</td>
        <td> {moment(item.date).format("DD/MM/YY")} </td>
        <td style={{ textAlign: "center" }}>{item.sentiment}</td>
        <td>
          <a
            href={`https://twitter.com/me/status/${item?.text_id}`}
            target="_blank"
            className="btn btn-sm btn-clean btn-icon btn-icon-md"
            title={t("Détails")}
          >
            <i className="la la-eye" />
          </a>
        </td>
      </tr>
    );
  };

  return ready ? (
    <div
      className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
      id="kt_content"
    >
      <div className="kt-subheader   kt-grid__item" id="kt_subheader">
        <div className="kt-container  kt-container--fluid ">
          <div className="kt-subheader__main">
            <h3 className="kt-subheader__title">{t("Suivi")}</h3>
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
              >
                {t("Commentaires des réseaux sociaux")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
        <InfirmationTable
          information={t(
            "Cette interface permet d'effectuer le suivi des rétours fait par vos clients"
          )}
        />

        <div className="kt-portlet">
          <HeaderTablePage title={t("Commentaires des réseaux sociaux")} />

          <div className="kt-portlet__body">
            <div className="form-group row bg-light pt-3 rounded">
              <div className="col">
                <div className="form-group row" style={{ marginRight: "12px" }}>
                  <div className={"col"}>
                    <label htmlFor="unite">{t("Canaux")}</label>
                    <Select
                      isClearable={true}
                      isMulti={true}
                      placeholder={t("Veuillez sélectionner les canaux ")}
                      value={Canaux}
                      onChange={(e) => setCanaux(e)}
                      options={[
                        {
                          label: "Commentaires facebook",
                          value: "facebook-comments",
                        },
                        {
                          label: "Messages facebook",
                          value: "facebook-messages",
                        },
                        {
                          label: "Les Tweets",
                          value: "tweets",
                        },
                      ]}
                    />
                  </div>
                  <div className={"col"}>
                    <label htmlFor="unite">{t("Recherche")}</label>
                    <input
                      id="name"
                      type="text"
                      className={"form-control"}
                      placeholder={t("Recherche")}
                      onChange={(e) => setkeyword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group row" style={{ marginRight: "12px" }}>
                  <div className={"col"}>
                    <label htmlFor="startDate">{t("Date de début")}</label>
                    <input
                      type="date"
                      className="w-100 form-control"
                      value={startDate}
                      onChange={(e) => onChangeStartDate(e)}
                    />
                  </div>

                  <div className={"col"}>
                    <label htmlFor="endDate">{"Date de fin"}</label>
                    <input
                      type="date"
                      className="w-100 form-control"
                      value={endDate}
                      onChange={(e) => onChangeEndDate(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
            {isLoad ? (
              <div className="position-relative">
                <Loader />
              </div>
            ) : (
              <div className="kt-portlet__body">
                <div
                  id="kt_table_1_wrapper"
                  className="dataTables_wrapper dt-bootstrap4"
                >
                  <div className="row">
                    <div className="col-sm-12">
                      <table
                        className="table table-striped table-bordered table-hover table-checkable dataTable dtr-inline"
                        id="myTable"
                        role="grid"
                        aria-describedby="kt_table_1_info"
                        style={{ width: "952px" }}
                      >
                        <thead>
                          <tr role="row">
                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              rowSpan="1"
                              colSpan="1"
                              style={{ width: "70.25px" }}
                              aria-label="Country: activate to sort column ascending"
                            >
                              {t("ID")}
                            </th>
                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              rowSpan="1"
                              colSpan="1"
                              style={{ width: "70.25px" }}
                              aria-label="Country: activate to sort column ascending"
                            >
                              {t("Auteur")}
                            </th>
                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              rowSpan="1"
                              colSpan="1"
                              style={{ width: "70.25px" }}
                              aria-label="Country: activate to sort column ascending"
                            >
                              {t("Origine")}
                            </th>
                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              rowSpan="1"
                              colSpan="1"
                              style={{ width: "70.25px" }}
                              aria-label="Country: activate to sort column ascending"
                            >
                              {t("Avis/Commentaire")}
                            </th>
                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              rowSpan="1"
                              colSpan="1"
                              style={{ width: "70.25px" }}
                              aria-label="Country: activate to sort column ascending"
                            >
                              {t("Date")}
                            </th>
                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              rowSpan="1"
                              colSpan="1"
                              style={{ width: "70.25px" }}
                              aria-label="Country: activate to sort column ascending"
                            >
                              {t("Impressions")}
                            </th>
                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              rowSpan="1"
                              colSpan="1"
                              style={{ width: "40.25px" }}
                              aria-label="Type: activate to sort column ascending"
                            >
                              {t("Lien")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {claims.length ? (
                            search ? (
                              showList.map((claim, index) =>
                                printBodyTable(claim, index)
                              )
                            ) : (
                              showList.map((claim, index) =>
                                printBodyTable(claim, index)
                              )
                            )
                          ) : (
                            <EmptyTable />
                          )}
                        </tbody>
                        <tr role="row">
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "70.25px" }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            {t("ID")}
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "70.25px" }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            {t("Auteur")}
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "70.25px" }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            {t("Origine")}
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "70.25px" }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            {t("Avis/Commentaire")}
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "70.25px" }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            {t("Date")}
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "70.25px" }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            {t("Impressions")}
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "40.25px" }}
                            aria-label="Type: activate to sort column ascending"
                          >
                            {t("Lien")}
                          </th>
                        </tr>
                      </table>
                      <button
                        id="button_modal"
                        type="button"
                        className="btn btn-secondary btn-icon-sm d-none"
                        data-toggle="modal"
                        data-target="#message_email"
                      />
                      <HtmlDescriptionModal
                        title={t("Description")}
                        message={currentMessage}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-md-5">
                      <div
                        className="dataTables_info"
                        id="kt_table_1_info"
                        role="status"
                        aria-live="polite"
                      >
                        {t("Affichage de")} 1 {t("à")} {numberPerPage}{" "}
                        {t("sur")} {total} {t("données")}
                      </div>
                    </div>

                    {!search ? (
                      <div className="col-sm-12 col-md-7 dataTables_pager">
                        <Pagination
                          numberPerPage={numberPerPage}
                          onChangeNumberPerPage={onChangeNumberPerPage}
                          activeNumberPage={activeNumberPage}
                          onClickPreviousPage={(e) => onClickPreviousPage(e)}
                          pages={pages}
                          onClickPage={(e, number) => onClickPage(e, number)}
                          numberPage={numberPage}
                          onClickNextPage={(e) => onClickNextPage(e)}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    userPermissions: state.user.user.permissions,
    plan: state.plan.plan,
    lead: state?.user?.user?.staff?.is_pilot_lead || false,
    staff: state?.user?.user?.staff?.id || null,
  };
};

export default connect(mapStateToProps)(SatisfactionMonitoring);
