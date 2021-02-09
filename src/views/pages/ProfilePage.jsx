import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {NavLink, Route, Switch} from "react-router-dom";
import PersonalInfo from "../components/profile/PersonalInfo";
import UpdatePassword from "../components/profile/UpdatePassword";
import axios from "axios";
import appConfig from "../../config/appConfig";
import {verifyTokenExpire} from "../../middleware/verifyToken";

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token');

const ProfilePage = ({user}) => {
    const defaultData = {
        firstname: "",
        lastname: "",
        sexe: "",
        telephone: [],
        email: [],
        ville: ""
    };

    const [data, setData] = useState(defaultData);

    const username = user.data.username;
    const formatRole = (rules) => {
        const newRules = [];
        rules.map(r => newRules.push(r.description));
        return newRules.join(' / ');
    };

    console.log("user:", user);
    const role = formatRole(user.data.roles);

    useEffect(() => {
        async function fetchData() {
            await axios.get(`${appConfig.apiDomaine}/edit-profil`)
                .then(({data}) => {
                    setData({
                        firstname: data.identite.firstname,
                        lastname: data.identite.lastname,
                        sexe: data.identite.sexe,
                        telephone: data.identite.telephone,
                        email: data.identite.email,
                        ville: data.identite.ville ? data.identite.ville : ""
                    });
                })
                .catch(({response}) => {
                    console.log("Something is wrong");
                })
            ;
        }
        if (verifyTokenExpire())
            fetchData();
    }, []);

    const handleLastNameChange = (lastname) => {
        setData({...data, lastname: lastname});
    };

    const handleFirstNameChange = (firstname) => {
        setData({...data, firstname: firstname});
    };

    const handleTelephoneChange = (tags) => {
        setData({...data, telephone: tags});
    };

    const handleEmailChange = (tags) => {
        setData({...data, email: tags});
    };

    const handleVilleChange = (ville) => {
        setData({...data, ville: ville});
    };

    return (
        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            <button className="kt-subheader__mobile-toggle kt-subheader__mobile-toggle--left" id="kt_subheader_mobile_toggle">
                                <span/>
                            </button>
                            Paramètre
                        </h3>
                        <span className="kt-subheader__separator kt-hidden"/>
                        <div className="kt-subheader__breadcrumbs">
                            <a href="#" className="kt-subheader__breadcrumbs-home">
                                <i className="flaticon2-shelter"/>
                            </a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" style={{cursor: "default"}} onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link">
                                Profile
                            </a>
                    </div>
                </div>
                </div>
            </div>
            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">

                <div className="kt-grid kt-grid--desktop kt-grid--ver kt-grid--ver-desktop kt-app">

                    <button className="kt-app__aside-close" id="kt_user_profile_aside_close">
                        <i className="la la-close"/>
                    </button>

                    <div className="kt-grid__item kt-app__toggle kt-app__aside" id="kt_user_profile_aside">
                        <div className="kt-portlet ">
                            <div className="kt-portlet__head  kt-portlet__head--noborder">
                                <div className="kt-portlet__head-label">
                                    <h3 className="kt-portlet__head-title">
                                    </h3>
                                </div>
                            </div>
                            <div className="kt-portlet__body kt-portlet__body--fit-y">
                                <div className="kt-widget kt-widget--user-profile-1">
                                    <div className="kt-widget__head">
                                        <div className="kt-widget__media">
                                            <img src="/assets/media/users/default.jpg" alt="image"/>
                                        </div>
                                        <div className="kt-widget__content">
                                            <div className="kt-widget__section">
                                                <a href="#" className="kt-widget__username">
                                                    {`${data.lastname} ${data.firstname}`}
                                                </a>
                                                {/*<span className="kt-widget__subtitle">
                                                    Head of Development
                                                </span>*/}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="kt-widget__body">
                                        <div className="kt-widget__content">
                                            <div className="kt-widget__info">
                                                <span className="kt-widget__label">Username:</span>
                                                <a href="#" className="kt-widget__data">{username}</a>
                                            </div>
                                            <div className="kt-widget__info">
                                                <span className="kt-widget__label">Téléphone:</span>
                                                <a href="#" className="kt-widget__data">{data.telephone.join("/")}</a>
                                            </div>
                                            <div className="kt-widget__info">
                                                <span className="kt-widget__label">Roles:</span>
                                                <span className="kt-widget__data">{role}</span>
                                            </div>
                                        </div>
                                        <div className="kt-widget__items">
                                            <NavLink to="/settings/account/personal-information" className="kt-widget__item" activeClassName="kt-widget__item--active">
                                                <span className="kt-widget__section">
                                                    <span className="kt-widget__icon">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z"/><path d="M12 11a4 4 0 110-8 4 4 0 010 8z" fill="#000" fillRule="nonzero" opacity=".3"/><path d="M3 20.2c.388-4.773 4.262-7.2 8.983-7.2 4.788 0 8.722 2.293 9.015 7.2.012.195 0 .8-.751.8H3.727c-.25 0-.747-.54-.726-.8z" fill="#000" fillRule="nonzero"/></g></svg>
                                                    </span>
                                                    <span className="kt-widget__desc">
                                                        Informations personnelles
                                                    </span>
                                                </span>
                                            </NavLink>

                                            <NavLink to="/settings/account/change-password" className="kt-widget__item " activeClassName="kt-widget__item--active">
                                                <span className="kt-widget__section">
                                                    <span className="kt-widget__icon">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z"/><path d="M4 4l7.631-1.43a2 2 0 01.738 0L20 4v9.283a8.51 8.51 0 01-4 7.217l-3.47 2.169a1 1 0 01-1.06 0L8 20.5a8.51 8.51 0 01-4-7.217V4z" fill="#000" opacity=".3"/><path d="M12 11a2 2 0 110-4 2 2 0 010 4zM7 16.5c.216-2.983 2.368-4.5 4.99-4.5 2.66 0 4.846 1.433 5.009 4.5.006.122 0 .5-.418.5H7.404c-.14 0-.415-.338-.404-.5z" fill="#000" opacity=".3"/></g></svg>
                                                    </span>
                                                    <span className="kt-widget__desc">
                                                        Changer le mot de passe
                                                    </span>
                                                </span>
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="kt-grid__item kt-grid__item--fluid kt-app__content">
                        <div className="row">
                            <div className="col-xl-12">
                                <Route exact path="/settings/account">
                                    <PersonalInfo
                                        data={data}
                                        handleLastNameChange={handleLastNameChange}
                                        handleFirstNameChange={handleFirstNameChange}
                                        handleTelephoneChange={handleTelephoneChange}
                                        handleEmailChange={handleEmailChange}
                                        handleVilleChange={handleVilleChange}
                                    />
                                </Route>

                                <Route exact path="/settings/account/personal-information">
                                    <PersonalInfo
                                        data={data}
                                        handleLastNameChange={handleLastNameChange}
                                        handleFirstNameChange={handleFirstNameChange}
                                        handleTelephoneChange={handleTelephoneChange}
                                        handleEmailChange={handleEmailChange}
                                        handleVilleChange={handleVilleChange}
                                    />
                                </Route>

                                <Route exact path="/settings/account/change-password">
                                    <UpdatePassword/>
                                </Route>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        user: state.user.user
    };
};

export default connect(mapStateToProps)(ProfilePage);
