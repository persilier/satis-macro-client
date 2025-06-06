import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import {
  formatDateToTimeStampte,
  loadCss,
  loadScript,
} from "../../../helpers/function";
import { verifyTokenExpire } from "middleware/verifyToken";
import axios from "axios";
import appConfig from "../../../config/appConfig";
import Loader from "../Loader";
import { useTranslation } from "react-i18next";
import { ToastBottomEnd } from "../Toast";
import {
  toastAssignClaimSuccessMessageConfig,
  toastAddErrorMessageConfig,
} from "config/toastConfig";

loadCss("/assets/css/pages/wizard/wizard-2.css");
loadScript("/assets/js/pages/custom/wizard/wizard-2.js");
loadScript("/assets/js/pages/custom/chat/chat.js");

const ClaimDetails = (props) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  const claim = props.claim;

  const [first, setFist] = useState("current");
  const [second, setSecond] = useState("pending");
  const [third, setThird] = useState("pending");
  const [last, setLast] = useState("pending");

  const onClickFirst = () => {
    setFist("current");
    setSecond("pending");
    setThird("pending");
    setLast("pending");
  };

  const onClickSecond = () => {
    setFist("done");
    setSecond("current");
    setThird("pending");
    setLast("pending");
  };

  const onClickThird = () => {
    setFist("done");
    setSecond("done");
    setThird("current");
    setLast("pending");
  };

  const onClickLast = () => {
    setFist("done");
    setSecond("done");
    setThird("done");
    setLast("current");
  };

  // const onClickPrevious = (e) => {
  //   e.preventDefault();
  //   if (last === "current") onClickThird();
  //   else if (third === "current") onClickSecond();
  //   else if (second === "current") onClickFirst();
  // };

  // const onClickNext = (e) => {
  //   e.preventDefault();
  //   if (first === "current") onClickSecond();
  //   else if (second === "current") onClickThird();
  //   else if (third === "current") onClickLast();
  // };

  const elements = useRef(null);

  useEffect(() => {
    elements.current.innerHTML = "";
    const iframe = document.createElement("iframe");
    elements.current.appendChild(iframe);
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.setAttribute("style", "overflow-y: auto");
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(claim.description);
    iframe.contentWindow.document.close();
  }, [claim.description]);
  return ready ? (
    <div className="kt-portlet__body kt-portlet__body--fit w-100">
      <div
        className="kt-grid  kt-wizard-v2 kt-wizard-v2--white"
        id="kt_wizard_v2"
        data-ktwizard-state={
          first === "current"
            ? "step-first"
            : last === "current"
            ? "last"
            : "between"
        }
      >
        <div className="kt-grid__item kt-wizard-v2__aside">
          <div className="kt-wizard-v2__nav">
            <div className="kt-wizard-v2__nav-items kt-wizard-v2__nav-items--clickable">
              <div
                onClick={() => onClickFirst()}
                className="kt-wizard-v2__nav-item"
                data-ktwizard-type="step"
                data-ktwizard-state={first}
              >
                <div className="kt-wizard-v2__nav-body">
                  <div className="kt-wizard-v2__nav-icon">
                    <i className="flaticon-user-settings" />
                  </div>
                  <div className="kt-wizard-v2__nav-label">
                    <div className="kt-wizard-v2__nav-label-title">
                      {t("Client")}
                    </div>
                    <div className="kt-wizard-v2__nav-label-desc">
                      {t("Acceder aux détails du client")}
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => onClickSecond()}
                className="kt-wizard-v2__nav-item"
                data-ktwizard-type="step"
                data-ktwizard-state={second}
              >
                <div className="kt-wizard-v2__nav-body">
                  <div className="kt-wizard-v2__nav-icon">
                    <i className="flaticon-book" />
                  </div>
                  <div className="kt-wizard-v2__nav-label">
                    <div className="kt-wizard-v2__nav-label-title">
                      {t("Réclamation")}
                    </div>
                    <div className="kt-wizard-v2__nav-label-desc">
                      {t("Acceder aux détails de la réclamation")}
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => onClickThird()}
                className="kt-wizard-v2__nav-item"
                href="#"
                data-ktwizard-type="step"
                data-ktwizard-state={third}
              >
                <div className="kt-wizard-v2__nav-body">
                  <div className="kt-wizard-v2__nav-icon">
                    <i className="flaticon-file-2" />
                  </div>
                  <div className="kt-wizard-v2__nav-label">
                    <div className="kt-wizard-v2__nav-label-title">
                      {t("Pièces jointes")}
                      {!props.claim ? (
                        ""
                      ) : (
                        <span className="mx-lg-4 kt-badge kt-badge--success  kt-badge--inline kt-badge--pill">
                          {props.claim.files.length}
                        </span>
                      )}
                    </div>
                    <div className="kt-wizard-v2__nav-label-desc">
                      {t("Accéder à la liste des pièces jointes")}
                    </div>
                  </div>
                </div>
              </div>
              {props.lead &&
                props.multi &&
                !["incomplete", "full"].includes(props.claim.status) && (
                  <div
                    onClick={() => onClickLast()}
                    className="kt-wizard-v2__nav-item"
                    href="#"
                    data-ktwizard-type="step"
                    data-ktwizard-state={last}
                  >
                    <div className="kt-wizard-v2__nav-body">
                      <div className="kt-wizard-v2__nav-icon">
                        <i className="flaticon-file-2" />
                      </div>
                      <div className="kt-wizard-v2__nav-label">
                        <div className="kt-wizard-v2__nav-label-title">
                          {t("Réaffectation")}
                        </div>
                        <div className="kt-wizard-v2__nav-label-desc">
                          {t("Changer le pilote d'une réclamation")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="kt-grid__item kt-grid__item--fluid kt-wizard-v2__wrapper">
          <form className="kt-form" id="kt_form">
            <div
              className="kt-wizard-v2__content"
              data-ktwizard-type="step-content"
              data-ktwizard-state={first === "current" ? "current" : "pending"}
            >
              <div className="kt-heading kt-heading--md">
                {t("Détails du client")}
              </div>
              <div className="kt-form__section kt-form__section--first">
                <div className="kt-wizard-v2__review">
                  <div className="kt-wizard-v2__review-item">
                    <div className="kt-widget kt-widget--user-profile-1">
                      <div className="kt-widget__head">
                        <div className="kt-widget__media">
                          <img
                            src="/personal/img/default-avatar.png"
                            alt="image"
                          />
                        </div>
                        <div
                          className="kt-widget__content"
                          style={{ marginTop: "auto", marginBottom: "auto" }}
                        >
                          <div className="kt-widget__section">
                            {!claim ? (
                              <Loader />
                            ) : (
                              <a href="#" className="kt-widget__username">
                                {/* {`${claim?.claimer?.lastname} ${claim?.claimer?.firstname}`} */}
                                {(claim?.claimer && claim.claimer?.type_client == "Physique") ? (claim.claimer.lastname + " " + claim.claimer.firstname) : claim.claimer.raison_sociale}
                                
                                <i className="flaticon2-correct kt-font-success" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="kt-widget__body">
                        {!claim ? (
                          ""
                        ) : (
                          <div className="kt-widget__content">
                            {(claim?.claimer && claim.claimer?.type_client == "Physique") && <div className="kt-widget__info">
                              <span
                                className="fa fa-venus-mars"
                                style={{ fontSize: "1.5rem" }}
                              />
                              <span className="kt-widget__data">
                                {claim?.claimer?.sexe === "F"
                                  ? t("Féminin")
                                  : claim?.claimer?.sexe === "M"
                                  ? t("Masculin")
                                  : "-"}
                              </span>
                            </div>}
                            <div className="kt-widget__info">
                              <span
                                className="fa fa-envelope"
                                style={{ fontSize: "1.5rem" }}
                              />
                              <span className="kt-widget__data">
                                {claim?.claimer?.email
                                  ? claim?.claimer?.email?.map?.(
                                      (mail, index) =>
                                        index === claim.claimer.email.length - 1
                                          ? mail
                                          : mail + "/ "
                                    )
                                  : "-"}
                              </span>
                            </div>
                            <div className="kt-widget__info">
                              <span
                                className="fa fa-phone-alt"
                                style={{ fontSize: "1.5rem" }}
                              />
                              <span className="kt-widget__data">
                                {claim?.claimer?.telephone
                                  ? claim?.claimer?.telephone?.map?.(
                                      (telephone, index) =>
                                        index ===
                                        claim.claimer.telephone.length - 1
                                          ? telephone
                                          : telephone + "/ "
                                    )
                                  : ""}
                              </span>
                            </div>
                            <div className="kt-widget__info">
                              <span
                                className="fa fa-location-arrow"
                                style={{ fontSize: "1.5rem" }}
                              />
                              <span className="kt-widget__data">
                                {claim?.claimer?.ville
                                  ? claim?.claimer?.ville
                                  : "-"}
                              </span>
                            </div>
                            {/* Start Type client */}
                            <div className="kt-widget__info">
                                                    <span>{t("Type de client")}:</span>
                                                    <span className="kt-widget__data">
                                                    {/* {claim ?  claim.accountType : '-'} */}
                                                    {claim && (claim.claimer?.type_client =="Physique" ? 'Personne Physique' : 'Personne Morale')}
                                                    </span>
                                                </div>
                                                {/* End Type Client */}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="kt-wizard-v2__content"
              data-ktwizard-type="step-content"
              data-ktwizard-state={second === "current" ? "current" : "pending"}
            >
              <div className="kt-heading kt-heading--md">
                {t("Détails de la réclamation")}
              </div>
              <div className="kt-form__section kt-form__section--first">
                <div className="kt-wizard-v2__review">
                  <div className="kt-wizard-v2__review-item">
                    {!claim ? null : (
                      <div className="kt-wizard-v2__review-content">
                        <h5>
                          <span style={{ color: "#48465b" }}>
                            {t("Référence")}:
                          </span>
                        </h5>
                        <span className="mx-2">
                          {claim?.reference ? claim?.reference : "-"}
                        </span>
                        <br />
                        <br />
                      </div>
                    )}

                    <div className="kt-wizard-v2__review-title">
                      <h5>
                        <span style={{ color: "#48465b" }}>{t("Canaux")}</span>
                      </h5>
                    </div>
                    {!claim ? null : (
                      <div className="kt-wizard-v2__review-content">
                        <strong>Canal de réception:</strong>{" "}
                        <span className="mx-2">
                          {claim?.request_channel
                            ? claim?.request_channel?.name["fr"]
                            : "-"}
                        </span>
                        <br />
                        <strong>Canal de réponse préférentiel:</strong>{" "}
                        <span className="mx-2">
                          {claim.response_channel
                            ? claim.response_channel?.name["fr"]
                            : "-"}
                        </span>
                        <br />
                      </div>
                    )}
                  </div>
                  <div className="kt-wizard-v2__review-item">
                    <div className="kt-wizard-v2__review-title">
                      <h5>
                        <span style={{ color: "#48465b" }}>{t("Cible")}</span>
                      </h5>
                    </div>
                    {!claim ? null : (
                      <div className="kt-wizard-v2__review-content">
                        <strong>{t("Institution")}</strong>:{" "}
                        <span className="mx-2">
                          {claim.institution_targeted?.name}
                        </span>
                        <br />
                        <strong>{t("Unité")}</strong>:{" "}
                        <span className="mx-2">
                          {claim?.unit_targeted
                            ? claim.unit_targeted?.name["fr"]
                            : "-"}
                        </span>
                        <br />
                      </div>
                    )}
                  </div>

                  {
                    <div className="kt-wizard-v2__review-item">
                      <div className="kt-wizard-v2__review-title">
                        <h5>
                          <span style={{ color: "#48465b" }}>
                            {t("Collecteur")}
                          </span>
                        </h5>
                      </div>
                      {!claim ? null : (
                        <div className="kt-wizard-v2__review-content">
                          <strong>{t("Nom")}</strong>:{" "}
                          <span className="mx-2">
                            {claim?.created_by?.identite?.lastname ?? "-"}
                          </span>
                          <br />
                          <strong>{t("Prénoms")} </strong>:{" "}
                          <span className="mx-2">
                            {claim?.created_by?.identite?.firstname ?? "-"}
                          </span>
                        </div>
                      )}
                    </div>
                  }
                  {claim?.active_treatment?.staff_transferred_to_unit_by && (
                    <div className="kt-wizard-v2__review-item">
                      <div className="kt-wizard-v2__review-title">
                        <h5>
                          <span style={{ color: "#48465b" }}>
                            {t("Pilote en charge")}
                          </span>
                        </h5>
                      </div>
                      {!claim?.active_treatment
                        ?.staff_transferred_to_unit_by ? null : (
                        <div className="kt-wizard-v2__review-content">
                          <strong>{t("Nom")}</strong>:{" "}
                          <span className="mx-2">
                            {claim?.active_treatment
                              ?.staff_transferred_to_unit_by?.identite
                              ?.lastname ?? "-"}
                          </span>
                          <br />
                          <strong>{t("Prénoms")} </strong>:{" "}
                          <span className="mx-2">
                            {claim?.active_treatment
                              ?.staff_transferred_to_unit_by?.identite
                              ?.firstname ?? "-"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {!["incomplete", "full"].includes(claim?.status) && (
                    <div className="kt-wizard-v2__review-item">
                      <div className="kt-wizard-v2__review-title">
                        <h5>
                          <span style={{ color: "#48465b" }}>
                            {t("Unité traitante")}
                          </span>
                        </h5>
                      </div>
                      {!claim ? null : (
                        <div className="kt-wizard-v2__review-content">
                          <strong>{t("Unité")}</strong>:{" "}
                          <span className="mx-2">
                            {claim?.active_treatment?.responsible_unit?.name
                              ?.fr ?? "-"}
                          </span>
                          <br />
                        </div>
                      )}
                    </div>
                  )}
                  {!["incomplete", "full", "transferred_to_unit"].includes(
                    claim?.status
                  ) && (
                    <div className="kt-wizard-v2__review-item">
                      <div className="kt-wizard-v2__review-title">
                        <h5>
                          <span style={{ color: "#48465b" }}>
                            {t("Traiteur")}
                          </span>
                        </h5>
                      </div>
                      {!claim ? null : (
                        <div className="kt-wizard-v2__review-content">
                          <strong>{t("Nom")}</strong>:{" "}
                          <span className="mx-2">
                            {claim?.active_treatment?.responsible_staff
                              ?.identite?.lastname ?? "-"}
                          </span>
                          <br />
                          <strong>{t("Prénoms")} </strong>:{" "}
                          <span className="mx-2">
                            {claim?.active_treatment?.responsible_staff
                              ?.identite?.firstname ?? "-"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="kt-wizard-v2__review-item">
                    <div className="kt-wizard-v2__review-title">
                      <h5>
                        <span style={{ color: "#48465b" }}>
                          {t("Spécifications")}
                        </span>
                      </h5>
                    </div>
                    {!claim ? null : (
                      <div className="kt-wizard-v2__review-content">
                        <strong>{t("Objet")}</strong>:{" "}
                        <span className="mx-2">
                          {claim.claim_object.name["fr"]}
                        </span>
                        <br />
                        <br />
                        <strong>{t("Numéro de compte")} </strong>:{" "}
                        <span className="mx-2">
                          {claim.account_targeted
                            ? claim.account_targeted.number
                            : claim.account_number
                            ? " / " + claim.account_number
                            : "-"}
                        </span>
                        <br />
                        <br />
                        <strong>{t("Montant réclamé")}</strong>:{" "}
                        <span className="mx-2">
                          {claim.amount_disputed
                            ? `${claim.amount_disputed} ${claim.amount_currency.name["fr"]}`
                            : "-"}
                        </span>
                        <br />
                        <br />
                        <strong>{t("Date de réception")}</strong>:{" "}
                        <span className="mx-2">
                          {claim.created_at
                            ? formatDateToTimeStampte(claim.created_at)
                            : "-"}
                        </span>
                        <br />
                        <br />
                        <strong>{t("Date de l'évenement")}</strong>:{" "}
                        <span className="mx-2">
                          {claim.event_occured_at
                            ? formatDateToTimeStampte(claim.event_occured_at)
                            : "-"}
                        </span>
                        <br />
                        <br />
                        <strong>{t("Description")}:</strong>
                        <span className="mx-2" ref={elements}></span>
                        {/*<span className="mx-2">{claim.description ? claim.description : "-"}</span><br/>*/}
                        <br />
                        <br />
                        <strong>{t("Attente")}:</strong>{" "}
                        <span className="mx-2">
                          {claim.claimer_expectation
                            ? claim.claimer_expectation
                            : "-"}
                        </span>
                        <br />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="kt-wizard-v2__content"
              data-ktwizard-type="step-content"
              data-ktwizard-state={third === "current" ? "current" : "pending"}
            >
              <div className="kt-heading kt-heading--md">
                {t("Liste de pièces jointes")}
              </div>
              <div className="kt-form__section kt-form__section--first">
                <div className="kt-wizard-v2__review">
                  {!claim ? (
                    ""
                  ) : claim.files.length ? (
                    claim.files.map((file, index) => (
                      <div className="kt-wizard-v2__review-item" key={index}>
                        {/*<div className="kt-wizard-v2__review-title">*/}
                        {/*    Pièce jointe Nº{index + 1}*/}
                        {/*</div>*/}
                        <div className="kt-wizard-v2__review-content">
                          <a
                            href={`${appConfig.apiDomaine}${file.url}`}
                            download={true}
                            target={"_blank"}
                          >
                            {file.title}
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="kt-wizard-v2__review-item">
                      <div className="kt-wizard-v2__review-title">
                        Pas de pièces jointes
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              className="kt-wizard-v2__content"
              data-ktwizard-type="step-content"
              data-ktwizard-state={last === "current" ? "current" : "pending"}
            >
              <ChangePiloteForm id={claim?.id} />
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

function ChangePiloteForm({ id }) {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();
  const defaultError = {
    pilot_id: [],
    message: [],
  };
  const [Pilots, setPilots] = useState({
    pilot: [],
    observation: [],
  });
  const [Pilot, setPilot] = useState(null);
  const [Observation, setObservation] = useState("");
  const [Errors, setErrors] = useState(defaultError);
  const [startRequest, setStartRequest] = useState(false);
  useEffect(() => {
    axios
      .get(`${appConfig.apiDomaine}/configuration-active-pilot`)
      .then((res) => {
        setPilots(
          res.data?.all_active_pilots.map((item) => ({
            label: `${item?.staff?.identite?.firstname} ${item?.staff?.identite?.lastname}`,
            value: item.staff.id,
          }))
        );
      })
      .catch((e) => console.log("error"));
  }, []);

  const assignClaim = (e) => {
    e.preventDefault();
    if (verifyTokenExpire()) {
      setStartRequest(true);
      axios
        .post(`${appConfig.apiDomaine}/reassignment-to-pilot`, {
          pilot_id: Pilot?.value,
          claim_id: id,
          message: Observation,
        })
        .then((response) => {
          ToastBottomEnd.fire(toastAssignClaimSuccessMessageConfig());
          setStartRequest(false);
          setPilot(null);
          setErrors([]);
          window.location.href = "?????";
        })
        .catch((error) => {
          setStartRequest(false);
          setErrors({ ...defaultError, ...error.response.data.error });
          ToastBottomEnd.fire(
            toastAddErrorMessageConfig("Echec d'affectation")
          );
        });
    }
  };

  function onChangeObservation(e) {
    setObservation(e.target.value);
  }
  function onChangePilot(e) {
    setPilot(e);
  }
  return (
    <>
      <div className="kt-heading kt-heading--md">
        {t("Réaffectation de la réclamation")}
      </div>
      <div className="kt-form__section kt-form__section--first">
        <div className="kt-wizard-v2__review">
          <div className="kt-wizard-v2__review-content">
            <div
              className={
                Errors?.pilot_id?.length ? "form-group validated" : "form-group"
              }
            >
              <label>{t("Pilote(s) actif(s)")}</label>
              <Select
                isClearable
                placeholder={t("Veillez sélectionner le pilte actif")}
                value={Pilot}
                onChange={onChangePilot}
                options={Pilots}
              />
              {Errors?.pilot_id?.map((error, index) => (
                <div key={index} className="invalid-feedback">
                  {error}
                </div>
              ))}
            </div>
            <div
              className={
                Errors?.message?.length
                  ? "form-group row validated"
                  : "form-group row"
              }
            >
              <label className="col-12 col-form-label" htmlFor="Observation">
                {t("Observation")}
              </label>
              <div className="col-12">
                <textarea
                  id="observation"
                  className={
                    Errors?.message?.length
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  placeholder={t("Veuillez entrer l'observation")}
                  cols="30"
                  rows="5"
                  value={Observation}
                  onChange={(e) => onChangeObservation(e)}
                />
                {Errors?.message?.length
                  ? Errors.message.map((error, index) => (
                      <div key={index} className="invalid-feedback">
                        {error}
                      </div>
                    ))
                  : ""}{" "}
              </div>
            </div>
            <div className="form-group d-flex justify-content-between">
              {!startRequest ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => assignClaim(e)}
                >
                  {t("Réaffecter la réclamation")}
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
  );
}
export default ClaimDetails;
