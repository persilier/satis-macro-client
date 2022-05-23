import React, {useEffect, useState} from "react";
import {forceRound, formatDateToTimeStampte, loadCss} from "../../helpers/function";
import {connect} from "react-redux";
import {useTranslation} from "react-i18next";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import HeaderTablePage from "../components/HeaderTablePage";
import LoadingTable from "../components/LoadingTable";
import EmptyTable from "../components/EmptyTable";
import HtmlDescriptionModal from "../components/DescriptionDetail/HtmlDescriptionModal";
import {NUMBER_ELEMENT_PER_PAGE} from "../../constants/dataTable";
import Pagination from "../components/Pagination";
import Select from "react-select";
import {getHistoricRevivals, getStaffs} from "../../http/crud";
import HtmlDescription from "../components/DescriptionDetail/HtmlDescription";
import RelaunchModal from "../components/RelaunchModal";

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const HistoricRevivals = (props) => {
    //usage of useTranslation i18n
    const {t, ready} = useTranslation();

    document.title = "Satis client - " + (ready ? t("Paramètre Historique") : "");

    if (!verifyPermission(props.userPermissions, "list-unit-revivals") || !verifyPermission(props.userPermissions, "list-staff-revivals")) {
        window.location.href = ERROR_401;
    }

    const [load, setLoad] = useState(false);
    const [loadSelect, setLoadSelect] = useState(false);
    const [loadButton, setLoadButton] = useState(false);
    const [revivals, setRevivals] = useState([]);
    const [staff, setStaff] = useState(null);
    const [staffs, setStaffs] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [numberPerPage, setNumberPerPage] = useState(NUMBER_ELEMENT_PER_PAGE);
    const [activeNumberPage, setActiveNumberPage] = useState(1);
    const [numberPage, setNumberPage] = useState(0);
    const [showList, setShowList] = useState([]);
    const [total, setTotal] = useState(0);
    const [nextUrl, setNextUrl] = useState(null);
    const [prevUrl, setPrevUrl] = useState(null);

    useEffect(() => {
        setLoad(true);
        getStaffs(props.userPermissions)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error.message);
            })
        getHistoricRevivals(props.userPermissions, numberPerPage, activeNumberPage, props.user.staff.is_lead === true ? null : props.user.staff.id)
            .then(response => {
               console.log(response.data.data);
                setNumberPage(forceRound(response.data.total/numberPerPage));
                setShowList(response.data.data.slice(0, numberPerPage));
                setRevivals(response.data["data"]);
                setTotal(response.data.total);
                setPrevUrl(response.data["prev_page_url"]);
                setNextUrl(response.data["next_page_url"]);
            })
            .catch(error => {
                console.error(error.message);
            })
            .finally(() => setLoad(false));

    }, [numberPerPage, activeNumberPage]);

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

    const showModal = (message) => {
        setCurrentMessage(message);
        document.getElementById("button_modal").click();
    };

    const printBodyTable = (revival, index) => {
        return (
            <tr key={index} role="row" className="odd">
                <td>
                    {
                        revival?.claim?.reference ? revival.claim.reference : ""
                    }
                </td>
                <td>
                    {
                        `${revival?.created_by?.identite?.firstname ? revival.created_by.identite.firstname : ""} ${revival?.created_by?.identite?.lastname ? revival.created_by.identite.lastname : ""}`
                    }
                </td>
                <td>
                    {
                        formatDateToTimeStampte(revival.created_at)
                    }
                </td>
                <td>
                    {
                        revival?.claim_status ? revival.claim_status : ""
                    }
                </td>
                <td>
                    {
                        `${revival?.staff?.identite?.firstname ? revival.staff.identite.firstname : ""} ${revival?.staff?.identite?.lastname ? revival.staff.identite.lastname : ""}`

                    }
                </td>
                <td>
                    {
                        revival?.status ? revival.status : ""
                    }
                </td>
                <td>
                    {
                        revival?.claim?.status ? revival.claim.status : ""
                    }
                </td>
                <td style={{textAlign: 'center'}}>
                    <HtmlDescription onClick={() => showModal(revival?.message ? revival.message : "-")}/>
                </td>
                <td>
                    {
                        verifyPermission(props.userPermissions, "revive-staff") ? (
                        <>
                            <a type="button" data-keyboard="false" data-backdrop="static" data-toggle="modal" data-target="#kt_modal_4"
                               className={`btn btn-sm btn-clean btn-icon btn-icon-md ${revival?.status === "considered" && "disabled"}`}

                               title={t("Relancer")}
                            >
                                <i className="la la-bullhorn"/>
                            </a>
                            <RelaunchModal id={revival?.claim?.id ? revival.claim.id : ''} onClose={() => {}}/>
                        </>

                        ) : null
                    }
                    {
                        /*verifyPermission(props.userPermissions, "assignment-claim-awaiting-treatment") ? (*/
                            <a href={`/monitoring/claims/staff/${revival?.claim?.id}/detail`}
                               className="btn btn-sm btn-clean btn-icon btn-icon-md"
                               title={t("Détails")}>
                                <i className="la la-eye"/>
                            </a>
                        /*) : null*/
                    }
                </td>

            </tr>
        )
    }

    return (
        ready ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">

                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                {t("Historiques")}
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()}
                                   className="kt-subheader__breadcrumbs-link">
                                    {t("Relances")}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <div className="kt-portlet">
                        <HeaderTablePage
                            title={t("Relances")}
                        />

                        <div className="kt-portlet__body">
                                    <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">


                                        <div className="text-center m-auto col-xl-4 col-lg-12 order-lg-3 order-xl-1">
                                            <div className="" style={{marginBottom: "30px"}}>
                                                <div className="kt-portlet__body" style={{padding: "10px 25px"}}>
                                                    <div className="kt-widget6">
                                                        <div className="kt-widget6__body">
                                                            <div className="kt-widget6__item row" style={{padding: "0.5rem 0"}}>
                                                                <div className="col-lg-1">Agent</div>
                                                                <div className={"col-lg-9"}>
                                                                    <Select
                                                                        value={staff}
                                                                        isClearable
                                                                        placeholder={"Veuillez sélectionner un agent"}
                                                                        options={staffs}
                                                                    />
                                                                                                                    {
           /*                                         error.unit_targeted_id.length ? (
                                                        error.unit_targeted_id.map((error, index) => (
                                                            <div key={index}
                                                                 className="invalid-feedback">
                                                                {error}
                                                            </div>
                                                        ))
                                                    ) : null*/
                                                }
                                                                </div>
                                                                <div className="col-lg-2">
                                                                    <button type="submit" onClick={(e) => console.log(e)} className="btn btn-primary">{t("Filtrer")}</button>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            load ? <LoadingTable/> : (
                                                <>
                                                    <div className="row">
                                                        <div className="col-sm-6 text-left">
                                                            <div id="kt_table_1_filter" className="dataTables_filter">
                                                                <label>
                                                                    {t("Recherche")}:
                                                                    <input id="myInput" type="text"
                                                                        /* onKeyUp={(e) => searchElement(e)}*/
                                                                           className="form-control form-control-sm"
                                                                           placeholder=""
                                                                           aria-controls="kt_table_1"
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className="row">
                                                        <div className="col-sm-12">
                                                            <table
                                                                className="table table-striped table-bordered table-hover table-checkable dataTable dtr-inline"
                                                                id="myTable" role="grid" aria-describedby="kt_table_1_info"
                                                                style={{width: "952px"}}>
                                                                <thead>
                                                                <tr role="row">
                                                                    <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                                        rowSpan="1"
                                                                        colSpan="1" style={{width: "70.25px"}}
                                                                        aria-label="Country: activate to sort column ascending">{t("Référence")}
                                                                    </th>
                                                                    <th className="sorting" tabIndex="0"
                                                                        aria-controls="kt_table_1"
                                                                        rowSpan="1"
                                                                        colSpan="1" style={{width: "80px"}}
                                                                        aria-label="Country: activate to sort column ascending">{t("Expéditeur")}
                                                                    </th>
                                                                    <th className="sorting" tabIndex="0"
                                                                        aria-controls="kt_table_1"
                                                                        rowSpan="1"
                                                                        colSpan="1" style={{width: "120px"}}
                                                                        aria-label="Country: activate to sort column ascending">{t("Date de relance")}
                                                                    </th>
                                                                    <th className="sorting" tabIndex="0"
                                                                        aria-controls="kt_table_1"
                                                                        rowSpan="1"
                                                                        colSpan="1" style={{width: "150px"}}
                                                                        aria-label="Country: activate to sort column ascending">{t("Statut avant relance")}
                                                                    </th>
                                                                    <th className="sorting" tabIndex="0"
                                                                        aria-controls="kt_table_1"
                                                                        rowSpan="1"
                                                                        colSpan="1" style={{width: "70.25px"}}
                                                                        aria-label="Country: activate to sort column ascending">
                                                                        {t("Staff relancé")}

                                                                    </th>

                                                                    <th className="sorting" tabIndex="0"
                                                                        aria-controls="kt_table_1"
                                                                        rowSpan="1"
                                                                        colSpan="1" style={{width: "150px"}}
                                                                        aria-label="Ship City: activate to sort column ascending">{t("Statut de la relance")}
                                                                    </th>

                                                                    <th className="sorting" tabIndex="0"
                                                                        aria-controls="kt_table_1"
                                                                        rowSpan="1"
                                                                        colSpan="1" style={{width: "50px"}}
                                                                        aria-label="Ship City: activate to sort column ascending">{t("Statut actuel")}
                                                                    </th>

                                                                    <th className="sorting" tabIndex="0"
                                                                        aria-controls="kt_table_1"
                                                                        rowSpan="1"
                                                                        colSpan="1" style={{width: "50px"}}
                                                                        aria-label="Ship City: activate to sort column ascending">{t("Message")}
                                                                    </th>


                                                                    <th className="sorting" tabIndex="0"
                                                                        aria-controls="kt_table_1"
                                                                        rowSpan="1" colSpan="1" style={{width: "70.25px"}}
                                                                        aria-label="Type: activate to sort column ascending">
                                                                        {t("Action")}
                                                                    </th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {
                                                                    revivals.length ? (
                                                                        showList ? (
                                                                            showList.map((revival, index) => (
                                                                                printBodyTable(revival, index)
                                                                            ))
                                                                        ) : (
                                                                            <EmptyTable search={true}/>
                                                                        )
                                                                    ) : (<EmptyTable/>)
                                                                }
                                                                </tbody>
                                                                <tfoot>
                                                                <tr style={{textAlign:"center"}}>
                                                                    <th rowSpan="1" colSpan="1">{t("Référence")}</th>
                                                                    <th rowSpan="1" colSpan="1">{t("Expéditeur")}</th>
                                                                    <th rowSpan="1" colSpan="1">{t("Date de relance")}</th>
                                                                    <th rowSpan="1" colSpan="1">{t("Statut avant relance")}</th>
                                                                    <th rowSpan="1" colSpan="1">{t("Staff relancé")}</th>
                                                                    <th rowSpan="1" colSpan="1">{t("Statut de la relance")}</th>
                                                                    <th rowSpan="1" colSpan="1">{t("Statut actuel")}</th>
                                                                    <th rowSpan="1" colSpan="1">{t("Message")}</th>
                                                                    <th rowSpan="1" colSpan="1">{t("Action")}</th>
                                                                </tr>
                                                                </tfoot>
                                                            </table>
                                                            <button id="button_modal" type="button" className="btn btn-secondary btn-icon-sm d-none" data-toggle="modal" data-target="#message_email"/>
                                                            <HtmlDescriptionModal title={"Message"} message={currentMessage}/>

                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-5">
                                                            <div className="dataTables_info" id="kt_table_1_info" role="status"
                                                                 aria-live="polite">{t("Affichage de")} 1
                                                                {t("à")} {showList.length} {t("sur")} {total} {t("données")}
                                                            </div>
                                                        </div>

                                                        {
                                                            showList.length ? (
                                                                <div className="col-sm-12 col-md-7 dataTables_pager">
                                                                    <Pagination
                                                                        numberPerPage={numberPerPage}
                                                                        onChangeNumberPerPage={onChangeNumberPerPage}
                                                                        activeNumberPage={activeNumberPage}
                                                                        onClickPage={(e, number) => onClickPage(e, number)}
                                                                        onClickPreviousPage={e => onClickPreviousPage(e)}
                                                                        onClickNextPage={e => onClickNextPage(e)}
                                                                        numberPage={numberPage}
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

}

const mapStateToProps = (state) => {
    return {
        plan: state.plan.plan,
        userPermissions: state.user.user.permissions,
        user: state.user.user
    };
};

export default connect(mapStateToProps)(HistoricRevivals);
