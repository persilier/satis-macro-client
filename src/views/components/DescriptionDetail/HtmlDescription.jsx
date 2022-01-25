import React from "react";
import {useTranslation} from "react-i18next";

const HtmlDescription = ({onClick}) => {

    //usage of useTranslation i18n
    const {t, ready} = useTranslation()

    return (
        ready ? (
            <>
                <button className="btn btn-secondary" onClick={onClick}>{t("Afficher")}</button>
            </>
        ) : null
    );
};

export default HtmlDescription;