import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Link
} from "react-router-dom";
import {loadCss,  filterDataTableBySearchValue, forceRound} from "../../helpers/function";
import LoadingTable from "../components/LoadingTable";
import {ToastBottomEnd} from "../components/Toast";
import {toastDeleteErrorMessageConfig, toastDeleteSuccessMessageConfig} from "../../config/toastConfig";
import {DeleteConfirmation} from "../components/ConfirmationAlert";
import {confirmDeleteConfig} from "../../config/confirmConfig";
import appConfig from "../../config/appConfig";
import Pagination from "../components/Pagination";
import EmptyTable from "../components/EmptyTable";
import ExportButton from "../components/ExportButton";
import HeaderTablePage from "../components/HeaderTablePage";
import InfirmationTable from "../components/InfirmationTable";

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const Clients = () => {
    const [load, setLoad] = useState(true);
    const [clients, setClients] = useState([]);
    const [numberPage, setNumberPage] = useState(0);
    const [showList, setShowList] = useState([]);
    const [numberPerPage, setNumberPerPage] = useState(10);
    const [activeNumberPage, setActiveNumberPage] = useState(0);
    const [search, setSearch] = useState(false);

    useEffect(() => {
        axios.get(appConfig.apiDomaine+"/clients")
            .then(response => {
                setLoad(false);
                setClients(response.data.data);
                setShowList(response.data.data.slice(0, numberPerPage));
                setNumberPage(forceRound(response.data.data.length / numberPerPage));

            })
            .catch(error => {
                setLoad(false);
            })
    }, []);

    const searchElement = async (e) => {
        if (e.target.value) {
            await setSearch(true);
            filterDataTableBySearchValue(e);
        } else {
            await setSearch(true);
            filterDataTableBySearchValue(e);
            setSearch(false);
        }
    };

    const onChangeNumberPerPage = (e) => {
        setActiveNumberPage(0);
        setNumberPerPage(parseInt(e.target.value));
        setShowList(clients.slice(0, parseInt(e.target.value)));
        setNumberPage(forceRound(clients.length / parseInt(e.target.value)));
    };

    const getEndByPosition = (position) => {
        let end = numberPerPage;
        for (let i = 0; i < position; i++) {
            end = end + numberPerPage;
        }
        return end;
    };

    const onClickPage = (e, page) => {
        e.preventDefault();
        setActiveNumberPage(page);
        setShowList(clients.slice(getEndByPosition(page) - numberPerPage, getEndByPosition(page)));
    };

    const onClickNextPage = (e) => {
        e.preventDefault();
        if (activeNumberPage <= numberPage) {
            setActiveNumberPage(activeNumberPage + 1);
            setShowList(
                clients.slice(
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
                clients.slice(
                    getEndByPosition(activeNumberPage - 1) - numberPerPage,
                    getEndByPosition(activeNumberPage - 1)
                )
            );
        }
    };

    const deleteClient = (clientId, index) => {
        DeleteConfirmation.fire(confirmDeleteConfig)
            .then((result) => {
                if (result.value) {
                    axios.delete(appConfig.apiDomaine + `/clients/${clientId}`)
                        .then(response => {
                            console.log(response, "OK");
                            const newClient = [...clients];
                            newClient.splice(index, 1);
                            clients(newClient);
                            if (showList.length > 1) {
                                setShowList(
                                    newClient.slice(
                                        getEndByPosition(activeNumberPage) - numberPerPage,
                                        getEndByPosition(activeNumberPage)
                                    )
                                );
                            } else {
                                setShowList(
                                    newClient.slice(
                                        getEndByPosition(activeNumberPage - 1) - numberPerPage,
                                        getEndByPosition(activeNumberPage - 1)
                                    )
                                );
                            }
                            ToastBottomEnd.fire(toastDeleteSuccessMessageConfig);
                        })
                        .catch(error => {
                            ToastBottomEnd.fire(toastDeleteErrorMessageConfig);
                        })
                    ;
                }
            })
        ;
    };

    const arrayNumberPage = () => {
        const pages = [];
        for (let i = 0; i < numberPage; i++) {
            pages[i] = i;
        }
        return pages
    };

    const pages = arrayNumberPage();

    const printBodyTable = (client, index) => {
        return (
            <tr className="d-flex justify-content-center align-content-center odd"
                key={index} role="row" className="odd">
                <td>{client.identite.lastname} &ensp; {client.identite.firstname }</td>
                {/*<td>{client.identite.sexe}</td>*/}
                <td>
                    {
                        client.identite.telephone.map((tel, index) => (
                            index === client.identite.telephone.length - 1 ? tel
                                : tel + ", "
                        ))
                    }
                </td>
                <td>
                    {
                        client.account_number.map((account, index) => (
                            index === client.account_number.length - 1 ? account : account + ", "
                        ))
                    }
                </td>
                {/*<td>{client.identite.ville}</td>*/}
                <td>
                    {
                        client.identite.email.map((mail, index) => (
                            index === client.identite.email.length - 1 ? mail : mail + ", "
                        ))
                    }
                </td>
                {/*<td>{client.institution.name}</td>*/}
                {/*<td>{client.unit.name}</td>*/}
                <td>
                    <Link to="/settings/clients/detail"
                          className="btn btn-sm btn-clean btn-icon btn-icon-md"
                          title="Détail">
                        <i className="la la-eye"/>
                    </Link>
                    <Link to={`/settings/clients/edit/${client.id}`}
                          className="btn btn-sm btn-clean btn-icon btn-icon-md"
                          title="Modifier">
                        <i className="la la-edit"/>
                    </Link>
                    <button
                        onClick={(e) => deleteClient(client.id, index)}
                        className="btn btn-sm btn-clean btn-icon btn-icon-md"
                        title="Supprimer">
                        <i className="la la-trash"/>
                    </button>
                </td>
            </tr>
        )
    };

    return (
        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            Paramètres
                        </h3>
                        <span className="kt-subheader__separator kt-hidden"/>
                        <div className="kt-subheader__breadcrumbs">
                            <a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link">
                                Client
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                <InfirmationTable
                    information={"A common UI paradigm to use with interactive tables is to present buttons that will trigger some action. See official documentation"}/>

                <div className="kt-portlet">
                    <HeaderTablePage
                        title={"Client"}
                        addText={"Ajouter un Client"}
                        addLink={"/settings/clients/add"}
                    />

                    {
                        load ? (
                            <LoadingTable/>
                        ) : (
                            <div className="kt-portlet__body">
                                <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                    <div className="row">
                                        <div className="col-sm-6 text-left">
                                            <div id="kt_table_1_filter" className="dataTables_filter">
                                                <label>
                                                    Search:
                                                    Search:
                                                    <input id="myInput" type="text" onKeyUp={(e) => searchElement(e)}
                                                           className="form-control form-control-sm" placeholder=""
                                                           aria-controls="kt_table_1"/>
                                                </label>
                                            </div>
                                        </div>
                                        <ExportButton/>
                                    </div>
                                    <div className="row table-responsive">
                                        <div className="col-sm-12 ">
                                            <table
                                                className="table table-striped table-bordered table-hover table-checkable dataTable dtr-inline table"
                                                id="myTable" role="grid" aria-describedby="kt_table_1_info"
                                                style={{width: "952px"}}>
                                                <thead>
                                                <tr role="row">
                                                    <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                        rowSpan="1"
                                                        colSpan="1" style={{width: "100.25px"}}
                                                        aria-label="Country: activate to sort column ascending">Nom
                                                    </th>

                                                    <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                        rowSpan="1"
                                                        colSpan="1" style={{width: "100px"}}
                                                        aria-label="Ship Address: activate to sort column ascending">Telephone
                                                    </th>
                                                    <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                        rowSpan="1"
                                                        colSpan="1" style={{width: "100px"}}
                                                        aria-label="Ship Address: activate to sort column ascending">Account
                                                        Number
                                                    </th>

                                                    <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                        rowSpan="1"
                                                        colSpan="1" style={{width: "100px"}}
                                                        aria-label="Ship Address: activate to sort column ascending">Email
                                                    </th>

                                                    <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                        rowSpan="1" colSpan="1"
                                                        style={{width: "70.25px"}}
                                                        aria-label="Type: activate to sort column ascending">
                                                        Action
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    clients.length ? (
                                                        search ? (
                                                            clients.map((client, index) => (
                                                                printBodyTable(client, index)
                                                            ))
                                                        ) : (
                                                            showList.map((client, index) => (
                                                                printBodyTable(client, index)
                                                            ))
                                                        )
                                                    ) : (
                                                        <EmptyTable/>
                                                    )
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-5">
                                            <div className="dataTables_info" id="kt_table_1_info" role="status"
                                                 aria-live="polite">Affichage de 1 à {numberPerPage} sur {clients.length} données
                                            </div>
                                        </div>
                                        {
                                            !search ? (
                                                <div className="col-sm-12 col-md-7 dataTables_pager">
                                                    <Pagination
                                                        numberPerPage={numberPerPage}
                                                        onChangeNumberPerPage={onChangeNumberPerPage}
                                                        activeNumberPage={activeNumberPage}
                                                        onClickPreviousPage={e => onClickPreviousPage(e)}
                                                        pages={pages}
                                                        onClickPage={(e, number) => onClickPage(e, number)}
                                                        numberPage={numberPage}
                                                        onClickNextPage={e => onClickNextPage(e)}
                                                    />
                                                </div>
                                            ) : ""
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Clients;
