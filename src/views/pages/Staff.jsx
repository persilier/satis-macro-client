import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {
    Link
} from "react-router-dom";
import {forceRound, getLowerCaseString, loadCss} from "../../helpers/function";
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
import {AUTH_TOKEN} from "../../constants/token";
import {NUMBER_ELEMENT_PER_PAGE} from "../../constants/dataTable";
import ExportButton from "../components/ExportButton";
import {verifyTokenExpire} from "../../middleware/verifyToken";
import {useTranslation} from "react-i18next";

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

    //usage of useTranslation i18n
    const {t, ready} = useTranslation();

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
    const [numberPerPage, setNumberPerPage] = useState(NUMBER_ELEMENT_PER_PAGE);
    const [activeNumberPage, setActiveNumberPage] = useState(0);
    const [numberPage, setNumberPage] = useState(0);
    const [showList, setShowList] = useState([]);

    useEffect(() => {
        async function fetchData() {
            await axios.get(endPoint.list)
                .then(response => {
                    setNumberPage(forceRound(response.data.length/NUMBER_ELEMENT_PER_PAGE));
                    setShowList(response.data.slice(0, NUMBER_ELEMENT_PER_PAGE));
                    setStaffs(response.data);
                    setLoad(false);
                })
                .catch(error => {
                    setLoad(false);
                    console.log("Something is wrong");
                });
        }
        if (verifyTokenExpire())
            fetchData();
    }, [endPoint.list, NUMBER_ELEMENT_PER_PAGE]);

    const separateStringByComa = (arrayString) => {
        let generateString = "";
        arrayString.map((t, index) => {
            generateString = index + 1 !== arrayString.length ? generateString + t+", " : generateString + t
        });
        return generateString;
    };

    const filterShowListBySearchValue = (value) => {
        value = getLowerCaseString(value);
        let newStaffs = [...staffs];
        newStaffs = newStaffs.filter(el => (
            getLowerCaseString(`${el.is_lead ? 'L' : ''} ${(el.identite && el.identite.lastname) ? el.identite.lastname : ''} ${(el.identite && el.identite.firstname) ? el.identite.firstname : ''}`).indexOf(value) >= 0 ||
            getLowerCaseString(separateStringByComa(el.identite.telephone)).indexOf(value) >= 0 ||
            getLowerCaseString(separateStringByComa(el.identite.email)).indexOf(value) >= 0 ||
            getLowerCaseString(verifyPermission(props.userPermissions, 'list-staff-from-maybe-no-unit') ? el.unit ? el.unit.name["fr"] : '' : el.unit.name["fr"]).indexOf(value) >= 0 ||
            getLowerCaseString(verifyPermission(props.userPermissions, 'list-staff-from-any-unit') ?  el.institution.name["fr"] : '').indexOf(value) >= 0 ||
            getLowerCaseString(el.position.name["fr"]).indexOf(value) >= 0
        ));

        return newStaffs;
    };

    const searchElement = async (e) => {
        if (e.target.value) {
            setNumberPage(forceRound(filterShowListBySearchValue(e.target.value).length/NUMBER_ELEMENT_PER_PAGE));
            setShowList(filterShowListBySearchValue(e.target.value.toLowerCase()).slice(0, NUMBER_ELEMENT_PER_PAGE));
        } else {
            setNumberPage(forceRound(staffs.length/NUMBER_ELEMENT_PER_PAGE));
            setShowList(staffs.slice(0, NUMBER_ELEMENT_PER_PAGE));
            setActiveNumberPage(0);
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
        DeleteConfirmation.fire(confirmDeleteConfig())
            .then((result) => {
                if (verifyTokenExpire()) {
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
                                ToastBottomEnd.fire(toastDeleteSuccessMessageConfig());
                            })
                            .catch(error => {
                                ToastBottomEnd.fire(toastDeleteErrorMessageConfig());
                            })
                        ;
                    }
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
            <tr key={index} role="row" className="odd">
                <td>
                    {
                        staff.is_lead ?
                            (<span className="kt-badge kt-badge--success kt-badge--inline">L</span>) : null} {`${(staff.identite && staff.identite.lastname) ? staff.identite.lastname : ''} ${(staff.identite && staff.identite.firstname) ? staff.identite.firstname : ''}`}
                </td>
                <td>
                    {
                        (staff.identite && staff.identite.telephone !== null) ? (
                            staff.identite.telephone.map((tel, index) => (
                                index === staff.identite.telephone.length - 1 ? tel : tel+", "
                            ))
                        ) : null
                    }

                </td>
                <td>
                    {
                        (staff.identite && staff.identite.email !== null) ? (
                            staff.identite.email.map((mail, index) => (
                                index === staff.identite.email.length - 1 ? mail : mail+", "
                            ))
                        ) : null
                    }
                </td>
                {
                    verifyPermission(props.userPermissions, 'list-staff-from-maybe-no-unit') ? (
                        staff.unit ? (
                            <td>{staff.unit.name["fr"]}</td>
                            ) : null
                    ) : (
                        <td>{staff.unit.name["fr"]}</td>
                    )
                }
                {
                    verifyPermission(props.userPermissions, 'list-staff-from-any-unit') ? (
                        <td>{staff.institution.name}</td>
                    ) : null
                }
                <td>{staff.position.name["fr"]}</td>
                <td>
                    {
                        verifyPermission(props.userPermissions, "update-staff-from-any-unit") || verifyPermission(props.userPermissions, 'update-staff-from-my-unit') || verifyPermission(props.userPermissions, 'update-staff-from-maybe-no-unit') ? (
                            <Link to={`/settings/staffs/${staff.id}/edit`}
                                  className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                  title={t("Modifier")}>
                                <i className="la la-edit"/>
                            </Link>
                        ) : null
                    }
                    {
                        verifyPermission(props.userPermissions, "destroy-staff-from-any-unit") || verifyPermission(props.userPermissions, 'destroy-staff-from-my-unit') || verifyPermission(props.userPermissions, 'destroy-staff-from-maybe-no-unit') ? (
                            <button
                                onClick={(e) => deleteStaff(staff.id, index)}
                                className="btn btn-sm btn-clean btn-icon btn-icon-md"
                                title={t("Supprimer")}>
                                <i className="la la-trash"/>
                            </button>
                        ) : null
                    }
                </td>
            </tr>
        );
    };

    return (
        ready ? (
            verifyPermission(props.userPermissions, 'list-staff-from-any-unit') || verifyPermission(props.userPermissions, 'list-staff-from-my-unit') || verifyPermission(props.userPermissions, 'list-staff-from-maybe-no-unit') ? (
                <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                    <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                        <div className="kt-container  kt-container--fluid ">
                            <div className="kt-subheader__main">
                                <h3 className="kt-subheader__title">
                                    {t("Paramètres")}
                                </h3>
                                <span className="kt-subheader__separator kt-hidden"/>
                                <div className="kt-subheader__breadcrumbs">
                                    <a href="#icone" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                                    <span className="kt-subheader__breadcrumbs-separator"/>
                                    <a href="#button" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link" style={{cursor: "text"}}>
                                        {t("Agent")}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                        <InfirmationTable information={(<><span className="kt-badge kt-badge--success kt-badge--inline">L</span> : {t("Responsable d'unité")}</>)}/>

                        <div className="kt-portlet">
                            <HeaderTablePage
                                addPermission={["store-staff-from-any-unit", "store-staff-from-my-unit", 'list-staff-from-maybe-no-unit']}
                                title={t("Agent")}
                                addText={t("Ajouter")}
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
                                                            {t("Recherche")}:
                                                            <input id="myInput" type="text" onKeyUp={(e) => searchElement(e)} className="form-control form-control-sm" placeholder="" aria-controls="kt_table_1"/>
                                                        </label>
                                                    </div>
                                                </div>

                                                <ExportButton downloadLink={`${appConfig.apiDomaine}/download-excel/staffs`} pageUrl={"/settings/staffs/import"}/>
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
                                                                aria-label="Country: activate to sort column ascending">{t("Nom")}
                                                            </th>
                                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "50px" }}
                                                                aria-label="Country: activate to sort column ascending">{t("Téléphone")}
                                                            </th>
                                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "50px" }}
                                                                aria-label="Country: activate to sort column ascending">Email
                                                            </th>
                                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70.25px" }}
                                                                aria-label="Country: activate to sort column ascending">{t("Unité")}
                                                            </th>
                                                            {
                                                                verifyPermission(props.userPermissions, 'list-staff-from-any-unit') ? (
                                                                    <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                        colSpan="1" style={{ width: "70.25px" }}
                                                                        aria-label="Country: activate to sort column ascending">{t("Institution")}
                                                                    </th>
                                                                ) : <th style={{display: "none"}}/>
                                                            }
                                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70.25px" }}
                                                                aria-label="Country: activate to sort column ascending">{t("Position")}
                                                            </th>
                                                            <th className="sorting" tabIndex="0" aria-controls="kt_table_1" rowSpan="1" colSpan="1" style={{ width: "53px" }} aria-label="Type: activate to sort column ascending">
                                                                {t("Action")}
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            staffs.length ? (
                                                                showList ? (
                                                                    showList.map((staff, index) => (
                                                                        printBodyTable(staff, index)
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
                                                            <th rowSpan="1" colSpan="1">{t("Nom")}</th>
                                                            <th rowSpan="1" colSpan="1">{t("Téléphone")}</th>
                                                            <th rowSpan="1" colSpan="1">{t("Email")}</th>
                                                            <th rowSpan="1" colSpan="1">{t("Unité")}</th>
                                                            {
                                                                verifyPermission(props.userPermissions, 'list-staff-from-any-unit') ? (
                                                                    <th rowSpan="1" colSpan="1">{t("Institution")}</th>
                                                                ) : <th style={{display: "none"}}/>
                                                            }
                                                            <th rowSpan="1" colSpan="1">{t("Position")}</th>
                                                            <th rowSpan="1" colSpan="1">{t("Action")}</th>
                                                        </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-5">
                                                    <div className="dataTables_info" id="kt_table_1_info" role="status"
                                                         aria-live="polite">{t("Affichage de")} 1 {t("à")} {numberPerPage} {t("sur")} {staffs.length} {t("données")}
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
        ) : null
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan
    };
};

export default connect(mapStateToProps)(Staff);
