import React from "react";
import {NavLink} from "react-router-dom";
import {verifyPermission} from "../../helpers/permission";

const ExportButton = ({pageUrl, downloadLink}) => {
    return (
        <div className="col-sm-6 text-right">
            <div className="dt-buttons btn-group flex-wrap">
                {/*<button className="btn btn-secondary buttons-print" tabIndex="0" aria-controls="kt_table_1" type="button">
                    <span>Print</s  pan>
                </button>
                <button className="btn btn-secondary buttons-copy buttons-html5" tabIndex="0" aria-controls="kt_table_1" type="button">
                    <span>Copy</span>
                </button>*/}
                <a href={downloadLink} download={true} className="btn btn-secondary buttons-copy buttons-html5" tabIndex="0" aria-controls="kt_table_1" type="button">
                    <span>Télécharger le format</span>
                </a>

                <NavLink to={pageUrl} className="btn btn-secondary buttons-excel buttons-html5" tabIndex="0" aria-controls="kt_table_1" type="button">
                    <span>Importer via Excel</span>
                </NavLink>
                {/*<button className="btn btn-secondary buttons-csv buttons-html5" tabIndex="0" aria-controls="kt_table_1" type="button">
                    <span>CSV</span>
                </button>
                <button className="btn btn-secondary buttons-pdf buttons-html5" tabIndex="0" aria-controls="kt_table_1" type="button">
                    <span>PDF</span>
                </button>*/}
            </div>
        </div>
    );
};

export default ExportButton;
