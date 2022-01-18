import {RECEPTION_CHANNEL, RESPONSE_CHANNEL} from "../constants/channel";
import {verifyPermission} from "./permission";
import appConfig from "../config/appConfig";
import moment from "moment";
import axios from "axios";
import {listConnectData} from "../constants/userClient";
import {AUTH_TOKEN} from "../constants/token";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

moment.locale();
export const existingScript = function (id) {
    return !!document.getElementById(id);
};

export const exitingStyleSheet = (id) => {
    return !!document.getElementById(id);
};

export const loadCss = function (linkStylsheet) {
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

export const loadScript = function (src) {
    var tag = document.createElement('script');
    tag.src = src;

    switch (src) {
        case "assets/plugins/custom/datatables/datatables.bundle.js":
            tag.id = "data-table-script";
            if (!existingScript("data-table-script"))
                document.getElementsByTagName('body')[0].appendChild(tag);
            break;
        case "/assets/plugins/custom/datatables/datatables.bundle.js":
            tag.id = "data-table-script";
            if (!existingScript("data-table-script"))
                document.getElementsByTagName('body')[0].appendChild(tag);
            break;
        case "/assets/js/pages/custom/login/login-1.js":
            tag.id = "script-login-page";
            if (!existingScript("script-login-page"))
                document.getElementsByTagName('body')[0].appendChild(tag);
            break;
        case "/assets/plugins/global/plugins.bundle.js":
            tag.id = "script-global-one";
            if (!existingScript("script-global-one"))
                document.getElementsByTagName('body')[0].appendChild(tag);
            break;
        case "/assets/js/scripts.bundle.js":
            tag.id = "script-global-two";
            if (!existingScript("script-global-two"))
                document.getElementsByTagName('body')[0].appendChild(tag);
            break;
        case "/assets/js/pages/custom/wizard/wizard-2.js":
            tag.id = "script-wizard-2";
            if (!existingScript("script-wizard-2"))
                document.getElementsByTagName('body')[0].appendChild(tag);
            break;
        case "/assets/js/pages/custom/chat/chat.js":
            tag.id = "script-chat-2";
            if (!existingScript("script-chat-2"))
                document.getElementsByTagName('body')[0].appendChild(tag);
            break;
        default:
            break;
    }
};

export const formatSelectOption = function (options, labelKey, translate, valueKey = "id") {
    const newOptions = [];
    for (let i = 0; i < options.length; i++) {
        if (translate)
            newOptions.push({value: (options[i])[valueKey], label: ((options[i])[labelKey])[translate]});
        else
            newOptions.push({value: (options[i])[valueKey], label: (options[i])[labelKey]});
    }
    return newOptions;
};


export const forceRound = (decimalNumber) => {
    return (("" + decimalNumber).split('.'))[1] ? Math.trunc(decimalNumber) + 1 : Math.trunc(decimalNumber);
};

export const formatPermissions = (permissions) => {
    const newPermissions = [];
    permissions.map(permission => newPermissions.push(permission.name));
    return newPermissions;
};

export const filterDataTableBySearchValue = () => {
    function myFunction() {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("myTable");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1)
                    tr[i].style.display = "";
                else
                    tr[i].style.display = "none";
            }
        }
    }

    myFunction();
};

export const filterDiscussionBySearchValue = () => {
    function myFunction() {
        var input, filter, ul, li, a, i, txtValue;
        input = document.getElementById('myInput');
        filter = input.value.toUpperCase();
        ul = document.getElementById("myUL");
        li = ul.getElementsByTagName('li');

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
            if (channels[i].is_response === 1)
                newChannels.push(channels[i]);
        } else if (typeFilter === RECEPTION_CHANNEL) {
            if (channels[i].is_response === 0)
                newChannels.push(channels[i]);
        } else
            return channels
    }
    return newChannels;
};

export const percentageData = (data, total) => {

    if (total !== 0)
        return Math.round((data * 100) / total) + "%";
    else return 0 + "%"

};
// export const percentage = (data, total) => {
//
//     if (total !== 0)
//         return Math.round((data * 100) / total) ;
//     else return 0
//
// };

export const formatToTimeStamp = dateTime => {
    if (dateTime.length)
        return dateTime.split("T")[0] + " " + dateTime.split("T")[1];
    else
        return "";
};
export const formatToTimeStampUpdate = dateTime => {
    if (dateTime.length)
        return dateTime.split("T")[0] + " " + dateTime.split("T")[1].substring(0, 5);
    else
        return "";
};

export const formatDateToTimeStampte = dateTime => {
    if (dateTime)
        return moment(dateTime).format('LLLL');

    else
        return "Pas de date";
};

export const formatDateToTime = dateTime => {
    if (dateTime)
        return moment(dateTime).format('L');

    else
        return "Pas de date";
};

export const formatToTime = dateTime => {
    if (dateTime !== null)
        return dateTime.split("T")[0] + "T" + dateTime.split("T")[1].split(".")[0];
    else
        return "";
};
export const reduceCharacter = texte => {
    if (texte !== null)
       return texte.substr(0,30 )+"...";
    else
        return "";
};
// export const takeToken = url => {
//     if (url !== null)
//        return url.substr(38 );
//     else
//         return "";
// };

export const seeParameters = (userPermissions) => {
    return (
        verifyPermission(userPermissions, "update-sms-parameters")
        || verifyPermission(userPermissions, 'update-mail-parameters')
        || verifyPermission(userPermissions, "list-any-institution")
        || verifyPermission(userPermissions, "update-my-institution")
        || verifyPermission(userPermissions, "update-claim-object-requirement")
        || verifyPermission(userPermissions, 'update-processing-circuit-my-institution')
        || verifyPermission(userPermissions, "update-processing-circuit-any-institution")
        || verifyPermission(userPermissions, "update-processing-circuit-without-institution")
        || verifyPermission(userPermissions, "list-client-from-any-institution")
        || verifyPermission(userPermissions, "list-client-from-my-institution")
        || verifyPermission(userPermissions, "list-relationship")
        || verifyPermission(userPermissions, 'update-category-client')
        || verifyPermission(userPermissions, "list-type-client")
        || verifyPermission(userPermissions, "list-performance-indicator")
        || verifyPermission(userPermissions, 'list-unit-type')
        || verifyPermission(userPermissions, 'list-any-unit')
        || verifyPermission(userPermissions, 'list-position')
        || verifyPermission(userPermissions, 'list-claim-category')
        || verifyPermission(userPermissions, 'list-claim-object')
        || verifyPermission(userPermissions, "list-staff-from-any-unit")
        || verifyPermission(userPermissions, 'list-staff-from-my-unit')
        || verifyPermission(userPermissions, 'list-staff-from-maybe-no-unit')
        || verifyPermission(userPermissions, 'list-severity-level')
        || verifyPermission(userPermissions, 'list-currency')
        || verifyPermission(userPermissions, 'update-notifications')
        || verifyPermission(userPermissions, 'list-channel')
        || verifyPermission(userPermissions, 'update-active-pilot')
        || verifyPermission(userPermissions, "list-faq")
        || verifyPermission(userPermissions, "list-faq-category")
        || verifyPermission(userPermissions, "config-reporting-claim-my-institution")
        || verifyPermission(userPermissions, "config-reporting-claim-any-institution")
        || verifyPermission(userPermissions, "update-recurrence-alert-settings")
        || verifyPermission(userPermissions, "update-reject-unit-transfer-parameters")
        || verifyPermission(userPermissions, "list-any-institution-type-role")
        || verifyPermission(userPermissions, "list-my-institution-type-role")
        || verifyPermission(userPermissions, "update-min-fusion-percent-parameters")
        || verifyPermission(userPermissions, "update-components-parameters")
        || verifyPermission(userPermissions, "update-relance-parameters")
        || verifyPermission(userPermissions, "list-account-type")
        || verifyPermission(userPermissions, "list-auth-config")
        || verifyPermission(userPermissions, "update-auth-config")
        || verifyPermission(userPermissions, "activity-log")
        || true
    );
};

export const seeCollect = (userPermissions) => {
    return (
        verifyPermission(userPermissions, 'store-claim-against-any-institution')
        || verifyPermission(userPermissions, "store-claim-against-my-institution")
        || verifyPermission(userPermissions, "store-claim-without-client")
        || verifyPermission(userPermissions, 'list-claim-incomplete-against-any-institution')
        || verifyPermission(userPermissions, "list-claim-incomplete-against-my-institution")
        || verifyPermission(userPermissions, "list-claim-incomplete-without-client")
    );
};

export const seeHistorique = (userPermissions) => {
    return (
        verifyPermission(userPermissions, 'history-list-treat-claim')
        || verifyPermission(userPermissions, 'history-list-create-claim')

    );
};

export const seeTreatment = (userPermissions) => {
    return (verifyPermission(userPermissions, "show-claim-awaiting-assignment")
        || verifyPermission(userPermissions, 'list-claim-awaiting-treatment')
        || verifyPermission(userPermissions, 'list-claim-awaiting-validation-my-institution')
        || verifyPermission(userPermissions, 'list-satisfaction-measured-any-claim')
        || verifyPermission(userPermissions, 'list-satisfaction-measured-my-claim')
        || verifyPermission(userPermissions, 'list-my-claim-archived')
        || verifyPermission(userPermissions, 'list-any-claim-archived')
        || verifyPermission(userPermissions, 'list-claim-awaiting-validation-any-institution')
        || verifyPermission(userPermissions, 'list-claim-assignment-to-staff')
        || verifyPermission(userPermissions, 'list-claim-satisfaction-measured')
        || verifyPermission(userPermissions, 'list-my-discussions')
        || verifyPermission(userPermissions, 'contribute-discussion')
        || verifyPermission(userPermissions, 'list-claim-archived')
        || verifyPermission(userPermissions, 'list-my-discussions')
        || verifyPermission(userPermissions, 'contribute-discussion')
    );
};

export const seeMonitoring = (userPermissions) => {
    return (verifyPermission(userPermissions, "list-monitoring-claim-any-institution")
        || verifyPermission(userPermissions, 'list-monitoring-claim-my-institution')
        || verifyPermission(userPermissions, 'list-reporting-claim-any-institution')
        || verifyPermission(userPermissions, 'list-reporting-claim-my-institution')
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
            permission: "validate-treatment-my-institution"
        },
        HUB: {
            endpoint: {
                validate: `${appConfig.apiDomaine}/claim-awaiting-validation-any-institution/${id}/validate`,
                invalidate: `${appConfig.apiDomaine}/claim-awaiting-validation-any-institution/${id}/invalidate`,
            },
            permission: "validate-treatment-any-institution"
        }
    }
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
    const plan = localStorage.getItem('plan');
    const lng = localStorage.getItem('i18nextLng');
    localStorage.clear();
    localStorage.setItem('plan', plan);
    localStorage.setItem('i18nextLng', lng);
    window.location.href = "/login";
};

export const refreshToken = async () => {
    var date = new Date();
    date.setHours(date.getHours() + appConfig.timeAfterDisconnection);
    console.log("date:", date);

    const data = {
        grant_type: "refresh_token",
        refresh_token: localStorage.getItem('refresh_token'),
        client_id: listConnectData[localStorage.getItem('plan')].client_id,
        client_secret: listConnectData[localStorage.getItem('plan')].client_secret,
    };

    await axios.post(`${appConfig.apiDomaine}/oauth/token`, data)
        .then(({data}) => {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('expire_in', data.expires_in);
            var date = new Date();
            date.setSeconds(date.getSeconds() + data.expires_in - 180);
            localStorage.setItem('date_expire', date);
            localStorage.setItem('refresh_token', data.refresh_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        })
        .catch(() => {
            console.log("Something is wrong");
        })
    ;
};

export const truncateString = (text, length = 41) => {
    if (text.length <= 50)
        return text;
    return `${text.substring(0, length)}...`;
};
export const getToken = url => {
    if (url !== null)
        return url.split("/")[4];
    else
        return "";
};


export const formatStatus = (statutes) => {
    const array = Object.entries(statutes);
    const newArray = [];
    for (var i = 0; i < array.length; i++) {
        newArray.push({
            value: array[i][0],
            label: array[i][1]
        })
    }

    return newArray;
};

export const removeNullValueInObject = (obj) => {
    const array = Object.entries(obj);
    for (var i = 0; i < array.length; i++) {
        if (array[i][1] === null)
            delete obj[array[i][0]];
    }
    return obj;
};
