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
            // case "assets/js/pages/components/extended/blockui.js":
            // tag.id = "blockui";
            // removeExistingScript("blockui");
            // break;
            // case "assets/js/pages/components/extended/sweetalert2.js":
            // tag.id = "sweetalert2";
            // removeExistingScript("sweetalert2");
            // break;
        default:
            break;
    }
    document.getElementsByTagName('body')[0].appendChild(tag);
};

export const removeExistingScript = function (id) {
    if (document.getElementById(id))
        document.getElementById(id).remove();
};
