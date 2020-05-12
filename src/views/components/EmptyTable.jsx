import React from "react";

const EmptyTable = () => {
    return (
        <tr>
            <td colSpan={100} className="text-center">
                <span className="kt-datatable--error">Le tableau est vide</span>
            </td>
        </tr>
    )
};

export default EmptyTable;
