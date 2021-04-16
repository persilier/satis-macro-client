import React from "react";
import Loader from "./Loader";

const ClientButtonDetail = ({claim}) => {
    return (
        <div className="kt-wizard-v2__content" data-ktwizard-type="step-content"
             data-ktwizard-state="current">
            <div className="kt-heading kt-heading--md">Détails du client</div>
            <div className="kt-form__section kt-form__section--first">
                <div className="kt-wizard-v2__review">
                    <div className="kt-wizard-v2__review-item">
                        <div className="kt-widget kt-widget--user-profile-1">
                            <div className="kt-widget__head">
                                <div className="kt-widget__media">
                                    <img src="/personal/img/default-avatar.png" alt="image-avatar"/>
                                </div>
                                <div className="kt-widget__content"
                                     style={{marginTop: "auto", marginBottom: "auto"}}>
                                    <div className="kt-widget__section">
                                        {
                                            !claim ? (
                                                <Loader/>
                                            ) : (
                                                <a href="#"
                                                   className="kt-widget__username">
                                                    {`${claim.claimer.lastname} ${claim.claimer.firstname}`}
                                                    <i className="flaticon2-correct kt-font-success"/>
                                                </a>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="kt-widget__body">
                                {
                                    !claim ? "" : (
                                        <div className="kt-widget__content">
                                            <div className="kt-widget__info">
                                                <span className="fa fa-venus-mars" style={{fontSize: "1.5rem"}}/>
                                                <span className="kt-widget__data">{claim.claimer.sexe === 'F' ? "Féminin" : "Masculin"}</span>
                                            </div>
                                            <div className="kt-widget__info">
                                                <span className="fa fa-envelope" style={{fontSize: "1.5rem"}}/>
                                                <span className="kt-widget__data">
                                                    {
                                                        claim.claimer.email.map((mail, index) => (
                                                            index === claim.claimer.email.length - 1 ? mail : mail + "/ "
                                                        ))
                                                    }
                                                </span>
                                            </div>
                                            <div className="kt-widget__info">
                                                <span className="fa fa-phone-alt" style={{fontSize: "1.5rem"}}/>
                                                <span className="kt-widget__data">
                                                    {
                                                        claim.claimer.telephone.map((telephone, index) => (
                                                            index === claim.claimer.telephone.length - 1 ? telephone : telephone + "/ "
                                                        ))
                                                    }
                                                </span>
                                            </div>
                                            <div className="kt-widget__info">
                                                <span className="fa fa-location-arrow" style={{fontSize: "1.5rem"}}/>
                                                <span className="kt-widget__data">
                                                    {claim.claimer.ville && claim.claimer.ville !== "null" ? claim.claimer.ville : "-"}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientButtonDetail;
