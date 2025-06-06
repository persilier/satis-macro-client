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
import {
  forceRound,
  formatDateToTime,
  getLowerCaseString,
  loadCss,
  showDatePassed,
  showDatePassed2,
  truncateString,
} from "../../helpers/function";
import { NUMBER_ELEMENT_PER_PAGE } from "../../constants/dataTable";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import HtmlDescriptionModal from "../components/DescriptionDetail/HtmlDescriptionModal";
import HtmlDescription from "../components/DescriptionDetail/HtmlDescription";
import { useTranslation } from "react-i18next";
import ls from "localstorage-slim";

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const ClaimAssignPendingToStaff = (props) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  document.title = "Satis client -" + ready ? t("Détails réclamation") : "";

  if (
    !verifyPermission(props.userPermissions, "list-claim-assignment-to-staff")
  )
    window.location.href = ERROR_401;

  const [load, setLoad] = useState(true);
  const [claims, setClaims] = useState([]);
  const [activeNumberPage, setActiveNumberPage] = useState(1);
  const [numberPage, setNumberPage] = useState(0);
  const [showList, setShowList] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const [numberPerPage, setNumberPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);

  let temp = JSON.parse(ls.get("userData"));
  let type_macro = temp.data.identite.staff?.institution.institution_type?.name;

  useEffect(() => {
    async function fetchData() {
      axios
        .get(
          `${
            appConfig.apiDomaine
          }/claim-assignment-staff?type=unsatisfied&size=${numberPerPage}&page=${activeNumberPage}${
            search.status === true ? `&key=${search.value}` : ""
          }`
        )
        .then((response) => {
          console.log(response.data, "DATA");
          //  setNumberPage(forceRound(response.data.length / numberPerPage));
          //  setShowList(response.data.slice(0, numberPerPage));
          //  setClaims(response.data);
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

    if (verifyTokenExpire()) fetchData();
  }, []);

  const filterShowListBySearchValue = (value) => {
    value = getLowerCaseString(value);
    let newClaims = [...claims];
    newClaims = newClaims.filter(
      (el) =>
        getLowerCaseString(
          `${el.reference} ${el.isInvalidTreatment ? "(R)" : ""} ${
            el.lastRevival ? "(R)" : ""
          }`
        ).indexOf(value) >= 0 ||
        getLowerCaseString(
          `${el.claimer.lastname} ${el.claimer.firstname} ${
            el.account_targeted
              ? " / " + el.account_targeted.number
              : el.account_number
              ? " / " + el.account_number
              : ""
          }`
        ).indexOf(value) >= 0 ||
        getLowerCaseString(formatDateToTime(el.created_at)).indexOf(value) >=
          0 ||
        getLowerCaseString(el.claim_object.name["fr"]).indexOf(value) >= 0 ||
        getLowerCaseString(truncateString(el.description)).indexOf(value) >=
          0 ||
        getLowerCaseString(
          `${
            el.active_treatment.responsible_staff
              ? el.active_treatment.responsible_staff.identite.lastname
              : ""
          } ${
            el.active_treatment.responsible_staff
              ? el.active_treatment.responsible_staff.identite.firstname
              : ""
          }`
        ).indexOf(value) >= 0 ||
        getLowerCaseString(
          props.plan === "PRO" || type_macro === "filiale"
            ? el.unit_targeted
              ? el.unit_targeted.name["fr"]
              : "-"
            : el.institution_targeted
            ? el.institution_targeted.name
            : "-"
        ).indexOf(value) >= 0
    );

    return newClaims;
  };

  const searchElement = async (e) => {
    if (e.target.value) {
      setNumberPage(
        forceRound(
          filterShowListBySearchValue(e.target.value).length /
            NUMBER_ELEMENT_PER_PAGE
        )
      );
      setShowList(
        filterShowListBySearchValue(e.target.value.toLowerCase()).slice(
          0,
          NUMBER_ELEMENT_PER_PAGE
        )
      );
    } else {
      setNumberPage(forceRound(claims.length / NUMBER_ELEMENT_PER_PAGE));
      setShowList(claims.slice(0, NUMBER_ELEMENT_PER_PAGE));
      setActiveNumberPage(1);
    }
  };

  const onChangeNumberPerPage = (e) => {
    setActiveNumberPage(1);
    setNumberPerPage(parseInt(e.target.value));
    setShowList(claims.slice(0, parseInt(e.target.value)));
    setNumberPage(forceRound(claims.length / parseInt(e.target.value)));
  };

  const getEndByPosition = (position) => {
    let end = numberPerPage;
    for (let i = 1; i < position; i++) {
      end = end + numberPerPage;
    }
    return end;
  };

  const onClickPage = (e, page) => {
    e.preventDefault();
    setActiveNumberPage(page);
    setShowList(
      claims.slice(
        getEndByPosition(page) - numberPerPage,
        getEndByPosition(page)
      )
    );
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
        <td>
          {claim.reference}{" "}
          {claim.isInvalidTreatment ? (
            <span className="kt-badge kt-badge--danger kt-badge--md">R</span>
          ) : null}{" "}
          {claim.lastRevival ? (
            <span className="kt-badge kt-badge--warning kt-badge--md">R</span>
          ) : null}
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
        <td>
          {props.plan === "PRO" || type_macro === "filiale"
            ? claim.unit_targeted
              ? claim.unit_targeted.name["fr"]
              : "-"
            : claim.institution_targeted
            ? claim.institution_targeted.name
            : "-"}
        </td>
        <td>
          {formatDateToTime(claim.created_at)} <br />
          {showDatePassed2(claim)}
        </td>
        <td>{claim.claim_object.name["fr"]}</td>
        <td style={{ textAlign: "center" }}>
          <HtmlDescription
            onClick={() =>
              showModal(claim.description ? claim.description : "-")
            }
          />
        </td>
        {/* <td>{`${truncateString(claim.description)}`}</td>*/}
        <td>
          <a
            href={`/process/claim-assign-pending/to-staff/${claim.id}/detail`}
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
    verifyPermission(
      props.userPermissions,
      "list-claim-assignment-to-staff"
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
                  {t("Escalade")}
                </a>
              </div>
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
                  {t("Réclamations non satisfaites à traiter")}
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
                  "Liste des réclamations dont les clients ne sont pas satisfaits et qui vous sont assignées pour traitement"
                )}
                <br />
                <span className="kt-badge kt-badge--danger kt-badge--md mr-2">
                  R
                </span>{" "}
                {t("représente les traitements réjetés")}
                <br />
                <span className="kt-badge kt-badge--warning kt-badge--md mr-2">
                  R
                </span>{" "}
                {t("représente les traitements ayant une relance")}
              </div>
            }
          />

          <div className="kt-portlet">
            <HeaderTablePage title={t("Réclamations à traiter")} />

            {load ? (
              <LoadingTable />
            ) : (
              <div className="kt-portlet__body">
                <div
                  id="kt_table_1_wrapper"
                  className="dataTables_wrapper dt-bootstrap4"
                >
                  <div className="row">
                    <div className="col-sm-6 text-left">
                      <div id="kt_table_1_filter" className="dataTables_filter">
                        <label>
                          {t("Recherche")}:
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
                              {props.plan === "PRO" || type_macro === "filiale"
                                ? t("Point de service visé")
                                : t("Institution concernée")}
                            </th>
                            <th
                              className="sorting sorter-dates"
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
                              {t("Description")}
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
                          <tr>
                            <th rowSpan="1" colSpan="1">
                              {t("Référence")}
                            </th>
                            <th rowSpan="1" colSpan="1">
                              {t("Réclamant")}
                            </th>
                            <th rowSpan="1" colSpan="1">
                              {props.plan === "PRO" || type_macro === "filiale"
                                ? t("Point de service visé")
                                : t("Institution concernée")}
                            </th>
                            <th rowSpan="1" colSpan="1">
                              {t("Date de réception")}
                            </th>
                            <th rowSpan="1" colSpan="1">
                              {t("Objet de réclamation")}
                            </th>
                            <th rowSpan="1" colSpan="1">
                              {t("Description")}
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
                        {t("Affichage de")} 1{" " + t("à")} {numberPerPage}{" "}
                        {t("sur")} {claims.length} {t("données")}
                      </div>
                    </div>

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
  };
};

export default connect(mapStateToProps)(ClaimAssignPendingToStaff);
