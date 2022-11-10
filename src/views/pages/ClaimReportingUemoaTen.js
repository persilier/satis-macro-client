import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { verifyPermission } from "../../helpers/permission";
import InfirmationTable from "../components/InfirmationTable";
import HeaderTablePage from "../components/HeaderTablePage";
import LoadingTable from "../components/LoadingTable";
import EmptyTable from "../components/EmptyTable";
import Pagination from "../components/Pagination";
import { ERROR_401 } from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import {
    forceRound,
    formatSelectOption,
    getLowerCaseString,
    loadCss,
} from "../../helpers/function";
import { NUMBER_ELEMENT_PER_PAGE } from "../../constants/dataTable";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import { ToastBottomEnd } from "../components/Toast";
import { toastSuccessMessageWithParameterConfig } from "../../config/toastConfig";
import Select from "react-select";
import FileSaver from "file-saver";
import moment from "moment";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import InputRequire from "../components/InputRequire";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const ClaimReportingUemoaTen = (props) => {
    if (
        !(
            verifyPermission(
                props.userPermissions,
                "list-reporting-claim-any-institution"
            ) || verifyPermission(props.userPermissions, "bci-annual-reports")
        )
    )
        window.location.href = ERROR_401;

    const [load, setLoad] = useState(true);
    const [claims, setClaims] = useState({});
    const [total, setTotal] = useState({});
    const [numberPerPage, setNumberPerPage] = useState(10);
    const [activeNumberPage, setActiveNumberPage] = useState(1);
    const [numberPage, setNumberPage] = useState(0);
    const [showList, setShowList] = useState([]);
    const [year, setYear] = useState({
        value: moment().format("YYYY"),
        label: moment().format("YYYY"),
    }); const defaultData = { institution_targeted_id: "" };

    const [years, setYears] = useState([]);
    const [data, setData] = useState(defaultData);

    const [error, setError] = useState({
        year: [],
        institution_id: [],
    });

    const defaultError = {
        year: [],
        institution_id: [],
    };

    const [loadFilter, setLoadFilter] = useState(false);
    const [loadDownload, setLoadDownload] = useState(false);
    const [loadDownloadPdf, setLoadDownloadPdf] = useState(false);
    const [institution, setInstitution] = useState(null);
    const [institutions, setInstitutions] = useState([]);
    const [dataInstitution, setDataInstitution] = useState([]);

    const getResponseAxios = (data) => {
        axios
            .post(appConfig.apiDomaine + "/dashboard", data)
            .then((response) => {
                setDataInstitution(response.data.institutions);
                setLoad(false);
            })
            .catch((error) => console.log("Something is wrong"));
    };
    const fetchData = async (click = false) => {
        getResponseAxios()
        setLoadFilter(true);
        setLoad(true);
        let endpoint = "";
        let endpointYear = "";
        let sendData = {};
        if (
            verifyPermission(
                props.userPermissions,
                "list-reporting-claim-any-institution"
            )
        ) {
            if (props.plan === "MACRO")
                endpoint = `${appConfig.apiDomaine}/any/uemoa/state-analytique`;
            else endpoint = `${appConfig.apiDomaine}/bci-reports/global-condensed`;
            sendData = {
                year: year ? year.value : null,
                institution_id: institution ? institution.value : null,
            };
            if (props.plan === "HUB") {
            } else console.log("hub");
        } else if (verifyPermission(props.userPermissions, "bci-annual-reports")) {
            endpoint = `${appConfig.apiDomaine}/bci-reports/global-condensed`;
            endpointYear = `${appConfig.apiDomaine}/satis-years`;

            sendData = {
                year: year ? year.value : null,
            };
        }

        await axios
            .post(endpoint, sendData)
            .then((response) => {
                if (click)
                    ToastBottomEnd.fire(
                        toastSuccessMessageWithParameterConfig(
                            "Filtre effectué avec succès"
                        )
                    );

                let responseObject = new Map(Object.entries(response.data.reportData));
                setClaims(responseObject);
                setTotal(response.data.totalReport);

                setError(defaultError);
                setLoadFilter(false);
                setLoad(false);
            })
            .catch((error) => {
                console.log("erreur", error);
                setError({
                    ...defaultError,
                    ...error.response?.data?.reportData?.error,
                });
                setLoadFilter(false);
                setLoad(false);
            });

        await axios
            .get(endpointYear, sendData)
            .then((response) => {
                if (click)
                    ToastBottomEnd.fire(
                        toastSuccessMessageWithParameterConfig(
                            "Filtre effectué avec succès"
                        )
                    );

                setYears(response.data.years);
                setError(defaultError);
                setLoadFilter(false);
                setLoad(false);
            })
            .catch((error) => {
                //console.log("erreur", error)
                setError({
                    ...defaultError,
                    ...error.response?.data?.year?.error,
                });
                setLoadFilter(false);
                setLoad(false);
            });

    };

    useEffect(() => {
        if (verifyTokenExpire()) fetchData().then();
    }, [numberPerPage]);

    useEffect(() => {
        var endpoint = "";
        if (
            verifyPermission(
                props.userPermissions,
                "list-reporting-claim-any-institution"
            )
        ) {
            if (props.plan === "MACRO")
                endpoint = `${appConfig.apiDomaine}/any/uemoa/data-filter`;
            else endpoint = `${appConfig.apiDomaine}/without/uemoa/data-filter`;
        }

        if (verifyPermission(props.userPermissions, "bci-annual-reports"))
            endpoint = `${appConfig.apiDomaine}/my/uemoa/data-filter`;

        if (verifyTokenExpire()) {
            axios
                .get(endpoint)
                .then((response) => {
                    setInstitutions(
                        formatSelectOption(response.data.agences, "name", false)
                    );
                })
                .catch((error) => {
                    console.log("Something is wrong");
                });
        }
    }, []);

    const onChangeYear = (selected) => {
        setYear(selected ?? []);
    };
    const onChangeInstitution = (selected) => {
        const newData = { ...data };
        setLoad(true);

        if (selected) {
            newData.institution_targeted_id = selected.value;
            setInstitution(selected);
            fetchData(newData);
        } else {
            newData.institution_targeted_id = "";
            setInstitution(null);
            fetchData();
        }
        setData(newData);
    };


    const filterReporting = () => {
        setLoadFilter(true);
        setLoad(true);
        if (verifyTokenExpire()) fetchData(true);
    };

    //const pages = arrayNumberPage();

    const returnSizeByMonth = (claimMap) => {
        var size = 0;
        Array.from(claimMap.keys()).map(function (key1, index1) {
            var claimMap1 = new Map(Object.entries(claimMap.get(key1)));
            size = size + claimMap1.size;
        });
        //console.log("return size",size)
        return size;
    };

    const printBodyTable = (claim, key, index) => {
        const claimMap = new Map(Object.entries(claim));
        return Array.from(claimMap.keys()).map(function (key1, index1) {
            return (
                <React.Fragment key={key + key1 + "Fragment"}>
                    {/*{ index !== 0 && index1 === 0 ? ( <tr style={{backgroundColor:"pink"}}>
                        <td colSpan={6}></td>
                    </tr> ) : null }*/}

                    <tr role="row" className="odd">
                        {index1 === 0 && index === 0 ? (
                            <td
                                style={{ textAlign: "center", fontWeight: "bold" }}
                                rowSpan={returnSizeByMonth(claims)}
                            >
                                Vision globale réclamation{" "}
                            </td>
                        ) : null}

                        {index1 === 0 ? (
                            <td
                                style={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    color: "white",
                                    backgroundColor: "#fc9921",
                                }}
                                rowSpan={claimMap.size - 1}
                            >
                                {key && key !== "" ? key : "0"}
                            </td>
                        ) : null}

                        {key1 !== "total" ? (
                            <td style={{ textAlign: "center", fontWeight: "bold" }}>
                                {key1 && key1 !== "" ? key1 : "0"}
                            </td>
                        ) : (
                            <td
                                colSpan={2}
                                style={{
                                    backgroundColor: "#e6e6e6",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                }}
                            >
                                Total
                            </td>
                        )}

                        <td>
                            {(claimMap.get(key1).initialStock ||
                                claimMap.get(key1).totalInitialStock) ??
                                "0"}
                        </td>
                        <td>{claimMap.get(key1).totalReceived ?? "0"}</td>
                        <td>{claimMap.get(key1).totalTreated ?? "0"}</td>
                        <td>{claimMap.get(key1).totalRemaining ?? "0"}</td>
                        <td>{claimMap.get(key1).totalTreatedOutRegulatoryDelay ?? "0"}</td>
                        <td>
                            {claimMap.get(key1).totalRemainingOutRegulatoryDelay ?? "0"}
                        </td>
                    </tr>
                </React.Fragment>
            );
        });
    };

    const downloadReportingPdf = () => {
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        let doc = document.cloneNode(true);
        let tablePdf = doc.getElementById("myTable").outerHTML;
        let val = htmlToPdfmake(tablePdf, { tableAutoSize: true });
        let dd = { content: val };
        pdfMake.createPdf(dd).download();
    };

    return verifyPermission(
        props.userPermissions,
        "list-reporting-claim-any-institution"
    ) || verifyPermission(props.userPermissions, "bci-annual-reports") ? (
        <div
            className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
            id="kt_content"
        >
            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">Processus</h3>
                        <span className="kt-subheader__separator kt-hidden" />
                        <div className="kt-subheader__breadcrumbs">
                            <a href="#icone" className="kt-subheader__breadcrumbs-home">
                                <i className="flaticon2-shelter" />
                            </a>
                            <span className="kt-subheader__breadcrumbs-separator" />
                            <a
                                href="#button"
                                onClick={(e) => e.preventDefault()}
                                className="kt-subheader__breadcrumbs-link"
                                style={{ cursor: "text" }}
                            >
                                Statistique Globale Annuelle par catégorie et objet de plainte
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                <InfirmationTable
                    information={
                        <div>
                            Rapport des Statistiques Globales Annuelles par catégorie et objet
                            de plainte .
                        </div>
                    }
                />

                <div className="kt-portlet">
                    <HeaderTablePage title={"Rapport Statistique Globale Annuelle"} />

                    <div className="kt-portlet__body">
                        <div className="row">
                            {verifyPermission(
                                props.userPermissions,
                                "list-reporting-claim-any-institution"
                            ) ? (
                                <div className="col">
                                    <div
                                        className={
                                            error.institution_id.length
                                                ? "form-group validated"
                                                : "form-group"
                                        }
                                    >
                                        <label htmlFor="">Institution</label>
                                        <Select
                                            isClearable
                                            value={institution}
                                            placeholder={"Veuillez sélectionner l'institution"}
                                            onChange={onChangeInstitution}
                                            options={institutions}
                                        />

                                        {error.institution_id.length
                                            ? error.institution_id.map((error, index) => (
                                                <div key={index} className="invalid-feedback">
                                                    {error}
                                                </div>
                                            ))
                                            : null}
                                    </div>
                                </div>
                            ) : null}

                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="">
                                        {" "}
                                        Année <InputRequire />
                                    </label>
                                    <Select
                                        isClearable
                                        value={year}
                                        placeholder={"Veuillez sélectionner l'année"}
                                        onChange={onChangeYear}
                                        options={years}
                                    />

                                    {error.year.length
                                        ? error.year.map((error, index) => (
                                            <div key={index} className="invalid-feedback">
                                                {error}
                                            </div>
                                        ))
                                        : null}
                                </div>
                            </div>

                            <div className="col-md-12">
                                <div className="form-group d-flex justify-content-end">
                                    <a
                                        className="d-none"
                                        href="#"
                                        id="downloadButton"
                                        download={true}
                                    >
                                        downloadButton
                                    </a>
                                    {loadFilter ? (
                                        <button
                                            className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                            type="button"
                                            disabled
                                        >
                                            Chargement...
                                        </button>
                                    ) : (
                                        <button
                                            onClick={filterReporting}
                                            className="btn btn-primary"
                                            disabled={loadDownload || loadDownloadPdf}
                                        >
                                            Filtrer le rapport
                                        </button>
                                    )}
                                    {loadDownload ? (
                                        <button
                                            className="btn btn-secondary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--dark ml-3"
                                            type="button"
                                            disabled
                                        >
                                            Chargement...
                                        </button>
                                    ) : (
                                        <ReactHTMLTableToExcel
                                            id="test-table-xls-button"
                                            className="btn btn-secondary ml-3"
                                            table="myExcel"
                                            filename="rapport_statistique_globale_annuelle"
                                            sheet="statistique-globale-annuelle"
                                            buttonText="EXCEL"
                                        />
                                    )}

                                    {loadDownloadPdf ? (
                                        <button
                                            className="btn btn-secondary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--dark ml-3"
                                            type="button"
                                            disabled
                                        >
                                            Chargement...
                                        </button>
                                    ) : (
                                        <button
                                            onClick={downloadReportingPdf}
                                            className="btn btn-secondary ml-3"
                                            disabled={loadFilter || loadDownload}
                                        >
                                            PDF
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {load ? (
                        <LoadingTable />
                    ) : (
                        <div className="kt-portlet__body">
                            <div
                                id="kt_table_1_wrapper"
                                className="dataTables_wrapper dt-bootstrap4"
                            >
                                <div
                                    className="row"
                                    style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        display: "flex",
                                    }}
                                >
                                    <div className="col-sm-12" id="myTable">
                                        <table
                                            className="mb-4 table table-striped table-bordered table-hover table-checkable dataTable dtr-inline"
                                            role="grid"
                                            aria-describedby="kt_table_1_info"
                                            cellSpacing={"2"}
                                            cellPadding={"2"}
                                            width={"100%"}
                                            style={{
                                                width: "952px",
                                                display: "none",
                                                marginBottom: "20px",
                                            }}
                                        >
                                            <thead>
                                                <tr
                                                    className={"text-center"}
                                                    style={{ padding: "15px" }}
                                                    role={"row"}
                                                >
                                                    <th
                                                        style={{
                                                            backgroundColor: "#8c8c8c",
                                                            width: "85%",
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            color: "black",
                                                        }}
                                                    >
                                                        STATISTIQUE GLOBALE ANNUELLE PAR CATÉGORIE ET PAR
                                                        OBJET
                                                    </th>
                                                    <th style={{ width: "15%", textAlign: "right" }}>
                                                        <u>
                                                            <b>{year ? year.value : "-"}</b>
                                                        </u>
                                                    </th>
                                                </tr>
                                            </thead>
                                        </table>

                                        <table
                                            id="myExcel"
                                            className="table table-striped table-bordered table-hover table-checkable dataTable dtr-inline"
                                            role="grid"
                                            aria-describedby="kt_table_1_info"
                                            style={{ width: "952px" }}
                                        >
                                            <thead>
                                                {/*                                                    <tr style={{padding: "0",margin:"0",color:"black"}} role={"row"}>

                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            style={{backgroundColor: "#cccccc",}}
                                                            aria-label="Country: activate to sort column ascending"
                                                            rowSpan={2}
                                                        >

                                                        </th>
                                                        <th className="sorting d-flex align-items-center" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            style={{backgroundColor: "#cccccc",color:"black"}}
                                                            aria-label="Country: activate to sort column ascending"
                                                            rowSpan={2}
                                                        >
                                                            Catégories de la réclamation
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            style={{backgroundColor: "#cccccc",color:"black"}}
                                                            aria-label="Country: activate to sort column ascending"
                                                            rowSpan={2}
                                                        >
                                                            Objets de la réclamation
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            style={{backgroundColor: "#cccccc",color:"black"}}
                                                            aria-label="Country: activate to sort column ascending"
                                                            rowSpan={2}
                                                        >
                                                            Stock initial
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            style={{backgroundColor: "#cccccc",color:"black"}}
                                                            aria-label="Country: activate to sort column ascending"
                                                            rowSpan={2}
                                                        >
                                                            Entrées
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            style={{backgroundColor: "#cccccc",color:"black"}}
                                                            aria-label="Country: activate to sort column ascending"
                                                            rowSpan={2}
                                                        >
                                                            Sorties
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            style={{backgroundColor: "#cccccc",color:"black"}}
                                                            aria-label="Country: activate to sort column ascending"
                                                            rowSpan={2}
                                                        >
                                                            Stock restant
                                                        </th>
                                                        <th className="sorting" tabIndex="0"
                                                            aria-controls="kt_table_1"
                                                            style={{backgroundColor: "#cccccc",padding: "0",color:"black"}}
                                                            aria-label="Country: activate to sort column ascending"
                                                            colSpan={2}
                                                        >
                                                            Stock réclamation en retard
                                                        </th>

                                                    </tr>
                                                    <tr>
                                                        <th
                                                            className="sorting"
                                                            aria-controls="kt_table_1"
                                                            style={{backgroundColor: "#cccccc",color:"black"}}
                                                            aria-label="Country: activate to sort column ascending"
                                                        >
                                                            Restant
                                                        </th>
                                                        <th
                                                            className="sorting"
                                                            aria-controls="kt_table_1"
                                                            style={{backgroundColor: "#cccccc",color:"black"}}
                                                            aria-label="Country: activate to sort column ascending"
                                                        >
                                                            Restant
                                                        </th>
                                                    </tr>*/}
                                                <tr
                                                    style={{ padding: "0", margin: "0", color: "black" }}
                                                    className="tableHeader"
                                                    role={"row"}
                                                >
                                                    <th
                                                        className="sorting"
                                                        tabIndex="0"
                                                        aria-controls="kt_table_1"
                                                        style={{ backgroundColor: "#cccccc" }}
                                                        aria-label="Country: activate to sort column ascending"
                                                        rowSpan={2}
                                                    ></th>
                                                    <th
                                                        className="sorting align-items-center"
                                                        tabIndex="0"
                                                        aria-controls="kt_table_1"
                                                        style={{
                                                            backgroundColor: "#cccccc",
                                                            color: "black",
                                                        }}
                                                        aria-label="Country: activate to sort column ascending"
                                                        rowSpan={2}
                                                    >
                                                        Catégories de la réclamation
                                                    </th>
                                                    <th
                                                        className="sorting"
                                                        tabIndex="0"
                                                        aria-controls="kt_table_1"
                                                        style={{
                                                            backgroundColor: "#cccccc",
                                                            color: "black",
                                                        }}
                                                        aria-label="Country: activate to sort column ascending"
                                                        rowSpan={2}
                                                    >
                                                        Objets de la réclamation
                                                    </th>
                                                    <th
                                                        className="sorting"
                                                        tabIndex="0"
                                                        aria-controls="kt_table_1"
                                                        style={{
                                                            backgroundColor: "#cccccc",
                                                            color: "black",
                                                        }}
                                                        aria-label="Country: activate to sort column ascending"
                                                        rowSpan={2}
                                                    >
                                                        Stock initial
                                                    </th>
                                                    <th
                                                        className="sorting"
                                                        tabIndex="0"
                                                        aria-controls="kt_table_1"
                                                        style={{
                                                            backgroundColor: "#cccccc",
                                                            color: "black",
                                                        }}
                                                        aria-label="Country: activate to sort column ascending"
                                                        rowSpan={2}
                                                    >
                                                        Sorties
                                                    </th>
                                                    <th
                                                        className="sorting"
                                                        tabIndex="0"
                                                        aria-controls="kt_table_1"
                                                        style={{
                                                            backgroundColor: "#cccccc",
                                                            color: "black",
                                                        }}
                                                        aria-label="Country: activate to sort column ascending"
                                                        rowSpan={2}
                                                    >
                                                        Sorties
                                                    </th>
                                                    <th
                                                        className="sorting"
                                                        tabIndex="0"
                                                        aria-controls="kt_table_1"
                                                        style={{
                                                            backgroundColor: "#cccccc",
                                                            color: "black",
                                                        }}
                                                        aria-label="Country: activate to sort column ascending"
                                                        rowSpan={2}
                                                    >
                                                        Stock restant
                                                    </th>
                                                    <th
                                                        className="sorting"
                                                        tabIndex="0"
                                                        aria-controls="kt_table_1"
                                                        style={{
                                                            backgroundColor: "#cccccc",
                                                            color: "black",
                                                        }}
                                                        aria-label="Country: activate to sort column ascending"
                                                        colSpan={2}
                                                    >
                                                        Stock réclamation règlementaire
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th
                                                        className="sorting"
                                                        aria-controls="kt_table_1"
                                                        style={{
                                                            backgroundColor: "#fc9921",
                                                            color: "white",
                                                        }}
                                                        aria-label="Country: activate to sort column ascending"
                                                    >
                                                        Sortie
                                                    </th>
                                                    <th
                                                        className="sorting"
                                                        aria-controls="kt_table_1"
                                                        style={{
                                                            backgroundColor: "#fc9921",
                                                            color: "white",
                                                        }}
                                                        aria-label="Country: activate to sort column ascending"
                                                    >
                                                        Restant
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {claims?.size ? (
                                                    Array.from(claims.keys()).map(function (key, index) {
                                                        return printBodyTable(claims.get(key), key, index);
                                                    })
                                                ) : (
                                                    <EmptyTable />
                                                )}
                                            </tbody>

                                            <tfoot>
                                                <tr style={{ fontWeight: "bold" }}>
                                                    <th
                                                        style={{
                                                            textAlign: "center",
                                                            backgroundColor: "#cccccc",
                                                            fontWeight: "bold",
                                                            color: "black",
                                                        }}
                                                        colSpan={3}
                                                    >
                                                        TOTAL GLOBAL ANNUEL
                                                    </th>
                                                    <th
                                                        style={{
                                                            color: "black",
                                                            backgroundColor: "#cccccc",
                                                        }}
                                                    >
                                                        {"0"}
                                                    </th>
                                                    <th
                                                        style={{
                                                            color: "black",
                                                            backgroundColor: "#cccccc",
                                                        }}
                                                    >
                                                        {total.totalReceived ?? "0"}
                                                    </th>
                                                    <th
                                                        style={{
                                                            color: "black",
                                                            backgroundColor: "#cccccc",
                                                        }}
                                                    >
                                                        {total.totalTreated ?? "0"}
                                                    </th>
                                                    <th
                                                        style={{
                                                            color: "black",
                                                            backgroundColor: "#cccccc",
                                                        }}
                                                    >
                                                        {total.totalRemaining ?? "0"}
                                                    </th>
                                                    <th
                                                        style={{
                                                            color: "black",
                                                            backgroundColor: "#cccccc",
                                                        }}
                                                    >
                                                        {total.totalTreatedOutRegulatoryDelay ?? "0"}
                                                    </th>
                                                    <th
                                                        style={{
                                                            color: "black",
                                                            backgroundColor: "#cccccc",
                                                        }}
                                                    >
                                                        {total.totalRemainingOutRegulatoryDelay ?? "0"}
                                                    </th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : null;
};

const mapStateToProps = (state) => {
    return {
        plan: state.plan.plan,
        userPermissions: state.user.user.permissions,
        activePilot: state.user.user.staff.is_active_pilot,
    };
};

export default connect(mapStateToProps)(ClaimReportingUemoaTen);
