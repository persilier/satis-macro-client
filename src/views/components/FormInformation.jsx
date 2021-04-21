import React from "react";

const FormInformation = (props) => {
    return (
        <div className="form-group form-group-last">
            <div className="alert alert-secondary" role="alert">
                <div className="alert-icon">
                    <i className="flaticon-information kt-font-brand"/>
                </div>
                <div className="alert-text">
                    {
                        props.information
                    }
                </div>
                <div className="alert-close">
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true"><i className="la la-close"/></span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormInformation;
