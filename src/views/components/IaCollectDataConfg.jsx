import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import appConfig from "../../config/appConfig";
import { ToastBottomEnd } from "./Toast";
import {
  toastAddErrorMessageConfig,
  toastAddSuccessMessageConfig,
  toastEditErrorMessageConfig,
  toastEditSuccessMessageConfig,
  toastErrorMessageWithParameterConfig,
} from "../../config/toastConfig";
import { ERROR_401, redirectErrorPage } from "../../config/errorPage";
import { verifyPermission } from "../../helpers/permission";
import InputRequire from "./InputRequire";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { confirmIaDataConfig } from "../../config/confirmConfig";
import { ConfirmIaDataCollect } from "../../views/components/ConfirmationAlert";
import TagsInput from "react-tagsinput";

const IaDataConf = (props) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  document.title = ready
    ? t("Satis client - Paramètre configuration des comités")
    : "";

  if (!verifyPermission(props.userPermissions, "list-escalation-config"))
    window.location.href = ERROR_401;

  const defaultData = {
    name: appConfig?.enterprise ?? "",
    query: "",
    url: "",
  };
  const defaultError = {
    name: [],
    query: [],
    url: [],
  };
  const [data, setData] = useState(defaultData);
  const [error, setError] = useState(defaultError);
  const [startRequest, setStartRequest] = useState(false);

  useEffect(() => {
    axios
      .get(`http://212.83.146.159:5550/api/v1/dash/register`)
      .then((response) => {})
      .catch((error) => {
        //console.log("Something is wrong");
      });

    /*
      if (verifyTokenExpire())
          fetchData();*/
  }, []);

  const onSubmit = (e) => {
    const sendData = { ...data };

    e.preventDefault();
    setStartRequest(true);
    if (verifyTokenExpire()) {
      axios
        .put(`http://212.83.146.159:5550/api/v1/dash/register`, sendData)
        .then((response) => {
          setStartRequest(false);
          setError(defaultError);
          ToastBottomEnd.fire(toastEditSuccessMessageConfig());
        })
        .catch((errorRequest) => {
          setStartRequest(false);
          setError({ ...defaultError, ...errorRequest.response?.data?.error });
          if (errorRequest.response.data.code === 422) {
            ToastBottomEnd.fire(
              toastErrorMessageWithParameterConfig(
                "Veuillez remplir le(s) champ(s) obligatoire(s)"
              )
            );
          } else {
            ToastBottomEnd.fire(toastErrorMessageWithParameterConfig());
          }
        });
    }
  };

  return ready ? (
    verifyPermission(props.userPermissions, "update-escalation-config") ? (
      <div
        className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
        id="kt_content"
      >
        <div className="kt-subheader   kt-grid__item" id="kt_subheader">
          <div className="kt-container  kt-container--fluid ">
            <div className="kt-subheader__main">
              <h3 className="kt-subheader__title">{t("Paramètre")}</h3>
              <span className="kt-subheader__separator kt-hidden" />
              <div className="kt-subheader__breadcrumbs">
                <a href="#link" className="kt-subheader__breadcrumbs-home">
                  <i className="flaticon2-shelter" />
                </a>
                <span className="kt-subheader__breadcrumbs-separator" />
                <a href="#link" className="kt-subheader__breadcrumbs-link">
                  {t("Configuration de données collectées")}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
          <div className="row">
            <div className="col">
              <div className="kt-portlet">
                <div className="kt-portlet__head">
                  <div className="kt-portlet__head-label">
                    <h3 className="kt-portlet__head-title">
                      {t("Configuration de la collecte")}
                    </h3>
                  </div>
                </div>

                <form method="POST" className="kt-form">
                  <div className="kt-form kt-form--label-right">
                    <div className="kt-portlet__body">
                      <div className="form-group">
                        <div
                          className={
                            "col-lg-9 col-md-9 col-sm-12 col-12 text-left m-auto"
                          }
                        >
                          <div className="form-group ">
                            <div
                              className="alert alert-outline-primary fade show"
                              role="alert"
                            >
                              <div className="alert-icon">
                                <i className="flaticon-information kt-font-brand" />
                              </div>
                              <div className="alert-text">
                                {t(
                                  "Cette fonctionnalité nécessite une intelligence artificielle dont l'accès est hors de votre système actuel. Nous vous garantisons cependant sécurité et confidentialité."
                                )}
                              </div>
                              <div className="alert-close">
                                <button
                                  type="button"
                                  className="close"
                                  data-dismiss="alert"
                                  aria-label="Close"
                                >
                                  <span aria-hidden="true">
                                    {" "}
                                    <i className="la la-close" />
                                  </span>
                                </button>
                              </div>
                            </div>
                            <span />
                          </div>
                          <span
                            style={{ transform: "scale(0.9,0.9)" }}
                            className="kt-switch"
                          >
                            <label>
                              <input
                                style={{}}
                                id="inactivity_control"
                                type="checkbox"
                                checked={data.allowIaData}
                                name="allowIaData"
                                onChange={(e) => {
                                  const { name, checked } = e.target;
                                  ConfirmIaDataCollect.fire(
                                    confirmIaDataConfig(
                                      data.allowIaData
                                        ? "Voulez vous vraiment désactiver cette fonctionnalité ?"
                                        : "Voulez vous vraiment activer cette fonctionnalité ?"
                                    )
                                  ).then(async (result) => {
                                    if (result.isConfirmed) {
                                      await axios
                                        .post(
                                          "http://212.83.146.159:5550/api/v1/dash/register",
                                          {
                                            name: data.name,
                                            query: data.query,
                                            url: `${window.location.host}`,
                                          }
                                        )
                                        .then((res) => {
                                          setData((prev) => ({
                                            ...prev,
                                            [name]: result.isConfirmed ? 1 : 0,
                                          }));
                                        })
                                        .catch((error) => {
                                          setData((prev) => ({
                                            ...prev,
                                            [name]: result.isConfirmed ? 1 : 0,
                                          }));
                                        });
                                    } else {
                                      await axios
                                        .put(
                                          `${appConfig.apiDomaine}/configurations/satisfaction-data-config`,
                                          {
                                            actived: result?.isConfirmed,
                                            api_key: "",
                                          }
                                        )
                                        .then((res) => {
                                          setData((prev) => ({
                                            ...prev,
                                            [name]: result.isConfirmed ? 1 : 0,
                                          }));
                                        })
                                        .catch((error) => {
                                          setData((prev) => ({
                                            ...prev,
                                            [name]: result.isConfirmed ? 1 : 0,
                                          }));
                                        });
                                    }
                                  });
                                }}
                              />
                              <span />
                              <div
                                style={{
                                  fontSize: "16px",
                                  whiteSpace: "nowrap",
                                  marginTop: "6px",
                                  marginLeft: "14px",
                                }}
                              >
                                {t(
                                  "Veuillez cochez pour confirmer l'utilisation"
                                )}
                              </div>
                            </label>
                          </span>
                        </div>
                      </div>

                      {true ? (
                        <>
                          <div className="form-group">
                            <div
                              className={
                                error.name?.length
                                  ? "col-lg-9 col-md-9 col-sm-12 m-auto validated"
                                  : "col-lg-9 col-md-9 col-sm-12 m-auto"
                              }
                            >
                              <label htmlFor="name">
                                {t("Nom de l'institution")} {""}
                                <InputRequire />{" "}
                              </label>
                              <input
                                disabled={false}
                                id="name"
                                type="text"
                                className={
                                  error.name?.length
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                placeholder={
                                  "Veuillez entrer le nom de l'institution"
                                }
                                value={data.name}
                                onChange={(e) => {
                                  setData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }));
                                }}
                              />
                              {error.name?.length
                                ? error.name.map((error, index) => (
                                    <div
                                      key={index}
                                      className="invalid-feedback"
                                    >
                                      {error}
                                    </div>
                                  ))
                                : null}
                            </div>
                          </div>

                          <div
                            className={
                              error.query?.length
                                ? "col-lg-9 col-md-9 col-sm-12 m-auto validated"
                                : "col-lg-9 col-md-9 col-sm-12 m-auto"
                            }
                          >
                            <label htmlFor="staff">
                              {t("Mots clés")} <InputRequire />
                            </label>
                            <div className={""}>
                              <TagsInput
                                value={data.query || []}
                                onChange={(e) => {
                                  alert(e);
                                  setData((prev) => ({ ...prev, query: e }));
                                }}
                                inputProps={{
                                  className: "react-tagsinput-input",
                                  placeholder: "Les mots clés",
                                }}
                              />
                              {error.query?.length
                                ? error.query.map((error, index) => (
                                    <div
                                      key={index}
                                      className="invalid-feedback"
                                    >
                                      {error}
                                    </div>
                                  ))
                                : null}
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div className="kt-portlet__foot">
                      <div className="kt-form__actions text-right">
                        {!startRequest ? (
                          <button
                            type="submit"
                            onClick={(e) => onSubmit(e)}
                            className="btn btn-primary"
                          >
                            {t("Enregistrer")}
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                            type="button"
                            disabled
                          >
                            {t("Chargement")}...
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null
  ) : null;
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    userPermissions: state.user.user.permissions,
  };
};

export default connect(mapStateToProps)(IaDataConf);
