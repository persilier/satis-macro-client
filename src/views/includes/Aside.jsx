import React from "react";
import {
    NavLink
} from "react-router-dom";

const Aside = () => {
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
                            <a href="javascript:;" className="kt-menu__link kt-menu__toggle">
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

                                    <NavLink to="/settings/sms" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <NavLink to="/settings/sms" className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">SMS</span>
                                        </NavLink>
                                    </NavLink>

                                    <NavLink to="/settings/mail" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <NavLink to="/settings/mail" className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">Mail</span>
                                        </NavLink>
                                    </NavLink>

                                    <NavLink to="/settings/institution" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <NavLink to="/settings/institution" className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">Institution</span>
                                        </NavLink>
                                    </NavLink>

                                    <NavLink to="/settings/user" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <NavLink to="/settings/user" className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">Utilisateur</span>
                                        </NavLink>
                                    </NavLink>

                                    <li className="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true"
                                        data-ktmenu-submenu-toggle="hover">
                                        <a href="javascript:;" className="kt-menu__link kt-menu__toggle">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
                                            <span className="kt-menu__link-text">FAQs</span>
                                        <i className="kt-menu__ver-arrow la la-angle-right"></i>
                                        </a>
                                        <div className="kt-menu__submenu "><span className="kt-menu__arrow"></span>
                                            <ul className="kt-menu__subnav">
                                                <li className="kt-menu__item " aria-haspopup="true">
                                                    <NavLink to="/settings/faqs/list"  className="kt-menu__link ">
                                                        <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
                                                        <span className="kt-menu__link-text">FAQs</span>
                                                    </NavLink>
                                                </li>
                                                <li className="kt-menu__item " aria-haspopup="true">
                                                    <NavLink to="/settings/faqs/add" className="kt-menu__link ">
                                                        <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
                                                        <span className="kt-menu__link-text">Editer FAQ</span></NavLink>
                                                </li>
                                                <li className="kt-menu__item " aria-haspopup="true">
                                                    <NavLink to="/settings/faqs/category"  className="kt-menu__link "
                                                    ><i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>
                                                        <span className="kt-menu__link-text">Catégorie FAQ</span>
                                                    </NavLink>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>

                                    <NavLink to="/settings/performance_indicator" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <NavLink to="/settings/performance_indicator" className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">Indicateur de performance</span>
                                        </NavLink>
                                    </NavLink>

                                    <NavLink to="/settings/unit_type" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <NavLink to="/settings/unit_type" className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">Type d'unité</span>
                                        </NavLink>
                                    </NavLink>

                                    <NavLink to="/settings/unit" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <NavLink to="/settings/unit" className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">Unité</span>
                                        </NavLink>
                                    </NavLink>

                                    <NavLink to="/settings/positions" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <NavLink to="/settings/positions" className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">Position</span>
                                        </NavLink>
                                    </NavLink>

                                    <NavLink to="/settings/claim_categories" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <NavLink to="/settings/claim_categories" className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">Catégorie de plainte</span>
                                        </NavLink>
                                    </NavLink>

                                    <NavLink to="/settings/claim_objects" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <NavLink to="/settings/claim_objects" className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">Objet de plainte</span>
                                        </NavLink>
                                    </NavLink>

                                    <NavLink to="/settings/staffs" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                        <NavLink to="/settings/staffs" className="kt-menu__link ">
                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                            <span className="kt-menu__link-text">Agent</span>
                                        </NavLink>
                                    </NavLink>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Aside;
