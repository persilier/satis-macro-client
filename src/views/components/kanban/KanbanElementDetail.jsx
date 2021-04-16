import React from "react";
import moment from "moment";

const KanbanElementDetail = ({claim, index, onShowDetail}) => {
    const timeExpire = `${claim.time_expire > 0 ? "+" : "" } ${claim.time_expire} ${claim.time_expire === 0 || claim.time_expire === 1 || claim.time_expire === -1 ? "jour" : "jours"}`;
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
                    La reclamation dont l'objet est <strong>{claim.claim_object.name["fr"]}</strong> à eu <br/> lieu le <strong>{moment(new Date(claim.created_at)).format("DD/MM/YYYY")}</strong> <br/>
                    voici la description: {claim.description.length > 34 ? claim.description.substring(0, 34)+"..." : claim.description}
                </p>
            </div>
        </div>
    );
};

export default KanbanElementDetail;
