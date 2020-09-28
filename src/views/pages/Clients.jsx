import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Link
} from "react-router-dom";
import {connect} from "react-redux";
import {loadCss, forceRound, getLowerCaseString} from "../../helpers/function";
import LoadingTable from "../components/LoadingTable";
import {ToastBottomEnd} from "../components/Toast";
import {toastDeleteErrorMessageConfig, toastDeleteSuccessMessageConfig} from "../../config/toastConfig";
import {DeleteConfirmation} from "../components/ConfirmationAlert";
import {confirmDeleteConfig} from "../../config/confirmConfig";
import appConfig from "../../config/appConfig";
import Pagination from "../components/Pagination";
import EmptyTable from "../components/EmptyTable";
import HeaderTablePage from "../components/HeaderTablePage";
import InfirmationTable from "../components/InfirmationTable";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import {NUMBER_ELEMENT_PER_PAGE} from "../../constants/dataTable";

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");
axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token');

const endPointConfig = {
    PRO: {
        plan: "PRO",
        list: `${appConfig.apiDomaine}/my/clients`,
        destroy: clientId => `${appConfig.apiDomaine}/my/clients/${clientId}`,
    },
    MACRO: {
        holding: {
            list: `${appConfig.apiDomaine}/any/clients`,
            destroy: clientId => `${appConfig.apiDomaine}/any/clients/${clientId}`,
        },
        filial: {
            list: `${appConfig.apiDomaine}/my/clients`,
            destroy: clientId => `${appConfig.apiDomaine}/my/clients/${clientId}`,
        }
    },

};

const Clients = (props) => {
    document.title = "Satis client - Paramètre Client";
    if (!(verifyPermission(props.userPermissions, "list-client-from-my-institution") || verifyPermission(props.userPermissions, "list-client-from-any-institution"))) {
        window.location.href = ERROR_401;
    }
    let endPoint = "";
    if (props.plan === "MACRO") {
        if (verifyPermission(props.userPermissions, 'list-client-from-any-institution') || verifyPermission(props.userPermissions, 'store-client-from-any-institution'))
            endPoint = endPointConfig[props.plan].holding;
        else if (verifyPermission(props.userPermissions, 'list-client-from-my-institution') || verifyPermission(props.userPermissions, 'store-client-from-my-institution'))
            endPoint = endPointConfig[props.plan].filial
    } else {
        endPoint = endPointConfig[props.plan]
    }

    const [load, setLoad] = useState(true);
    const [clients, setClients] = useState([]);
    const [numberPage, setNumberPage] = useState(0);
    const [showList, setShowList] = useState([]);
    const [numberPerPage, setNumberPerPage] = useState(10);
    const [activeNumberPage, setActiveNumberPage] = useState(0);

    useEffect(() => {
        axios.get(endPoint.list)
            .then(response => {
                console.log(response, "OK");
                setLoad(false);
                setClients(response.data);
                setShowList(response.data.slice(0, numberPerPage));
                setNumberPage(forceRound(response.data.length / numberPerPage));
            })
            .catch(error => {
                setLoad(false);
            })
    }, []);

    const matchByAttribute = (accountNumbers, value, attribute) => {
        var match = false;
        accountNumbers.map(el => {
            match = (
                match ||
                getLowerCaseString(attribute === "number" ? el[attribute] : el).indexOf(value) >= 0
            )
        });
        return match;
    };



    const filterShowListBySearchValue = (value) => {
        value = getLowerCaseString(value);
        let newClients = [...clients];
        newClients = newClients.filter(el => (
            getLowerCaseString(el.client.identite.lastname+" "+el.client.identite.firstname).indexOf(value) >= 0 ||
            matchByAttribute(el.accounts, value, "number") ||
            matchByAttribute(el.client.identite.telephone, value, "telephone") ||
            matchByAttribute(el.client.identite.email, value, "email")
        ));

        return newClients;
    };

    const searchElement = async (e) => {
        if (e.target.value) {
            setNumberPage(forceRound(filterShowListBySearchValue(e.target.value).length/NUMBER_ELEMENT_PER_PAGE));
            setShowList(filterShowListBySearchValue(e.target.value.toLowerCase()).slice(0, NUMBER_ELEMENT_PER_PAGE));
        } else {
            setNumberPage(forceRound(clients.length/NUMBER_ELEMENT_PER_PAGE));
            setShowList(clients.slice(0, NUMBER_ELEMENT_PER_PAGE));
            setActiveNumberPage(0);
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
                    axios.delete(endPoint.destroy(clientId))
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
            client.accounts ?
                client.accounts.map((account, i) => (
                    <tr key={i} role="row" className="odd">

                        {
                            i === 0 ?
                                <td rowSpan={client.accounts.length}>{client.client.identite.lastname} &ensp; {client.client.identite.firstname}</td> : null
                        }
                        <td>
                            {account.number}
                        </td>
                        <td>
                            {client.client.identite.telephone.length ?
                                client.client.identite.telephone.map((tel, index) => (
                                    index === client.client.identite.telephone.length - 1 ? tel : tel +" "+ "/ "+" "
                                )) : null
                            }
                        </td>

                        <td>
                            {client.client.identite.email ?
                                client.client.identite.email.map((mail, index) => (
                                    index === client.client.identite.email.length - 1 ? mail : mail  +" "+ "/ "+" "
                                )) : null
                            }
                        </td>

                        <td className="d-flex justify-content-center">
                            {/*<Link to="/settings/clients/detail"*/}
                            {/*      className="btn btn-sm btn-clean btn-icon btn-icon-md"*/}
                            {/*      title="Détail">*/}
                            {/*    <i className="la la-eye"/>*/}
                            {/*</Link>*/}
                            {
                                verifyPermission(props.userPermissions, "update-client-from-my-institution")?
                                    <Link to={`/settings/clients/edit/${client.accounts[0].id}`}
                                          className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                          title="Modifier">
                                        <i className="la la-edit"/>
                                    </Link>
                                    :  verifyPermission(props.userPermissions, "update-client-from-any-institution")?
                                    <Link to={`/settings/any/clients/edit/${client.accounts[0].id}`}
                                          className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                          title="Modifier">
                                        <i className="la la-edit"/>
                                    </Link>
                                    : null
                            }
                            {/*{*/}
                            {/*    verifyPermission(props.userPermissions, "destroy-client-from-my-institution") ||*/}
                            {/*    verifyPermission(props.userPermissions, "destroy-client-from-any-institution") ?*/}
                            {/*        <button*/}
                            {/*            onClick={(e) => deleteClient(client.id, index)}*/}
                            {/*            className="btn btn-sm btn-clean btn-icon btn-icon-md"*/}
                            {/*            title="Supprimer">*/}
                            {/*            <i className="la la-trash"/>*/}
                            {/*        </button>*/}
                            {/*        : null*/}
                            {/*}*/}
                            {
                                verifyPermission(props.userPermissions, "destroy-client-from-my-institution") ||
                                verifyPermission(props.userPermissions, "destroy-client-from-any-institution") ?
                                    <button
                                        onClick={(e) => deleteClient(client.id, index)}
                                        className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                        title="Supprimer">
                                        <i className="la la-trash"/>
                                    </button>
                                    : null
                            }
                        </td>
                    </tr>
                )) : null
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
                            <a href="#" className="kt-subheader__breadcrumbs-home"><i
                                className="flaticon2-shelter"/></a>
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
                    information={"Liste des clients"}/>

                <div className="kt-portlet">
                    {
                        verifyPermission(props.userPermissions, "store-client-from-my-institution") ?
                            (
                                <HeaderTablePage
                                    addPermission={"store-client-from-my-institution"}
                                    title={"Client"}
                                    addText={"Ajouter"}
                                    addLink={"/settings/clients/add"}
                                />
                            ) : (
                                verifyPermission(props.userPermissions, "store-client-from-any-institution") ?
                                    <HeaderTablePage
                                        addPermission={"store-client-from-any-institution"}
                                        title={"Client"}
                                        addText={"Ajouter"}
                                        addLink={"/settings/any/clients/add"}
                                    /> : null
                            )
                    }


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
                                                    Recherche:
                                                    <input id="myInput" type="text" onKeyUp={(e) => searchElement(e)}
                                                           className="form-control form-control-sm" placeholder=""
                                                           aria-controls="kt_table_1"/>
                                                </label>
                                            </div>
                                        </div>
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
                                                        colSpan="1" style={{width: "80.25px"}}
                                                        aria-label="Country: activate to sort column ascending">Nom
                                                    </th>

                                                    <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                        style={{width: "100px"}}
                                                        aria-label="Ship Address: activate to sort column ascending">Numero de Compte
                                                    </th>
                                                    <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                        style={{width: "100px"}}
                                                        aria-label="Ship Address: activate to sort column ascending">Téléphone
                                                    </th>

                                                    <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                        style={{width: "100px"}}
                                                        aria-label="Ship Address: activate to sort column ascending">Email(s)
                                                    </th>

                                                    <th className="sorting" tabIndex="0" aria-controls="kt_table_1"
                                                        style={{width: "70.25px"}}
                                                        aria-label="Type: activate to sort column ascending">
                                                        Action
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>

                                                {
                                                    clients.length ? (
                                                        showList.length ? (
                                                            showList.map((client, index) => (
                                                                printBodyTable(client, index)
                                                            ))
                                                        ) : (
                                                            <EmptyTable search={true}/>
                                                        )
                                                    ) : (
                                                        <EmptyTable/>
                                                    )
                                                }
                                                </tbody>
                                                <tfoot>
                                                <tr style={{textAlign:"center"}}>
                                                    <th rowSpan="1" colSpan="1">Nom</th>
                                                    <th rowSpan="1" colSpan="1">Numero de Compte</th>
                                                    <th rowSpan="1" colSpan="1">Téléphone</th>
                                                    <th rowSpan="1" colSpan="1">Emails</th>
                                                    <th rowSpan="1" colSpan="1">Action</th>
                                                </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-5">
                                            <div className="dataTables_info" id="kt_table_1_info" role="status"
                                                 aria-live="polite">Affichage de 1
                                                à {numberPerPage} sur {clients.length} données
                                            </div>
                                        </div>
                                        {
                                            showList.length ? (
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
                                            ) : null
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
const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan,
    };
};

export default connect(mapStateToProps)(Clients);
