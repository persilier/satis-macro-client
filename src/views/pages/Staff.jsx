import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {
    Link
} from "react-router-dom";
import {filterDataTableBySearchValue, forceRound, loadCss} from "../../helpers/function";
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
import {ERROR_401} from "../../config/errorPage";
import {verifyPermission} from "../../helpers/permission";
import {AUTH_TOKEN} from "../../constants/token";

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

const endPointConfig = {
    PRO: {
        plan: "PRO",
        list: `${appConfig.apiDomaine}/my/staff`,
        destroy: unitId => `${appConfig.apiDomaine}/my/staff/${unitId}`,
    },
    MACRO: {
        holding: {
            list: `${appConfig.apiDomaine}/any/staff`,
            destroy: unitId => `${appConfig.apiDomaine}/any/staff/${unitId}`,
        },
        filial: {
            list: `${appConfig.apiDomaine}/my/staff`,
            destroy: unitId => `${appConfig.apiDomaine}/my/staff/${unitId}`,
        }
    },
    HUB: {
        plan: "HUB",
        list: `${appConfig.apiDomaine}/maybe/no/staff`,
        destroy: unitId => `${appConfig.apiDomaine}/maybe/no/staff/${unitId}`,
    }
};

const   Staff = (props) => {
    if (!(verifyPermission(props.userPermissions, 'list-staff-from-any-unit') || verifyPermission(props.userPermissions, 'list-staff-from-my-unit')|| verifyPermission(props.userPermissions, 'list-staff-from-maybe-no-unit')) )
        window.location.href = ERROR_401;

    let endPoint = "";
    if (props.plan === "MACRO") {
        if (verifyPermission(props.userPermissions, 'list-any-unit'))
            endPoint = endPointConfig[props.plan].holding;
        else if (verifyPermission(props.userPermissions, 'list-my-unit'))
            endPoint = endPointConfig[props.plan].filial
    } else {
        endPoint = endPointConfig[props.plan]
    }

    const [load, setLoad] = useState(true);
    const [staffs, setStaffs] = useState([]);
    const [numberPerPage, setNumberPerPage] = useState(2);
    const [activeNumberPage, setActiveNumberPage] = useState(0);
    const [search, setSearch] = useState(false);
    const [numberPage, setNumberPage] = useState(0);
    const [showList, setShowList] = useState([]);

    useEffect(() => {
        axios.get(endPoint.list)
            .then(response => {
                setLoad(false);
                setNumberPage(forceRound(response.data.length/numberPerPage));
                setShowList(response.data.slice(0, numberPerPage));
               setStaffs(response.data);
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
        setShowList(staffs.slice(0, parseInt(e.target.value)));
        setNumberPage(forceRound(staffs.length/parseInt(e.target.value)));
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
        setShowList(staffs.slice(getEndByPosition(page) - numberPerPage, getEndByPosition(page)));
    };

    const onClickNextPage = (e) => {
        e.preventDefault();
        if (activeNumberPage <= numberPage) {
            setActiveNumberPage(activeNumberPage + 1);
            setShowList(
                staffs.slice(
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
                staffs.slice(
                    getEndByPosition(activeNumberPage - 1) - numberPerPage,
                    getEndByPosition(activeNumberPage - 1)
                )
            );
        }
    };

    const deleteStaff = (staffId, index) => {
        DeleteConfirmation.fire(confirmDeleteConfig)
            .then((result) => {
                if (result.value) {
                    axios.delete(endPoint.destroy(staffId))
                        .then(response => {
                            const newStaffs = [...staffs];
                            newStaffs.splice(index, 1);
                            setStaffs(newStaffs);
                            if (showList.length > 1) {
                                setShowList(
                                    newStaffs.slice(
                                        getEndByPosition(activeNumberPage) - numberPerPage,
                                        getEndByPosition(activeNumberPage)
                                    )
                                );
                            } else {
                                setShowList(
                                    newStaffs.slice(
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

    const printBodyTable = (staff, index) => {
        return (
            <tr className="d-flex justify-content-center align-content-center odd" key={index} role="row" className="odd">
                <td>{staff.identite.lastname+" "+staff.identite.firstname}</td>
                <td>
                    {
                        staff.identite.telephone.map((tel, index) => (
                            index === staff.identite.telephone.length - 1 ? tel : tel+", "
                        ))
                    }

                </td>
                <td>
                    {
                        staff.identite.email.map((mail, index) => (
                            index === staff.identite.email.length - 1 ? mail : mail+", "
                        ))
                    }
                </td>
                {
                    verifyPermission(props.userPermissions, 'listx-staff-from-maybe-no-unit') ? (
                        staff.unit ? (
                            <td>{staff.unit.name["fr"]}</td>
                            ) : <td/>
                    ) : (
                        <td>{staff.unit.name["fr"]}</td>
                    )
                }
                {
                    verifyPermission(props.userPermissions, 'list-staff-from-any-unit') ? (
                        <td>{staff.institution.name}</td>
                    ) : <td style={{ display: "none" }}/>
                }
                <td>{staff.position.name["fr"]}</td>
                <td>
                    <Link to="/settings/staffs/detail"
                          className="btn btn-sm btn-clean btn-icon btn-icon-md"
                          title="Détail">
                        <i className="la la-eye"/>
                    </Link>
                    {
                        verifyPermission(props.userPermissions, "update-staff-from-any-unit") || verifyPermission(props.userPermissions, 'update-staff-from-my-unit') || verifyPermission(props.userPermissions, 'update-staff-from-maybe-no-unit') ? (
                            <Link to={`/settings/staffs/${staff.id}/edit`}
                                  className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                  title="Modifier">
                                <i className="la la-edit"/>
                            </Link>
                        ) : ""
                    }
                    {
                        verifyPermission(props.userPermissions, "destroy-staff-from-any-unit") || verifyPermission(props.userPermissions, 'destroy-staff-from-my-unit') || verifyPermission(props.userPermissions, 'destroy-staff-from-maybe-no-unit') ? (
                            <button
                                onClick={(e) => deleteStaff(staff.id, index)}
                                className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                title="Supprimer">
                                <i className="la la-trash"/>
                            </button>
                        ) : ""
                    }
                </td>
            </tr>
        );
    };

    return (
        verifyPermission(props.userPermissions, 'list-staff-from-any-unit') || verifyPermission(props.userPermissions, 'list-staff-from-my-unit') || verifyPermission(props.userPermissions, 'list-staff-from-maybe-no-unit') ? (
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
                                    Agent
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <InfirmationTable information={"A common UI paradigm to use with interactive tables is to present buttons that will trigger some action. See official documentation"}/>

                    <div className="kt-portlet">
                        <HeaderTablePage
                            addPermission={["store-staff-from-any-unit", "store-staff-from-my-unit", 'list-staff-from-maybe-no-unit']}
                            title={"Agent"}
                            addText={"Ajouter un agent"}
                            addLink={"/settings/staffs/add"}
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
                                                        <input id="myInput" type="text" onKeyUp={(e) => searchElement(e)} className="form-control form-control-sm" placeholder="" aria-controls="kt_table_1"/>
                                                    </label>
                                                </div>
                                            </div>
                                            <ExportButton/>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <table
                                                    className="table table-striped- table-bordered table-hover table-checkable dataTable dtr-inline"
                                                    id="myTable" role="grid" aria-describedby="kt_table_1_info"
                                                    style={{ width: "952px" }}>
                                                    <thead>
                                                    <tr role="row">
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">Nom
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "50px" }}
                                                            aria-label="Country: activate to sort column ascending">Téléphone
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "50px" }}
                                                            aria-label="Country: activate to sort column ascending">Email
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">Unité
                                                        </th>
                                                        {
                                                            verifyPermission(props.userPermissions, 'list-staff-from-any-unit') ? (
                                                                <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                    colSpan="1" style={{ width: "70.25px" }}
                                                                    aria-label="Country: activate to sort column ascending">Institution
                                                                </th>
                                                            ) : <th style={{display: "none"}}/>
                                                        }
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">Position
                                                        </th>
                                                        <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1" colSpan="1" style={{ width: "53px" }} aria-label="Type: activate to sort column ascending">
                                                            Action
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        staffs.length ? (
                                                            search ? (
                                                                staffs.map((staff, index) => (
                                                                    printBodyTable(staff, index)
                                                                ))
                                                            ) : (
                                                                showList.map((staff, index) => (
                                                                    printBodyTable(staff, index)
                                                                ))
                                                            )
                                                        ) : (
                                                            <EmptyTable/>
                                                        )
                                                    }
                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                                                        <th rowSpan="1" colSpan="1">Nom</th>
                                                        <th rowSpan="1" colSpan="1">Téléphone</th>
                                                        <th rowSpan="1" colSpan="1">Email</th>
                                                        <th rowSpan="1" colSpan="1">Unité</th>
                                                        {
                                                            verifyPermission(props.userPermissions, 'list-staff-from-any-unit') ? (
                                                                <th rowSpan="1" colSpan="1">Institution</th>
                                                            ) : <th style={{display: "none"}}/>
                                                        }
                                                        <th rowSpan="1" colSpan="1">Position</th>
                                                        <th rowSpan="1" colSpan="1">Action</th>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-5">
                                                <div className="dataTables_info" id="kt_table_1_info" role="status"
                                                     aria-live="polite">Affichage de 1 à {numberPerPage} sur {staffs.length} données
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

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan
    };
};

export default connect(mapStateToProps)(Staff);
