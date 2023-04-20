import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { verifyPermission } from "../../helpers/permission";
import InfirmationTable from "../components/InfirmationTable";
import HeaderTablePage from "../components/HeaderTablePage";
import LoadingTable from "../components/LoadingTable";
import EmptyTable from "../components/EmptyTable";
import Pagination from "../components/Pagination";
import { ERROR_401 } from "../../config/errorPage";
import axios from "axios";
import appConfig from "../../config/appConfig";
import { ClaimSatus } from "../../constants/claimStatus";
import {
  displayStatus,
  forceRound,
  formatDateToTime,
  formatSelectOption,
  loadCss,
  showDatePassed,
} from "../../helpers/function";
import { NUMBER_ELEMENT_PER_PAGE } from "../../constants/dataTable";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import HtmlDescription from "../components/DescriptionDetail/HtmlDescription";
import HtmlDescriptionModal from "../components/DescriptionDetail/HtmlDescriptionModal";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { ToastBottomEnd } from "../components/Toast";
import { toastAddErrorMessageConfig } from "../../config/toastConfig";
loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");
let searchable;
const ClaimSensible = (props) => {
  const { t, ready } = useTranslation();

  if (!verifyPermission(props.userPermissions, "internal-control-claim"))
    window.location.href = ERROR_401;

  const [load, setLoad] = useState(true);
  const [claims, setClaims] = useState([]);
  const [numberPerPage, setNumberPerPage] = useState(NUMBER_ELEMENT_PER_PAGE);
  const [activeNumberPage, setActiveNumberPage] = useState(1);
  const [numberPage, setNumberPage] = useState(0);
  const [showList, setShowList] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [object, setObject] = useState([]);
  const [objects, setObjects] = useState([]);
  const [loadFilter, setloadFilter] = useState(false);
  const [claimType, setclaimType] = useState({});
  const [claimsStats, setclaimsStats] = useState({
    claimReceived: "-",
    claimTreated: "-",
    claimNotTreated: "-",
    claimAverageTimeTreatment: "-",
    claimSatisfactionMeasured: "-",
    claimNotSatisfactionMeasured: "-",
  });
  let endpointObject = `${appConfig.apiDomaine}/claim-objects-internal-control`;
  let endpoint = `${appConfig.apiDomaine}/claims-internal-control`;

  const objectable = () => {
    return {
      claim_object_ids: object?.length ? object.map((m) => m.value) : [],
    };
  };

  async function fetchData({ page }) {
    setLoad(true);

    axios
      .post(`${endpoint}`, {
        size: numberPerPage,
        page: page || activeNumberPage,
        key: searchable,
        status: claimType?.value,
        ...objectable(),
      })
      .then(({ data }) => {
        setNumberPage(
          forceRound(data.claimReceivedList?.total / numberPerPage)
        );
        setShowList(data.claimReceivedList?.data.slice(0, numberPerPage));
        setClaims(data.claimReceivedList?.["data"]);
        setTotal(data.claimReceivedList?.total);
        setPrevUrl(data.claimReceivedList?.["prev_page_url"]);
        setNextUrl(data.claimReceivedList?.["next_page_url"]);
        setloadFilter(false);
        setLoad(false);

        setclaimsStats(data);
      })
      .catch((error) => {
        setLoad(false);
        console.log("Something is wrong");
      });
  }

  useEffect(() => {
    if (verifyTokenExpire()) {
      fetchData({});
    }
  }, [numberPerPage, activeNumberPage, numberPage, claimType]);

  useEffect(() => {
    async function fetchDataObject() {
      setLoad(true);
      await axios
        .get(endpointObject)
        .then(async ({ data }) => {
          setObjects(formatSelectOption(data, "name", "fr"));
        })
        .catch((error) => {})
        .finally(() => setLoad(false));
    }
    if (verifyTokenExpire()) fetchDataObject();

    return () => {};
  }, []);

  const searchElement = async (e) => {
    searchable = e.target.value;
    if (verifyTokenExpire()) {
      fetchData({ page: 1 });
    }
  };

  const filterReporting = () => {
    if (object?.length === 0) {
      ToastBottomEnd.fire(
        toastAddErrorMessageConfig(
          t("Veuillez sélectionner l'objet de réclamation")
        )
      );
      return;
    }
    setloadFilter(true);
    fetchData({ page: 1 });
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

  const onChangeclaimType = (selected) => {
    if (!selected) {
      setShowList(claims);
      setclaimType({
        label: t("Veuillez sélectionner le type"),
        value: undefined,
      });

      return;
    }
    if (selected) setclaimType(selected);

    // let NowClaims =
    //   selected.value === "not_treated"
    //     ? claims.filter((claim) => {
    //         return ["assigned_to_staff", "transferred_to_unit"].includes(
    //           claim.status
    //         );
    //       })
    //     : claims.filter((claim) => claim.status === selected.value);

    // setShowList(NowClaims);
  };

  const onChangeObject = (selected) => {
    if (!selected) {
      setObject([]);
    } else {
      setObject(selected);
    }
  };

  const printBodyTable = (claim, index) => {
    return (
      <tr key={index} role="row" className="odd">
        <td>
          {claim.reference}
          {claim.is_rejected ? (
            <span className="kt-badge kt-badge--danger kt-badge--md">R</span>
          ) : null}
        </td>
        <td>
          {formatDateToTime(claim.created_at)} <br />
          {showDatePassed(claim)}
        </td>
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
        <td>{`${claim?.created_by?.identite?.firstname} ${claim?.created_by?.identite?.lastname} `}</td>
        <td>
          {formatDateToTime(claim?.active_treatment?.assigned_to_staff_at)}{" "}
          <br />
        </td>
        <td style={{ textAlign: "center" }}>
          <HtmlDescription
            onClick={() =>
              showModal(claim.description ? claim.description : "-")
            }
          />
        </td>
        <td className="text-center">{displayStatus(claim.status) || ""}</td>
        <td>{claim.claim_object ? claim.claim_object.name["fr"] : ""}</td>
        <td className="text-center">
          {claim.timeLimitTreatment?.global_delay || "-"}
        </td>
        <td className="text-center">
          {claim.timeLimitTreatment?.Quota_delay_assigned || "-"}
        </td>
        <td className="text-center">
          {claim.timeLimitTreatment?.duration_done || "0"}
        </td>
        <td className="text-center">
          {claim.timeLimitTreatment?.ecart || "0"}
        </td>
        <td className="text-center">
          <a
            href={`/process/claim_sensible/${claim.id}/detail`}
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
    verifyPermission(props.userPermissions, "internal-control-claim") ? (
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
                  {t("Contrôle interne")}
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
                    style={{ cursor: "text" }}
                  >
                    {t("Réclamations sensibles")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
          <InfirmationTable
            information={
              <div>
                {t(
                  "Cette page présente la liste des réclamations dites sensibles"
                )}
              </div>
            }
          />

          <div className="kt-portlet">
            <HeaderTablePage title={t("Réclamations sensibles")} />

            <div className=" p-3 mt-3 rounded">
              <div className="col">
                <div className=" row" style={{ marginRight: "12px" }}>
                  <div className="col col-12 col-md-6">
                    <label htmlFor="object">
                      {t("Objets de la réclamation traitée")}
                    </label>
                    <Select
                      isClearable
                      isMulti
                      value={object}
                      isOptionDisabled={() => object?.length >= 1}
                      placeholder={t(
                        "Veuillez sélectionner les objets de réclamation"
                      )}
                      onChange={onChangeObject}
                      isLoading={load}
                      options={objects}
                    />
                  </div>
                  <div className="col-md-12 mt-3">
                    <div className="form-group d-flex mb-0 justify-content-end">
                      {loadFilter ? (
                        <button
                          className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                          type="button"
                          disabled
                        >
                          {t("Chargement")}...
                        </button>
                      ) : (
                        <button
                          onClick={filterReporting}
                          className="btn btn-primary"
                          disabled={loadFilter}
                        >
                          {t("Filtrer")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="myTable"
              className="ml-3 col-sm-12"
              style={{
                overflowX: "auto",
                paddingRight: "5rem",
              }}
            >
              <span
                className="d-block mb-3"
                style={{ fontSize: "1.3rem", fontWeight: "400" }}
              >
                {t("Statistique liées à l'objet de réclamation sensible")}
              </span>
              <table
                id="myExcel"
                className="table table-striped  sensible-table  table-bordered table-hover table-checkable dataTable dtr-inline"
                role="grid"
                aria-describedby="kt_table_1_info"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr role="row">
                    <th
                      className="sorting text-light"
                      tabIndex="0"
                      aria-controls="kt_table_1"
                      aria-label="Country: activate to sort column ascending"
                    >
                      {t("Libellés")}
                    </th>
                    <th
                      className="sorting"
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
                  <>
                    <tr>
                      <td
                        className="sensible-libele"
                        style={{ fontWeight: "bold" }}
                      >
                        {t("Nombre total de réclamation réçues à ce jour")}
                      </td>

                      <td
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {claimsStats.claimReceived}
                      </td>
                    </tr>

                    <tr>
                      <td
                        className="sensible-libele"
                        style={{ fontWeight: "bold" }}
                      >
                        {t("Nombre total de réclamation traitées à ce jour")}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {claimsStats.claimTreated}
                      </td>
                    </tr>

                    <tr>
                      <td
                        className="sensible-libele"
                        style={{ fontWeight: "bold" }}
                      >
                        {t("Nombre de réclamations non traitées à ce jour")}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {claimsStats.claimNotTreated}
                      </td>
                    </tr>

                    <tr>
                      <td
                        className="sensible-libele"
                        style={{ fontWeight: "bold" }}
                      >
                        {t("Temps moyen de traitement d'une réclamation")}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {claimsStats.claimAverageTimeTreatment} {t(" Jour(s)")}
                      </td>
                    </tr>

                    <tr>
                      <td
                        className="sensible-libele"
                        style={{ fontWeight: "bold" }}
                      >
                        {t("Nombre de réclamation ayant eu satisfaction")}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {claimsStats.claimSatisfactionMeasured}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="sensible-libele"
                        style={{ fontWeight: "bold" }}
                      >
                        {t("Nombre de réclamation n'ayant pa eu satisfaction")}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {claimsStats.claimNotSatisfactionMeasured}
                      </td>
                    </tr>
                  </>
                </tbody>
              </table>
            </div>

            <div
              id="kt_table_1_wrapper"
              style={{ marginTop: "5rem" }}
              className="pl-5 pt-3"
            >
              <div className="row pr-5">
                <div className="col col-6 pl-0 pr-4">
                  <span
                    className="d-block mb-3"
                    style={{ fontSize: "1.8rem", fontWeight: "400" }}
                  ></span>
                  <div className={"col pl-0"}>
                    <label htmlFor="staff">{t("Type de réclamation")}</label>
                    <Select
                      isClearable
                      clearValue={null}
                      placeholder={t("Veuillez sélectionner le type")}
                      value={claimType}
                      onChange={onChangeclaimType}
                      isLoading={load}
                      options={ClaimSatus.map((c) => {
                        return { label: displayStatus(c), value: c };
                      })}
                    />
                  </div>
                </div>
                <div
                  className="col-sm-6 pt-3"
                  style={{ paddingLeft: "14rem", paddingRight: "2rem" }}
                >
                  <div id="kt_table_1_filter" className="dataTables_filter">
                    <label className="w-100 mt-3">
                      {t("Recherche")}:
                      <input
                        id="myInput"
                        type="text"
                        onKeyUp={(e) => searchElement(e)}
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
                  <div className="pr-4">
                    <div className="table-responsive">
                      <table
                        className="table table-striped table-bordered table-hover table-checkable dataTable dtr-inline"
                        id="myTable"
                        role="grid"
                        aria-describedby="kt_table_1_info"
                      >
                        <thead>
                          <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              rowSpan="1"
                              colSpan="1"
                              style={{ minWidth: 190 }}
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
                              style={{ width: "70.25px" }}
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
                              style={{ minWidth: 190 }}
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
                              style={{ minWidth: 190 }}
                              aria-label="Country: activate to sort column ascending"
                            >
                              {t("Collecteur")}
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
                              {t("Date affectation")}
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
                              {t("Description")}
                            </th>
                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              rowSpan="1"
                              colSpan="1"
                              style={{ minWidth: 190, textAlign: "center" }}
                              aria-label="Country: activate to sort column ascending"
                            >
                              {t("Statut")}
                            </th>
                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              rowSpan="1"
                              colSpan="1"
                              style={{ minWidth: 190 }}
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
                              style={{ width: "70.25px" }}
                              aria-label="Country: activate to sort column ascending"
                            >
                              {t("Délai global")}
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
                              {t("quota")}
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
                              {t("Durée effectuée")}
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
                              {t("Écart")}
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
                              {t("Details")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {showList.length ? (
                            showList.map((claim, index) =>
                              printBodyTable(claim, index)
                            )
                          ) : (
                            <EmptyTable />
                          )}
                        </tbody>
                        <tfoot>
                          <tr>
                            {" "}
                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              rowSpan="1"
                              colSpan="1"
                              style={{ width: "70.25px" }}
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
                              style={{ width: "70.25px" }}
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
                              style={{ width: "125px" }}
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
                              style={{ width: "70.25px" }}
                              aria-label="Country: activate to sort column ascending"
                            >
                              {t("Staff")}
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
                              {t("Date affectation")}
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
                              {t("Description")}
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
                              {t("Statut")}
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
                              {t("Objet de réclamation")}
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
                              {t("Délai global")}
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
                              {t("quota")}
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
                              {t("Durée effectuée")}
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
                              {t("Écart")}
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
                              {t("Details")}
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
                        {t("Affichage de")} 1 {t("à")} {numberPerPage}{" "}
                        {t("sur")} {total} {t("données")}
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

export default connect(mapStateToProps)(ClaimSensible);
