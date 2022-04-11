import {connect} from "react-redux";
import {useTranslation} from "react-i18next";
import {verifyPermission} from "../../helpers/permission";
import InfirmationTable from "../components/InfirmationTable";
import HeaderTablePage from "../components/HeaderTablePage";
import Select from "react-select";
import LoadingTable from "../components/LoadingTable";
import EmptyTable from "../components/EmptyTable";
import Pagination from "../components/Pagination";
import React, {useEffect, useState} from "react";
import moment from "moment"
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import {ERROR_401} from "../../config/errorPage";
import {loadCss} from "../../helpers/function";
import {verifyTokenExpire} from "../../middleware/verifyToken";
import appConfig from "../../config/appConfig";
import axios from "axios";

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const ClaimSystemUsageReport = (props) => {

    //usage of useTranslation i18n
    const {t, ready} = useTranslation();

    if (!(verifyPermission(props.userPermissions, 'list-reporting-claim-any-institution') || verifyPermission(props.userPermissions, 'list-reporting-claim-my-institution')))
        window.location.href = ERROR_401;

    const defaultError = {
        date_start: [],
        date_end: [],
        institution_targeted_id: [],
    };

    const [load, setLoad] = useState(false);
    const [loadFilter, setLoadFilter] = useState(false);
    const [loadDownload, setLoadDownload] = useState(false);

    const [data, setData] = useState([]);
    const [error, setError] = useState(defaultError);
    const [institution, setInstitution] = useState(null);
    const [institutions, setInstitutions] = useState([]);
    const [dateStart, setDateStart] = useState(moment().startOf('month').format('YYYY-MM-DD'));
    const [dateEnd, setDateEnd] = useState(moment().format('YYYY-MM-DD'));

    useEffect(() => {
        let endpoint = "";

        if (verifyPermission(props.userPermissions, 'list-reporting-claim-my-institution'))
            endpoint = `${appConfig.apiDomaine}/my/system-usage-rapport`;

        if (verifyTokenExpire()) {
            axios.post(endpoint)
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {

                })
        }

    }, []);


    const handleDateStartChange = e => {
        setDateStart(e.target.value);
    };

    const handleDateEndChange = e => {
        setDateEnd(e.target.value);
    };

    const downloadReportingPdf = () => {
        setLoadDownload(true);
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        let systemUsageTable = document.getElementById("system-usage-div");
        let htmlTable = htmlToPdfmake(systemUsageTable.innerHTML);
        let docDefinition = {
          content: htmlTable
        };
        pdfMake.createPdf(docDefinition).download("SystemUsageReport.pdf", function () {
            setLoadDownload(false);
        });
    }

    return (
        ready ? (
            verifyPermission(props.userPermissions, 'list-reporting-claim-any-institution') || verifyPermission(props.userPermissions, 'list-reporting-claim-my-institution') ? (
                <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                    <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                        <div className="kt-container  kt-container--fluid ">
                            <div className="kt-subheader__main">
                                <h3 className="kt-subheader__title">
                                    {t("Processus")}
                                </h3>
                                <span className="kt-subheader__separator kt-hidden"/>
                                <div className="kt-subheader__breadcrumbs">
                                    <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                        className="flaticon2-shelter"/></a>
                                    <span className="kt-subheader__breadcrumbs-separator"/>
                                    <a href="#button" onClick={e => e.preventDefault()}
                                       className="kt-subheader__breadcrumbs-link" style={{cursor: "text"}}>
                                        {t("Utilisation Système")}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                        <InfirmationTable information={(
                            <div>
                                {t("Utilisation du sytème sur une période donnée")}
                            </div>
                        )}/>

                        <div className="kt-portlet">
                            <HeaderTablePage
                                title={t("Rapport utilisation système")}
                            />

                            <div className="kt-portlet__body">

                                {
                                    props.plan !== "PRO" ? (
                                        <div className="row">
                                            {verifyPermission(props.userPermissions, 'list-reporting-claim-my-institution') ? (
                                                <div className="col-md-12">
                                                    <div
                                                        className={error.date_start.length ? "form-group validated" : "form-group"}>
                                                        <label htmlFor="">Institution</label>
                                                        <Select
                                                            isClearable
                                                            value={institution}
                                                            placeholder={t("Veuillez sélectionner l'institution")}
                                                            /*onChange={}*/
                                                            options={institutions}
                                                        />

                                                        {
                                                            error.date_end.length ? (
                                                                error.date_end.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    ) : null
                                }


                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="">{t("Date de début")}</label>
                                            <input type="date" onChange={handleDateStartChange}
                                                   className={error.date_start.length ? "form-control is-invalid" : "form-control"}
                                                   value={dateStart}/>

                                            {
                                                error.date_start.length ? (
                                                    error.date_start.map((error, index) => (
                                                        <div key={index} className="invalid-feedback">
                                                            {error}
                                                        </div>
                                                    ))
                                                ) : null
                                            }
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="">{t("Date de fin")}</label>
                                            <input type="date" onChange={handleDateEndChange}
                                                   className={error.date_end.length ? "form-control is-invalid" : "form-control"}
                                                   value={dateEnd}/>

                                            {
                                                error.date_end.length ? (
                                                    error.date_end.map((error, index) => (
                                                        <div key={index} className="invalid-feedback">
                                                            {error}
                                                        </div>
                                                    ))
                                                ) : null
                                            }
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group d-flex justify-content-end">
                                            <a className="d-none" href="#" id="downloadButton"
                                               download={true}>downloadButton</a>
                                            {loadFilter ? (
                                                <button
                                                    className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                                    type="button" disabled>
                                                    {t("Chargement...")}
                                                </button>
                                            ) : (
                                                <button /*onClick={}*/ className="btn btn-primary"
                                                        disabled={(loadDownload)}>{t("Filtrer le rapport")}</button>
                                            )}

                                            {loadDownload ? (
                                                <button
                                                    className="btn btn-secondary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--dark ml-3"
                                                    type="button" disabled>
                                                    {t("Chargement...")}
                                                </button>
                                            ) : (
                                                /*<button /!*onClick={}*!/ className="btn btn-secondary ml-3"
                                                        disabled={(loadFilter)}>EXCEL</button>*/
                                                <ReactHTMLTableToExcel
                                                    id="test-table-xls-button"
                                                    className="btn btn-secondary ml-3"
                                                    table="system-usage-table"
                                                    filename="SystemUsageReport"
                                                    sheet="system-usage-report"
                                                    buttonText="EXCEL"
                                                />

                                            )}

                                            {loadDownload ? (
                                                <button
                                                    className="btn btn-secondary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--dark ml-3"
                                                    type="button" disabled>
                                                    {t("Chargement...")}
                                                </button>
                                            ) : (
                                                <button onClick={downloadReportingPdf}
                                                        className="btn btn-secondary ml-3"
                                                        disabled={(loadDownload)}>PDF</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                load ? (
                                    <LoadingTable/>
                                ) : (
                                    <div className="kt-portlet__body">
                                        <div>
                                            <div className="row">
                                                <div className="col-sm-12" id="system-usage-div">
                                                    <table  id="system-usage-table" className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th className="text-center" rowSpan={2}>Titre</th>
                                                                <th className="text-center" colSpan={2}>Valeur</th>
                                                            </tr>
                                                            <tr>
                                                                <th>Satis</th>
                                                                <th>Dmd</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr>
                                                            <th scope="row">
                                                                Nombre de plaintes reçues sur la période
                                                            </th>
                                                            <td>Jhon</td>
                                                            <td>Jhon</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">
                                                                Nombre de plaintes traitées sur la période
                                                            </th>
                                                            <td>Lisa</td>
                                                            <td>Lisa</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">
                                                                Nombre de plaintes évaluées dans la période
                                                            </th>
                                                            <td>Larry</td>
                                                            <td>Larry</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">
                                                                Nombre de plaintes reçues sur la période par une institution
                                                            </th>
                                                            <td>Larry</td>
                                                            <td>Larry</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">
                                                                Nombre de plaintes traitées sur la période par une institution
                                                            </th>
                                                            <td>Larry</td>
                                                            <td>Larry</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">
                                                                Nombre de plaintes évaluées sur la période par une institution
                                                            </th>
                                                            <td>Larry</td>
                                                            <td>Larry</td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
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
}


const mapStateToProps = state => {
    return {
        plan: state.plan.plan,
        userPermissions: state.user.user.permissions,
        activePilot: state.user.user.staff.is_active_pilot
    };
};

export default connect(mapStateToProps)(ClaimSystemUsageReport);