import React from "react";
import FaqListe from "../components/FaqListe";


const FAGPage=()=>{

    return(
        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">

            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            FAQ </h3>
                        <span className="kt-subheader__separator kt-hidden"></span>
                        <div className="kt-subheader__breadcrumbs">
                            <a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"></i></a>
                            <span className="kt-subheader__breadcrumbs-separator"></span>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                Pages </a>
                            <span className="kt-subheader__breadcrumbs-separator"></span>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                FAQ </a>
                            <span className="kt-subheader__breadcrumbs-separator"></span>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                FAQ </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">

                <div className="kt-portlet kt-faq-v1">
                    <div className="kt-portlet__head">
                        <div className="kt-portlet__head-label">
                            <h3 className="kt-portlet__head-title">
                                FAQs
                            </h3>
                        </div>
                    </div>
                    <div className="kt-portlet__body">
                       <FaqListe/>
                    </div>
                </div>

            </div>

        </div>

    )
};
export  default FAGPage;