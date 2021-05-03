import React, {useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastErrorMessageWithParameterConfig, toastSuccessMessageWithParameterConfig
} from "../../config/toastConfig";
import appConfig from "../../config/appConfig";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import InputRequire from "../components/InputRequire";
import {Link} from "react-router-dom";
import ImportFileForm from "../components/ImportFileForm";

const ClaimImportPage = (props) => {
    document.title = "Satis client - Importation reclamation";

    let endpoint = "";
    if (!(verifyPermission(props.userPermissions, 'store-claim-against-any-institution') || verifyPermission(props.userPermissions, "store-claim-against-my-institution") || verifyPermission(props.userPermissions, "store-claim-without-client")))
        window.location.href = ERROR_401;

    if (verifyPermission(props.userPermissions, 'store-claim-against-any-institution'))
        endpoint = `${appConfig.apiDomaine}/any/import-claim`;
    else if(verifyPermission(props.userPermissions, 'store-claim-against-my-institution'))
        endpoint = `${appConfig.apiDomaine}/my/import-claim`;
    else if(verifyPermission(props.userPermissions, 'store-claim-without-client'))
        endpoint = `${appConfig.apiDomaine}/without-client/import-claim`;

    return (
        <ImportFileForm
            submitEndpoint={endpoint}
            pageTitleLink="/process/claims/add"
            pageTitle="Enregistrement reclamation"
            panelTitle="Importation de reclamation au format excel"
            claimImport={true}
        />
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(ClaimImportPage);
