import React from "react";

const DoubleButton = props => {
    return (
        <div className="kt-wizard-v2__nav-item" data-ktwizard-type="step">
            <div className="kt-wizard-v2__nav-body">
                <div className="kt-wizard-v2__nav-icon">
                    <i className="flaticon2-copy"/>
                </div>
                <div className="kt-wizard-v2__nav-label">
                    <div className="kt-wizard-v2__nav-label-title">
                        Doublons
                        {
                            !props.claim ? "" : (
                                <span
                                    className="mx-lg-4 kt-badge kt-badge--success  kt-badge--inline kt-badge--pill">{props.claim.duplicates.length}</span>
                            )
                        }
                    </div>
                    <div className="kt-wizard-v2__nav-label-desc">
                        Acceder à la liste des doublons
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoubleButton;
