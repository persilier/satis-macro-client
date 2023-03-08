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
    actived: "",
    api_key: "",
  };
  const defaultError = {
    name: [],
    query: [],
    url: [],
    actived: [],
    api_key: [],
  };
  const [data, setData] = useState(defaultData);
  const [error, setError] = useState(defaultError);
  const [startRequest, setStartRequest] = useState(false);

  useEffect(() => {
    if (verifyTokenExpire()) {
      (async () => {
        let response = await axios.get(
          `${appConfig.apiDomaine}/configurations/satisfaction-data-config`
        )
        setData((prev) => ({
          ...prev,
          api_key: response?.data?.api_key,
          actived: response?.data?.actived === "1" ? 1 : 0,
        }));
        let datas = await axios.get(
          `http://212.83.146.159:5550/api/v1/dash/data`,
          {
            headers: {
              Authorization: `Bearer ${response?.data?.api_key}`,
              "App-name": data.name,
            },
          }
        ).then((res)=>{
          setData(prev=>({...prev,query:res.data.data.query}))
        })
      })();
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setStartRequest(true);
    if (verifyTokenExpire()) {
      axios
        .post(
          `http://212.83.146.159:5550/api/v1/dash/update-query`,
          {
            query: data?.query?.join?.(","),
          },
          {
            headers: {
              Authorization: `Bearer ${data?.api_key}`,
              "App-name": data.name,
            },
          }
        )
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
                                checked={data.actived}
                                name="actived"
                                onChange={(e) => {
                                  const { name, checked } = e.target;
                                  ConfirmIaDataCollect.fire(
                                    confirmIaDataConfig(
                                      data.actived
                                        ? "Voulez vous vraiment désactiver cette fonctionnalité ?"
                                        : "Voulez vous vraiment activer cette fonctionnalité ?"
                                    )
                                  ).then(async (result) => {
                                    if (result.isConfirmed) {
                                      try {
                                        let register = data.api_key
                                          ? null
                                          : await axios.post(
                                              "http://212.83.146.159:5550/api/v1/dash/register",
                                              {
                                                name: data.name,
                                                query: data.query,
                                                url: `${window.location.hostname}`,
                                              },
                                              {
                                                headers: {
                                                  Authorization: null,
                                                },
                                              }
                                            );
                                        await axios
                                          .put(
                                            `${appConfig.apiDomaine}/configurations/satisfaction-data-config`,
                                            {
                                              actived: 1,
                                              api_key: register
                                                ? register?.data?.data?.token
                                                : data.api_key,
                                            }
                                          )
                                          .then((res) => {
                                            setData((prev) => ({
                                              ...prev,
                                              [name]: 1,
                                            }));
                                          });
                                      } catch (error) {
                                        ToastBottomEnd.fire(
                                          toastAddErrorMessageConfig(
                                            "L'action a échouée"
                                          )
                                        );
                                      }
                                    } else {
                                      await axios
                                        .put(
                                          `${appConfig.apiDomaine}/configurations/satisfaction-data-config`,
                                          {
                                            actived: 0,
                                            api_key: data?.api_key,
                                          }
                                        )
                                        .then((res) => {
                                          setData((prev) => ({
                                            ...prev,
                                            [name]: 0,
                                          }));
                                        })
                                        .catch((error) => {
                                          ToastBottomEnd.fire(
                                            toastAddErrorMessageConfig(
                                              "L'action a échouée"
                                            )
                                          );
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
                                disabled={true}
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
                                onChange={(e) =>
                                  setData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
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
                                disabled={!data.actived}
                                onChange={(e) =>
                                  setData((prev) => ({ ...prev, query: e }))
                                }
                                inputProps={{
                                  className: "react-tagsinput-input",
                                  placeholder: "Les mots clés",
                                  disabled: !data.actived,
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
                            disabled={!data?.actived}
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
  return {
    userPermissions: state.user.user.permissions,
  };
};

export default connect(mapStateToProps)(IaDataConf);
