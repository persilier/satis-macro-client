import React from "react";
import moment from "moment";
import {verifyPermission} from "../../../helpers/permission";
import {ToastBottomEnd} from "../Toast";
import {toastErrorMessageWithParameterConfig} from "../../../config/toastConfig";
import appConfig from "../../../config/appConfig";

const ColToComplete = (props) => {
    var currentFilterData = props.claims;

    const filterByInstitution = () => {
        currentFilterData = currentFilterData.filter(claim => claim.created_by.institution_id.indexOf(props.filterInstitution.value) >= 0);
    };

    const filterByCategory = () => {
        currentFilterData = currentFilterData.filter(claim => claim.claim_object.claim_category_id.indexOf(props.filterCategory.value) >= 0);
    };

    const filterByObject = () => {
        currentFilterData = currentFilterData.filter(claim => claim.claim_object_id.indexOf(props.filterObject.value) >= 0);
    };

    const filterByPeriod = () => {
        currentFilterData = currentFilterData.filter( claim =>
            new Date(moment(new Date(claim.created_at)).format("YYYY-MM-DD")) >= props.filterPeriod.start && new Date(moment(new Date(claim.created_at)).format("YYYY-MM-DD")) <= props.filterPeriod.end
        );
    };


    if (props.filterInstitution)
        filterByInstitution();

    if (props.filterCategory)
        filterByCategory();

    if (props.filterObject)
        filterByObject();

    if (props.filterPeriod)
        filterByPeriod();

    const completeClaim = (claim) => {
        if (verifyPermission(props.userPermissions, 'update-claim-incomplete-against-any-institution') ||
            verifyPermission(props.userPermissions, "update-claim-incomplete-against-my-institution") ||
            verifyPermission(props.userPermissions, "update-claim-incomplete-without-client")) {
            document.location.href = `/process/incomplete_claims/edit/${claim.id}`;
        } else {
            ToastBottomEnd.fire(toastErrorMessageWithParameterConfig("vous n'avez pas l'autorisation de faire cette action"))
        }
    };

    return (
        <div data-id="_backlog" data-order="1" className="kanban-board" style={{ width: "250px", marginLeft: "0px", marginRight: "0px" }}>
            <header className="kanban-board-header" style={{backgroundColor: props.backgroundHeader}}>
                <div className="kanban-title-board d-flex justify-content-between align-items-center">
                    <span style={{color: props.colorHeader}}>{props.title}</span> <span className="kt-badge kt-badge--success kt-badge--lg">{currentFilterData.length}</span>
                </div>
            </header>
            <main className="kanban-drag" style={{height: "679px", overflowY: "scroll"}}>
                {
                    currentFilterData.map((claim, index) => (
                        <div className="kt-portlet" key={index} style={{cursor: "pointer"}} onClick={() => completeClaim(claim)}>
                            <div className="kt-portlet__head kt-portlet__head--right kt-portlet__head--noborder  kt-ribbon kt-ribbon--clip kt-ribbon--left kt-ribbon--info">
                                {
                                    claim.time_expire ? (
                                        <div className="kt-ribbon__target" style={{ top: "12px", zIndex: 0 }}>
                                            <span className="kt-ribbon__inner" style={{backgroundColor: claim.time_expire >= 0 ? "#C6F6D5" : "#FED7D7"}}/>
                                            <strong style={{color: claim.time_expire >= 0 ? "#2F855A" : "#C53030"}}>
                                                {claim.time_expire} {claim.time_expire === 0 || claim.time_expire === 1 || claim.time_expire === -1 ? "jour" : "jours"}
                                            </strong>
                                        </div>
                                    ) : ""
                                }
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
                    ))
                }
            </main>
            <footer/>
        </div>
    )
};

export default ColToComplete;
