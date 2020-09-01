import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import InfirmationTable from "../components/InfirmationTable";
import HeaderTablePage from "../components/HeaderTablePage";
import {formatSelectOption, loadCss, loadScript} from "../../helpers/function";
import Select from "react-select";
import {ToastBottomEnd} from "../components/Toast";
import {toastInvalidPeriodMessageConfig, toastValidPeriodMessageConfig} from "../../config/toastConfig";
import axios from "axios";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import ColToComplete from "../components/kanban/ColToComplete";
import ColToAssignUnit from "../components/kanban/ColToAssignUnit";
import ColToAssignStaff from "../components/kanban/ColToAssignStaff";
import ColToTreat from "../components/kanban/ColToTreat";
import ColToValidate from "../components/kanban/ColToValidate";
import ColToMeasure from "../components/kanban/ColToMeasure";
import DetailModal from "../components/kanban/DetailModal";

loadCss("/assets/plugins/custom/kanban/kanban.bundle.css");

loadCss("/assets/css/pages/wizard/wizard-2.css");
loadScript("/assets/js/pages/custom/wizard/wizard-2.js");
loadScript("/assets/js/pages/custom/chat/chat.js");


const ClaimMonitoring = (props) => {
    document.title = "Satis client - Monitoring";
    if (!(verifyPermission(props.userPermissions, 'list-monitoring-claim-any-institution') || verifyPermission(props.userPermissions, "list-monitoring-claim-my-institution")))
        window.location.href = ERROR_401;

    const [claimsToComplete, setClaimsToComplete] = useState([]);
    const [claimsToAssignUnit, setClaimsToAssignUnit] = useState([]);
    const [claimsToAssignStaff, setClaimsToAssignStaff] = useState([]);
    const [claimsToTreat, setClaimsToTreat] = useState([]);
    const [claimsToValidate, setClaimsToValidate] = useState([]);
    const [claimsToMeasure, setClaimsToMeasure] = useState([]);

    const [toComplete, setToComplete] = useState(false);
    const [toAssignUnit, setToAssignUnit] = useState(false);
    const [toAssignStaff, setToAssignStaff] = useState(false);
    const [toTreat, setToTreat] = useState(false);
    const [toValidate, setToValidate] = useState(false);
    const [toMeasure, setToMeasure] = useState(false);

    const [institution, setInstitution] = useState(null);
    const [institutions, setInstitutions] = useState([]);
    const [category, setCategory] = useState(null);
    const [categories, setCategories] = useState([]);

    const [unit, setUnit] = useState(null);
    const [units, setUnits] = useState([]);
    const [staff, setStaff] = useState(null);
    const [staffs, setStaffs] = useState([]);
    const [object, setObject] = useState(null);
    const [objects, setObjects] = useState([]);

    const [filterUnits, setFilterUnits] = useState([]);
    const [filterStaffs, setFilterStaffs] = useState([]);
    const [filterObjects, setFilterObjects] = useState([]);
    const [filterTimeLimit, setFilterTimeLimit] = useState("all");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [claimSelected, setClaimSelected] = useState(null);

    useEffect(() => {
        async function fetchData () {
            let endpoint = "";
            if (props.plan === "MACRO") {
                if (verifyPermission(props.userPermissions, "list-monitoring-claim-any-institution"))
                    endpoint = `${appConfig.apiDomaine}/any/monitoring-claim`;
                else if (verifyPermission(props.userPermissions, 'list-monitoring-claim-my-institution'))
                    endpoint = `${appConfig.apiDomaine}/my/monitoring-claim`;
            } else if(props.plan === "HUB")
                endpoint = `${appConfig.apiDomaine}/any/monitoring-claim`;
            else if(props.plan === "PRO")
                endpoint = `${appConfig.apiDomaine}/my/monitoring-claim`;

            await axios.get(endpoint)
                .then(response => {
                    setClaimsToComplete(response.data.incompletes);
                    setClaimsToAssignUnit(response.data.toAssignementToUnit);
                    setClaimsToAssignStaff(response.data.toAssignementToStaff);
                    setClaimsToTreat(response.data.awaitingTreatment);
                    setClaimsToValidate(response.data.toValidate);
                    setClaimsToMeasure(response.data.toMeasureSatisfaction);

                    setInstitutions(formatSelectOption(response.data.institutions, 'name', false));
                    setCategories(formatSelectOption(response.data.claimCategories, 'name', "fr"));

                    setUnits(response.data.units);
                    setStaffs(response.data.staffs);
                    setObjects(response.data.claimObjects);
                })
                .catch(error => {
                    console.log("Something is wrong");
                })
            ;
        }
        fetchData();
    }, [props.plan, props.userPermissions, appConfig.apiDomaine]);

    const formatFilterStaff = staff => {
        const newFilterStaffs = [];
        for (let i = 0; i < staff.length; i++) {
            newFilterStaffs.push(
                {
                    value: staff[i].id,
                    label: `${staff[i].identite ? staff[i].identite.lastname+" "+staff[i].identite.firstname : null}`,
                }
            );
        }
        return newFilterStaffs;
    };

    const filterUnitsByInstitution = institutionSelected => {
        setFilterUnits(
            formatSelectOption(
                units.filter(unit => unit.institution_id === institutionSelected.value),
                "name",
                "fr"
            )
        );
    };

    const filterStaffsByUnit = unitSelected => {
        setFilterStaffs(
            formatFilterStaff(staffs.filter(staff => staff.unit_id === unitSelected.value)))
        ;
    };

    const filterObjectsByCategory = categorySelected => {
        setFilterObjects(
            formatSelectOption(
                objects.filter(object => object.claim_category_id === categorySelected.value),
                "name",
                "fr"
            )
        )
    };

    const onChangeInstitution = (selected) => {
        setFilterUnits([]);
        setUnit(null);
        setFilterStaffs([]);
        setStaff(null);
        if (selected)
            filterUnitsByInstitution(selected);
        setInstitution(selected)
    };

    const onChangeUnit = (selected) => {
        setFilterStaffs([]);
        setStaff(null);
        if (selected)
            filterStaffsByUnit(selected);
        setUnit(selected)
    };

    const onChangeCategory = (selected) => {
        setFilterObjects([]);
        setObject(null);
        if (selected)
            filterObjectsByCategory(selected);
        setCategory(selected)
    };

    const onChangeToComplete = e => {
        setToComplete(e.target.checked);
    };

    const onChangeToAssignUnit = e => {
        setToAssignUnit(e.target.checked);
    };

    const onChangeToAssignStaff = e => {
        setToAssignStaff(e.target.checked);
    };

    const onChangeToTreat = e => {
        setToTreat(e.target.checked);
    };

    const onChangeToValidate = e => {
        setToValidate(e.target.checked);
    };

    const onChangeToMeasure = e => {

        setToMeasure(e.target.checked);
    };

    const onChangeAllChecked = (e) => {
        setToComplete(e.target.checked);
        setToAssignUnit(e.target.checked);
        setToAssignStaff(e.target.checked);
        setToTreat(e.target.checked);
        setToValidate(e.target.checked);
        setToMeasure(e.target.checked);
    };

    const onChangeStaff = (selected) => {
        setStaff(selected)
    };

    const onChangeObject = (selected) => {
        setObject(selected)
    };

    const onChangeStartDate = e => {
        if (endDate && e.target.value) {
            if (!(new Date(endDate) >= new Date(e.target.value)))
                ToastBottomEnd.fire(toastInvalidPeriodMessageConfig);
            else
                ToastBottomEnd.fire(toastValidPeriodMessageConfig);
        }
        setStartDate(e.target.value)
    };

    const onChangeEndDate = e => {
        if (startDate && e.target.value) {
            if (!(new Date(startDate) <= new Date(e.target.value)))
                ToastBottomEnd.fire(toastInvalidPeriodMessageConfig);
            else
                ToastBottomEnd.fire(toastValidPeriodMessageConfig);
        }
        setEndDate(e.target.value)
    };

    const showClaimDetail = async (claim, status) => {
        claim.myStatus = status;
        await setClaimSelected(claim);
        document.getElementById("detailClaimButton").click();
    };

    const handleTimeLimitChange = (e) => {
        setFilterTimeLimit(e.target.value);
    };

    return (
        verifyPermission(props.userPermissions, 'list-monitoring-claim-any-institution') || verifyPermission(props.userPermissions, "list-monitoring-claim-my-institution") ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Suivi
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link">
                                    Suivi des réclamations
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <InfirmationTable information={"Cette interface vous permet d'effectuer le suivi de vos réclamations"}/>

                    <div className="kt-portlet">
                        <HeaderTablePage
                            title={"Suivi des réclamations"}
                        />


                        <div className="kt-portlet__body">

                            <div className="form-group row bg-light pb-3 pt-3 rounded">
                                <div className="col">
                                    <label style={{fontSize: "1.5rem"}}>Filtre Status</label>
                                    <div className="kt-checkbox-inline">
                                        <label className="kt-checkbox">
                                            <input type="checkbox" checked={toComplete} onChange={e => onChangeToComplete(e)}/> A completer<span/>
                                        </label>
                                        <label className="kt-checkbox">
                                            <input type="checkbox" checked={toAssignUnit} onChange={e => onChangeToAssignUnit(e)}/> A Affecter unité<span/>
                                        </label>
                                        <label className="kt-checkbox">
                                            <input type="checkbox" checked={toAssignStaff} onChange={e => onChangeToAssignStaff(e)}/>A Affecter staff<span/>
                                        </label>
                                        <label className="kt-checkbox">
                                            <input type="checkbox" checked={toTreat} onChange={e => onChangeToTreat(e)}/> En cours<span/>
                                        </label>
                                        <label className="kt-checkbox">
                                            <input type="checkbox" checked={toValidate} onChange={e => onChangeToValidate(e)}/> A valider<span/>
                                        </label>
                                        <label className="kt-checkbox">
                                            <input type="checkbox" checked={toMeasure} onChange={e => onChangeToMeasure(e)}/> Mesurer satisfaction<span/>
                                        </label>
                                        <label className="kt-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={toComplete && toAssignUnit && toAssignStaff && toTreat && toValidate && toMeasure}
                                                onChange={e => onChangeAllChecked(e)}/>
                                            Tout filtrer
                                            <span/>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group row bg-light pt-3 rounded">
                                <div className="col">
                                    <span className="d-block mb-3" style={{fontSize: "1.5rem", fontWeight: "400"}}>Autres Filtres</span>

                                    <div className="form-group row" style={{marginRight: "12px"}}>
                                        <div className={"col"}>
                                            <label htmlFor="institution">Institution</label>
                                            <Select
                                                placeholder={"Veillez selectioner l'institution"}
                                                isClearable
                                                value={institution}
                                                onChange={onChangeInstitution}
                                                options={institutions}
                                            />
                                        </div>

                                        <div className={"col"}>
                                            <label htmlFor="unite">Unité</label>
                                            <Select
                                                isClearable
                                                placeholder={"Veillez selectioner l'unité"}
                                                value={unit}
                                                onChange={onChangeUnit}
                                                options={filterUnits}
                                            />
                                        </div>

                                        <div className={"col"}>
                                            <label htmlFor="staff">Agent</label>
                                            <Select
                                                isClearable
                                                placeholder={"Veillez selectioner l'agent"}
                                                value={staff}
                                                onChange={onChangeStaff}
                                                options={filterStaffs}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group row" style={{marginRight: "12px"}}>
                                        <div className="col">
                                            <label htmlFor="category">Catégorie</label>
                                            <Select
                                                value={category}
                                                placeholder={"Veillez selectioner la catégorie"}
                                                isClearable
                                                onChange={onChangeCategory}
                                                options={categories}
                                            />
                                        </div>

                                        <div className="col">
                                            <label htmlFor="object">Objet</label>
                                            <Select
                                                isClearable
                                                value={object}
                                                placeholder={"Veillez selectioner l'objet"}
                                                onChange={onChangeObject}
                                                options={filterObjects}
                                            />
                                        </div>

                                        <div class="col">
                                            <label htmlFor="expireDate">Délai</label>
                                            <select name="" id="" className="form-control" value={filterTimeLimit} onChange={handleTimeLimitChange}>
                                                <option value="all">Tout</option>
                                                <option value="today">Expire aujourd'hui</option>
                                                <option value="timeout">Délai dépassé</option>
                                                <option value="notTimeout">Délai non dépassé</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group row" style={{marginRight: "12px"}}>
                                        <div className={"col"}>
                                            <label htmlFor="startDate">Date début</label>
                                            <input type="date" className="w-100 form-control" value={startDate} onChange={e => onChangeStartDate(e)}/>
                                        </div>

                                        <div className={"col"}>
                                            <label htmlFor="endDate">Date fin</label>
                                            <input type="date" className="w-100 form-control" value={endDate} onChange={e => onChangeEndDate(e)}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="kanban-container" style={{ width: "1500px" }}>
                                {
                                    toComplete ? (
                                        <ColToComplete
                                            userPermissions={props.userPermissions}
                                            onShowDetail={claim => showClaimDetail(claim, "toComplete")}
                                            backgroundHeader="#CBD5E0"
                                            colorHeader="#4A5568"
                                            title="A completer"
                                            claims={claimsToComplete}
                                            filterInstitution={institution}
                                            filterCategory={category}
                                            filterObject={object}
                                            filterPeriod={(startDate && endDate)  ? (new Date(startDate) <= new Date(endDate)) ? {start: new Date(startDate), end: new Date(endDate)} : null : null}
                                            filterTimeLimit={filterTimeLimit}
                                        />
                                    ) : null
                                }

                                {
                                    toAssignUnit ? (
                                        <ColToAssignUnit
                                            userPermissions={props.userPermissions}
                                            onShowDetail={claim => showClaimDetail(claim, "toAssignUnit")}
                                            backgroundHeader="#CBD5E0"
                                            colorHeader="#4A5568"
                                            title="Affecter à une unité"
                                            claims={claimsToAssignUnit}
                                            filterInstitution={institution}
                                            filterCategory={category}
                                            filterObject={object}
                                            filterPeriod={(startDate && endDate)  ? (new Date(startDate) <= new Date(endDate)) ? {start: new Date(startDate), end: new Date(endDate)} : null : null}
                                            filterTimeLimit={filterTimeLimit}
                                        />
                                    ) : null
                                }

                                {
                                    toAssignStaff ? (
                                        <ColToAssignStaff
                                            onShowDetail={claim => showClaimDetail(claim, "toAssignStaff")}
                                            plan={props.plan}
                                            backgroundHeader="#CBD5E0"
                                            colorHeader="#4A5568"
                                            title="Affecter à un staff"
                                            claims={claimsToAssignStaff}
                                            filterInstitution={institution}
                                            filterUnit={unit}
                                            filterCategory={category}
                                            filterObject={object}
                                            filterPeriod={(startDate && endDate)  ? (new Date(startDate) <= new Date(endDate)) ? {start: new Date(startDate), end: new Date(endDate)} : null : null}
                                            filterTimeLimit={filterTimeLimit}
                                        />
                                    ) : null
                                }

                                {
                                    toTreat ? (
                                        <ColToTreat
                                            onShowDetail={claim => showClaimDetail(claim, "toTreat")}
                                            plan={props.plan}
                                            backgroundHeader="#CBD5E0"
                                            colorHeader="#4A5568"
                                            title="En cours de traitement"
                                            claims={claimsToTreat}
                                            filterInstitution={institution}
                                            filterUnit={unit}
                                            filterStaff={staff}
                                            filterCategory={category}
                                            filterObject={object}
                                            filterPeriod={(startDate && endDate)  ? (new Date(startDate) <= new Date(endDate)) ? {start: new Date(startDate), end: new Date(endDate)} : null : null}
                                            filterTimeLimit={filterTimeLimit}
                                        />
                                    ) : null
                                }

                                {
                                    toValidate ? (
                                        <ColToValidate
                                            userPermissions={props.userPermissions}
                                            onShowDetail={claim => showClaimDetail(claim, "toValidate")}
                                            plan={props.plan}
                                            backgroundHeader="#CBD5E0"
                                            colorHeader="#4A5568"
                                            title="A valider"
                                            claims={claimsToValidate}
                                            filterInstitution={institution}
                                            filterUnit={unit}
                                            filterStaff={staff}
                                            filterCategory={category}
                                            filterObject={object}
                                            filterPeriod={(startDate && endDate)  ? (new Date(startDate) <= new Date(endDate)) ? {start: new Date(startDate), end: new Date(endDate)} : null : null}
                                            filterTimeLimit={filterTimeLimit}
                                        />
                                    ) : null
                                }


                                {
                                    toMeasure ? (
                                        <ColToMeasure
                                            userPermissions={props.userPermissions}
                                            onShowDetail={claim => showClaimDetail(claim, "toMeasure")}
                                            backgroundHeader="#CBD5E0"
                                            colorHeader="#4A5568"
                                            title="A Mesurer la satisfaction"
                                            claims={claimsToMeasure}
                                            filterInstitution={institution}
                                            filterUnit={unit}
                                            filterStaff={staff}
                                            filterCategory={category}
                                            filterObject={object}
                                            filterPeriod={(startDate && endDate)  ? (new Date(startDate) <= new Date(endDate)) ? {start: new Date(startDate), end: new Date(endDate)} : null : null}
                                            filterTimeLimit={filterTimeLimit}
                                        />
                                    ) : null
                                }

                                <button style={{display: "none"}} id={"detailClaimButton"} type="button" className="btn btn-bold btn-label-brand btn-sm" data-toggle="modal" data-target="#kt_modal_4_2"/>
                                {
                                    claimSelected ? (
                                        <DetailModal
                                            claim={claimSelected}
                                            onCloseModal={() => setClaimSelected(null)}
                                        />
                                    ) : null
                                }
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

export default connect(mapStateToProps)(ClaimMonitoring);
