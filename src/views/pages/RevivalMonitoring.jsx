import { useTranslation } from "react-i18next";
import { verifyPermission } from "../../helpers/permission";
import { ERROR_401 } from "../../config/errorPage";
import React, { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
import appConfig from "../../config/appConfig";
import Select from "react-select";
import { displayStatus, forceRound, formatDateToTime, formatSelectOption, getLowerCaseString, loadCss, showValue, truncateString } from "../../helpers/function";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import { NUMBER_ELEMENT_PER_PAGE } from "../../constants/dataTable";
import HtmlDescription from "../components/DescriptionDetail/HtmlDescription";
import InfirmationTable from "../components/InfirmationTable";
import HeaderTablePage from "../components/HeaderTablePage";
import LoadingTable from "../components/LoadingTable";
import EmptyTable from "../components/EmptyTable";
import HtmlDescriptionModal from "../components/DescriptionDetail/HtmlDescriptionModal";
import Pagination from "../components/Pagination";
import { connect } from "react-redux";
import { ToastBottomEnd } from "../components/Toast";
import { toastSuccessMessageWithParameterConfig } from "../../config/toastConfig";
import ls from "localstorage-slim"

const RevivalMonitoring = (props) => {

    //usage of useTranslation i18n
    const { t, ready } = useTranslation();

    if (!(verifyPermission(props.userPermissions, 'show-my-staff-monitoring') || verifyPermission(props.userPermissions, 'show-my-staff-monitoring')))
        window.location.href = ERROR_401;

    const defaultData = {
        institution_id: "",
        staff_id: "allStaff",
        status: ""
    };
    const defaultError = {
        institution_targeted_id: [],
        staff_id: [],
    };

    let temp = JSON.parse(ls.get("userData"));
    let type_macro = temp.data.identite.staff?.institution.institution_type?.name;


    const [load, setLoad] = useState(false);
    const [claims, setClaims] = useState([]);
    const [institutionId, setInstitutionId] = useState("")
    const [institutions, setInstitutions] = useState([]);
    const [isLoad, setIsLoad] = useState(true);
    const [data, setData] = useState(defaultData);
    const [revivals, setRevivals] = useState({
        allStaffClaim: [],
        claimAssignedToStaff: "-",
        claimNoTreatedByStaff: "-",
        claimTreatedByStaff: "-",
        getAverageTimeOfTreatment: "-",
        claimSatisfied: "-"
    });
    const [activeNumberPage, setActiveNumberPage] = useState(1);
    const [numberPage, setNumberPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [numberPerPage, setNumberPerPage] = useState(NUMBER_ELEMENT_PER_PAGE);
    const [showList, setShowList] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [prevUrl, setPrevUrl] = useState(null);
    const [currentMessage, setCurrentMessage] = useState("");
    const [staff, setStaff] = useState({ label: "Tous les staffs", value: "allStaff" });
    const [staffs, setStaffs] = useState([]);
    const [error, setError] = useState(defaultError);
    const [loadFilter, setLoadFilter] = useState(false);

    const [searchList, setSearchList] = useState([]);
    const [focused, setFocused] = useState(false);
    const searchInput = useRef(null);
    const [tag, setTag] = useState({ name: "", label: "", className: "", show: false });

    const [claimCat, setClaimCat] = useState("")
    const [claimCats, setClaimsCat] = useState([{ value: "received", label: "réclamations reçues" }, { value: "treated", label: "réclamations traitées" }, { value: "not_treated", label: "réclamations non traitées" }])
    // const [claimCats, setClaimsCat] = useState([{value: "forwaded-claims", label: "réclamations affectées"}, {value: "validated-claims", label: "réclamations validées"}, {value: "non-treated-claims", label: "réclamations enquêtées"}])


    const onChangeClaimCat = (selected) => {
        setClaimCat(selected)
    }
    console.log("user ", JSON.parse(ls.get("userData"))?.staff?.is_lead)

    useEffect(() => {
        const fetchInstitution = async () => {
            await axios.get(`${appConfig.apiDomaine}/my/institutions-whithout-holding`).then(async (response) =>
                setInstitutions(
                    formatSelectOption(response.data.institution, "name", false)
                )
            )

        }
        fetchInstitution();
    }, [])

    const fetchData = useCallback(
        async (click = false, search = { status: false, value: "" }, type = { status: false, value: "" }) => {
            setLoadFilter(true);
            setLoad(true);
            let endpoint = "";
            let sendData = {};

            endpoint = `${appConfig.apiDomaine}/my/monitoring-by-staff?size=${numberPerPage}&page=${activeNumberPage}${type.status === true ? `&type=${type.value}` : ""}${search.status === true ? `&key=${search.value}` : ""}`;
            sendData = {
                staff_id: data.staff_id ? data.staff_id : "allStaff",
                status: claimCat ? claimCat.value : ""
            };
            if (!data.staff_id)
                delete sendData.staff_id;

            await axios.post(endpoint, sendData)
                .then(response => {
                    const newRevivals = { ...revivals };
                    if (click)
                        ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig(ready ? t("Filtre effectué avec succès") : ""));
                    newRevivals.allStaffClaim = response.data.allStaffClaim.data ? response.data.allStaffClaim.data : [];
                    newRevivals.claimAssignedToStaff = response.data.claimAssignedToStaff;
                    newRevivals.claimNoTreatedByStaff = response.data.claimNoTreatedByStaff;
                    newRevivals.claimTreatedByStaff = response.data.claimTreatedByStaff;
                    newRevivals.getAverageTimeOfTreatment = response.data.getAverageTimeOfTreatment;
                    newRevivals.claimSatisfied = response.data.claimSatisfied;

                    setNumberPage(forceRound(response.data.allStaffClaim.total / numberPerPage));
                    setShowList(response.data.allStaffClaim.data.slice(0, numberPerPage));
                    setTotal(response.data.allStaffClaim.total);
                    setPrevUrl(response.data.allStaffClaim["prev_page_url"]);
                    setNextUrl(response.data.allStaffClaim["next_page_url"]);

                    setRevivals(newRevivals);
                    setError(defaultError);

                    setLoadFilter(false);
                    setLoad(false);
                })
                .catch(error => {
                    setError({
                        ...defaultError,
                        ...error.response && error.response.data ? error.response.data.error : ""
                    });
                    setLoadFilter(false);
                    setLoad(false);
                    // console.log("Something is wrong");
                })
                ;
        }, [numberPerPage, activeNumberPage, data, claimCat]
    )

    const filterReporting = () => {
        setLoadFilter(true);
        setLoad(true);
        if (verifyTokenExpire())
            fetchData(true);
    };

    const onFocus = () => setFocused(true);
    const onBlur = () => {
        setTimeout(() => {
            setFocused(false);
        }, 250)
    };

    useEffect(() => {
        let institParam = institutionId?.value ?? ""

        if (verifyTokenExpire())
            axios.get(`${appConfig.apiDomaine}/my/unit-staff?institution=${institParam}`)
                .then(response => {

                    setLoad(false);
                    setIsLoad(false);
                    for (let i = 0; i < response.data.staffs.length; i++) {
                        response.data.staffs[i].label = response.data.staffs[i].identite.firstname + " " + response.data.staffs[i].identite.lastname;
                        response.data.staffs[i].value = response.data.staffs[i].id;
                    }
                    response.data.staffs.unshift(
                        {
                            label: "Tous les staffs", value: "allStaff"
                        }
                    )
                    setStaffs(response.data.staffs);
                })
                .catch(error => {
                    setLoad(false);
                    setIsLoad(false);
                    console.log("Something is wrong");
                });
    }, []);

    useEffect(() => {
        if (verifyTokenExpire())
            fetchData();
    }, [fetchData]);

    const searchElement = async (e) => {
        setActiveNumberPage(1);
        if (e.target.value) {
            if (verifyTokenExpire()) {
                setLoad(true);
                if (tag.name !== "")
                    fetchData(false, { status: true, value: e.target.value }, { status: true, value: tag.name });
                else
                    fetchData(false, { status: true, value: getLowerCaseString(e.target.value) });

            }
        } else {
            if (verifyTokenExpire()) {
                setLoad(true);
                fetchData();
            }
            setActiveNumberPage(1);
        }
    };

    const onChangeNumberPerPage = (e) => {
        e.persist();
        setNumberPerPage(parseInt(e.target.value));
    };

    const onClickPage = (e, page) => {
        e.preventDefault();
        setActiveNumberPage(page);
        setLoad(true);
    };

    const onClickNextPage = (e) => {
        e.preventDefault();
        if (activeNumberPage <= numberPage && nextUrl !== null) {
            setActiveNumberPage(activeNumberPage + 1);
        }
    };

    const onClickPreviousPage = (e) => {
        e.preventDefault();
        if (activeNumberPage >= 1 && prevUrl !== null) {
            setActiveNumberPage(activeNumberPage - 1);
        }
    };

    const onChangeStaff = (selected) => {
        let staffToSend = selected?.value ?? selected.value
        const newData = { ...data };
        newData.staff_id = staffToSend;
        setStaff(selected);
        setData(newData);
    };

    const onClickTag = (name, label, className) => {
        setFocused(true);
        const newTag = { ...tag };
        newTag.name = name;
        newTag.label = label;
        newTag.className = className;
        newTag.show = true;
        setTag(newTag);
    }

    const onCloseTag = () => {
        const newTag = { ...tag };
        newTag.name = "";
        newTag.label = "";
        newTag.className = "";
        newTag.show = false;
        setTag(newTag)
    }

    const printBodyTable = (revival, index) => {
        return (
            <tr key={index} role="row" className="odd">
                {/* Start Performance */}
                <td>
                    <button
                        className="btn btn-sm btn-clean btn-icon btn-icon-md dropdown-toggle dropdown-toggle-split"
                        title={t("Détails")}
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        {/*<i className="flaticon2-down"/>*/}
                    </button>
                    <div
                        className="dropdown-menu px-5"
                        style={{
                            width: "550px",
                            height: "350px",
                            overflowY: "scroll",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                        }}
                    >
                         {/* Trasnfert */}
                         <p><strong>Transfert</strong></p>
                        <div className="row mb-3">
                            <div className="col-3"><span>{t("Quota : ")}</span><strong className="ml-2">
                                {revival?.timeLimitUnit?.Quota_delay_assigned || "-"}
                            </strong></div>
                            <div className="col-6"><span>{t("Durée effectuée : ")}</span><strong className="ml-2">
                                {revival?.timeLimitUnit?.duration_done_days_hours || "-"}
                            </strong></div>
                            <div className="col-3"><span>{t("Ecart : ")}</span><strong className="ml-2">
                                {showValue(revival?.timeLimitUnit?.ecart_days_hours)}
                            </strong></div>

                            

                        </div>
                        {/* Assignation */}
                        <p><strong>Assignation</strong></p>
                        <div className="row mb-3">
                            <div className="col-3"><span>{t("Quota : ")}</span><strong className="ml-2">
                                {revival?.timeLimitStaff?.Quota_delay_assigned || "-"}
                            </strong></div>
                            <div className="col-6"><span>{t("Durée effectuée : ")}</span><strong className="ml-2">
                                {revival?.timeLimitStaff?.duration_done_days_hours || "-"}
                            </strong></div>
                            <div className="col-3"><span>{t("Ecart : ")}</span><strong className="ml-2">
                                {showValue(revival?.timeLimitStaff?.ecart_days_hours)}
                            </strong></div>
                            </div>

                        {/* Treatment */}
                        <p><strong>Traitement</strong></p>
                        <div className="row mb-3">
                            <div className="col-3"><span>{t("Quota : ")}</span><strong className="ml-2">
                                {revival?.timeLimitTreatment?.Quota_delay_assigned || "-"}
                            </strong></div>
                            <div className="col-6"><span>{t("Durée effectuée : ")}</span><strong className="ml-2">
                                {revival?.timeLimitTreatment?.duration_done_days_hours || "-"}
                            </strong></div>
                            <div className="col-3"><span>{t("Ecart : ")}</span><strong className="ml-2">
                                {showValue(revival?.timeLimitTreatment?.ecart_days_hours)}
                            </strong></div>


                        </div>

                        {/* Validation */}
                        <p><strong>Validation</strong></p>
                        <div className="row mb-3">
                            <div className="col-3"><span>{t("Quota : ")}</span><strong className="ml-2">
                                {revival?.timeLimitValidation?.Quota_delay_assigned || "-"}
                            </strong></div>
                            <div className="col-6"><span>{t("Durée effectuée : ")}</span><strong className="ml-2">
                                {revival?.timeLimitValidation?.duration_done_days_hours || "-"}
                            </strong></div>
                            <div className="col-3"><span>{t("Ecart : ")}</span><strong className="ml-2">
                                {showValue(revival?.timeLimitValidation?.ecart_days_hours)}
                            </strong></div>


                        </div>
                        {/* Mesure de satisfaction */}
                        <p><strong>Mesure de satisfaction</strong></p>
                        <div className="row mb-3">
                            <div className="col-3"><span>{t("Quota : ")}</span><strong className="ml-2">
                                {revival?.timeLimitMeasureSatisfaction?.Quota_delay_assigned || "-"}
                            </strong></div>
                            <div className="col-6"><span>{t("Durée effectuée : ")}</span><strong className="ml-2">
                                {revival?.timeLimitMeasureSatisfaction?.duration_done_days_hours || "-"}
                            </strong></div>
                            <div className="col-3"><span>{t("Ecart : ")}</span><strong className="ml-2">
                                {showValue(revival?.timeLimitMeasureSatisfaction?.ecart_days_hours)}

                            </strong></div>


                        </div>



                    </div>
                </td>
                {/* End Performance */}
                <td>{revival.reference}</td>
                <td>
                    {formatDateToTime(revival.created_at)}
                </td>
                <td>
                {revival.claimer?.raison_sociale ? (revival.claimer?.raison_sociale) : 
        (
           (revival.claimer?.lastname ? revival.claimer.lastname : "")
         +" "+ 
          (revival.claimer?.firstname
            ? revival.claimer.firstname
            : "")
        ) }
                    </td>
                <td>{`${(revival?.active_treatment?.responsible_staff?.identite?.lastname) ? revival.active_treatment.responsible_staff.identite.lastname : ''} ${revival?.active_treatment?.responsible_staff?.identite?.firstname ? revival.active_treatment.responsible_staff.identite.firstname : ''} `}</td>
                <td>{formatDateToTime(revival.active_treatment.transferred_to_unit_at)}</td>
            
                <td>{formatDateToTime(revival.active_treatment.assigned_to_staff_at)}</td>
                <td>{revival.claim_object ? revival.claim_object.name["fr"] : ""}</td>
                {/*  <td style={{textAlign: 'center'}}>
                    <HtmlDescription onClick={() => showModal(revival.description ? revival.description : '-')}/>
                </td>*/}
                <td className={"text-center"}>
                    {
                        (revival?.status ? revival.status : "") === "archived" ?
                            <span className="kt-badge kt-badge--inline kt-badge--dark h2">{t("Archivé")}</span>
                            : (revival?.status ? revival.status : "") === "validated" ?
                                <span className="kt-badge kt-badge--inline kt-badge--success h2">{t("Validé")}</span>
                                : (revival?.status ? revival.status : "") === "incomplete" ?
                                    <span className="kt-badge kt-badge--inline kt-badge--warning h2">{t("Incomplète")}</span>
                                    : (revival?.status ? revival.status : "") === "full" ?
                                        <span className="kt-badge kt-badge--inline kt-badge--primary h2">{t("Complète")}</span>
                                        : (revival?.status ? revival.status : "") === "transferred_to_unit" ?
                                            <span className="kt-badge kt-badge--inline kt-badge--unified-dark h2">{t("Transférer à une unité")}</span>
                                            : (revival?.status ? revival.status : "") === "assigned_to_staff" ?
                                                <span className="kt-badge kt-badge--inline kt-badge--info h2">{t("Assigner à un staff")}</span>
                                                : (revival?.status ? revival.status : "") === "treated" ?
                                                    <span className="kt-badge kt-badge--inline kt-badge--success h2">{t("Traité")}</span>
                                                    : (revival?.status ? revival.status : "") === "considered" ?
                                                        <span className="kt-badge kt-badge--inline kt-badge--success h2">{t("Considéré")}</span>
                                                        : (revival?.status ? revival.status : "") === "awaiting" ?
                                                            <span className="kt-badge kt-badge--inline kt-badge--warning h2">{t("En attente")}</span>
                                                            : (revival?.status ? revival.status : "") === "unsatisfied" ?
                                                                <span className="kt-badge kt-badge--inline kt-badge--warning h2">{t("Traité et insatisfait")}</span>
                                                                : (revival?.status ? revival.status : "") === "transferred_to_staff_for_satisfactiion" ?
                                                                    <span className="kt-badge kt-badge--inline kt-badge--warning h2">{t("En attente de mesure de satisfaction")}</span>

                                                                    : <span className="kt-badge kt-badge--inline kt-badge--warning h2">{t("En cours de traitement")}</span>
                    }

                    {/* {revival?.status ? displayStatus(revival.status) : ""}*/}
                </td>
                <td className={"text-center"}>
                    <a href={`/monitoring/perf/claims/${revival?.claim_id}/detail`}
                        className="btn btn-sm btn-clean btn-icon btn-icon-md" title={t("Détails")}>
                        <i className="la la-eye" />
                    </a>
                </td>
            </tr>
        );
    };

    return (
        ready ? (verifyPermission(props.userPermissions, 'show-my-staff-monitoring') ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                {t("Processus")}
                            </h3>
                            <span className="kt-subheader__separator kt-hidden" />
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter" /></a>
                                <span className="kt-subheader__breadcrumbs-separator" />
                                <a href="#button" onClick={e => e.preventDefault()}
                                    className="kt-subheader__breadcrumbs-link" style={{ cursor: "text" }}>
                                    {t("Traitement")}
                                </a>
                                <span className="kt-subheader__separator kt-hidden" />
                                <div className="kt-subheader__breadcrumbs">
                                    <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                        className="flaticon2-shelter" /></a>
                                    <span className="kt-subheader__breadcrumbs-separator" />
                                    <a href="#button" onClick={e => e.preventDefault()}
                                        className="kt-subheader__breadcrumbs-link" style={{ cursor: "text" }}>
                                        {t("Suivi des performances ")}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <InfirmationTable information={(
                        <div>
                            {t("Cette page présente la liste des suivis des réclamations")}
                        </div>
                    )} />

                    <div className="kt-portlet">
                        <HeaderTablePage
                            title={t("Suivi des performances")}
                        />

                        <div className="kt-portlet__body">
                            <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">

                                <div className="m-auto col-xl-9 col-lg-12 order-lg-3 order-xl-1">
                                    <div className="" style={{ marginBottom: "30px" }}>
                                        <div className="kt-portlet__body" style={{ padding: "10px 25px" }}>
                                            <div className="kt-widget6">
                                                <div className="kt-widget6__body">
                                                    <div className={error.staff_id.length ? "form-group validated kt-widget6__item row" : "form-group kt-widget6__item row"} style={{ padding: "0.5rem 0" }}>
                                                        <div className="col-lg-7" style={{ fontWeight: "500" }}>Agents</div>
                                                        <div className={"col-lg-9"}>
                                                            <Select
                                                                isClearable={true}
                                                                placeholder={t("Veuillez sélectionner les agents")}
                                                                value={staff}
                                                                isLoading={isLoad}
                                                                onChange={onChangeStaff}
                                                                options={staffs}
                                                            />
                                                            {
                                                                error.staff_id.length ? (
                                                                    error.staff_id.map((error, index) => (
                                                                        <div key={index}
                                                                            className="invalid-feedback">
                                                                            {error}
                                                                        </div>
                                                                    ))
                                                                ) : null
                                                            }
                                                        </div>
                                                        <div className="col-lg-2">
                                                            {loadFilter ? (
                                                                <button
                                                                    className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                                                    type="button" disabled>
                                                                    {t("Chargement...")}
                                                                </button>
                                                            ) : (
                                                                <button type="submit" onClick={filterReporting} className="btn btn-primary" >{t("Filtrer")}</button>
                                                            )}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                <div className="text-center m-auto col-xl-7 col-lg-7 order-lg-3 order-xl-1">
                                    <div className="kt-portlet kt-portlet--height-fluid" style={{ marginBottom: "30px" }}>
                                        <div className="kt-portlet__body" style={{ padding: "10px 25px" }}>
                                            <div className="kt-widget6">
                                                <div className="kt-widget6__body">

                                                    {JSON.parse(ls.get("userData"))?.staff?.is_lead && <>
                                                        <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                            <span className="col-lg-10" style={{ fontWeight: "500" }}>Nombre de réclamations reçues à ce jour</span>
                                                            <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                                style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                                {revivals.claimAssignedToStaff !== undefined && revivals.claimAssignedToStaff !== null ? revivals.claimAssignedToStaff : "-"}
                                                            </span>
                                                        </div>
                                                        <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                            <span className="col-lg-10" style={{ fontWeight: "500" }}>Nombre de réclamations déjà traitées à ce jour</span>
                                                            <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                                style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                                {revivals.claimTreatedByStaff !== undefined && revivals.claimTreatedByStaff !== null ? revivals.claimTreatedByStaff : "-"}
                                                            </span>
                                                        </div>
                                                        <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                            <span className="col-lg-10" style={{ fontWeight: "500" }}>Nombre de réclamations restantes à traiter à ce jour</span>
                                                            <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                                style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                                {revivals.claimNoTreatedByStaff !== undefined && revivals.claimNoTreatedByStaff !== null ? revivals.claimNoTreatedByStaff : "-"}
                                                            </span>
                                                        </div>
                                                        {/* Start Performances */}
                                                        <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                            <span className="col-lg-10" style={{ fontWeight: "500" }}>Temps moyen de traitement d'une réclamation</span>
                                                            <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                                style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                                {revivals.getAverageTimeOfTreatment !== undefined && revivals.getAverageTimeOfTreatment !== null ? parseFloat(revivals.getAverageTimeOfTreatment).toFixed(2) : "-"}
                                                            </span>
                                                        </div>

                                                        <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                            <span className="col-lg-10" style={{ fontWeight: "500" }}>Nbre de réclamations qui ont eu de retour satisfaisant</span>
                                                            <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                                style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                                {revivals.claimSatisfied !== undefined && revivals.claimSatisfied !== null ? revivals.claimSatisfied : "-"}
                                                            </span>
                                                        </div>
                                                    </>}

                                                    {/* End Performances */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-6 text-left">
                                        <div id="kt_table_1_filter" className="dataTables_filter">
                                            {
                                                (
                                                    <div className="row">
                                                        <div
                                                            className={`dropdown-menu ${focused ? "show" : ""}`}
                                                            aria-labelledby="dropdownMenuButton"
                                                            x-placement="bottom-start"
                                                            style={{
                                                                width: "100%",
                                                                position: "absolute",
                                                                willChange: "transform",
                                                                top: "33px",
                                                                left: "0px",
                                                                transform: "translate3d(0px, 38px, 0px)",
                                                                zIndex: "1"
                                                            }}>
                                                            <span className="d-flex justify-content-center"><em>{("---" + t("Type de recherche") + "---")}</em></span>
                                                            <div className="d-flex justify-content-center mt-1 mb-1">
                                                                <button className="btn btn-outline-dark" onClick={e => onClickTag("reference", t("Référence"), "dark")}>{t("Référence")}</button>&nbsp;
                                                                <button className="btn btn-outline-dark" onClick={e => onClickTag("claimer", t("Réclamant"), "dark")}>{t("Réclamant")}</button>&nbsp;
                                                                <button className="btn btn-outline-dark" onClick={e => onClickTag("claimObject", t("Objet de la réclamation"), "dark")}>{t("Objet de la réclamation")}</button>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className={`dropdown-menu ${focused ? "show" : ""}`}
                                                            aria-labelledby="dropdownMenuButton"
                                                            x-placement="bottom-start"
                                                            style={{
                                                                width: "100%",
                                                                position: "absolute",
                                                                willChange: "transform",
                                                                top: "33px",
                                                                left: "0px",
                                                                transform: "translate3d(0px, 38px, 0px)",
                                                                zIndex: "1"
                                                            }}>
                                                            <span className="d-flex justify-content-center"><em>{("---" + t("Type de recherche") + "---")}</em></span>
                                                            <div className="d-flex justify-content-center mt-1 mb-1">
                                                                <button className="btn btn-outline-dark" onClick={e => onClickTag("reference", t("Référence"), "dark")}>{t("Référence")}</button>&nbsp;
                                                                <button className="btn btn-outline-dark" onClick={e => onClickTag("claimer", t("Réclamant"), "dark")}>{t("Réclamant")}</button>&nbsp;
                                                                <button className="btn btn-outline-dark" onClick={e => onClickTag("claimObject", t("Objet de la réclamation"), "dark")}>{t("Objet de la réclamation")}</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }

                                            <label>
                                                {t("Recherche")}:
                                                <input id="myInput" type="text"
                                                    ref={searchInput}
                                                    autoComplete={"off"}
                                                    onKeyUp={(e) => searchElement(e)}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                    className="form-control form-control-sm" placeholder=""
                                                    aria-controls="kt_table_1" />
                                                {
                                                    tag.show && tag.name.length ? (
                                                        <span className={"btn btn-label-" + tag.className}
                                                            style={{


                                                                borderBottomRightRadius: "0px",
                                                                borderTopRightRadius: "0px",
                                                                whiteSpace: "nowrap",
                                                            }}>
                                                            <div>
                                                                {tag.label}
                                                                <button type="button" onClick={e => onCloseTag()} className="btn btn-icon" style={{
                                                                    height: "50%",
                                                                    width: "20%",
                                                                }}>
                                                                    <i className="flaticon2-cross" style={{
                                                                        fontSize: "0.8em",
                                                                    }} />
                                                                </button>
                                                            </div>
                                                        </span>
                                                    ) : null
                                                }
                                            </label>
                                        </div>
                                    </div>

                                    <Select
                                        placeholder={t("Veuillez sélectionner le type de réclamation")}
                                        className="col-sm-6"
                                        size="small"
                                        value={claimCat}
                                        onChange={onChangeClaimCat}
                                        options={claimCats}
                                    />
                                </div>

                                {
                                    load ? <LoadingTable /> : (
                                        <>
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <table
                                                        className="table table-striped table-bordered table-hover table-checkable dataTable dtr-inline"
                                                        id="myTable" role="grid" aria-describedby="kt_table_1_info"
                                                        style={{ width: "100%" }}>
                                                        <thead>
                                                            <tr role="row">
                                                                <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                                    rowSpan="1" colSpan="1" style={{ width: "70.25px" }}
                                                                    aria-label="Country: activate to sort column ascending">
                                                                    {t("Détails")}
                                                                </th>
                                                                <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                                    rowSpan="1" colSpan="1" style={{ width: "70.25px" }}
                                                                    aria-label="Country: activate to sort column ascending">
                                                                    {t("Référence")}
                                                                </th>
                                                                <th className="sorting sorter-dates" tabIndex="0" aria-controls="kt_table_1"
                                                                    rowSpan="1" colSpan="1" style={{ width: "70.25px" }}
                                                                    aria-label="Country: activate to sort column ascending">
                                                                    {t("Date de réception")}
                                                                </th>
                                                                <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                                    rowSpan="1" colSpan="1" style={{ width: "70.25px" }}
                                                                    aria-label="Country: activate to sort column ascending">
                                                                    {t("Réclamant")}
                                                                </th>
                                                                <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                                    rowSpan="1" colSpan="1" style={{ width: "70.25px" }}
                                                                    aria-label="Country: activate to sort column ascending">
                                                                    {(props.plan === "PRO" || type_macro === "filiale") ? t("Staff") : t("Institution ciblée")}
                                                                </th>
                                                                <th className="sorting sorter-dates" tabIndex="0" aria-controls="kt_table_1"
                                                                    rowSpan="1" colSpan="1" style={{ width: "70.25px" }}
                                                                    aria-label="Country: activate to sort column ascending">
                                                                    {t("Date de transfert")}
                                                                </th>
                                                                <th className="sorting sorter-dates" tabIndex="0" aria-controls="kt_table_1"
                                                                    rowSpan="1" colSpan="1" style={{ width: "70.25px" }}
                                                                    aria-label="Country: activate to sort column ascending">
                                                                    {t("Date affectation")}
                                                                </th>
                                                                <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                                    rowSpan="1" colSpan="1" style={{ width: "70.25px" }}
                                                                    aria-label="Country: activate to sort column ascending">
                                                                    {t("Objet de réclamation")}
                                                                </th>
                                                                {/*   <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                            rowSpan="1" colSpan="1" style={{width: "70.25px"}}
                                                            aria-label="Country: activate to sort column ascending">
                                                            {t("Description")}
                                                        </th>*/}
                                                                <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                                    rowSpan="1" colSpan="1" style={{ width: "70.25px" }}
                                                                    aria-label="Country: activate to sort column ascending">
                                                                    {t("Statut")}
                                                                </th>
                                                                <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                                    rowSpan="1" colSpan="1" style={{ width: "40.25px" }}
                                                                    aria-label="Type: activate to sort column ascending">
                                                                    {t("Action")}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                revivals.allStaffClaim.length ? (
                                                                    showList.length ? (
                                                                        showList.map((revival, index) => (
                                                                            printBodyTable(revival, index)
                                                                        ))
                                                                    ) : (
                                                                        <EmptyTable search={true} />
                                                                    )
                                                                ) : (
                                                                    <EmptyTable />
                                                                )
                                                            }
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                            <th rowSpan="1" colSpan="1">{t("Détails")}</th>
                                                                <th rowSpan="1" colSpan="1">{t("Référence")}</th>
                                                                <th rowSpan="1" colSpan="1">{t("Date de réception")}</th>
                                                                <th rowSpan="1" colSpan="1">{t("Réclamant")}</th>
                                                                <th rowSpan="1"
                                                                    colSpan="1">{(props.plan === "PRO" || type_macro === "filiale") ? "Staff" : "Institution ciblée"}</th>
                                                                <th rowSpan="1" colSpan="1">{t("Date de transfert")}</th>
                                                                <th rowSpan="1" colSpan="1">{t("Date affectation")}</th>
                                                                <th rowSpan="1" colSpan="1">{t("Objet de réclamation")}</th>
                                                                {/*   <th rowSpan="1" colSpan="1">{t("Description")}</th>*/}
                                                                <th rowSpan="1" colSpan="1">{t("Statut")}</th>
                                                                <th rowSpan="1" colSpan="1">{t("Action")}</th>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                    <button id="button_modal" type="button" className="btn btn-secondary btn-icon-sm d-none" data-toggle="modal" data-target="#message_email" />
                                                    <HtmlDescriptionModal title={t("Description")} message={currentMessage} />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-5">
                                                    <div className="dataTables_info" id="kt_table_1_info" role="status"
                                                        aria-live="polite">{t("Affichage de")} 1
                                                        {t("à")} {numberPerPage} {t("sur")} {total} {t("données")}
                                                    </div>
                                                </div>
                                                {
                                                    showList.length ? (
                                                        <div className="col-sm-12 col-md-7 dataTables_pager">
                                                            <Pagination
                                                                numberPerPage={numberPerPage}
                                                                onChangeNumberPerPage={onChangeNumberPerPage}
                                                                activeNumberPage={activeNumberPage}
                                                                onClickPreviousPage={e => onClickPreviousPage(e)}
                                                                onClickPage={(e, number) => onClickPage(e, number)}
                                                                numberPage={numberPage}
                                                                onClickNextPage={e => onClickNextPage(e)}
                                                            />
                                                        </div>
                                                    ) : null
                                                }
                                            </div>
                                        </>
                                    )
                                }

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        ) : null) : null
    );
};

const mapStateToProps = state => {
    return {
        plan: state.plan.plan,
        userPermissions: state.user.user.permissions,
        //activePilot: state.user.user.staff.is_active_pilot
    };

};


export default connect(mapStateToProps)(RevivalMonitoring);
