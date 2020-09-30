import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {
    Link
} from "react-router-dom";
import {forceRound, loadCss} from "../../helpers/function";
import LoadingTable from "../components/LoadingTable";
import {ToastBottomEnd} from "../components/Toast";
import {toastDeleteErrorMessageConfig, toastDeleteSuccessMessageConfig} from "../../config/toastConfig";
import {DeleteConfirmation} from "../components/ConfirmationAlert";
import {confirmDeleteConfig} from "../../config/confirmConfig";
import appConfig from "../../config/appConfig";
import Pagination from "../components/Pagination";
import EmptyTable from "../components/EmptyTable";
import HeaderTablePage from "../components/HeaderTablePage";
import {ERROR_401} from "../../config/errorPage";
import {verifyPermission} from "../../helpers/permission";
import {NUMBER_ELEMENT_PER_PAGE} from "../../constants/dataTable";
import ExportButton from "../components/ExportButton";

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const ClaimObject = (props) => {
    if (!verifyPermission(props.userPermissions, 'list-claim-object'))
        window.location.href = ERROR_401;

    const [load, setLoad] = useState(true);
    const [claimObjects, setClaimObjects] = useState([]);
    const [numberPerPage, setNumberPerPage] = useState(NUMBER_ELEMENT_PER_PAGE);
    const [activeNumberPage, setActiveNumberPage] = useState(0);
    const [numberPage, setNumberPage] = useState(0);
    const [showList, setShowList] = useState([]);

    useEffect(() => {
        async function fetchData () {
            await axios.get(`${appConfig.apiDomaine}/claim-objects`)
                .then(response => {
                    setNumberPage(forceRound(response.data.length/NUMBER_ELEMENT_PER_PAGE));
                    setShowList(response.data.slice(0, NUMBER_ELEMENT_PER_PAGE));
                    setClaimObjects(response.data);
                    setLoad(false);
                })
                .catch(error => {
                    setLoad(false);
                    console.log("Something is wrong");
                })
            ;
        }
        fetchData();
    }, [appConfig.apiDomaine, NUMBER_ELEMENT_PER_PAGE]);

    const filterShowListBySearchValue = (value) => {
        let newClaimObjects = [...claimObjects];
        newClaimObjects = newClaimObjects.filter(el => {
            if (el.description["fr"]) {
                return (el.name["fr"].toLowerCase().indexOf(value) >= 0 || el.description["fr"].toLowerCase().indexOf(value) >= 0 || el.claim_category.name["fr"].toLowerCase().indexOf(value) >= 0 || el.time_limit.toString().indexOf(value.toString()) >= 0);
            } else {
                return (el.name["fr"].toLowerCase().indexOf(value) >= 0 || el.claim_category.name["fr"].toLowerCase().indexOf(value) >= 0 || el.time_limit.toString().indexOf(value.toString()) >= 0);
            }
        });

        return newClaimObjects;
    };

    const searchElement = async (e) => {
        if (e.target.value) {
            setNumberPage(forceRound(filterShowListBySearchValue(e.target.value).length/NUMBER_ELEMENT_PER_PAGE));
            setShowList(filterShowListBySearchValue(e.target.value.toLowerCase()).slice(0, NUMBER_ELEMENT_PER_PAGE));
        } else {
            setNumberPage(forceRound(claimObjects.length/NUMBER_ELEMENT_PER_PAGE));
            setShowList(claimObjects.slice(0, NUMBER_ELEMENT_PER_PAGE));
            setActiveNumberPage(0);
        }
    };

    const onChangeNumberPerPage = (e) => {
        setActiveNumberPage(0);
        setNumberPerPage(parseInt(e.target.value));
        setShowList(claimObjects.slice(0, parseInt(e.target.value)));
        setNumberPage(forceRound(claimObjects.length/parseInt(e.target.value)));
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
        setShowList(claimObjects.slice(getEndByPosition(page) - numberPerPage, getEndByPosition(page)));
    };

    const onClickNextPage = (e) => {
        e.preventDefault();
        if (activeNumberPage <= numberPage) {
            setActiveNumberPage(activeNumberPage + 1);
            setShowList(
                claimObjects.slice(
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
                claimObjects.slice(
                    getEndByPosition(activeNumberPage - 1) - numberPerPage,
                    getEndByPosition(activeNumberPage - 1)
                )
            );
        }
    };

    const deleteClaimObject = (claimObjectId, index) => {
        DeleteConfirmation.fire(confirmDeleteConfig)
            .then((result) => {
                if (result.value) {
                    axios.delete(`${appConfig.apiDomaine}/claim-objects/${claimObjectId}`)
                        .then(response => {
                            const newClaimObjects = [...claimObjects];
                            newClaimObjects.splice(index, 1);
                            setClaimObjects(newClaimObjects);
                            if (showList.length > 1) {
                                setShowList(
                                    newClaimObjects.slice(
                                        getEndByPosition(activeNumberPage) - numberPerPage,
                                        getEndByPosition(activeNumberPage)
                                    )
                                );
                            } else {
                                setShowList(
                                    newClaimObjects.slice(
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

    const printBodyTable = (claimObject, index) => {
        return (
            <tr key={index} role="row" className="odd">
                <td>{claimObject.name["fr"]}</td>
                <td style={{ textOverflow: "ellipsis", width: "200px" }}>{claimObject ? claimObject.description["fr"] : null}</td>
                <td style={{ textOverflow: "ellipsis", width: "70px" }}>{claimObject.claim_category.name[props.language]}</td>
                <td style={{ textOverflow: "ellipsis", width: "50px" }}>{claimObject.severity_level ? claimObject.time_limit : null}</td>
                <td>
                    {
                        claimObject.severity_level ? (
                            <div className="p-2 text-center" style={{backgroundColor: claimObject.severity_level.color, color: claimObject.severity_level.color === "#ffffff" ? "black" : "white"}}>
                                {
                                    claimObject.severity_level.color ? (
                                            `${claimObject.severity_level.color} ${claimObject.severity_level.color === "#ffffff" ? " Blanc" : ''}`
                                        )
                                        : (
                                            <strong style={{color: "black"}}>-</strong>
                                        )
                                }
                            </div>
                        ) : null
                    }
                </td>
                <td>
                    {
                        verifyPermission(props.userPermissions, 'update-claim-category') ? (
                            <Link to={`/settings/claim_objects/${claimObject.id}/edit`}
                                  className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                  title="Modifier">
                                <i className="la la-edit"/>
                            </Link>
                        ) : null
                    }
                    {
                        verifyPermission(props.userPermissions, 'destroy-claim-category') ? (
                            <button
                                onClick={(e) => deleteClaimObject(claimObject.id, index)}
                                className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                title="Supprimer">
                                <i className="la la-trash"/>
                            </button>
                        ) : null
                    }
                </td>
            </tr>
        );
    };

    return (
        verifyPermission(props.userPermissions, 'list-claim-category') ? (
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
                                    Objet de réclamation
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <div className="kt-portlet">
                        <HeaderTablePage
                            addPermission={"store-claim-object"}
                            title={"Objet de réclamation"}
                            addText={"Ajouter"}
                            addLink={"/settings/claim_objects/add"}
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

                                            <ExportButton/>
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
                                                                colSpan="1" style={{ width: "250px" }}
                                                                aria-label="Ship City: activate to sort column ascending">Description
                                                            </th>
                                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70px" }}
                                                                aria-label="Country: activate to sort column ascending">Nom de la catégorie
                                                            </th>
                                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70px" }}
                                                                aria-label="Country: activate to sort column ascending">Temps limite
                                                            </th>
                                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70px" }}
                                                                aria-label="Country: activate to sort column ascending">Niveau de gravité
                                                            </th>
                                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1" colSpan="1" style={{ width: "40.25px" }} aria-label="Type: activate to sort column ascending">
                                                                Action
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        claimObjects.length ? (
                                                            showList.length ? (
                                                                showList.map((claimObject, index) => (
                                                                    printBodyTable(claimObject, index)
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
                                                        <th rowSpan="1" colSpan="1">Description</th>
                                                        <th rowSpan="1" colSpan="1">Nom de la catégorie</th>
                                                        <th rowSpan="1" colSpan="1">Temps limite</th>
                                                        <th rowSpan="1" colSpan="1">Niveau de gravité</th>
                                                        <th rowSpan="1" colSpan="1">Action</th>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-5">
                                                <div className="dataTables_info" id="kt_table_1_info" role="status"
                                                     aria-live="polite">Affichage de 1 à {numberPerPage} sur {claimObjects.length} données
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

const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions,
        language: state.language.languageSelected
    }
};

export default connect(mapStateToProps)(ClaimObject);
