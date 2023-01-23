import React from "react";
import { useTranslation } from "react-i18next";

const ValidationButton = () => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  return ready ? (
    <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
      <div className="kt-wizard-v2__nav-body">
        <div className="kt-wizard-v2__nav-icon">
          <i className="flaticon-list" />
        </div>
        <div className="kt-wizard-v2__nav-label">
          <div className="kt-wizard-v2__nav-label-title">
            {t("Validation du traitement")}
          </div>
          <div className="kt-wizard-v2__nav-label-desc">
            {t("Valider le traitement de l'agent")}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default ValidationButton;
