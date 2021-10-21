import React, {useState} from "react";
import {connect} from "react-redux";
import appConfig from "../../config/appConfig";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import ImportFileForm from "../components/ImportFileForm";

const RoleImportPage = (props) => {
    document.title = "Satis client - Importation role";

    let endpoint = "";
    if (!(verifyPermission(props.userPermissions, 'store-any-institution-type-role') || verifyPermission(props.userPermissions, "store-my-institution-type-role") || verifyPermission(props.userPermissions, "store-claim-without-client")))
        window.location.href = ERROR_401;

    if (verifyPermission(props.userPermissions, 'store-any-institution-type-role'))
        endpoint = `${appConfig.apiDomaine}/any/roles/add-profil/import`;
    else if(verifyPermission(props.userPermissions, 'store-my-institution-type-role'))
        endpoint = `${appConfig.apiDomaine}/my/roles/add-profil/import`;
    else if(verifyPermission(props.userPermissions, 'store-any-institution-type-role'))
        endpoint = `${appConfig.apiDomaine}/any/roles/add-profil/import`;

    return (
        <ImportFileForm
            submitEndpoint={endpoint}
            pageTitleLink="/settings/rules/add"
            pageTitle="Enregistrement role"
            panelTitle="Importation de role au format excel"
            claimImport={false}
        />
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(RoleImportPage);
