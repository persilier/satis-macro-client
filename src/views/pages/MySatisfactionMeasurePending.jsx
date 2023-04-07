import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  loadCss,
  filterDataTableBySearchValue,
  forceRound,
  formatDateToTime,
  reduceCharacter,
  getLowerCaseString,
  showDatePassed2,
} from "../../helpers/function";
import LoadingTable from "../components/LoadingTable";
import appConfig from "../../config/appConfig";
import Pagination from "../components/Pagination";
import EmptyTable from "../components/EmptyTable";
import HeaderTablePage from "../components/HeaderTablePage";
import InfirmationTable from "../components/InfirmationTable";
import { ERROR_401 } from "../../config/errorPage";
import { verifyPermission } from "../../helpers/permission";
import { connect } from "react-redux";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import { useTranslation } from "react-i18next";
import HtmlDescriptionModal from "../components/DescriptionDetail/HtmlDescriptionModal";
import HtmlDescription from "../components/DescriptionDetail/HtmlDescription";
import ls from "localstorage-slim";

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const endPointConfig = {
  PRO: {
    plan: "PRO",
    list: `${appConfig.apiDomaine}/my/staff-claim-for-satisfaction-measured?type=unsatisfied`,
  },
  MACRO: {
    holding: {
      list: `${appConfig.apiDomaine}/my/staff-claim-for-satisfaction-measured?type=unsatisfied`,
    },
    filial: {
      list: `${appConfig.apiDomaine}/my/staff-claim-for-satisfaction-measured?type=unsatisfied`,
    },
  },
  HUB: {
    plan: "HUB",
    list: `${appConfig.apiDomaine}/any/claim-satisfaction-measured`,
  },
};

const MySatisfactionMeasurePending = (props) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  document.title = ready ? t("Satis client - Mesure satisfaction") : "";

  if (
    !(
      verifyPermission(
        props.userPermissions,
        "list-satisfaction-measured-my-claim"
      ) ||
      verifyPermission(
        props.userPermissions,
        "list-satisfaction-measured-any-claim"
      )
    )
  )
    window.location.href = ERROR_401;

  let endPoint = "";
  if (props.plan === "MACRO") {
    if (
      verifyPermission(
        props.userPermissions,
        "list-satisfaction-measured-my-claim"
      )
    )
      endPoint = endPointConfig[props.plan].holding;
    else if (
      verifyPermission(
        props.userPermissions,
        "list-satisfaction-measured-my-claim"
      )
    )
      endPoint = endPointConfig[props.plan].filial;
  } else endPoint = endPointConfig[props.plan];

  const [load, setLoad] = useState(true);
  const [satisfactionMeasure, setSatisfactionMeasure] = useState([]);
  const [numberPage, setNumberPage] = useState(0);
  const [showList, setShowList] = useState([]);
  const [numberPerPage, setNumberPerPage] = useState(10);
  const [activeNumberPage, setActiveNumberPage] = useState(1);
  const [search, setSearch] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);

  let temp = JSON.parse(ls.get("userData"));
  let type_macro = temp.data.identite.staff?.institution.institution_type?.name;

  useEffect(() => {
    if (verifyTokenExpire()) {
      axios
        .get(
          `${endPoint.list}&size=${numberPerPage}&page=${activeNumberPage}${
            search.status === true ? `&key=${search.value}` : ""
          }`
        )
        .then((response) => {
          setLoad(false);

          if (response.data.length === 0) {
            setNumberPage(forceRound(0 / numberPerPage));
            setShowList([]);
            setSatisfactionMeasure([]);
            setTotal(0);
            setPrevUrl(response.data["prev_page_url"]);
            setNextUrl(response.data["next_page_url"]);
          } else {
            setNumberPage(forceRound(response.data.total / numberPerPage));
            setShowList(response.data.data.slice(0, numberPerPage));
            setSatisfactionMeasure(response.data["data"]);
            setTotal(response.data.total);
            setPrevUrl(response.data["prev_page_url"]);
            setNextUrl(response.data["next_page_url"]);
          }
        })
        .catch((error) => {
          setLoad(false);
          //console.log("Something is wrong");
        });
    }
  }, [numberPerPage, activeNumberPage]);

  const searchElement = async (e) => {
    setSearch(e.target.value);
    if (e.target.value) {
      if (verifyTokenExpire()) {
        setLoad(true);
        axios
          .get(
            endPoint.list +
              "&key=" +
              getLowerCaseString(e.target.value) +
              "&size=" +
              numberPerPage
          )
          .then((response) => {
            setLoad(false);
            setSatisfactionMeasure(response.data["data"]);
            setShowList(response.data.data.slice(0, numberPerPage));
            setTotal(response.data.total);
            setNumberPage(forceRound(response.data.total / numberPerPage));
            setPrevUrl(response.data["prev_page_url"]);
            setNextUrl(response.data["next_page_url"]);
          })
          .catch((error) => {
            setLoad(false);
          });
      }
    } else {
      if (verifyTokenExpire()) {
        setLoad(true);
        axios
          .get(endPoint.list + "?size=" + numberPerPage)
          .then((response) => {
            setLoad(false);
            setSatisfactionMeasure(response.data["data"]);
            setShowList(response.data.data.slice(0, numberPerPage));
            setTotal(response.data.total);
            setNumberPage(forceRound(response.data.total / numberPerPage));
            setPrevUrl(response.data["prev_page_url"]);
            setNextUrl(response.data["next_page_url"]);
          })
          .catch((error) => {
            setLoad(false); 
          });
      }
      setActiveNumberPage(1);
    }
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

  const showModal = (message) => {
    setCurrentMessage(message);
    document.getElementById("button_modal").click();
  };

  const printBodyTable = (measure, index) => {
    return (
      <tr key={index} role="row" className="odd">
        <td>{measure.reference === null ? "" : measure.reference}</td>
        <td>
          {measure.claimer?.raison_sociale
            ? measure.claimer?.raison_sociale
            : (measure.claimer?.lastname ? measure.claimer.lastname : "") +
              " " +
              (measure.claimer?.firstname ? measure.claimer.firstname : "")}

          {measure.account_targeted
            ? " / " + measure.account_targeted.number
            : measure.account_number
            ? " / " + measure.account_number
            : ""}
        </td>
        <td>
          {props.plan === "PRO" || type_macro === "filiale"
            ? measure.unit_targeted
              ? measure.unit_targeted.name.fr
              : "-"
            : measure.institution_targeted.name}
        </td>
        <td>
          {formatDateToTime(measure.created_at)} <br />
          {showDatePassed2(measure)}
        </td>
        <td>{measure.claim_object.name["fr"]}</td>
        <td>
          <HtmlDescription
            onClick={() =>
              showModal(measure.description ? measure.description : "-")
            }
          />

          {/*{measure.description.length >= 15 ? reduceCharacter(measure.description) : measure.description}*/}
        </td>
        <td>{`${
          measure.active_treatment.responsible_staff
            ? measure.active_treatment.responsible_staff.identite.lastname
            : ""
        } ${
          measure?.active_treatment?.responsible_staff
            ? measure?.active_treatment?.responsible_staff?.identite?.firstname
            : ""
        }/${
          measure?.active_treatment?.responsible_staff?.unit?.name["fr"]
        }`}</td>
        {verifyPermission(
          props.userPermissions,
          "update-satisfaction-measured-my-claim"
        ) ||
        verifyPermission(
          props.userPermissions,
          "update-satisfaction-measured-any-claim"
        ) ? (
          <td style={{ textAlign: "center" }}>
            <a
              href={`/process/my-claim_measure_pending/${measure.id}/detail`}
              className="btn btn-sm btn-clean btn-icon btn-icon-md"
              title={t("Détails")}
            >
              <i className="la la-eye" />
            </a>
          </td>
        ) : null}
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
                style={{ cursor: "default" }}
              >
                {t("Escalade")}
              </a>
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
                  {t("Mesurer de Satisfaction")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
        <InfirmationTable
          information={t("La liste des réclamations à mésurer la satisfaction")}
        />

        <div className="kt-portlet">
          <HeaderTablePage title={t("Mesure de Satisfaction")} />
          <div className="row">
            <div className="col-sm-6 text-left pl-3 ml-4 pt-3">
              <div id="kt_table_1_filter" className="dataTables_filter">
                <label>
                  {t("Rechercher")}:
                  <input
                    id="myInput"
                    type="text"
                    onKeyUp={(e) => searchElement(e)}
                    className="form-control form-control-sm"
                    placeholder=""
                    aria-controls="kt_table_1"
                  />
                </label>
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
                            style={{ width: "70.25px", paddingRight: "0" }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            {t("Référence")}
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "70.25px", paddingRight: "0" }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            {t("Réclamant")}
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "80.25px", paddingRight: "0" }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            {props.plan === "PRO" || type_macro === "filiale"
                              ? t("Point de service visé")
                              : t("Institution ciblée")}
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "50px", paddingRight: "0" }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            {t("Date de réception")}
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "70.25px", paddingRight: "0" }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            {t("Objet de réclamation")}
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "70.25px", paddingRight: "0" }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            {t("Description")}
                          </th>

                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "70.25px", paddingRight: "0" }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            {t("Agent traiteur")}
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "40.25px", paddingRight: "0" }}
                            aria-label="Type: activate to sort column ascending"
                          >
                            {t("Action")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {satisfactionMeasure.length ? (
                          search ? (
                            satisfactionMeasure.map((measure, index) =>
                              printBodyTable(measure, index)
                            )
                          ) : (
                            showList.map((measure, index) =>
                              printBodyTable(measure, index)
                            )
                          )
                        ) : (
                          <EmptyTable />
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th rowSpan="1" colSpan="1">
                            Référence
                          </th>
                          <th rowSpan="1" colSpan="1">
                            Réclamant
                          </th>
                          <th rowSpan="1" colSpan="1">
                            {props.plan === "PRO" || type_macro === "filiale"
                              ? "Point de service visé"
                              : "Institution ciblée"}
                          </th>
                          <th rowSpan="1" colSpan="1">
                            Date de réception
                          </th>
                          <th rowSpan="1" colSpan="1">
                            Objet de réclamation
                          </th>
                          <th rowSpan="1" colSpan="1">
                            Description
                          </th>
                          <th rowSpan="1" colSpan="1">
                            Agent traiteur
                          </th>
                          <th rowSpan="1" colSpan="1">
                            Action
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                    <button
                      id="button_modal"
                      type="button"
                      className="btn btn-secondary btn-icon-sm d-none"
                      data-toggle="modal"
                      data-target="#message_email"
                    />
                    <HtmlDescriptionModal
                      title={"Description"}
                      message={currentMessage}
                    />
                  </div>
                </div>
                <div className="row justify-content-between">
                  <div className="col-sm-12 col-md-5 d-flex">
                    <div
                      className="dataTables_info"
                      id="kt_table_1_info"
                      role="status"
                      aria-live="polite"
                    >
                      {t("Affichage de")} 1 {t("à")} {numberPerPage} {t("sur")}{" "}
                      {total} {t("données")}
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-5 d-flex justify-content-end">
                    {!search ? (
                      <div className="col-sm-12 col-md-7 dataTables_pager text-right">
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
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
};
const mapStateToProps = (state) => {
  return {
    userPermissions: state.user.user.permissions,
    plan: state.plan.plan,
  };
};

export default connect(mapStateToProps)(MySatisfactionMeasurePending);
