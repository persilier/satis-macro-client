import React from "react";
import {Link} from "react-router-dom";

const HeaderTablePage = (props) => {
    return (
        <div className="kt-portlet__head kt-portlet__head--lg">
            <div className="kt-portlet__head-label">
                <span className="kt-portlet__head-icon">
                    <i className="kt-font-brand flaticon2-line-chart"/>
                </span>
                <h3 className="kt-portlet__head-title">
                    {
                        props.title
                    }
                </h3>
            </div>
            <div className="kt-portlet__head-toolbar">
                <div className="kt-portlet__head-wrapper">
                    &nbsp;
                    <div className="dropdown dropdown-inline">
                        <Link to={props.addLink} className="btn btn-brand btn-icon-sm">
                            <i className="flaticon2-plus"/> {props.addText}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderTablePage;
