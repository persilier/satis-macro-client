import React from "react";
import appConfig from "../../config/appConfig";

const AttachmentsButtonDetail = ({claim}) => {
    return (
        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content">
            <div className="kt-heading kt-heading--md">Liste de pièces jointes
            </div>
            <div className="kt-form__section kt-form__section--first">
                <div className="kt-wizard-v2__review">
                    {
                        !claim ? "" : (
                            claim.files.length ? (
                                claim.files.map((file, index) => (
                                    <div className="kt-wizard-v2__review-item"
                                         key={index}>
                                        {/*<div className="kt-wizard-v2__review-title">*/}
                                        {/*    Pièce jointe Nº{index + 1}*/}
                                        {/*</div>*/}
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
                </div>
            </div>
        </div>
    )
};

export default AttachmentsButtonDetail;
