import React from 'react';
import {connect} from "react-redux";
import ModelNumberToClaimList from "../components/ModelNumberToClaimList";
import {verifyPermission} from "../../helpers/permission"
import appConfig from "../../config/appConfig";

const endPointConfig = {
    PRO: {
        plan: "PRO",
        list: `${appConfig.apiDomaine}/my/claim-satisfaction-measured`,
    },
    MACRO: {
        holding: {
            list: `${appConfig.apiDomaine}/my/claim-satisfaction-measured`,
        },
        filial: {
            list: `${appConfig.apiDomaine}/my/claim-satisfaction-measured`,
        }
    },
    HUB: {
        plan: "HUB",
        list: `${appConfig.apiDomaine}/any/claim-satisfaction-measured`,
    }
};

const MyTotalInCompleteClaim = (props) => {
    document.title = "Satis client - Les réclamations incomplètes";
    let endPoint = "";

    if (props.plan === "MACRO") {
        if (verifyPermission(props.userPermissions, 'list-satisfaction-measured-my-claim'))
            endPoint = endPointConfig[props.plan].holding;
        else if (verifyPermission(props.userPermissions, 'list-satisfaction-measured-my-claim'))
            endPoint = endPointConfig[props.plan].filial
    } else
        endPoint = endPointConfig[props.plan];
    return (
        <ModelNumberToClaimList
            navigationTitle={"Les réclamations incomplètes de mon institution"}
            description={'La liste des réclamations incomplètes de mon institution'}
            title={'Les reclamations incomplètes de mon institution'}
            endpoint={endPoint}
            userPermissions={props.userPermissions}
            plan={props.plan}
        />
    );
};

const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan,
    };
};

export default connect(mapStateToProps)(MyTotalInCompleteClaim);
