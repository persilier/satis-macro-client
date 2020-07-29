import React, {useEffect, useState} from "react";
import axios from "axios";
import {loadCss, filterDataTableBySearchValue, forceRound} from "../../helpers/function";
import LoadingTable from "../components/LoadingTable";
import appConfig from "../../config/appConfig";
import Pagination from "../components/Pagination";
import EmptyTable from "../components/EmptyTable";
import ExportButton from "../components/ExportButton";
import HeaderTablePage from "../components/HeaderTablePage";
import InfirmationTable from "../components/InfirmationTable";
import {ERROR_401} from "../../config/errorPage";
import {verifyPermission} from "../../helpers/permission";
import {connect} from "react-redux";

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token');
loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");


const ClaimsArchived = (props) => {
    localStorage.setItem('page', 'ClaimsArchived');
    if (!verifyPermission(props.userPermissions, "list-claim-archived"))
        window.location.href = ERROR_401;

    const [load, setLoad] = useState(true);
    const [claimsArchived, setClaimsArchived] = useState([]);
    const [numberPage, setNumberPage] = useState(0);
    const [showList, setShowList] = useState([]);
    const [numberPerPage, setNumberPerPage] = useState(5);
    const [activeNumberPage, setActiveNumberPage] = useState(0);
    const [search, setSearch] = useState(false);

    useEffect(() => {
        axios.get(appConfig.apiDomaine + "/claim-archived")
            .then(response => {
                setLoad(false);
                setClaimsArchived(response.data);
                setShowList(response.data.slice(0, numberPerPage));
                setNumberPage(forceRound(response.data.length / numberPerPage));
            })
            .catch(error => {
                setLoad(false);
                console.log("Something is wrong");
            })
    }, []);

    const searchElement = async (e) => {
        if (e.target.value) {
            await setSearch(true);
            filterDataTableBySearchValue(e);
        } else {
            await setSearch(true);
            filterDataTableBySearchValue(e);
            setSearch(false);
        }
    };

    const onChangeNumberPerPage = (e) => {
        setActiveNumberPage(0);
        setNumberPerPage(parseInt(e.target.value));
        setShowList(claimsArchived.slice(0, parseInt(e.target.value)));
        setNumberPage(forceRound(claimsArchived.length / parseInt(e.target.value)));
    };

    const getEndByPosition = (position) => {
        let end = numberPerPage;
        for (let i = 0; i < position; i++) {
            end = end + numberPerPage;
        }
        return end;
    };

    const onClickPage = (e, page) => {
        e.preventDefault();
        setActiveNumberPage(page);
        setShowList(claimsArchived.slice(getEndByPosition(page) - numberPerPage, getEndByPosition(page)));
    };

    const onClickNextPage = (e) => {
        e.preventDefault();
        if (activeNumberPage <= numberPage) {
            setActiveNumberPage(activeNumberPage + 1);
            setShowList(
                claimsArchived.slice(
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
                claimsArchived.slice(
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

    const printBodyTable = (archived, index) => {
        return (
            <tr key={index} role="row" className="odd">
                <td>{archived.reference === null ? "" : archived.reference}</td>
                <td>{`${archived.claimer.lastname} ${archived.claimer.firstname}`}</td>
                <td>{archived.description === null ? "" : archived.description}</td>
                <td>{archived.active_treatment.solution === null ? "" : archived.active_treatment.solution}</td>
                <td style={{textAlign: 'center'}}>
                    <a href={`/settings/claim-assign/${archived.id}/detail`}
                       className="btn btn-sm btn-clean btn-icon btn-icon-md"
                       title="Détail">
                        <i className="la la-eye"/>
                    </a>

                </td>
            </tr>
        )
    };


    return (
        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            Paramètres
                        </h3>
                        <span className="kt-subheader__separator kt-hidden"/>
                        <div className="kt-subheader__breadcrumbs">
                            <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                className="flaticon2-shelter"/></a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="#button" onClick={e => e.preventDefault()}
                               className="kt-subheader__breadcrumbs-link">
                                Archivage
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                <InfirmationTable
                    information={"A common UI paradigm to use with interactive tables is to present buttons that will trigger some action. See official documentation"}/>

                <div className="kt-portlet">

                    <HeaderTablePage
                        title={"Réclamations Archivées"}
                    />
                    {
                        load ? (
                            <LoadingTable/>
                        ) : (
                            <div className="kt-portlet__body">
                                <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                    <div className="row">
                                        <div className="col-sm-6 text-left">
                                            <div id="kt_table_1_filter" className="dataTables_filter">
                                                <label>
                                                    Search:
                                                    <input id="myInput" type="text"
                                                           onKeyUp={(e) => searchElement(e)}
                                                           className="form-control form-control-sm"
                                                           placeholder=""
                                                           aria-controls="kt_table_1"/>
                                                </label>
                                            </div>
                                        </div>
                                        <ExportButton/>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <table
                                                className="table table-striped- table-bordered table-hover table-checkable dataTable dtr-inline"
                                                id="myTable" role="grid" aria-describedby="kt_table_1_info"
                                                style={{width: "952px"}}>
                                                <thead>
                                                <tr role="row">

                                                    <th className="sorting" tabIndex="0"
                                                        aria-controls="kt_table_1"
                                                        rowSpan="1"
                                                        colSpan="1" style={{width: "50px"}}
                                                        aria-label="Ship City: activate to sort column ascending">Référence
                                                    </th>
                                                    <th className="sorting" tabIndex="0"
                                                        aria-controls="kt_table_1"
                                                        rowSpan="1"
                                                        colSpan="1" style={{width: "100px"}}
                                                        aria-label="Ship City: activate to sort column ascending">Réclamant
                                                    </th>
                                                    <th className="sorting" tabIndex="0"
                                                        aria-controls="kt_table_1"
                                                        rowSpan="1"
                                                        colSpan="1" style={{width: "150px"}}
                                                        aria-label="Ship City: activate to sort column ascending">Description
                                                    </th>
                                                    <th className="sorting" tabIndex="0"
                                                        aria-controls="kt_table_1"
                                                        rowSpan="1"
                                                        colSpan="1" style={{width: "150px"}}
                                                        aria-label="Ship City: activate to sort column ascending">Solution
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
                                                    claimsArchived.length ? (
                                                        search ? (
                                                            claimsArchived.map((archived, index) => (
                                                                printBodyTable(archived, index)
                                                            ))
                                                        ) : (
                                                            showList.map((archived, index) => (
                                                                printBodyTable(archived, index)
                                                            ))
                                                        )
                                                    ) : (
                                                        <EmptyTable/>
                                                    )
                                                }
                                                </tbody>
                                                <tfoot>
                                                <tr>

                                                </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-5">
                                            <div className="dataTables_info" id="kt_table_1_info" role="status"
                                                 aria-live="polite">Affichage de 1
                                                à {numberPerPage} sur {claimsArchived.length} données
                                            </div>
                                        </div>
                                        {
                                            !search ? (
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
                                            ) : ""
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
};
const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(ClaimsArchived);
