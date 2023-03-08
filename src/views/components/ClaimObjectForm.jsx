import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  toastAddErrorMessageConfig,
  toastAddSuccessMessageConfig,
  toastEditErrorMessageConfig,
  toastEditSuccessMessageConfig,
} from "../../config/toastConfig";
import { ToastBottomEnd } from "./Toast";
import Select from "react-select";
import { formatSelectOption } from "../../helpers/function";
import appConfig from "../../config/appConfig";
import { ERROR_401 } from "../../config/errorPage";
import { verifyPermission } from "../../helpers/permission";
import InputRequire from "./InputRequire";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

const ClaimObjectForm = (props) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  const { id } = useParams();
  if (id) {
    if (!verifyPermission(props.userPermissions, "update-claim-object"))
      window.location.href = ERROR_401;
  } else {
    if (!verifyPermission(props.userPermissions, "store-claim-object"))
      window.location.href = ERROR_401;
  }

  const [claimCategories, setClaimCategories] = useState([]);
  const [claimCategory, setClaimCategory] = useState(null);
  const [severityLevels, setSeverityLevels] = useState([]);
  const [severityLevel, setSeverityLevel] = useState(null);

  const defaultData = {
    name: "",
    description: "",
    claim_category_id: claimCategories.length ? claimCategories[0].id : "",
    severity_levels_id: "",
    time_limit: "",
    time_unit: "",
    time_staff: "",
    time_treatment: "",
    time_validation: "",
    internal_control: 0,
    time_measure_satisfaction: "",
  };
  const defaultError = {
    name: [],
    description: [],
    claim_category_id: [],
    severity_levels_id: [],
    time_limit: [],
    unite: [],
    staff: [],
    traitement: [],
    validation: [],
    satisfaction: [],
    internal_control: [],
  };
  const [data, setData] = useState(defaultData);
  const [error, setError] = useState(defaultError);
  const [startRequest, setStartRequest] = useState(false);
  const [controlInterne, setcontrolInterne] = useState(0);
  const [timeLimit, setTimeLimit] = useState(null);
  useEffect(() => {
    axios
      .get(`${appConfig.apiDomaine}/configuration-internal-control`)
      .then((response) => {
        setcontrolInterne(Number(response?.data?.state));
      })
      .catch((error) => {
        console.log("Something is wrong", error);
      });

    return () => {};
  }, []);

  const getStepsQuotas = useCallback(async () => {
    const formData = new FormData();
    formData.append("total_days", timeLimit);

    await axios
      .post(`${appConfig.apiDomaine}/claim-objects/quota-delay`, formData)
      .then((response) => {
        console.log("Time Limit", response?.data.assignment_unit);
        setData({
          ...data,
          time_unit: response?.data?.assignment_unit,
          time_staff: response?.data?.assignment_staff,
          time_treatment: response?.data?.assignment_treatment,
          time_validation: response?.data?.assignment_validation,
          time_measure_satisfaction:
            response?.data?.assignment_measure_satisfaction,
        });
      })
      .catch((error) => {
        console.log("Something is wrong", error);
      });
  }, [timeLimit]);

  useEffect(() => {
    getStepsQuotas();
  }, [timeLimit]);

  useEffect(() => {
    const formData = new FormData();
    formData.append("total_days", data.time_limit);
    async function fetchQuotasData() {
      await axios
        .post(`${appConfig.apiDomaine}/claim-objects/quota-delay`, formData)
        .then((response) => {
          setData({
            ...data,
            time_unit: response?.data?.assignment_unit,
            time_staff: response?.data?.assignment_staff,
            time_treatment: response?.data?.assignment_treatment,
            time_validation: response?.data?.assignment_validation,
            time_measure_satisfaction:
              response?.data?.assignment_measure_satisfaction,
          });
        })
        .catch((error) => {
          console.log("Something is wrong", error);
        });
    }

    // if (verifyTokenExpire())
    //   if(changed)
    fetchQuotasData();
  }, [data?.time_limit]);
  console.log(data);

  useEffect(() => {
    async function fetchData() {
      if (id) {
        await axios
          .get(`${appConfig.apiDomaine}/claim-objects/${id}/edit`)
          .then((response) => {
            setClaimCategories(
              formatSelectOption(response.data.claimCategories, "name", "fr")
            );
            setSeverityLevels(
              formatSelectOption(response.data.severityLevels, "name", "fr")
            );
            const newData = {
              name: response.data.claimObject.name["fr"],

              internal_control: Number(
                response?.data?.claimObject?.internal_control
              ),
              description: response.data.claimObject.description["fr"],
              claim_category_id: response.data.claimObject.claim_category_id,
              severity_levels_id:
                response.data.claimObject.severity_levels_id === null
                  ? ""
                  : response.data.claimObject.severity_levels_id,
              time_limit:
                response.data.claimObject.time_limit === null
                  ? 0
                  : response.data.claimObject.time_limit,
              time_unit:
                response.data.claimObject.time_unit === null
                  ? 0
                  : response.data.claimObject.time_unit,
              time_staff:
                response.data.claimObject.time_staff === null
                  ? 0
                  : response.data.claimObject.time_staff,
              time_treatment:
                response.data.claimObject.time_treatment === null
                  ? 0
                  : response.data.claimObject.time_treatment,
              time_validation:
                response.data.claimObject.time_validation === null
                  ? 0
                  : response.data.claimObject.time_validation,
              time_measure_satisfaction:
                response.data.claimObject.time_measure_satisfaction === null
                  ? 0
                  : response.data.claimObject.time_measure_satisfaction,
            };
            setData(newData);
            setClaimCategory({
              value: response.data.claimObject.claim_category_id,
              label: response.data.claimObject.claim_category.name["fr"],
            });
            setSeverityLevel(
              response.data.claimObject.severity_levels_id === null
                ? {}
                : {
                    value: response.data.claimObject.severity_levels_id,
                    label: response.data.claimObject.severity_level.name["fr"],
                  }
            );
          })
          .catch((error) => {
            //console.log("Something is wrong");
          });
      } else {
        await axios
          .get(`${appConfig.apiDomaine}/claim-objects/create`)
          .then((response) => {
            setClaimCategories(
              formatSelectOption(response.data.claimCategories, "name", "fr")
            );
            setSeverityLevels(
              formatSelectOption(response.data.severityLevels, "name", "fr")
            );
          })
          .catch((error) => {
            //console.log("something is wrong");
          });
      }
    }
    if (verifyTokenExpire()) fetchData();
  }, []);

  const onChangeName = (e) => {
    const newData = { ...data };
    newData.name = e.target.value;
    setData(newData);
  };

  const onChangeDescription = (e) => {
    const newData = { ...data };
    newData.description = e.target.value;
    setData(newData);
  };

  const onChangeClaimCategory = (selected) => {
    const newData = { ...data };
    newData.claim_category_id = selected ? selected.value : "";
    setClaimCategory(selected);
    setData(newData);
  };

  const handleInputControlInterne = (e) => {
    let value = e.target.checked ? 1 : 0;
    const newData = { ...data };
    newData.internal_control = value;
    setData(newData);
  };

  const onChangeTimeLimit = (e, key) => {
    const value = e.target.value;
    setTimeLimit(value);
    const newData = { ...data };
    newData.time_limit = value;
    setData(newData);

    // console.log("newData ", newData);
  };

  const onChangeSeverityLevel = (selected) => {
    const newData = { ...data };
    newData.severity_levels_id = selected ? selected.value : "";
    setSeverityLevel(selected);
    setData(newData);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setStartRequest(true);
    if (verifyTokenExpire()) {
      if (!!!data.internal_control && controlInterne) {
        data.internal_control = "0";
      }
      if (id) {
        axios
          .put(`${appConfig.apiDomaine}/claim-objects/${id}`, data)
          .then((response) => {
            setStartRequest(false);
            setError(defaultError);
            ToastBottomEnd.fire(toastEditSuccessMessageConfig());
          })
          .catch((errorRequest) => {
            setStartRequest(false);
            setError({ ...defaultError, ...errorRequest.response.data.error });
            ToastBottomEnd.fire(toastEditErrorMessageConfig());
          });
      } else {
        axios
          .post(`${appConfig.apiDomaine}/claim-objects`, data)
          .then((response) => {
            setStartRequest(false);
            setClaimCategory({});
            setSeverityLevel({});
            setError(defaultError);
            setData(defaultData);
            ToastBottomEnd.fire(toastAddSuccessMessageConfig());
          })
          .catch((errorRequest) => {
            setStartRequest(false);
            setError({ ...defaultError, ...errorRequest.response.data.error });
            ToastBottomEnd.fire(toastAddErrorMessageConfig());
          });
      }
    }
  };

  const printJsx = () => (
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
              <a href="#icone" className="kt-subheader__breadcrumbs-home">
                <i className="flaticon2-shelter" />
              </a>
              <span className="kt-subheader__breadcrumbs-separator" />
              <Link
                to="/settings/claim_objects"
                className="kt-subheader__breadcrumbs-link"
              >
                {t("Objet de réclamation")}
              </Link>
              <span className="kt-subheader__breadcrumbs-separator" />
              <a
                href="#button"
                onClick={(e) => e.preventDefault()}
                className="kt-subheader__breadcrumbs-link"
                style={{ cursor: "text" }}
              >
                {id ? t("Modification") : t("Ajout")}
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
                    {id
                      ? t("Modification d'objet de réclamation")
                      : t("Ajout d'objet de réclamation")}
                  </h3>
                </div>
              </div>

              <form method="POST" className="kt-form">
                <div className="kt-form kt-form--label-right">
                  <div className="kt-portlet__body">
                    <div className="col-12 col-xl-7">
                      <div className="row">
                        <div
                          className={controlInterne === 1 ? "col" : "col-12"}
                        >
                          <div
                            className={`d-flex flex-column ${
                              error.name.length
                                ? "form-group row validated"
                                : "form-group row"
                            }`}
                          >
                            <label
                              className="col-12 col-form-label text-left"
                              htmlFor="name"
                            >
                              {t("Objet de réclamation")} <InputRequire />
                            </label>
                            <div className="col-12 ">
                              <input
                                id="name"
                                type="text"
                                className={
                                  error.name.length
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                placeholder={t("Nom de l'objet de réclamation")}
                                value={data.name}
                                onChange={(e) => onChangeName(e)}
                              />
                              {error.name.length
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
                        </div>
                        <div className="col">
                          {controlInterne === 1 ? (
                            <div
                              className={`d-flex align-items-start pl-3 ${
                                error.internal_control.length
                                  ? "form-group row validated"
                                  : "form-group row"
                              }`}
                              style={{
                                marginTop: 40,
                              }}
                            >
                              <label
                                className="col-12 col-xl-9 w-100 col-form-label text-left"
                                htmlFor="timeLimite"
                                style={{
                                  maxWidth: "50%",
                                }}
                              >
                                {t("Objet de controle interne")}
                              </label>
                              <div className="col-3 d-flex pt-1">
                                <input
                                  id="internal_control"
                                  type="checkbox"
                                  checked={data.internal_control === 1}
                                  disabled={false}
                                  onChange={handleInputControlInterne}
                                  style={{ width: 20, height: 30 }}
                                />
                                {error.internal_control.length
                                  ? error.internal_control.map(
                                      (error, index) => (
                                        <div
                                          key={index}
                                          className="invalid-feedback"
                                        >
                                          {error}
                                        </div>
                                      )
                                    )
                                  : null}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <div
                            className={`d-flex flex-column ${
                              error.claim_category_id.length
                                ? "form-group row validated"
                                : "form-group row"
                            }`}
                          >
                            <label
                              className="col-12 col-form-label text-left"
                              htmlFor="unit_type"
                            >
                              {t("Catégorie de l'objet")} <InputRequire />
                            </label>
                            <div className="col-12">
                              <Select
                                isClearable
                                value={claimCategory}
                                placeholder={t(
                                  "Catégorie de l'objet de réclamation"
                                )}
                                onChange={onChangeClaimCategory}
                                options={claimCategories}
                              />
                              {error.claim_category_id.length
                                ? error.claim_category_id.map(
                                    (error, index) => (
                                      <div
                                        key={index}
                                        className="invalid-feedback"
                                      >
                                        {error}
                                      </div>
                                    )
                                  )
                                : null}
                            </div>
                          </div>
                        </div>
                        <div className="col">
                          <div
                            className={`d-flex justify-content-center  align-items-start pl-3 ${
                              error.severity_levels_id.length
                                ? "form-group row validated"
                                : "form-group row"
                            }`}
                          >
                            <label
                              className="col-xl-12 col-form-label text-left"
                              htmlFor="timeLimite"
                            >
                              {t("Délai de traitement (en jours)")}{" "}
                              <InputRequire />
                            </label>
                            <div className="col-12">
                              <input
                                id="timeLimite"
                                type="number"
                                className={
                                  error.time_limit.length
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                placeholder={t("Temps limite de l'objet")}
                                value={data.time_limit}
                                onChange={(e) => {
                                  onChangeTimeLimit(e, "time_limit");
                                }}
                              />
                              {error.time_limit.length
                                ? error.time_limit.map((error, index) => (
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
                      </div>
                      <div className="row">
                        <div className="col">
                          <div
                            className={`d-flex flex-column ${
                              error.unite.length
                                ? "form-group row validated"
                                : "form-group row"
                            }`}
                          >
                            <label
                              className="col-12 col-form-label text-left"
                              htmlFor="time_unit"
                            >
                              {t("Quota pour affectation vers une unité")}{" "}
                              <InputRequire />
                            </label>
                            <div className="col-12">
                              <input
                                id="time_unit"
                                disabled
                                type="text"
                                className={
                                  error.unite.length
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                placeholder={t(
                                  "Temps limite d'affectation vers une unité"
                                )}
                                value={data?.time_unit}
                                // onChange={(e) => onChangeTimeLimit(e, "unite")}
                              />
                              {error.unite.length
                                ? error.unite.map((error, index) => (
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
                        <div className="col">
                          <div
                            className={`d-flex justify-content-center  align-items-start pl-3 ${
                              error.staff.length
                                ? "form-group row validated"
                                : "form-group row"
                            }`}
                          >
                            <label
                              className="col-xl-12 col-form-label text-left"
                              htmlFor="time_staff"
                            >
                              {t("Quota pour affectation vers un staff")}{" "}
                              <InputRequire />
                            </label>
                            <div className="col-12">
                              <input
                                id="time_staff"
                                disabled
                                type="text"
                                className={
                                  error.staff.length
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                placeholder={t(
                                  "Temps limite d'affectation vers un staff"
                                )}
                                value={data?.time_staff}
                                // onChange={(e) => onChangeTimeLimit(e, "staff")}
                              />
                              {error.staff.length
                                ? error.staff.map((error, index) => (
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
                      </div>
                      <div className="row">
                        <div className="col">
                          <div
                            className={`d-flex flex-column ${
                              error.traitement.length
                                ? "form-group row validated"
                                : "form-group row"
                            }`}
                          >
                            <label
                              className="col-12 col-form-label text-left"
                              htmlFor="time_treatment"
                            >
                              {t("Quota pour affectation traitement")}{" "}
                              <InputRequire />
                            </label>
                            <div className="col-12">
                              <input
                                id="time_treatment"
                                disabled
                                type="text"
                                className={
                                  error.traitement.length
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                placeholder={t(
                                  "Temps limite d'affectation pour traitement'"
                                )}
                                value={data?.time_treatment}
                                // onChange={(e) => onChangeTimeLimit(e, "traitement")}
                              />
                              {error.traitement.length
                                ? error.traitement.map((error, index) => (
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
                        <div className="col">
                          <div
                            className={`d-flex justify-content-center  align-items-start pl-3 ${
                              error.validation.length
                                ? "form-group row validated"
                                : "form-group row"
                            }`}
                          >
                            <label
                              className="col-xl-12 col-form-label text-left"
                              htmlFor="time_validation"
                            >
                              {t("Quota pour affectation validation")}{" "}
                              <InputRequire />
                            </label>
                            <div className="col-12">
                              <input
                                id="time_validation"
                                disabled
                                type="text"
                                className={
                                  error.validation.length
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                placeholder={t(
                                  "Temps limite d'affectation pour validation"
                                )}
                                value={data?.time_validation}
                              />
                              {error.validation.length
                                ? error.validation.map((error, index) => (
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
                      </div>
                      <div className="row">
                        <div className="col">
                          <div
                            className={`d-flex flex-column ${
                              error.satisfaction.length
                                ? "form-group row validated"
                                : "form-group row"
                            }`}
                          >
                            <label
                              className="col-12 col-form-label text-left"
                              htmlFor="time_measure_satisfaction"
                            >
                              {t(
                                "Quota pour affectation mesure de satisfaction"
                              )}{" "}
                              <InputRequire />
                            </label>
                            <div className="col-12">
                              <input
                                id="time_measure_satisfaction"
                                disabled
                                type="text"
                                className={
                                  error.satisfaction.length
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                placeholder={t(
                                  "Temps limite d'affectation pour la mesure de satisfaction"
                                )}
                                value={data?.time_measure_satisfaction}
                                // onChange={(e) => onChangeTimeLimit(e, "satisfaction")}
                              />
                              {error.time_limit.length
                                ? error.time_limit.map((error, index) => (
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
                        <div className="col">
                          <div
                            className={`d-flex justify-content-center  align-items-start pl-3 ${
                              error.severity_levels_id.length
                                ? "form-group row validated"
                                : "form-group row"
                            }`}
                          >
                            <label
                              className="col-xl-12 col-form-label text-left"
                              htmlFor="severityLevel"
                            >
                              {t("Niveau de gravité")} <InputRequire />
                              <InputRequire />
                            </label>
                            <div className="col-12">
                              <Select
                                id="severityLevel   "
                                isClearable
                                value={severityLevel}
                                placeholder={t(
                                  "Selectioner le niveau de gravité"
                                )}
                                onChange={onChangeSeverityLevel}
                                options={severityLevels}
                              />
                              {error.severity_levels_id.length
                                ? error.severity_levels_id.map(
                                    (error, index) => (
                                      <div
                                        key={index}
                                        className="invalid-feedback"
                                      >
                                        {error}
                                      </div>
                                    )
                                  )
                                : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          error.description.length
                            ? "form-group row validated"
                            : "form-group row"
                        }
                      >
                        <label
                          className="col-xl-2 col-lg-2 col-form-label text-left"
                          htmlFor="description"
                        >
                          {t("Description")}
                        </label>
                        <div className="col-xl-10 col-lg-10">
                          <textarea
                            id="description"
                            className={
                              error.description.length
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            placeholder={t("Description")}
                            cols="30"
                            rows="5"
                            value={data.description}
                            onChange={(e) => onChangeDescription(e)}
                          />
                          {error.description.length
                            ? error.description.map((error, index) => (
                                <div key={index} className="invalid-feedback">
                                  {error}
                                </div>
                              ))
                            : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="kt-portlet__foot">
                    <div className="kt-form__actions text-right">
                      {!startRequest ? (
                        <button
                          type="submit"
                          onClick={(e) => onSubmit(e)}
                          className="btn btn-primary"
                        >
                          {id ? t("Modifier") : t("Enregistrer")}
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
                      {!startRequest ? (
                        <Link
                          to="/settings/claim_objects"
                          className="btn btn-secondary mx-2"
                        >
                          {t("Quitter")}
                        </Link>
                      ) : (
                        <Link
                          to="/settings/claim_objects"
                          className="btn btn-secondary mx-2"
                          disabled
                        >
                          {t("Quitter")}
                        </Link>
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
  );

  return ready
    ? id
      ? verifyPermission(props.userPermissions, "update-claim-object")
        ? printJsx()
        : null
      : verifyPermission(props.userPermissions, "store-claim-object")
      ? printJsx()
      : null
    : null;
};

const mapStateToProps = (state) => {
  return {
    userPermissions: state.user.user.permissions,
  };
};

export default connect(mapStateToProps)(ClaimObjectForm);
