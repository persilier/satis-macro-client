import React from "react";

const FormInformation = (props) => {
    return (
        <div className="form-group form-group-last">
            <div className="alert alert-secondary" role="alert">
                <div className="alert-icon">
                    <i className="flaticon-warning kt-font-brand"/>
                </div>
                <div className="alert-text">
                    {
                        props.information
                    }
                </div>
            </div>
        </div>
    );
};

export default FormInformation;
