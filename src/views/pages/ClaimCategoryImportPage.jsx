import React from "react";
import {connect} from "react-redux";
import appConfig from "../../config/appConfig";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import ImportFileForm from "../components/ImportFileForm";

const ClaimCategoryImportPage = (props) => {
    document.title = "Satis client - Importation catégorie de reclamation";
    if (!verifyPermission(props.userPermissions, 'store-claim-category'))
        window.location.href = ERROR_401;

    return (
        verifyPermission(props.userPermissions, 'store-claim-category') ? (
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
