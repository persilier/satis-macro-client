import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { verifyPermission } from "../../helpers/permission";
import { ERROR_401 } from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import InputRequire from "../components/InputRequire";
import { ToastBottomEnd } from "../components/Toast";
import {
  toastAddErrorMessageConfig,
  toastAddSuccessMessageConfig,
  toastEditErrorMessageConfig,
  toastEditSuccessMessageConfig,
  toastErrorMessageWithParameterConfig,
} from "../../config/toastConfig";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import TagsInput from "react-tagsinput";

const endPointConfig = {
  PRO: {
    plan: "PRO",
    create: `${appConfig.apiDomaine}/my/email-claim-configuration`,
    store: `${appConfig.apiDomaine}/my/email-claim-configuration`,
    storeKnowingIdentity: (id) =>
      `${appConfig.apiDomaine}/my/email-claim-configuration/${id}`,
  },
  MACRO: {
    holding: {
      create: `${appConfig.apiDomaine}/my/email-claim-configuration`,
      store: `${appConfig.apiDomaine}/my/email-claim-configuration`,
      storeKnowingIdentity: (id) =>
        `${appConfig.apiDomaine}/my/email-claim-configuration/${id}`,
    },
    filial: {
      create: `${appConfig.apiDomaine}/my/email-claim-configuration`,
      store: `${appConfig.apiDomaine}/my/email-claim-configuration`,
      storeKnowingIdentity: (id) =>
        `${appConfig.apiDomaine}/my/email-claim-configuration/${id}`,
    },
  },
  HUB: {
    plan: "HUB",
    create: `${appConfig.apiDomaine}/any/email-claim-configuration`,
    store: `${appConfig.apiDomaine}/any/email-claim-configuration`,
    storeKnowingIdentity: (id) =>
      `${appConfig.apiDomaine}/any/email-claim-configuration/${id}`,
  },
};

const EmailConfig = (props) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  document.title = "Satis client - " + (ready ? t("Email Configuration") : "");

  if (
    !(
      verifyPermission(props.userPermissions, "my-email-claim-configuration") ||
      verifyPermission(props.userPermissions, "any-email-claim-configuration")
    )
  )
    window.location.href = ERROR_401;

  let endPoint = "";
  if (props.plan === "HUB") {
    endPoint = endPointConfig[props.plan];
  } else if (props.plan === "MACRO") {
    if (verifyPermission(props.userPermissions, "my-email-claim-configuration"))
      endPoint = endPointConfig[props.plan].holding;
    else if (
      verifyPermission(props.userPermissions, "my-email-claim-configuration")
    )
      endPoint = endPointConfig[props.plan].filial;
  } else endPoint = endPointConfig[props.plan];

  const defaultErrorEmail = {
    host: [],
    email: [],
    password: [],
    port: [],
    protocol: [],
    institution_id: [],
    domaine_prefixe: [],
  };

  const defaultErrore = {
    domaine_prefixe: [],
  };

  const defaultDataEmail = {
    host: "",
    email: "",
    password: "",
    port: "",
    protocol: "",
    institution_id: "",
    domaine_prefixe: [],
  };

  const [reload, setReload] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingEmaile, setLoadingEmaile] = useState(false);
  const [error, setError] = useState(defaultErrorEmail);
  const [errore, setErrore] = useState(defaultErrore);
  const [data, setData] = useState(defaultDataEmail);
  const [configuration, setConfiguration] = useState("");
  const [institution, setInstitution] = useState(null);
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let newData = {};
      await axios
        .get(appConfig.apiDomaine + `/configurations/relance`)
        .then((response) => {
          newData = {
            coef: response.data.coef,
            domaine_prefixe: response.data.domaine_prefixe,
          };
        });
      if (
        verifyPermission(props.userPermissions, "my-email-claim-configuration")
      ) {
        await axios
          .get(endPoint.create)
          .then((response) => {
            newData = {
              ...newData,
              host: response.data.host ? response.data.host : "",
              email: response.data.email ? response.data.email : "",
              password: response.data.password ? response.data.password : "",
              port: response.data.port ? response.data.port : "",
              protocol: response.data.protocol ? response.data.protocol : "",
            };
            setConfiguration(response.data.id ? response.data.id : "");

            setData(newData);
          })
          .catch((error) => {
            console.log("Something is wrong");
          });
      } else if (
        verifyPermission(props.userPermissions, "any-email-claim-configuration")
      ) {
        await axios
          .get(endPoint.create)
          .then(async (response) => {
            setInstitutions(
              formatOptions(
                response.data,
                "name",
                false,
                "email_claim_configuration"
              )
            );
          })
          .catch((error) => {
            console.log("Something is wrong");
          });
      }
    }

    if (verifyTokenExpire()) {
      fetchData();
    }
  }, [reload]);

  const onChangeServer = (e) => {
    const newData = { ...data };
    newData.host = e.target.value;
    setData(newData);
  };

  const onChangeUsername = (e) => {
    const newData = { ...data };
    newData.email = e.target.value;
    setData(newData);
  };

  const onChangePassword = (e) => {
    const newData = { ...data };
    newData.password = e.target.value;
    setData(newData);
  };

  const onChangePort = (e) => {
    const newData = { ...data };
    newData.port = e.target.value;
    setData(newData);
  };

  const onChangeProtocol = (e) => {
    const newData = { ...data };
    newData.protocol = e.target.value;
    setData(newData);
  };

  const onChangeInstitution = (selected) => {
    const newData = { ...data };
    if (selected) {
      setInstitution(selected);
      if (selected.configuration !== null) {
        newData.host = selected.configuration.host
          ? selected.configuration.host
          : "";
        newData.email = selected.configuration.email
          ? selected.configuration.email
          : "";
        newData.password = selected.configuration.password
          ? selected.configuration.password
          : "";
        newData.port = selected.configuration.port
          ? selected.configuration.port
          : "";
        newData.protocol = selected.configuration.protocol
          ? selected.configuration.protocol
          : "";
        newData.institution_id = selected.configuration.institution_id
          ? selected.configuration.institution_id
          : "";
        selected.configuration.id &&
          setConfiguration(selected.configuration.id);
      } else {
        setConfiguration("");
        newData.institution_id = selected.value;
        newData.host = "";
        newData.email = "";
        newData.password = "";
        newData.port = "";
        newData.protocol = "";
      }
    } else {
      setInstitution(null);
      setConfiguration("");
      newData.institution_id = "";
      newData.host = "";
      newData.email = "";
      newData.password = "";
      newData.port = "";
      newData.protocol = "";
    }
    setData(newData);
  };

  const onStore = async (e) => {
    e.preventDefault();
    const sendData = { ...data };
    if (props.plan !== "HUB") delete sendData.institution_id;

    setLoadingEmail(true);
    if (verifyTokenExpire()) {
      await axios
        .post(endPoint.store, sendData)
        .then((response) => {
          setLoadingEmail(false);
          setError(defaultErrorEmail);
          const newData = { ...data };
          setData(newData);
          ToastBottomEnd.fire(toastAddSuccessMessageConfig());
          setReload(!reload);
        })
        .catch((error) => {
          setLoadingEmail(false);
          setData(sendData);
          if (error.response.data.code === 400)
            ToastBottomEnd.fire(
              toastErrorMessageWithParameterConfig(error.response.data.error)
            );
          else {
            setError({ ...defaultErrorEmail, ...error.response.data.error });
            ToastBottomEnd.fire(toastAddErrorMessageConfig);
          }
        });
    }
  };

  const onUpdate = async (e) => {
    const sendData = { ...data };
    e.preventDefault();

    if (props.plan !== "HUB") delete sendData.institution_id;

    setLoadingEmail(true);
    if (verifyTokenExpire()) {
      await axios
        .post(endPoint.storeKnowingIdentity(configuration), sendData)
        .then((response) => {
          setLoadingEmail(false);
          setError(defaultErrorEmail);
          const newData = { ...data };
          setData(newData);
          ToastBottomEnd.fire(toastEditSuccessMessageConfig());
          setReload(!reload);
        })
        .catch((error) => {
          setLoadingEmail(false);
          if (error.response.data.code === 400)
            ToastBottomEnd.fire(
              toastErrorMessageWithParameterConfig(error.response.data.error)
            );
          else {
            setError({ ...defaultErrorEmail, ...error.response.data.error });
            ToastBottomEnd.fire(toastEditErrorMessageConfig);
          }
        });
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    setLoadingEmaile(true);
    if (verifyTokenExpire()) {
      axios
        .put(appConfig.apiDomaine + `/configurations/relance`, {
          domaine_prefixe: data.domaine_prefixe,
          coef: data.coef,
        })
        .then((response) => {
          setLoadingEmaile(false);
          setErrore(defaultErrore);
          ToastBottomEnd.fire(toastEditSuccessMessageConfig());
        })
        .catch((error) => {
          setLoadingEmaile(false);
          setErrore({ ...defaultErrore, ...error.response.data.error });
          ToastBottomEnd.fire(toastEditErrorMessageConfig());
        });
    }
  };
  const formatOptions = (
    options,
    labelKey,
    translate,
    configuration,
    valueKey = "id"
  ) => {
    const newOptions = [];
    for (let i = 0; i < options.length; i++) {
      if (translate)
        newOptions.push({
          value: options[i][valueKey],
          label: options[i][labelKey][translate],
          configuration: options[i][configuration],
        });
      else
        newOptions.push({
          value: options[i][valueKey],
          label: options[i][labelKey],
          configuration: options[i][configuration],
        });
    }
    return newOptions;
  };
  const onChangedomaine_prefixe = (mail) => {
    const newData = { ...data };
    newData.domaine_prefixe = mail;
    setData(newData);
  };

  return ready ? (
    verifyPermission(props.userPermissions, "update-mail-parameters") ? (
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
                <a href="#link" className="kt-subheader__breadcrumbs-home">
                  <i className="flaticon2-shelter" />
                </a>
                <span className="kt-subheader__breadcrumbs-separator" />
                <a href="#link" className="kt-subheader__breadcrumbs-link">
                  Email configuration
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="kt-container   kt-container--fluid  kt-grid__item kt-grid__item--fluid">
          <div className="row">
            <div className="col ">
              <div className="">
                <div className="kt-section pb-3 kt-portlet">
                  <div className="kt-section__body">
                    <div className="kt-portlet__head ">
                      <div className="kt-portlet__head-label">
                        <h3 className="kt-portlet__head-title">
                          Email Suffixe
                        </h3>
                      </div>
                    </div>

                    <form method="POST" className="kt-form">
                      <div className="kt-form kt-form--label-right">
                        <div className="kt-portlet__body">
                          <div
                            className={
                              errore?.domaine_prefixe.length
                                ? "form-group row validated"
                                : "form-group row"
                            }
                          >
                            <label
                              className="col-xl-3 col-lg-3 col-form-label"
                              htmlFor="domaine_prefixe"
                            >
                              {t("Suffixe des mails")}
                            </label>
                            <div className="col-lg-9 col-xl-6">
                              <TagsInput
                                value={data.domaine_prefixe || []}
                                onChange={onChangedomaine_prefixe}
                                inputProps={{
                                  className: "react-tagsinput-input",
                                  placeholder: "Domaines des e-mails",
                                }}
                              />
                              {errore.domaine_prefixe.length
                                ? errore.domaine_prefixe.map((error, index) => (
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
                        </div>

                        <div className="kt-portlet__foot border-0 pb-0">
                          <div className="kt-form__actions text-right">
                            {!loadingEmaile ? (
                              <button
                                type="submit"
                                onClick={(e) => onSubmit(e)}
                                className="btn btn-primary"
                              >
                                {t("Modifier")}
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
                <div className=" kt-portlet">
                  <div className="kt-portlet__head">
                    <div className="kt-portlet__head-label">
                      <h3 className="kt-portlet__head-title">
                        Email configuration
                      </h3>
                    </div>
                  </div>
                  <form method="POST" className="kt-form">
                    <div className="kt-form kt-form--label-right">
                      <div className="kt-portlet__body">
                        {verifyPermission(
                          props.userPermissions,
                          "any-email-claim-configuration"
                        ) && props.plan === "HUB" ? (
                          <div
                            className={
                              error.institution_id.length
                                ? "form-group row validated"
                                : "form-group row"
                            }
                          >
                            <label
                              className="col-xl-3 col-lg-3 col-form-label"
                              htmlFor="institution"
                            >
                              {t("Institutions")}
                              <InputRequire />
                            </label>
                            <div className="col-lg-9 col-xl-6">
                              <Select
                                isClearable
                                value={institution}
                                placeholder={"Selectionner une institution"}
                                onChange={onChangeInstitution}
                                options={institutions}
                              />
                              {error.institution_id.length
                                ? error.institution_id.map((error, index) => (
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
                        ) : null}

                        <div
                          className={
                            error.host.length
                              ? "form-group row validated"
                              : "form-group row"
                          }
                        >
                          <label
                            className="col-xl-3 col-lg-3 col-form-label"
                            htmlFor="host"
                          >
                            {t("Serveur")} <InputRequire />
                          </label>
                          <div className="col-lg-9 col-xl-6">
                            <input
                              id="senderID"
                              type="text"
                              className={
                                error.host.length
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              value={data.host}
                              onChange={(e) => onChangeServer(e)}
                            />
                            {error.host.length
                              ? error.host.map((error, index) => (
                                  <div key={index} className="invalid-feedback">
                                    {error}
                                  </div>
                                ))
                              : null}
                          </div>
                        </div>

                        <div
                          className={
                            error.email.length
                              ? "form-group row validated"
                              : "form-group row"
                          }
                        >
                          <label
                            className="col-xl-3 col-lg-3 col-form-label"
                            htmlFor={"mail_username"}
                          >
                            Email <InputRequire />
                          </label>
                          <div className="col-lg-9 col-xl-6">
                            <input
                              id="mail_username"
                              type="text"
                              className={
                                error.email.length
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              value={data.email}
                              onChange={(e) => onChangeUsername(e)}
                            />
                            {error.email.length
                              ? error.email.map((error, index) => (
                                  <div key={index} className="invalid-feedback">
                                    {error}
                                  </div>
                                ))
                              : null}
                          </div>
                        </div>

                        <div
                          className={
                            error.password.length
                              ? "form-group row validated"
                              : "form-group row"
                          }
                        >
                          <label
                            className="col-xl-3 col-lg-3 col-form-label"
                            htmlFor="mail_password"
                          >
                            {t("Mot de passe")} <InputRequire />
                          </label>
                          <div className="col-lg-9 col-xl-6">
                            <input
                              id="mail_password"
                              type="password"
                              className={
                                error.password.length
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              value={data.password}
                              onChange={(e) => onChangePassword(e)}
                            />
                            {error.password.length
                              ? error.password.map((error, index) => (
                                  <div key={index} className="invalid-feedback">
                                    {error}
                                  </div>
                                ))
                              : null}
                          </div>
                        </div>

                        <div
                          className={
                            error.port.length
                              ? "form-group row validated"
                              : "form-group row"
                          }
                        >
                          <label
                            className="col-xl-3 col-lg-3 col-form-label"
                            htmlFor="port"
                          >
                            Port <InputRequire />
                          </label>
                          <div className="col-lg-9 col-xl-6">
                            <input
                              id="port"
                              type="number"
                              className={
                                error.port.length
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              value={data.port}
                              onChange={(e) => onChangePort(e)}
                            />
                            {error.port.length
                              ? error.port.map((error, index) => (
                                  <div key={index} className="invalid-feedback">
                                    {error}
                                  </div>
                                ))
                              : null}
                          </div>
                        </div>

                        <div
                          className={
                            error.protocol.length
                              ? "form-group row validated"
                              : "form-group row"
                          }
                        >
                          <label
                            className="col-xl-3 col-lg-3 col-form-label"
                            htmlFor="protocol"
                          >
                            {t("Protocole")} <InputRequire />
                          </label>
                          <div className="col-lg-9 col-xl-6">
                            <input
                              id="protocol"
                              type="text"
                              className={
                                error.protocol.length
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              value={data.protocol}
                              onChange={(e) => onChangeProtocol(e)}
                            />
                            {error.protocol.length
                              ? error.protocol.map((error, index) => (
                                  <div key={index} className="invalid-feedback">
                                    {error}
                                  </div>
                                ))
                              : null}
                          </div>
                        </div>
                      </div>

                      <div className="kt-portlet__foot">
                        <div className="kt-form__actions text-right">
                          {!loadingEmail ? (
                            !configuration.length ? (
                              <button
                                type="submit"
                                onClick={(e) => onStore(e)}
                                className="btn btn-primary"
                              >
                                {t("Enregistrer")}
                              </button>
                            ) : (
                              <button
                                type="submit"
                                onClick={(e) => onUpdate(e)}
                                className="btn btn-primary"
                              >
                                {t("Modifier")}
                              </button>
                            )
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
        <Discussion />
      </div>
    ) : null
  ) : null;
};

const Discussion = () => {
  const { t, ready } = useTranslation();
  const defaultErrors = {
    canCollectorsDisc: [],
    canPilotsDisc: [],
  };
  const [data, setData] = useState({
    canCollectorsDisc: 0,
    canPilotsDisc: 0,
  });
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState(defaultErrors);
  useEffect(() => {
    async function fetchData() {
      await axios
        .get(
          appConfig.apiDomaine +
            `/configurations/allow-pilot-collector-discussion`
        )
        .then((response) => {
          setData(response.data);
        });
    }

    if (verifyTokenExpire()) {
      fetchData();
    }
  }, []);
  const onSubmit = (e) => {
    e.preventDefault();
    console.log(data);
    setLoading(true);
    if (verifyTokenExpire()) {
      axios
        .put(
          appConfig.apiDomaine +
            `/configurations/allow-pilot-collector-discussion`,
          {
            ...data,
          }
        )
        .then((response) => {
          setLoading(false);
          setError(defaultErrors);
          ToastBottomEnd.fire(toastEditSuccessMessageConfig());
        })
        .catch((error) => {
          setLoading(false);
          setError({ ...defaultErrors, ...error.response.data.error });
          ToastBottomEnd.fire(toastEditErrorMessageConfig());
        });
    }
  };

  return (
    <div className="kt-container   kt-container--fluid  kt-grid__item kt-grid__item--fluid">
      <div className="row">
        <div className="col">
          <div className="">
            <div className="kt-section pb-3 kt-portlet">
              <div className="kt-section__body">
                <div className="kt-portlet__head ">
                  <div className="kt-portlet__head-label">
                    <h3 className="kt-portlet__head-title">
                      {t("Configuration de la discussion")}
                    </h3>
                  </div>
                </div>

                <form method="POST" className="kt-form">
                  <div className="kt-form kt-form--label-right">
                    <div className="kt-portlet__body row">
                      <div className="">
                        <span
                          style={{ transform: "scale(0.9,0.9)" }}
                          className="kt-switch my-2 col-12 col-xl-6"
                        >
                          <label>
                            <input
                              style={{}}
                              id="inactivity_control"
                              type="checkbox"
                              checked={data.canPilotsDisc}
                              name="canPilotsDisc"
                              onChange={(e) => {
                                const { name, checked } = e.target;
                                setData((prev) => ({
                                  ...prev,
                                  [name]: checked ? 1 : 0,
                                }));
                              }}
                            />
                            <span />
                            <div
                              style={{
                                fontSize: "16px",
                                whiteSpace: "nowrap",
                                marginTop: "4px",
                                marginLeft: "14px",
                              }}
                            >
                              {t(
                                "Autoriser les pilotes à initier la discussion"
                              )}
                            </div>
                          </label>
                        </span>
                        <span
                          style={{ transform: "scale(0.9,0.9)" }}
                          className="kt-switch my-2 col-12 col-xl-6"
                        >
                          <label>
                            <input
                              style={{}}
                              id="inactivity_control"
                              type="checkbox"
                              checked={data.canCollectorsDisc}
                              name="canCollectorsDisc"
                              onChange={(e) => {
                                const { name, checked } = e.target;
                                setData((prev) => ({
                                  ...prev,
                                  [name]: checked ? 1 : 0,
                                }));
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
                                " Autoriser les collecteurs à participer aux discussions"
                              )}
                            </div>
                          </label>
                        </span>
                      </div>
                    </div>

                    <div className="kt-portlet__foot border-0 pb-0">
                      <div className="kt-form__actions text-right">
                        {!Loading ? (
                          <button
                            type="submit"
                            onClick={(e) => onSubmit(e)}
                            className="btn btn-primary"
                          >
                            {t("Soumettre")}
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
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    userPermissions: state.user.user.permissions,
    plan: state.plan.plan,
  };
};

export default connect(mapStateToProps)(EmailConfig);
