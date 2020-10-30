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
    /*if (!verifyPermission(props.userPermissions, 'update-mail-parameters'))
        window.location.href = ERROR_401;*/

    return (
        <ImportFileForm
            submitEndpoint={`${appConfig.apiDomaine}/import-claim`}
            pageTitleLink="/process/claims/add"
            pageTitle="Enregistrement reclamation"
            panelTitle="Importation de reclamation au format excel"
        />
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(ClaimImportPage);
