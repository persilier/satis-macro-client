import React from "react";
import FilialeUnitForm from "../../APP_MACRO/Filiale/FilialeUnitForm";
import ProUnitForm from "../../APP_PRO/ProUnitForm";
import HubUnitForm from "../../APP_HUB/HubUnitForm";
import HoldingUnitForm from "../../APP_MACRO/Holding/HoldingUnitForm";

const UnitForm = () => {
    const nature = "MACRO";
    const hubPermission = "hubPermission";
    const proPermission = "proPermission";
    const macroPermission = "macroPermission";
    return (
        nature === "MACRO" ? (
            macroPermission === "macroPermission" ? (
                <HoldingUnitForm/>
            ) : ""
        ) : nature === "PRO" ? (
            proPermission === "proPermission" ? (
                <ProUnitForm/>
            ) : ""
        ) : (
            hubPermission === "hubPermission" ? (
                <HubUnitForm/>
            ) : ""
        )
    );
};

export default UnitForm;
