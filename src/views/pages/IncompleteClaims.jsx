import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Link
} from "react-router-dom";
import {connect} from "react-redux";
import {loadCss, filterDataTableBySearchValue, forceRound} from "../../helpers/function";
import LoadingTable from "../components/LoadingTable";
import appConfig from "../../config/appConfig";
import Pagination from "../components/Pagination";
import EmptyTable from "../components/EmptyTable";
import HeaderTablePage from "../components/HeaderTablePage";
import InfirmationTable from "../components/InfirmationTable";
import {ERROR_401} from "../../config/errorPage";
import {verifyPermission} from "../../helpers/permission";
import {verifyTokenExpire} from "../../middleware/verifyToken";

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token');

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const endPointConfig = {
    PRO: {
        plan: "PRO",
        list: `${appConfig.apiDomaine}/my/claims-incompletes`,
        destroy: claimId => `${appConfig.apiDomaine}/my/claims-incompletes/${claimId}`,
    },
    MACRO: {
        holding: {
            list: `${appConfig.apiDomaine}/any/claims-incompletes`,
            destroy: claimId => `${appConfig.apiDomaine}/any/claims-incompletes/${claimId}`,
        },
        filial: {
            list: `${appConfig.apiDomaine}/my/claims-incompletes`,
            destroy: claimId => `${appConfig.apiDomaine}/my/claims-incompletes/${claimId}`,
        }
    },
    HUB: {
        plan: "HUB",
        list: `${appConfig.apiDomaine}/without-client/claims-incompletes `,
        destroy: claimId => `${appConfig.apiDomaine}/without-client/claims-incompletes/${claimId}`,
    }
};

const IncompleteClaims = (props) => {
    document.title = "Satis client - Liste plaintes incomplètes";
    if (!(verifyPermission(props.userPermissions, "list-claim-incomplete-against-any-institution") ||
        verifyPermission(props.userPermissions, "list-claim-incomplete-against-my-institution") ||
        verifyPermission(props.userPermissions, "list-claim-incomplete-without-client")))
        window.location.href = ERROR_401;

    const [load, setLoad] = useState(true);
    const [incompleteClaims, setIncompleteClaims] = useState([]);
    const [numberPage, setNumberPage] = useState(0);
    const [showList, setShowList] = useState([]);
    const [numberPerPage, setNumberPerPage] = useState(10);
    const [activeNumberPage, setActiveNumberPage] = useState(0);
    const [search, setSearch] = useState(false);

    let endPoint = "";
    if (props.plan === "MACRO") {
        if (verifyPermission(props.userPermissions, 'list-claim-incomplete-against-any-institution'))
            endPoint = endPointConfig[props.plan].holding;
        else if (verifyPermission(props.userPermissions, 'list-claim-incomplete-against-my-institution'))
            endPoint = endPointConfig[props.plan].filial
    } else
        endPoint = endPointConfig[props.plan];

    useEffect(() => {

        if (verifyTokenExpire()) {
            axios.get(endPoint.list)
                .then(response => {
                    console.log(response.data, 'Incomplete_Data');
                    setLoad(false);
                    setIncompleteClaims(response.data);
                    setShowList(response.data.slice(0, numberPerPage));
                    setNumberPage(forceRound(response.data.length / numberPerPage));
                })
                .catch(error => {
                    setLoad(false);
                    console.log("Something is wrong");
                })
            ;
        }
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
        setShowList(incompleteClaims.slice(0, parseInt(e.target.value)));
        setNumberPage(forceRound(incompleteClaims.length / parseInt(e.target.value)));
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
        setShowList(incompleteClaims.slice(getEndByPosition(page) - numberPerPage, getEndByPosition(page)));
    };

    const onClickNextPage = (e) => {
        e.preventDefault();
        if (activeNumberPage <= numberPage) {
            setActiveNumberPage(activeNumberPage + 1);
            setShowList(
                incompleteClaims.slice(
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
                incompleteClaims.slice(
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

    const printBodyTable = (claim, index) => {
        return (
            <tr key={index} role="row" className="odd">
                <td>{claim.claimer.lastname}&ensp;{claim.claimer.firstname}</td>
                <td>{claim.institution_targeted.name}</td>
                <td>{claim.claim_object.name.fr}</td>
                <td>{claim.description}</td>
                <td style={{textAlign: 'center'}}>
                    {/*<Link to="/settings/clients/claim/detail"
                          className="btn btn-sm btn-clean btn-icon btn-icon-md"
                          title="Détail">
                        <i className="la la-eye"/>
                    </Link>*/}

                    {
                        verifyPermission(props.userPermissions, 'show-claim-incomplete-against-any-institution') ||
                        verifyPermission(props.userPermissions, 'show-claim-incomplete-against-my-institution') ||
                        verifyPermission(props.userPermissions, "show-claim-incomplete-without-client")?
                            <Link
                                to={`/process/incomplete_claims/edit/${claim.id}`}
                                className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                title="Modifier">
                                <i className="la la-edit"/>
                            </Link>
                            : null
                    }

                </td>
            </tr>
        )
    };

    return (
        (
            verifyPermission(props.userPermissions, "list-claim-incomplete-against-any-institution") ||
            verifyPermission(props.userPermissions, "list-claim-incomplete-against-my-institution") ||
            verifyPermission(props.userPermissions, "list-claim-incomplete-without-client")
        ) ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader  kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Collecte
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <span className="kt-subheader__separator kt-hidden"/>
                                <div className="kt-subheader__breadcrumbs">
                                    <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                        className="flaticon2-shelter"/></a>
                                    <span className="kt-subheader__breadcrumbs-separator"/>
                                    <a href="#button" onClick={e => e.preventDefault()}
                                       className="kt-subheader__breadcrumbs-link" style={{cursor: "default"}}>
                                        Réclamations Incomplètes
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid kt-grid__item kt-grid__item--fluid">
                    <InfirmationTable
                        information={"Liste des réclamations imcomplètes"}/>

                    <div className="kt-portlet">

                        <HeaderTablePage
                            addPermission={""}
                            title={"Réclamations Imcomplètes"}
                            addText={"Ajouter de réclamations"}
                            addLink={"/settings/claims/add"}
                        />
                        {
                            load ? (
                                <LoadingTable/>
                            ) : (
                                <div className="kt-portlet__body">
                                    <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                        <div className="row">
                                            <div className="text-left col-sm-6">
                                                <div id="kt_table_1_filter" className="dataTables_filter">
                                                    <label>
                                                        Rechercher:
                                                        <input id="myInput" type="text"
                                                               onKeyUp={(e) => searchElement(e)}
                                                               className="form-control form-control-sm"
                                                               placeholder=""
                                                               aria-controls="kt_table_1"/>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <table
                                                    className="table table-striped table-bordered table-hover table-checkable dataTable dtr-inline"
                                                    id="myTable" role="grid" aria-describedby="kt_table_1_info"
                                                    style={{width: "952px"}}>
                                                    <thead>
                                                    <tr role="row">

                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            rowSpan="1"
                                                            colSpan="1" style={{width: "85px"}}
                                                            aria-label="Ship City: activate to sort column ascending">Réclamant
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            rowSpan="1"
                                                            colSpan="1" style={{width: "85px"}}
                                                            aria-label="Ship City: activate to sort column ascending">Institution
                                                            concernée
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            rowSpan="1"
                                                            colSpan="1" style={{width: "85px"}}
                                                            aria-label="Ship City: activate to sort column ascending">
                                                            Objet de réclamation
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            rowSpan="1"
                                                            colSpan="1" style={{width: "100px"}}
                                                            aria-label="Ship City: activate to sort column ascending">Description
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            rowSpan="1" colSpan="1" style={{width: "70.25px"}}
                                                            aria-label="Type: activate to sort column ascending">
                                                            Action
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        incompleteClaims.length ? (
                                                            search ? (
                                                                incompleteClaims.map((claim, index) => (
                                                                    printBodyTable(claim, index)
                                                                ))
                                                            ) : (
                                                                showList.map((claim, index) => (
                                                                    printBodyTable(claim, index)
                                                                ))
                                                            )
                                                        ) : (
                                                            <EmptyTable/>
                                                        )
                                                    }
                                                    </tbody>
                                                    <tfoot>
                                                    <tr>

                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-5">
                                                <div className="dataTables_info" id="kt_table_1_info" role="status"
                                                     aria-live="polite">Affichage de 1
                                                    à {numberPerPage} sur {incompleteClaims.length} données
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
const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan,
    };
};

export default connect(mapStateToProps)(IncompleteClaims);
