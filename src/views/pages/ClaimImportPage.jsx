import React from "react";
import { connect } from "react-redux";
import appConfig from "../../config/appConfig";
import { verifyPermission } from "../../helpers/permission";
import { ERROR_401 } from "../../config/errorPage";
import ImportFileFormReclamation from "../components/ImportFileFormReclamation";
import { useTranslation } from "react-i18next";

const ClaimImportPage = (props) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  document.title =
    "Satis client - " + ready ? t("Importation réclamations") : "";

  let endpoint = "";
  if (
    !(
      verifyPermission(
        props.userPermissions,
        "store-claim-against-any-institution"
      ) ||
      verifyPermission(
        props.userPermissions,
        "store-claim-against-my-institution"
      ) ||
      verifyPermission(props.userPermissions, "store-claim-without-client")
    )
  )
    window.location.href = ERROR_401;

  if (
    verifyPermission(
      props.userPermissions,
      "store-claim-against-any-institution"
    )
  )
    endpoint = `${appConfig.apiDomaine}/any/import-claim`;
  else if (
    verifyPermission(
      props.userPermissions,
      "store-claim-against-my-institution"
    )
  )
    endpoint = `${appConfig.apiDomaine}/my/import-claim`;
  else if (
    verifyPermission(props.userPermissions, "store-claim-without-client")
  )
    endpoint = `${appConfig.apiDomaine}/without-client/import-claim`;

  if (
    verifyPermission(
      props.userPermissions,
      "store-claim-against-any-institution"
    )
  )
    endpoint = `${appConfig.apiDomaine}/any/import-claim`;
  else if (
    verifyPermission(
      props.userPermissions,
      "store-claim-against-my-institution"
    )
  )
    endpoint = `${appConfig.apiDomaine}/my/import-claim`;
  else if (
    verifyPermission(props.userPermissions, "store-claim-without-client")
  )
    endpoint = `${appConfig.apiDomaine}/without-client/import-claim`;

  return ready ? (
    <ImportFileFormReclamation
      submitEndpoint={endpoint}
      pageTitleLink="/process/claims/add"
      pageTitle={t("Enregistrement réclamation")}
      panelTitle={t("Importation de réclamation au format excel")}
      panelExcelTitle={t("Importer le courier scanné du reclamant ")}
      claimImport={true}
    />
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    userPermissions: state.user.user.permissions,
  };
};

export default connect(mapStateToProps)(ClaimImportPage);
