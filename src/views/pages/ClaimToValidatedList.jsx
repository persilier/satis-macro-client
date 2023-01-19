import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { verifyPermission } from "../../helpers/permission";
import InfirmationTable from "../components/InfirmationTable";
import HeaderTablePage from "../components/HeaderTablePage";
import LoadingTable from "../components/LoadingTable";
import EmptyTable from "../components/EmptyTable";
import Pagination from "../components/Pagination";
import { ERROR_401 } from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import {
  forceRound,
  formatDateToTime,
  getLowerCaseString,
  loadCss,
} from "../../helpers/function";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import HtmlDescription from "../components/DescriptionDetail/HtmlDescription";
import HtmlDescriptionModal from "../components/DescriptionDetail/HtmlDescriptionModal";
import { useTranslation } from "react-i18next";
import Select from "react-select";

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");
let AllshowList = {};

const ClaimToValidatedList = (props) => {
  //usage of useTranslation i18n
  const { t } = useTranslation();

  if (
    !(
      (verifyPermission(
        props.userPermissions,
        "list-claim-awaiting-validation-any-institution"
      ) ||
        verifyPermission(
          props.userPermissions,
          "list-claim-awaiting-validation-my-institution"
        )) &&
      props.activePilot
    )
  )
    window.location.href = ERROR_401;
  const [load, setLoad] = useState(true);
  const [claims, setClaims] = useState([]);
  const [numberPerPage, setNumberPerPage] = useState(10);
  const [activeNumberPage, setActiveNumberPage] = useState(1);
  const [search, setSearch] = useState("");
  const [numberPage, setNumberPage] = useState(0);
  const [showList, setShowList] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [ActivePilot, setActivePilot] = useState(null);
  const [ActivePilots, setActivePilots] = useState([]);
  const [Drived, setDrived] = useState(false);

  let endpoint = "";
  if (props.plan === "MACRO" || props.plan === "PRO")
    endpoint = `${appConfig.apiDomaine}/claim-awaiting-validation-my-institution-with-config`;
  else
    endpoint = `${appConfig.apiDomaine}/claim-awaiting-validation-any-institution`;

  useEffect(() => {
    async function fetchData() {
      setLoad(true);
      await axios
        .get(`${appConfig.apiDomaine}/configuration-active-pilot`)
        .then(async (res) => {
          const isMultiple = Boolean(
            res.data.configuration.many_active_pilot * 1
          );
          setDrived(isMultiple);
          if (isMultiple) {
            setActivePilots(
              res.data?.all_active_pilots.map((item) => ({
                label: `${item?.staff?.identite?.firstname} ${item?.staff?.identite?.lastname}`,
                value: item?.staff?.id,
              }))
            ); // ?size=20&key=0613898c-7d04-4353-8b9e-fa1ce52ca03d&type=transferred_to_unit_by
            axios
              .get(
                `${endpoint}?size=${numberPerPage}&page=${activeNumberPage}${
                  search.length ? `&key=${search.value}` : ""
                }${ActivePilot ? `&pilot=${ActivePilot.value}` : ""}`
              )
              .then((response) => {
                console.log(response);
                setLoad(false);
                if (response.data.length === 0) {
                  setNumberPage(forceRound(0 / numberPerPage));
                  setShowList([]);
                  setClaims([]);
                  setTotal(0);
                  setPrevUrl(response.data["prev_page_url"]);
                  setNextUrl(response.data["next_page_url"]);
                } else {
                  setNumberPage(
                    forceRound(response.data.total / numberPerPage)
                  );
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
          } else {
            // ?size=20&key=0613898c-7d04-4353-8b9e-fa1ce52ca03d&type=transferred_to_unit_by
            axios
              .get(
                `${endpoint}?size=${numberPerPage}&page=${activeNumberPage}${
                  search.length ? `&key=${search.value}` : ""
                }${ActivePilot ? `&pilot=${ActivePilot.value}` : ""}`
              )
              .then((response) => {
                console.log(response);
                setLoad(false);
                if (response.data.length === 0) {
                  setNumberPage(forceRound(0 / numberPerPage));
                  setShowList([]);
                  setClaims([]);
                  setTotal(0);
                  setPrevUrl(response.data["prev_page_url"]);
                  setNextUrl(response.data["next_page_url"]);
                } else {
                  setNumberPage(
                    forceRound(response.data.total / numberPerPage)
                  );
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
        })
        .catch((e) => console.log("error", e));
    }
    if (verifyTokenExpire()) fetchData();
  }, [numberPerPage, activeNumberPage, ActivePilot]);

  const searchElement = async (e) => {
    setSearch(e.target.value);
    if (e.target.value) {
      if (verifyTokenExpire()) {
        setLoad(true);
        axios
          .get(
            endpoint +
              "?key=" +
              getLowerCaseString(e.target.value) +
              "&size=" +
              numberPerPage
          )
          .then((response) => {
            setLoad(false);
            setClaims(response.data["data"]);
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
          .get(endpoint + "?size=" + numberPerPage)
          .then((response) => {
            setLoad(false);
            setClaims(response.data["data"]);
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

  // const filterShowListBySearchValue = (value) => {
  //   value = getLowerCaseString(value);
  //   let newClaims = [...claims];
  //   newClaims = newClaims.filter((el) => {
  //     return (
  //       getLowerCaseString(el.reference).indexOf(value) >= 0 ||
  //       getLowerCaseString(
  //         `${el.claimer ? el.claimer.lastname : "-"} ${
  //           el.claimer ? el.claimer.firstname : ""
  //         }  ${el.account_targeted ? " / " + el.account_targeted.number : ""}`
  //       ).indexOf(value) >= 0 ||
  //       getLowerCaseString(formatDateToTime(el.created_at)).indexOf(value) >=
  //         0 ||
  //       getLowerCaseString(
  //         el.claim_object ? el.claim_object.name["fr"] : ""
  //       ).indexOf(value) >= 0 ||
  //       getLowerCaseString(truncateString(el.description, 41)).indexOf(value) >=
  //         0 ||
  //       getLowerCaseString(
  //         el.institution_targeted ? el.institution_targeted.name : ""
  //       ).indexOf(value) >= 0
  //     );
  //   });

  //   return newClaims;
  // };

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

  const onChangeActivePilot = (selected) => {
    setActivePilot(selected);
    // let concernedPilotClaims = AllshowList[selected.value]
    //   ? AllshowList[selected.value]
    //   : AllshowList["18f69a5c-b1b9-403c-b8af-883cdb40cfe9"];
    // // console.log(concernedPilotClaims,AllshowList,AllshowList["18f69a5c-b1b9-403c-b8af-883cdb40cfe9"] );
    // setNumberPage(
    //   forceRound(concernedPilotClaims.claims.length / numberPerPage)
    // );
    // setShowList(concernedPilotClaims.claims.slice(0, numberPerPage));
    // setClaims(concernedPilotClaims.claims);
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
        <td>{claim.reference}</td>
        <td>{`${
          claim.claimer && claim.claimer.lastname ? claim.claimer.lastname : ""
        } ${
          claim.claimer && claim.claimer.firstname
            ? claim.claimer.firstname
            : ""
        } ${
          claim.account_targeted
            ? " / " + claim.account_targeted.number
            : claim.account_number
            ? " / " + claim.account_number
            : ""
        }`}</td>
        <td>
          {props.plan === "PRO"
            ? claim.unit_targeted
              ? claim.unit_targeted.name.fr
              : "-"
            : claim.institution_targeted
            ? claim.institution_targeted.name
            : ""}
        </td>
        <td>
          {formatDateToTime(claim.created_at)} <br />
          <strong
            className={claim.timeExpire >= 0 ? "text-success" : "text-danger"}
          >
            {`${
              claim.timeExpire >= 0
                ? "J+" + claim.timeExpire
                : "J" + claim.timeExpire
            }`}
          </strong>
        </td>
        <td>{claim.claim_object.name["fr"]}</td>
        <td style={{ textAlign: "center" }}>
          <HtmlDescription
            onClick={() =>
              showModal(claim.description ? claim.description : "-")
            }
          />
        </td>

        {/*<td>{truncateString(claim.description, 37)}</td>*/}
        {verifyPermission(
          props.userPermissions,
          "show-claim-awaiting-validation-any-institution"
        ) ||
        verifyPermission(
          props.userPermissions,
          "show-claim-awaiting-validation-my-institution"
        ) ? (
          <td>
            <a
              href={`/process/claim-to-validated/${claim.id}/detail`}
              className="btn btn-sm btn-clean btn-icon btn-icon-md"
              title={t("Détails")}
            >
              <i className="la la-eye" />
            </a>
          </td>
        ) : (
          <td />
        )}
      </tr>
    );
  };

  return (verifyPermission(
    props.userPermissions,
    "list-claim-awaiting-validation-my-institution"
  ) ||
    verifyPermission(
      props.userPermissions,
      "list-claim-awaiting-validation-any-institution"
    )) &&
    props.activePilot ? (
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
              >
                {t("Traitement")}
              </a>
            </div>
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
                {t("Réclamations à valider")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
        <InfirmationTable information={t("Liste des réclamations à valider")} />

        <div className="kt-portlet">
          <HeaderTablePage title={t("Liste des réclamations")} />

          <div className="form-group row pt-3 px-3 rounded">
            <div className="col">
              <span
                className="d-block mb-3"
                style={{ fontSize: "1.8rem", fontWeight: "400" }}
              ></span>
              {Drived && (
                <div className={"col"}>
                  <label htmlFor="staff">{t("Pilote(s) actif(s)")}</label>
                  <Select
                    isClearable
                    placeholder={t("Veuillez sélectionner l'agent")}
                    value={ActivePilot}
                    onChange={onChangeActivePilot}
                    isLoading={load}
                    options={ActivePilots}
                  />
                </div>
              )}
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
                          search ? (
                            claims.map((claim, index) =>
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
                      <tfoot>
                        <tr>
                          <th rowSpan="1" colSpan="1">
                            {t("Référence")}
                          </th>
                          <th rowSpan="1" colSpan="1">
                            {t("Réclamant")}
                          </th>
                          <th rowSpan="1" colSpan="1">
                            {props.plan === "PRO"
                              ? t("Point de service visé")
                              : t("Institution ciblée")}
                          </th>
                          <th rowSpan="1" colSpan="1">
                            {t("Date de réception")}
                          </th>
                          <th rowSpan="1" colSpan="1">
                            {t("Objet de réclamation")}
                          </th>
                          <th rowSpan="1" colSpan="1">
                            {t("Description")}{" "}
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
                      {total} {t("données")}
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
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    plan: state.plan.plan,
    userPermissions: state.user.user.permissions,
    activePilot: state.user.user.staff.is_active_pilot,
  };
};

export default connect(mapStateToProps)(ClaimToValidatedList);
