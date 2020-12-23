import React from "react";
import {loadCss} from "../../helpers/function";

loadCss("/assets/css/pages/error/error-6.css");

const Error401 = () => {
    return (
        <div className="kt-page-content-white kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--transparent kt-aside--enabled kt-aside--fixed kt-page--loading">
            <div className="kt-grid kt-grid--ver kt-grid--root kt-page">
                <div className="kt-grid__item kt-grid__item--fluid kt-grid  kt-error-v6"
                     style={{ backgroundImage: "url(/assets/media/error/bg6.jpg)" }}>
                    <div className="kt-error_container">
                        <div className="kt-error_subtitle kt-font-light">
                            <h1>401</h1>
                        </div>
                        <p className="kt-error_description kt-font-light" style={{marginBottom: "300px"}}>
                            Access is denied <button onClick={(e) => window.location.href = "/"} className="btn btn-primary mx-5">Quitter</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error401;
