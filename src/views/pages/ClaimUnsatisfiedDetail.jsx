import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import {
  formatDateToTimeStampte,
  formatSelectOption,
  loadCss,
  loadScript,
} from "../../helpers/function";
import { verifyPermission } from "../../helpers/permission";
import { ERROR_401 } from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import FusionClaim from "../components/FusionClaim";
import { ToastBottomEnd } from "../components/Toast";
import {
  toastAddErrorMessageConfig,
  toastAddSuccessMessageConfig,
} from "../../config/toastConfig";
import ClientButton from "../components/ClientButton";
import ClaimButton from "../components/ClaimButton";
import AttachmentsButton from "../components/AttachmentsButton";
import DoubleButton from "../components/DoubleButton";
import ClientButtonDetail from "../components/ClientButtonDetail";
import ClaimButtonDetail from "../components/ClaimButtonDetail";
import DoubleButtonDetail from "../components/DoubleButtonDetail";
import AttachmentsButtonDetail from "../components/AttachmentsButtonDetail";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import { useTranslation } from "react-i18next";
import CloseModal from "../components/CloseModal";
import TreatmentButtonDetail from "../components/TreatmentButtonDetail";
import CreateCommitteeSpecific from "../components/CreateCommitteeSpecific";

loadCss("/assets/css/pages/wizard/wizard-2.css");
loadScript("/assets/js/pages/custom/wizard/wizard-2.js");
loadScript("/assets/js/pages/custom/chat/chat.js");

const endPointConfig = {
  PRO: {
    plan: "PRO",
    edit: (id) =>
      `${appConfig.apiDomaine}/transfer-claim-to-circuit-unit/${id}`,
    update: (id) =>
      `${appConfig.apiDomaine}/transfer-claim-to-circuit-unit/${id}`,
  },
  MACRO: {
    plan: "MACRO",
    edit: (id) =>
      `${appConfig.apiDomaine}/transfer-claim-to-circuit-unit/${id}`,
    update: (id) =>
      `${appConfig.apiDomaine}/transfer-claim-to-circuit-unit/${id}`,
  },
  HUB: {
    plan: "HUB",
    edit: (id) => `${appConfig.apiDomaine}/transfer-claim-to-unit/${id}`,
    update: (id) => `${appConfig.apiDomaine}/transfer-claim-to-unit/${id}`,
  },
};

const ClaimUnsatisfiedDetail = (props) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  document.title = "Satis client -" + ready ? t("Détails réclamation") : "";
  const { id } = useParams();

  // if (
  //   !(
  //     verifyPermission(props.userPermissions, "list-my-claim-unsatisfied") &&
  //     props.activePilot
  //   )
  // )
  //   window.location.href = ERROR_401;

  let endPoint = endPointConfig[props.plan];

  const defaultError = {
    unit_id: [],
    parent_id: [],
    name: [],
    motif: [],
    closed_reason: [],
  };
  const [error, setError] = useState(defaultError);

  const [claim, setClaim] = useState(null);
  const [copyClaim, setCopyClaim] = useState(null);
  const [dataId, setDataId] = useState("");
  const [DiscussionName, setDiscussionName] = useState("");
  const [CloseRaison, setCloseRaison] = useState("");
  const [data, setData] = useState({ unit_id: null });
  const [CanCommunicate, setCanCommunicate] = useState(0);
  const [Solution, setSolution] = useState("");
  const [unitsData, setUnitsData] = useState({});
  const [unit, setUnit] = useState(null);
  const [startRequest, setStartRequest] = useState(false);
  const [showTreatment, setShowTreatment] = useState(null);
  const [showStandard, setStandard] = useState("");
  const [showSpecific, setSpecific] = useState("");
  const [UnitParent, setUnitParent] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (verifyTokenExpire()) {
        await axios
          .get(`${appConfig.apiDomaine}/claims/details/${id}`)
          .then((response) => {
            setUnitParent(
              response.data.active_treatment?.responsible_unit?.parent
            );
            setShowTreatment(
              response.data.active_treatment?.responsible_unit?.parent_id
            );
            setStandard(response.data?.standard_bord_exists ?? "0");
            setSpecific(response.data?.specific_bord_exists ?? "0");
            setClaim(response.data);
            setDataId(
              response.data.institution_targeted
                ? response.data.institution_targeted.name
                : "-"
            );
          })

          .catch((error) => console.log(error));
      }

      if (verifyTokenExpire()) {
        await axios
          .get(`${appConfig.apiDomaine}/escalation-config`)
          .then((response) => {
            setStandard(response.data?.standard_bord_exists ?? "0");
            setSpecific(response.data?.specific_bord_exists ?? "0");
          })
          .catch((error) => console.log(error));
      }

      if (
        verifyPermission(
          props.userPermissions,
          "transfer-claim-to-circuit-unit"
        ) ||
        verifyPermission(props.userPermissions, "transfer-claim-to-unit")
      ) {
        if (verifyTokenExpire()) {
          await axios
            .get(endPoint.edit(`${id}`))
            .then((response) => {
              let newUnit = Object.values(response.data.units);
              setUnitsData(formatSelectOption(newUnit, "name", "fr"));
            })
            .catch((error) => console.log("Something is wrong"));
        }
      }
    }

    fetchData();
  }, []);

  const onClickToTranfertInstitution = async (e) => {
    e.preventDefault();
    setStartRequest(true);
    if (verifyTokenExpire()) {
      await axios
        .put(
          `${appConfig.apiDomaine}/transfer-claim-to-targeted-institution/${id}`
        )
        .then((response) => {
          setStartRequest(false);
          ToastBottomEnd.fire(toastAddSuccessMessageConfig());
          window.location.href = "/process/claim-unsatisfied";
        })
        .catch((error) => {
          setStartRequest(false);
          ToastBottomEnd.fire(toastAddErrorMessageConfig());
        });
    }
  };

  const onChangeUnits = (selected) => {
    const newData = { ...data };
    newData.unit_id = selected ? selected.value : null;
    setUnit(selected);
    setData(newData);
    console.log(newData.unit_id, "UNIT");
  };

  const onClickToTranfert = (e) => {
    e.preventDefault();
    setStartRequest(true);
    setShowTreatment(true);
    const newData = {
      unit_id: UnitParent.id,
      claim_id: id,
    };
    axios
      .put(
        appConfig.apiDomaine + `/transfer-claim-to-circuit-unit/${id}`,
        newData
      )
      .then((response) => {
        setStartRequest(true);
        setShowTreatment(
          response.data.active_treatment?.responsible_unit?.parent_id ?? null
        );
        ToastBottomEnd.fire(toastAddSuccessMessageConfig());
        window.location.href = "/process/claim-unsatisfied";
      })
      .catch((error) => {
        setStartRequest(false);
        setShowTreatment(false);
        ToastBottomEnd.fire(toastAddErrorMessageConfig());
      });
  };

  const onClickToTranfertStandard = (e) => {
    e.preventDefault();
    setStartRequest(true);
    const newData = {
      type: "standard",
      claim_id: id,
    };
    axios
      .post(appConfig.apiDomaine + `/treatments-boards`, newData)
      .then((response) => {
        ToastBottomEnd.fire(toastAddSuccessMessageConfig());
        window.location.href = "/process/claim-unsatisfied";
      })
      .catch((error) => {
        ToastBottomEnd.fire(toastAddErrorMessageConfig());
      })
      .finally(() => {
        setStartRequest(false);
      });
  };

  const onDiscutionCreation = (e) => {
    e.preventDefault();
    setStartRequest(true);
    const newData = {
      name: DiscussionName,
      claim_id: id,
    };
    axios
      .post(appConfig.apiDomaine + `/discussions`, newData)
      .then((response) => {
        ToastBottomEnd.fire(toastAddSuccessMessageConfig());
        window.location.reload();
      })
      .catch((error) => {
        ToastBottomEnd.fire(toastAddErrorMessageConfig());
      })
      .finally(() => {
        setStartRequest(false);
      });
  };

  const onCloseClaim = (e) => {
    e.preventDefault();
    setStartRequest(true);
    const newData = {
      motif: CloseRaison,
    };
    axios
      .put(
        appConfig.apiDomaine + `/claim-assignment-adhoc-staff/${id}/closing`,
        newData
      )
      .then((response) => {
        setCloseRaison("");
        ToastBottomEnd.fire(toastAddSuccessMessageConfig());
        window.history.back();
      })
      .catch((error) => {
        ToastBottomEnd.fire(toastAddErrorMessageConfig());
      })
      .finally(() => {
        setStartRequest(false);
      });
  };

  const onSolutionSetting = (e) => {
    e.preventDefault();
    setStartRequest(true);
    const newData = {
      can_communicate: CanCommunicate,
      solution: CanCommunicate ? Solution : "",
    };
    axios
      .put(
        appConfig.apiDomaine + `/claim-assignment-adhoc-staff/${id}/treatment`,
        newData
      )
      .then((response) => {
        setCloseRaison("");
        ToastBottomEnd.fire(toastAddSuccessMessageConfig());
        // window.location.href = "/process/claim-unsatisfied";
      })
      .catch((error) => {
        ToastBottomEnd.fire(toastAddErrorMessageConfig());
      })
      .finally(() => {
        setStartRequest(false);
      });
  };

  return ready ? (
    verifyPermission(props.userPermissions, "list-my-claim-unsatisfied") ||
    true ? (
      <div
        className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
        id="kt_content"
      >
        <div className="kt-subheader   kt-grid__item" id="kt_subheader">
          <div className="kt-container  kt-container--fluid ">
            <div className="kt-subheader__main">
              <h3 className="kt-subheader__title">{t("Traitement")}</h3>
              <span className="kt-subheader__separator kt-hidden" />
              <div className="kt-subheader__breadcrumbs">
                <span className="kt-subheader__separator kt-hidden" />
                <div className="kt-subheader__breadcrumbs">
                  <a href="#icone" className="kt-subheader__breadcrumbs-home">
                    <i className="flaticon2-shelter" />
                  </a>
                  <span className="kt-subheader__breadcrumbs-separator" />
                  <Link
                    to={
                      claim?.escalation_status === "unsatisfied"
                        ? "/process/claim-assign"
                        : claim?.escalation_status === "transfered_to_comity" ||
                          claim?.escalation_status === "at_discussion"
                        ? "/process/escalation/ad-hoc/claim-assign-pending/to-staff"
                        : "/process/escalation/ad-hoc/claim-assign-pending/to-staff"
                    }
                    className="kt-subheader__breadcrumbs-link"
                  >
                    {claim?.escalation_status === "unsatisfied"
                      ? t("Réclamations non satisfaites")
                      : claim?.escalation_status === "transfered_to_comity" ||
                        claim?.escalation_status === "at_discussion"
                      ? t("Réclamations à traiter par le comité")
                      : t("Réclamations à traiter par le comité")}
                  </Link>
                </div>
              </div>
              <span className="kt-subheader__separator kt-hidden" />
              <div className="kt-subheader__breadcrumbs">
                <a href="#" className="kt-subheader__breadcrumbs-home">
                  <i className="flaticon2-shelter" />
                </a>
                <span className="kt-subheader__breadcrumbs-separator" />
                <a
                  href="#detail"
                  onClick={(e) => e.preventDefault()}
                  style={{ cursor: "default" }}
                  className="kt-subheader__breadcrumbs-link"
                >
                  {t("Détails")}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
          <div className="kt-portlet">
            <div className="kt-portlet__body kt-portlet__body--fit">
              <div
                className="kt-grid  kt-wizard-v2 kt-wizard-v2--white"
                id="kt_wizard_v2"
                data-ktwizard-state="step-first"
              >
                <div className="kt-grid__item kt-wizard-v2__aside">
                  <div className="kt-wizard-v2__nav">
                    <div className="kt-wizard-v2__nav-items kt-wizard-v2__nav-items--clickable">
                      {claim ? (
                        claim.active_treatment &&
                        claim.active_treatment.rejected_reason &&
                        claim.active_treatment.rejected_at ? (
                          <div className="d-flex justify-content-start">
                            <span
                              className="kt-badge kt-badge--danger kt-badge--inline"
                              style={{ fontWeight: "bold" }}
                            >
                              {t("RECLAMATION  REJETÉE")}
                            </span>
                          </div>
                        ) : null
                      ) : null}
                      <br />

                      <ClientButton />

                      <ClaimButton />

                      <AttachmentsButton claim={claim} />

                      <div
                        className="kt-wizard-v2__nav-item"
                        data-ktwizard-type="step"
                      >
                        <div className="kt-wizard-v2__nav-body">
                          <div className="kt-wizard-v2__nav-icon">
                            <i className="flaticon-list" />
                          </div>
                          <div className="kt-wizard-v2__nav-label">
                            <div className="kt-wizard-v2__nav-label-title">
                              {t("Ancien traitement")}
                            </div>
                            <div className="kt-wizard-v2__nav-label-desc">
                              {t("Détails de l'ancien traitement effectué")}
                            </div>
                          </div>
                        </div>
                      </div>

                      {
                        <div
                          className="kt-wizard-v2__nav-item"
                          data-ktwizard-type="step"
                          hidden={!props?.activePilot}
                        >
                          <div className="kt-wizard-v2__nav-body">
                            <div className="kt-wizard-v2__nav-icon">
                              <i className="flaticon-truck" />
                            </div>
                            <div className="kt-wizard-v2__nav-label">
                              <div className="kt-wizard-v2__nav-label-title">
                                {t("Transfert")}
                              </div>
                              <div className="kt-wizard-v2__nav-label-desc">
                                {t("Transférer la réclamation")}
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                      {
                        <div
                          hidden={claim?.escalation_status !== "at_discussion"}
                          className="kt-wizard-v2__nav-item"
                          data-ktwizard-type="step"
                        >
                          <div className="kt-wizard-v2__nav-body">
                            <div className="kt-wizard-v2__nav-icon">
                              <i className="flaticon-close" />
                            </div>
                            <div className="kt-wizard-v2__nav-label">
                              <div className="kt-wizard-v2__nav-label-title">
                                {t("Clôturer")}
                              </div>
                              <div className="kt-wizard-v2__nav-label-desc">
                                {t("Clôturer la réclamation")}
                              </div>
                            </div>
                          </div>
                        </div>
                      }

                      {
                        <div
                          className="kt-wizard-v2__nav-item"
                          data-ktwizard-type="step"
                          hidden={
                            claim?.escalation_status !==
                              "transferred_to_comity" &&
                            claim?.escalation_status !== "at_discussion"
                          }
                        >
                          <div className="kt-wizard-v2__nav-body">
                            <div className="kt-wizard-v2__nav-icon">
                              <i className="flaticon2-chat-2" />
                            </div>
                            <div className="kt-wizard-v2__nav-label">
                              <div className="kt-wizard-v2__nav-label-title">
                                {t("Discussion")}
                              </div>
                              <div className="kt-wizard-v2__nav-label-desc">
                                {t("Créer une discussion")}
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                      {
                        <div
                          className="kt-wizard-v2__nav-item"
                          data-ktwizard-type="step"
                          hidden={
                            claim?.escalation_status ===
                              "transferred_to_comity" ||
                            claim?.escalation_status === "unsatisfied" ||
                            props?.userId !==
                              claim?.active_treatment
                                ?.escalation_responsible_staff_id
                          }
                        >
                          <div className="kt-wizard-v2__nav-body">
                            <div className="kt-wizard-v2__nav-icon">
                              <i className="flaticon2-chat-2" />
                            </div>
                            <div className="kt-wizard-v2__nav-label">
                              <div className="kt-wizard-v2__nav-label-title">
                                {t("Traiter")}
                              </div>
                              <div className="kt-wizard-v2__nav-label-desc">
                                {t("Traiter la réclamation")}
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>

                <div className="kt-grid__item kt-grid__item--fluid kt-wizard-v2__wrapper">
                  <form className="kt-form" id="kt_form">
                    {verifyPermission(
                      props.userPermissions,
                      "close-my-claims"
                    ) ? (
                      <div className="d-flex justify-content-md-end">
                        <button
                          type="button"
                          data-keyboard="false"
                          data-backdrop="static"
                          data-toggle="modal"
                          data-target="#exampleModal"
                          className="btn btn-danger"
                        >
                          {t("Clôturer").toUpperCase()}
                        </button>
                        {claim ? (
                          <CloseModal
                            activeTreatment={
                              claim.active_treatment
                                ? claim.active_treatment
                                : null
                            }
                            getId={`${id}`}
                          />
                        ) : (
                          <CloseModal getId={`${id}`} />
                        )}
                      </div>
                    ) : null}

                    <ClientButtonDetail claim={claim} />

                    <ClaimButtonDetail claim={claim} />

                    <AttachmentsButtonDetail claim={claim} />

                    <TreatmentButtonDetail archive={true} claim={claim} />

                    {
                      <div
                        className="kt-wizard-v2__content"
                        data-ktwizard-type="step-content"
                        hidden={!props.activePilot}
                      >
                        <div className="kt-heading kt-heading--md">
                          {t("Transfert de la réclamation")}
                        </div>
                        <div className="kt-form__section kt-form__section--first">
                          <div className="kt-wizard-v2__review">
                            {claim &&
                            claim.active_treatment &&
                            claim.active_treatment.rejected_at ? (
                              <div className="kt-wizard-v2__review-item">
                                <div className="kt-wizard-v2__review-title">
                                  <h5>
                                    <span style={{ color: "red" }}>
                                      {t("Unité de traitement")}
                                    </span>
                                  </h5>
                                </div>
                                <div className="kt-wizard-v2__review-content">
                                  <strong>{t("Unité")}:</strong>
                                  <span className="mx-2">
                                    {claim.active_treatment.responsible_unit
                                      ? claim.active_treatment.responsible_unit
                                          .name["fr"]
                                      : "-"}{" "}
                                  </span>
                                  <br />
                                </div>
                              </div>
                            ) : null}

                            {claim &&
                            claim.active_treatment &&
                            claim.active_treatment.rejected_at ? (
                              <div className="kt-wizard-v2__review-item">
                                <div className="kt-wizard-v2__review-title">
                                  <h5>
                                    <span style={{ color: "red" }}>
                                      {t("Rejet")}
                                    </span>
                                  </h5>
                                </div>
                                <div className="kt-wizard-v2__review-content">
                                  <strong>{t("Raison du rejet")}:</strong>
                                  <span className="mx-2 text-danger">
                                    {claim.active_treatment.rejected_reason}
                                  </span>
                                  <br />
                                  <strong>{t("Date de rejet")}:</strong>
                                  <span className="mx-2">
                                    {formatDateToTimeStampte(
                                      claim.active_treatment.rejected_at
                                    )}
                                  </span>
                                  <br />
                                  <strong>{t("Nombre de rejet")}:</strong>
                                  <span className="mx-2">
                                    {claim.active_treatment.number_reject}
                                  </span>
                                  <br />
                                </div>
                              </div>
                            ) : null}

                            {verifyPermission(
                              props.userPermissions,
                              "transfer-claim-to-targeted-institution"
                            ) ? (
                              <div className="kt-wizard-v2__review-item">
                                <div
                                  className="kt-wizard-v2__review-content"
                                  style={{ fontSize: "15px" }}
                                >
                                  <label className="col-xl-6 col-lg-6 col-form-label">
                                    <strong>
                                      {t("Institution concernée")}
                                    </strong>
                                  </label>
                                  <span className="kt-widget__data">
                                    {dataId}
                                  </span>
                                </div>
                                <div className="modal-footer">
                                  {!startRequest ? (
                                    <button
                                      className="btn btn-outline-success"
                                      onClick={onClickToTranfertInstitution}
                                    >
                                      {t(
                                        "Transférer à l'institution"
                                      ).toUpperCase()}
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-success kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                      type="button"
                                      disabled
                                    >
                                      {t("Chargement")}...
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : null}

                            {verifyPermission(
                              props.userPermissions,
                              "transfer-claim-to-circuit-unit"
                            ) ||
                            verifyPermission(
                              props.userPermissions,
                              "transfer-claim-to-unit"
                            ) ? (
                              <>
                                {showTreatment !== null ? (
                                  <div className="kt-wizard-v2__review-item">
                                    <div className="kt-wizard-v2__review-title">
                                      {t("Transférer à l'unité N+1 de l'unité")}
                                    </div>
                                    <div className=" text-center">
                                      {!startRequest ? (
                                        <button
                                          className="btn btn-outline-success"
                                          onClick={onClickToTranfert}
                                        >
                                          {t("Transférer à")}{" "}
                                          {UnitParent.name["fr"]
                                            ? UnitParent.name["fr"]
                                            : ""}
                                        </button>
                                      ) : (
                                        <button
                                          className="btn btn-success kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                          type="button"
                                          disabled
                                        >
                                          {t("Chargement")}...
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ) : null}

                                {showStandard == "1" || showSpecific == "1" ? (
                                  <div className="kt-wizard-v2__review-item">
                                    <div className="kt-wizard-v2__review-title">
                                      {t("Transférer au comité Ad'hoc")}
                                    </div>

                                    <div className="modal-footer d-flex text-center">
                                      {showStandard == "1" ? (
                                        !startRequest ? (
                                          <button
                                            className="btn btn-outline-success"
                                            onClick={onClickToTranfertStandard}
                                          >
                                            {t("Transférer au comité standard")}
                                          </button>
                                        ) : (
                                          <button
                                            className="btn btn-success kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                            type="button"
                                            disabled
                                          >
                                            {t("Chargement")}...
                                          </button>
                                        )
                                      ) : null}

                                      {showSpecific == "1" ? (
                                        <div className="d-flex justify-content-md-end">
                                          <button
                                            type="button"
                                            data-keyboard="false"
                                            data-backdrop="static"
                                            data-toggle="modal"
                                            data-target="#exampleModalCommittee"
                                            className="btn btn-outline-primary"
                                          >
                                            {t(
                                              "Transférer au comité spécifique"
                                            )}
                                          </button>
                                          {claim ? (
                                            <CreateCommitteeSpecific
                                              activeTreatment={
                                                claim.active_treatment
                                                  ? claim.active_treatment
                                                  : null
                                              }
                                              getId={`${id}`}
                                            />
                                          ) : (
                                            <CreateCommitteeSpecific
                                              getId={`${id}`}
                                            />
                                          )}
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                ) : null}
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    }

                    {
                      <div
                        className="kt-wizard-v2__content"
                        data-ktwizard-type="step-content"
                        hidden={claim?.escalation_status !== "at_discussion"}
                      >
                        <div className="kt-heading kt-heading--md">
                          {" "}
                          {t("Clôture de la réclamation")}{" "}
                        </div>
                        <div className="kt-form__section kt-form__section--first">
                          <div className="kt-wizard-v2__review">
                            <div
                              className={
                                error.closed_reason.length
                                  ? "form-group validated"
                                  : "form-group"
                              }
                            >
                              <label htmlFor="description">
                                {t("Motif")}{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <textarea
                                id="description"
                                className={
                                  false
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                placeholder={t(
                                  "Veuillez entrer la description du motif"
                                )}
                                cols="62"
                                rows="7"
                                value={CloseRaison}
                                onChange={(e) => setCloseRaison(e.target.value)}
                              />
                              {error.closed_reason.length
                                ? error.closed_reason.map((error, index) => (
                                    <div
                                      key={index}
                                      className="invalid-feedback"
                                    >
                                      {error}
                                    </div>
                                  ))
                                : ""}
                            </div>
                            {!startRequest ? (
                              <button
                                type="submit"
                                onClick={(e) => onCloseClaim(e)}
                                className="btn btn-primary"
                              >
                                {"Clôturer"}
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
                    }

                    {
                      <div
                        className="kt-wizard-v2__content"
                        data-ktwizard-type="step-content"
                        hidden={
                          claim?.escalation_status !==
                            "transferred_to_comity" &&
                          claim?.escalation_status !== "at_discussion"
                        }
                      >
                        {claim?.escalation_status ===
                        "transferred_to_comity" ? (
                          <>
                            <div className="kt-heading kt-heading--md">
                              {t("Création de la discussion")}{" "}
                            </div>

                            <div className="kt-portlet__body col-12">
                              <div className="kt-section kt-section--first">
                                <div className="kt-section__body">
                                  <div
                                    className={
                                      error.name.length
                                        ? "form-group row validated"
                                        : "form-group row"
                                    }
                                  >
                                    <label className="col-12" htmlFor="name">
                                      {t("Nom de Discussion")}
                                    </label>
                                    <div className="col-12">
                                      <input
                                        id="name"
                                        type="text"
                                        className={
                                          error.name.length
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }
                                        placeholder={t("Veillez entrer le nom")}
                                        value={DiscussionName}
                                        onChange={(e) =>
                                          setDiscussionName(e.target.value)
                                        }
                                      />
                                      {error?.name?.length
                                        ? error?.name?.map((error, index) => (
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
                                <div className="kt-portlet__foo">
                                  <div className="kt-form__actions text-right">
                                    {!startRequest ? (
                                      <button
                                        type="submit"
                                        onClick={(e) => onDiscutionCreation(e)}
                                        className="btn btn-primary"
                                      >
                                        {t("Ajouter")}
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
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="kt-heading kt-heading--md">
                              {t(
                                "Réjoindre la discution autour de la discussion"
                              )}{" "}
                            </div>
                            <a href="/chat/escalation#messageList">
                              <button type="button" className="btn btn-primary">
                                {t("Rejoindre la discussion")}
                              </button>
                            </a>
                          </>
                        )}
                      </div>
                    }

                    {
                      <div
                        className="kt-wizard-v2__content"
                        data-ktwizard-type="step-content"
                        hidden={
                          claim?.escalation_status ===
                            "transferred_to_comity" ||
                          claim?.escalation_status === "unsatisfied" ||
                          props.userId !==
                            claim?.active_treatment
                              ?.escalation_responsible_staff_id
                        }
                      >
                        <div className="kt-heading kt-heading--md">
                          {t("Traiter la réclamation")}{" "}
                        </div>

                        <div className="kt-portlet__body col-12">
                          <div className="kt-section kt-section--first">
                            <div className="kt-section__body">
                              <div
                                className={
                                  error.closed_reason.length
                                    ? "form-group validated"
                                    : "form-group"
                                }
                              >
                                <span
                                  style={{
                                    transform: "scale(0.9,0.9)",
                                    marginLeft: "-24px",
                                  }}
                                  className="kt-switch col-12"
                                >
                                  <label>
                                    <input
                                      style={{}}
                                      id="inactivity_control"
                                      type="checkbox"
                                      checked={CanCommunicate}
                                      name="can_communicate"
                                      onChange={(e) => {
                                        const { checked } = e.target;
                                        setCanCommunicate(checked ? 1 : 0);
                                      }}
                                    />
                                    <span />
                                    <div
                                      style={{
                                        fontSize: "16px",
                                        whiteSpace: "nowrap",
                                        marginTop: "6px",
                                      }}
                                    >
                                      {t(
                                        "Voulez vous communiquer la solution au réclamant"
                                      )}
                                    </div>
                                  </label>
                                </span>
                              </div>
                              <div
                                hidden={!CanCommunicate}
                                className={
                                  error.closed_reason.length
                                    ? "form-group validated"
                                    : "form-group"
                                }
                              >
                                <label htmlFor="description">
                                  {t("Solution")}
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <textarea
                                  id="description"
                                  className={
                                    error.closed_reason.length
                                      ? "form-control is-invalid"
                                      : "form-control"
                                  }
                                  placeholder={t(
                                    "Veuillez entrer la description du motif"
                                  )}
                                  cols="62"
                                  rows="7"
                                  value={Solution}
                                  onChange={(e) => setSolution(e.target.value)}
                                />
                                {error.closed_reason.length
                                  ? error.closed_reason.map((error, index) => (
                                      <div
                                        key={index}
                                        className="invalid-feedback"
                                      >
                                        {error}
                                      </div>
                                    ))
                                  : ""}
                              </div>
                            </div>
                            <div className="kt-portlet__foo">
                              <div className="kt-form__actions text-right">
                                {!startRequest ? (
                                  <button
                                    type="submit"
                                    onClick={(e) => onSolutionSetting(e)}
                                    className="btn btn-primary"
                                  >
                                    {t("Traiter")}
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
                        </div>
                      </div>
                    }

                    <div className="kt-form__actions">
                      <button
                        className="btn btn-secondary btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u"
                        data-ktwizard-type="action-prev"
                      >
                        {t("PRÉCÉDENT")}
                      </button>

                      <button
                        className="btn btn-brand btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u"
                        data-ktwizard-type="action-next"
                      >
                        {t("SUIVANT")}
                      </button>
                    </div>
                  </form>
                </div>
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
    lead: state.user.user.staff.is_lead,
    plan: state.plan.plan,
    activePilot: state.user.user.staff.is_active_pilot,
    userId: state.user.user.staff.id,
  };
};

export default connect(mapStateToProps)(ClaimUnsatisfiedDetail);
