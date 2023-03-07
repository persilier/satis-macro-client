import React from "react";
import { formatDateToTimeStampte } from "../../helpers/function";
import TreatmentHistory from "./TreatmentHistory";
import { useTranslation } from "react-i18next";

const TreatmentButtonDetail = ({ claim }) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  return ready ? (
    <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
      <div className="kt-heading kt-heading--md">
        {t("Information sur le Traitement Effectué")}
      </div>
      <div className="kt-form__section kt-form__section--first">
        {claim && !claim.active_treatment ? (
          <div className="kt-wizard-v2__review-item">
            <div className="kt-wizard-v2__review-title">
              <h5 style={{ color: "#48465b" }}>{t("Aucune information")}</h5>
            </div>
          </div>
        ) : null}

        <div className="kt-wizard-v2__review">
          {claim?.active_treatment?.responsible_staff ? (
            <div className="kt-wizard-v2__review-item">
              <div className="kt-wizard-v2__review-title">
                <span style={{ color: "#48465b" }}>
                  {t("Chargé du traitement")}
                </span>
              </div>
              {
                <div className="kt-wizard-v2__review-content">
                  <strong>{t("Nom")}:</strong>
                  <span className="mx-2">
                    {`${claim?.active_treatment?.responsible_staff?.identite
                      ?.firstname +
                      " " +
                      claim?.active_treatment?.responsible_staff?.identite
                        ?.lastname}`}
                  </span>
                  <br />
                  {<strong>Unité:</strong>}
                  {
                    <span className="mx-2">
                      {
                        claim?.active_treatment?.responsible_staff?.unit?.name
                          ?.fr
                      }
                    </span>
                  }
                </div>
              }
            </div>
          ) : null}

          {claim &&
          claim.active_treatment &&
          (claim.active_treatment.declared_unfounded_at ||
            claim.active_treatment.solved_at) ? (
            <div className="kt-wizard-v2__review-item">
              <TreatmentHistory
                treatments={claim.active_treatment.treatments}
              />
            </div>
          ) : null}

          {claim &&
          claim.active_treatment &&
          claim.active_treatment.validated_at ? (
            <div className="kt-wizard-v2__review-item">
              <div className="kt-wizard-v2__review-title">
                <span style={{ color: "#48465b" }}>
                  {t("Validation du traitement")}
                </span>
              </div>
              {!claim ? null : (
                <div className="kt-wizard-v2__review-content">
                  <strong>{t("Nom")}:</strong>
                  <span className="mx-2">
                    {claim.active_treatment.validated_by
                      ? claim.active_treatment.validated_by.identite?.lastname +
                        "  " +
                        claim.active_treatment.validated_by.identite?.firstname
                      : "-"}
                  </span>
                  <br />
                  <strong>{t("Décision")}:</strong>
                  <span className="mx-2">
                    {claim.active_treatment.invalidated_reason
                      ? t("Invalide")
                      : t("Valide")}
                  </span>
                  <br />

                  {claim.active_treatment.invalidated_reason ? (
                    <>
                      <strong>{t("Raison de l'invalidation")}:</strong>
                      <span className="mx-2">
                        {claim.active_treatment.invalidated_reason}
                      </span>
                      <br />

                      <strong>{t("Date de l'invalidation")}:</strong>
                      <span className="mx-2">
                        {claim.active_treatment.validet_at
                          ? formatDateToTimeStampte(
                              claim.active_treatment.validated_at
                            )
                          : "-"}
                      </span>
                      <br />
                    </>
                  ) : (
                    <>
                      <strong>{t("Solution Communiquée au client")}:</strong>
                      <span className="mx-2">
                        {claim.active_treatment.solution_communicated
                          ? claim.active_treatment.solution_communicated
                          : "-"}
                      </span>
                      <br />
                      <strong>{t("Date de la validation")}:</strong>
                      <span className="mx-2">
                        {claim.active_treatment.validated_at
                          ? formatDateToTimeStampte(
                              claim.active_treatment.validated_at
                            )
                          : "-"}
                      </span>
                      <br />
                    </>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;
};

export default TreatmentButtonDetail;
