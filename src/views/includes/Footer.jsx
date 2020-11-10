import React from "react";

const Footer = () => {
    return (
        <div className="kt-footer kt-grid__item" id="kt_footer">
            <div className="kt-container  kt-container--fluid ">
                <div className="kt-footer__wrapper">
                    <div className="kt-footer__copyright">
                        {new Date().getFullYear()}&nbsp;&copy;&nbsp;<a href="http://www.dmdconsult.com/" target="_blank" className="kt-link">SATIS SARL</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
