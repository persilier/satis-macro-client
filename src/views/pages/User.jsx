import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {forceRound, getLowerCaseString, loadCss} from "../../helpers/function";
import LoadingTable from "../components/LoadingTable";
import appConfig from "../../config/appConfig";
import Pagination from "../components/Pagination";
import EmptyTable from "../components/EmptyTable";
import HeaderTablePage from "../components/HeaderTablePage";
import {ERROR_401} from "../../config/errorPage";
import {verifyPermission} from "../../helpers/permission";
import {AUTH_TOKEN} from "../../constants/token";
import {NUMBER_ELEMENT_PER_PAGE} from "../../constants/dataTable";
import {DeleteConfirmation} from "../components/ConfirmationAlert";
import {confirmActivation} from "../../config/confirmConfig";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastErrorMessageWithParameterConfig, toastSuccessMessageWithParameterConfig
} from "../../config/toastConfig";
import {Link} from "react-router-dom";

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

const User = (props) => {
    if (!(verifyPermission(props.userPermissions, "list-user-any-institution") || (verifyPermission(props.userPermissions, "list-user-my-institution"))))
        window.location.href = ERROR_401;

    const [load, setLoad] = useState(true);
    const [users, setUser] = useState([]);
    const [numberPerPage, setNumberPerPage] = useState(NUMBER_ELEMENT_PER_PAGE);
    const [activeNumberPage, setActiveNumberPage] = useState(0);
    const [numberPage, setNumberPage] = useState(0);
    const [showList, setShowList] = useState([]);

    useEffect(() => {
        let endpoint = "";
        if (props.plan === "MACRO") {
            if (verifyPermission(props.userPermissions, "list-user-any-institution"))
                endpoint = `${appConfig.apiDomaine}/any/users`;
            if (verifyPermission(props.userPermissions, "list-user-my-institution"))
                endpoint = `${appConfig.apiDomaine}/my/users`;
        }
        else if(props.plan === "HUB")
            endpoint = `${appConfig.apiDomaine}/any/users`;
        else if(props.plan === "PRO")
            endpoint = `${appConfig.apiDomaine}/my/users`;

        async function fetchData () {
            await axios.get(endpoint)
                .then(response => {
                    setNumberPage(forceRound(response.data.length/NUMBER_ELEMENT_PER_PAGE));
                    setShowList(response.data.slice(0, NUMBER_ELEMENT_PER_PAGE));
                    setUser(response.data);
                    setLoad(false);
                })
                .catch(error => {
                    setLoad(false);
                    console.log("Something is wrong");
                })
            ;
        }
        fetchData();
    }, [appConfig.apiDomaine, props.plan, NUMBER_ELEMENT_PER_PAGE]);

    const filterShowListBySearchValue = (value) => {
        value = getLowerCaseString(value);
        let newUsers = [...users];
        newUsers = newUsers.filter(el => (
            getLowerCaseString(`${el.identite.lastname} ${el.identite.firstname}`).indexOf(value) >= 0 ||
            getLowerCaseString(el.username).indexOf(value) >= 0 ||
            getLowerCaseString(printRole(el.roles)).indexOf(value) >= 0 ||
            getLowerCaseString(el.disabled_at === null ? "Active" : "Désactiver").indexOf(value) >= 0
        ));

        return newUsers;
    };

    const searchElement = async (e) => {
        if (e.target.value) {
            setNumberPage(forceRound(filterShowListBySearchValue(e.target.value).length/NUMBER_ELEMENT_PER_PAGE));
            setShowList(filterShowListBySearchValue(e.target.value.toLowerCase()).slice(0, NUMBER_ELEMENT_PER_PAGE));
        } else {
            setNumberPage(forceRound(users.length/NUMBER_ELEMENT_PER_PAGE));
            setShowList(users.slice(0, NUMBER_ELEMENT_PER_PAGE));
            setActiveNumberPage(0);
        }
    };

    const onChangeNumberPerPage = (e) => {
        setActiveNumberPage(0);
        setNumberPerPage(parseInt(e.target.value));
        setShowList(users.slice(0, parseInt(e.target.value)));
        setNumberPage(forceRound(users.length/parseInt(e.target.value)));
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
        setShowList(users.slice(getEndByPosition(page) - numberPerPage, getEndByPosition(page)));
    };

    const onClickNextPage = (e) => {
        e.preventDefault();
        if (activeNumberPage <= numberPage) {
            setActiveNumberPage(activeNumberPage + 1);
            setShowList(
                users.slice(
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
                users.slice(
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

    const printRole = (roles) => {
        const newRoles = [];
        roles.map(r => newRoles.push(r.name));
        return newRoles.join(' / ');
    };

    const activeAccount = (e, user, index, label) => {
        e.preventDefault();
        DeleteConfirmation.fire(confirmActivation(label))
            .then(async (result) => {
                if (result.value) {
                    document.getElementById(`user-spinner-${user.id}`).style.display = "block";
                    document.getElementById(`user-${user.id}`).style.display = "none";
                    document.getElementById(`user-edit-${user.id}`).style.display = "none";

                    let endpoint = "";
                    if (props.plan === "MACRO") {
                        if (verifyPermission(props.userPermissions, "list-user-any-institution"))
                            endpoint = `${appConfig.apiDomaine}/any/users/${user.id}/enabled-desabled`;
                        if (verifyPermission(props.userPermissions, "list-user-my-institution"))
                            endpoint = `${appConfig.apiDomaine}/my/users/${user.id}/enabled-desabled`;
                    }
                    else if(props.plan === "HUB")
                        endpoint = `${appConfig.apiDomaine}/any/users/${user.id}/enabled-desabled`;
                    else if(props.plan === "PRO")
                        endpoint = `${appConfig.apiDomaine}/my/users/${user.id}/enabled-desabled`;

                    await axios.put(endpoint)
                        .then(response => {
                            const newUsers = [...users];
                            newUsers[index].disabled_at = newUsers[index].disabled_at === null ? true : null;
                            document.getElementById(`user-spinner-${user.id}`).style.display = "none";
                            document.getElementById(`user-${user.id}`).style.display = "block";
                            document.getElementById(`user-edit-${user.id}`).style.display = "block";
                            setUser(newUsers);
                            ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig("Succes de l'opération"));
                        })
                        .catch(error => {
                            ToastBottomEnd.fire(toastErrorMessageWithParameterConfig("Echec de l'opération"));
                        })
                    ;
                }
            })
        ;
    };

    const printBodyTable = (user, index) => {
        return (
            <tr key={index} role="row" className="odd">
                <td>{user.identite.lastname} {user.identite.firstname}</td>
                <td>{user.username}</td>
                <td>{printRole(user.roles)}</td>
                <td>
                    {
                        user.disabled_at === null ? (
                            <span className="kt-badge kt-badge--success kt-badge--inline">Active</span>
                        ) : (
                            <span className="kt-badge kt-badge--danger kt-badge--inline">Désactiver</span>
                        )
                    }
                </td>
                <td className="d-flex justify-content-between align-items-center">
                    <div id={`user-spinner-${user.id}`} className="kt-spinner kt-spinner--lg kt-spinner--dark mt-2 mx-3" style={{display: "none"}}/>
                    <a
                        className="mt-2"
                        id={`user-${user.id}`}
                        href={user.disabled_at === null ? `desactive/${user.id}` : `reactive/${user.id}`}
                        onClick={(e) => activeAccount(e, user, index, user.disabled_at === null ? "désactiver" : "réactiver")}
                        title={user.disabled_at === null ? "Désactiver" : "Réactiver"}>
                        {user.disabled_at === null ? "Désactiver" : "Réactiver"}
                    </a>

                    <Link to={`/settings/users/${user.id}/change-role`}
                          id={`user-edit-${user.id}`}
                          className="btn btn-sm btn-clean btn-icon btn-icon-md mx-3"
                          title="Changer Role">
                        <i className="la la-edit"/>
                    </Link>
                </td>
            </tr>
        );
    };

    return (
        verifyPermission(props.userPermissions, 'list-user-any-institution') || verifyPermission(props.userPermissions, 'list-user-my-institution') ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Paramètres
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link" style={{cursor: "text"}}>
                                    Utilisateur
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <div className="kt-portlet">
                        <HeaderTablePage
                            addPermission={["store-user-any-institution", "store-user-my-institution"]}
                            title={"Utilisateur"}
                            addText={"Ajouter"}
                            addLink={"/settings/users/add"}
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
                                                        Recherche:
                                                        <input id="myInput" type="text" onKeyUp={(e) => searchElement(e)} className="form-control form-control-sm" placeholder="" aria-controls="kt_table_1"/>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <table
                                                    className="table table-striped table-bordered table-hover table-checkable dataTable dtr-inline"
                                                    id="myTable" role="grid" aria-describedby="kt_table_1_info"
                                                    style={{ width: "952px" }}>
                                                    <thead>
                                                    <tr role="row">
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">Nom
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">Email
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">Role
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">Statut
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1" colSpan="1" style={{ width: "70.25px" }} aria-label="Type: activate to sort column ascending">
                                                            Action
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        users.length ? (
                                                            showList.length ? (
                                                                showList.map((user, index) => (
                                                                    printBodyTable(user, index)
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
                                                    <tr>
                                                        <th rowSpan="1" colSpan="1">Nom</th>
                                                        <th rowSpan="1" colSpan="1">Email</th>
                                                        <th rowSpan="1" colSpan="1">role</th>
                                                        <th rowSpan="1" colSpan="1">Statut</th>
                                                        <th rowSpan="1" colSpan="1">Action</th>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-5">
                                                <div className="dataTables_info" id="kt_table_1_info" role="status"
                                                     aria-live="polite">Affichage de 1 à {numberPerPage} sur {users.length} données
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
        ) : null

    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan,
    };
};

export default connect(mapStateToProps)(User);
