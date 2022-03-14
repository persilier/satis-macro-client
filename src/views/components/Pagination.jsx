import {DOTS, usePagination} from "./PaginationRange";
import React from "react";

const Pagination = (props) => {
    const {
        onClickPage,
        onClickPreviousPage,
        onClickNextPage,
        siblingCount = 1,
        activeNumberPage,
        numberPage
    } = props;

    const paginationRange = usePagination({numberPage, siblingCount, activeNumberPage})

    /*    if (activeNumberPage === 0 || paginationRange.length < 2) {
            return null;
        }*/

    let lastPage = paginationRange[paginationRange.length - 1];

    return (
        <div>
            <div className="dataTables_length" id="kt_table_1_length">
                <label>
                    {("Afficher")}
                    <select value={props.numberPerPage} onChange={(e) => props.onChangeNumberPerPage(e)} name="kt_table_1_length" aria-controls="kt_table_1" className="custom-select custom-select-sm form-control form-control-sm">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    {("données")}
                </label>
            </div>

            <div className="dataTables_paginate paging_simple_numbers" id="kt_table_1_paginate">
                <ul className="pagination">
                    <li className={activeNumberPage === 1 ? "paginate_button page-item previous disabled" : "paginate_button page-item previous"} id="kt_table_1_previous">
                        <a onClick={e => onClickPreviousPage(e)} href="#previous" aria-controls="kt_table_1" data-dt-idx="0" tabIndex="0" className="page-link"><i className="la la-angle-left"/></a>
                    </li>
                    {
                        paginationRange.map(number => {
                            if (number === DOTS) {
                                return (
                                    <li key={number}
                                        className={"paginate_button page-item"}>
                                        <a href="#page" aria-controls="kt_table_1"
                                           data-dt-idx="1" tabIndex="0" className="page-link">
                                            {number}
                                        </a>
                                    </li>
                                )
                            }
                            return (
                                <li key={number}
                                    className={number === activeNumberPage ? "paginate_button page-item active" : "paginate_button page-item"}>
                                    <a onClick={(e) => onClickPage(e, number)} href="#page" aria-controls="kt_table_1"
                                       data-dt-idx="1" tabIndex="0" className="page-link">
                                        {number}
                                    </a>
                                </li>
                            )
                        })
                    }


                    <li className={activeNumberPage === lastPage ? "paginate_button page-item next disabled" : "paginate_button page-item next"} id="kt_table_1_next">
                        <a onClick={e => onClickNextPage(e)} href="#next" aria-controls="kt_table_1" data-dt-idx="5" tabIndex="0" className="page-link">
                            <i className="la la-angle-right"/>
                        </a>
                    </li>
                </ul>


            </div>


        </div>
    )


}

export default Pagination;
