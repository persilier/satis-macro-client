import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Link
} from "react-router-dom";
import {loadCss, loadScript} from "../../helper/function";

loadCss("assets/plugins/custom/datatables/datatables.bundle.css");
loadScript("assets/plugins/custom/datatables/datatables.bundle.js");
loadScript("assets/js/pages/crud/datatables/extensions/buttons.js");

const PerformanceIndicator = () => {
    const [performances, setPerformances] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/performance-indicators")
            .then(response => {
                setPerformances(response.data);
            })
            .catch(error => {
                console.log("Something is wrong");
            })
    }, []);

    const deletePerformanceIndicator = (performanceId, index) => {
        axios.delete(`http://127.0.0.1:8000/performance-indicators/${performanceId}`)
            .then(response => {
                const newPerformances = [...performances];
                newPerformances.splice(index, 1);
                setPerformances(newPerformances);
                console.log("Request is successful");
            })
            .catch(error => {
                console.log("Something is wrong");
            })
        ;
    };

    return (
        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            Buttons Examples
                        </h3>
                        <span className="kt-subheader__separator kt-hidden"/>
                        <div className="kt-subheader__breadcrumbs">
                            <a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                Datatables.net </a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                Extensions </a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                Buttons
                            </a>
                        </div>
                    </div>
                    <div className="kt-subheader__toolbar">
                        <div className="kt-subheader__wrapper">
                            <a href="#" className="btn kt-subheader__btn-primary">
                                Actions &nbsp;
                            </a>
                            <div className="dropdown dropdown-inline" data-toggle="kt-tooltip" title="" data-placement="left" data-original-title="Quick actions">
                                <a href="#" className="btn btn-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         className="kt-svg-icon kt-svg-icon--success kt-svg-icon--md">
                                        <g fill="none" fill-rule="evenodd">
                                            <path d="M0 0h24v24H0z"/>
                                            <path
                                                d="M5.857 2h7.88a1.5 1.5 0 01.968.355l4.764 4.029A1.5 1.5 0 0120 7.529v12.554c0 1.79-.02 1.917-1.857 1.917H5.857C4.02 22 4 21.874 4 20.083V3.917C4 2.127 4.02 2 5.857 2z"
                                                fill="#000" fill-rule="nonzero" opacity=".3"/>
                                            <path
                                                d="M11 14H9a1 1 0 010-2h2v-2a1 1 0 012 0v2h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2z"
                                                fill="#000"/>
                                        </g>
                                    </svg>
                                </a>
                                <div className="dropdown-menu dropdown-menu-fit dropdown-menu-md dropdown-menu-right">
                                    <ul className="kt-nav">
                                        <li className="kt-nav__head">
                                            Add anything or jump to:
                                            <i className="flaticon2-information" data-toggle="kt-tooltip" data-placement="right" title="" data-original-title="Click to learn more..."></i>
                                        </li>
                                        <li className="kt-nav__separator"></li>
                                        <li className="kt-nav__item">
                                            <a href="#" className="kt-nav__link">
                                                <i className="kt-nav__link-icon flaticon2-drop"></i>
                                                <span className="kt-nav__link-text">Order</span>
                                            </a>
                                        </li>
                                        <li className="kt-nav__item">
                                            <a href="#" className="kt-nav__link">
                                                <i className="kt-nav__link-icon flaticon2-calendar-8"></i>
                                                <span className="kt-nav__link-text">Ticket</span>
                                            </a>
                                        </li>
                                        <li className="kt-nav__item">
                                            <a href="#" className="kt-nav__link">
                                                <i className="kt-nav__link-icon flaticon2-telegram-logo"></i>
                                                <span className="kt-nav__link-text">Goal</span>
                                            </a>
                                        </li>
                                        <li className="kt-nav__item">
                                            <a href="#" className="kt-nav__link">
                                                <i className="kt-nav__link-icon flaticon2-new-email"></i>
                                                <span className="kt-nav__link-text">Support Case</span>
                                                <span className="kt-nav__link-badge">
																		<span className="kt-badge kt-badge--success">5</span>
																	</span>
                                            </a>
                                        </li>
                                        <li className="kt-nav__separator"></li>
                                        <li className="kt-nav__foot">
                                            <a className="btn btn-label-brand btn-bold btn-sm" href="#">Upgrade plan</a>
                                            <a className="btn btn-clean btn-bold btn-sm" href="#" data-toggle="kt-tooltip" data-placement="right" title="" data-original-title="Click to learn more...">Learn more</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                <div className="alert alert-light alert-elevate" role="alert">
                    <div className="alert-icon"><i className="flaticon-warning kt-font-brand"/></div>
                    <div className="alert-text">
                        A common UI paradigm to use with interactive tables is to present buttons that will trigger some action. See official documentation
                        <a className="kt-link kt-font-bold" href="https://datatables.net/extensions/buttons/" target="_blank">
                            here
                        </a>.
                    </div>
                </div>
                <div className="kt-portlet">
                    <div className="kt-portlet__head kt-portlet__head--lg">
                        <div className="kt-portlet__head-label">
                            <span className="kt-portlet__head-icon">
                                <i className="kt-font-brand flaticon2-line-chart"/>
                            </span>
                            <h3 className="kt-portlet__head-title">
                                Indicateur de performance
                            </h3>
                        </div>
                        <div className="kt-portlet__head-toolbar">
                            <div className="kt-portlet__head-wrapper">
                                &nbsp;
                                <div className="dropdown dropdown-inline">
                                    <Link to={"/settings/performance_indicator/add"} className="btn btn-brand btn-icon-sm">
                                        <i className="flaticon2-plus"/> Add New
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="kt-portlet__body">
                        <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">
                            <div className="row">
                                <div className="col-sm-6 text-left">
                                    <div id="kt_table_1_filter" className="dataTables_filter"><label>Search:<input
                                        type="search" className="form-control form-control-sm" placeholder=""
                                        aria-controls="kt_table_1"/></label></div>
                                </div>
                                <div className="col-sm-6 text-right">
                                    <div className="dt-buttons btn-group flex-wrap">
                                        <button className="btn btn-secondary buttons-print" tabIndex="0"
                                                aria-controls="kt_table_1" type="button"><span>Print</span></button>
                                        <button className="btn btn-secondary buttons-copy buttons-html5" tabIndex="0"
                                                aria-controls="kt_table_1" type="button"><span>Copy</span></button>
                                        <button className="btn btn-secondary buttons-excel buttons-html5" tabIndex="0"
                                                aria-controls="kt_table_1" type="button"><span>Excel</span></button>
                                        <button className="btn btn-secondary buttons-csv buttons-html5" tabIndex="0"
                                                aria-controls="kt_table_1" type="button"><span>CSV</span></button>
                                        <button className="btn btn-secondary buttons-pdf buttons-html5" tabIndex="0"
                                                aria-controls="kt_table_1" type="button"><span>PDF</span></button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <table
                                        className="table table-striped- table-bordered table-hover table-checkable dataTable dtr-inline"
                                        id="kt_table_1" role="grid" aria-describedby="kt_table_1_info"
                                        style={{ width: "952px" }}>
                                        <thead>
                                        <tr role="row">
                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                colSpan="1" style={{ width: "70.25px" }}
                                                aria-label="Country: activate to sort column ascending">Nom
                                            </th>
                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                colSpan="1" style={{ width: "300px" }}
                                                aria-label="Ship City: activate to sort column ascending">Description
                                            </th>
                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                colSpan="1" style={{ width: "20px" }}
                                                aria-label="Ship Address: activate to sort column ascending">Value
                                            </th>
                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                colSpan="1" style={{ width: "15px" }}
                                                aria-label="Company Agent: activate to sort column ascending">Unité de mésure
                                            </th>
                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1" colSpan="1" style={{ width: "40.25px" }} aria-label="Type: activate to sort column ascending">
                                                Action
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            performances.length ? (
                                                performances.map((performance, index) => (
                                                    <tr className="d-flex justify-content-center align-content-center odd" key={index} role="row" className="odd">
                                                        <td>{performance.name["fr"]}</td>
                                                        <td style={{ textOverflow: "ellipsis", width: "300px" }}>{performance.description["fr"]}</td>
                                                        <td>{performance.value}</td>
                                                        <td>{performance.mesure_unit}</td>
                                                        <td>
                                                            <Link to="/settings/performance_indicator/detail"
                                                                  className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                                                  title="Détail">
                                                                <i className="la la-eye"/>
                                                            </Link>
                                                            <Link to={`/settings/performance_indicator/${performance.id}/edit`}
                                                                  className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                                                  title="Modifier">
                                                                <i className="la la-edit"/>
                                                            </Link>
                                                            <button
                                                                onClick={(e) => deletePerformanceIndicator(performance.id, index)}
                                                                className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                                                title="Supprimer">
                                                                <i className="la la-trash"/>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr/>
                                            )
                                        }
                                        </tbody>
                                        <tfoot>
                                        <tr>
                                            <th rowSpan="1" colSpan="1">Nom</th>
                                            <th rowSpan="1" colSpan="1">Description</th>
                                            <th rowSpan="1" colSpan="1">Valeur</th>
                                            <th rowSpan="1" colSpan="1">Unité de mésure</th>
                                            <th rowSpan="1" colSpan="1">Action</th>
                                        </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-5">
                                    <div className="dataTables_info" id="kt_table_1_info" role="status"
                                         aria-live="polite">Showing 1 to 10 of 40 entries
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-7 dataTables_pager">
                                    <div className="dataTables_length" id="kt_table_1_length">
                                        <label>
                                            Show
                                            <select name="kt_table_1_length" aria-controls="kt_table_1" className="custom-select custom-select-sm form-control form-control-sm">
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                            entries
                                        </label>
                                    </div>
                                    <div className="dataTables_paginate paging_simple_numbers" id="kt_table_1_paginate">
                                        <ul className="pagination">
                                            <li className="paginate_button page-item previous disabled" id="kt_table_1_previous">
                                                <a href="#" aria-controls="kt_table_1" data-dt-idx="0" tabIndex="0" className="page-link"><i className="la la-angle-left"/></a>
                                            </li>
                                            <li className="paginate_button page-item active">
                                                <a href="#" aria-controls="kt_table_1" data-dt-idx="1" tabIndex="0" className="page-link">1</a>
                                            </li>
                                            <li className="paginate_button page-item ">
                                                <a href="#" aria-controls="kt_table_1" data-dt-idx="2" tabIndex="0" className="page-link">2</a>
                                            </li>
                                            <li className="paginate_button page-item ">
                                                <a href="#" aria-controls="kt_table_1" data-dt-idx="3" tabIndex="0" className="page-link">3</a>
                                            </li>
                                            <li className="paginate_button page-item ">
                                                <a href="#" aria-controls="kt_table_1" data-dt-idx="4" tabIndex="0" className="page-link">4</a>
                                            </li>
                                            <li className="paginate_button page-item next" id="kt_table_1_next">
                                                <a href="#" aria-controls="kt_table_1" data-dt-idx="5" tabIndex="0" className="page-link">
                                                    <i className="la la-angle-right"/>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceIndicator;
