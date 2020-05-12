export const loadCss = function (linkStylsheet) {
    var tag = document.createElement("link");
    tag.href = linkStylsheet;
    tag.rel = "stylesheet";
    switch (linkStylsheet) {
        case "/assets/plugins/custom/datatables/datatables.bundle.css":
            tag.id = "style-dataTable";
            if (!exitingStyleSheet("style-dataTable"))
                document.getElementsByTagName("head")[0].append(tag);
            break;
        default:
                break;
    }
};

export const exitingStyleSheet = (id) => {
    return !!document.getElementById(id);
};

export const loadScript = function(src) {
    var tag = document.createElement('script');
    tag.src = src;

    switch (src) {
        case "assets/plugins/custom/datatables/datatables.bundle.js":
            tag.id = "profile-info-user";
            if (!existingScript("profile-info-user"))
                document.getElementsByTagName('body')[0].appendChild(tag);
            break;
        default:
            break;
    }
};

export const existingScript = function (id) {
    return !!document.getElementById(id);
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
