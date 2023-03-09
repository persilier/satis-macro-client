import React from "react";
import { useTranslation } from "react-i18next";

const SoftLoader = ({ loader }) => {
  const { t } = useTranslation();

  return !loader ? (
    <div />
  ) : (
    <div className="soft-loader-container">
      <span
        className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
        disabled
      >
        {t("Chargement...")}
      </span>
    </div>
  );
};

export default SoftLoader;
