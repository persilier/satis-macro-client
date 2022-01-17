import React from "react";

import { useTranslation } from "react-i18next";

const EmptyNotification = () => {

    const {t, ready} = useTranslation();

    return (
        <div className="kt-grid kt-grid--ver" style={{ minHeight: "200px" }}>
            <div className="kt-grid kt-grid--hor kt-grid__item kt-grid__item--fluid kt-grid__item--middle">
                <div className="kt-grid__item kt-grid__item--middle kt-align-center">
                    {t("Vide")}!
                    <br/>{t("Pas de nouvelles notifications")}.
                </div>
            </div>
        </div>
    );
};

export default EmptyNotification;
