import React from "react";
import { formatDateToTimeStampte } from "../../helpers/function";
import { useTranslation } from "react-i18next";

const TreatmentSatisfaction = ({ claim }) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  return ready ? (
    <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
      <div className="kt-heading kt-heading--md">
        {t("Information sur la Satisfaction du client")}
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
          {claim &&
          claim.active_treatment &&
          claim.active_treatment.satisfaction_measured_at ? (
            <>
              <div className="kt-wizard-v2__review-item">
                <div className="kt-wizard-v2__review-title">
                  <span style={{ color: "#48465b" }}>
                    {t("Résultats de la mesure de satisfaction")}
                  </span>
                </div>
                <div className="kt-wizard-v2__review-content">
                  <strong>
                    {t("Le client est-t-il satisfait par le traitement ?")}:
                  </strong>
                  <span className="mx-2">
                    {claim.active_treatment.is_claimer_satisfied == 1 ? (
                      <span className="kt-badge kt-badge--inline kt-badge--success">
                        {t("OUI")}
                      </span>
                    ) : (
                      <span className="kt-badge kt-badge--inline kt-badge--danger">
                        {t("NON")}
                      </span>
                    )}
                  </span>
                  <br />

                  <strong>{t("Raison / Commentaires")}:</strong>
                  <span className="mx-2">
                    {claim.active_treatment.unsatisfied_reason
                      ? claim.active_treatment.unsatisfied_reason
                      : "-"}
                  </span>
                  <br />
                </div>
              </div>

              <div className="kt-wizard-v2__review-item">
                <div className="kt-wizard-v2__review-title">
                  <span style={{ color: "#48465b" }}>
                    {t("Satisfaction mesuré par")}
                  </span>
                </div>
                <div className="kt-wizard-v2__review-content">
                  <strong>{t("Nom")}:</strong>
                  <span className="mx-2">
                    {claim.active_treatment?.satisfaction_measured_by
                      ? claim.active_treatment.satisfaction_measured_by.identite
                          ?.lastname +
                        "  " +
                        claim.active_treatment.satisfaction_measured_by.identite
                          ?.firstname
                      : "-"}
                  </span>
                  <br />

                  <strong>{t("Point de service")}:</strong>
                  <span className="mx-2">
                    {claim.active_treatment?.satisfaction_measured_by
                      ? claim.active_treatment.satisfaction_measured_by.unit
                          ?.name["fr"]
                      : "-"}
                  </span>
                  <br />

                  <strong>{t("Institution")}:</strong>
                  <span className="mx-2">
                    {claim.active_treatment?.satisfaction_measured_by
                      ? claim.active_treatment.satisfaction_measured_by
                          .institution?.name
                      : "-"}
                  </span>
                  <br />

                  <strong>{t("Date de la mesure de satisfaction")}:</strong>
                  <span className="mx-2">
                    {formatDateToTimeStampte(
                      claim.active_treatment.satisfaction_measured_at
                    )}
                  </span>
                  <br />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;
};

export default TreatmentSatisfaction;
