import React from "react";
import {connect} from "react-redux";
import moment from "moment";
import {verifyPermission} from "../../../helpers/permission";

const KanbanElementDetail = ({claim, userPermissions, onClick, onShowDetail}) => {
    const timeExpire = `${claim.time_expire >= 0 ? "j+"+claim.time_expire : "j"+claim.time_expire}`;
    return (
        <div className="kt-portlet" style={{cursor: "pointer"}} onClick={() => onShowDetail(claim)}>
            <div className="kt-portlet__head kt-portlet__head--right kt-portlet__head--noborder  kt-ribbon kt-ribbon--clip kt-ribbon--left kt-ribbon--info">
                <div className="kt-ribbon__target" style={{ top: "12px", zIndex: 0 }}>
                    <span className="kt-ribbon__inner" style={{backgroundColor: claim.time_expire > 0 ? "#C6F6D5" : "#FED7D7"}}/>
                    <strong style={{color: claim.time_expire > 0 ? "#2F855A" : "#C53030"}}>
                        {timeExpire}
                    </strong>
                </div>

                <div className="kt-portlet__head-label">
                    <h3 className="kt-portlet__head-title">
                        {claim.claimer.lastname+" "+claim.claimer.firstname}
                    </h3>
                </div>
            </div>
            <div className="kt-portlet__body kt-portlet__body--fit-top">
                <p style={{textAlign: "left"}}>
                    La reclamation dont l'objet est <strong>{claim.claim_object.name["fr"]}</strong> est <br/> reçu le <strong>{moment(new Date(claim.created_at)).format("DD/MM/YYYY")}</strong> <br/>
                    voici la description: {claim.description.length > 34 ? claim.description.substring(0, 34)+"..." : claim.description}
                </p>
                {verifyPermission(userPermissions, 'revive-staff') && (
                    <button onClick={(e) => {e.stopPropagation(); onClick(claim.id)}} type="button" className="btn btn-outline-warning btn-sm text-uppercase">Relancer</button>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = state  => {
    return {
        userPermissions: state.user.user.permissions,
    };
};

export default connect(mapStateToProps)(KanbanElementDetail);
