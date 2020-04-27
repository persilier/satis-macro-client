import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Link
} from "react-router-dom";
import {loadCss, loadScript} from "../../helper/function";
import LoadingTable from "../components/LoadingTable";
import {ToastBottomEnd} from "../components/Toast";
import {toastDeleteErrorMessageConfig, toastDeleteSuccessMessageConfig} from "../../config/toastConfig";
import {DeleteConfirmation} from "../components/ConfirmationAlert";
import {confirmDeleteConfig} from "../../config/confirmConfig";

loadCss("assets/plugins/custom/datatables/datatables.bundle.css");

const FAQs = () => {
    const [load, setLoad] = useState(true);
    const [faqs, setFaqs] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/faqs")
            .then(response => {
                setLoad(false);
                setFaqs(response.data);
            })
            .catch(error => {
                setLoad(false);
                console.log("Something is wrong");
            })
    }, []);

    const deleteFaqs = (faqId, index) => {
        DeleteConfirmation.fire(confirmDeleteConfig)
            .then((result) => {
                if (result.value) {
                    axios.delete(`http://127.0.0.1:8000/faqs/${faqId}`)
                        .then(response => {
                            console.log(response, "OK");
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

    const filterByInput = (e) => {
        function myFunction() {
            var input, filter, table, tr, td, i, txtValue;
            input = document.getElementById("myInput");
            filter = input.value.toUpperCase();
            table = document.getElementById("myTable");
            tr = table.getElementsByTagName("tr");
            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[0];
                if (td) {
                    txtValue = td.textContent || td.innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }
                }
            }
        }
        myFunction();
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
                                FAQs
                            </h3>
                        </div>
                        <div className="kt-portlet__head-toolbar">
                            <div className="kt-portlet__head-wrapper">
                                &nbsp;
                                <div className="dropdown dropdown-inline">
                                    <Link to={"/settings/faqs/faq/add"} className="btn btn-brand btn-icon-sm" >
                                        <i className="flaticon2-plus"/> Add New
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                                    <input id="myInput" type="text" onKeyUp={(e) => filterByInput(e)} className="form-control form-control-sm" placeholder="" aria-controls="kt_table_1"/>
                                                </label>
                                            </div>
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
                                                id="myTable" role="grid" aria-describedby="kt_table_1_info"
                                                style={{ width: "952px" }}>
                                                <thead>
                                                <tr role="row">
                                                    <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                        colSpan="1" style={{ width: "70.25px" }}
                                                        aria-label="Country: activate to sort column ascending">Catégorie
                                                    </th>
                                                    <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                        colSpan="1" style={{ width: "200px" }}
                                                        aria-label="Ship City: activate to sort column ascending">Question
                                                    </th>
                                                    <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                        colSpan="1" style={{ width: "200px" }}
                                                        aria-label="Ship City: activate to sort column ascending">Réponse
                                                    </th>
                                                    <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1" colSpan="1" style={{ width: "40.25px" }} aria-label="Type: activate to sort column ascending">
                                                        Action
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    faqs.data? (
                                                       faqs.data.map((faq, index) => (
                                                            <tr className="d-flex justify-content-center align-content-center odd" key={index} role="row" className="odd">
                                                                <td>{faq.category.name}</td>
                                                                <td >{faq.question}</td>
                                                                <td >{faq.answer}</td>
                                                                <td>
                                                                    <Link to="/settings/faqs/faq/detail"
                                                                          className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                                                          title="Détail">
                                                                        <i className="la la-eye"/>
                                                                    </Link>
                                                                    <Link to={`/settings/faqs/faq/edit/${faq.id}`}
                                                                          className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                                                          title="Modifier">
                                                                        <i className="la la-edit"/>
                                                                    </Link>
                                                                    <button
                                                                        onClick={(e) => deleteFaqs(faq.id, index)}
                                                                        className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                                                        title="Supprimer">
                                                                        <i className="la la-trash"/>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={100} className="text-center">
                                                                <span className="kt-datatable--error">Le tableau est vide</span>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                </tbody>
                                                <tfoot>
                                                <tr></tr>
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
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default FAQs;
