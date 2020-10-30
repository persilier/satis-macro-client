import React, {useCallback, useEffect, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import moment from "moment";
import 'moment/locale/fr';
import * as LanguageAction from "../../store/actions/languageAction";
import * as authActions from "../../store/actions/authActions";
import appConfig from "../../config/appConfig";
import {AUTH_TOKEN} from "../../constants/token";
import {EventNotification, EventNotificationPath, RelaunchNotification} from "../../constants/notification";
import EmptyNotification from "../components/EmptyNotification";
import {Link, NavLink} from "react-router-dom";
import {verifyPermission} from "../../helpers/permission";
import {ToastBottomEnd} from "../components/Toast";
import {toastSuccessMessageWithParameterConfig} from "../../config/toastConfig";
import {debug} from "../../helpers/function";
import Loader from "../components/Loader";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

const Nav = (props) => {
    const [eventNotification, setEventNotification] = useState([]);
    const [relaunchNotification, setRelaunchNotification] = useState([]);
    const [startRead, setStartRead] = useState(false);

    const filterEventNotification = useCallback((notification) => {
        let notificationList;
        notificationList =  notification.filter(
            n => EventNotification.includes(n.type.substr(39, n.type.length))
        );
        localStorage.setItem("eventNotification", JSON.stringify(notificationList));
        return notificationList;
    }, [EventNotification]);

    const filterRelaunchNotification = useCallback((notification) => {
        return notification.filter(
            n => RelaunchNotification.includes(n.type.substr(39, n.type.length))

        );
    }, [RelaunchNotification]);

    const fetchData = async () => {
        await axios.get(`${appConfig.apiDomaine}/unread-notifications`)
            .then(response => {
                setEventNotification(filterEventNotification(response.data));
                setRelaunchNotification(filterRelaunchNotification(response.data));
            })
            .catch(error => {
                console.log("Something is wrong");
            })
        ;
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (props.user) {
            window.Echo.private(`Satis2020.ServicePackage.Models.Identite.${props.user.identite_id}`)
                .notification((notification) => {
                    if (notification.type.substr(39, notification.type.length) === "PostDiscussionMessage") {
                        debug(notification, "notification");
                        if (window.location.pathname !== "chat#messageList")
                            ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig(notification.text.length > 40 ? notification.text.substr(0, 40)+"..." : notification.text));
                    } else {
                        fetchData();
                    }
                })
            ;
        }
    }, [props.user.identite]);

    const onClickLanguage = useCallback((e, lang) => {
        e.preventDefault();
        props.changeLanguage(lang);
    }, [props.changeLanguage]);

    const onClickLogoutLink = useCallback((e) => {
        e.preventDefault();
        props.logoutUser();
    }, [props.logoutUser]);

    const getNotificationLink = useCallback((type, data) => {
        return type !== "RegisterAClaim"
            ? EventNotificationPath[type](data.claim.id)
            : EventNotificationPath[type][data.claim.status](data.claim.id);
    });

    const readAllNotification = async (readNotification, path) => {
        await axios.put(`${appConfig.apiDomaine}/unread-notifications`, readNotification)
            .then(({data}) => {
                debug(data, "data");
                setStartRead(false);
                if (data.canReload) {
                    window.location.href = path;
                } else {
                    setEventNotification(filterEventNotification(data.unreadNotifications));
                    setRelaunchNotification(filterRelaunchNotification(data.unreadNotifications));
                }
            })
            .catch(({response}) => {console.log("Something is wrong")})
    };

    const showDetailNotification = useCallback((e, path, idNotification, relaunchNotification = false, notification = null) => {
        e.preventDefault();
        if (!startRead) {
            setStartRead(true);
            const readNotification = {
                "notifications": [
                    idNotification
                ]
            };

            if (!relaunchNotification) {
                readAllNotification(readNotification, path);
            } else {
                setRelaunchNotification(notifications => {
                    return notifications.filter(n => n.id !== idNotification)
                });
            }
        }
    });

    const notificationCount = eventNotification.length + relaunchNotification.length;

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
                </div>

                <div className="kt-header__topbar">
                    <div className="kt-header__topbar-item dropdown">
                        <div className="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px">
                            <span className="kt-header__topbar-icon">
                                <i className="flaticon2-bell-alarm-symbol"/>
                                {
                                    notificationCount > 0 ? (
                                        <div className="kt-badge kt-badge__pics">
                                    <span
                                        className="kt-badge__pic  kt-badge__pic--last"
                                        style={{
                                            backgroundColor: "#FEB2B2",
                                            color: "#C53030",
                                            width: "25px",
                                            height: "25px",
                                            position: "relative",
                                            bottom: "10px",
                                            left: "5px"
                                        }}
                                    >
                                        {
                                            (notificationCount) > 9 ? "+9" : notificationCount
                                        }
                                    </span>
                                        </div>
                                    ) : null
                                }
                            </span>
                            <span className="kt-hidden kt-badge kt-badge--danger"/>
                        </div>
                        <div
                            className="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-xl">
                            <form>
                                <div className="kt-head kt-head--skin-light kt-head--fit-x kt-head--fit-b">
                                    <h3 className="kt-head__title">
                                        Notifications
                                        &nbsp;
                                        <span
                                            className="btn btn-label-primary btn-sm btn-bold btn-font-md">{notificationCount} nouveau</span>
                                    </h3>
                                    <ul className="nav nav-tabs nav-tabs-line nav-tabs-bold nav-tabs-line-3x nav-tabs-line-brand  kt-notification-item-padding-x"
                                        role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link active show" data-toggle="tab"
                                               href="#topbar_notifications_notifications" role="tab"
                                               aria-selected="true">Alertes</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="tab"
                                               href="#topbar_notifications_events" role="tab"
                                               aria-selected="false">Relances</a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="tab-content">
                                    <div className="tab-pane active show" id="topbar_notifications_notifications"
                                         role="tabpanel">
                                        {
                                            eventNotification.length ? (
                                                <div className="kt-notification kt-margin-t-10 kt-margin-b-10 kt-scroll"
                                                     data-scroll="true" data-height="300" data-mobile-height="200"
                                                     style={eventNotification.length >= 4 ? {
                                                         height: "380px",
                                                         overflowY: "auto"
                                                     } : {}}>
                                                    {
                                                        eventNotification.map((n, index) => (
                                                            <a
                                                                href={getNotificationLink(n.type.substr(39, n.type.length), n.data)}
                                                                key={index}
                                                                className="kt-notification__item"
                                                                onClick={e => showDetailNotification(e, getNotificationLink(n.type.substr(39, n.type.length), n.data), n.id, false, n)}
                                                            >
                                                                <div className="kt-notification__item-icon">
                                                                    <i className="flaticon2-line-chart kt-font-success"/>
                                                                </div>
                                                                <div className="kt-notification__item-details">
                                                                    <div className="kt-notification__item-title"
                                                                         style={{textOverflow: "ellipsis"}}>
                                                                        {n.data.text.length >= 87 ? n.data.text.substring(0, 88) + "..." : n.data.text.substring(0, 86)}
                                                                    </div>
                                                                    <div className="kt-notification__item-time">
                                                                        {moment(new Date(n.created_at)).fromNow()}
                                                                    </div>
                                                                </div>
                                                                {
                                                                    startRead ? (
                                                                        <Loader/>
                                                                    ) : null
                                                                }
                                                            </a>
                                                        ))
                                                    }
                                                </div>
                                            ) : (
                                                <EmptyNotification/>
                                            )
                                        }
                                    </div>
                                    <div className="tab-pane" id="topbar_notifications_events" role="tabpanel">
                                        {
                                            relaunchNotification.length ? (
                                                <div className="kt-notification kt-margin-t-10 kt-margin-b-10 kt-scroll"
                                                     data-scroll="true" data-height="300" data-mobile-height="200"
                                                     style={relaunchNotification.length >= 4 ? {
                                                         height: "380px",
                                                         overflowY: "auto"
                                                     } : {}}>
                                                    {
                                                        relaunchNotification.map(((n, index) => (
                                                            <a
                                                                key={index}
                                                                href={`/read-notification-${index}`}
                                                                onClick={e => showDetailNotification(e, `/read-notification-${index}`, n.id, true)}
                                                                className="kt-notification__item"
                                                            >
                                                                <div className="kt-notification__item-icon">
                                                                    <i className="flaticon2-line-chart kt-font-success"/>
                                                                </div>
                                                                <div className="kt-notification__item-details">
                                                                    <div className="kt-notification__item-title"
                                                                         style={{textOverflow: "ellipsis"}}>
                                                                        {n.data.text.length >= 87 ? n.data.text.substring(0, 85) + "..." : n.data.text.substring(0, 86)}
                                                                    </div>
                                                                    <div className="kt-notification__item-time">
                                                                        {moment(new Date(n.created_at)).fromNow()}
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        )))
                                                    }
                                                </div>
                                            ) : (
                                                <EmptyNotification/>
                                            )
                                        }

                                    </div>
                                </div>
                            </form>
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
                                        <span className="kt-nav__link-icon">
                                            <img src="/assets/media/flags/226-united-states.svg" alt=""/></span>
                                        <span className="kt-nav__link-text">English</span>
                                    </a>
                                </li>
                                <li className="kt-nav__item">
                                    <a href="#link" onClick={(e) => onClickLanguage(e, "sp")} className="kt-nav__link">
                                        <span className="kt-nav__link-icon">
                                            <img src="/assets/media/flags/128-spain.svg" alt=""/>
                                        </span>
                                        <span className="kt-nav__link-text">Spanish</span>
                                    </a>
                                </li>
                                <li className="kt-nav__item">
                                    <a href="#link" onClick={(e) => onClickLanguage(e, "gm")} className="kt-nav__link">
                                        <span className="kt-nav__link-icon">
                                            <img src="/assets/media/flags/162-germany.svg" alt=""/>
                                        </span>
                                        <span className="kt-nav__link-text">German</span>
                                    </a>
                                </li>

                                <li className="kt-nav__item">
                                    <a href="#link" onClick={(e) => onClickLanguage(e, "fr")} className="kt-nav__link">
                                        <span className="kt-nav__link-icon">
                                            <img src="/personal/img/france.svg" alt=""/>
                                        </span>
                                        <span className="kt-nav__link-text">Francais</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="kt-header__topbar-item kt-header__topbar-item--user">
                        <div className="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px">
                            <span className="kt-header__topbar-welcome kt-visible-desktop">Salut,</span>
                            <span className="kt-header__topbar-username kt-visible-desktop">
                                {props.user.firstName}
                            </span>
                            <img alt="Pic" src="/assets/media/users/default.jpg"/>
                            <span className="kt-header__topbar-icon kt-bg-brand kt-hidden"><b>S</b></span>
                        </div>
                        <div
                            className="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-xl">
                            <div className="kt-user-card kt-user-card--skin-light kt-notification-item-padding-x">
                                <div className="kt-user-card__avatar">
                                    <img className="kt-hidden-" alt="Pic" src="/assets/media/users/default.jpg"/>
                                    <span
                                        className="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold kt-hidden">S</span>
                                </div>
                                <div className="kt-user-card__name">
                                    {props.user.lastName + " " + props.user.firstName}
                                </div>
                                {/*<div className="kt-user-card__badge">*/}
                                {/*    <span*/}
                                {/*        className="btn btn-label-primary btn-sm btn-bold btn-font-md">23 messages</span>*/}
                                {/*</div>*/}
                            </div>

                            <div className="kt-notification">
                                {/*    <a href="custom/apps/user/profile-1/personal-information.html" className="kt-notification__item">*/}
                                {/*        <div className="kt-notification__item-icon">*/}
                                {/*            <i className="flaticon2-calendar-3 kt-font-success"></i>*/}
                                {/*        </div>*/}
                                {/*        <div className="kt-notification__item-details">*/}
                                {/*            <div className="kt-notification__item-title kt-font-bold">*/}
                                {/*                My Profile*/}
                                {/*            </div>*/}
                                {/*            <div className="kt-notification__item-time">*/}
                                {/*                Account settings and more*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*    </a>*/}

                                {
                                    verifyPermission(props.userPermissions, 'list-my-discussions') ||
                                    verifyPermission(props.userPermissions, 'contribute-discussion') ? (
                                            <Link to={"/chat"} className="kt-notification__item">
                                                <div className="kt-notification__item-icon">
                                                    <i className="flaticon2-mail kt-font-warning"></i>
                                                </div>
                                                <div className="kt-notification__item-details">
                                                    <div className="kt-notification__item-title kt-font-bold">
                                                        Mes Disccussions
                                                    </div>
                                                    <div className="kt-notification__item-time">
                                                        Acceder à la liste
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                        : null
                                }

                                {/*<Link to={"/feedback-channels"} className="kt-notification__item">*/}
                                {/*    <div className="kt-notification__item-icon">*/}
                                {/*        <i className="flaticon2-hourglass kt-font-brand"></i>*/}
                                {/*    </div>*/}
                                {/*    <div className="kt-notification__item-details">*/}
                                {/*        <div className="kt-notification__item-title kt-font-bold">*/}
                                {/*            Mes Canaux*/}
                                {/*        </div>*/}
                                {/*        <div className="kt-notification__item-time">*/}
                                {/*           Les canaux du personnel*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*</Link>*/}
                                <NavLink to={"/settings/account"}
                                   className="kt-notification__item">
                                    <div className="kt-notification__item-icon">
                                        <i className="flaticon2-calendar-3 kt-font-success"></i>
                                    </div>
                                    <div className="kt-notification__item-details">
                                        <div className="kt-notification__item-title kt-font-bold">
                                            Mon profile
                                        </div>
                                        <div className="kt-notification__item-time">
                                            Paramètres de compte et plus
                                        </div>
                                    </div>
                                </NavLink>
                                <div className="kt-notification__custom kt-space-between">
                                    <a href="/logout" onClick={onClickLogoutLink} target="_blank"
                                       className="btn btn-label btn-label-brand btn-sm btn-bold">Déconnexion</a>
                                    {/*<a href="custom/user/login-v2.html" target="_blank"*/}
                                    {/*   className="btn btn-clean btn-sm btn-bold">Upgrade Plan</a>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions,
        language: state.language,
        plan: state.plan.plan,
        user: {
            lastName: state.user.user.data.identite.lastname,
            firstName: state.user.user.data.identite.firstname,
            identite_id: state.user.user.data.identite.id
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
