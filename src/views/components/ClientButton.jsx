import React from "react";

const ClientButton = () => {
    return (
        <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step"
             data-ktwizard-state="current">
            <div className="kt-wizard-v2__nav-body">
                <div className="kt-wizard-v2__nav-icon">
                    <i className="flaticon-user-settings"/>
                </div>
                <div className="kt-wizard-v2__nav-label">
                    <div className="kt-wizard-v2__nav-label-title">
                        Client
                    </div>
                    <div className="kt-wizard-v2__nav-label-desc">
                        Acceder aux détails du client
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientButton;
