import React from "react";
import {verifyPermission} from "../../helpers/permission";
import {formatDateToTimeStampte} from "../../helpers/function";

const DoubleButtonDetail = ({claim, onClickFusionButton, userPermissions}) => {
    return (
        <div className="kt-wizard-v2__content"
             data-ktwizard-type="step-content">
            <div className="kt-heading kt-heading--md">Liste des doublons
            </div>
            <div className="kt-form__section kt-form__section--first">
                <div className="kt-wizard-v2__review">
                    {
                        !claim ? "" : (
                            claim.duplicates.length ? (
                                claim.duplicates.map((newClaim, index) => (
                                    <div className="kt-wizard-v2__review-item"
                                         key={index}>
                                        <div
                                            className="kt-wizard-v2__review-content">
                                            <div
                                                className="kt-widget kt-widget--user-profile-3">
                                                <div className="kt-widget__top">
                                                    <div
                                                        className="kt-widget__content"
                                                        style={{paddingLeft: "0px"}}>
                                                        <div
                                                            className="kt-widget__head">
                                                            <div
                                                                className="kt-wizard-v2__review-title">Doublon
                                                                Nº{index + 1}</div>
                                                            {
                                                                verifyPermission(userPermissions, "merge-claim-awaiting-assignment") ? (
                                                                    <div
                                                                        className="kt-widget__action">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-brand btn-sm btn-upper"
                                                                            onClick={() => onClickFusionButton(newClaim)}>Fusioner
                                                                        </button>
                                                                    </div>
                                                                ) : ""
                                                            }
                                                        </div>

                                                        <div
                                                            className="kt-widget__subhead">
                                                            <a href="#fullname"
                                                               onClick={e => e.preventDefault()}><i
                                                                className="flaticon2-calendar-3"/>{`${newClaim.claimer.lastname} ${newClaim.claimer.firstname}`}
                                                            </a>
                                                            <a href="#datetime"
                                                               onClick={e => e.preventDefault()}><i
                                                                className="flaticon2-time"/>{formatDateToTimeStampte(newClaim.created_at)}
                                                            </a>
                                                        </div>

                                                        <div
                                                            className="kt-widget__info">
                                                            <div
                                                                className="kt-widget__desc">
                                                               <i className={"flaticon-notes"}></i> {newClaim.description}
                                                            </div>
                                                            <div
                                                                className="kt-widget__progress">
                                                                <div
                                                                    className="kt-widget__text">
                                                                    Pourcentage
                                                                </div>
                                                                <div
                                                                    className="progress"
                                                                    style={{
                                                                        height: "5px",
                                                                        width: newClaim.duplicate_percent + "%"
                                                                    }}>
                                                                    <div
                                                                        className="progress-bar kt-bg-danger"
                                                                        role="progressbar"
                                                                        style={{width: newClaim.duplicate_percent + "%"}}
                                                                        aria-valuenow={newClaim.duplicate_percent}
                                                                        aria-valuemin="0"
                                                                        aria-valuemax="100"/>
                                                                </div>
                                                                <div
                                                                    className="kt-widget__stats">
                                                                    {newClaim.duplicate_percent}%
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="kt-wizard-v2__review-item">
                                    <div className="kt-wizard-v2__review-title">
                                        Pas de doublon
                                    </div>
                                </div>
                            )
                        )
                    }

                </div>
            </div>
        </div>
    );
};

export default DoubleButtonDetail;
