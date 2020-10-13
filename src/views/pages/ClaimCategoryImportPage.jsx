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

const ClaimCategoryImportPage = (props) => {
    document.title = "Satis client - Importation catégorie de reclamation";
    if (!verifyPermission(props.userPermissions, 'update-mail-parameters'))
        window.location.href = ERROR_401;

    return (
        verifyPermission(props.userPermissions, 'update-mail-parameters') ? (
            <ImportFileForm
                submitEndpoint={`${appConfig.apiDomaine}/import-claim-categories`}
                pageTitleLink="/settings/claim_categories"
                pageTitle="Catégorie de réclamation"
                panelTitle="Importation catégorie reclamation au format excel"
            />
        ) : null
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(ClaimCategoryImportPage);
