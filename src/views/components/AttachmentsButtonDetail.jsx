import React from "react";
import {connect} from "react-redux";
import appConfig from "../../config/appConfig";
import CompleteAttachment from "./CompleteAttachment";
import {verifyPermission} from "../../helpers/permission";

const AttachmentsButtonDetail = ({claim, userPermissions}) => {
    let completeAttachment = false;
    if (claim)
        completeAttachment = verifyPermission(userPermissions, 'attach-files-to-claim') && claim.status !== "archived";

    return (
        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
            <div className="kt-heading kt-heading--md">
                Liste de pièces jointes
            </div>
            <div className="kt-form__section kt-form__section--first">
                <div className="kt-wizard-v2__review">
                    {
                        !claim ? null : (
                            claim.files.length ? (
                                claim.files.map((file, index) => (
                                    <div className="kt-wizard-v2__review-item" key={index}>
                                        <div className="kt-wizard-v2__review-content">
                                            <a href={`${appConfig.apiDomaine}${file.url}`}
                                               download={true} target={"_blank"}>
                                                {file.title}
                                            </a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="kt-wizard-v2__review-item">
                                    <div className="kt-wizard-v2__review-title">
                                        Pas de pièce jointe
                                    </div>
                                </div>
                            )
                        )
                    }

                    {claim && (
                        completeAttachment && (
                            <CompleteAttachment claimId={claim.id}/>
                        )
                    )}
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        user: state.user.user
    };
};

export default connect(mapStateToProps)(AttachmentsButtonDetail);
