import React from "react";
import {connect} from "react-redux";
import appConfig from "../../config/appConfig";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import ImportFileForm from "../components/ImportFileForm";

const ClaimObjectImportPage = (props) => {
    document.title = "Satis client - Importation objet de reclamation";
    if (!verifyPermission(props.userPermissions, 'store-claim-object'))
        window.location.href = ERROR_401;

    return (
        verifyPermission(props.userPermissions, 'store-claim-object') ? (
            <ImportFileForm
                submitEndpoint={`${appConfig.apiDomaine}/import-claim-objects`}
                pageTitleLink="/settings/claim_objects"
                pageTitle="Objet de réclamation"
                panelTitle="Importation d'object et catéborie de reclamation au format excel"
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
