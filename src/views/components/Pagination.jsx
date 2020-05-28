import React from "react";

const Pagination = (props) => {
    return (
        <div>
            <div className="dataTables_length" id="kt_table_1_length">
                <label>
                    Afficher
                    <select value={props.numberPerPage} onChange={(e) => props.onChangeNumberPerPage(e)} name="kt_table_1_length" aria-controls="kt_table_1" className="custom-select custom-select-sm form-control form-control-sm">
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    données
                </label>
            </div>

            <div className="dataTables_paginate paging_simple_numbers" id="kt_table_1_paginate">
                <ul className="pagination">
                    <li className={props.activeNumberPage === 0 ? "paginate_button page-item previous disabled" : "paginate_button page-item previous"} id="kt_table_1_previous">
                        <a onClick={(e) => props.onClickPreviousPage(e)} href="#previous" aria-controls="kt_table_1" data-dt-idx="0" tabIndex="0" className="page-link"><i className="la la-angle-left"/></a>
                    </li>
                    {
                        props.pages.map(number => (
                            <li key={number} className={number === props.activeNumberPage ? "paginate_button page-item active" : "paginate_button page-item"}>
                                <a onClick={(e) => props.onClickPage(e, number)} href="#page" aria-controls="kt_table_1" data-dt-idx="1" tabIndex="0" className="page-link">
                                    {number + 1}
                                </a>
                            </li>
                        ))
                    }
                    <li className={props.activeNumberPage === props.numberPage - 1 ? "paginate_button page-item next disabled" : "paginate_button page-item next"} id="kt_table_1_next">
                        <a onClick={(e) => props.onClickNextPage(e)} href="#next" aria-controls="kt_table_1" data-dt-idx="5" tabIndex="0" className="page-link">
                            <i className="la la-angle-right"/>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
};

export default Pagination;
