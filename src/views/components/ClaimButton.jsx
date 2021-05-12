import React from "react";

const ClaimButton = () => {
    return (
        <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
            <div className="kt-wizard-v2__nav-body">
                <div className="kt-wizard-v2__nav-icon">
                    <i className="flaticon-book"/>
                </div>
                <div className="kt-wizard-v2__nav-label">
                    <div className="kt-wizard-v2__nav-label-title">
                        Réclamation
                    </div>
                    <div className="kt-wizard-v2__nav-label-desc">
                        Acceder aux détails de la réclamation
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaimButton;
