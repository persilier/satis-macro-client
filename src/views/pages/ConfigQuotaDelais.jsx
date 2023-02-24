import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Link
} from "react-router-dom";
import { loadCss, forceRound, getLowerCaseString } from "../../helpers/function";
import LoadingTable from "../components/LoadingTable";
import { ToastBottomEnd } from "../components/Toast";
import { toastDeleteErrorMessageConfig, toastDeleteSuccessMessageConfig } from "../../config/toastConfig";
import { DeleteConfirmation } from "../components/ConfirmationAlert";
import { confirmDeleteConfig } from "../../config/confirmConfig";
import appConfig from "../../config/appConfig";
import Pagination from "../components/Pagination";
import EmptyTable from "../components/EmptyTable";
import HeaderTablePage from "../components/HeaderTablePage";
import InfirmationTable from "../components/InfirmationTable";
import { ERROR_401 } from "../../config/errorPage";
import { verifyPermission } from "../../helpers/permission";
import { connect } from "react-redux";
import { NUMBER_ELEMENT_PER_PAGE } from "../../constants/dataTable";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import { useTranslation } from "react-i18next";
import ls from 'localstorage-slim'
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
    toastEditErrorMessageConfig,
    toastEditSuccessMessageConfig
} from "../../config/toastConfig";



loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const endPointConfig = {
    PRO: {
        plan: "PRO",
        get: `${appConfig.apiDomaine}/quota-delay/treatment`,
        update: `${appConfig.apiDomaine}/quota-delay/treatment`
    },
    MACRO: {
        holding: {
            get: `${appConfig.apiDomaine}/quota-delay/treatment`,
        update: `${appConfig.apiDomaine}/quota-delay/treatment`
        },
        filial: {
            get: `${appConfig.apiDomaine}/quota-delay/treatment`,
            update: `${appConfig.apiDomaine}/quota-delay/treatment`        }
    },
};

const ConfigQuotaDelais = (props) => {

    //usage of useTranslation i18n
    const { t, ready } = useTranslation();

    const [isQuotaUsed, setIsQuotaUsed] = useState(true)
    const [load, setLoad] = useState(true);

    
    const [quotas, setQuotas] = useState({
        unite: null,
        staff: null,
        traitement: null,
        validation: null,
        satisfaction: null
    })

    const [quotasErrors, setQuotasErrors] = useState({
        unite: "",
        staff: "",
        traitement: "",
        validation: "",
        satisfaction: ""
    })

    document.title = "Satis configuration - " + (ready ? t("Quota de délais") : "");
    // if (
        // !verifyPermission(props.userPermissions, "update-configuration-quota-delay") ||
        // !verifyPermission(props.userPermissions, "show-configuration-quota-delay,"))
        // window.location.href = ERROR_401;

    let endPoint = "";
    if (props.plan === "MACRO") {
        if (verifyPermission(props.userPermissions, 'list-config-reporting-claim-any-institution'))
            endPoint = endPointConfig[props.plan].holding;
        else if (verifyPermission(props.userPermissions, 'list-config-reporting-claim-my-institution'))
            endPoint = endPointConfig[props.plan]
    } else {
        endPoint = endPointConfig[props.plan]
    }

    let temp = ls.get('userData');
    console.log("data User ==> ", JSON.parse(temp))

    useEffect(() => {
        if (verifyTokenExpire()) {
            axios.get(endPoint.get)
                .then(response => {
                    setLoad(false);
                    console.log("response ", response?.data)
                    
                     setQuotas({...quotas, 
                         unite: response?.data?.assignment_unit,
                         staff: response?.data?.assignment_staff,
                         traitement: response?.data?.assignment_treatment,
                         validation: response?.data?.assignment_validation,
                         satisfaction: response?.data?.assignment_measure_satisfaction})
                    
                })
                .catch(error => {
                    setLoad(false);
                    //console.log("Something is wrong");
                })
                ;
        }
    }, []);

    
    const handleCheckboxChange = () => {
        setIsQuotaUsed(!isQuotaUsed)
    }

    const handleInputChange = (e, key) => {
        const value = e.target.value
        if (key === "unite") {
            setQuotas({ ...quotas, unite: value })
        }
        if (key === "staff") {
            setQuotas({ ...quotas, staff: value })
        }
        if (key === "traitement") {
            setQuotas({ ...quotas, traitement: value })
        }
        if (key === "validation") {
            setQuotas({ ...quotas, validation: value })
        }
        if (key === "satisfaction") {
            setQuotas({ ...quotas, satisfaction: value })
        }
    }

    const handleSaveQuotas = (e) => {
        e.preventDefault();
        const data = {
                "assignment_unit" : quotas.unite,
                "assignment_staff" : quotas.staff,
                "assignment_treatment" : quotas.traitement,
                "assignment_validation" : quotas.validation,
                "assignment_measure_satisfaction" : quotas.satisfaction
        }
        
        if (verifyTokenExpire()) {
            setLoad(true);
            axios.put(endPoint.update, data)
                .then(response => {
                    setLoad(false);
                    console.log("response ", response)
                    ToastBottomEnd.fire(toastEditSuccessMessageConfig());
                    
            
                    
                })
                .catch(error => {
                    setLoad(false);
                    console.log("Something is wrong", error);
                })
                ;
        }
    }

   

    return (
        ready ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                {t("Paramètres")}
                            </h3>
                            <span className="kt-subheader__separator kt-hidden" />
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter" /></a>
                                <span className="kt-subheader__breadcrumbs-separator" />
                                <a href="#button" onClick={e => e.preventDefault()}
                                    className="kt-subheader__breadcrumbs-link">
                                    {t("Quota des délais")}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <InfirmationTable
                        information={t("Configuration du quota des délais")} />

                    <div className="kt-portlet">

                        <HeaderTablePage
                            // addPermission={"store-config-reporting-claim-my-institution"}
                            title={t("Quota des délais")}
                        // addText={t("Ajouter une configuration")}
                        // addLink={"/settings/rapport/add"}
                        />


                        <div className="kt-portlet__body">
                            <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                <div className="row">

                                    <label className="kt-checkbox">
                                        <input
                                            id="is_quota"
                                            type="checkbox"
                                            checked={isQuotaUsed}
                                            onChange={handleCheckboxChange}
                                        />
                                        {t("Voulez-vous faire la répartition des délais suivant les étapes du processus")} ?<span />
                                    </label>
                                </div>
                                {isQuotaUsed && <>
                                    <div className="form-group row">
                                        <div
                                            className={
                                                quotasErrors.unite.length ? "col validated" : "col"
                                            }
                                        >
                                            <label htmlFor="unite">
                                                {t("Quota pour affectation vers une unité")}
                                                {/* <span style={{ color: "red" }}>*</span> */}
                                            </label>
                                            <input
                                                id="unite"
                                                type="number"
                                                min={0}
                                                max={100}
                                                className={
                                                    quotasErrors.unite.length
                                                        ? "form-control is-invalid"
                                                        : "form-control"
                                                }
                                                // placeholder={t("Veuillez entrer le nom de famille")}
                                                value={quotas.unite}
                                                onChange={(e) => handleInputChange(e, "unite")}

                                            />
                                            {quotasErrors.unite.length
                                                ? quotasErrors.unite.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                                : null}
                                        </div>

                                        <div
                                            className={
                                                quotasErrors.staff.length ? "col validated" : "col"
                                            }
                                        >
                                            <label htmlFor="staff">
                                                {t("Quota pour affectation vers un staff")}{" "}
                                                {/* <span style={{ color: "red" }}>*</span> */}
                                            </label>
                                            <input
                                                id="staff"
                                                type="text"
                                                className={
                                                    quotasErrors.staff.length
                                                        ? "form-control is-invalid"
                                                        : "form-control"
                                                }
                                                // placeholder={t("Veuillez entrer le prénom")}
                                                value={quotas.staff}
                                                onChange={(e) => handleInputChange(e, "staff")}

                                            />
                                            {quotasErrors.staff.length
                                                ? quotasErrors.staff.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                                : null}
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div
                                            className={
                                                quotasErrors.unite.length ? "col validated" : "col"
                                            }
                                        >
                                            <label htmlFor="unite">
                                                {t("Quota pour affectation traitement")}
                                                {/* <span style={{ color: "red" }}>*</span> */}
                                            </label>
                                            <input
                                                id="traitement"
                                                type="text"
                                                className={
                                                    quotasErrors.unite.length
                                                        ? "form-control is-invalid"
                                                        : "form-control"
                                                }
                                                // placeholder={t("Veuillez entrer le nom de famille")}
                                                value={quotas.traitement}
                                                onChange={(e) => handleInputChange(e, "traitement")}

                                            />
                                            {quotasErrors.traitement.length
                                                ? quotasErrors.traitement.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                                : null}
                                        </div>

                                        <div
                                            className={
                                                quotasErrors.staff.length ? "col validated" : "col"
                                            }
                                        >
                                            <label htmlFor="validation">
                                                {t("Quota pour affectation validation")}{" "}
                                                {/* <span style={{ color: "red" }}>*</span> */}
                                            </label>
                                            <input
                                                id="validation"
                                                type="text"
                                                className={
                                                    quotasErrors.validation.length
                                                        ? "form-control is-invalid"
                                                        : "form-control"
                                                }
                                                // placeholder={t("Veuillez entrer le prénom")}
                                                value={quotas.validation}
                                                onChange={(e) => handleInputChange(e, "validation")}

                                            />
                                            {quotasErrors.validation.length
                                                ? quotasErrors.validation.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                                : null}
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div
                                            className={
                                                quotasErrors.satisfaction.length ? "col-md-6 col-xs-12 validated" : "col-md-6 col-xs-12"
                                            }
                                        >
                                            <label htmlFor="satisfaction">
                                                {t("Quota pour affectation mesure de satisfaction")}
                                                {/* <span style={{ color: "red" }}>*</span> */}
                                            </label>
                                            <input
                                                id="satisfaction"
                                                type="text"
                                                className={
                                                    quotasErrors.satisfaction.length
                                                        ? "form-control is-invalid"
                                                        : "form-control"
                                                }
                                                // placeholder={t("Veuillez entrer le nom de famille")}
                                                value={quotas.satisfaction}
                                                onChange={(e) => handleInputChange(e, "satisfaction")}

                                            />
                                            {quotasErrors.satisfaction.length
                                                ? quotasErrors.satisfaction.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                                : null}
                                        </div>


                                    </div>

                                    <div className="kt-portlet__foot">
                                        <div className="kt-form__actions text-right">

                                            <button
                                            type="submit"
                                                onClick={(e) => handleSaveQuotas(e)}
                                                className="btn btn-primary"
                                            >
                                                {t("Enregistrer")}
                                            </button>




                                        </div>
                                    </div>
                                </>}

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        ) : null
    );
};
const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan,
    };
};

export default connect(mapStateToProps)(ConfigQuotaDelais);
