import React from "react";
import {
    NavLink
} from "react-router-dom";
import {connect} from "react-redux";
import {verifyPermission} from "../../helpers/permission";

const Aside = (props) => {
    return (
        <div className="kt-aside  kt-aside--fixed  kt-grid__item kt-grid kt-grid--desktop kt-grid--hor-desktop"
             id="kt_aside">
            <div className="kt-aside-menu-wrapper kt-grid__item kt-grid__item--fluid" id="kt_aside_menu_wrapper">
                <div id="kt_aside_menu" className="kt-aside-menu " data-ktmenu-vertical="1" data-ktmenu-scroll="1">
                    <ul className="kt-menu__nav ">
                        <li className="kt-menu__item " aria-haspopup="true">
                            <a href="/" className="kt-menu__link ">
                                <i className="kt-menu__link-icon flaticon2-architecture-and-city"/>
                                <span className="kt-menu__link-text">Dashboard</span>
                            </a>
                        </li>
                        <li className="kt-menu__section ">
                            <h4 className="kt-menu__section-text">Paramètres</h4>
                            <i className="kt-menu__section-icon flaticon-more-v2"/>
                        </li>
                        <li className="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true"
                            data-ktmenu-submenu-toggle="hover">
                            <a href="#parameter" onClick={e => e.preventDefault()}
                               className="kt-menu__link kt-menu__toggle">
                                <i className="kt-menu__link-icon flaticon-settings"/>
                                <span className="kt-menu__link-text">Paramètres</span>
                                <i className="kt-menu__ver-arrow la la-angle-right"/>
                            </a>
                            <div className="kt-menu__submenu "><span className="kt-menu__arrow"/>
                                <ul className="kt-menu__subnav">
                                    <li className="kt-menu__item  kt-menu__item--parent" aria-haspopup="true">
                                        <span className="kt-menu__link">
                                            <span className="kt-menu__link-text">Paramètres</span>
                                        </span>
                                    </li>

                                    {
                                        verifyPermission(props.userPermissions, "update-sms-parameters") ? (
                                            <NavLink exact to="/settings/sms" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                <li className="kt-menu__link ">
                                                    <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                    <span className="kt-menu__link-text">SMS</span>
                                                </li>
                                            </NavLink>
                                        ) : ""
                                    }

                                    {
                                        verifyPermission(props.userPermissions, 'update-mail-parameters') ? (
                                            <NavLink exact to="/settings/mail" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                <li className="kt-menu__link ">
                                                    <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                    <span className="kt-menu__link-text">Mail</span>
                                                </li>
                                            </NavLink>
                                        ) : ""
                                    }

                                    <NavLink exact to="/settings/institution" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <li className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">Institution</span>
                                        </li>
                                    </NavLink>

                                    <NavLink exact to="/settings/institution/type" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <li className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">Type Institution</span>
                                        </li>
                                    </NavLink>

                                    <NavLink exact to="/settings/faqs/list" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <li className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">FAQs</span>
                                        </li>
                                    </NavLink>

                                    <NavLink exact to="/settings/faqs/add" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <li className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">Editer FAQs</span>
                                        </li>
                                    </NavLink>

                                    <NavLink exact to="/settings/faqs/category" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <li className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">Catégorie FAQs</span>
                                        </li>
                                    </NavLink>

                                    <NavLink exact to="/settings/clients" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <li className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">Clients</span>
                                        </li>
                                    </NavLink>
                                    {
                                        verifyPermission(props.userPermissions, 'update-category-client')?
                                            <NavLink to="/settings/clients/category" className="kt-menu__item "
                                                     activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                <li className="kt-menu__link ">
                                                    <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                    <span className="kt-menu__link-text">Catégorie Clients </span>
                                                </li>
                                            </NavLink>
                                            :""
                                    }

                                    {
                                        verifyPermission(props.userPermissions, "list-type-client") ?
                                            <NavLink to="/settings/clients/type" className="kt-menu__item "
                                                     activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                <li className="kt-menu__link ">
                                                    <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                    <span className="kt-menu__link-text">Type Clients </span>
                                                </li>
                                            </NavLink>
                                            : ""
                                    }

                                    {
                                        verifyPermission(props.userPermissions, "list-performance-indicator") ? (
                                            <NavLink exact to="/settings/performance_indicator" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                <li className="kt-menu__link ">
                                                    <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                    <span className="kt-menu__link-text">Indicateur de performance</span>
                                                </li>
                                            </NavLink>
                                        ) : ""
                                    }


                                    {
                                        verifyPermission(props.userPermissions, 'list-unit-type') ? (
                                            <NavLink exact to="/settings/unit_type" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                <li className="kt-menu__link ">
                                                    <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                    <span className="kt-menu__link-text">Type d'unité</span>
                                                </li>
                                            </NavLink>
                                        ) : ""
                                    }

                                    {
                                        verifyPermission(props.userPermissions, 'list-any-unit') || verifyPermission(props.userPermissions, 'list-my-unit') || verifyPermission(props.userPermissions, 'list-without-link-unit') ? (
                                            <NavLink exact to="/settings/unit" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                <li className="kt-menu__link ">
                                                    <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                    <span className="kt-menu__link-text">Unité</span>
                                                </li>
                                            </NavLink>
                                        ) : ""
                                    }

                                    {
                                        verifyPermission(props.userPermissions, 'list-position') ? (
                                            <NavLink exact to="/settings/positions" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                <li className="kt-menu__link ">
                                                    <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                    <span className="kt-menu__link-text">Position</span>
                                                </li>
                                            </NavLink>
                                        ) : ""
                                    }

                                    {
                                        verifyPermission(props.userPermissions, 'list-claim-category') ? (
                                            <NavLink exact to="/settings/claim_categories" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                <li className="kt-menu__link ">
                                                    <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                    <span className="kt-menu__link-text">Catégorie de plainte</span>
                                                </li>
                                            </NavLink>
                                        ) : ""
                                    }

                                    {
                                        verifyPermission(props.userPermissions, 'list-claim-object') ? (
                                            <NavLink exact to="/settings/claim_objects" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                <li className="kt-menu__link ">
                                                    <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                    <span className="kt-menu__link-text">Objet de plainte</span>
                                                </li>
                                            </NavLink>
                                        ) : ""
                                    }

                                    {
                                        verifyPermission(props.userPermissions, "list-staff-from-any-unit") || verifyPermission(props.userPermissions, 'list-staff-from-my-unit') || verifyPermission(props.userPermissions, 'list-staff-from-maybe-no-unit') ? (
                                            <NavLink exact to="/settings/staffs" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                <li className="kt-menu__link ">
                                                    <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                    <span className="kt-menu__link-text">Agent</span>
                                                </li>
                                            </NavLink>
                                        ) : ""
                                    }

                                    {
                                        verifyPermission(props.userPermissions, 'list-severity-level') ? (
                                            <NavLink exact to="/settings/severities" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                <li className="kt-menu__link ">
                                                    <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                    <span className="kt-menu__link-text">Niveau de gravité</span>
                                                </li>
                                            </NavLink>
                                        ) : ""
                                    }
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(Aside);
