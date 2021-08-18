import React from "react";
import {connect} from "react-redux";
import appConfig from "../../config/appConfig";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import ImportFileForm from "../components/ImportFileForm";

const ClaimObjectImportPage = (props) => {
    document.title = "Satis client - Importation unité";
    if (!(verifyPermission(props.userPermissions, 'store-any-unit') || verifyPermission(props.userPermissions, 'store-my-unit') || verifyPermission(props.userPermissions, 'store-without-link-unit')))
        window.location.href = ERROR_401;

    let endpoint = "";
    if (verifyPermission(props.userPermissions, 'store-any-unit')) {
        endpoint =  `${appConfig.apiDomaine}/any/import-unit-type-unit`;
    }
    if (verifyPermission(props.userPermissions, 'store-my-unit')) {
        endpoint = `${appConfig.apiDomaine}/my/import-unit-type-unit`;
    }

    if (verifyPermission(props.userPermissions, 'store-without-link-unit')) {
        endpoint = `${appConfig.apiDomaine}/without-link/import-unit-type-unit `;
    }

    return (
        verifyPermission(props.userPermissions, 'store-any-unit') || verifyPermission(props.userPermissions, 'store-my-unit') || verifyPermission(props.userPermissions, 'store-without-link-unit') ? (
            <ImportFileForm
                submitEndpoint={endpoint}
                pageTitleLink="/settings/unit"
                pageTitle="Unité"
                panelTitle="Importation d'unité au format excel"
            />
        ) : null
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(ClaimObjectImportPage);
