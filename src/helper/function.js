export const loadCss = async function (linkStylsheet) {
    var tag = document.createElement("link");
    tag.href = linkStylsheet;
    tag.rel = "stylesheet";
    document.getElementsByTagName("head")[0].append(tag);
};

export const loadScript = async function(src) {
    var tag = document.createElement('script');
    tag.src = src;

    switch (src) {
        case "js/datatable.js":
            tag.id = "script-datatable";
            removeExistingScript("script-datatable");
            break;
        case "js/refreshDatatable.js":
            tag.id = "refresh-script-datatable";
            removeExistingScript("refresh-script-datatable");
            break;
        case "js/addModal.js":
            tag.id = "add-modal-script";
            removeExistingScript("add-modal-script");
            break;
        case "js/tooltip.js":
            tag.id = "tooltip-script";
            removeExistingScript("tooltip-script");
            break;
        case "assets/js/pages/dashboard.js":
            tag.id = "dashboard-user";
            removeExistingScript("dashboard-user");
            break;
        case "assets/js/pages/custom/user/profile.js":
            tag.id = "profile-info-user";
            removeExistingScript("profile-info-user");
            break;
        case "assets/plugins/custom/datatables/datatables.bundle.css":
            tag.id = "profile-info-user";
            removeExistingScript("profile-info-user");
            break;
            case "assets/js/pages/crud/file-upload/ktavatar.js":
            tag.id = "profile";
            removeExistingScript("profile");
            break;
        default:
            break;
    }
    document.getElementsByTagName('body')[0].appendChild(tag);
};

export const removeExistingScript = function (id) {
    if (document.getElementById(id))
        document.getElementById(id).remove();
};

export const formatSelectOption = function(options, key, translate) {
    const newOptions = [];
    for (let i = 0; i < options.length; i++) {
        if (translate)
            newOptions.push({value: options[i].id, label: ((options[i])[key])[translate]});
        else
            newOptions.push({value: options[i].id, label: (options[i])[key]});
    }
    return newOptions;
};


export const forceRound = (decimalNumber) => {
    return ((""+decimalNumber).split('.'))[1] ? Math.trunc(decimalNumber) + 1 : Math.trunc(decimalNumber);
};
