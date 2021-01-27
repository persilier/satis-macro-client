import React from "react";
import {
    NavLink
} from "react-router-dom";
import {connect} from "react-redux";
import {verifyPermission} from "../../helpers/permission";
import {seeCollect, seeHistorique, seeMonitoring, seeParameters, seeTreatment} from "../../helpers/function";

const Aside = (props) => {
    return (
        <div className="kt-aside  kt-aside--fixed  kt-grid__item kt-grid kt-grid--desktop kt-grid--hor-desktop"
             id="kt_aside">
            <div className="kt-aside-menu-wrapper kt-grid__item kt-grid__item--fluid" id="kt_aside_menu_wrapper">
                <div id="kt_aside_menu" className="kt-aside-menu " data-ktmenu-vertical="1" data-ktmenu-scroll="1">
                    <ul className="kt-menu__nav ">
                        <li className="kt-menu__item " aria-haspopup="true">
                            <NavLink exact to="/dashboard" className="kt-menu__link" activeClassName="kt-menu__item--active">
                                <i className="kt-menu__link-icon flaticon2-architecture-and-city"/>
                                <span className="kt-menu__link-text">Tableau de bord</span>
                            </NavLink>
                        </li>

                        {
                            seeCollect(props.userPermissions) || seeTreatment(props.userPermissions) ? (
                                <li className="kt-menu__section ">
                                    <h4 className="kt-menu__section-text">Processus</h4>
                                    <i className="kt-menu__section-icon flaticon-more-v2"/>
                                </li>
                            ) : null
                        }

                        {
                            !seeCollect(props.userPermissions) ? null : (
                                <li className="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true"
                                    data-ktmenu-submenu-toggle="hover">
                                    <a href="#collecte" onClick={e => e.preventDefault()}
                                       className="kt-menu__link kt-menu__toggle">
                                        <i className="kt-menu__link-icon flaticon2-telegram-logo"/>
                                        <span className="kt-menu__link-text">Collecte</span>
                                        <i className="kt-menu__ver-arrow la la-angle-right"/>
                                    </a>
                                    <div className="kt-menu__submenu ">
                                        <span className="kt-menu__arrow"/>
                                        <ul className="kt-menu__subnav">
                                            <li className="kt-menu__item  kt-menu__item--parent" aria-haspopup="true">
                                                <span className="kt-menu__link">
                                                    <span className="kt-menu__link-text">Collecte</span>
                                                </span>
                                            </li>

                                            {
                                                verifyPermission(props.userPermissions, 'store-claim-against-any-institution') || verifyPermission(props.userPermissions, "store-claim-against-my-institution") || verifyPermission(props.userPermissions, "store-claim-without-client") ? (
                                                    <NavLink exact to="/process/claims/add" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                        <li className="kt-menu__link ">
                                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                            <span className="kt-menu__link-text">Enregistrer réclamation</span>
                                                        </li>
                                                    </NavLink>
                                                ) : null
                                            }
                                            {
                                                verifyPermission(props.userPermissions, 'list-claim-incomplete-against-any-institution') ||
                                                verifyPermission(props.userPermissions, "list-claim-incomplete-against-my-institution")||
                                                verifyPermission(props.userPermissions, "list-claim-incomplete-without-client")? (
                                                    <NavLink exact to="/process/incomplete_claims" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                        <li className="kt-menu__link ">
                                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                            <span className="kt-menu__link-text">Réclamation incomplète</span>
                                                        </li>
                                                    </NavLink>
                                                ) : null
                                            }

                                        </ul>
                                    </div>
                                </li>
                            )
                        }

                        {
                            !seeTreatment(props.userPermissions) ? null : (
                                <li className="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                                    <a href="#treatement" onClick={e => e.preventDefault()}
                                       className="kt-menu__link kt-menu__toggle">
                                        <i className="kt-menu__link-icon flaticon-network"/>
                                        <span className="kt-menu__link-text">Traitement</span>
                                        <i className="kt-menu__ver-arrow la la-angle-right"/>
                                    </a>
                                    <div className="kt-menu__submenu ">
                                        <span className="kt-menu__arrow"/>
                                        <ul className="kt-menu__subnav">
                                            <li className="kt-menu__item  kt-menu__item--parent" aria-haspopup="true">
                                                <span className="kt-menu__link">
                                                    <span className="kt-menu__link-text">Traitement</span>
                                                </span>
                                            </li>

                                            {
                                                verifyPermission(props.userPermissions, "show-claim-awaiting-assignment") && props.activePilot ? (
                                                    <NavLink exact to="/process/claim-assign" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                        <li className="kt-menu__link ">
                                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                            <span className="kt-menu__link-text">Réclamations à tranférer</span>
                                                        </li>
                                                    </NavLink>
                                                ) : null
                                            }

                                            {
                                                verifyPermission(props.userPermissions, 'list-claim-awaiting-treatment') ? (
                                                    <NavLink exact to="/process/unit-claims" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                        <li className="kt-menu__link ">
                                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                            <span className="kt-menu__link-text">Liste des réclamations</span>
                                                        </li>
                                                    </NavLink>
                                                ) : null
                                            }

                                            {
                                                verifyPermission(props.userPermissions,"list-claim-assignment-to-staff") ? (
                                                    <NavLink exact to="/process/claim-assign/to-staff" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                        <li className="kt-menu__link ">
                                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                            <span className="kt-menu__link-text">Réclamations à traiter</span>
                                                        </li>
                                                    </NavLink>
                                                ) : null
                                            }

                                            {
                                                (verifyPermission(props.userPermissions, 'list-claim-awaiting-validation-my-institution') || verifyPermission(props.userPermissions, 'list-claim-awaiting-validation-any-institution')) && props.activePilot ? (
                                                    <NavLink exact to="/process/claim-to-validated" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                        <li className="kt-menu__link ">
                                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                            <span className="kt-menu__link-text">Réclamations à valider</span>
                                                        </li>
                                                    </NavLink>
                                                ) : null
                                            }
                                            {
                                                verifyPermission(props.userPermissions, 'list-satisfaction-measured-any-claim')||
                                                verifyPermission(props.userPermissions, 'list-satisfaction-measured-my-claim')?(
                                                    <NavLink exact to="/process/claim_measure" className="kt-menu__item "
                                                             activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                        <li className="kt-menu__link ">
                                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                            <span className="kt-menu__link-text">Mesure de Satisfaction</span>
                                                        </li>
                                                    </NavLink>
                                                ) : null
                                            }
                                            {
                                                verifyPermission(props.userPermissions, 'list-any-claim-archived')||
                                                verifyPermission(props.userPermissions, 'list-my-claim-archived')?(
                                                    <NavLink exact to="/process/claim_archived" className="kt-menu__item "
                                                             activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                        <li className="kt-menu__link ">
                                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                            <span className="kt-menu__link-text">Archives</span>
                                                        </li>
                                                    </NavLink>
                                                ) : null
                                            }
                                            {
                                                verifyPermission(props.userPermissions, 'list-my-discussions')||
                                                verifyPermission(props.userPermissions, 'contribute-discussion')?(
                                                    <NavLink exact to="/chat" className="kt-menu__item "
                                                             activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                        <li className="kt-menu__link ">
                                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                            <span className="kt-menu__link-text">Discussions</span>
                                                        </li>
                                                    </NavLink>
                                                ) : null
                                            }



                                        </ul>
                                    </div>
                                </li>
                            )
                        }

                        {
                            !seeMonitoring(props.userPermissions) ? null : (
                                <>
                                    <li className="kt-menu__section ">
                                        <h4 className="kt-menu__section-text">Monitoring</h4>
                                        <i className="kt-menu__section-icon flaticon-more-v2"/>
                                    </li>

                                    {
                                        verifyPermission(props.userPermissions, 'list-monitoring-claim-any-institution') || verifyPermission(props.userPermissions, 'list-monitoring-claim-my-institution') ? (
                                            <NavLink exact to="/monitoring/claims/monitoring" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                <li className="kt-menu__link ">
                                                    <i className="kt-menu__link-icon flaticon2-heart-rate-monitor"/>
                                                    <span className="kt-menu__link-text">Suivi des réclamations</span>
                                                </li>
                                            </NavLink>
                                        ) : null
                                    }

                                    {
                                        verifyPermission(props.userPermissions, 'list-reporting-claim-any-institution') || verifyPermission(props.userPermissions, 'list-reporting-claim-my-institution') ? (
                                            <NavLink exact to="/monitoring/claims/reporting" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                <li className="kt-menu__link ">
                                                    <i className="kt-menu__link-icon flaticon2-heart-rate-monitor"/>
                                                    <span className="kt-menu__link-text">Reporting</span>
                                                </li>
                                            </NavLink>
                                        ) : null
                                    }
                                </>
                            )
                        }

                        {
                            !seeHistorique(props.userPermissions) ? null : (
                                <>
                                    <li className="kt-menu__section ">
                                        <h4 className="kt-menu__section-text">Historiques</h4>
                                        <i className="kt-menu__section-icon flaticon-more-v2"/>
                                    </li>
                                    <li className="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true"
                                        data-ktmenu-submenu-toggle="hover">
                                        <a href="#historique" onClick={e => e.preventDefault()}
                                           className="kt-menu__link kt-menu__toggle">
                                            <i className="kt-menu__link-icon flaticon2-telegram-logo"/>
                                            <span className="kt-menu__link-text">Historiques</span>
                                            <i className="kt-menu__ver-arrow la la-angle-right"/>
                                        </a>
                                        <div className="kt-menu__submenu ">
                                            <span className="kt-menu__arrow"/>
                                            <ul className="kt-menu__subnav">
                                                <li className="kt-menu__item  kt-menu__item--parent" aria-haspopup="true">
                                                <span className="kt-menu__link">
                                                    <span className="kt-menu__link-text">Historiques</span>
                                                </span>
                                                </li>

                                                {
                                                    verifyPermission(props.userPermissions, 'history-list-create-claim')? (
                                                        <NavLink exact to="/historic/claims/add" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Réclamations créées</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }
                                                {
                                                    verifyPermission(props.userPermissions, "history-list-treat-claim")? (
                                                        <NavLink exact to="/historic/claims/treat" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Réclamations traitées</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                            </ul>
                                        </div>
                                    </li>
                                </>
                            )
                        }


                        {
                            !seeParameters(props.userPermissions) ? null : (
                                <>
                                    <li className="kt-menu__section ">
                                        <h4 className="kt-menu__section-text">Paramètres</h4>
                                        <i className="kt-menu__section-icon flaticon-more-v2"/>
                                    </li>
                                    <li className="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
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
                                                    verifyPermission(props.userPermissions, "update-components-parameters")?(
                                                        <NavLink exact to="/settings/config" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Configuration</span>
                                                            </li>
                                                        </NavLink>
                                                    ):null

                                                }

                                                {/*{
                                                    verifyPermission(props.userPermissions, "update-sms-parameters") ? (
                                                        <NavLink exact to="/settings/sms" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">SMS</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }*/}

                                                {
                                                    verifyPermission(props.userPermissions, 'update-mail-parameters') ? (
                                                        <NavLink exact to="/settings/mail" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Envoie de mail</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "list-any-institution") ?
                                                        <NavLink to="/settings/institution" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Institution</span>
                                                            </li>
                                                        </NavLink>
                                                        : null
                                                }
                                                {
                                                    verifyPermission(props.userPermissions, "update-my-institution") ?
                                                        <NavLink to="/settings/institution/edit" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">My Institution</span>
                                                            </li>
                                                        </NavLink>
                                                        : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "update-claim-object-requirement") ?
                                                        <NavLink to="/settings/requirement" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text"> Exigences</span>
                                                            </li>
                                                        </NavLink>
                                                        : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, 'update-processing-circuit-my-institution') ||
                                                    verifyPermission(props.userPermissions, "update-processing-circuit-any-institution") ||
                                                    verifyPermission(props.userPermissions, "update-processing-circuit-without-institution")?
                                                        (
                                                            <NavLink to="/settings/processing-circuit" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                                <li className="kt-menu__link ">
                                                                    <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                    <span className="kt-menu__link-text"> Entités de Traitement</span>
                                                                </li>
                                                            </NavLink>
                                                        ): null

                                                }
                                                {
                                                    verifyPermission(props.userPermissions, "config-reporting-claim-any-institution")||
                                                    verifyPermission(props.userPermissions, "config-reporting-claim-my-institution")?
                                                        <NavLink to="/settings/rapport-auto" className="kt-menu__item "
                                                             activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                        <li className="kt-menu__link ">
                                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                            <span className="kt-menu__link-text"> Rapport Automatique</span>
                                                        </li>
                                                    </NavLink>:null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "update-relance-parameters")?(
                                                        <NavLink to="/settings/relance" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Configuration de Relance</span>
                                                            </li>
                                                        </NavLink>
                                                    ): null
                                                }

                                                        {/*<NavLink to="/settings/faqs/list" className="kt-menu__item "*/}
                                                        {/*         activeClassName="kt-menu__item--active" aria-haspopup="true">*/}
                                                        {/*    <li className="kt-menu__link ">*/}
                                                        {/*        <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>*/}
                                                        {/*        <span className="kt-menu__link-text">FAQs</span>*/}
                                                        {/*    </li>*/}
                                                        {/*</NavLink>*/}

                                                {
                                                    verifyPermission(props.userPermissions, "list-faq")?
                                                        <NavLink exact to="/settings/faqs/add" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Editer FAQs</span>
                                                            </li>
                                                        </NavLink> :null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "list-faq-category")?
                                                    <NavLink exact to="/settings/faqs/category" className="kt-menu__item "
                                                             activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                        <li className="kt-menu__link ">
                                                            <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                            <span className="kt-menu__link-text">Catégorie FAQs</span>
                                                        </li>
                                                    </NavLink>
                                                :null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, 'list-any-institution-type-role') || verifyPermission(props.userPermissions, 'list-my-institution-type-role') ? (
                                                        <NavLink exact to="/settings/rules" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Role</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "list-user-my-institution") || verifyPermission(props.userPermissions, "list-user-any-institution") ? (
                                                        <NavLink exact to="/settings/users" className="kt-menu__item " activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Utilisateur</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "list-client-from-any-institution") || verifyPermission(props.userPermissions, "list-client-from-my-institution") ? (
                                                        <NavLink exact to="/settings/clients" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Clients</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "list-relationship") ?
                                                        <NavLink exact to="/settings/relationship" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Type de relation client</span>
                                                            </li>
                                                        </NavLink>
                                                        : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, 'update-category-client') ?
                                                        <NavLink to="/settings/clients/category" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Catégorie Clients </span>
                                                            </li>
                                                        </NavLink>
                                                        : null
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
                                                        : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "list-performance-indicator") ? (
                                                        <NavLink exact to="/settings/performance_indicator"
                                                                 className="kt-menu__item " activeClassName="kt-menu__item--active"
                                                                 aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span
                                                                    className="kt-menu__link-text">Indicateur de performance</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, 'list-unit-type') ? (
                                                        <NavLink exact to="/settings/unit_type" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Type d'unité</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, 'list-any-unit') || verifyPermission(props.userPermissions, 'list-my-unit') || verifyPermission(props.userPermissions, 'list-without-link-unit') ? (
                                                        <NavLink exact to="/settings/unit" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Unité</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, 'list-position') ? (
                                                        <NavLink exact to="/settings/positions" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Fonctions</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, 'list-claim-category') ? (
                                                        <NavLink exact to="/settings/claim_categories" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Catégorie de réclamation</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, 'list-claim-object') ? (
                                                        <NavLink exact to="/settings/claim_objects" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Objet de réclamation</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "list-staff-from-any-unit") || verifyPermission(props.userPermissions, 'list-staff-from-my-unit') || verifyPermission(props.userPermissions, 'list-staff-from-maybe-no-unit') ? (
                                                        <NavLink exact to="/settings/staffs" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Agent</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, 'list-severity-level') ? (
                                                        <NavLink exact to="/settings/severities" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Niveau de gravité</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, 'list-currency') ? (
                                                        <NavLink exact to="/settings/currencies" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Devise</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, 'list-channel') ? (
                                                        <NavLink exact to="/settings/channels" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Canaux</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "update-notifications") ? (
                                                        <NavLink exact to="/settings/notification" className="kt-menu__item "
                                                                 activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Notification</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "list-message-apis") ? (
                                                        <NavLink exact to="/settings/message-apis" className="kt-menu__item" activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Message API</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "update-my-institution-message-api") ? (
                                                        <NavLink exact to="/settings/institution-message-apis" className="kt-menu__item" activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Institution Message API</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "list-delai-qualification-parameters") ? (
                                                        <NavLink exact to="/settings/qualification-period" className="kt-menu__item" activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Delai qualification</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "list-delai-treatment-parameters") ? (
                                                        <NavLink exact to="/settings/treatment-period" className="kt-menu__item" activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Delai traitement</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }


                                                {
                                                    verifyPermission(props.userPermissions, "update-active-pilot") && props.activePilot ? (
                                                        <NavLink exact to="/settings/activate-pilot" className="kt-menu__item" activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Pilote actif</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "update-recurrence-alert-settings") ? (
                                                        <NavLink exact to="/settings/recurence" className="kt-menu__item" activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Configuration des alerts de recurences</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "update-reject-unit-transfer-parameters") ? (
                                                        <NavLink exact to="/settings/reject-limit" className="kt-menu__item" activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Configuration limitation rejet</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }

                                                {
                                                    verifyPermission(props.userPermissions, "update-min-fusion-percent-parameters") ? (
                                                        <NavLink exact to="/settings/percentage-min-fusion" className="kt-menu__item" activeClassName="kt-menu__item--active" aria-haspopup="true">
                                                            <li className="kt-menu__link ">
                                                                <i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span/></i>
                                                                <span className="kt-menu__link-text">Configuration pourcentage minimum fusion</span>
                                                            </li>
                                                        </NavLink>
                                                    ) : null
                                                }
                                            </ul>
                                        </div>
                                    </li>
                                </>
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions,
        activePilot: state.user.user.staff.is_active_pilot
    };
};

export default connect(mapStateToProps)(Aside);
