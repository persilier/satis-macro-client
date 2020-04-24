import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import AddCategoryClient from "../components/AddCategoryClient";
import AddTypeClient from "../components/AddTypeClient";

const TypeClientPage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/type-clients`)
            .then(response => {
                setData(response.data)
            })
    }, []);

    const onDeleted = (elemt) => {
        axios.delete(`http://127.0.0.1:8000/type-clients/${elemt}`
        )
            .then(function (response) {
                console.log(response, 'OK');
            })
            .catch(function (response) {
                console.log(response.response);
            });
    };
    return (
        <div className={"kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"} id="kt_content">
            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            TYPE CLIENT </h3>
                        <span className="kt-subheader__separator kt-hidden"></span>
                        <div className="kt-subheader__breadcrumbs">
                            <a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"></i></a>
                            <span className="kt-subheader__breadcrumbs-separator"></span>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                Pages </a>
                            <span className="kt-subheader__breadcrumbs-separator"></span>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                Category Client </a>

                        </div>
                    </div>
                </div>
            </div>
            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                <div className="alert alert-light alert-elevate" role="alert">
                    <div className="alert-icon"><i className="flaticon-warning kt-font-brand"></i></div>
                    <div className="alert-text">
                        The Metronic Datatable component supports local or remote data source. For the local data
                        you can pass javascript array as data source. In this example the grid fetches its
                        data from a javascript array data source. It also defines
                        the schema model of the data source. In addition to the visualization, the Datatable
                        provides built-in support for operations over data such as sorting, filtering and
                        paging performed in user browser(frontend).
                    </div>
                </div>
                <div className="kt-portlet kt-portlet--mobile">
                    <div className="kt-portlet__head kt-portlet__head--lg">
                        <div className="kt-portlet__head-label">
							<span className="kt-portlet__head-icon">
								<i className="kt-font-brand flaticon2-line-chart"></i>
							</span>
                            <h3 className="kt-portlet__head-title">
                                Type client
                            </h3>
                        </div>
                        <div className="kt-portlet__head-toolbar">
                            <div className="kt-portlet__head-wrapper">
                                <div className="dropdown dropdown-inline">
                                    <button type="button" className="btn btn-default btn-icon-sm dropdown-toggle"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="la la-download"></i> Export
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <ul className="kt-nav">
                                            <li className="kt-nav__section kt-nav__section--first">
                                                <span className="kt-nav__section-text">Choose an option</span>
                                            </li>
                                            <li className="kt-nav__item">
                                                <a href="#" className="kt-nav__link">
                                                    <i className="kt-nav__link-icon la la-print"></i>
                                                    <span className="kt-nav__link-text">Print</span>
                                                </a>
                                            </li>
                                            <li className="kt-nav__item">
                                                <a href="#" className="kt-nav__link">
                                                    <i className="kt-nav__link-icon la la-copy"></i>
                                                    <span className="kt-nav__link-text">Copy</span>
                                                </a>
                                            </li>
                                            <li className="kt-nav__item">
                                                <a href="#" className="kt-nav__link">
                                                    <i className="kt-nav__link-icon la la-file-excel-o"></i>
                                                    <span className="kt-nav__link-text">Excel</span>
                                                </a>
                                            </li>

                                            <li className="kt-nav__item">
                                                <a href="#" className="kt-nav__link">
                                                    <i className="kt-nav__link-icon la la-file-pdf-o"></i>
                                                    <span className="kt-nav__link-text">PDF</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                &nbsp;
                                <div className="dropdown dropdown-inline">
                                    <button type="button" className="btn btn-bold btn-label-brand btn-sm"
                                            data-toggle="modal"
                                            data-target="#kt_modal_4">
                                        <i className="flaticon2-plus"></i> Add New
                                    </button>
                                    <div className="modal fade" id="kt_modal_4" tabIndex="-1" role="dialog"
                                         aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <AddTypeClient/>
                                    </div>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <ul className="kt-nav">
                                            <li className="kt-nav__section kt-nav__section--first">
                                                <span className="kt-nav__section-text">Choose an action:</span>
                                            </li>
                                            <li className="kt-nav__item">
                                                <a href="#" className="kt-nav__link">
                                                    <i className="kt-nav__link-icon flaticon2-open-text-book"></i>
                                                    <span className="kt-nav__link-text">Reservations</span>
                                                </a>
                                            </li>
                                            <li className="kt-nav__item">
                                                <a href="#" className="kt-nav__link">
                                                    <i className="kt-nav__link-icon flaticon2-calendar-4"></i>
                                                    <span className="kt-nav__link-text">Appointments</span>
                                                </a>
                                            </li>
                                            <li className="kt-nav__item">
                                                <a href="#" className="kt-nav__link">
                                                    <i className="kt-nav__link-icon flaticon2-bell-alarm-symbol"></i>
                                                    <span className="kt-nav__link-text">Reminders</span>
                                                </a>
                                            </li>
                                            <li className="kt-nav__item">
                                                <a href="#" className="kt-nav__link">
                                                    <i className="kt-nav__link-icon flaticon2-contract"></i>
                                                    <span className="kt-nav__link-text">Announcements</span>
                                                </a>
                                            </li>
                                            <li className="kt-nav__item">
                                                <a href="#" className="kt-nav__link">
                                                    <i className="kt-nav__link-icon flaticon2-shopping-cart-1"></i>
                                                    <span className="kt-nav__link-text">Orders</span>
                                                </a>
                                            </li>
                                            <li className="kt-nav__separator kt-nav__separator--fit">
                                            </li>
                                            <li className="kt-nav__item">
                                                <a href="#" className="kt-nav__link">
                                                    <i className="kt-nav__link-icon flaticon2-rocket-1"></i>
                                                    <span className="kt-nav__link-text">Projects</span>
                                                </a>
                                            </li>
                                            <li className="kt-nav__item">
                                                <a href="#" className="kt-nav__link">
                                                    <i className="kt-nav__link-icon flaticon2-chat-1"></i>
                                                    <span className="kt-nav__link-text">User Feedbacks</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="kt-portlet__body">
                        <div className="kt-form kt-form--label-right kt-margin-t-20 kt-margin-b-10">
                            <div className="row align-items-center">
                                <div className="col-xl-8 order-2 order-xl-1">
                                    <div className="row align-items-center">
                                        <div className="col-md-4 kt-margin-b-20-tablet-and-mobile">
                                            <div className="kt-input-icon kt-input-icon--left">
                                                <input type="text" className="form-control" placeholder="Search..."
                                                       id="generalSearch"/>
                                                <span
                                                    className="kt-input-icon__icon kt-input-icon__icon--left">
																		<span><i className="la la-search"></i></span>
																	</span>
                                            </div>
                                        </div>
                                        <div className="col-md-4 kt-margin-b-20-tablet-and-mobile">
                                            <div className="kt-form__group kt-form__group--inline">
                                                <div className="kt-form__label">
                                                    <label>Status:</label>
                                                </div>
                                                <div className="kt-form__control">
                                                    <div className="dropdown bootstrap-select form-control"><select
                                                        className="form-control bootstrap-select"
                                                        id="kt_form_status" tabIndex="-98">
                                                        <option value="">All</option>
                                                        <option value="1">Pending</option>
                                                        <option value="2">Delivered</option>
                                                        <option value="3">Canceled</option>
                                                        <option value="4">Success</option>
                                                        <option value="5">Info</option>
                                                        <option value="6">Danger</option>
                                                    </select>
                                                        <button type="button"
                                                                className="btn dropdown-toggle btn-light"
                                                                data-toggle="dropdown" role="combobox"
                                                                aria-owns="bs-select-1" aria-haspopup="listbox"
                                                                aria-expanded="false" data-id="kt_form_status"
                                                                title="All">
                                                            <div className="filter-option">
                                                                <div className="filter-option-inner">
                                                                    <div className="filter-option-inner-inner">All
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                        <div className="dropdown-menu ">
                                                            <div className="inner show" role="listbox"
                                                                 id="bs-select-1" tabIndex="-1">
                                                                <ul className="dropdown-menu inner show"
                                                                    role="presentation"></ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 kt-margin-b-20-tablet-and-mobile">
                                            <div className="kt-form__group kt-form__group--inline">
                                                <div className="kt-form__label">
                                                    <label>Type:</label>
                                                </div>
                                                <div className="kt-form__control">
                                                    <div className="dropdown bootstrap-select form-control"><select
                                                        className="form-control bootstrap-select" id="kt_form_type"
                                                        tabIndex="-98">
                                                        <option value="">All</option>
                                                        <option value="1">Online</option>
                                                        <option value="2">Retail</option>
                                                        <option value="3">Direct</option>
                                                    </select>
                                                        <button type="button"
                                                                className="btn dropdown-toggle btn-light"
                                                                data-toggle="dropdown" role="combobox"
                                                                aria-owns="bs-select-2" aria-haspopup="listbox"
                                                                aria-expanded="false" data-id="kt_form_type"
                                                                title="All">
                                                            <div className="filter-option">
                                                                <div className="filter-option-inner">
                                                                    <div className="filter-option-inner-inner">All
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                        <div className="dropdown-menu ">
                                                            <div className="inner show" role="listbox"
                                                                 id="bs-select-2" tabIndex="-1">
                                                                <ul className="dropdown-menu inner show"
                                                                    role="presentation"></ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 order-1 order-xl-2 kt-align-right">
                                    <a href="#" className="btn btn-default kt-hidden">
                                        <i className="la la-cart-plus"></i> New Order
                                    </a>
                                    <div
                                        className="kt-separator kt-separator--border-dashed kt-separator--space-lg d-xl-none"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="kt-portlet__body kt-portlet__body--fit">

                        <div className="kt-datatable kt-datatable--default kt-datatable--brand kt-datatable--loaded"
                             id="local_data">
                            <table className="kt-datatable__table" style={{display: 'block'}}>
                                <thead className="kt-datatable__head">
                                <tr className="kt-datatable__row" style={{left: "0px"}}>
                                    <th data-field="RecordID"
                                        className="kt-datatable__cell--center kt-datatable__cell kt-datatable__cell--check">
                                            <span style={{width: '20px'}}><label
                                                className="kt-checkbox kt-checkbox--single kt-checkbox--all kt-checkbox--solid"><input
                                                type="checkbox"/>&nbsp;<span></span></label></span></th>
                                    <th data-field="Country"
                                        className="kt-datatable__cell kt-datatable__cell--sort"><span
                                        style={{width: '110px'}}>Institution</span></th>
                                    <th data-field="ShipDate"
                                        className="kt-datatable__cell kt-datatable__cell--sort"><span
                                        style={{width: '110px'}}>Name</span></th>
                                    <th data-field="Answer"
                                        className="kt-datatable__cell kt-datatable__cell--sort"><span
                                        style={{width: '110px'}}>Description</span></th>

                                    <th data-field="Actions" data-autohide-disabled="false"
                                        className="kt-datatable__cell kt-datatable__cell--sort"><span
                                        style={{width: '110px'}}>Actions</span></th>
                                </tr>
                                </thead>
                                <tbody className="kt-datatable__body">
                                {console.log(data.data, 'data')}
                                {data.data ? (
                                    data.data.map((elemt, i) => (
                                        <tr data-row="0" className="kt-datatable__row" style={{left: '0px'}}
                                            key={i}>
                                            <td className="kt-datatable__cell--center kt-datatable__cell kt-datatable__cell--check"
                                                data-field="RecordID"><span style={{width: '20px'}}><label
                                                className="kt-checkbox kt-checkbox--single kt-checkbox--solid"><input
                                                type="checkbox" value="1"/>&nbsp;<span></span></label></span></td>
                                            <td data-field="Country" className="kt-datatable__cell"><span
                                                style={{width: '110px'}}>{elemt.institution.name}</span></td>
                                            <td data-field="ShipDate" className="kt-datatable__cell"><span
                                                style={{width: '110px'}}>{elemt.name}</span></td>
                                            <td data-field="Answer" className="kt-datatable__cell"><span
                                                style={{width: '110px'}}>{elemt.description}</span></td>

                                            <td data-field="Actions" data-autohide-disabled="false"
                                                className="kt-datatable__cell"><span
                                                style={{overflow: 'visible', position: 'relative', width: '110px'}}>						<div
                                                className="dropdown">
                                                <a data-toggle="dropdown"
                                                   className="btn btn-sm btn-clean btn-icon btn-icon-md">                                <i
                                                    className="la la-cog"></i>
                                                </a>
                                                    <div className="dropdown-menu dropdown-menu-right">
                                                        <a href="#" className="dropdown-item"><i
                                                            className="la la-edit"></i> Edit Details</a>
                                                        <a href="#" className="dropdown-item"><i
                                                            className="la la-leaf"></i> Update Status</a>
                                                        <a href="#" className="dropdown-item"><i
                                                            className="la la-print"></i> Generate Report</a>
                                                    </div>
                                                </div>
                                                <Link to={`/settings/client/type/${elemt.id}`} title="Edit details"
                                                      className="btn btn-sm btn-clean btn-icon btn-icon-md">
                                                <i className="la la-edit text-primary"></i>
                                                </Link>
                                                <a title="Delete" className="btn btn-sm btn-clean btn-icon btn-icon-md "
                                                   onClick={() => onDeleted(elemt.id)}>
                                                    <i className="la la-trash text-danger"></i>
                                                </a>
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (<tr>
                                    <td></td>
                                </tr>)}

                                </tbody>
                            </table>
                            <div className="kt-datatable__pager kt-datatable--paging-loaded">
                                <ul className="kt-datatable__pager-nav">
                                    <li><a title="First"
                                           className="kt-datatable__pager-link kt-datatable__pager-link--first kt-datatable__pager-link--disabled"
                                           data-page="1" disabled="disabled"><i className="flaticon2-fast-back"></i></a>
                                    </li>
                                    <li><a title="Previous"
                                           className="kt-datatable__pager-link kt-datatable__pager-link--prev kt-datatable__pager-link--disabled"
                                           data-page="1" disabled="disabled"><i className="flaticon2-back"></i></a></li>
                                    <li ></li>
                                    <li style={{display: 'none'}}><input type="text"
                                                                         className="kt-pager-input form-control"
                                                                         title="Page number"/></li>
                                    <li><a
                                        className="kt-datatable__pager-link kt-datatable__pager-link-number kt-datatable__pager-link--active"
                                        data-page="1" title="1">1</a></li>
                                    <li><a className="kt-datatable__pager-link kt-datatable__pager-link-number"
                                           data-page="2" title="2">2</a></li>
                                    <li><a className="kt-datatable__pager-link kt-datatable__pager-link-number"
                                           data-page="3" title="3">3</a></li>
                                    <li><a className="kt-datatable__pager-link kt-datatable__pager-link-number"
                                           data-page="4" title="4">4</a></li>
                                    <li><a className="kt-datatable__pager-link kt-datatable__pager-link-number"
                                           data-page="5" title="5">5</a></li>
                                    <li></li>
                                    <li><a title="Next"
                                           className="kt-datatable__pager-link kt-datatable__pager-link--next"
                                           data-page="2"><i className="flaticon2-next"></i></a></li>
                                    <li><a title="Last"
                                           className="kt-datatable__pager-link kt-datatable__pager-link--last"
                                           data-page="10"><i className="flaticon2-fast-next"></i></a></li>
                                </ul>
                                <div className="kt-datatable__pager-info">
                                    <div className="dropdown bootstrap-select kt-datatable__pager-size"
                                         style={{width: '60px'}}><select className="selectpicker kt-datatable__pager-size"
                                                                         title="Select page size" data-width="60px"
                                                                         data-selected="10" tabIndex="-98">
                                        <option className="bs-title-option" value=""></option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                        <button type="button" className="btn dropdown-toggle btn-light"
                                                data-toggle="dropdown" role="combobox" aria-owns="bs-select-3"
                                                aria-haspopup="listbox" aria-expanded="false" title="Select page size">
                                            <div className="filter-option">
                                                <div className="filter-option-inner">
                                                    <div className="filter-option-inner-inner">10</div>
                                                </div>
                                            </div>
                                        </button>
                                        <div className="dropdown-menu ">
                                            <div className="inner show" role="listbox" id="bs-select-3" tabIndex="-1">
                                                <ul className="dropdown-menu inner show" role="presentation"></ul>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="kt-datatable__pager-detail">Showing 1 - 10 of 100</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypeClientPage;