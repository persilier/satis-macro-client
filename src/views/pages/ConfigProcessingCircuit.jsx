import React, {useEffect, useState} from "react";
import axios from "axios";
import {loadCss, filterDataTableBySearchValue, forceRound, formatSelectOption} from "../../helpers/function";
import LoadingTable from "../components/LoadingTable";
import appConfig from "../../config/appConfig";
import Pagination from "../components/Pagination";
import EmptyTable from "../components/EmptyTable";
import ExportButton from "../components/ExportButton";
import InfirmationTable from "../components/InfirmationTable";
import Select from "react-select";
import {Link} from "react-router-dom";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
} from "../../config/toastConfig";
import HeaderTablePage from "../components/HeaderTablePage";
import {verifyPermission} from "../../helpers/permission";
import {connect} from "react-redux";
import {ERROR_401} from "../../config/errorPage";

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token');

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const endPointConfig = {
    PRO: {
        plan: "PRO",
        list: `${appConfig.apiDomaine}/my/processing-circuits`,
    },
    MACRO: {
        holding: {
            list: `${appConfig.apiDomaine}/any/processing-circuits`,
        },
        filial: {
            list: `${appConfig.apiDomaine}/my/processing-circuits`,
        }
    },
    HUB: {
        plan: "HUB",
        list: `${appConfig.apiDomaine}/without-institution/processing-circuits`,
    }
};


const ConfigProcessingCircuit = (props) => {

    if (!(verifyPermission(props.userPermissions, 'update-processing-circuit-my-institution') ||
        verifyPermission(props.userPermissions, "update-processing-circuit-any-institution") ||
        verifyPermission(props.userPermissions, "update-processing-circuit-without-institution")))
        window.location.href = ERROR_401;

    let endPoint = "";
    if (props.plan === "MACRO") {
        if (verifyPermission(props.userPermissions, 'update-processing-circuit-any-institution'))
            endPoint = endPointConfig[props.plan].holding;
        else if (verifyPermission(props.userPermissions, 'update-processing-circuit-my-institution'))
            endPoint = endPointConfig[props.plan].filial
    } else
        endPoint = endPointConfig[props.plan];

    const defaultData = {
        institution_id: []
    };

    const [load, setLoad] = useState(true);
    const [units, setUnits] = useState([]);
    const [claimObject, setClaimObject] = useState([]);
    const [numberPage, setNumberPage] = useState(0);
    const [showList, setShowList] = useState([]);
    const [numberPerPage, setNumberPerPage] = useState(10);
    const [activeNumberPage, setActiveNumberPage] = useState(0);
    const [search, setSearch] = useState(false);
    const [data, setData] = useState(undefined);
    const [institutionId, setInstitutionId] = useState(undefined);
    const [error] = useState(defaultData);
    const [startRequest, setStartRequest] = useState(false);
    const [institutionData, setInstitutionData] = useState(undefined);
    const [institution, setInstitution] = useState([]);

    useEffect(() => {
        if (verifyPermission(props.userPermissions, 'update-processing-circuit-any-institution')) {
            axios.get(endPoint.list)
                .then(response => {
                    const options = [
                        response.data.institutions.length ? response.data.institutions.map((institution) => ({
                            value: institution.id,
                            label: institution.name
                        })) : ""
                    ];
                    setInstitutionData(options);
                });
        }

        axios.get(endPoint.list)
            .then(response => {
                console.log(response.data, 'RESPONSE1');
                let newObjectData = [];
                response.data.claimCategories.map((claimCategory) => (
                    claimCategory.claim_objects.map((claimObject) => (
                        newObjectData[claimObject.id] = claimObject.units.map(unit => (
                            {value: unit.id, label: unit.name.fr})
                        )
                    ))
                ));

                setData(newObjectData);
                setLoad(false);
                setClaimObject(response.data.claimCategories);
                setUnits(response.data.units);
                setInstitutionId(response.data.institution_id);
                setShowList(response.data.claimCategories.slice(0, numberPerPage));
                setNumberPage(forceRound(response.data.claimCategories.length / numberPerPage));
            })
            .catch(error => {
                setLoad(false);
                console.log("Something is wrong");
            });

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
        setShowList(claimObject.slice(0, parseInt(e.target.value)));
        setNumberPage(forceRound(claimObject.length / parseInt(e.target.value)));
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
        setShowList(claimObject.slice(getEndByPosition(page) - numberPerPage, getEndByPosition(page)));
    };

    const onClickNextPage = (e) => {
        e.preventDefault();
        if (activeNumberPage <= numberPage) {
            setActiveNumberPage(activeNumberPage + 1);
            setShowList(
                claimObject.slice(
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
                claimObject.slice(
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

    const onChangeProcessing = (e, object_id) => {
        let newData = {...data};
        newData[object_id] = e.map(sel => ({value: sel.value, label: sel.label}));
        setData(newData);
    };
    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);
        let claimObjects = {...data};
        let values = {};

        for (const claim_object_id in claimObjects) {
            let processings = claimObjects[claim_object_id];

            values[claim_object_id] = processings.map(requirement => (requirement.value));
        }

        let newEndPoint = '';
        if (verifyPermission(props.userPermissions, 'update-processing-circuit-any-institution')){
            newEndPoint = endPoint.list + `/${institutionId}`
        } else {
            newEndPoint = endPoint.list
        }

        axios.put(newEndPoint, values)
            .then(response => {
                setStartRequest(false);
                ToastBottomEnd.fire(toastAddSuccessMessageConfig);
            })
            .catch(error => {
                setStartRequest(false);
                ToastBottomEnd.fire(toastAddErrorMessageConfig);
            })
        ;
    };

    const onChangeInstitution = (selected) => {
        setInstitutionId(selected.value);
        setInstitution(selected);
        axios.get(appConfig.apiDomaine + `/any/processing-circuits/${selected.value}`)
            .then(response => {
                console.log(response.data, "UNITS D'UNE INSTITUTION");
                setUnits(response.data.units ? response.data.units.map((unit) => (unit)) : "");
                let newObjectData = [];
                response.data.claimCategories.map((claimCategory) => (
                    claimCategory.claim_objects.map((claimObject) => (
                        newObjectData[claimObject.id] = claimObject.units.map(unit => (
                            {value: unit.id, label: unit.name.fr})
                        )
                    ))
                ));
                setData(newObjectData)
            });
    };

    const printBodyTable = (category, index) => {
        return (

            category.claim_objects ?
                category.claim_objects.map((object, i) => (
                    <tr key={i} role="row" className="odd">

                        {
                            i === 0 ?
                                <td rowSpan={category.claim_objects.length}>{category.name.fr}</td>
                                : <td style={{display: "none"}}/>
                        }
                        <td>
                            {object.name.fr}
                        </td>
                        <td>
                            {units ? (
                                <Select
                                    value={data[object.id]}
                                    onChange={(e) => onChangeProcessing(e, object.id)}
                                    options={formatSelectOption(units, 'name', "fr")}
                                    isMulti
                                    key={object.id}
                                />
                            ) : ''
                            }
                        </td>
                    </tr>
                )) : ""
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
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="" onClick={e => e.preventDefault()}
                                   className="kt-subheader__breadcrumbs-link">
                                    Configuration des Exigences
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                <InfirmationTable
                    information={"A common UI paradigm to use with interactive tables is to present buttons that will trigger some action. See official documentation"}/>

                <div className="kt-portlet">
                    <HeaderTablePage
                        addPermission={""}
                        title={"Circuit de Traitement"}
                        addText={"Ajouter un circuit de traitement"}
                        addLink={"/settings/processing-circuit"}
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
                                                    <input id="myInput" type="text"
                                                           onKeyUp={(e) => searchElement(e)}
                                                           className="form-control form-control-sm"
                                                           placeholder=""
                                                           aria-controls="kt_table_1"/>
                                                </label>
                                            </div>
                                        </div>
                                        <ExportButton/>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <br/>
                                            <br/>
                                            {
                                                verifyPermission(props.userPermissions, "update-processing-circuit-any-institution") ?
                                                    <div
                                                        className={error.institution_id.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-3 col-form-label"
                                                               htmlFor="exampleSelect1">Sélectionnez une
                                                            Institution </label>
                                                        <div className="col-lg-9 col-xl-6">
                                                            {
                                                                institutionData ? (
                                                                    <Select
                                                                        value={institution}
                                                                        onChange={onChangeInstitution}
                                                                        options={institutionData.length ? institutionData[0].map(name => name) : ''}
                                                                    />

                                                                ) : (<select name="category"
                                                                             className={error.institution_id.length ? "form-control is-invalid" : "form-control"}
                                                                             id="category">
                                                                    <option value=""></option>
                                                                </select>)
                                                            }
                                                        </div>
                                                        {
                                                            error.institution_id.length ? (
                                                                error.institution_id.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : ""
                                                        }


                                                    </div>
                                                    : ""
                                            }


                                            <table
                                                className="table table-striped- table-bordered table-hover table-checkable dataTable dtr-inline"
                                                id="myTable" role="grid" aria-describedby="kt_table_1_info"
                                                style={{width: "952px"}}>
                                                <thead>
                                                <tr role="row">

                                                    <th className="sorting" tabIndex="0"
                                                        aria-controls="kt_table_1"
                                                        rowSpan="1"
                                                        colSpan="1" style={{width: "80px"}}
                                                        aria-label="Ship City: activate to sort column ascending">Catégorie
                                                        de plainte
                                                    </th>
                                                    <th className="sorting" tabIndex="0"
                                                        aria-controls="kt_table_1"
                                                        rowSpan="1"
                                                        colSpan="1" style={{width: "100px"}}
                                                        aria-label="Ship City: activate to sort column ascending">Objets
                                                        de plainte
                                                    </th>
                                                    <th className="sorting" tabIndex="0"
                                                        aria-controls="kt_table_1"
                                                        rowSpan="1"
                                                        colSpan="1" style={{width: "170px"}}
                                                        aria-label="Ship City: activate to sort column ascending">Circuits
                                                        de traitement
                                                    </th>

                                                </tr>
                                                </thead>
                                                <tbody>
                                                {/*{console.log(data, 'data')}*/}
                                                {
                                                    claimObject ? (
                                                        search ? (
                                                            claimObject.map((category, index) => (
                                                                printBodyTable(category, index)
                                                            ))
                                                        ) : (
                                                            showList.map((category, index) => (
                                                                printBodyTable(category, index)
                                                            ))
                                                        )
                                                    ) : (
                                                        <EmptyTable/>
                                                    )
                                                }
                                                </tbody>

                                            </table>
                                            <div className="kt-portlet__foot">
                                                <div className="kt-form__actions text-right">
                                                    {
                                                        !startRequest ? (
                                                            <button type="submit"
                                                                    onClick={(e) => onSubmit(e)}
                                                                    className="btn btn-primary">Envoyer</button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                                                type="button" disabled>
                                                                Loading...
                                                            </button>
                                                        )
                                                    }
                                                    {
                                                        !startRequest ? (
                                                            <Link to="/dashboard" className="btn btn-secondary mx-2">
                                                                Quitter
                                                            </Link>
                                                        ) : (
                                                            <Link to="/dashboard" className="btn btn-secondary mx-2"
                                                                  disabled>
                                                                Quitter
                                                            </Link>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-5">
                                            <div className="dataTables_info" id="kt_table_1_info" role="status"
                                                 aria-live="polite">Affichage de 1
                                                à {numberPerPage} sur {claimObject.length} données
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


const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan,
    };
};

export default connect(mapStateToProps)(ConfigProcessingCircuit);
