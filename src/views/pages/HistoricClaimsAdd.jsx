import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import {
  forceRound,
  getLowerCaseString,
  loadCss,
} from "../../helpers/function";
import LoadingTable from "../components/LoadingTable";
import appConfig from "../../config/appConfig";
import Pagination from "../components/Pagination";
import EmptyTable from "../components/EmptyTable";
import HeaderTablePage from "../components/HeaderTablePage";
import { ERROR_401 } from "../../config/errorPage";
import { verifyPermission } from "../../helpers/permission";
import { NUMBER_ELEMENT_PER_PAGE } from "../../constants/dataTable";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import HtmlDescription from "../components/DescriptionDetail/HtmlDescription";
import HtmlDescriptionModal from "../components/DescriptionDetail/HtmlDescriptionModal";
import { useTranslation } from "react-i18next";
import Select from "react-select";

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const HistoricClaimsAdd = (props) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  document.title = "Satis client - " + (ready ? t("Paramètre Historique") : "");

  if (!verifyPermission(props.userPermissions, "history-list-create-claim")) {
    window.location.href = ERROR_401;
  }
  const [load, setLoad] = useState(true);
  const [claimsAdd, setClaimsAdd] = useState([]);
  const [numberPage, setNumberPage] = useState(0);
  const [showList, setShowList] = useState([]);
  const [claims, setClaims] = useState([]);
  const [numberPerPage, setNumberPerPage] = useState(10);
  const [activeNumberPage, setActiveNumberPage] = useState(1);
  const [currentMessage, setCurrentMessage] = useState("");
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [total, setTotal] = useState(0);
  const [key, setKey] = useState();
  const [collectors, setCollectors] = useState([]);
  const [collector, setCollector] = useState(null);

  useEffect(() => {
    if (verifyTokenExpire()) {
      setLoad(true);
      axios
        .get(`${appConfig.apiDomaine}/history/list-claim/create`)
        .then(async (res) => {
          setCollectors(
            res.data?.map((item) => ({
              label: `${item?.identite?.firstname} ${item?.identite?.lastname}`,
              value: item?.id,
            }))
          );
        })
        .catch((e) => console.log("error", e));
    }
  }, []);

  useEffect(() => {
    if (verifyTokenExpire()) {
      axios
        .get(
          `${appConfig.apiDomaine +
            "/history/list-claim?"}&page=${activeNumberPage}&size=${numberPerPage}&key=${key ??
            ""}${collector ? `&staff_id=${collector.value}` : ""}`
        )
        .then((response) => {
          setLoad(false);
          if (response.data.length === 0) {
            setNumberPage(forceRound(0 / numberPerPage));
            setShowList([]);
            setClaims([]);
            setTotal(0);
            setPrevUrl(response.data["prev_page_url"]);
            setNextUrl(response.data["next_page_url"]);
          } else {
            setNumberPage(forceRound(response.data.total / numberPerPage));
            setShowList(response.data.data.slice(0, numberPerPage));
            setClaims(response.data["data"]);
            setTotal(response.data.total);
            setPrevUrl(response.data["prev_page_url"]);
            setNextUrl(response.data["next_page_url"]);
          }
        })
        .catch((error) => {
          setLoad(false);
          console.log("Something is wrong");
        });
    }
  }, [collector, key, activeNumberPage]);

  const getEndByPosition = (position) => {
    let end = numberPerPage;
    for (let i = 1; i < position; i++) {
      end = end + numberPerPage;
    }
    return end;
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

  const printBodyTable = (claim, index) => {
    return (
      <tr key={index} role="row" className="odd">
        <td>{claim.reference} </td>
        <td>
          {claim.claimer?.raison_sociale
            ? claim.claimer?.raison_sociale
            : (claim.claimer?.lastname ? claim.claimer.lastname : "") +
              " " +
              (claim.claimer?.firstname ? claim.claimer.firstname : "")}

          {claim.account_targeted
            ? " / " + claim.account_targeted.number
            : claim.account_number
            ? " / " + claim.account_number
            : ""}
        </td>
        <td>{claim.claim_object ? claim.claim_object.name["fr"] : ""}</td>
        <td style={{ textAlign: "center" }}>
          <HtmlDescription
            onClick={() =>
              showModal(claim.description ? claim.description : "-")
            }
          />
        </td>
        {/*<td>{claim.description.length > 15 ? reduceCharacter(claim.description) : claim.description}</td>*/}
        <td>
          {props.plan === "PRO"
            ? claim.unit_targeted
              ? claim.unit_targeted.name.fr
              : "-"
            : claim.institution_targeted.name}
        </td>
        <td style={{ textAlign: "center" }}>
          {claim.status === "archived" ? (
            <span className="kt-badge kt-badge--inline kt-badge--dark">
              {t("Archivé")}
            </span>
          ) : claim.status === "validated" ? (
            <span className="kt-badge kt-badge--inline kt-badge--success">
              {t("Traité")}
            </span>
          ) : (
            <span className="kt-badge kt-badge--inline kt-badge--warning">
              {t("En cours de traitement")}
            </span>
          )}
        </td>
        <td>
          <a
            href={`/process/claims/${claim.reference}/detail`}
            className="btn btn-sm btn-clean btn-icon btn-icon-md"
            title={t("Détails")}
          >
            <i className="la la-eye" />
          </a>
        </td>
      </tr>
    );
  };
  const onChangeCollector = (selected) => {
    setCollector(selected);
  };
  return ready ? (
    <div
      className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
      id="kt_content"
    >
      <div className="kt-subheader   kt-grid__item" id="kt_subheader">
        <div className="kt-container  kt-container--fluid ">
          <div className="kt-subheader__main">
            <h3 className="kt-subheader__title">{t("Historiques")}</h3>
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
                {t("Réclamations créées")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
        <div className="kt-portlet">
          <HeaderTablePage title={t("Réclamations créées")} />

          <div id="kt_table_1_wrapper" className=" pl-5 pt-3">
            <div className="row pr-4">
              <div className="col col-6 pl-0 pr-3">
                <div className={"col"}>
                  <label htmlFor="staff">{t("Collecteur (s) ")}</label>
                  <Select
                    isClearable
                    placeholder={t("Veuillez sélectionner l'agent")}
                    value={collector}
                    onChange={onChangeCollector}
                    isLoading={load}
                    options={collectors}
                  />
                </div>
              </div>

              <div
                className="col-sm-6 pt-3"
                style={{ paddingLeft: "14rem", paddingRight: "2rem" }}
              >
                <div id="kt_table_1_filter" className="dataTables_filter">
                  <label className="w-100">
                    {t("Recherche")}:
                    <input
                      id="myInput"
                      type="text"
                      onKeyUp={(e) => setKey(e.target.value)}
                      className="form-control form-control-sm w-100"
                      placeholder=""
                      aria-controls="kt_table_1"
                    />
                  </label>
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
                            style={{ width: "50px" }}
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
                            style={{ width: "50px" }}
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
                            style={{ width: "80px" }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            {t("Objets de réclamation")}
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "100px" }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            {t("Description de la Réclamation")}
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "70px" }}
                            aria-label="Country: activate to sort column ascending"
                          >
                            {props.plan === "PRO"
                              ? t("Point de service visé")
                              : t("Institution ciblée")}
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "70px" }}
                            aria-label="Ship City: activate to sort column ascending"
                          >
                            {t("Statut")}
                          </th>

                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="kt_table_1"
                            rowSpan="1"
                            colSpan="1"
                            style={{ width: "25px" }}
                            aria-label="Type: activate to sort column ascending"
                          >
                            {t("Action")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {claims.length ? (
                          showList.length ? (
                            showList.map((claim, index) =>
                              printBodyTable(claim, index)
                            )
                          ) : (
                            <EmptyTable search={true} />
                          )
                        ) : (
                          <EmptyTable />
                        )}
                      </tbody>
                      <tfoot>
                        <tr style={{ textAlign: "center" }}>
                          <th rowSpan="1" colSpan="1">
                            {t("Référence")}
                          </th>
                          <th rowSpan="1" colSpan="1">
                            {t("Réclamant")}
                          </th>
                          <th rowSpan="1" colSpan="1">
                            {t("Objets de réclamtions")}
                          </th>
                          <th rowSpan="1" colSpan="1">
                            {t("Description")}
                          </th>
                          <th rowSpan="1" colSpan="1">
                            {props.plan === "PRO"
                              ? t("Point de service visé")
                              : t("Institution ciblée")}
                          </th>
                          <th rowSpan="1" colSpan="1">
                            {t("Statut")}
                          </th>
                          <th rowSpan="1" colSpan="1">
                            {t("Action")}
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
                      {t("Affichage de")} 1 {t("à")} {numberPerPage} {t("sur")}{" "}
                      {claimsAdd.length} {t("données")}
                    </div>
                  </div>

                  {showList.length ? (
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
  ) : null;
};
const mapStateToProps = (state) => {
  return {
    plan: state.plan.plan,
    userPermissions: state.user.user.permissions,
  };
};

export default connect(mapStateToProps)(HistoricClaimsAdd);
