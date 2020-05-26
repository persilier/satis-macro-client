import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Link
} from "react-router-dom";
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

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const Unit = () => {
    window.location.href = "/error401";
    const [load, setLoad] = useState(true);
    const [units, setUnits] = useState([]);
    const [numberPerPage, setNumberPerPage] = useState(2);
    const [activeNumberPage, setActiveNumberPage] = useState(0);
    const [search, setSearch] = useState(false);
    const [numberPage, setNumberPage] = useState(0);
    const [showList, setShowList] = useState([]);

    useEffect(() => {
        axios.get(`${appConfig.apiDomaine}/units`)
            .then(response => {
                setLoad(false);
                setNumberPage(forceRound(response.data.length/numberPerPage));
                setShowList(response.data.slice(0, numberPerPage));
                setUnits(response.data);
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
        setShowList(units.slice(0, parseInt(e.target.value)));
        setNumberPage(forceRound(units.length/parseInt(e.target.value)));
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
        setShowList(units.slice(getEndByPosition(page) - numberPerPage, getEndByPosition(page)));
    };

    const onClickNextPage = (e) => {
        e.preventDefault();
        if (activeNumberPage <= numberPage) {
            setActiveNumberPage(activeNumberPage + 1);
            setShowList(
                units.slice(
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
                units.slice(
                    getEndByPosition(activeNumberPage - 1) - numberPerPage,
                    getEndByPosition(activeNumberPage - 1)
                )
            );
        }
    };

    const deleteUnit = (unitId, index) => {
        DeleteConfirmation.fire(confirmDeleteConfig)
            .then((result) => {
                if (result.value) {
                    axios.delete(`${appConfig.apiDomaine}/units/${unitId}`)
                        .then(response => {
                            const newUnits = [...units];
                            newUnits.splice(index, 1);
                            setUnits(newUnits);
                            if (showList.length > 1) {
                                setShowList(
                                    newUnits.slice(
                                        getEndByPosition(activeNumberPage) - numberPerPage,
                                        getEndByPosition(activeNumberPage)
                                    )
                                );
                            } else {
                                setShowList(
                                    newUnits.slice(
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

    const printBodyTable = (unit, index) => {
        return (
            <tr className="d-flex justify-content-center align-content-center odd" key={index} role="row" className="odd">
                <td>{unit.name["fr"]}</td>
                <td style={{ textOverflow: "ellipsis", width: "250px" }}>{unit.description["fr"]}</td>
                <td style={{ textOverflow: "ellipsis", width: "70px" }}>{unit.unit_type.name["fr"]}</td>
                <td style={{ textOverflow: "ellipsis", width: "70px" }}>{unit.institution ? unit.institution.name : ""}</td>
                <td>
                    <Link to="/settings/unit/detail"
                          className="btn btn-sm btn-clean btn-icon btn-icon-md"
                          title="Détail">
                        <i className="la la-eye"/>
                    </Link>
                    <Link to={`/settings/unit/${unit.id}/edit`}
                          className="btn btn-sm btn-clean btn-icon btn-icon-md"
                          title="Modifier">
                        <i className="la la-edit"/>
                    </Link>
                    <button
                        onClick={(e) => deleteUnit(unit.id, index)}
                        className="btn btn-sm btn-clean btn-icon btn-icon-md"
                        title="Supprimer">
                        <i className="la la-trash"/>
                    </button>
                </td>
            </tr>
        );
    };

    const macroPermission = "macroPermission";
    const hubPermission = "hubPermission";
    const proPermission = "proPermission";

    return (
        macroPermission === "macroPermission" || hubPermission === "hubPermission" || proPermission === "proPermission" ? (
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
                                    Unité
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <InfirmationTable information={"A common UI paradigm to use with interactive tables is to present buttons that will trigger some action. See official documentation"}/>

                    <div className="kt-portlet">
                        <HeaderTablePage
                            title={"Unité"}
                            addText={"Ajouter un unité"}
                            addLink={"/settings/unit/add"}
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
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70px" }}
                                                            aria-label="Country: activate to sort column ascending">Type Unité
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70px" }}
                                                            aria-label="Country: activate to sort column ascending">Institution
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1" colSpan="1" style={{ width: "40.25px" }} aria-label="Type: activate to sort column ascending">
                                                            Action
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        units.length ? (
                                                            search ? (
                                                                units.map((unit, index) => (
                                                                    printBodyTable(unit, index)
                                                                ))
                                                            ) : (
                                                                showList.map((unit, index) => (
                                                                    printBodyTable(unit, index)
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
                                                        <th rowSpan="1" colSpan="1">Type Unité</th>
                                                        <th rowSpan="1" colSpan="1">Institution</th>
                                                        <th rowSpan="1" colSpan="1">Action</th>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-5">
                                                <div className="dataTables_info" id="kt_table_1_info" role="status"
                                                     aria-live="polite">Affichage de 1 à {numberPerPage} sur {units.length} données
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

export default Unit;
