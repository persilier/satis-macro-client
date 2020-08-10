import React from "react";

const Footer = () => {
    return (
        <div className="kt-footer kt-grid__item" id="kt_footer">
            <div className="kt-container  kt-container--fluid ">
                <div className="kt-footer__wrapper">
                    <div className="kt-footer__copyright">
                        {new Date().getFullYear()}&nbsp;&copy;&nbsp;<a href="http://www.dmdconsult.com/" target="_blank" className="kt-link">DMD SARL</a>
                    </div>
                    <div className="kt-footer__menu">
                        <a href="/" target="_blank" className="kt-link">A propos</a>
                        <a href="/" target="_blank" className="kt-link">Equipe</a>
                        <a href="/" target="_blank" className="kt-link">Contact</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
