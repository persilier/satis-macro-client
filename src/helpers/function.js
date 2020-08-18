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
    return Math.round((data * 100) / total)+"%"
};

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

export const formatToTime = dateTime => {
    if (dateTime.length)
        return dateTime.split("T")[0] + "T" + dateTime.split("T")[1].split(".")[0];
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
    date = date[2]+"-"+date[1]+"-"+date[0];
    return new Date(date);
};

export const debug = (variable, label = null) => {
    console.log(`${label ? label+":" : "debug:"}`, variable);
};

/*
*
*
*
* [
  {
    "text": "Le délai de traitement de la réclamation : Reference: 202008-233923. Objet : Braulio Brekke a expiré depuis 2h",
    "claim": {
      "id": "0155686b-55d9-4ebe-ada1-79191e1b9b82",
      "reference": "202008-233923",
      "description": "Nihil mollitia itaque quia optio placeat esse vel. Tenetur omnis quia hic earum nobis voluptatem.",
      "claim_object_id": "6001cdcd-0b8d-44b3-8717-b56d3977d6e5",
      "claimer_id": "e5f1b088-90de-4b4e-ba3c-5b1de1d59381",
      "relationship_id": null,
      "account_targeted_id": null,
      "institution_targeted_id": "7405fe1b-5ac5-44c5-a253-430f417d01b9",
      "unit_targeted_id": null,
      "request_channel_slug": "web",
      "response_channel_slug": "email",
      "event_occured_at": "2001-11-09T00:06:06.000000Z",
      "claimer_expectation": "Quia quia minima et non delectus autem quia. Alias dolore porro sit nesciunt. Nam veritatis dolorem nostrum quo hic ut.",
      "amount_disputed": 700997,
      "amount_currency_slug": "franc-cfa-uemoa",
      "is_revival": 1,
      "created_by": "d6e144fc-493d-4685-91c0-27650bcd6921",
      "completed_by": "d6e144fc-493d-4685-91c0-27650bcd6921",
      "completed_at": "2020-08-06T16:53:12.000000Z",
      "active_treatment_id": "8e96d8fd-cd9d-4de5-857c-b24ab162ea92",
      "archived_at": null,
      "status": "assigned_to_staff",
      "created_at": "2020-08-06T16:53:12.000000Z",
      "updated_at": "2020-08-07T09:36:22.000000Z",
      "deleted_at": null,
      "claim_object": {
        "id": "6001cdcd-0b8d-44b3-8717-b56d3977d6e5",
        "name": {
          "fr": "Braulio Brekke"
        },
        "time_limit": 2,
        "severity_levels_id": "714aa211-6e56-4e8c-a4a8-ec5006e5136e",
        "description": {
          "fr": "Animi officia reprehenderit culpa dolore quia. Dolor optio porro impedit sed non repudiandae beatae. Veritatis sed illo mollitia rerum. Illo exercitationem ut voluptatibus aliquid quia."
        },
        "claim_category_id": "63d62710-1047-468f-8dd8-a6032f3a5cb1",
        "others": null,
        "created_at": "2020-06-26T15:53:36.000000Z",
        "updated_at": "2020-06-26T15:53:36.000000Z",
        "deleted_at": null
      }
    },
    "id": "d4dd86a5-f389-4e6c-84fd-94c197c35b9e",
    "type": "Satis2020\\ServicePackage\\Notifications\\ReminderAfterDeadline"
  }
]*/
