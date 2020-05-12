import React from "react";

const InfirmationTable = (props) => {
    return (
        <div className="alert alert-light alert-elevate" role="alert">
            <div className="alert-icon"><i className="flaticon-warning kt-font-brand"/></div>
            <div className="alert-text">
                {
                    props.information
                }
            </div>
        </div>
    );
};

export default InfirmationTable;
