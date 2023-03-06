import { useTranslation } from "react-i18next";
import { verifyPermission } from "../../helpers/permission";
import { ERROR_401 } from "../../config/errorPage";
import React, { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
import appConfig from "../../config/appConfig";
import Select from "react-select";
import { displayStatus, forceRound, formatDateToTime, getLowerCaseString, loadCss, showValue, truncateString } from "../../helpers/function";
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

const RevivalMonitoringPilote = (props) => {

    //usage of useTranslation i18n
    const { t, ready } = useTranslation();

    if (
        !(
            verifyPermission(
                props.userPermissions,
                "list-monitoring-claim-any-institution"
            ) ||
            verifyPermission(
                props.userPermissions,
                "list-monitoring-claim-my-institution"
            )
        )
    )
        window.location.href = ERROR_401;

    const defaultData = {
        institution_id: "",
        pilot_id: "allPilot",
        status: "",
        unit_id: "allUnit",
        collector_id: "allCollector"
    };
    const defaultError = {
        institution_targeted_id: [],
        pilot_id: [],
        unit_id: [],
        collector_id: []
    };

    // const isLeadPilot =
    let isLeadPilot = JSON.parse(ls.get("userData"))?.staff?.is_pilot_lead;
    const [load, setLoad] = useState(false);
    const [claims, setClaims] = useState([]);
    const [isLoad, setIsLoad] = useState(true);
    const [data, setData] = useState(defaultData);
    const [revivals, setRevivals] = useState({
        allClaimAssignedTo: [],
        claimSaved: [],
        totalClaimAssigned: "-",
        totalClaimRejected: "-",
        totalClaimValidated: "-",
        getAverageTimeOfAssignation: "-",
        getAverageTimeOfSatisfaction: "-",
        getAverageTimeOfValidation: "-",
        totalClaimTreated: "-",
        totalClaimNotTreated: "-",
        totalClaimSatisfied: "-",
        claimUnSatisfied: "-",
        claimWithMeasureOfSAtisfaction: "-",
        totalClaimSaved: "-",
        claimReceivedForMeasure: "-"

    });
    const [activeNumberPage, setActiveNumberPage] = useState(1);
    const [numberPage, setNumberPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [numberPerPage, setNumberPerPage] = useState(NUMBER_ELEMENT_PER_PAGE);
    const [showList, setShowList] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [prevUrl, setPrevUrl] = useState(null);
    const [currentMessage, setCurrentMessage] = useState("");
    const [pilot, setPilot] = useState({ label: "Tous les pilotes", value: "allPilot" });
    const [unit, setUnit] = useState({ label: "Toutes les unités", value: "allUnit" });
    const [collector, setCollector] = useState({ label: "Tous les collecteurs", value: "allCollector" });
    const [pilots, setPilots] = useState([]);
    const [units, setUnits] = useState([]);
    const [collectors, setCollectors] = useState([]);
    const [error, setError] = useState(defaultError);
    const [loadFilter, setLoadFilter] = useState(false);

    const [searchList, setSearchList] = useState([]);
    const [focused, setFocused] = useState(false);
    const searchInput = useRef(null);
    const [tag, setTag] = useState({ name: "", label: "", className: "", show: false });

    const [claimCat, setClaimCat] = useState("")
    const [claimCatsLeadPilot, setClaimsCatLeadPilot] = useState([{ value: "assigned", label: "réclamations affectées" }, { value: "validated", label: "réclamations validées" }, { value: "surveyed", label: "réclamations enquêtées" }])
    const [claimCatsPilot, setClaimsCatPilot] = useState([{value: "assigned", label: "réclamations reçues"}, {value: "treated", label: "réclamations traitées"}, {value: "not_treated", label: "réclamations non traitées"}])
    const [typeSuivi, setTypeSuivi] = useState(isLeadPilot ? "suivi_pilot" : "suivi_unite")


    const onChangeClaimCat = (selected) => {
        setClaimCat(selected)
    }



    const fetchData = useCallback(
        async (click = false, search = { status: false, value: "" }, type = { status: false, value: "" }) => {
            setLoadFilter(true);
            setLoad(true);
            let endpoint = "";
            let sendData = {};

            endpoint = `${appConfig.apiDomaine}/my/monitoring-pilote?size=${numberPerPage}&page=${activeNumberPage}${type.status === true ? `&type=${type.value}` : ""}${search.status === true ? `&key=${search.value}` : ""}`;
            sendData = {
                pilot_id: data.pilot_id ? data.pilot_id : "allPilot",
                status: claimCat ? claimCat.value : ""
            };
            if (!data.staff_id)
                delete sendData.staff_id;

            await axios.post(endpoint, sendData)
                .then(response => {
                    console.log("response leadPilot", response)
                    const newRevivals = { ...revivals };
                    if (click)
                        ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig(ready ? t("Filtre effectué avec succès") : ""));
                    newRevivals.allClaimAssignedTo = response.data.allClaimAssignedTo.data ? response.data.allClaimAssignedTo.data : [];
                    newRevivals.totalClaimAssigned = response.data.totalClaimAssigned;
                    newRevivals.totalClaimRejected = response.data.totalClaimRejected;
                    newRevivals.totalClaimSatisfied = response.data.totalClaimSatisfied;
                    newRevivals.totalClaimValidated = response.data.totalClaimValidated;
                    newRevivals.getAverageTimeOfAssignation = response.data.getAverageTimeOfAssignation;
                    newRevivals.getAverageTimeOfSatisfaction = response.data.getAverageTimeOfSatisfaction;
                    newRevivals.getAverageTimeOfValidation = response.data.getAverageTimeOfValidation;
                    console.log("newRevivals ", newRevivals.allClaimAssignedTo)
                    setNumberPage(forceRound(response.data.allClaimAssignedTo.total / numberPerPage));
                    setShowList(response.data.allClaimAssignedTo.data.slice(0, numberPerPage));
                    setTotal(response.data.allClaimAssignedTo.total);
                    setPrevUrl(response.data.allClaimAssignedTo["prev_page_url"]);
                    setNextUrl(response.data.allClaimAssignedTo["next_page_url"]);

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

    const fetchDataSuiviCollector = useCallback(
        async (click = false, search = { status: false, value: "" }, type = { status: false, value: "" }) => {
            setLoadFilter(true);
            setLoad(true);
            let endpoint = "";
            let sendData = {};

            endpoint = `${appConfig.apiDomaine}/my/collector-pilot?size=${numberPerPage}&page=${activeNumberPage}${type.status === true ? `&type=${type.value}` : ""}${search.status === true ? `&key=${search.value}` : ""}`;
            sendData = {
                collector_id: data.collector_id ? data.collector_id : "allCollector",
                // status: claimCat ? claimCat.value : ""
            };
            // if (!data.staff_id)
            //     delete sendData.staff_id;

            await axios.post(endpoint, sendData)
                .then(response => {
                    console.log("response collector", response)
                    const newRevivals = { ...revivals };
                    if (click)
                        ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig(ready ? t("Filtre effectué avec succès") : ""));
                    newRevivals.allClaimAssignedTo = response.data.claimSaved.data ? response.data.claimSaved.data : [];
                    newRevivals.claimSatisfied = response.data.claimSatisfied;
                    newRevivals.claimUnSatisfied = response.data.claimUnSatisfied;
                    newRevivals.claimWithMeasureOfSAtisfaction = response.data.claimWithMeasureOfSAtisfaction;
                    newRevivals.totalClaimSaved = response.data.totalClaimSaved;
                 newRevivals.claimReceivedForMeasure = response.data.claimReceivedForMeasure;
                    // newRevivals.getAverageTimeOfSatisfaction = response.data.getAverageTimeOfSatisfaction;
                    // newRevivals.getAverageTimeOfValidation = response.data.getAverageTimeOfValidation;
                    console.log("newRevivals ", newRevivals.claimSaved)
                    setNumberPage(forceRound(response.data.claimSaved.total / numberPerPage));
                    setShowList(response.data.claimSaved.data.slice(0, numberPerPage));
                    setTotal(response.data.claimSaved.total);
                    setPrevUrl(response.data.claimSaved["prev_page_url"]);
                    setNextUrl(response.data.claimSaved["next_page_url"]);

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

    const fetchDataSuiviUnit = useCallback(
        async (click = false, search = { status: false, value: "" }, type = { status: false, value: "" }) => {
            setLoadFilter(true);
            setLoad(true);
            let endpoint = "";
            let sendData = {};

            endpoint = `${appConfig.apiDomaine}/my/pilot-unit?size=${numberPerPage}&page=${activeNumberPage}${type.status === true ? `&type=${type.value}` : ""}${search.status === true ? `&key=${search.value}` : ""}`;
            sendData = {
                unit_id: data.unit_id ? data.unit_id : "allUnit",
                status: claimCat ? claimCat.value : ""
            };
            // if (!data.staff_id)
            //     delete sendData.staff_id;

            await axios.post(endpoint, sendData)
                .then(response => {
                    console.log("response Unit", response)
                    const newRevivals = { ...revivals };
                    if (click)
                        ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig(ready ? t("Filtre effectué avec succès") : ""));
                    newRevivals.allClaimAssignedTo = response.data.allClaimAssignedTo.data ? response.data.allClaimAssignedTo.data : [];
                    newRevivals.totalClaimAssigned = response.data.totalClaimAssigned;
                    newRevivals.totalClaimTreated = response.data.totalClaimTreated;
                    newRevivals.getAverageTimeOfAssignation = response.data.getAverageTimeOfAssignation;
                    newRevivals.totalClaimNotTreated = response.data.totalClaimNotTreated;
                    newRevivals.totalClaimSatisfied = response.data.totalClaimSatisfied;
                    
                    console.log("newRevivals ", newRevivals.allClaimAssignedTo)
                    setNumberPage(forceRound(response.data.allClaimAssignedTo.total / numberPerPage));
                    setShowList(response.data.allClaimAssignedTo.data.slice(0, numberPerPage));
                    setTotal(response.data.allClaimAssignedTo.total);
                    setPrevUrl(response.data.allClaimAssignedTo["prev_page_url"]);
                    setNextUrl(response.data.allClaimAssignedTo["next_page_url"]);

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
        if (verifyTokenExpire())
        // For Lead Pilot
         isLeadPilot && typeSuivi === "suivi_pilot" &&   (axios.get(`${appConfig.apiDomaine}/my/monitoring-pilote`)
                .then(response => {
                    console.log("response ", response)
                    setLoad(false);
                    setIsLoad(false);
                    for (let i = 0; i < response.data.pilote.length; i++) {
                        response.data.pilote[i].label = response.data.pilote[i].identite.firstname + " " + response.data.pilote[i].identite.lastname;
                        response.data.pilote[i].value = response.data.pilote[i].identite.staff.id;
                    }
                    response.data.pilote.unshift(
                        {
                            label: "Tous les pilotes", value: "allPilot"
                        }
                    )
                    setPilots(response.data.pilote);
                })
                .catch(error => {
                    setLoad(false);
                    setIsLoad(false);
                    console.log("Something is wrong");
                }));
                // For Pilot
                typeSuivi === "suivi_unite" && (axios.get(`${appConfig.apiDomaine}/my/pilot-unit`)
            .then(response => {
                console.log("response.data.unit 1", response)
                setLoad(false);
                setIsLoad(false);
                for (let i = 0; i < response.data.unit.length; i++) {
                    response.data.unit[i].label = response.data.unit[i].name["fr"] + " ";
                    response.data.unit[i].value = response.data.unit[i].id;
                }
                response.data.unit.unshift(
                    {
                        label: "Toutes les unités", value: "allUnit"
                    }
                )
                console.log("response.data.unit 2",response.data.unit)
                setUnits(response.data.unit);
            })
            .catch(error => {
                setLoad(false);
                setIsLoad(false);
                console.log("Something is wrong");
            }));
            // Collectors
            typeSuivi === "suivi_collector" && (axios.get(`${appConfig.apiDomaine}/my/collector-pilot`)
            .then(response => {
                console.log("response.data.collector 1", response)
                setLoad(false);
                setIsLoad(false);
                for (let i = 0; i < response.data.length; i++) {
                    response.data[i].label = response.data[i].identite.firstname + " " + response.data[i].identite.lastname;
                    response.data[i].value = response.data[i].identite.staff.id;
                }
                response.data.unshift(
                    {
                        label: "Tous les collecteurs", value: "allCollector"
                    }
                )
                console.log("response.data 2",response.data)
                setCollectors(response.data);
            })
            .catch(error => {
                setLoad(false);
                setIsLoad(false);
                console.log("Something is wrong");
            }));
    }, [typeSuivi]);

    useEffect(() => {
        if (verifyTokenExpire())
            isLeadPilot && typeSuivi === "suivi_pilot" &&  fetchData();
            typeSuivi === "suivi_unite" && fetchDataSuiviUnit();
            typeSuivi === "suivi_collector" && fetchDataSuiviCollector();
    }, [fetchData, fetchDataSuiviUnit, fetchDataSuiviCollector]);

    const searchElement = async (e) => {
        setActiveNumberPage(1);
        if (e.target.value) {
            if (verifyTokenExpire()) {
                setLoad(true);
                if (tag.name !== ""){
                typeSuivi == "suivi_pilote" && fetchData(false, { status: true, value: e.target.value }, { status: true, value: tag.name });
                typeSuivi == "suivi_unite" && fetchDataSuiviUnit(false, { status: true, value: e.target.value }, { status: true, value: tag.name });
                typeSuivi == "suivi_collector" && fetchDataSuiviCollector(false, { status: true, value: e.target.value }, { status: true, value: tag.name });
            }else
            typeSuivi == "suivi_pilote" && fetchData(false, { status: true, value: getLowerCaseString(e.target.value) });
            typeSuivi == "suivi_unite" && fetchDataSuiviUnit(false, { status: true, value: getLowerCaseString(e.target.value) });
            typeSuivi == "suivi_collector" && fetchDataSuiviCollector(false, { status: true, value: getLowerCaseString(e.target.value) });

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

    const onChangePilot = (selected) => {
        let pilotToSend = selected?.value ?? selected.value
        const newData = { ...data };
        newData.pilot_id = pilotToSend;
        setPilot(selected);
        setData(newData);
    };

    const onChangeUnit = (selected) => {
        let unitToSend = selected?.value ?? selected.value
        const newData = { ...data };
        newData.unit_id = unitToSend;
        setUnit(selected);
        setData(newData);
    };

    const onChangeCollector = (selected) => {
        let collectorToSend = selected?.value ?? selected.value
        const newData = { ...data };
        newData.collector_id = collectorToSend;
        setCollector(selected);
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
                            height: "150px",
                            overflowY: "scroll",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                        }}
                    >
                        <div className="d-flex justify-content-between">
                            <strong>{t("Quota")}</strong>
                            <p className="ml-5">
                                {revival?.timeLimitTreatment?.Quota_delay_assigned || "-"}
                            </p>
                        </div>

                        <div className="d-flex justify-content-between">
                            <strong>{t("Durée effectuée")}</strong>
                            <p className="ml-5">
                                {revival?.timeLimitTreatment?.duration_done || "-"}
                            </p>
                        </div>

                        <div className="d-flex justify-content-between">
                            <strong>{t("Ecart")}</strong>
                            <p className="ml-5">
                                {revival?.timeLimitTreatment?.ecart ? (<span>{showValue(revival?.timeLimitTreatment?.ecart)}</span>) : "-"}
                            </p>
                        </div>




                    </div>
                </td>
                {/* End Performance */}
                <td>{revival.reference}</td>
                <td>
                    {formatDateToTime(revival.created_at)}
                </td>
                <td>{`${(revival.claimer && revival.claimer.lastname) ? revival.claimer.lastname : ''} ${(revival.claimer && revival.claimer.firstname) ? revival.claimer.firstname : ''} `}</td>
                <td>{`${(revival?.active_treatment?.responsible_staff?.identite?.lastname) ? revival.active_treatment.responsible_staff.identite.lastname : ''} ${revival?.active_treatment?.responsible_staff?.identite?.firstname ? revival.active_treatment.responsible_staff.identite.firstname : ''} `}</td>
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


    const handleChangeTypeSuivi = (type) => {
        setTypeSuivi(type)
    }

    return (
        ready ? (
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
                            {t("Cette page présente la liste des suivis des performances")}
                        </div>
                    )} />

                    <div className="kt-portlet">
                        <HeaderTablePage
                            title={t("Suivi des performances")}
                        />

                        <div className="kt-portlet__body">
                            <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">

                                <div className="m-auto col-xl-4 col-lg-12 order-lg-3 order-xl-1">
                                    <div className="" style={{ marginBottom: "30px" }}>
                                        <div className="kt-portlet__body" style={{ padding: "10px 25px" }}>
                                            <div className="kt-widget6">
                                                <div className="kt-widget6__body">
                                                    {true ? (
                                                        <div className="form-group row">
                                                            {isLeadPilot && <div className={"col d-flex align-items-center mt-4"}>
                                                                <label className="kt-checkbox">
                                                                    <input
                                                                        id="is_suivi_pilot"
                                                                        type="checkbox"
                                                                         checked={typeSuivi == "suivi_pilot"}
                                                                        value={typeSuivi == "suivi_pilot"}
                                                                        onChange={() => handleChangeTypeSuivi("suivi_pilot")}
                                                                    />
                                                                    {t("Suivi des pilotes")} <span />
                                                                </label>
                                                            </div>}
                                                            <div className={"col d-flex align-items-center mt-4"}>
                                                                <label className="kt-checkbox">
                                                                    <input
                                                                        id="is_suivi_unite"
                                                                        type="checkbox"
                                                                         checked={typeSuivi == "suivi_unite"}
                                                                        value={typeSuivi == "suivi_unite"}
                                                                        onChange={() => handleChangeTypeSuivi("suivi_unite")}
                                                                    />
                                                                    {t("Suivi des unités")} <span />
                                                                </label>
                                                            </div>
                                                            <div className={"col d-flex align-items-center mt-4"}>
                                                                <label className="kt-checkbox">
                                                                    <input
                                                                        id="is_suivi_collector"
                                                                        type="checkbox"
                                                                         checked={typeSuivi == "suivi_collector"}
                                                                        value={typeSuivi == "suivi_collector"}
                                                                        onChange={() => handleChangeTypeSuivi("suivi_collector")}
                                                                    />
                                                                    {t("Suivi des collecteurs")} <span />
                                                                </label>
                                                            </div>
                                                            
                                                        </div>
                                                    ) : null}

                                                   
                                                    <div className={error.pilot_id.length ? "form-group validated kt-widget6__item row" : "form-group kt-widget6__item row"} style={{ padding: "0.5rem 0" }}>
                                                        <div className="col-lg-1" style={{ fontWeight: "500" }}>{typeSuivi == "suivi_pilot" ? "Pilotes" : typeSuivi == "suivi_unite" ? "Unités" : typeSuivi == "suivi_collector" ? "Collecteurs" : null}</div>
                                                        <div className={"col-lg-9"}>
                                                            <Select
                                                                isClearable={true}
                                                                placeholder={""}
                                                                value={typeSuivi == "suivi_pilot" ? pilot : typeSuivi == "suivi_unite" ?  unit : collector }
                                                                isLoading={isLoad}
                                                                onChange={typeSuivi == "suivi_pilot" ? onChangePilot : typeSuivi == "suivi_unite" ? onChangeUnit : onChangeCollector }
                                                                options={typeSuivi == "suivi_pilot" ? pilots : typeSuivi == "suivi_unite" ? units : collectors }
                                                            />
                                                            {
                                                                error.pilot_id.length ? (
                                                                    error.pilot_id.map((error, index) => (
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



                                <div className="text-center m-auto col-xl-4 col-lg-7 order-lg-3 order-xl-1">
                                    <div className="kt-portlet kt-portlet--height-fluid" style={{ marginBottom: "30px" }}>
                                        <div className="kt-portlet__body" style={{ padding: "10px 25px" }}>
                                            <div className="kt-widget6">
                                                <div className="kt-widget6__body">
                                                    
                                                    {typeSuivi == "suivi_unite" && <>
                                                    <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                        <span className="col-lg-10" style={{ fontWeight: "500" }}>Nombre de réclamations reçues à ce jour</span>
                                                        <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                            style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                            {revivals.totalClaimAssigned !== undefined && revivals.totalClaimAssigned !== null ? revivals.totalClaimAssigned : "-"}
                                                        </span>
                                                    </div>

                                                    <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                        <span className="col-lg-10" style={{ fontWeight: "500" }}>Nombre de réclamations déjà traitées à ce jour</span>
                                                        <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                            style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                            {revivals.totalClaimTreated !== undefined && revivals.totalClaimTreated !== null ? revivals.totalClaimTreated : "-"}
                                                        </span>
                                                    </div>
                                                    <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                        <span className="col-lg-10" style={{ fontWeight: "500" }}>Nombre de réclamations restant à traiter à ce jour</span>
                                                        <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                            style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                            {revivals.totalClaimNotTreated !== undefined && revivals.totalClaimNotTreated !== null ? revivals.totalClaimNotTreated : "-"}
                                                        </span>
                                                    </div>

                                                    <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                        <span className="col-lg-10" style={{ fontWeight: "500" }}>Nbre de réclamations qui ont eu de retour satisfaisant</span>
                                                        <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                            style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                            {revivals.totalClaimSatisfied !== undefined && revivals.totalClaimSatisfied !== null ? revivals.totalClaimSatisfied : "-"}
                                                        </span>
                                                    </div>

                                                    <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                        <span className="col-lg-10" style={{ fontWeight: "500" }}>Temps moyen de traitement d'une réclamation</span>
                                                        <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                            style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                            {revivals.getAverageTimeOfAssignation !== undefined && revivals.getAverageTimeOfAssignation !== null ? parseFloat(revivals.getAverageTimeOfAssignation).toFixed(2) : "-"}
                                                        </span>
                                                    </div>


                                                    </>}
                                                    {isLeadPilot && typeSuivi == "suivi_pilot" && <>
                                                        <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                            <span className="col-lg-10" style={{ fontWeight: "500" }}>Nombre de Réclamations Affectées à ce jour</span>
                                                            <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                                style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                                {revivals.totalClaimAssigned !== undefined && revivals.totalClaimAssigned !== null ? revivals.totalClaimAssigned : "-"}
                                                            </span>
                                                        </div>
                                                        <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                            <span className="col-lg-10" style={{ fontWeight: "500" }}>Nombre de Réclamations déjà Validées à ce jour:</span>
                                                            <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                                style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                                {revivals.totalClaimValidated !== undefined && revivals.totalClaimValidated !== null ? revivals.totalClaimValidated : "-"}
                                                            </span>
                                                        </div>
                                                        <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                            <span className="col-lg-10" style={{ fontWeight: "500" }}>Nombre de Réclamations rejetées à la validation à ce jour</span>
                                                            <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                                style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                                {revivals.totalClaimRejected !== undefined && revivals.totalClaimRejected !== null ? revivals.totalClaimRejected : "-"}
                                                            </span>
                                                        </div>
                                                        {/* Start Performances */}
                                                        <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                            <span className="col-lg-10" style={{ fontWeight: "500" }}>Nombre de Réclamants dont la mesure de satisfaction est fait à ce jour</span>
                                                            <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                                style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                                {revivals.totalClaimSatisfied !== undefined && revivals.totalClaimSatisfied !== null ? revivals.totalClaimSatisfied : "-"}
                                                            </span>
                                                        </div>

                                                        <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                            <span className="col-lg-10" style={{ fontWeight: "500" }}>Temps moyen d'affectation d'une réclamation</span>
                                                            <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                                style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                                {revivals.getAverageTimeOfAssignation !== undefined && revivals.getAverageTimeOfAssignation !== null ? parseFloat(revivals.getAverageTimeOfAssignation).toFixed(2) : "-"}
                                                            </span>
                                                        </div>
                                                        <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                            <span className="col-lg-10" style={{ fontWeight: "500" }}>Temps moyen de validation d'une réclamation</span>
                                                            <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                                style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                                {revivals.getAverageTimeOfValidation !== undefined && revivals.getAverageTimeOfValidation !== null ? parseFloat(revivals.getAverageTimeOfValidation).toFixed(2) : "-"}
                                                            </span>
                                                        </div>
                                                        <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                            <span className="col-lg-10" style={{ fontWeight: "500" }}>Temps moyen de mesure de satisfaction d'un réclamant</span>
                                                            <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                                style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                                {revivals.getAverageTimeOfSatisfaction !== undefined && revivals.getAverageTimeOfSatisfaction !== null ? parseFloat(revivals.getAverageTimeOfSatisfaction).toFixed(2) : "-"}
                                                            </span>
                                                        </div>


                                                    </>}


                                                    {/* Start Collectors */}
                                                    {typeSuivi == "suivi_collector" && <>
                                                    <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                        <span className="col-lg-10" style={{ fontWeight: "500" }}>Nombre de réclamations enregistrées :</span>
                                                        <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                            style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                            {revivals.totalClaimSaved !== undefined && revivals.totalClaimSaved !== null ? revivals.totalClaimSaved : "-"}
                                                        </span>
                                                    </div>

                                                    <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                        <span className="col-lg-10" style={{ fontWeight: "500" }}>Nombre de réclamations reçues pour mesure de satisfaction :</span>
                                                        <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                            style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                            {revivals.claimReceivedForMeasure !== undefined && revivals.claimReceivedForMeasure !== null ? revivals.claimReceivedForMeasure : "-"}
                                                        </span>
                                                    </div>
                                                    <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                        <span className="col-lg-10" style={{ fontWeight: "500" }}>Nombre de réclamations dont la mesure de satisfaction a été effectuée :</span>
                                                        <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                            style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                            {revivals.claimWithMeasureOfSAtisfaction !== undefined && revivals.claimWithMeasureOfSAtisfaction !== null ? revivals.claimWithMeasureOfSAtisfaction : "-"}
                                                        </span>
                                                    </div>

                                                    {/* <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                        <span className="col-lg-10" style={{ fontWeight: "500" }}>Temps moyen pour la mesure de satisfaction d'une réclamation :</span>
                                                        <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                            style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                            {revivals.totalClaimSatisfied !== undefined && revivals.totalClaimSatisfied !== null ? revivals.totalClaimSatisfied : "-"}
                                                        </span>
                                                    </div> */}

                                                    <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                        <span className="col-lg-10" style={{ fontWeight: "500" }}>Nbre de réclamations qui ont eu de retour satisfaisant:</span>
                                                        <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                            style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                            {revivals.claimSatisfied !== undefined && revivals.claimSatisfied !== null ? revivals.claimSatisfied : "-"}
                                                        </span>
                                                    </div>

                                                    <div className="kt-widget6__item row" style={{ padding: "0.5rem 0" }}>
                                                        <span className="col-lg-10" style={{ fontWeight: "500" }}>Nbre de réclamations qui ont eu de retour non satisfaisant :</span>
                                                        <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                            style={{ backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px" }}>
                                                            {revivals.claimUnSatisfied !== undefined && revivals.claimUnSatisfied !== null ? revivals.claimUnSatisfied : "-"}
                                                        </span>
                                                    </div>


                                                    </>}
                                                    {/* End Collectors */}

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

                                    {typeSuivi !== "suivi_collector" && <Select
                                        placeholder={t("Veuillez sélectionner le type de réclamation")}
                                        className="col-sm-6"
                                        size="small"
                                        value={claimCat}
                                        onChange={onChangeClaimCat}
                                        options={typeSuivi == "suivi_unite" ? claimCatsPilot : claimCatsLeadPilot}
                                    />}
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
                                                                <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
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
                                                                    {props.plan === "PRO" ? t("Staff") : t("Institution ciblée")}
                                                                </th>
                                                                <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
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
                                                                revivals?.allClaimAssignedTo?.length ? (
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
                                                                <th rowSpan="1" colSpan="1">{t("Référence")}</th>
                                                                <th rowSpan="1" colSpan="1">{t("Date de réception")}</th>
                                                                <th rowSpan="1" colSpan="1">{t("Réclamant")}</th>
                                                                <th rowSpan="1"
                                                                    colSpan="1">{props.plan === "PRO" ? "Staff" : "Institution ciblée"}</th>
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
        ) : null
    );
};

const mapStateToProps = state => {
    return {
        plan: state.plan.plan,
        userPermissions: state.user.user.permissions,
        //activePilot: state.user.user.staff.is_active_pilot
    };

};


export default connect(mapStateToProps)(RevivalMonitoringPilote);