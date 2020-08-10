import React from "react";
import {connect} from "react-redux";
import * as LanguageAction from "../../store/actions/languageAction";
import * as authActions from "../../store/actions/authActions";
import {Link} from "react-router-dom";

const Nav = (props) => {
    const onClickLanguage = (e, lang) => {
        e.preventDefault();
        props.changeLanguage(lang);
    };
    const onClickLogoutLink = (e) => {
        e.preventDefault();
        props.logoutUser();
    };

    return (
        <div id="kt_header" className="kt-header kt-grid__item  kt-header--fixed " data-ktheader-minimize="on"
             style={{position: "sticky", top: 0, zIndex: 2}}>
            <div className="kt-container  kt-container--fluid ">
                <div className="kt-header__brand " id="kt_header_brand">
                    <div className="kt-header__brand-logo">
                        <a href="index.html">
                            <img alt="Logo" src="/assets/images/satisLogo.png" width={"100"} height={"34"}/>
                            <span className="mx-2 text-white font-weight-bolder">{props.plan}</span>
                        </a>
                    </div>
                    <div className="kt-header__brand-nav">
                        <div className="dropdown">
                            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown"
                                    aria-haspopup="true" aria-expanded="true">
                                Dashboard
                            </button>
                            <div className="dropdown-menu dropdown-menu-fit dropdown-menu-md">
                                <ul className="kt-nav kt-nav--bold kt-nav--md-space kt-margin-t-20 kt-margin-b-20">
                                    <li className="kt-nav__item">
                                        <a className="kt-nav__link active" href="#link">
                                            <span className="kt-nav__link-icon"><i
                                                className="flaticon2-user"></i></span>
                                            <span className="kt-nav__link-text">Human Resources</span>
                                        </a>
                                    </li>
                                    <li className="kt-nav__item">
                                        <a className="kt-nav__link" href="#link">
                                            <span className="kt-nav__link-icon"><i className="flaticon-feed"></i></span>
                                            <span className="kt-nav__link-text">Customer Relationship</span>
                                        </a>
                                    </li>
                                    <li className="kt-nav__item">
                                        <a className="kt-nav__link" href="#link">
                                            <span className="kt-nav__link-icon"><i
                                                className="flaticon2-settings"></i></span>
                                            <span className="kt-nav__link-text">Order Processing</span>
                                        </a>
                                    </li>
                                    <li className="kt-nav__item">
                                        <a className="kt-nav__link" href="#link">
                                            <span className="kt-nav__link-icon"><i
                                                className="flaticon2-chart2"></i></span>
                                            <span className="kt-nav__link-text">Accounting</span>
                                        </a>
                                    </li>
                                    <li className="kt-nav__separator"></li>
                                    <li className="kt-nav__item">
                                        <a className="kt-nav__link" href="#link">
                                            <span className="kt-nav__link-icon"><i
                                                className="flaticon-security"></i></span>
                                            <span className="kt-nav__link-text">Finance</span>
                                        </a>
                                    </li>
                                    <li className="kt-nav__item">
                                        <a className="kt-nav__link" href="#link">
                                            <span className="kt-nav__link-icon"><i className="flaticon2-cup"></i></span>
                                            <span className="kt-nav__link-text">Administration</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-header__topbar">
                    <div className="kt-header__topbar-item kt-header__topbar-item--search dropdown"
                         id="kt_quick_search_toggle">
                        <div className="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px">
                            <span className="kt-header__topbar-icon">
                                <i className="flaticon2-search-1"/>
                            </span>
                        </div>
                        <div
                            className="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-lg">
                            <div className="kt-quick-search kt-quick-search--dropdown kt-quick-search--result-compact"
                                 id="kt_quick_search_dropdown">
                                <form method="get" className="kt-quick-search__form">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <i className="flaticon2-search-1"/>
                                            </span>
                                        </div>
                                        <input type="text" className="form-control kt-quick-search__input"
                                               placeholder="Search..."/>
                                        <div className="input-group-append"><span className="input-group-text"><i
                                            className="la la-close kt-quick-search__close"/></span></div>
                                    </div>
                                </form>
                                <div className="kt-quick-search__wrapper kt-scroll" data-scroll="true" data-height="325"
                                     data-mobile-height="200"/>
                            </div>
                        </div>
                    </div>

                    <div className="kt-header__topbar-item dropdown">
                        <div className="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px">
                            <span className="kt-header__topbar-icon"><i
                                className="flaticon2-bell-alarm-symbol"></i></span>
                            <span className="kt-hidden kt-badge kt-badge--danger"></span>
                        </div>
                        <div
                            className="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-xl">
                            <form>
                                <div className="kt-head kt-head--skin-light kt-head--fit-x kt-head--fit-b">
                                    <h3 className="kt-head__title">
                                        User Notifications
                                        &nbsp;
                                        <span
                                            className="btn btn-label-primary btn-sm btn-bold btn-font-md">23 new</span>
                                    </h3>
                                    <ul className="nav nav-tabs nav-tabs-line nav-tabs-bold nav-tabs-line-3x nav-tabs-line-brand  kt-notification-item-padding-x"
                                        role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link active show" data-toggle="tab"
                                               href="#topbar_notifications_notifications" role="tab"
                                               aria-selected="true">Alerts</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="tab"
                                               href="#topbar_notifications_events" role="tab"
                                               aria-selected="false">Events</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="tab" href="#topbar_notifications_logs"
                                               role="tab" aria-selected="false">Logs</a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="tab-content">
                                    <div className="tab-pane active show" id="topbar_notifications_notifications"
                                         role="tabpanel">
                                        <div className="kt-notification kt-margin-t-10 kt-margin-b-10 kt-scroll"
                                             data-scroll="true" data-height="300" data-mobile-height="200">
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-line-chart kt-font-success"/>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New order has been received
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        2 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-box-1 kt-font-brand"/>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New customer is registered
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        3 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-chart2 kt-font-danger"/>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        Application has been approved
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        3 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-image-file kt-font-warning"/>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New file has been uploaded
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        5 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-drop kt-font-info"/>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New user feedback received
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        8 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-pie-chart-2 kt-font-success"/>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        System reboot has been successfully completed
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        12 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-favourite kt-font-danger"/>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New order has been placed
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        15 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link"
                                               className="kt-notification__item kt-notification__item--read">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-safe kt-font-primary"></i>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        Company meeting canceled
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        19 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-psd kt-font-success"></i>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New report has been received
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        23 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon-download-1 kt-font-danger"/>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        Finance report has been generated
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        25 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon-security kt-font-warning"/>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New customer comment recieved
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        2 days ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-pie-chart kt-font-success"/>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New customer is registered
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        3 days ago
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="tab-pane" id="topbar_notifications_events" role="tabpanel">
                                        <div className="kt-notification kt-margin-t-10 kt-margin-b-10 kt-scroll"
                                             data-scroll="true" data-height="300" data-mobile-height="200">
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-psd kt-font-success"/>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New report has been received
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        23 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon-download-1 kt-font-danger"/>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        Finance report has been generated
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        25 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-line-chart kt-font-success"></i>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New order has been received
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        2 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-box-1 kt-font-brand"></i>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New customer is registered
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        3 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-chart2 kt-font-danger"></i>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        Application has been approved
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        3 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-image-file kt-font-warning"></i>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New file has been uploaded
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        5 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-drop kt-font-info"></i>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New user feedback received
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        8 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-pie-chart-2 kt-font-success"></i>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        System reboot has been successfully completed
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        12 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-favourite kt-font-brand"></i>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New order has been placed
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        15 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link"
                                               className="kt-notification__item kt-notification__item--read">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-safe kt-font-primary"></i>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        Company meeting canceled
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        19 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-psd kt-font-success"></i>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New report has been received
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        23 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon-download-1 kt-font-danger"></i>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        Finance report has been generated
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        25 hrs ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon-security kt-font-warning"></i>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New customer comment recieved
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        2 days ago
                                                    </div>
                                                </div>
                                            </a>
                                            <a href="#link" className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-pie-chart kt-font-success"></i>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title">
                                                        New customer is registered
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        3 days ago
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="tab-pane" id="topbar_notifications_logs" role="tabpanel">
                                        <div className="kt-grid kt-grid--ver" style={{minHeight: "200px"}}>
                                            <div
                                                className="kt-grid kt-grid--hor kt-grid__item kt-grid__item--fluid kt-grid__item--middle">
                                                <div className="kt-grid__item kt-grid__item--middle kt-align-center">
                                                    All caught up!
                                                    <br/>No new notifications.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="kt-header__topbar-item dropdown">
                        <div className="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px">
                            <span className="kt-header__topbar-icon"><i className="flaticon2-gear"/></span>
                        </div>
                        <div
                            className="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-xl">
                            <form>
                                <div className="kt-head kt-head--skin-light">
                                    <h3 className="kt-head__title">
                                        User Quick Actions
                                        <span className="kt-space-15"/>
                                        <span
                                            className="btn btn-success btn-sm btn-bold btn-font-md">23 tasks pending</span>
                                    </h3>
                                </div>

                                <div className="kt-grid-nav kt-grid-nav--skin-light">
                                    <div className="kt-grid-nav__row">
                                        <a href="#link" className="kt-grid-nav__item">
                                        <span className="kt-grid-nav__icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g
                                                fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z"/><path
                                                d="M4.362 10.276l.5-1A.5.5 0 015.309 9h9.882a.5.5 0 01.447.724l-.5 1a.5.5 0 01-.447.276H4.809a.5.5 0 01-.447-.724zm10.276 3.448l-.5 1a.5.5 0 01-.447.276H4.809a.5.5 0 01-.447-.724l.5-1A.5.5 0 015.309 13h8.882a.5.5 0 01.447.724z"
                                                fill="#000" opacity=".3"/><path
                                                d="M17.369 7.618a3.388 3.388 0 00-1.533-1.166 5.079 5.079 0 00-1.848-.367c-.77 0-1.47.14-2.1.42-.63.28-1.172.665-1.627 1.155a5.132 5.132 0 00-1.05 1.722 6.091 6.091 0 00-.368 2.142c0 .812.119 1.554.357 2.226a5.02 5.02 0 001.019 1.732c.44.484.969.858 1.585 1.124.616.266 1.309.399 2.079.399.798 0 1.505-.157 2.121-.473a4.146 4.146 0 001.491-1.249l2.121 1.491a6.796 6.796 0 01-2.415 1.921c-.952.456-2.065.683-3.339.683-1.162 0-2.23-.192-3.203-.578a7.378 7.378 0 01-2.509-1.617 7.361 7.361 0 01-1.638-2.477c-.392-.96-.588-2.02-.588-3.182 0-1.19.206-2.264.62-3.223a7.179 7.179 0 011.7-2.447A7.552 7.552 0 0110.796 4.3c.98-.364 2.044-.546 3.192-.546.476 0 .973.045 1.491.136a7.585 7.585 0 011.491.42c.476.19.924.424 1.344.704.42.28.777.616 1.071 1.008l-2.016 1.596z"
                                                fill="#000"/></g></svg>
                                        </span>
                                            <span className="kt-grid-nav__title">Accounting</span>
                                            <span className="kt-grid-nav__desc">eCommerce</span>
                                        </a>
                                        <a href="#link" className="kt-grid-nav__item">
                                        <span className="kt-grid-nav__icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g
                                                fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z"/><path
                                                d="M14.857 13c.093-.278.143-.574.143-.881V6.881C15 5.29 13.657 4 12 4h-.273C10.221 4 9 5.173 9 6.619h1.09c0-.868.734-1.571 1.637-1.571H12c1.054 0 1.91.82 1.91 1.833v5.238c0 .32-.086.62-.235.881h-3.35a1.768 1.768 0 01-.234-.881V9.5c0-.434.366-.786.818-.786.452 0 .818.352.818.786v1.833h1.091V9.5c0-1.013-.855-1.833-1.909-1.833S9 8.487 9 9.5v2.619c0 .307.05.603.143.881H6a1 1 0 01-1-1V3a1 1 0 011-1h12a1 1 0 011 1v9a1 1 0 01-1 1h-3.143z"
                                                fill="#000" opacity=".3"/><path
                                                d="M9 10.333v1.786C9 13.71 10.343 15 12 15s3-1.29 3-2.881v-1.786l5.207-3.76a.5.5 0 01.793.405V17a2 2 0 01-2 2H5a2 2 0 01-2-2V6.978a.5.5 0 01.793-.405L9 10.333zm1.09.788L12 12.5l1.91-1.379v.998c0 1.013-.856 1.833-1.91 1.833-1.054 0-1.91-.82-1.91-1.833v-.998z"
                                                fill="#000"/></g></svg>
                                        </span>
                                            <span className="kt-grid-nav__title">Administration</span>
                                            <span className="kt-grid-nav__desc">Console</span>
                                        </a>
                                    </div>
                                    <div className="kt-grid-nav__row">
                                        <a href="#link" className="kt-grid-nav__item">
                                        <span className="kt-grid-nav__icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g
                                                fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z"/><path
                                                d="M4 9.675l6.88 3.972a.89.89 0 00.231.093v7.704l-6.62-3.918a1 1 0 01-.491-.86V9.675zm16-.106v7.097a1 1 0 01-.49.86l-6.621 3.918v-7.771a.903.903 0 00.048-.026L20 9.569z"
                                                fill="#000"/><path
                                                d="M4.216 7.747a.999.999 0 01.314-.262l7-3.728a1 1 0 01.94 0l7 3.728c.095.05.18.116.253.191l-7.675 4.431a.893.893 0 00-.14.1.893.893 0 00-.139-.1l-7.553-4.36z"
                                                fill="#000" opacity=".3"/></g></svg>
                                        </span>
                                            <span className="kt-grid-nav__title">Projects</span>
                                            <span className="kt-grid-nav__desc">Pending Tasks</span>
                                        </a>
                                        <a href="#link" className="kt-grid-nav__item">
                                        <span className="kt-grid-nav__icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g
                                                fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z"/><path
                                                d="M18 14a3 3 0 110-6 3 3 0 010 6zm-9-3a4 4 0 110-8 4 4 0 010 8z"
                                                fill="#000" fillRule="nonzero" opacity=".3"/><path
                                                d="M17.601 15c3.407.038 6.188 1.76 6.397 5.4.009.147 0 .6-.542.6H19.6c0-2.25-.744-4.328-1.999-6zm-17.6 5.2C.388 15.426 4.26 13 8.983 13c4.788 0 8.722 2.293 9.015 7.2.012.195 0 .8-.751.8H.727c-.25 0-.747-.54-.726-.8z"
                                                fill="#000" fillRule="nonzero"/></g></svg>
                                        </span>
                                            <span className="kt-grid-nav__title">Customers</span>
                                            <span className="kt-grid-nav__desc">Latest cases</span>
                                        </a>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>

                    <div className="kt-header__topbar-item dropdown">
                        <div className="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px">
                            <span className="kt-header__topbar-icon"><i className="flaticon2-shopping-cart-1"/></span>
                        </div>
                        <div
                            className="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-xl">
                            <form>
                                <div className="kt-mycart">
                                    <div className="kt-mycart__head kt-head"
                                         style={{backgroundImage: "url(assets/media/misc/bg-1.jpg)"}}>
                                        <div className="kt-mycart__info">
                                            <span className="kt-mycart__icon"><i
                                                className="flaticon2-shopping-cart-1 kt-font-success"/></span>
                                            <h3 className="kt-mycart__title">My Cart</h3>
                                        </div>
                                        <div className="kt-mycart__button">
                                            <button type="button" className="btn btn-success btn-sm">2 Items</button>
                                        </div>
                                    </div>
                                    <div className="kt-mycart__body kt-scroll" data-scroll="true" data-height="245"
                                         data-mobile-height="200">
                                        <div className="kt-mycart__item">
                                            <div className="kt-mycart__container">
                                                <div className="kt-mycart__info">
                                                    <a href="#link" className="kt-mycart__title">
                                                        Samsung
                                                    </a>
                                                    <span className="kt-mycart__desc">
                                                    Profile info, Timeline etc
                                                </span>
                                                    <div className="kt-mycart__action">
                                                        <span className="kt-mycart__price">$ 450</span>
                                                        <span className="kt-mycart__text">for</span>
                                                        <span className="kt-mycart__quantity">7</span>
                                                        <a href="#link"
                                                           className="btn btn-label-success btn-icon">&minus;</a>
                                                        <a href="#link"
                                                           className="btn btn-label-success btn-icon">&plus;</a>
                                                    </div>
                                                </div>
                                                <a href="#link" className="kt-mycart__pic">
                                                    <img src="/assets/media/products/product9.jpg" title=""/>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="kt-mycart__item">
                                            <div className="kt-mycart__container">
                                                <div className="kt-mycart__info">
                                                    <a href="#link" className="kt-mycart__title">
                                                        Panasonic
                                                    </a>
                                                    <span className="kt-mycart__desc">
                                                    For PHoto & Others
                                                </span>
                                                    <div className="kt-mycart__action">
                                                        <span className="kt-mycart__price">$ 329</span>
                                                        <span className="kt-mycart__text">for</span>
                                                        <span className="kt-mycart__quantity">1</span>
                                                        <a href="#link"
                                                           className="btn btn-label-success btn-icon">&minus;</a>
                                                        <a href="#link"
                                                           className="btn btn-label-success btn-icon">&plus;</a>
                                                    </div>
                                                </div>
                                                <a href="#link" className="kt-mycart__pic">
                                                    <img src="/assets/media/products/product13.jpg" title=""/>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="kt-mycart__item">
                                            <div className="kt-mycart__container">
                                                <div className="kt-mycart__info">
                                                    <a href="#link" className="kt-mycart__title">
                                                        Fujifilm
                                                    </a>
                                                    <span className="kt-mycart__desc">
                                                    Profile info, Timeline etc
                                                </span>
                                                    <div className="kt-mycart__action">
                                                        <span className="kt-mycart__price">$ 520</span>
                                                        <span className="kt-mycart__text">for</span>
                                                        <span className="kt-mycart__quantity">6</span>
                                                        <a href="#link"
                                                           className="btn btn-label-success btn-icon">&minus;</a>
                                                        <a href="#link"
                                                           className="btn btn-label-success btn-icon">&plus;</a>
                                                    </div>
                                                </div>
                                                <a href="#link" className="kt-mycart__pic">
                                                    <img src="/assets/media/products/product16.jpg" title=""/>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="kt-mycart__item">
                                            <div className="kt-mycart__container">
                                                <div className="kt-mycart__info">
                                                    <a href="#link" className="kt-mycart__title">
                                                        Candy Machine
                                                    </a>
                                                    <span className="kt-mycart__desc">
                                                    For PHoto & Others
                                                </span>
                                                    <div className="kt-mycart__action">
                                                        <span className="kt-mycart__price">$ 784</span>
                                                        <span className="kt-mycart__text">for</span>
                                                        <span className="kt-mycart__quantity">4</span>
                                                        <a href="#link"
                                                           className="btn btn-label-success btn-icon">&minus;</a>
                                                        <a href="#link"
                                                           className="btn btn-label-success btn-icon">&plus;</a>
                                                    </div>
                                                </div>
                                                <a href="#link" className="kt-mycart__pic">
                                                    <img src="/assets/media/products/product15.jpg" title="" alt=""/>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="kt-mycart__footer">
                                        <div className="kt-mycart__section">
                                            <div className="kt-mycart__subtitel">
                                                <span>Sub Total</span>
                                                <span>Taxes</span>
                                                <span>Total</span>
                                            </div>
                                            <div className="kt-mycart__prices">
                                                <span>$ 840.00</span>
                                                <span>$ 72.00</span>
                                                <span className="kt-font-brand">$ 912.00</span>
                                            </div>
                                        </div>
                                        <div className="kt-mycart__button kt-align-right">
                                            <button type="button" className="btn btn-primary btn-sm">Place Order
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="kt-header__topbar-item" data-toggle="kt-tooltip" title="Quick panel"
                         data-placement="top">
                        <div className="kt-header__topbar-wrapper">
                            <span className="kt-header__topbar-icon" id="kt_quick_panel_toggler_btn"><i
                                className="flaticon2-menu-2"/></span>
                        </div>
                    </div>

                    <div className="kt-header__topbar-item kt-header__topbar-item--langs">
                        <div className="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px">
                        <span className="kt-header__topbar-icon">
                            <img className="" src={props.language.countryLanguageImage[props.language.languageSelected]}
                                 alt=""/>
                        </span>
                        </div>
                        <div className="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim">
                            <ul className="kt-nav kt-margin-t-10 kt-margin-b-10">
                                <li className="kt-nav__item kt-nav__item--active">
                                    <a href="#link" onClick={(e) => onClickLanguage(e, "en")} className="kt-nav__link">
                                        <span className="kt-nav__link-icon"><img
                                            src="/assets/media/flags/226-united-states.svg" alt=""/></span>
                                        <span className="kt-nav__link-text">English</span>
                                    </a>
                                </li>
                                <li className="kt-nav__item">
                                    <a href="#link" onClick={(e) => onClickLanguage(e, "sp")} className="kt-nav__link">
                                        <span className="kt-nav__link-icon"><img src="/assets/media/flags/128-spain.svg"
                                                                                 alt=""/></span>
                                        <span className="kt-nav__link-text">Spanish</span>
                                    </a>
                                </li>
                                <li className="kt-nav__item">
                                    <a href="#link" onClick={(e) => onClickLanguage(e, "gm")} className="kt-nav__link">
                                        <span className="kt-nav__link-icon"><img
                                            src="/assets/media/flags/162-germany.svg" alt=""/></span>
                                        <span className="kt-nav__link-text">German</span>
                                    </a>
                                </li>

                                <li className="kt-nav__item">
                                    <a href="#link" onClick={(e) => onClickLanguage(e, "fr")} className="kt-nav__link">
                                        <span className="kt-nav__link-icon"><img src="/personal/img/flag-fr.png"
                                                                                 alt=""/></span>
                                        <span className="kt-nav__link-text">Francais</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="kt-header__topbar-item kt-header__topbar-item--user">
                        <div className="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px">
                            <span className="kt-header__topbar-welcome kt-visible-desktop">Salut,</span>
                            <span
                                className="kt-header__topbar-username kt-visible-desktop">{props.user.firstName}</span>
                            <img alt="Pic" src="/assets/media/users/300_21.jpg"/>
                            <span className="kt-header__topbar-icon kt-bg-brand kt-hidden"><b>S</b></span>
                        </div>
                        <div
                            className="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-xl">
                            <div className="kt-user-card kt-user-card--skin-light kt-notification-item-padding-x">
                                <div className="kt-user-card__avatar">
                                    <img className="kt-hidden-" alt="Pic" src="/assets/media/users/300_25.jpg"/>
                                    <span
                                        className="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold kt-hidden">S</span>
                                </div>
                                <div className="kt-user-card__name">
                                    {props.user.lastName + " " + props.user.firstName}
                                </div>
                                <div className="kt-user-card__badge">
                                    <span
                                        className="btn btn-label-primary btn-sm btn-bold btn-font-md">23 messages</span>
                                </div>
                            </div>

                            <div className="kt-notification">
                                <a href="custom/apps/user/profile-1/personal-information.html"
                                   className="kt-notification__item">
                                    <div className="kt-notification__item-icon">
                                        <i className="flaticon2-calendar-3 kt-font-success"></i>
                                    </div>
                                    <div className="kt-notification__item-details">
                                        <div className="kt-notification__item-title kt-font-bold">
                                            My Profile
                                        </div>
                                        <div className="kt-notification__item-time">
                                            Account settings and more
                                        </div>
                                    </div>
                                </a>
                                <Link to="/chat" className="kt-notification__item">
                                    <div className="kt-notification__item-icon">
                                        <i className="flaticon2-mail kt-font-warning"></i>
                                    </div>
                                    <div className="kt-notification__item-details">
                                        <div className="kt-notification__item-title kt-font-bold">
                                            Mes Discussions
                                        </div>
                                        <div className="kt-notification__item-time">
                                            Inbox pour répondre
                                        </div>
                                    </div>
                                </Link>
                                <a href="custom/apps/user/profile-2.html" className="kt-notification__item">
                                    <div className="kt-notification__item-icon">
                                        <i className="flaticon2-rocket-1 kt-font-danger"></i>
                                    </div>
                                    <div className="kt-notification__item-details">
                                        <div className="kt-notification__item-title kt-font-bold">
                                            My Activities
                                        </div>
                                        <div className="kt-notification__item-time">
                                            Logs and notifications
                                        </div>
                                    </div>
                                </a>
                                <a href="custom/apps/user/profile-3.html" className="kt-notification__item">
                                    <div className="kt-notification__item-icon">
                                        <i className="flaticon2-hourglass kt-font-brand"></i>
                                    </div>
                                    <div className="kt-notification__item-details">
                                        <div className="kt-notification__item-title kt-font-bold">
                                            My Tasks
                                        </div>
                                        <div className="kt-notification__item-time">
                                            latest tasks and projects
                                        </div>
                                    </div>
                                </a>

                                <Link to="/feedback-channels"  className="kt-notification__item">
                                    <div className="kt-notification__item-icon">
                                        <i className="flaticon2-cardiogram kt-font-warning"></i>
                                    </div>
                                    <div className="kt-notification__item-details">
                                        <div className="kt-notification__item-title kt-font-bold">
                                            Canaux
                                        </div>
                                        <div className="kt-notification__item-time">
                                            Les canaux du personnel
                                        </div>
                                    </div>
                                </Link>

                                <div className="kt-notification__custom kt-space-between">
                                    <a href="/logout" onClick={onClickLogoutLink} target="_blank"
                                       className="btn btn-label btn-label-brand btn-sm btn-bold">Déconnexion</a>
                                    <a href="custom/user/login-v2.html" target="_blank"
                                       className="btn btn-clean btn-sm btn-bold">Upgrade Plan</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*Modale form*/}

        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        language: state.language,
        plan: state.plan.plan,
        user: {
            lastName: state.user.user.data.identite.lastname,
            firstName: state.user.user.data.identite.firstname
        }
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeLanguage: (language) => {
            dispatch(LanguageAction.changeLanguage(language))
        },
        logoutUser: () => dispatch(authActions.logoutUser()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
