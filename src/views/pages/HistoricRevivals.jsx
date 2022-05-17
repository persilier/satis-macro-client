import React, {useEffect, useState} from "react";
import {forceRound, loadCss} from "../../helpers/function";
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

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const HistoricRevivals = (props) => {
    //usage of useTranslation i18n
    const {t, ready} = useTranslation();

    document.title = "Satis client - " + (ready ? t("Paramètre Historique") : "");

    if (!verifyPermission(props.userPermissions, "history-list-treat-claim")) {
        window.location.href = ERROR_401;
    }

    const [load, setLoad] = useState(false);
    const [revivals, setRevivals] = useState([]);
    const [numberPage, setNumberPage] = useState(0);
    const [showList, setShowList] = useState([]);
    const [numberPerPage, setNumberPerPage] = useState(NUMBER_ELEMENT_PER_PAGE);
    const [activeNumberPage, setActiveNumberPage] = useState(1);

    const onChangeNumberPerPage = (e) => {
        setActiveNumberPage(1);
        setNumberPerPage(parseInt(e.target.value));
        setShowList(revivals.slice(0, parseInt(e.target.value)));
        setNumberPage(forceRound(revivals.length / parseInt(e.target.value)));
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
        setShowList(revivals.slice(getEndByPosition(page) - numberPerPage, getEndByPosition(page)));
    };

    const onClickNextPage = (e) => {
        e.preventDefault();
        if (activeNumberPage <= numberPage) {
            setActiveNumberPage(activeNumberPage + 1);
            setShowList(
                revivals.slice(
                    getEndByPosition(
                        activeNumberPage + 1) - numberPerPage,
                    getEndByPosition(activeNumberPage + 1)
                )
            );
        }
    };

    const onClickPreviousPage = (e) => {
        e.preventDefault();
        if (activeNumberPage >= 1) {
            setActiveNumberPage(activeNumberPage - 1);
            setShowList(
                revivals.slice(
                    getEndByPosition(activeNumberPage - 1) - numberPerPage,
                    getEndByPosition(activeNumberPage - 1)
                )
            );
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

                        {
                            load ? (
                                <LoadingTable/>
                            ) : (
                                <div className="kt-portlet__body">
                                    <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">


                                        <div className="text-center m-auto col-xl-4 col-lg-12 order-lg-3 order-xl-1">
                                            <div className="" style={{marginBottom: "30px"}}>
                                                <div className="kt-portlet__body" style={{padding: "10px 25px"}}>
                                                    <div className="kt-widget6">
                                                        <div className="kt-widget6__body">
                                                            <div className="kt-widget6__item row" style={{padding: "0.5rem 0"}}>
                                                                <div className="col-lg-1">Label</div>
                                                                <div className={"col-lg-9"}>
                                                                    <Select
                                                                        value={null}
                                                                        isClearable
                                                                        placeholder={"Veuillez"}
                                                                        options={[]}
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
                                                            aria-label="Country: activate to sort column ascending">{t("Date")}
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            rowSpan="1"
                                                            colSpan="1" style={{width: "100px"}}
                                                            aria-label="Country: activate to sort column ascending">{t("Agent")}
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            rowSpan="1"
                                                            colSpan="1" style={{width: "150px"}}
                                                            aria-label="Country: activate to sort column ascending">{t("Message")}
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            rowSpan="1"
                                                            colSpan="1" style={{width: "70.25px"}}
                                                            aria-label="Country: activate to sort column ascending">
                                                            {t("Expéditeur")}

                                                        </th>

                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            rowSpan="1"
                                                            colSpan="1" style={{width: "50px"}}
                                                            aria-label="Ship City: activate to sort column ascending">{t("Statut")}
                                                        </th>

                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            rowSpan="1"
                                                            colSpan="1" style={{width: "50px"}}
                                                            aria-label="Ship City: activate to sort column ascending">{t("Statut de la plainte")}
                                                        </th>

                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            rowSpan="1"
                                                            colSpan="1" style={{width: "50px"}}
                                                            aria-label="Ship City: activate to sort column ascending">{t("Statut de la relance")}
                                                        </th>

                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            rowSpan="1" colSpan="1" style={{width: "70.25px"}}
                                                            aria-label="Type: activate to sort column ascending">
                                                            Action
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        (
                                                            <EmptyTable/>
                                                        )
                                                    }
                                                    </tbody>
                                                    <tfoot>
                                                    <tr style={{textAlign:"center"}}>
                                                        <th rowSpan="1" colSpan="1">{t("Référence")}</th>
                                                        <th rowSpan="1" colSpan="1">{t("Date")}</th>
                                                        <th rowSpan="1" colSpan="1">{t("Agent")}</th>
                                                        <th rowSpan="1" colSpan="1">{t("Message")}</th>
                                                        <th rowSpan="1" colSpan="1">{t("Expéditeur")}</th>
                                                        <th rowSpan="1" colSpan="1">{t("Statut")}</th>
                                                        <th rowSpan="1" colSpan="1">{t("Statut de la plainte")}</th>
                                                        <th rowSpan="1" colSpan="1">{t("Statut de la relance")}</th>
                                                        <th rowSpan="1" colSpan="1">{t("Action")}</th>
                                                    </tr>
                                                    </tfoot>
                                                </table>
{/*                                                <button id="button_modal" type="button" className="btn btn-secondary btn-icon-sm d-none" data-toggle="modal" data-target="#message_email"/>
                                                <HtmlDescriptionModal title={"Description"} message={currentMessage}/>*/}
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
                                                            pages={pages}
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
        ) : null
    );

}

const mapStateToProps = (state) => {
    return {
        plan: state.plan.plan,
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(HistoricRevivals);
