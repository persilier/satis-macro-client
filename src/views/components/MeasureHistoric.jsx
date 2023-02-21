import React from "react";
import { formatDateToTimeStampte } from "../../helpers/function";
import { useTranslation } from "react-i18next";

const MeasureHistoric = ({ claim }) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  return ready ? (
    <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
      <div className="kt-heading kt-heading--md">
        {t("Historique de la mesure de satisfaction")}
      </div>
      {claim?.satisfaction_history?.map((item, index) => (
        <div className="kt-wizard-v2__review-item mb-3" key={index}>
          {item?.is_claimer_satisfied ? (
            <div className="kt-wizard-v2__review-title">
              <h5>
                <strong>{t("Réclamant satisfait")}</strong>
              </h5>
            </div>
          ) : (
            <div className="kt-wizard-v2__review-title">
              <h5>
                <strong className="text-danger">
                  {t("Réclamant non satisfait")}
                </strong>
              </h5>
            </div>
          )}
          {
            <div className="kt-wizard-v2__review-item">
              <div className="kt-wizard-v2__review-title">
                <h5>
                  <span style={{ color: "#48465b" }}>
                    {t("Mesure de satisfaction faite par")}
                  </span>
                </h5>
              </div>
            </div>
          }
          <div className="kt-wizard-v2__review-content jumbotron px-2 py-2 mb-0">
            {item?.unsatisfied_reason ? (
              <>
                <strong>{t("Raison du non fondé")}</strong>:{" "}
                <span className="mx-2">{item?.unsatisfied_reason}</span>
                <br />
              </>
            ) : null}
          </div>
          {
            <div className="kt-wizard-v2__review-content">
              <strong>{t("Nom")}:</strong>
              <span className="mx-2">
                {`${item?.satisfaction_measured_by?.identite?.firstname ??
                  ""} ${claim?.satisfaction_measured_by?.identite?.lastname ??
                  ""}`}
              </span>
              <br />
              <strong>{t("Unité de l'agent")}:</strong>
              <span className="mx-2">
                {item?.satisfaction_measured_by?.unit?.name["fr"]}
              </span>
              <br />
              <strong>{t("Institution")}:</strong>
              <span className="mx-2">
                {item?.satisfaction_measured_by?.institution?.name}
              </span>
              <br />
              <strong>{t("Date de la m")}:</strong>
              <span className="mx-2">
                {formatDateToTimeStampte(
                  item?.satisfaction_measured_at?.created_at
                )}
              </span>
              <br />
            </div>
          }
        </div>
      ))}
    </div>
  ) : null;
};

export default MeasureHistoric;
