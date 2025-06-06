import { RECEPTION_CHANNEL, RESPONSE_CHANNEL } from "../constants/channel";
import { verifyPermission } from "./permission";
import appConfig from "../config/appConfig";
import moment from "moment";
import axios from "axios";
import { listConnectData } from "../constants/userClient";
import { AUTH_TOKEN } from "../constants/token";
import ls from "localstorage-slim";

import i18n from "../i18n";

axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

moment.locale();

axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

moment.locale();
export const existingScript = function(id) {
  return !!document.getElementById(id);
};

export const exitingStyleSheet = (id) => {
  return !!document.getElementById(id);
};

export const loadCss = function(linkStylsheet) {
  var tag = document.createElement("link");
  tag.href = linkStylsheet;
  tag.rel = "stylesheet";
  switch (linkStylsheet) {
    case "assets/plugins/custom/datatables/datatables.bundle.css":
      tag.id = "style-dataTable";
      if (!exitingStyleSheet("style-dataTable"))
        document.getElementsByTagName("head")[0].append(tag);
      break;
    case "/assets/plugins/custom/datatables/datatables.bundle.css":
      tag.id = "style-dataTable";
      if (!exitingStyleSheet("style-dataTable"))
        document.getElementsByTagName("head")[0].append(tag);
      break;
    case "/assets/css/pages/login/login-1.css":
      tag.id = "style-login-page";
      if (!exitingStyleSheet("style-login-page"))
        document.getElementsByTagName("head")[0].append(tag);
      break;
    case "/assets/css/pages/error/error-6.css":
      tag.id = "style-error401-page";
      if (!exitingStyleSheet("style-error401-page"))
        document.getElementsByTagName("head")[0].append(tag);
      break;
    case "/assets/css/pages/pricing/pricing-3.css":
      tag.id = "style-choice-nature-page";
      if (!exitingStyleSheet("style-choice-nature-page"))
        document.getElementsByTagName("head")[0].append(tag);
      break;
    case "/assets/css/pages/wizard/wizard-2.css":
      tag.id = "style-wizard-2";
      if (!exitingStyleSheet("style-style-wizard-2"))
        document.getElementsByTagName("head")[0].append(tag);
      break;
    case "/assets/plugins/custom/kanban/kanban.bundle.css":
      tag.id = "style-kanban-bord";
      if (!exitingStyleSheet("style-kanban-bord"))
        document.getElementsByTagName("head")[0].append(tag);
      break;
    case "/assets/js/pages/crud/metronic-datatable/advanced/row-details.js":
      tag.id = "datatable-row-detail";
      if (!exitingStyleSheet("datatable-row-detail"))
        document.getElementsByTagName("head")[0].append(tag);
      break;
    default:
      break;
  }
};

export const loadScript = function(src) {
  var tag = document.createElement("script");
  tag.src = src;

  switch (src) {
    case "assets/plugins/custom/datatables/datatables.bundle.js":
      tag.id = "data-table-script";
      if (!existingScript("data-table-script"))
        document.getElementsByTagName("body")[0].appendChild(tag);
      break;
    case "/assets/plugins/custom/datatables/datatables.bundle.js":
      tag.id = "data-table-script";
      if (!existingScript("data-table-script"))
        document.getElementsByTagName("body")[0].appendChild(tag);
      break;
    case "/assets/js/pages/custom/login/login-1.js":
      tag.id = "script-login-page";
      if (!existingScript("script-login-page"))
        document.getElementsByTagName("body")[0].appendChild(tag);
      break;
    case "/assets/plugins/global/plugins.bundle.js":
      tag.id = "script-global-one";
      if (!existingScript("script-global-one"))
        document.getElementsByTagName("body")[0].appendChild(tag);
      break;
    case "/assets/js/scripts.bundle.js":
      tag.id = "script-global-two";
      if (!existingScript("script-global-two"))
        document.getElementsByTagName("body")[0].appendChild(tag);
      break;
    case "/assets/js/pages/custom/wizard/wizard-2.js":
      tag.id = "script-wizard-2";
      if (!existingScript("script-wizard-2"))
        document.getElementsByTagName("body")[0].appendChild(tag);
      break;
    case "/assets/js/pages/custom/chat/chat.js":
      tag.id = "script-chat-2";
      if (!existingScript("script-chat-2"))
        document.getElementsByTagName("body")[0].appendChild(tag);
      break;
    default:
      break;
  }
};

export const rolesInclude = (rules, role) => {
  let value = rules.find((r) => {
    return role === r.name;
  });
  return !!value;
};
function hypheny(res) {
  res = `${res}`;
  return res.replace(/\s+/g, "-").replace(/\//g, "-");
}
export const script_appender = (url, callback) => {
  const id = `${hypheny(url, "/")}`;
  const existingScript = document.getElementById(id);
  if (existingScript) {
    document.getElementById(id).remove();
  }
  const script = document.createElement("script");
  script.src = `${url}`;
  script.id = id;
  script.async = false;

  document.body.appendChild(script);
  script.onload = () => {
    if (callback) callback();
  };
};
export const formatSelectOption = function(
  options,
  labelKey,
  translate,
  valueKey = "id"
) {
  const newOptions = [];
  for (let i = 0; i < options?.length; i++) {
    if (translate)
      newOptions.push({
        value: options[i][valueKey],
        label: options[i][labelKey][translate],
      });
    else
      newOptions.push({
        value: options[i][valueKey],
        label: options[i][labelKey],
      });
  }
  return newOptions;
};

export const forceRound = (decimalNumber) => {
  return ("" + decimalNumber).split(".")[1]
    ? Math.trunc(decimalNumber) + 1
    : Math.trunc(decimalNumber);
};

export const formatPermissions = (permissions) => {
  const newPermissions = [];
  permissions.map((permission) => newPermissions.push(permission.name));
  return newPermissions;
};

export const filterDataTableBySearchValue = () => {
  function myFunction() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td");
      for (j = 0; j < td.length; j++) {
        if (td[j]) {
          txtValue = td[j].textContent || td[j].innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
            break;
          } else tr[i].style.display = "none";
        }
      }
    }
  }

  myFunction();
};

export const filterDiscussionBySearchValue = () => {
  function myFunction() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");

    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

  myFunction();
};

export const filterChannel = (channels, typeFilter) => {
  const newChannels = [];
  for (let i = 0; i < channels.length; i++) {
    if (typeFilter === RESPONSE_CHANNEL) {
      if (channels[i].is_response == 1) newChannels.push(channels[i]);
    } else if (typeFilter === RECEPTION_CHANNEL) {
      if (channels[i].is_response == 0) newChannels.push(channels[i]);
    } else return channels;
  }
  return newChannels;
};

export const percentageData = (data, total) => {
  if (total !== 0) return Math.round((data * 100) / total) + "%";
  else return 0 + "%";
};
// export const percentage = (data, total) => {
//
//     if (total !== 0)
//         return Math.round((data * 100) / total) ;
//     else return 0
//
// };

export const formatToTimeStamp = (dateTime) => {
  if (dateTime.length)
    return dateTime.split("T")[0] + " " + dateTime.split("T")[1];
  else return "";
};
export const formatToTimeStampUpdate = (dateTime) => {
  if (dateTime.length)
    return (
      dateTime.split("T")[0] + " " + dateTime.split("T")[1].substring(0, 5)
    );
  else return "";
};

export const formatDateToTimeStampte = (dateTime) => {
  if (dateTime) return moment(dateTime).format("LLLL");
  else return "Pas de date";
};

export const formatDateToTime = (dateTime) => {
  if (dateTime) return moment(dateTime).format("L");
  else return "Pas de date";
};

export const formatToTime = (dateTime) => {
  if (dateTime !== null)
    return dateTime.split("T")[0] + "T" + dateTime.split("T")[1].split(".")[0];
  else return "";
};
export const reduceCharacter = (texte) => {
  if (texte !== null) return texte.substr(0, 30) + "...";
  else return "";
};
// export const takeToken = url => {
//     if (url !== null)
//        return url.substr(38 );
//     else
//         return "";
// };

export const seeParameters = (userPermissions) => {
  return (
    verifyPermission(userPermissions, "update-sms-parameters") ||
    verifyPermission(userPermissions, "update-mail-parameters") ||
    verifyPermission(userPermissions, "update-proxy-config") ||
    verifyPermission(userPermissions, "show-proxy-config") ||
    verifyPermission(userPermissions, "list-any-institution") ||
    verifyPermission(userPermissions, "update-my-institution") ||
    verifyPermission(userPermissions, "update-claim-object-requirement") ||
    verifyPermission(
      userPermissions,
      "update-processing-circuit-my-institution"
    ) ||
    verifyPermission(
      userPermissions,
      "update-processing-circuit-any-institution"
    ) ||
    verifyPermission(
      userPermissions,
      "update-processing-circuit-without-institution"
    ) ||
    verifyPermission(userPermissions, "list-client-from-any-institution") ||
    verifyPermission(userPermissions, "list-client-from-my-institution") ||
    verifyPermission(userPermissions, "list-relationship") ||
    verifyPermission(userPermissions, "update-category-client") ||
    verifyPermission(userPermissions, "list-type-client") ||
    verifyPermission(userPermissions, "list-performance-indicator") ||
    verifyPermission(userPermissions, "list-unit-type") ||
    verifyPermission(userPermissions, "list-any-unit") ||
    verifyPermission(userPermissions, "list-position") ||
    verifyPermission(userPermissions, "list-claim-category") ||
    verifyPermission(userPermissions, "list-claim-object") ||
    verifyPermission(userPermissions, "list-staff-from-any-unit") ||
    verifyPermission(userPermissions, "list-staff-from-my-unit") ||
    verifyPermission(userPermissions, "list-staff-from-maybe-no-unit") ||
    verifyPermission(userPermissions, "list-severity-level") ||
    verifyPermission(userPermissions, "list-currency") ||
    verifyPermission(userPermissions, "update-notifications") ||
    verifyPermission(userPermissions, "list-channel") ||
    verifyPermission(userPermissions, "update-active-pilot") ||
    verifyPermission(userPermissions, "list-faq") ||
    verifyPermission(userPermissions, "list-faq-category") ||
    verifyPermission(
      userPermissions,
      "config-reporting-claim-any-institution"
    ) ||
    verifyPermission(userPermissions, "update-recurrence-alert-settings") ||
    verifyPermission(
      userPermissions,
      "update-reject-unit-transfer-parameters"
    ) ||
    verifyPermission(userPermissions, "list-any-institution-type-role") ||
    verifyPermission(userPermissions, "list-my-institution-type-role") ||
    verifyPermission(userPermissions, "update-min-fusion-percent-parameters") ||
    verifyPermission(userPermissions, "update-components-parameters") ||
    verifyPermission(userPermissions, "update-relance-parameters") ||
    verifyPermission(userPermissions, "list-account-type") ||
    verifyPermission(userPermissions, "list-auth-config") ||
    verifyPermission(userPermissions, "update-auth-config") ||
    verifyPermission(userPermissions, "activity-log") ||
    verifyPermission(userPermissions, "list-notification-proof") ||
    verifyPermission(userPermissions, "pilot-list-notification-proof") ||
    verifyPermission(userPermissions, "list-any-notification-proof") ||
    verifyPermission(userPermissions, "update-reporting-titles-configs") ||
    verifyPermission(userPermissions, "pilot-list-any-notification-proof") ||
    verifyPermission(
      userPermissions,
      "list-config-reporting-claim-my-institution"
    ) ||
    verifyPermission(
      userPermissions,
      "store-config-reporting-claim-my-institution"
    ) ||
    verifyPermission(
      userPermissions,
      "update-config-reporting-claim-my-institution"
    ) ||
    verifyPermission(
      userPermissions,
      "delete-config-reporting-claim-my-institution"
    ) ||
    true
  );
};

export const seeCollect = (userPermissions) => {
  return (
    verifyPermission(userPermissions, "store-claim-against-any-institution") ||
    verifyPermission(userPermissions, "store-claim-against-my-institution") ||
    verifyPermission(userPermissions, "store-claim-without-client") ||
    verifyPermission(
      userPermissions,
      "list-claim-incomplete-against-any-institution"
    ) ||
    verifyPermission(
      userPermissions,
      "list-claim-incomplete-against-my-institution"
    ) ||
    verifyPermission(userPermissions, "list-claim-incomplete-without-client")
  );
};

export const seeHistorique = (userPermissions) => {
  return (
    verifyPermission(userPermissions, "history-list-treat-claim") ||
    verifyPermission(userPermissions, "history-list-create-claim")
  );
};

export const seeTreatment = (userPermissions) => {
  return (
    verifyPermission(userPermissions, "show-claim-awaiting-assignment") ||
    verifyPermission(userPermissions, "list-claim-awaiting-treatment") ||
    verifyPermission(
      userPermissions,
      "list-claim-awaiting-validation-my-institution"
    ) ||
    verifyPermission(userPermissions, "list-satisfaction-measured-any-claim") ||
    verifyPermission(userPermissions, "list-satisfaction-measured-my-claim") ||
    verifyPermission(userPermissions, "list-my-claim-archived") ||
    verifyPermission(userPermissions, "list-any-claim-archived") ||
    verifyPermission(
      userPermissions,
      "list-claim-awaiting-validation-any-institution"
    ) ||
    verifyPermission(userPermissions, "list-claim-assignment-to-staff") ||
    verifyPermission(userPermissions, "list-claim-satisfaction-measured") ||
    verifyPermission(userPermissions, "list-my-discussions") ||
    verifyPermission(userPermissions, "contribute-discussion") ||
    verifyPermission(userPermissions, "list-claim-archived") ||
    verifyPermission(userPermissions, "list-my-discussions") ||
    verifyPermission(userPermissions, "contribute-discussion") ||
    verifyPermission(userPermissions, "list-unit-revivals") ||
    verifyPermission(userPermissions, "list-staff-revivals")
  );
};

export const seeMonitoring = (userPermissions, isLead) => {
  return (
    verifyPermission(
      userPermissions,
      "list-monitoring-claim-any-institution"
    ) ||
    verifyPermission(userPermissions, "list-monitoring-claim-my-institution") ||
    verifyPermission(userPermissions, "list-reporting-claim-any-institution") ||
    verifyPermission(userPermissions, "list-reporting-claim-my-institution") ||
    verifyPermission(
      userPermissions,
      "list-regulatory-reporting-claim-my-institution"
    ) ||
    verifyPermission(userPermissions, "system-my-efficiency-report") ||
    verifyPermission(userPermissions, "list-global-reporting") ||
    verifyPermission(
      userPermissions,
      "config-reporting-claim-my-institution"
    ) ||
    verifyPermission(userPermissions, "access-satisfaction-data-config") ||
    verifyPermission(userPermissions, "list-benchmarking-reporting") ||
    verifyPermission(userPermissions, "list-system-usage-reporting") ||
    (verifyPermission(userPermissions, "show-my-staff-monitoring") && isLead)
  );
};

export const seeReports = (userPermissions) => {
  return (
    verifyPermission(userPermissions, "list-reporting-claim-any-institution") ||
    verifyPermission(userPermissions, "list-reporting-claim-my-institution") ||
    verifyPermission(userPermissions, "bci-monthly-reports") ||
    verifyPermission(
      userPermissions,
      "list-regulatory-reporting-claim-any-institution"
    ) ||
    verifyPermission(
      userPermissions,
      "list-regulatory-reporting-claim-my-institution"
    ) ||
    verifyPermission(userPermissions, "bci-annual-reports") ||
    verifyPermission(
      userPermissions,
      "list-regulatory-reporting-claim-any-institution"
    ) ||
    verifyPermission(
      userPermissions,
      "list-regulatory-reporting-claim-my-institution"
    ) ||
    verifyPermission(userPermissions, "bci-annual-reports") ||
    verifyPermission(userPermissions, "system-any-efficiency-report") ||
    verifyPermission(userPermissions, "system-my-efficiency-report") ||
    verifyPermission(userPermissions, "list-global-reporting") ||
    verifyPermission(userPermissions, "list-system-usage-reporting") ||
    verifyPermission(userPermissions, "list-reporting-claim-any-institution")
  );
};

export const validatedClaimRule = (id) => {
  return {
    MACRO: {
      endpoint: {
        validate: `${appConfig.apiDomaine}/claim-awaiting-validation-my-institution/${id}/validate`,
        invalidate: `${appConfig.apiDomaine}/claim-awaiting-validation-my-institution/${id}/invalidate`,
      },
      permission: "validate-treatment-my-institution",
    },
    PRO: {
      endpoint: {
        validate: `${appConfig.apiDomaine}/claim-awaiting-validation-my-institution/${id}/validate`,
        invalidate: `${appConfig.apiDomaine}/claim-awaiting-validation-my-institution/${id}/invalidate`,
      },
      permission: "validate-treatment-my-institution",
    },
    HUB: {
      endpoint: {
        validate: `${appConfig.apiDomaine}/claim-awaiting-validation-any-institution/${id}/validate`,
        invalidate: `${appConfig.apiDomaine}/claim-awaiting-validation-any-institution/${id}/invalidate`,
      },
      permission: "validate-treatment-any-institution",
    },
  };
};

export const formatDate = (date) => {
  date = date.split("/");
  date = date[2] + "-" + date[1] + "-" + date[0];
  return new Date(date);
};

export const debug = (variable, label = null) => {
  console.log(`${label ? label + ":" : "debug:"}`, variable);
};

export const getLowerCaseString = (value) => {
  return (value + "").toLowerCase();
};

export const logout = () => {
  const plan = ls.get("plan");
  const lng = ls.get("i18nextLng");
  localStorage.clear();
  ls.set("plan", plan);
  lng !== null && ls.set("i18nextLng", lng);
  localStorage.removeItem("DTimeout");
  window.location.href = "/login";
};

export const refreshToken = async () => {
  var date = new Date();
  date.setHours(date.getHours() + appConfig.timeAfterDisconnection);
  const data = {
    grant_type: "refresh_token",
    refresh_token: ls.get("refresh_token"),
    client_id: listConnectData[ls.get("plan")].client_id,
    client_secret: listConnectData[ls.get("plan")].client_secret,
  };

  await axios
    .post(`${appConfig.apiDomaine}/oauth/token`, data)
    .then(({ data }) => {
      ls.set("token", data.access_token);
      ls.set("expire_in", data.expires_in);
      var date = new Date();
      date.setSeconds(date.getSeconds() + data.expires_in - 180);
      ls.set("date_expire", date);
      ls.set("refresh_token", data.refresh_token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.access_token}`;
    })
    .catch(() => {
      console.log("Something is wrong");
    });
};

export const truncateString = (text, length = 41) => {
  if (text.length <= 50) return text;
  return `${text.substring(0, length)}...`;
};
export const getToken = (url) => {
  if (url !== null) return url.split("/")[4];
  else return "";
};

export const formatStatus = (statutes) => {
  const array = Object.entries(statutes);
  const newArray = [];
  for (var i = 0; i < array.length; i++) {
    newArray.push({
      value: array[i][0],
      label: array[i][1],
    });
  }

  return newArray;
};

export const removeNullValueInObject = (obj) => {
  const array = Object.entries(obj);
  for (var i = 0; i < array.length; i++) {
    if (array[i][1] === null) delete obj[array[i][0]];
  }
  return obj;
};

export const showDatePassed = (claim) => {
  const timeExpire = `${
    claim.timeExpire < 0
      ? `j+${`${claim.timeExpire}`.replace("-", "")}`
      : "j-" + claim.timeExpire
  }`;

  return claim.timeExpire >= 0 ? (
    <span style={{ color: "forestgreen", fontWeight: "bold" }}>
      {timeExpire}
    </span>
  ) : (
    <span style={{ color: "red", fontWeight: "bold" }}>{timeExpire}</span>
  );
};

export const showValue = (value) => {
  let temp = "";
  if (value?.at(0) == "-") {
    console.log(typeof value);
    temp = value?.substring(1);
    console.log(temp);
  }

  return (
    <strong className={value?.at(0) == "-" ? "text-danger" : "text-success"}>
      {value?.at(0) == "-" ? temp : value}
    </strong>
  );
};

export const showDatePassed2 = (claim) => {
  const timeExpire = `${
    claim.timeExpire < 0
      ? `j+${`${claim.timeExpire}`.replace("-", "")}`
      : "j-" + claim.timeExpire
  }`;

  return (
    <strong className={claim.timeExpire >= 0 ? "text-success" : "text-danger"}>
      {timeExpire}
    </strong>
  );
};
export const getBase64Image = (img) => {
  // Create an empty canvas element
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  // Copy the image contents to the canvas
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // Get the data-URL formatted image
  // Firefox supports PNG and JPEG. You could check img.src to
  // guess the original format, but be aware the using "image/jpg"
  // will re-encode the image.
  var dataURL = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
};
export function getBase64FromImageUrl(url) {
  var img = new Image();

  img.setAttribute("crossOrigin", "anonymous");

  img.onload = function() {
    var canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(this, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
  };

  img.src = url;
}
export function InstitutionLogoBase64({ institutionLogo, setInstitutionLogo }) {
  var img = new Image();
  img.setAttribute("crossOrigin", "anonymous");
  img.onload = function() {
    var canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(this, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    setInstitutionLogo(dataURL);
  };
  img.src = institutionLogo;
}
export const seeEscalade = (userPermissions) => {
  return (
    verifyPermission(userPermissions, "list-my-claim-unsatisfied") ||
    verifyPermission(userPermissions, "close-my-claims") ||
    verifyPermission(userPermissions, "update-treatment-board") ||
    verifyPermission(userPermissions, "store-treatment-board") ||
    verifyPermission(userPermissions, "list-claim-awaiting-treatment") ||
    verifyPermission(userPermissions, "assignment-claim-awaiting-treatment") ||
    verifyPermission(
      userPermissions,
      "list-claim-awaiting-validation-my-institution"
    ) ||
    verifyPermission(
      userPermissions,
      "list-claim-awaiting-validation-any-institution"
    ) ||
    verifyPermission(userPermissions, "list-satisfaction-measured-any-claim") ||
    verifyPermission(userPermissions, "list-satisfaction-measured-my-claim") ||
    verifyPermission(userPermissions, "list-my-discussions") ||
    verifyPermission(userPermissions, "contribute-discussion")
  );
};

export const seeInternalControl = (userPermissions) => {
  return verifyPermission(userPermissions, "internal-control-claim");
  // 'internal-control-claim','internal-control-claim-detail','internal-control-index',
  // ||
  // verifyPermission(userPermissions, "internal-control-index")
  // verifyPermission(userPermissions, "internal-control-store")
};

export const displayStatus = (status) => {
  let finalStatus = "";

  if (i18n.isInitialized) {
    switch (status) {
      case "incomplete":
        finalStatus = i18n.t("incomplète");
        break;
      case "full":
        finalStatus = i18n.t("complète");
        break;
      case "transferred_to_unit":
        finalStatus = i18n.t("transférer à une unité");
        break;
      case "transferred_to_targeted_institution":
        finalStatus = i18n.t("transférer à une institution ciblée");
        break;
      case "assigned_to_staff":
        finalStatus = i18n.t("assigner à un staff");
        break;
      case "treated":
        finalStatus = i18n.t("traitée");
        break;
      case "validated":
        finalStatus = i18n.t("validée");
        break;
      case "archived":
        finalStatus = i18n.t("archivée");
        break;
      case "awaiting":
        finalStatus = i18n.t("en attente");
        break;
      case "unsatisfied":
        finalStatus = i18n.t("Non satisfait");
        break;
      case "considered":
        finalStatus = i18n.t("considérée");
        break;
      default:
        finalStatus = status;
        break;
    }
  }

  return finalStatus;
};
