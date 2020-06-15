import {RECEPTION_CHANNEL, RESPONSE_CHANNEL} from "../constants/channel";

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
        default:
                break;
    }
};

export const loadScript = function(src) {
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
            document.getElementsByTagName('body')[0].appendChild(tag);
            break;
        case "/assets/js/scripts.bundle.js":
            tag.id = "script-global-two";
            document.getElementsByTagName('body')[0].appendChild(tag);
            break;
        default:
            break;
    }
};

export const formatSelectOption = function(options, labelKey, translate, valueKey = "id") {
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
    return ((""+decimalNumber).split('.'))[1] ? Math.trunc(decimalNumber) + 1 : Math.trunc(decimalNumber);
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
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
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
        } else {
            return channels
        }
    }
    return newChannels;
};

export const formatToTimeStamp = dateTime => {
    return dateTime.split("T")[0]+" "+dateTime.split("T")[1]
};
