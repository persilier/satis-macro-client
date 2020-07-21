import React, {useEffect, useState} from "react";
import axios from "axios";
import {connect} from "react-redux";
import InfirmationTable from "../components/InfirmationTable";
import HeaderTablePage from "../components/HeaderTablePage";
import FourModel from "../components/charts/FourModel";
import appConfig from "../../config/appConfig";
import SixModel from "../components/charts/SixModel";
import LoadingTable from "../components/LoadingTable";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastErrorMessageWithParameterConfig,
    toastInvalidPeriodMessageConfig,
    toastValidPeriodMessageConfig
} from "../../config/toastConfig";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import Select from "react-select";
import {formatSelectOption} from "../../helpers/function";

const ClaimReporting = props => {
    if (!(verifyPermission(props.userPermissions, 'list-reporting-claim-any-institution') || verifyPermission(props.userPermissions, "list-reporting-claim-my-institution")))
        window.location.href = ERROR_401;

    let endpoint = "";
    if (props.plan === "MACRO") {
        if (verifyPermission(props.userPermissions, "list-reporting-claim-any-institution"))
            endpoint = `${appConfig.apiDomaine}/any/reporting-claim`;
        else if (verifyPermission(props.userPermissions, 'list-reporting-claim-my-institution'))
            endpoint = `${appConfig.apiDomaine}/my/reporting-claim`;
    } else if(props.plan === "HUB")
        endpoint = `${appConfig.apiDomaine}/any/reporting-claim`;
    else if(props.plan === "PRO")
        endpoint = `${appConfig.apiDomaine}/my/reporting-claim`;


    const [fetchData, setFetchData] = useState(null);
    const [institution, setInstitution] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [typeFilter, setTypeFilter] = useState("months");
    const [startFilter, setStartFilter] = useState(false);
    const [possibleFilter, setPossibleFilter] = useState(
        {
            months: true,
            weeks: true,
            days: true
        }
    );

    var totalCollect = 0;
    var totalIncomplete = 0;
    var totalToAssignUnit = 0;
    var totalToAssignStaff = 0;
    var totalAwaitingTreatment= 0;
    var totalToValidate = 0;
    var totalToMeasureSatisfaction = 0;
    var totalPercentage = 0;

    const calculateTotal = () => {
        fetchData.statistiqueObject.map(row => {
            row.claim_objects.map(elRow => {
                totalCollect = totalCollect + elRow.total;
                totalIncomplete = totalIncomplete + elRow.incomplete;
                totalToAssignUnit = totalToAssignUnit + elRow.toAssignementToUnit;
                totalToAssignStaff = totalToAssignStaff + elRow.toAssignementToStaff;
                totalAwaitingTreatment = totalAwaitingTreatment + elRow.awaitingTreatment;
                totalToValidate = totalToValidate + elRow.toValidate;
                totalToMeasureSatisfaction = totalToMeasureSatisfaction + elRow.toMeasureSatisfaction;
                totalPercentage = totalPercentage + elRow.percentage
            });
        });
    };

    if (fetchData)
        calculateTotal();

    const applyPossibleFilter = (data) => {
        const newPossibleFilter = {...possibleFilter};

        newPossibleFilter.days = Object.keys(data.days.claims_received).length <= 17;
        newPossibleFilter.weeks = Object.keys(data.weeks.claims_received).length <= 5;
        setPossibleFilter(newPossibleFilter);
    };

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(endpoint)
                .then(response => {
                    applyPossibleFilter(response.data.statistiqueGraphePeriod);
                    setFetchData(response.data);
                })
                .catch(error => console.log("Something is wrong"))
            ;
        };

        fetchData();
    }, []);

    const handleChangeTypeFilter = (e) => {
        setTypeFilter(e.target.value);
    };

    const handleChangeStartDate = e => {
        if (endDate && e.target.value) {
            if (!(new Date(endDate) > new Date(e.target.value)))
                ToastBottomEnd.fire(toastInvalidPeriodMessageConfig);
            else
                ToastBottomEnd.fire(toastValidPeriodMessageConfig);
        }
        setStartDate(e.target.value);
    };

    const handleChangeEndDate = e => {
        if (startDate && e.target.value) {
            if (!(new Date(startDate) < new Date(e.target.value)))
                ToastBottomEnd.fire(toastInvalidPeriodMessageConfig);
            else
                ToastBottomEnd.fire(toastValidPeriodMessageConfig);
        }
        setEndDate(e.target.value);
    };

    const handleChangeInstitution = selected => {
        setInstitution(selected)
    };

    const filterRequest = () => {
        const oldData = {...fetchData};
        setStartFilter(true);
        setTypeFilter("months");
        setFetchData(null);
        setPossibleFilter(
            {
                months: true,
                weeks: true,
                days: true
            }
        );
        var parameter = "";
        if (institution && startDate && endDate)
            parameter = `?date_start=${startDate}&date_end=${endDate}&institution_id=${institution.value}`;
        else if (institution && !startDate && !endDate)
            parameter = `?institution_id=${institution.value}`;
        else  if(!institution && startDate && endDate)
            parameter = `?date_start=${startDate}&date_end=${endDate}`;
        axios.get(`${endpoint}${parameter}`)
            .then(response => {
                setStartFilter(false);
                applyPossibleFilter(response.data.statistiqueGraphePeriod);
                setFetchData(response.data);
            })
            .catch(error => {
                setStartFilter(false);
                setFetchData(oldData);
                ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(error.response.data.error.date_end))
            })
        ;
    };

    const filterData = () => {
        if (institution && startDate && endDate) {
            if (startDate && endDate) {
                if (!(new Date(startDate) <= new Date(endDate)))
                    ToastBottomEnd.fire(toastInvalidPeriodMessageConfig);
                else {
                    filterRequest()
                }
            } else {
                ToastBottomEnd.fire(toastInvalidPeriodMessageConfig);
            }
        } else if (institution && !startDate && !endDate) {
            filterRequest();
        } else if (!institution && startDate && endDate) {
            if (startDate && endDate) {
                if (!(new Date(startDate) <= new Date(endDate)))
                    ToastBottomEnd.fire(toastInvalidPeriodMessageConfig);
                else {
                    filterRequest()
                }
            } else {
                ToastBottomEnd.fire(toastInvalidPeriodMessageConfig);
            }
        } else {
            ToastBottomEnd.fire(toastErrorMessageWithParameterConfig("Veillez renseigner les parametres correctement"))
        }
    };

    return (
        verifyPermission(props.userPermissions, 'list-reporting-claim-any-institution') || verifyPermission(props.userPermissions, 'list-reporting-claim-my-institution') ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Reporting
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link">
                                    claim reporting
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <InfirmationTable information={"A common UI paradigm to use with interactive tables is to present buttons that will trigger some action. See official documentation"}/>

                    <div className="alert alert-light alert-elevate" role="alert">
                        <div className="alert-icon">
                            <button className="btn btn-info btn-circle">
                                <i className="fa fa-file-export" style={{color: "white"}}/> Exportez
                            </button>
                        </div>

                        <div className="alert-text align-items-center">

                            <div className="row col-12 d-flex justify-content-center align-items-center">
                                {
                                    verifyPermission(props.userPermissions, 'list-reporting-claim-any-institution') ? (
                                        <div className="form-group col-3">
                                            <label htmlFor="institution">Institutions</label>
                                            <Select
                                                isClearable
                                                value={institution}
                                                onChange={handleChangeInstitution}
                                                options={formatSelectOption(fetchData ? fetchData.institutions : [], 'name', false)}
                                            />
                                        </div>
                                    ) : null
                                }

                                <div className="form-group col-3">
                                    <label htmlFor="start">Date de début</label>
                                    <input
                                        id="start"
                                        type="date"
                                        className="form-control"
                                        value={startDate}
                                        onChange={handleChangeStartDate}
                                    />
                                </div>
                                <div className="form-group col-3">
                                    <label htmlFor="end">Date de début</label>
                                    <input
                                        id="end"
                                        type="date"
                                        className="form-control"
                                        value={endDate}
                                        onChange={handleChangeEndDate}
                                    />
                                </div>
                                <div className="form-group col-3">
                                    {
                                        !startFilter ? (
                                            <button
                                                className="btn btn-primary"
                                                style={{marginTop: "25px"}}
                                                onClick={() => filterData()}
                                            >
                                                <i className="fa fa-filter"/> Filtrer
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                                type="button" disabled
                                                style={{marginTop: "25px"}}
                                            >
                                                Chargement...
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="kt-portlet">
                        <HeaderTablePage
                            title={"Reporting Reclamation"}
                        />

                        <div className="kt-portlet__body">
                            <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                <div className="row">
                                    {
                                        fetchData ? (
                                            <div className="col-sm-12">
                                                <strong>Légende: <br/>R </strong>{"<===>"} Réclamtions
                                                <table className="table table-striped- table-bordered table-hover table-checkable dataTable dtr-inline" id="myTable" role="grid" aria-describedby="kt_table_1_info" style={{ width: "952px" }}>
                                                    <thead>
                                                    <tr role="row">
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">Catégorie de <strong>R</strong>
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">Objets de <strong>R</strong>
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending"><strong>R</strong> collectées
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending"><strong>R</strong> incomplète
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending"><strong>R</strong> à assigner à une unité
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending"><strong>R</strong> à assigner à un agent
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending"><strong>R</strong> à traiter
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending"><strong>R</strong> à valider
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending"><strong>R</strong> à mesurer satisfaction
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">Pourcentage de Résolues
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        fetchData.statistiqueObject.map((row, index) => (
                                                            row.claim_objects.map((elRow, indexEleRow) => (
                                                                indexEleRow === 0 ? (
                                                                    <tr key={index}>
                                                                        {
                                                                            row.claim_objects.length === 0 ? (
                                                                                <td>{row.name["fr"]}</td>
                                                                            ) : (
                                                                                <td rowSpan={row.claim_objects.length}>{row.name["fr"]}</td>
                                                                            )
                                                                        }
                                                                        <td>{elRow.name["fr"]}</td>
                                                                        <td>{elRow.total}</td>
                                                                        <td>{elRow.incomplete}</td>
                                                                        <td>{elRow.toAssignementToUnit}</td>
                                                                        <td>{elRow.toAssignementToStaff}</td>
                                                                        <td>{elRow.awaitingTreatment}</td>
                                                                        <td>{elRow.toValidate}</td>
                                                                        <td>{elRow.toMeasureSatisfaction}</td>
                                                                        <td>{elRow.percentage} %</td>
                                                                    </tr>
                                                                ) : (
                                                                    <tr key={indexEleRow}>
                                                                        <td>{elRow.name["fr"]}</td>
                                                                        <td>{elRow.total}</td>
                                                                        <td>{elRow.incomplete}</td>
                                                                        <td>{elRow.toAssignementToUnit}</td>
                                                                        <td>{elRow.toAssignementToStaff}</td>
                                                                        <td>{elRow.awaitingTreatment}</td>
                                                                        <td>{elRow.toValidate}</td>
                                                                        <td>{elRow.toMeasureSatisfaction}</td>
                                                                        <td>{elRow.percentage} %</td>
                                                                    </tr>
                                                                )
                                                            ))
                                                        ))
                                                    }
                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                                                        <th colSpan="2" className="text-center">Total</th>
                                                        <th>{totalCollect}</th>
                                                        <th>{totalIncomplete}</th>
                                                        <th>{totalToAssignUnit}</th>
                                                        <th>{totalToAssignStaff}</th>
                                                        <th>{totalAwaitingTreatment}</th>
                                                        <th>{totalToValidate}</th>
                                                        <th>{totalToMeasureSatisfaction}</th>
                                                        <th>{totalPercentage} %</th>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        ) : <LoadingTable/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="kt-portlet">
                        <HeaderTablePage
                            title={"Délai de qualification des réclamations"}
                        />

                        <div className="kt-portlet__body">
                            <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                <div className="row">
                                    {
                                        fetchData ? (
                                            <div className="col-sm-12">
                                                <table
                                                    className="table table-striped- table-bordered table-hover table-checkable dataTable dtr-inline"
                                                    id="myTable" role="grid" aria-describedby="kt_table_1_info"
                                                    style={{ width: "952px" }}>
                                                    <thead>
                                                    <tr role="row">
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">Délai de qualification (en jour)
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">0-2 jours
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">2-4 jours
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">4-6 jours
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">6-10 jours
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">Plus de 10 jours
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td>Nombre</td>
                                                        <td>{fetchData.statistiqueQualificationPeriod["0-2"].total}</td>
                                                        <td>{fetchData.statistiqueQualificationPeriod["2-4"].total}</td>
                                                        <td>{fetchData.statistiqueQualificationPeriod["4-6"].total}</td>
                                                        <td>{fetchData.statistiqueQualificationPeriod["6-10"].total}</td>
                                                        <td>{fetchData.statistiqueQualificationPeriod["+10"].total}</td>
                                                    </tr>
                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                                                        <th rowSpan="1" colSpan="1">Taux (%)</th>
                                                        <th rowSpan="1" colSpan="1">{fetchData.statistiqueQualificationPeriod["0-2"].pourcentage}</th>
                                                        <th rowSpan="1" colSpan="1">{fetchData.statistiqueQualificationPeriod["2-4"].pourcentage}</th>
                                                        <th rowSpan="1" colSpan="1">{fetchData.statistiqueQualificationPeriod["4-6"].pourcentage}</th>
                                                        <th rowSpan="1" colSpan="1">{fetchData.statistiqueQualificationPeriod["6-10"].pourcentage}</th>
                                                        <th rowSpan="1" colSpan="1">{fetchData.statistiqueQualificationPeriod["+10"].pourcentage}</th>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        ) : <LoadingTable/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="kt-portlet">
                        <HeaderTablePage
                            title={"Délai de traitement des réclamations"}
                        />

                        <div className="kt-portlet__body">
                            <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                <div className="row">
                                    {
                                        fetchData ? (
                                            <div className="col-sm-12">
                                                <table
                                                    className="table table-striped- table-bordered table-hover table-checkable dataTable dtr-inline"
                                                    id="myTable" role="grid" aria-describedby="kt_table_1_info"
                                                    style={{ width: "952px" }}>
                                                    <thead>
                                                    <tr role="row">
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">Délai de Traitement (en jour)
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">0-2 jours
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">2-4 jours
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">4-6 jours
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">6-10 jours
                                                        </th>
                                                        <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                            colSpan="1" style={{ width: "70.25px" }}
                                                            aria-label="Country: activate to sort column ascending">Plus de 10 jours
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td>Nombre</td>
                                                        <td>{fetchData.statistiqueTreatmentPeriod["0-2"].total}</td>
                                                        <td>{fetchData.statistiqueTreatmentPeriod["2-4"].total}</td>
                                                        <td>{fetchData.statistiqueTreatmentPeriod["4-6"].total}</td>
                                                        <td>{fetchData.statistiqueTreatmentPeriod["6-10"].total}</td>
                                                        <td>{fetchData.statistiqueTreatmentPeriod["+10"].total}</td>
                                                    </tr>
                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                                                        <th rowSpan="1" colSpan="1">Taux</th>
                                                        <th rowSpan="1" colSpan="1">{fetchData.statistiqueTreatmentPeriod["0-2"].pourcentage}</th>
                                                        <th rowSpan="1" colSpan="1">{fetchData.statistiqueTreatmentPeriod["2-4"].pourcentage}</th>
                                                        <th rowSpan="1" colSpan="1">{fetchData.statistiqueTreatmentPeriod["4-6"].pourcentage}</th>
                                                        <th rowSpan="1" colSpan="1">{fetchData.statistiqueTreatmentPeriod["6-10"].pourcentage}</th>
                                                        <th rowSpan="1" colSpan="1">{fetchData.statistiqueTreatmentPeriod["+10"].pourcentage}</th>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        ) : <LoadingTable/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="kt-portlet">
                        <HeaderTablePage
                            title={"Utilisation de canaux"}
                        />

                        <div className="kt-portlet__body">
                            <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                <div className="row">
                                    {
                                        fetchData ? (
                                            <div className="col-sm-12">
                                                <table
                                                    className="table table-striped- table-bordered table-hover table-checkable dataTable dtr-inline"
                                                    id="myTable" role="grid" aria-describedby="kt_table_1_info"
                                                    style={{ width: "952px" }}>
                                                    <thead>
                                                    <tr role="row">
                                                        {
                                                            fetchData.statistiqueChannel.map((channel, index) => (
                                                                <th key={index} tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                    colSpan="1" style={{ width: "70.25px" }}
                                                                    aria-label="Country: activate to sort column ascending">{channel.name["fr"]}
                                                                </th>
                                                            ))
                                                        }
                                                    </tr>
                                                    </thead>
                                                    <tbody/>
                                                    <tfoot>
                                                    <tr>
                                                        {
                                                            fetchData.statistiqueChannel.map((channel, index) => (
                                                                <th key={index} rowSpan="1" colSpan="1">{channel.total_claim}</th>
                                                            ))
                                                        }
                                                    </tr>
                                                    </tfoot>
                                                </table>

                                                <SixModel
                                                    data={fetchData.statistiqueChannel}
                                                />
                                            </div>
                                        ) : <LoadingTable/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="kt-portlet">
                        <HeaderTablePage
                            title={"Evolution des réclamations"}
                        />

                        <div className="kt-portlet__body">
                            <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                <div className="row d-flex justify-content-center">
                                    <div className="form-group col-6">
                                        <label htmlFor="filter">filtre</label>
                                        <select
                                            id="filter"
                                            className="form-control"
                                            value={typeFilter}
                                            onChange={(e) => handleChangeTypeFilter(e)}
                                        >
                                            <option value="" disabled={true}>Veillez choisir le filtre</option>
                                            {
                                                possibleFilter.months ? (
                                                    <option value="months">Mois</option>
                                                ) : null
                                            }
                                            {
                                                possibleFilter.weeks ? (
                                                    <option value="weeks">Semaine</option>
                                                ) : null
                                            }
                                            {
                                                possibleFilter.days ? (
                                                    <option value="days">Jour</option>
                                                ) : null
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    {
                                        fetchData ? (
                                            <div className="col-sm-12">
                                                <FourModel
                                                    type={typeFilter}
                                                    data={fetchData.statistiqueGraphePeriod}
                                                />
                                            </div>
                                        ) : <LoadingTable/>
                                    }
                                </div>
                            </div>
                        </div>
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

export default connect(mapStateToProps)(ClaimReporting);
