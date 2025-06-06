import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  loadCss,
  forceRound,
  getLowerCaseString,
} from "../../helpers/function";
import LoadingTable from "../components/LoadingTable";
import { ToastBottomEnd } from "../components/Toast";
import {
  toastDeleteErrorMessageConfig,
  toastDeleteSuccessMessageConfig,
  toastErrorMessageWithParameterConfig,
} from "../../config/toastConfig";
import { DeleteConfirmation } from "../components/ConfirmationAlert";
import { confirmDeleteConfig } from "../../config/confirmConfig";
import appConfig from "../../config/appConfig";
import Pagination from "../components/Pagination";
import EmptyTable from "../components/EmptyTable";
import HeaderTablePage from "../components/HeaderTablePage";
import InfirmationTable from "../components/InfirmationTable";
import { verifyPermission } from "../../helpers/permission";
import { ERROR_401 } from "../../config/errorPage";
import { NUMBER_ELEMENT_PER_PAGE } from "../../constants/dataTable";
import ExportButton from "../components/ExportButton";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import { useTranslation } from "react-i18next";

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const endPointConfig = {
  PRO: {
    plan: "PRO",
    list: `${appConfig.apiDomaine}/my/clients`,
    destroy: (accountId) => `${appConfig.apiDomaine}/my/clients/${accountId}`,
  },
  MACRO: {
    holding: {
      list: `${appConfig.apiDomaine}/any/clients`,
      destroy: (accountId) =>
        `${appConfig.apiDomaine}/any/clients/${accountId}`,
    },
    filial: {
      list: `${appConfig.apiDomaine}/my/clients`,
      destroy: (accountId) => `${appConfig.apiDomaine}/my/clients/${accountId}`,
    },
  },
};

const Clients = (props) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  document.title = "Satis client - " + ready ? t("Paramètre client") : "";
  if (
    !(
      verifyPermission(
        props.userPermissions,
        "list-client-from-my-institution"
      ) ||
      verifyPermission(
        props.userPermissions,
        "list-client-from-any-institution"
      )
    )
  ) {
    window.location.href = ERROR_401;
  }
  let endPoint = "";
  if (props.plan === "MACRO") {
    if (
      verifyPermission(
        props.userPermissions,
        "list-client-from-any-institution"
      ) ||
      verifyPermission(
        props.userPermissions,
        "store-client-from-any-institution"
      )
    )
      endPoint = endPointConfig[props.plan].holding;
    else if (
      verifyPermission(
        props.userPermissions,
        "list-client-from-my-institution"
      ) ||
      verifyPermission(
        props.userPermissions,
        "store-client-from-my-institution"
      )
    )
      endPoint = endPointConfig[props.plan].filial;
  } else {
    endPoint = endPointConfig[props.plan];
  }

  const [load, setLoad] = useState(true);
  const [clients, setClients] = useState([]);
  const [numberPage, setNumberPage] = useState(0);
  const [showList, setShowList] = useState([]);
  const [numberPerPage, setNumberPerPage] = useState(NUMBER_ELEMENT_PER_PAGE);
  const [activeNumberPage, setActiveNumberPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);

  useEffect(() => {
    if (verifyTokenExpire()) {
      setLoad(true);
      axios
        .get(endPoint.list + "?size=" + numberPerPage)
        .then((response) => {
          setLoad(false);
          setClients(response.data["data"]);
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
  }, []);

  const matchByAttribute = (accountNumbers, value, attribute) => {
    var match = false;
    accountNumbers.map((el) => {
      match =
        match ||
        getLowerCaseString(attribute === "number" ? el[attribute] : el).indexOf(
          value
        ) >= 0;
    });
    return match;
  };

  const filterShowListBySearchValue = (value) => {
    value = getLowerCaseString(value);
    let newClients = [...clients];
    newClients = newClients.filter(
      (el) =>
        getLowerCaseString(
          el.client.identite.lastname + " " + el.client.identite.firstname
        ).indexOf(value) >= 0 ||
        matchByAttribute(el.accounts, value, "number") ||
        matchByAttribute(el.client.identite.telephone, value, "telephone") ||
        matchByAttribute(el.client.identite.email, value, "email")
    );

    return newClients;
  };

  const searchElement = async (e) => {
    if (e.target.value) {
      /*            setNumberPage(forceRound(filterShowListBySearchValue(e.target.value).length / NUMBER_ELEMENT_PER_PAGE));
            setShowList(filterShowListBySearchValue(e.target.value.toLowerCase()).slice(0, NUMBER_ELEMENT_PER_PAGE));*/
      if (verifyTokenExpire()) {
        setLoad(true);
        axios
          .get(
            endPoint.list +
              "?key=" +
              getLowerCaseString(e.target.value) +
              "&size=" +
              numberPerPage
          )
          .then((response) => {
            setLoad(false);
            setClients(response.data["data"]);
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
            setClients(response.data["data"]);
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
      /*            setNumberPage(forceRound(total / NUMBER_ELEMENT_PER_PAGE));
            setShowList(clients.slice(0, NUMBER_ELEMENT_PER_PAGE));*/
      setActiveNumberPage(1);
    }
  };

  const onChangeNumberPerPage = (e) => {
    e.persist();
    if (verifyTokenExpire()) {
      setLoad(true);
      axios
        .get(endPoint.list + "?size=" + e.target.value)
        .then((response) => {
          setLoad(false);
          setActiveNumberPage(1);
          setClients(response.data["data"]);
          setShowList(response.data.data.slice(0, response.data.per_page));
          setTotal(response.data.total);
          setNumberPage(
            forceRound(response.data.total / response.data.per_page)
          );
          setPrevUrl(response.data["prev_page_url"]);
          setNextUrl(response.data["next_page_url"]);
        })
        .catch((error) => {
          setLoad(false);
        });
    }
    setNumberPerPage(parseInt(e.target.value));
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

    if (verifyTokenExpire()) {
      setLoad(true);
      axios
        .get("/my/clients?page=" + page + "&size=" + numberPerPage)
        .then((response) => {
          setLoad(false);
          setPrevUrl(response.data["prev_page_url"]);
          setNextUrl(response.data["next_page_url"]);
          setClients(response.data["data"]);
          setShowList(response.data["data"].slice(0, numberPerPage));
        })
        .catch((error) => {
          setLoad(false);
        });
    }
  };

  const onClickNextPage = (e) => {
    e.preventDefault();
    if (activeNumberPage <= numberPage) {
      setActiveNumberPage(activeNumberPage + 1);
      if (nextUrl !== null) {
        if (verifyTokenExpire()) {
          setLoad(true);
          axios
            .get(nextUrl + "&size=" + numberPerPage)
            .then((response) => {
              setLoad(false);
              setPrevUrl(response.data["prev_page_url"]);
              setNextUrl(response.data["next_page_url"]);
              setClients(response.data["data"]);
              setShowList(response.data["data"].slice(0, numberPerPage));
            })
            .catch((error) => {
              setLoad(false);
            });
        }
      }
    }
  };

  const onClickPreviousPage = (e) => {
    e.preventDefault();
    if (activeNumberPage >= 1) {
      setActiveNumberPage(activeNumberPage - 1);
      if (prevUrl !== null) {
        if (verifyTokenExpire()) {
          setLoad(true);
          axios
            .get(prevUrl + "&size=" + numberPerPage)
            .then((response) => {
              setLoad(false);
              setPrevUrl(response.data["prev_page_url"]);
              setNextUrl(response.data["next_page_url"]);
              setClients(response.data["data"]);
              setShowList(response.data["data"].slice(0, numberPerPage));
            })
            .catch((error) => {
              setLoad(false);
            });
        }
      }
    }
  };

  const deleteClient = (accountId, index) => {
    DeleteConfirmation.fire(confirmDeleteConfig()).then((result) => {
      if (result.value) {
        if (verifyTokenExpire()) {
          axios
            .delete(endPoint.destroy(accountId))
            .then((response) => {
              const newClient = [...clients];
              newClient.splice(index, 1);
              setClients(newClient);

              if (showList.length > 1) {
                setActiveNumberPage(activeNumberPage);

                if (verifyTokenExpire()) {
                  setLoad(true);

                  axios
                    .get(
                      endPoint.list +
                        "?page=" +
                        activeNumberPage +
                        "&size=" +
                        numberPerPage
                    )
                    .then((response) => {
                      setLoad(false);
                      setPrevUrl(response.data["prev_page_url"]);
                      setNextUrl(response.data["next_page_url"]);
                      setClients(response.data["data"]);
                      setShowList(
                        response.data["data"].slice(0, numberPerPage)
                      );
                      setTotal(response.data.total);
                      setNumberPage(
                        forceRound(response.data.total / numberPerPage)
                      );
                    })
                    .catch((error) => {
                      setLoad(false);
                    });
                }
              } else {
                setActiveNumberPage(activeNumberPage - 1);
                if (verifyTokenExpire()) {
                  setLoad(true);
                  axios
                    .get(
                      "/my/clients?page=" +
                        (activeNumberPage - 1) +
                        "&size=" +
                        numberPerPage
                    )
                    .then((response) => {
                      setLoad(false);
                      setPrevUrl(response.data["prev_page_url"]);
                      setNextUrl(response.data["next_page_url"]);
                      setClients(response.data["data"]);
                      setShowList(
                        response.data["data"].slice(0, numberPerPage)
                      );
                      setTotal(response.data.total);
                      setActiveNumberPage(activeNumberPage - 1);
                      setNumberPage(
                        forceRound(response.data.total / numberPerPage)
                      );
                    })
                    .catch((error) => {
                      setLoad(false);
                    });
                }
              }
              ToastBottomEnd.fire(toastDeleteSuccessMessageConfig());
              //window.location.reload()
            })
            .catch((error) => {
              if (error.response.data.error)
                ToastBottomEnd.fire(
                  toastErrorMessageWithParameterConfig(
                    error.response.data.error
                  )
                );
              else ToastBottomEnd.fire(toastDeleteErrorMessageConfig());
            });
        }
      }
    });
  };

  const arrayNumberPage = () => {
    const pages = [];
    for (let i = 1; i < numberPage; i++) {
      pages[i] = i;
    }
    return pages;
  };

  const pages = arrayNumberPage();

  const printBodyTable = (client, index) => {
    return client.accounts
      ? client.accounts.map((account, i) => (
          <tr key={i} role="row" className="odd">
            {i === 0 ? (
              <td rowSpan={client.accounts.length}>
               {client.client?.identite?.raison_sociale || (client.client?.identite?.lastname +
                  " " +
                // &ensp;{" "}
                client.client?.identite?.firstname
                  )}
              </td>
            ) : null}

            {i === 0 ? (
              <td rowSpan={client.accounts.length}>
                {client.client?.identite?.telephone?.length
                  ? client.client.identite.telephone.map((tel, index) =>
                      index === client.client.identite.telephone.length - 1
                        ? tel
                        : tel + " " + "/ " + " "
                    )
                  : null}
              </td>
            ) : null}
            {i === 0 ? (
              <td rowSpan={client.accounts.length}>
                {client.client?.identite?.email
                  ? client.client.identite.email.map((mail, index) =>
                      index === client.client.identite.email.length - 1
                        ? mail
                        : mail + " " + "/ " + " "
                    )
                  : null}
              </td>
            ) : null}

            <td>{account.number}</td>

            <td className="d-flex justify-content-center">
              {verifyPermission(
                props.userPermissions,
                "update-client-from-any-institution"
              ) ||
              verifyPermission(
                props.userPermissions,
                "update-client-from-my-institution"
              ) ? (
                <Link
                  to={`/settings/any/clients/edit/${account.id}`}
                  className="btn btn-sm btn-clean btn-icon btn-icon-md"
                  title={t("Modifier")}
                >
                  <i className="la la-edit" />
                </Link>
              ) : null}

              {verifyPermission(
                props.userPermissions,
                "destroy-client-from-my-institution"
              ) ||
              verifyPermission(
                props.userPermissions,
                "destroy-client-from-any-institution"
              ) ? (
                <button
                  onClick={(e) => deleteClient(account.id, index)}
                  className="btn btn-sm btn-clean btn-icon btn-icon-md"
                  title={t("Supprimer")}
                >
                  <i className="la la-trash" />
                </button>
              ) : null}
            </td>
          </tr>
        ))
      : null;
  };

  return ready ? (
    <div
      className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
      id="kt_content"
    >
      <div className="kt-subheader   kt-grid__item" id="kt_subheader">
        <div className="kt-container  kt-container--fluid ">
          <div className="kt-subheader__main">
            <h3 className="kt-subheader__title">{t("Paramètres")}</h3>
            <span className="kt-subheader__separator kt-hidden" />
            <div className="kt-subheader__breadcrumbs">
              <a href="#" className="kt-subheader__breadcrumbs-home">
                <i className="flaticon2-shelter" />
              </a>
              <span className="kt-subheader__breadcrumbs-separator" />
              <a
                href=""
                onClick={(e) => e.preventDefault()}
                className="kt-subheader__breadcrumbs-link"
              >
                {t("Client")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
        <InfirmationTable information={t("Liste des clients")} />

        <div className="kt-portlet">
          {verifyPermission(
            props.userPermissions,
            "store-client-from-my-institution"
          ) ? (
            <HeaderTablePage
              addPermission={"store-client-from-my-institution"}
              title={t("Client")}
              addText={t("Ajouter")}
              addLink={"/settings/any/clients/add"}
            />
          ) : verifyPermission(
              props.userPermissions,
              "store-client-from-any-institution"
            ) ? (
            <HeaderTablePage
              addPermission={"store-client-from-any-institution"}
              title={t("Client")}
              addText={t("Ajouter")}
              addLink={"/settings/any/clients/add"}
            />
          ) : null}

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
                <ExportButton
                  pageUrl={"/settings/importClients"}
                  downloadLink={`${appConfig.apiDomaine}/download-excel/clients`}
                />
              </div>
              {load ? (
                <LoadingTable />
              ) : (
                <>
                  <div className="row table-responsive">
                    <div className="col-sm-12 ">
                      <table
                        className="table table-striped table-bordered table-hover table-checkable dataTable dtr-inline table"
                        id="myTable"
                        role="grid"
                        aria-describedby="kt_table_1_info"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr role="row">
                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              rowSpan="1"
                              colSpan="1"
                              style={{ width: "30%" }}
                              aria-label="Country: activate to sort column ascending"
                            >
                              {t("Nom")}
                            </th>

                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              style={{ width: "15%" }}
                              aria-label="Ship Address: activate to sort column ascending"
                            >
                              {t("Téléphone")}(s)
                            </th>
                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              style={{ width: "20%" }}
                              aria-label="Ship Address: activate to sort column ascending"
                            >
                              Email(s)
                            </th>

                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              style={{ width: "20%" }}
                              aria-label="Ship Address: activate to sort column ascending"
                            >
                              {t("Numéro de compte")}
                            </th>

                            <th
                              className="sorting"
                              tabIndex="0"
                              aria-controls="kt_table_1"
                              style={{ width: "15%" }}
                              aria-label="Type: activate to sort column ascending"
                            >
                              {t("Action")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {clients.length ? (
                            showList.length ? (
                              showList.map((client, index) =>
                                printBodyTable(client, index)
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
                              {t("Nom")}
                            </th>
                            <th rowSpan="1" colSpan="1">
                              {t("Téléphone")}(s)
                            </th>
                            <th rowSpan="1" colSpan="1">
                              Email(s)
                            </th>
                            <th rowSpan="1" colSpan="1">
                              {t("Numéro de compte")}
                            </th>
                            <th rowSpan="1" colSpan="1">
                              {t("Action")}
                            </th>
                          </tr>
                        </tfoot>
                      </table>
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
                </>
              )}
            </div>
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
  };
};

export default connect(mapStateToProps)(Clients);
