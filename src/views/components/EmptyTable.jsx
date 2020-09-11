import React from "react";

const EmptyTable = ({search}) => {
    return (
        <tr>
            <td colSpan={100} className="text-center">
                <span className="kt-datatable--error">
                    {
                        search ? "Pas d'élément pour cette recherche" : "Le tableau est vide"
                    }
                </span>
            </td>
        </tr>
    )
};

export default EmptyTable;
