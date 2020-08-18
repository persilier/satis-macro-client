import React, {useEffect, useState} from "react";
import axios from "axios";
import {connect} from "react-redux";
import {
    Link
} from "react-router-dom";
import {filterDataTableBySearchValue, forceRound, loadCss, loadScript} from "../../helpers/function";
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
import {ERROR_401} from "../../config/errorPage";
import {verifyPermission} from "../../helpers/permission";

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token');

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const Institution = (props) => {
    document.title = "Satis client - Paramètre Institution";

    if (!verifyPermission(props.userPermissions, "list-any-institution")) {
        window.location.href = ERROR_401;
    }
    const [load, setLoad] = useState(true);
    const [institutions, setInstitution] = useState([]);
    const [numberPage, setNumberPage] = useState(0);
    const [showList, setShowList] = useState([]);
    const [numberPerPage, setNumberPerPage] = useState(10);
    const [activeNumberPage, setActiveNumberPage] = useState(0);
    const [search, setSearch] = useState(false);

    useEffect(() => {
        axios.get(appConfig.apiDomaine + "/any/institutions")
            .then(response => {
                console.log(response.data)
                setLoad(false);
                setInstitution(response.data);
                setShowList(response.data.slice(0, numberPerPage));
                setNumberPage(forceRound(response.data.length / numberPerPage));
            })
            .catch(error => {
                setLoad(false);
                console.log("Something is wrong");
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
        setShowList(institutions.slice(0, parseInt(e.target.value)));
        setNumberPage(forceRound(institutions.length / parseInt(e.target.value)));
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
        setShowList(institutions.slice(getEndByPosition(page) - numberPerPage, getEndByPosition(page)));
    };

    const onClickNextPage = (e) => {
        e.preventDefault();
        if (activeNumberPage <= numberPage) {
            setActiveNumberPage(activeNumberPage + 1);
            setShowList(
                institutions.slice(
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
                institutions.slice(
                    getEndByPosition(activeNumberPage - 1) - numberPerPage,
                    getEndByPosition(activeNumberPage - 1)
                )
            );
        }
    };

    const deleteInstitution = (institutionId, index) => {
        DeleteConfirmation.fire(confirmDeleteConfig)
            .then((result) => {
                if (result.value) {
                    axios.delete(appConfig.apiDomaine + `/any/institutions/${institutionId}`)
                        .then(response => {
                            const newInstitution = [...institutions];
                            newInstitution.splice(index, 1);
                            setInstitution(newInstitution);
                            if (showList.length > 1) {
                                setShowList(
                                    newInstitution.slice(
                                        getEndByPosition(activeNumberPage) - numberPerPage,
                                        getEndByPosition(activeNumberPage)
                                    )
                                );
                            } else {
                                setShowList(
                                    newInstitution.slice(
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

    const printBodyTable = (institution, index) => {
        return (
            <tr key={index} role="row" className="odd">
                <td style={{textAlign: 'center'}}>
                    {institution.logo?(
                        <img id="Image1" src={institution.logo} alt="logo" style={{maxWidth: "35px", maxHeight: "35px", textAlign: 'center'}}/>)
                        :""}
                </td>
                <td>{institution.institution_type?institution.institution_type.name:""}</td>
                <td>{institution.name}</td>
                <td>{institution.acronyme}</td>
                <td>{institution.iso_code}</td>
                <td style={{textAlign:"center"}}>
                    {
                        verifyPermission(props.userPermissions, "update-institution-message-api") ? (
                            <Link to={`/settings/institutions/${institution.id}/message-apis`}
                                  className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                  title="Parametrer message API">
                                <i className="la la-eye"/>
                            </Link>
                        ) : null
                    }

                    {
                        verifyPermission(props.userPermissions, "show-any-institution") ?
                            <Link to={`/settings/institution/edit/${institution.id}`}
                                  className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                  title="Modifier">
                                <i className="la la-edit"/>
                            </Link>
                            : verifyPermission(props.userPermissions, "update-my-institution") ?
                            <Link to={`/settings/institution/edit`}
                                  className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                  title="Modifier">
                                <i className="la la-edit"/>
                            </Link>
                            : ""
                    }

                    {/*{*/}
                    {/*    verifyPermission(props.userPermissions, "destroy-any-institution") ?*/}
                    {/*        <button*/}
                    {/*            onClick={(e) => deleteInstitution(institution.id, index)}*/}
                    {/*            className="btn btn-sm btn-clean btn-icon btn-icon-md"*/}
                    {/*            title="Supprimer">*/}
                    {/*            <i className="la la-trash"/>*/}
                    {/*        </button>*/}
                    {/*        : ""*/}
                    {/*}*/}

                </td>
            </tr>
        )
    };

    return (
        verifyPermission(props.userPermissions, "list-category-client") ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Paramètres
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()}
                                   className="kt-subheader__breadcrumbs-link">
                                    Institution
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <InfirmationTable
                        information={"Liste des institutions"}/>

                    <div className="kt-portlet">
                        <HeaderTablePage
                            addPermission={"store-any-institution"}
                            title={"Institution"}
                            addText={"Ajouter une Institution"}
                            addLink={"/settings/institution/add"}
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
                                                            colSpan="1" style={{width: "40px"}}
                                                            aria-label="Country: activate to sort column ascending">Logo
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            rowSpan="1"
                                                            colSpan="1" style={{width: "50px"}}
                                                            aria-label="Country: activate to sort column ascending">Type
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            rowSpan="1"
                                                            colSpan="1" style={{width: "100px"}}
                                                            aria-label="Country: activate to sort column ascending">Nom
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            rowSpan="1"
                                                            colSpan="1" style={{width: "100px"}}
                                                            aria-label="Ship City: activate to sort column ascending">Acronyme
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            rowSpan="1"
                                                            colSpan="1" style={{width: "80px"}}
                                                            aria-label="Ship Address: activate to sort column ascending">Iso_Code
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
                                                        institutions.length ? (
                                                            search ? (
                                                                institutions.map((institution, index) => (
                                                                printBodyTable(institution, index)
                                                                ))
                                                            ) : (
                                                                showList.map((institution, index) => (
                                                                    printBodyTable(institution, index)
                                                                ))
                                                            )
                                                        ) : (
                                                            <EmptyTable/>
                                                        )
                                                    }
                                                    </tbody>
                                                    <tfoot>
                                                    <tr style={{textAlign:"center"}}>
                                                        <th rowSpan="1" colSpan="1">Logo</th>
                                                        <th rowSpan="1" colSpan="1">Type</th>
                                                        <th rowSpan="1" colSpan="1">Nom</th>
                                                        <th rowSpan="1" colSpan="1">Acronyme</th>
                                                        <th rowSpan="1" colSpan="1">Iso_Code</th>
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
                                                    à {numberPerPage} sur {institutions.length} données
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
        ) : ""
    );
};
const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(Institution);
