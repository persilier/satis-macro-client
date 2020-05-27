import React from "react";
import ProUnitForm from "../../APP_PRO/ProUnitForm";
import HubUnitForm from "../../APP_HUB/HubUnitForm";
import HoldingUnitForm from "../../APP_MACRO/Holding/HoldingUnitForm";
import {ERROR_401} from "../../config/errorPage";

const UnitForm = () => {
    const permission = "macroPermission";
    if (permission !== "macroPermission" && permission !== "hubPermission" && permission !== "proPermission")
        window.location.href = ERROR_401;
    const nature = "MACRO";
    return (
        nature === "MACRO" ? (
            permission === "macroPermission" ? (
                <HoldingUnitForm/>
            ) : ""
        ) : nature === "PRO" ? (
            permission === "proPermission" ? (
                <ProUnitForm/>
            ) : ""
        ) : (
            permission === "hubPermission" ? (
                <HubUnitForm/>
            ) : ""
        )
    );
};

export default UnitForm;
