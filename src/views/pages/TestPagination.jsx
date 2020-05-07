import React, {useState} from "react";
import {forceRound} from "../../helpers/function";


const LIST  = [
    {
        id: "001",
        name: "Lewhe Onesine",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio provident quod temporibus. Ad alias, commodi deserunt dolor doloremque, explicabo fugit id magni necessitatibus perspiciatis quibusdam repellendus, totam unde?"
    },
    {
        id: "002",
        name: "Hachemin Loïc",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio provident quod temporibus. Ad alias, commodi deserunt dolor doloremque, explicabo fugit id magni necessitatibus perspiciatis quibusdam repellendus, totam unde?"
    },
    {
        id: "003",
        name: "Gomez Jacob",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio provident quod temporibus. Ad alias, commodi deserunt dolor doloremque, explicabo fugit id magni necessitatibus perspiciatis quibusdam repellendus, totam unde?"
    },
    {
        id: "004",
        name: "Aghia Goodwin",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio provident quod temporibus. Ad alias, commodi deserunt dolor doloremque, explicabo fugit id magni necessitatibus perspiciatis quibusdam repellendus, totam unde?"
    },
    {
        id: "005",
        name: "Lewhe Adrielle",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio provident quod temporibus. Ad alias, commodi deserunt dolor doloremque, explicabo fugit id magni necessitatibus perspiciatis quibusdam repellendus, totam unde?"
    },
    {
        id: "006",
        name: "Codjo Festus",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio provident quod temporibus. Ad alias, commodi deserunt dolor doloremque, explicabo fugit id magni necessitatibus perspiciatis quibusdam repellendus, totam unde?"
    },
    {
        id: "007",
        name: "Lewhe Estelle",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio provident quod temporibus. Ad alias, commodi deserunt dolor doloremque, explicabo fugit id magni necessitatibus perspiciatis quibusdam repellendus, totam unde?"
    },
    {
        id: "008",
        name: "Lewhe Achille",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio provident quod temporibus. Ad alias, commodi deserunt dolor doloremque, explicabo fugit id magni necessitatibus perspiciatis quibusdam repellendus, totam unde?"
    },
    {
        id: "009",
        name: "Dossou Jean",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio provident quod temporibus. Ad alias, commodi deserunt dolor doloremque, explicabo fugit id magni necessitatibus perspiciatis quibusdam repellendus, totam unde?"
    },
];
const TestPagination = () => {
    const defaultShowList = [];
    const [list, setList] = useState(LIST);
    const [numberPerPage, setNumberPerPage] = useState(2);
    const [activeNumberPage, setActiveNumberPage] = useState(0);
    const [search, setSearch] = useState(false);
    const numberPage = forceRound(list.length/numberPerPage);
    const [showList, setShowList] = useState(list.slice(0, numberPerPage));

    const searchElement = (e) => {
        setSearch(true);
        if (e.target.value) {
            filterByInput(e);
        } else {
            filterByInput(e);
            setSearch(false);
        }
    };

    const filterByInput = (e) => {
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

    const onChangeNumberPerPage = (e) => {
        setActiveNumberPage(0);
        setNumberPerPage(parseInt(e.target.value));
        setShowList(list.slice(0, parseInt(e.target.value)));
    };

    const getEndByPosition = (position) => {
        let end = numberPerPage;
        for (let i = 0; i<position; i++) {
            end = end+numberPerPage;
        }
        return end;
    };

    const onClickPage = (e, page) => {
        e.preventDefault();
        setActiveNumberPage(page);
        setShowList(list.slice(getEndByPosition(page) - numberPerPage, getEndByPosition(page)));
    };

    const onClickNextPage = (e) => {
        e.preventDefault();
        if (activeNumberPage <= numberPage) {
            setActiveNumberPage(activeNumberPage + 1);
            setShowList(
                list.slice(
                    getEndByPosition(
                        activeNumberPage + 1) - numberPerPage,
                    getEndByPosition(activeNumberPage + 1)
                )
            );
        }
    };

    const onClickPreviousPage = (e) => {
        e.preventDefault();
        if (activeNumberPage >= 1) {
            setActiveNumberPage(activeNumberPage - 1);
            setShowList(
                list.slice(
                    getEndByPosition(activeNumberPage - 1) - numberPerPage,
                    getEndByPosition(activeNumberPage - 1)
                )
            );
        }
    };

    const onClickDelete = (element, index) => {
        const newList = [...list];
        newList.splice(index, 1);
        setList(newList);
        if (showList.length > 1) {
            setShowList(
                newList.slice(
                    getEndByPosition(activeNumberPage) - numberPerPage,
                    getEndByPosition(activeNumberPage)
                )
            );
        } else {
            setShowList(
                newList.slice(
                    getEndByPosition(activeNumberPage - 1) - numberPerPage,
                    getEndByPosition(activeNumberPage - 1)
                )
            );
        }
    };

    const arrayNumberPage = () => {
        const pages = [];
        for (let i = 0; i < numberPage; i++) {
            pages[i] = i;
        }
        return pages
    };

    const pages = arrayNumberPage();

    return (
        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            Buttons Examples
                        </h3>
                        <span className="kt-subheader__separator kt-hidden"/>
                        <div className="kt-subheader__breadcrumbs">
                            <a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                Datatables.net </a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                Extensions </a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                Buttons
                            </a>
                        </div>
                    </div>
                    <div className="kt-subheader__toolbar">
                        <div className="kt-subheader__wrapper">
                            <a href="#" className="btn kt-subheader__btn-primary">
                                Actions &nbsp;
                            </a>
                            <div className="dropdown dropdown-inline" data-toggle="kt-tooltip" title="" data-placement="left" data-original-title="Quick actions">
                                <a href="#" className="btn btn-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         className="kt-svg-icon kt-svg-icon--success kt-svg-icon--md">
                                        <g fill="none" fill-rule="evenodd">
                                            <path d="M0 0h24v24H0z"/>
                                            <path
                                                d="M5.857 2h7.88a1.5 1.5 0 01.968.355l4.764 4.029A1.5 1.5 0 0120 7.529v12.554c0 1.79-.02 1.917-1.857 1.917H5.857C4.02 22 4 21.874 4 20.083V3.917C4 2.127 4.02 2 5.857 2z"
                                                fill="#000" fill-rule="nonzero" opacity=".3"/>
                                            <path
                                                d="M11 14H9a1 1 0 010-2h2v-2a1 1 0 012 0v2h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2z"
                                                fill="#000"/>
                                        </g>
                                    </svg>
                                </a>
                                <div className="dropdown-menu dropdown-menu-fit dropdown-menu-md dropdown-menu-right">
                                    <ul className="kt-nav">
                                        <li className="kt-nav__head">
                                            Add anything or jump to:
                                            <i className="flaticon2-information" data-toggle="kt-tooltip" data-placement="right" title="" data-original-title="Click to learn more..."/>
                                        </li>
                                        <li className="kt-nav__separator"/>
                                        <li className="kt-nav__item">
                                            <a href="#" className="kt-nav__link">
                                                <i className="kt-nav__link-icon flaticon2-drop"/>
                                                <span className="kt-nav__link-text">Order</span>
                                            </a>
                                        </li>
                                        <li className="kt-nav__item">
                                            <a href="#" className="kt-nav__link">
                                                <i className="kt-nav__link-icon flaticon2-calendar-8"/>
                                                <span className="kt-nav__link-text">Ticket</span>
                                            </a>
                                        </li>
                                        <li className="kt-nav__item">
                                            <a href="#" className="kt-nav__link">
                                                <i className="kt-nav__link-icon flaticon2-telegram-logo"/>
                                                <span className="kt-nav__link-text">Goal</span>
                                            </a>
                                        </li>
                                        <li className="kt-nav__item">
                                            <a href="#" className="kt-nav__link">
                                                <i className="kt-nav__link-icon flaticon2-new-email"/>
                                                <span className="kt-nav__link-text">Support Case</span>
                                                <span className="kt-nav__link-badge">
                                                    <span className="kt-badge kt-badge--success">5</span>
                                                </span>
                                            </a>
                                        </li>
                                        <li className="kt-nav__separator"/>
                                        <li className="kt-nav__foot">
                                            <a className="btn btn-label-brand btn-bold btn-sm" href="#">Upgrade plan</a>
                                            <a className="btn btn-clean btn-bold btn-sm" href="#" data-toggle="kt-tooltip" data-placement="right" title="" data-original-title="Click to learn more...">Learn more</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                <div className="alert alert-light alert-elevate" role="alert">
                    <div className="alert-icon"><i className="flaticon-warning kt-font-brand"/></div>
                    <div className="alert-text">
                        A common UI paradigm to use with interactive tables is to present buttons that will trigger some action. See official documentation
                        <a className="kt-link kt-font-bold" href="https://datatables.net/extensions/buttons/" target="_blank">
                            here
                        </a>.
                    </div>
                </div>
                <div className="kt-portlet">
                    <div className="kt-portlet__head kt-portlet__head--lg">
                        <div className="kt-portlet__head-label">
                            <span className="kt-portlet__head-icon">
                                <i className="kt-font-brand flaticon2-line-chart"/>
                            </span>
                            <h3 className="kt-portlet__head-title">
                                Position
                            </h3>
                        </div>
                        <div className="kt-portlet__head-toolbar">
                            <div className="kt-portlet__head-wrapper">
                                &nbsp;
                                <div className="dropdown dropdown-inline">
                                    <a href={"#"} className="btn btn-brand btn-icon-sm">
                                        <i className="flaticon2-plus"/> Add New
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="kt-portlet__body">
                        <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">
                            <div className="row">
                                <div className="col-sm-6 text-left">
                                    <div id="kt_table_1_filter" className="dataTables_filter"><label>
                                        Search:
                                        <input id="myInput" type="text" onKeyUp={(e) => searchElement(e)} className="form-control form-control-sm" placeholder="" aria-controls="kt_table_1"/>
                                    </label>
                                    </div>
                                </div>
                                <div className="col-sm-6 text-right">
                                    <div className="dt-buttons btn-group flex-wrap">
                                        <button className="btn btn-secondary buttons-print" tabIndex="0"
                                                aria-controls="kt_table_1" type="button"><span>Print</span></button>
                                        <button className="btn btn-secondary buttons-copy buttons-html5" tabIndex="0"
                                                aria-controls="kt_table_1" type="button"><span>Copy</span></button>
                                        <button className="btn btn-secondary buttons-excel buttons-html5" tabIndex="0"
                                                aria-controls="kt_table_1" type="button"><span>Excel</span></button>
                                        <button className="btn btn-secondary buttons-csv buttons-html5" tabIndex="0"
                                                aria-controls="kt_table_1" type="button"><span>CSV</span></button>
                                        <button className="btn btn-secondary buttons-pdf buttons-html5" tabIndex="0"
                                                aria-controls="kt_table_1" type="button"><span>PDF</span></button>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-12">
                                    <table
                                        className="table table-striped- table-bordered table-hover table-checkable dataTable dtr-inline"
                                        id="myTable" role="grid" aria-describedby="kt_table_1_info"
                                        style={{ width: "952px" }}>
                                        <thead>
                                        <tr role="row">
                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1" colSpan="1" style={{ width: "70.25px" }} aria-label="Country: activate to sort column ascending">
                                                ID
                                            </th>
                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1" colSpan="1" style={{ width: "70px" }} aria-label="Country: activate to sort column ascending">
                                                Nom
                                            </th>
                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1" colSpan="1" style={{ width: "250px" }} aria-label="Ship City: activate to sort column ascending">
                                                Description
                                            </th>
                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1" colSpan="1" style={{ width: "40.25px" }} aria-label="Type: activate to sort column ascending">
                                                Action
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            search ? (
                                                list.map((element, index) => (
                                                    <tr key={index}>
                                                        <td>{element.id}</td>
                                                        <td>{element.name}</td>
                                                        <td>{element.description}</td>
                                                        <td>
                                                            <button onClick={(e) => onClickDelete(element, index)} className="btn btn-secondary">
                                                                Supprimer
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                showList.map((element, index) => (
                                                    <tr key={index}>
                                                        <td>{element.id}</td>
                                                        <td>{element.name}</td>
                                                        <td>{element.description}</td>
                                                        <td>
                                                            <button onClick={(e) => onClickDelete(element, index)} className="btn btn-secondary">
                                                                Supprimer
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )
                                        }
                                        </tbody>
                                        <tfoot>
                                        <tr>
                                            <th rowSpan="1" colSpan="1">ID</th>
                                            <th rowSpan="1" colSpan="1">Nom</th>
                                            <th rowSpan="1" colSpan="1">Description</th>
                                            <th rowSpan="1" colSpan="1">Action</th>
                                        </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-5">
                                    <div className="dataTables_info" id="kt_table_1_info" role="status"
                                         aria-live="polite">Affichage de 1 à {numberPerPage} sur {list.length} données
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-7 dataTables_pager">
                                    <div className="dataTables_length" id="kt_table_1_length">
                                        <label>
                                            Afficher
                                            <select value={numberPerPage} onChange={(e) => onChangeNumberPerPage(e)} name="kt_table_1_length" aria-controls="kt_table_1" className="custom-select custom-select-sm form-control form-control-sm">
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
                                            <li className={activeNumberPage === 0 ? "paginate_button page-item previous disabled" : "paginate_button page-item previous"} id="kt_table_1_previous">
                                                <a onClick={(e) => onClickPreviousPage(e)} href="#" aria-controls="kt_table_1" data-dt-idx="0" tabIndex="0" className="page-link"><i className="la la-angle-left"/></a>
                                            </li>
                                            {
                                                pages.map(number => (
                                                    <li key={number} className={number === activeNumberPage ? "paginate_button page-item active" : "paginate_button page-item"}>
                                                        <a onClick={(e) => onClickPage(e, number)} href="#" aria-controls="kt_table_1" data-dt-idx="1" tabIndex="0" className="page-link">
                                                            {number + 1}
                                                        </a>
                                                    </li>
                                                ))
                                            }
                                            <li className={activeNumberPage === numberPage - 1 ? "paginate_button page-item next disabled" : "paginate_button page-item next"} id="kt_table_1_next">
                                                <a onClick={(e) => onClickNextPage(e)} href="#" aria-controls="kt_table_1" data-dt-idx="5" tabIndex="0" className="page-link">
                                                    <i className="la la-angle-right"/>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPagination;
