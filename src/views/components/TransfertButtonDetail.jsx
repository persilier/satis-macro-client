import React from "react";
import { formatDateToTimeStampte } from "../../helpers/function";
import { useTranslation } from "react-i18next";

const TransfertButtonDetail = ({ claim }) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  return ready ? (
    <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
      <div className="kt-heading kt-heading--md">
        {t("Information sur les transferts éffectués")}
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
          claim.active_treatment.transferred_to_targeted_institution_at ? (
            <div className="kt-wizard-v2__review-item">
              <div className="kt-wizard-v2__review-title">
                <span style={{ color: "#48465b" }}>
                  {t("Transfert vers l'institution ciblée")}
                </span>
              </div>
              <div className="kt-wizard-v2__review-content">
                <strong>{t("Date de transfert")}:</strong>
                <span className="mx-2">
                  {formatDateToTimeStampte(
                    claim.active_treatment
                      .transferred_to_targeted_institution_at
                  )}
                </span>
                <br />
              </div>
            </div>
          ) : null}

          {claim &&
          claim?.active_treatment &&
          claim.active_treatment?.transferred_to_unit_by ? (
            <div className="kt-wizard-v2__review-item">
              <div className="kt-wizard-v2__review-title">
                <span style={{ color: "#48465b" }}>{t("Transféré par")}</span>
              </div>
              <div className="kt-wizard-v2__review-content">
                <strong>{t("Nom")}:</strong>
                <span className="mx-2">
                  {claim.active_treatment.transferred_to_unit_by
                    ? claim.active_treatment.transferred_to_unit_by.identite
                        ?.lastname +
                      "  " +
                      claim.active_treatment.transferred_to_unit_by.identite
                        ?.firstname
                    : "-"}
                </span>
                <br />
              </div>
            </div>
          ) : null}

          {claim &&
          claim.active_treatment &&
          claim.active_treatment.transferred_to_unit_at ? (
            <div className="kt-wizard-v2__review-item">
              <div className="kt-wizard-v2__review-title">
                <span style={{ color: "#48465b" }}>
                  {t("Unité / Comité de traitement")}
                </span>
              </div>
              <div className="kt-wizard-v2__review-content">
                {claim?.active_treatment?.responsible_unit?.name?.fr && (
                  <>
                    <strong>{t("Unité")}:</strong>
                    <span className="mx-2">
                      {claim.active_treatment.responsible_unit
                        ? claim.active_treatment.responsible_unit.name.fr
                        : "-"}
                    </span>
                    <br />
                  </>
                )}
                {claim?.treatment_board?.name && (
                  <>
                    <strong>{t("Comité")}:</strong>
                    <span className="mx-2">
                      {claim?.treatment_board?.name ?? "-"}
                    </span>
                    <br />
                  </>
                )}
                {claim?.treatment_board?.type && (
                  <>
                    <strong>{t("Type de comité")}:</strong>
                    <span className="mx-2">
                      {claim?.treatment_board?.type
                        ? claim?.treatment_board?.type === "specific"
                          ? "Spécifique"
                          : "Standard"
                        : "-"}
                    </span>
                    <br />
                  </>
                )}
                {claim?.active_treatment?.transferred_to_unit_at && (
                  <>
                    <strong>{t("Date de transfert")}:</strong>
                    <span className="mx-2">
                      {formatDateToTimeStampte(
                        claim?.active_treatment?.transferred_to_unit_at
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          ) : null}

          {claim &&
          claim.active_treatment &&
          claim.active_treatment?.assigned_to_staff_at ? (
            <div className="kt-wizard-v2__review-item">
              <div className="kt-wizard-v2__review-title">
                <span style={{ color: "#48465b" }}>{t("Affecté par")}</span>
              </div>
              {!claim ? null : (
                <div className="kt-wizard-v2__review-content">
                  <strong>{t("Nom")}:</strong>
                  <span className="mx-2">
                    {claim.active_treatment.assigned_to_staff_by
                      ? claim.active_treatment.assigned_to_staff_by.identite
                          ?.lastname +
                        "  " +
                        claim.active_treatment.assigned_to_staff_by.identite
                          ?.firstname
                      : "-"}
                  </span>
                  <br />
                  <strong>{t("Date de l'affectation")}:</strong>
                  <span className="mx-2">
                    {formatDateToTimeStampte(
                      claim.active_treatment.assigned_to_staff_at
                    )}
                  </span>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;
};

export default TransfertButtonDetail;
