import {useTranslation} from "react-i18next";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import React, {useEffect, useState} from "react";
import axios from "axios";
import appConfig from "../../config/appConfig";
import Select from "react-select";
import {forceRound, formatDateToTime, getLowerCaseString, loadCss, truncateString} from "../../helpers/function";
import {verifyTokenExpire} from "../../middleware/verifyToken";
import {NUMBER_ELEMENT_PER_PAGE} from "../../constants/dataTable";
import HtmlDescription from "../components/DescriptionDetail/HtmlDescription";
import InfirmationTable from "../components/InfirmationTable";
import HeaderTablePage from "../components/HeaderTablePage";
import LoadingTable from "../components/LoadingTable";
import EmptyTable from "../components/EmptyTable";
import HtmlDescriptionModal from "../components/DescriptionDetail/HtmlDescriptionModal";
import Pagination from "../components/Pagination";
import {connect} from "react-redux";
import {ToastBottomEnd} from "../components/Toast";
import {toastSuccessMessageWithParameterConfig} from "../../config/toastConfig";

const RevivalMonitoring = (props) => {

    //usage of useTranslation i18n
    const {t, ready} = useTranslation();


    const defaultData = {
        institution_id: "",
        staff_id: "allStaff",
    };
    const defaultError = {
        institution_targeted_id: [],
        staff_id: [],
    };


    const [load, setLoad] = useState(false);
    const [claims, setClaims] = useState([]);
    const [isLoad, setIsLoad] = useState(true);
    const [data, setData] = useState(defaultData);
    const [revivals, setRevivals] = useState({
        allStaffClaim: [],
        claimAssignedToStaff: "-",
        claimNoTreatedByStaff: "-",
        claimTreatedByStaff: "-"
    });
    const [activeNumberPage, setActiveNumberPage] = useState(1);
    const [numberPage, setNumberPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [numberPerPage, setNumberPerPage] = useState(NUMBER_ELEMENT_PER_PAGE);
    const [showList, setShowList] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [prevUrl, setPrevUrl] = useState(null);
    const [currentMessage, setCurrentMessage] = useState("");
    const [staff, setStaff] = useState({label: "Tous les staffs" , value : "allStaff"});
    const [staffs, setStaffs] = useState([]);
    const [error, setError] = useState(defaultError);
    const [loadFilter, setLoadFilter] = useState(false);



    const fetchData = async (click = false) => {
        setLoadFilter(true);
        setLoad(true);
        let endpoint = "";
        let sendData = {};

        endpoint = `${appConfig.apiDomaine}/my/monitoring-by-staff?size=${numberPerPage}`;
        sendData = {
            staff_id: data.staff_id ? data.staff_id : ""
        };
        if (!data.staff_id)
            delete sendData.staff_id;

        await axios.post(endpoint, sendData)
            .then(response => {
                console.log(response.data)
                const newRevivals = {...revivals};
                if (click)
                    ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig(ready ? t("Filtre effectué avec succès") : ""));
                newRevivals.allStaffClaim = response.data.allStaffClaim.data ? response.data.allStaffClaim.data : [];
                newRevivals.claimAssignedToStaff = response.data.claimAssignedToStaff;
                newRevivals.claimNoTreatedByStaff = response.data.claimNoTreatedByStaff;
                newRevivals.claimTreatedByStaff = response.data.claimTreatedByStaff;

                setNumberPage(forceRound(response.data.allStaffClaim.total/numberPerPage));
                setShowList(response.data.allStaffClaim.data.slice(0, numberPerPage));
                setTotal(response.data.allStaffClaim.total);
                setPrevUrl(response.data.allStaffClaim["prev_page_url"]);
                setNextUrl(response.data.allStaffClaim["next_page_url"]);

                setRevivals(newRevivals);
                setError(defaultError);

                setLoadFilter(false);
                setLoad(false);
            //    setStaff("")
            })
            .catch(error => {
                setError({
                    ...defaultError,
                    ...error.response.data.error
                });
                setLoadFilter(false);
                setLoad(false);
                console.log("Something is wrong");
            })
        ;
    };


    const filterReporting = () => {
        setLoadFilter(true);
        setLoad(true);
        if (verifyTokenExpire())
            fetchData(true);
    };


    useEffect(() => {
        async function fetchData() {
            axios.get(`${appConfig.apiDomaine}/my/unit-staff`)
                .then(response => {
                   /* setNumberPage(forceRound(response.data.length / numberPerPage));
                    setShowList(response.data.slice(0, numberPerPage));*/

                    setLoad(false);
                    setIsLoad(false);
                    for (let i = 0; i < response.data.staffs.length ; i ++) {
                        response.data.staffs[i].label= response.data.staffs[i].identite.firstname + " " + response.data.staffs[i].identite.lastname;
                        response.data.staffs[i].value= response.data.staffs[i].id;
                    }
                    response.data.staffs.unshift(
                        {
                            label: "Tous les staffs" , value : "allStaff"
                        }
                    )

                    setStaffs(response.data.staffs);
                    filterReporting();
                })
                .catch(error => {
                    setLoad(false);
                    setIsLoad(false);
                    console.log("Something is wrong");
                })
            ;
            axios.post(`${appConfig.apiDomaine}/my/monitoring-by-staff?size=${numberPerPage}`)
                .then(response => {
                    console.log(response.data)
                    const newRevivals = {...revivals};
                    newRevivals.allStaffClaim = response.data.allStaffClaim.data ? response.data.allStaffClaim.data : [];
                    newRevivals.claimAssignedToStaff = response.data.claimAssignedToStaff;
                    newRevivals.claimNoTreatedByStaff = response.data.claimNoTreatedByStaff;
                    newRevivals.claimTreatedByStaff = response.data.claimTreatedByStaff;

                    setNumberPage(forceRound(response.data.allStaffClaim.total/numberPerPage));
                    setShowList(response.data.allStaffClaim.data.slice(0, numberPerPage));
                    setTotal(response.data.allStaffClaim.total);
                    setPrevUrl(response.data.allStaffClaim["prev_page_url"]);
                    setNextUrl(response.data.allStaffClaim["next_page_url"]);

                    setRevivals(newRevivals);
                    setError(defaultError);
                    setLoadFilter(false);
                    setLoad(false);
                    setIsLoad(false);

                })
                .catch(error => {
                    setLoad(false);
                    setIsLoad(false);
                    console.log("Something is wrong");
                })
            ;
        }

        if (verifyTokenExpire())
            fetchData();
    }, [numberPerPage])
    ;

    const filterShowListBySearchValue = (value) => {
        value = getLowerCaseString(value);
        let newRevivals = [...revivals];
        newRevivals = newRevivals.filter(el => {
            return (
                getLowerCaseString(el.reference).indexOf(value) >= 0 ||
                getLowerCaseString(`${(el.claimer && el.claimer.lastname) ? el.claimer.lastname : ''} ${(el.claimer && el.claimer.firstname) ? el.claimer.firstname : ''}  ${el.account_targeted ? " / "+el.account_targeted.number : (el.account_number ? " / " + el.account_number : "")}`).indexOf(value) >= 0 ||
                getLowerCaseString(formatDateToTime(el.created_at)).indexOf(value) >= 0 ||
                getLowerCaseString( el.claim_object ? el.claim_object.name["fr"] : "").indexOf(value) >= 0 ||
                getLowerCaseString(truncateString(el.description, 41)).indexOf(value) >= 0 ||
                getLowerCaseString(props.plan === "PRO" ? el.unit_targeted ? el.unit_targeted.name["fr"] : "-" : (el.institution_targeted ? el.institution_targeted.name : "")).indexOf(value) >= 0
            )
        });

        return newRevivals;
    };

    const searchElement = async (e) => {
        if (e.target.value) {
            setNumberPage(forceRound(filterShowListBySearchValue(e.target.value).length / NUMBER_ELEMENT_PER_PAGE));
            setShowList(filterShowListBySearchValue(e.target.value.toLowerCase()).slice(0, NUMBER_ELEMENT_PER_PAGE));
        } else {
            setNumberPage(forceRound(revivals.length / NUMBER_ELEMENT_PER_PAGE));
            setShowList(revivals.slice(0, NUMBER_ELEMENT_PER_PAGE));
            setActiveNumberPage(1);
        }
    };

    const onChangeNumberPerPage = (e) => {
        e.persist();
        setNumberPerPage(parseInt(e.target.value));
    };

    const getEndByPosition = (position) => {
        let end = numberPerPage;
        for (let i = 1; i < position; i++) {
            end = end + numberPerPage;
        }
        return end;
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

    const arrayNumberPage = () => {
        const pages = [];
        for (let i = 0; i < numberPage; i++) {
            pages[i] = i;
        }
        return pages
    };

    const pages = arrayNumberPage();

    const onChangeStaff = (selected) => {
        let staffToSend = selected?.id ?? selected?.value
        const newData = {...data};
        newData.staff_id = staffToSend;
        setStaff(selected);
        setData(newData);
    };


    const showModal = (message) => {
        setCurrentMessage(message);
        document.getElementById("button_modal").click();
    };

    const printBodyTable = (revival, index) => {
        console.log(revival);
        return (
            <tr key={index} role="row" className="odd">
                <td>{revival.reference}</td>
                <td>
                    {formatDateToTime(revival.created_at)}
                </td>
                <td>{`${(revival.claimer && revival.claimer.lastname) ? revival.claimer.lastname : ''} ${(revival.claimer && revival.claimer.firstname) ? revival.claimer.firstname : ''} `}</td>
                <td>{`${(revival?.active_treatment?.responsible_staff?.identite?.lastname) ? revival.active_treatment.responsible_staff.identite.lastname : ''} ${revival?.active_treatment?.responsible_staff?.identite?.lastname ? revival.active_treatment.responsible_staff.identite.lastname : ''} `}</td>
                <td>{formatDateToTime(revival.active_treatment.assigned_to_staff_at)}</td>
                <td>{ revival.claim_object ? revival.claim_object.name["fr"] : ""}</td>
              {/*  <td style={{textAlign: 'center'}}>
                    <HtmlDescription onClick={() => showModal(revival.description ? revival.description : '-')}/>
                </td>*/}
                <td>{revival.status}</td>
                <td>
                    <a href={`/monitoring/claims/staff/${revival?.id}/detail`}
                       className="btn btn-sm btn-clean btn-icon btn-icon-md" title={t("Détails")}>
                        <i className="la la-eye"/>
                    </a>
                </td>
            </tr>
        );
    };

    return (
        ready ? ( verifyPermission(props.userPermissions, 'show-my-staff-monitoring') ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                {t("Processus")}
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()}
                                   className="kt-subheader__breadcrumbs-link" style={{cursor: "text"}}>
                                    {t("Traitement")}
                                </a>
                                <span className="kt-subheader__separator kt-hidden"/>
                                <div className="kt-subheader__breadcrumbs">
                                    <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                        className="flaticon2-shelter"/></a>
                                    <span className="kt-subheader__breadcrumbs-separator"/>
                                    <a href="#button" onClick={e => e.preventDefault()}
                                       className="kt-subheader__breadcrumbs-link" style={{cursor: "text"}}>
                                        {t("Suivi des réclammations relancées")}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <InfirmationTable information={(
                        <div>
                            {t("Cette page présente la liste des suivis des réclamations relancées")}
                        </div>
                    )}/>

                    <div className="kt-portlet">
                        <HeaderTablePage
                            title={t("Suivi des relances")}
                        />

                        {
                            load ? (
                                <LoadingTable/>
                            ) : (
                                <div className="kt-portlet__body">
                                    <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">

                                        <div className="m-auto col-xl-4 col-lg-12 order-lg-3 order-xl-1">
                                            <div className="" style={{marginBottom: "30px"}}>
                                                <div className="kt-portlet__body" style={{padding: "10px 25px"}}>
                                                    <div className="kt-widget6">
                                                        <div className="kt-widget6__body">
                                                            <div className={error.staff_id.length ? "form-group validated kt-widget6__item row" : "form-group kt-widget6__item row"} style={{padding: "0.5rem 0"}}>
                                                                <div className="col-lg-1" style={{fontWeight: "500"}}>Agents</div>
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



                                        <div className="text-center m-auto col-xl-4 col-lg-7 order-lg-3 order-xl-1">
                                            <div className="kt-portlet kt-portlet--height-fluid" style={{marginBottom: "30px"}}>
                                                <div className="kt-portlet__body" style={{padding: "10px 25px"}}>
                                                    <div className="kt-widget6">
                                                        <div className="kt-widget6__body">
                                                            <div className="kt-widget6__item row" style={{padding: "0.5rem 0"}}>
                                                                <span className="col-lg-10"  style={{fontWeight: "500"}}>Nombre de plaintes affectées à ce jour</span>
                                                                <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                                      style={{backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px"}}>
                                                                    { revivals.claimAssignedToStaff !== undefined && revivals.claimAssignedToStaff !== null ? revivals.claimAssignedToStaff: "-"}
                                                                </span>
                                                            </div>
                                                            <div className="kt-widget6__item row"  style={{padding: "0.5rem 0"}}>
                                                                <span className="col-lg-10" style={{fontWeight: "500"}}>Nombre de plaintes déjà traitées à ce jour</span>
                                                                <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                                      style={{backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px"}}>
                                                                    { revivals.claimNoTreatedByStaff !== undefined && revivals.claimNoTreatedByStaff !== null ? revivals.claimNoTreatedByStaff: "-"}
                                                                </span>
                                                            </div>
                                                            <div className="kt-widget6__item row"  style={{padding: "0.5rem 0"}}>
                                                                <span className="col-lg-10" style={{fontWeight: "500"}}>Nombre de plaintes restantes à traiter à ce jour</span>
                                                                <span className="col-lg-2 kt-font-brand kt-font-bold"
                                                                      style={{backgroundColor: "rgba(93, 120, 255, 0.1)", padding: "7px", textAlign: "center", borderRadius: "3px"}}>
                                                                     { revivals.claimTreatedByStaff !== undefined && revivals.claimTreatedByStaff !== null ? revivals.claimTreatedByStaff: "-"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-sm-6 text-left">
                                                <div id="kt_table_1_filter" className="dataTables_filter">
                                                    <label>
                                                        {t("Recherche")}:
                                                        <input id="myInput" type="text"
                                                               onKeyUp={(e) => searchElement(e)}
                                                               className="form-control form-control-sm" placeholder=""
                                                               aria-controls="kt_table_1"/>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-sm-12">
                                                <table
                                                    className="table table-striped table-bordered table-hover table-checkable dataTable dtr-inline"
                                                    id="myTable" role="grid" aria-describedby="kt_table_1_info"
                                                    style={{width: "100%"}}>
                                                    <thead>
                                                    <tr role="row">
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                            rowSpan="1" colSpan="1" style={{width: "70.25px"}}
                                                            aria-label="Country: activate to sort column ascending">
                                                            {t("Référence")}
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                            rowSpan="1" colSpan="1" style={{width: "70.25px"}}
                                                            aria-label="Country: activate to sort column ascending">
                                                            {t("Date de réception")}
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                            rowSpan="1" colSpan="1" style={{width: "70.25px"}}
                                                            aria-label="Country: activate to sort column ascending">
                                                            {t("Réclamant")}
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                            rowSpan="1" colSpan="1" style={{width: "70.25px"}}
                                                            aria-label="Country: activate to sort column ascending">
                                                            {props.plan === "PRO" ? t("Staff") : t("Institution ciblée")}
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                            rowSpan="1" colSpan="1" style={{width: "70.25px"}}
                                                            aria-label="Country: activate to sort column ascending">
                                                            {t("Date affectation")}
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                            rowSpan="1" colSpan="1" style={{width: "70.25px"}}
                                                            aria-label="Country: activate to sort column ascending">
                                                            {t("Objet de réclamation")}
                                                        </th>
                                                     {/*   <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                            rowSpan="1" colSpan="1" style={{width: "70.25px"}}
                                                            aria-label="Country: activate to sort column ascending">
                                                            {t("Description")}
                                                        </th>*/}
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                            rowSpan="1" colSpan="1" style={{width: "70.25px"}}
                                                            aria-label="Country: activate to sort column ascending">
                                                            {t("Statut")}
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                            rowSpan="1" colSpan="1" style={{width: "40.25px"}}
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
                                                                <EmptyTable search={true}/>
                                                            )
                                                        ) : (
                                                            <EmptyTable/>
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
                                                <button id="button_modal" type="button" className="btn btn-secondary btn-icon-sm d-none" data-toggle="modal" data-target="#message_email"/>
                                                <HtmlDescriptionModal title={t("Description")} message={currentMessage}/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-5">
                                                <div className="dataTables_info" id="kt_table_1_info" role="status"
                                                     aria-live="polite">{t("Affichage de")} 1
                                                    {t("à")} {numberPerPage} {t("sur")} {revivals.length} {t("données")}
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
                                    </div>
                                </div>
                            )
                        }
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
        activePilot: state.user.user.staff.is_active_pilot === null
    };
};

export default connect(mapStateToProps)(RevivalMonitoring);