import {RECEPTION_CHANNEL, RESPONSE_CHANNEL} from "../constants/channel";
import {verifyPermission} from "./permission";
import appConfig from "../config/appConfig";

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
    return Math.round((data * 100) / total)+"%"
};

export const formatToTimeStamp = dateTime => {
    if (dateTime.length)
        return dateTime.split("T")[0] + " " + dateTime.split("T")[1];
    else
        return "";
};

export const seeParameters = (userPermissions) => {
    return (verifyPermission(userPermissions, "update-sms-parameters")
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
        || verifyPermission(userPermissions, 'list-channel'))
        ;
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

export const seeTreatment = (userPermissions) => {
    return (verifyPermission(userPermissions, "show-claim-awaiting-assignment")
        || verifyPermission(userPermissions, 'list-claim-awaiting-treatment')
        || verifyPermission(userPermissions, 'list-claim-awaiting-validation-my-institution')
        || verifyPermission(userPermissions, 'list-claim-satisfaction-measured')
        || verifyPermission(userPermissions, 'list-claim-archived')
        || verifyPermission(userPermissions, 'list-claim-awaiting-validation-any-institution')
        || verifyPermission(userPermissions, 'list-claim-assignment-to-staff')
        || verifyPermission(userPermissions, 'list-claim-satisfaction-measured')
        || verifyPermission(userPermissions, 'list-my-discussions')
        || verifyPermission(userPermissions, 'contribute-discussion')
        || verifyPermission(userPermissions, 'list-claim-archived')
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
    date = date[2]+"-"+date[1]+"-"+date[0];
    return new Date(date);
};
