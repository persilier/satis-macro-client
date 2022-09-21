import React from 'react';
import HeaderMobile from "../includes/HeaderMobile";
import {
    withRouter,
    Switch,
    Route
} from "react-router-dom"
import Nav from "../includes/Nav";
import Footer from "../includes/Footer";
import Aside from "../includes/Aside";
import Body from "../includes/Body";
import ErrorPage from "../pages/ErrorPage";
import {errorElements} from "../../constants/errors";


function App() {



    return (
        <Switch>

            {
                errorElements.map((errorElement, index) => (
                    <Route exact key={index} path={errorElement.link}>
                        <ErrorPage message={errorElement.message} code={errorElement.code}/>
                    </Route>
                ))
            }
{/*            <Route exact path="/error401">
                <ErrorPage/>
            </Route>*/}

            <Route path={"/"}>
                <div
                    className="kt-page-content-white kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--transparent kt-aside--enabled kt-aside--fixed kt-page--loading">
                    <HeaderMobile/>

                    <div className="kt-grid kt-grid--hor kt-grid--root">
                        <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
                            <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper"
                                 id="kt_wrapper" style={{paddingTop: "0"}}>
                                <Nav/>

                                <div
                                    className="kt-body kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-grid--stretch"
                                    id="kt_body">
                                    <div className="kt-container  kt-container--fluid  kt-grid kt-grid--ver">
                                        <button className="kt-aside-close " id="kt_aside_close_btn">
                                            <i className="la la-close"/>
                                        </button>

                                        <Aside/>

                                        <Body/>
                                    </div>
                                </div>

                                <Footer/>
                            </div>
                        </div>
                    </div>

                    <div id="kt_scrolltop" className="kt-scrolltop">
                        <i className="fa fa-arrow-up"/>
                    </div>
                </div>
            </Route>
        </Switch>

    );
}

export default withRouter(App);
