import React from "react";
import {loadCss} from "./helpers/function";

loadCss("/assets/css/pages/error/error-1.css");

const NatureAppChoice = () => {
    return (
        <div className="kt-page-content-white kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--transparent kt-aside--enabled kt-aside--fixed kt-page--loading">
            <div className="kt-grid kt-grid--ver kt-grid--root kt-page">
                <div className="kt-grid__item kt-grid__item--fluid kt-grid  kt-error-v1"
                     style={{ backgroundImage: "url(/assets/media/error/bg1.jpg)" }}>
                    <div className="kt-error-v1__container" style={{paddingBottom: "200px"}}>
                        <h1 className="kt-error-v1__number">404</h1>
                        <p className="kt-error-v1__desc">
                            <label className="kt-radio kt-radio--bold kt-radio--brand">
                                <input type="radio" name="radio6"/>
                                MACRO
                                <span/>
                            </label>
                        </p>
                        <p className="kt-error-v1__desc">
                            <label className="kt-radio kt-radio--bold kt-radio--brand">
                                <input type="radio" name="radio6"/>
                                PRO
                                <span/>
                            </label>
                        </p>
                        <p className="kt-error-v1__desc">
                            <label className="kt-radio kt-radio--bold kt-radio--brand">
                                <input type="radio" name="radio6"/>
                                HUB
                                <span/>
                            </label>
                        </p>
                        <p className="kt-error-v1__desc">
                            <button className="btn btn-primary">Valider</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NatureAppChoice;
