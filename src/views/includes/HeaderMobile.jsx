import React from "react";

const HeaderMobile = () => {
    return (
        <div id="kt_header_mobile" className="kt-header-mobile  kt-header-mobile--fixed ">
            <div className="kt-header-mobile__logo">
                <a href="index.html">
                    <img alt="Logo" src="assets/media/logos/logo-11-sm.png" />
                </a>
            </div>
            <div className="kt-header-mobile__toolbar">
                <button className="kt-header-mobile__toolbar-toggler kt-header-mobile__toolbar-toggler--left" id="kt_aside_mobile_toggler"><span/></button>
                <button className="kt-header-mobile__toolbar-topbar-toggler" id="kt_header_mobile_topbar_toggler"><i className="flaticon-more-1"/></button>
            </div>
        </div>
    );
};

export default HeaderMobile;
