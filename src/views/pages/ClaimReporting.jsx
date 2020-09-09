import React, {useEffect, useState} from "react";
import axios from "axios";
import {connect} from "react-redux";
import Select from "react-select";
import FileSaver from "file-saver";
import InfirmationTable from "../components/InfirmationTable";
import HeaderTablePage from "../components/HeaderTablePage";
import appConfig from "../../config/appConfig";
import LoadingTable from "../components/LoadingTable";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastErrorMessageWithParameterConfig,
    toastInvalidPeriodMessageConfig,
    toastValidPeriodMessageConfig
} from "../../config/toastConfig";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import {debug, formatSelectOption} from "../../helpers/function";
import {AUTH_TOKEN} from "../../constants/token";
import {month} from "../../constants/date";
import ApexCharts from "apexcharts";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

const ClaimReporting = props => {
    document.title = "Satis client - Reporting";
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
    const [startExportation, setStartExportation] = useState(false);
    const [pdfTitle, setPdfTitle] = useState(`reporting_${new Date().getFullYear()}`);
    const [possibleFilter, setPossibleFilter] = useState(
        {
            months: true,
            weeks: true,
            days: true
        }
    );
    const [stateChartOne, setStateChartOne] = useState("");
    const [stateChartTwo, setStateChartTwo] = useState("");

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
        totalPercentage = parseFloat((isNaN(totalPercentage / fetchData.statistiqueObject.length) ? 0 : totalPercentage / fetchData.statistiqueObject.length).toFixed(2));
    };

    if (fetchData)
        calculateTotal();

    const applyPossibleFilter = (data) => {
        const newPossibleFilter = {...possibleFilter};

        newPossibleFilter.days = Object.keys(data.days.claims_received).length <= 17;
        newPossibleFilter.weeks = Object.keys(data.weeks.claims_received).length <= 5;
        setPossibleFilter(newPossibleFilter);
    };

    const getGraphOneOptions = (dataGraphOne) => {
        var labels = [];
        var series = [];
        dataGraphOne.map(el => {
            labels.push(el.name["fr"]);
            series.push(el.pourcentage)
        });

        return {
            series: series,
            chart: {
                width: 450,
                type: 'pie',
            },
            labels: labels,
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };
    };

    const getGraphTwoOptions = (dataGraphTwo, type = null) => {
        var categories = [];
        var newSeries = {
            claims_received: [],
            claims_resolved: []
        };
        const getDetailData = () => {
            for (const property in dataGraphTwo[type ? type : typeFilter].claims_received) {
                categories.push(property);
                newSeries.claims_received.push(dataGraphTwo[type ? type : typeFilter].claims_received[property]);
            }
            for (const property in dataGraphTwo[type ? type : typeFilter].claims_resolved) {
                newSeries.claims_resolved.push(dataGraphTwo[type ? type : typeFilter].claims_resolved[property]);
            }
        };

        const formatCategoriesMouths = () => {
            for (var i = 0; i < categories.length; i++)
                categories[i] = `${ month[categories[i].split("-")[1]] } ${ categories[i].split("-")[0][2] }${ categories[i].split("-")[0][3] }`;
        };

        const formatCategoriesDays = () => {
            for (var i = 0; i < categories.length; i++) {
                categories[i] = `${ categories[i].split("-")[2] } ${ month[categories[i].split("-")[1]] } ${ categories[i].split("-")[0][2] }${ categories[i].split("-")[0][3] }`;
            }
        };

        const formatCategoriesWeeks = () => {
            var start = "";
            var end = "";
            for (var i = 0; i < categories.length; i++) {
                start = `${categories[i].replace(/\s/g, '').split("-")[2]} ${month[categories[i].replace(/\s/g, '').split("-")[1]]} ${categories[i].replace(/\s/g, '').split("-")[0][2]}${categories[i].replace(/\s/g, '').split("-")[0][3]}`;
                end = `${categories[i].replace(/\s/g, '').split("-")[5]} ${month[categories[i].replace(/\s/g, '').split("-")[4]]} ${categories[i].replace(/\s/g, '').split("-")[3][2]}${categories[i].replace(/\s/g, '').split("-")[3][3]}`;
                categories[i] = `${start} - ${end}`;
            }
        };

        getDetailData();

        if (type === null) {
            if (typeFilter === "months")
                formatCategoriesMouths();
            else if (typeFilter === "days")
                formatCategoriesDays();
            else
                formatCategoriesWeeks();
        } else {
            if (type === "months")
                formatCategoriesMouths();
            else if (type === "days")
                formatCategoriesDays();
            else
                formatCategoriesWeeks();
        }

        const series = [
            {
                name: 'Réclamtions réçues',
                data: newSeries.claims_received
            },
            {
                name: 'Réclamations résolues',
                data: newSeries.claims_resolved
            }
        ];

        return {
            series: [{
                name: series[0].name,
                data: series[0].data
            }, {
                name: series[1].name,
                data: series[1].data
            }],
            chart: {
                height: 350,
                type: 'area'
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                categories: categories
            },
            tooltip: {
                x: {
                    format: 'MMM \'yyyy'
                },
            },
        };
    };

    const renderChart = (dataGraphOne, dataGraphTwo) => {
        const chartOne = new ApexCharts(document.getElementById("graphOne"), getGraphOneOptions(dataGraphOne));
        const chartTwo = new ApexCharts(document.getElementById("graphTwo"), getGraphTwoOptions(dataGraphTwo));

        setStateChartOne(chartOne);
        setStateChartTwo(chartTwo);

        chartOne.render();
        chartTwo.render();
    };

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(endpoint)
                .then(response => {
                    applyPossibleFilter(response.data.statistiqueGraphePeriod);
                    setFetchData(response.data);

                    renderChart(response.data.statistiqueChannel, response.data.statistiqueGraphePeriod);
                })
                .catch(error => console.log("Something is wrong"))
            ;
        };

        fetchData();
    }, []);

    const handleTypeFilterChange = (e) => {
        setTypeFilter(e.target.value);
        debug(getGraphTwoOptions(fetchData.statistiqueGraphePeriod), "options");
        const parent = document.getElementById("parentGraphTwo");
        document.getElementById("graphTwo").remove();
        const div = document.createElement("div");
        div.id = "graphTwo";
        parent.appendChild(div);
        const chartTwo = new ApexCharts(document.getElementById("graphTwo"), getGraphTwoOptions(fetchData.statistiqueGraphePeriod, e.target.value));
        setStateChartTwo(chartTwo);
        chartTwo.render();
    };

    const handleStartDateChange = e => {
        if (endDate && e.target.value) {
            if (!(new Date(endDate) > new Date(e.target.value)))
                ToastBottomEnd.fire(toastInvalidPeriodMessageConfig);
            else
                ToastBottomEnd.fire(toastValidPeriodMessageConfig);
        }
        setStartDate(e.target.value);
    };

    const handleEndDateChange = e => {
        if (startDate && e.target.value) {
            if (!(new Date(startDate) < new Date(e.target.value)))
                ToastBottomEnd.fire(toastInvalidPeriodMessageConfig);
            else
                ToastBottomEnd.fire(toastValidPeriodMessageConfig);
        }
        setEndDate(e.target.value);
    };

    const handleInstitutionChange = selected => {
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
                setPdfTitle(formatPdfTitle());
                setStartFilter(false);
                applyPossibleFilter(response.data.statistiqueGraphePeriod);
                setFetchData(response.data);

                renderChart(response.data.statistiqueChannel, response.data.statistiqueGraphePeriod);
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

    const formatPdfTitle = () => {
        let newStartDate = startDate;
        let newEndDate = endDate;
        while (newStartDate.includes("-") && newEndDate.includes("-")) {
            newStartDate = newStartDate.replace("-", "_");
            newEndDate = newEndDate.replace("-", "_");
        }
        if (institution && (newStartDate && newEndDate))
            return `reporting_${institution.label}_${newStartDate}_at_${newEndDate}`;
        else if(institution && !(newStartDate && newEndDate))
            return `reporting_${institution.label}`;
        else if(!institution && (newStartDate && newEndDate))
            return `reporting_${newStartDate}_at_${newEndDate}`;
        else
            return `reporting_${new Date().getFullYear()}`;
    };

    const exportToPdf = async () => {
        var uriOne = "";
        var uriTwo = "";
        await stateChartOne.dataURI().then(({ imgURI, blob }) => {
            uriOne = imgURI;
        });

        await stateChartTwo.dataURI().then(({ imgURI, blob }) => {
            uriTwo = imgURI;
        });

        debug(uriOne, "uriOne");
        debug(uriTwo, "uriTwo");

        if (fetchData) {
            setStartExportation(true);
            const sendData = {
                filter: {
                    institution: institution ? institution.value : "",
                    startDate: startDate,
                    endDate: endDate
                },
                statistiqueObject: {
                    data: fetchData.statistiqueObject,
                    total: {
                        totalCollect: totalCollect,
                        totalIncomplete: totalIncomplete,
                        totalToAssignUnit: totalToAssignUnit,
                        totalToAssignStaff: totalToAssignStaff,
                        totalAwaitingTreatment: totalAwaitingTreatment,
                        totalToValidate: totalToValidate,
                        totalToMeasureSatisfaction: totalToMeasureSatisfaction,
                        totalPercentage: totalPercentage,
                    }
                },
                statistiqueQualificationPeriod: fetchData.statistiqueQualificationPeriod,
                statistiqueTreatmentPeriod: fetchData.statistiqueTreatmentPeriod,
                statistiqueChannel: fetchData.statistiqueChannel,
                chanelGraph: {
                    legend: {
                        SMS: "#008FFB",
                        TELEPHONE: "#00E396",
                        EMAIL: "#FEB019",
                        ENTRETIEN: "#FF4560",
                    },
                    image: uriOne
                },
                evolutionClaim: {
                    legend: {
                        claims_received: "#008FFB",
                        claims_resolved: "#00E396"
                    },
                    image: uriTwo,
                    filter: typeFilter
                },
                headeBackground: "#7F9CF5",
            };

            axios({
                method: 'post',
                url: `${appConfig.apiDomaine}/any/reporting-claim/export-pdf`,
                responseType: 'blob',
                data: {data_export: sendData}
            })
                .then(({data}) => {
                    setStartExportation(false);
                    FileSaver.saveAs(data, `${pdfTitle}.pdf`);
                })
                .catch(({response}) => {
                    setStartExportation(false);
                    console.log(response.data.error);
                })
            ;
        } else {
            ToastBottomEnd.fire(toastErrorMessageWithParameterConfig("Donné indisponible pour l'exportation"));
        }
    };

    return (
        verifyPermission(props.userPermissions, 'list-reporting-claim-any-institution') || verifyPermission(props.userPermissions, 'list-reporting-claim-my-institution') ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Monitoring
                            </h3>

                            <span className="kt-subheader__separator kt-hidden"/>

                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link" style={{cursor: "default"}}>
                                    Reporting
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <InfirmationTable information={"Page de reporting"}/>

                    <div className="alert alert-light alert-elevate" role="alert">
                        <div className="alert-icon">
                            {
                                startExportation ? (
                                    <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light">
                                        Chargement...
                                    </button>
                                ) : (
                                    <button className="btn btn-info btn-circle" onClick={exportToPdf}>
                                        <i className="fa fa-file-export" style={{color: "white"}}/> Exportez
                                    </button>
                                )
                            }
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
                                                placeholder={"Choix institution"}
                                                onChange={handleInstitutionChange}
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
                                        onChange={handleStartDateChange}
                                    />
                                </div>

                                <div className="form-group col-3">
                                    <label htmlFor="end">Date de début</label>
                                    <input
                                        id="end"
                                        type="date"
                                        className="form-control"
                                        value={endDate}
                                        onChange={handleEndDateChange}
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
                                                <table className="table table-striped table-bordered table-hover table-checkable dataTable dtr-inline" id="myTable" role="grid" aria-describedby="kt_table_1_info" style={{ width: "952px" }}>
                                                    <thead style={{backgroundColor: "#7F9CF5"}}>
                                                        <tr role="row">
                                                            <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70.25px", color: "white" }}
                                                                aria-label="Country: activate to sort column ascending">Catégorie de <strong>R</strong>
                                                            </th>
                                                            <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70.25px", color: "white" }}
                                                                aria-label="Country: activate to sort column ascending">Objets de <strong>R</strong>
                                                            </th>
                                                            <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70.25px", color: "white" }}
                                                                aria-label="Country: activate to sort column ascending"><strong>R</strong> collectées
                                                            </th>
                                                            <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70.25px", color: "white" }}
                                                                aria-label="Country: activate to sort column ascending"><strong>R</strong> incomplète
                                                            </th>
                                                            <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70.25px", color: "white" }}
                                                                aria-label="Country: activate to sort column ascending"><strong>R</strong> à assigner à une unité
                                                            </th>
                                                            <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70.25px", color: "white" }}
                                                                aria-label="Country: activate to sort column ascending"><strong>R</strong> à assigner à un agent
                                                            </th>
                                                            <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70.25px", color: "white" }}
                                                                aria-label="Country: activate to sort column ascending"><strong>R</strong> à traiter
                                                            </th>
                                                            <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70.25px", color: "white" }}
                                                                aria-label="Country: activate to sort column ascending"><strong>R</strong> à valider
                                                            </th>
                                                            <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70.25px", color: "white" }}
                                                                aria-label="Country: activate to sort column ascending"><strong>R</strong> à mesurer satisfaction
                                                            </th>
                                                            <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70.25px", color: "white" }}
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
                                                <table className="table table-striped- table-bordered table-hover table-checkable dataTable dtr-inline" id="myTable" role="grid" aria-describedby="kt_table_1_info" style={{ width: "952px" }}>
                                                    <thead style={{backgroundColor: "#7F9CF5", borderLeft: "none", borderRight: "none"}}>
                                                        <tr role="row">
                                                            <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70.25px", color: "white", borderLeft: "none", borderRight: "none" }}
                                                                aria-label="Country: activate to sort column ascending">Délai de qualification (en jour)
                                                            </th>
                                                            {
                                                                fetchData.statistiqueQualificationPeriod.map((el, index) => (
                                                                    <th key={index} tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                        colSpan="1" style={{ width: "70.25px", color: "white", borderLeft: "none", borderRight: "none" }}
                                                                        aria-label="Country: activate to sort column ascending">{el.libelle}
                                                                    </th>
                                                                ))
                                                            }
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{borderRight: "none", borderLeft: "none"}}>Nombre</td>
                                                            {
                                                                fetchData.statistiqueQualificationPeriod.map((el, index) => (
                                                                    <td key={index} style={{borderRight: "none", borderLeft: "none"}}>{el.total}</td>
                                                                ))
                                                            }
                                                        </tr>
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th rowSpan="1" colSpan="1" style={{borderRight: "none", borderLeft: "none"}}>Taux (%)</th>
                                                            {
                                                                fetchData.statistiqueQualificationPeriod.map((el, index) => (
                                                                    <th key={index} rowSpan="1" colSpan="1" style={{borderRight: "none", borderLeft: "none"}}>{el.pourcentage}</th>
                                                                ))
                                                            }
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
                                                    <thead style={{backgroundColor: "#7F9CF5"}}>
                                                        <tr role="row">
                                                            <th tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                colSpan="1" style={{ width: "70.25px", color: "white", borderLeft: "none", borderRight: "none" }}
                                                                aria-label="Country: activate to sort column ascending">Délai de Traitement (en jour)
                                                            </th>
                                                            {
                                                                fetchData.statistiqueTreatmentPeriod.map((el, index) => (
                                                                    <th key={index} tabIndex="0" aria-controls="kt_table_1" rowSpan="1"
                                                                        colSpan="1" style={{ width: "70.25px", color: "white", borderLeft: "none", borderRight: "none" }}
                                                                        aria-label="Country: activate to sort column ascending">{el.libelle}
                                                                    </th>
                                                                ))
                                                            }
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ borderLeft: "none", borderRight: "none" }}>Nombre</td>
                                                            {
                                                                fetchData.statistiqueTreatmentPeriod.map((el, index) => (
                                                                    <td key={index} style={{ borderLeft: "none", borderRight: "none" }}>{el.total}</td>
                                                                ))
                                                            }
                                                        </tr>
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th rowSpan="1" colSpan="1" style={{ borderLeft: "none", borderRight: "none" }}>Taux</th>
                                                            {
                                                                fetchData.statistiqueTreatmentPeriod.map((el, index) => (
                                                                    <th key={index} rowSpan="1" colSpan="1" style={{ borderLeft: "none", borderRight: "none" }}>{el.pourcentage}</th>
                                                                ))
                                                            }
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
                                                <table className="table table-striped- table-bordered table-hover table-checkable dataTable dtr-inline" id="myTable" role="grid" aria-describedby="kt_table_1_info" style={{ width: "952px" }}>
                                                    <thead style={{ backgroundColor: "#7F9CF5" }}>
                                                        <tr role="row">
                                                            {
                                                                fetchData.statistiqueChannel.map((channel, index) => (
                                                                    <th
                                                                        key={index}
                                                                        tabIndex="0"
                                                                        aria-controls="kt_table_1"
                                                                        rowSpan="1"
                                                                        colSpan="1" style={{ width: "70.25px", color: "white", borderLeft: "none", borderRight: "none" }}
                                                                        aria-label="Country: activate to sort column ascending">
                                                                        {channel.name["fr"]}
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
                                                                    <th key={index} rowSpan="1" colSpan="1" style={{borderLeft: "none", borderRight: "none"}}>{channel.total_claim}</th>
                                                                ))
                                                            }
                                                        </tr>
                                                    </tfoot>
                                                </table>

                                                {
                                                    fetchData ? (
                                                        <div className="col-12 d-flex justify-content-center">
                                                            <div id="graphOne"/>
                                                        </div>
                                                    ) : null
                                                }
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
                                            onChange={(e) => handleTypeFilterChange(e)}
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
                                            <div id="parentGraphTwo" className="col-sm-12">
                                                <div id="graphTwo"/>
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
