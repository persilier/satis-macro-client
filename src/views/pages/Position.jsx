import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Link
} from "react-router-dom";
import {connect} from "react-redux"
import {filterDataTableBySearchValue, forceRound, loadCss} from "../../helpers/function";
import LoadingTable from "../components/LoadingTable";
import {ToastBottomEnd} from "../components/Toast";
import {toastDeleteErrorMessageConfig, toastDeleteSuccessMessageConfig} from "../../config/toastConfig";
import {DeleteConfirmation} from "../components/ConfirmationAlert";
import {confirmDeleteConfig} from "../../config/confirmConfig";
import appConfig from "../../config/appConfig";
import Pagination from "../components/Pagination";
import EmptyTable from "../components/EmptyTable";
import ExportButton from "../components/ExportButton";
import HeaderTablePage from "../components/HeaderTablePage";
import InfirmationTable from "../components/InfirmationTable";
import {ERROR_401} from "../../config/errorPage";
import {verifyPermission} from "../../helpers/permission";

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");
axios.defaults.headers.common['Authorization'] = "Bearer "+localStorage.getItem('token');

const Position = (props) => {
    if (!verifyPermission(props.userPermissions, "list-position"))
        window.location.href = ERROR_401;

    const [load, setLoad] = useState(true);
    const [positions, setPositions] = useState([]);
    const [numberPerPage, setNumberPerPage] = useState(2);
    const [activeNumberPage, setActiveNumberPage] = useState(0);
    const [search, setSearch] = useState(false);
    const [numberPage, setNumberPage] = useState(0);
    const [showList, setShowList] = useState([]);

    useEffect(() => {
        axios.get(`${appConfig.apiDomaine}/positions`)
            .then(response => {
                setLoad(false);
                setNumberPage(forceRound(response.data.length/numberPerPage));
                setShowList(response.data.slice(0, numberPerPage));
                setPositions(response.data);
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
        setShowList(positions.slice(0, parseInt(e.target.value)));
        setNumberPage(forceRound(positions.length/parseInt(e.target.value)));
    };

    const getEndByPosition = (position) => {
        let end = numberPerPage;
        for (let i = 0; i<position; i++) {
            end = end+numberPerPage;
        }
        return end;
    };

    const onClickPage = (e, page) => {
        e.preventDefault();
        setActiveNumberPage(page);
        setShowList(positions.slice(getEndByPosition(page) - numberPerPage, getEndByPosition(page)));
    };

    const onClickNextPage = (e) => {
        e.preventDefault();
        if (activeNumberPage <= numberPage) {
            setActiveNumberPage(activeNumberPage + 1);
            setShowList(
                positions.slice(
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
                positions.slice(
                    getEndByPosition(activeNumberPage - 1) - numberPerPage,
                    getEndByPosition(activeNumberPage - 1)
                )
            );
        }
    };

    const deletePosition = (positionId, index) => {
        DeleteConfirmation.fire(confirmDeleteConfig)
            .then((result) => {
                if (result.value) {
                    axios.delete(`${appConfig.apiDomaine}/positions/${positionId}`)
                        .then(response => {
                            const newPositions = [...positions];
                            newPositions.splice(index, 1);
                            setPositions(newPositions);
                            if (showList.length > 1) {
                                setShowList(
                                    newPositions.slice(
                                        getEndByPosition(activeNumberPage) - numberPerPage,
                                        getEndByPosition(activeNumberPage)
                                    )
                                );
                            } else {
                                setShowList(
                                    newPositions.slice(
                                        getEndByPosition(activeNumberPage - 1) - numberPerPage,
                                        getEndByPosition(activeNumberPage - 1)
                                    )
                                );
                            }
                            ToastBottomEnd.fire(toastDeleteSuccessMessageConfig);
                        })
                        .catch(error => {
                            ToastBottomEnd.fire(toastDeleteErrorMessageConfig);
                        })
                    ;
                }
            })
        ;
    };

    const arrayNumberPage = () => {
        const pages = [];
        for (let i = 0; i < numberPage; i++) {
            pages[i] = i;
        }
        return pages
    };

    const pages = arrayNumberPage();

    const printBodyTable = (position, index) => {
        return (
            <tr className="d-flex justify-content-center align-content-center odd" key={index} role="row" className="odd">
                <td>{position.name["fr"]}</td>
                <td style={{ textOverflow: "ellipsis", width: "250px" }}>{position.description["fr"]}</td>
                <td>
                    <Link to="/settings/positions/detail"
                          className="btn btn-sm btn-clean btn-icon btn-icon-md"
                          title="Détail">
                        <i className="la la-eye"/>
                    </Link>
                    {
                        verifyPermission(props.userPermissions, 'update-position') ? (
                            <Link to={`/settings/positions/${position.id}/edit`}
                                  className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                  title="Modifier">
                                <i className="la la-edit"/>
                            </Link>
                        ) : ""
                    }
                    {
                        verifyPermission(props.userPermissions, 'destroy-position') ? (
                            <button
                                onClick={(e) => deletePosition(position.id, index)}
                                className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                title="Supprimer">
                                <i className="la la-trash"/>
                            </button>
                        ) : ""
                    }

                </td>
            </tr>
        );
    };

    return (
        verifyPermission(props.userPermissions, "list-position") ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Paramètres
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link">
                                    Postes
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <InfirmationTable information={"A common UI paradigm to use with interactive tables is to present buttons that will trigger some action. See official documentation"}/>
                    <div className="kt-portlet">
                        <HeaderTablePage
                            title={"Postes"}
                            addText={"Ajouter d'un poste"}
                            addLink={"/settings/positions/add"}
                        />

                        {
                            load ? (
                                <LoadingTable/>
                            ) : (
                                <div className="kt-portlet__body">
                                    <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                        <div className="row">
                                            <div className="col-sm-6 text-left">
                                                <div id="kt_table_1_filter" className="dataTables_filter"><label>
                                                    Search:
                                                    <input id="myInput" type="text" onKeyUp={(e) => searchElement(e)} className="form-control form-control-sm" placeholder="" aria-controls="kt_table_1"/>
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
                                                    style={{ width: "952px" }}>
                                                    <thead>
                                                    <tr role="row">
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">Nom
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "250px" }}
                                                            aria-label="Ship City: activate to sort column ascending">Description
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1" colSpan="1" style={{ width: "40.25px" }} aria-label="Type: activate to sort column ascending">
                                                            Action
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        positions.length ? (
                                                            search ? (
                                                                positions.map((position, index) => (
                                                                    printBodyTable(position, index)
                                                                ))
                                                            ) : (
                                                                showList.map((position, index) => (
                                                                    printBodyTable(position, index)
                                                                ))
                                                            )
                                                        ) : (
                                                            <EmptyTable/>
                                                        )
                                                    }
                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                                                        <th rowSpan="1" colSpan="1">Nom</th>
                                                        <th rowSpan="1" colSpan="1">Description</th>
                                                        <th rowSpan="1" colSpan="1">Action</th>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-5">
                                                <div className="dataTables_info" id="kt_table_1_info" role="status"
                                                     aria-live="polite">Affichage de 1 à {numberPerPage} sur {positions.length} données
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
        ) : ""
    );
};

const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(Position);
