import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import InfirmationTable from "../components/InfirmationTable";
import HeaderTablePage from "../components/HeaderTablePage";
import {
  formatSelectOption,
  loadCss,
  loadScript,
} from "../../helpers/function";
import Select from "react-select";
import axios from "axios";
import { ToastBottomEnd } from "../components/Toast";
import {
  toastInvalidPeriodMessageConfig,
  toastValidPeriodMessageConfig,
} from "../../config/toastConfig";
import { verifyPermission } from "../../helpers/permission";
import { ERROR_401 } from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import ColToComplete from "../components/kanban/ColToComplete";
import ColToAssignUnit from "../components/kanban/ColToAssignUnit";
import ColToAssignStaff from "../components/kanban/ColToAssignStaff";
import ColToTreat from "../components/kanban/ColToTreat";
import ColToValidate from "../components/kanban/ColToValidate";
import ColToMeasure from "../components/kanban/ColToMeasure";
import DetailModal from "../components/kanban/DetailModal";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import RelaunchModal from "../components/RelaunchModal";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Loader from "../components/Loader";

loadCss("/assets/plugins/custom/kanban/kanban.bundle.css");

loadCss("/assets/css/pages/wizard/wizard-2.css");
loadScript("/assets/js/pages/custom/wizard/wizard-2.js");
loadScript("/assets/js/pages/custom/chat/chat.js");

let activepilotsTofilter = [];
const ClaimMonitoring = (props) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  document.title = "Satis client - " + ready ? t("Suivi") : "";
  if (
    !(
      verifyPermission(
        props.userPermissions,
        "list-monitoring-claim-any-institution"
      ) ||
      verifyPermission(
        props.userPermissions,
        "list-monitoring-claim-my-institution"
      )
    )
  )
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
  const [Drived, setDrived] = useState(false);

  const [institution, setInstitution] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  const [unit, setUnit] = useState(null);
  const [units, setUnits] = useState([]);
  const [staff, setStaff] = useState(null);
  const [typeClient, setTypeClient] = useState(null);
  const [staffs, setStaffs] = useState([]);
  const [ActivePilot, setActivePilot] = useState(null);
  const [ActivePilots, setActivePilots] = useState([]);
  const [Collector, setCollector] = useState(false);
  const [Collectors, setCollectors] = useState([]);
  const [object, setObject] = useState(null);
  const [objects, setObjects] = useState([]);

  const [filterUnits, setFilterUnits] = useState([]);
  const [filterStaffs, setFilterStaffs] = useState([]);
  const [filterTypeClient, setFilterTypeClient] = useState([
    { value: "Physique", label: "Personne Physique" },
    { value: "Moral", label: "Personne Morale" },
  ]);
  const [filterObjects, setFilterObjects] = useState([]);
  const [filterTimeLimit, setFilterTimeLimit] = useState("all");

  const [startDate, setStartDate] = useState(
    moment()
      .startOf("month")
      .format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  const [claimSelected, setClaimSelected] = useState(null);

  const [relaunchId, setRelaunchId] = useState("");

  const [isLoad, setIsLoad] = useState(true);

  useEffect(() => {
    if (!props.lead) {
      setActivePilot({
        value: props?.staff,
      });
    }
    async function fetchData() {
      setIsLoad(true);
      let endpoint = "";
      if (props.plan === "MACRO") {
        if (
          verifyPermission(
            props.userPermissions,
            "list-monitoring-claim-any-institution"
          )
        )
          endpoint = `${appConfig.apiDomaine}/any/monitoring-claim`;
        else if (
          verifyPermission(
            props.userPermissions,
            "list-monitoring-claim-my-institution"
          )
        )
          endpoint = `${appConfig.apiDomaine}/my/monitoring-claim`;
      } else if (props.plan === "HUB")
        endpoint = `${appConfig.apiDomaine}/any/monitoring-claim`;
      else if (props.plan === "PRO")
        endpoint = `${appConfig.apiDomaine}/my/monitoring-claim`;

      await axios
        .get(endpoint)
        .then(async (response) => {
          //console.log("plainte recupérée", response.data)
          setClaimsToComplete(response.data.incompletes);
          setClaimsToAssignUnit(response.data.toAssignementToUnit);
          setClaimsToAssignStaff(response.data.toAssignementToStaff);
          setClaimsToTreat(response.data.awaitingTreatment);
          setClaimsToValidate(response.data.toValidate);
          setClaimsToMeasure(response.data.toMeasureSatisfaction);
          if (
            verifyPermission(
              props.userPermissions,
              "list-monitoring-claim-any-institution"
            )
          )
            setInstitutions(
              formatSelectOption(response.data.institutions, "name", false)
            );
          setCategories(
            formatSelectOption(response.data.claimCategories, "name", "fr")
          );

          setFilterUnits(formatSelectOption(response.data.units, "name", "fr"));
          setUnits(response.data.units);
          setStaffs(response.data.staffs);
          setObjects(response.data.claimObjects);
          activepilotsTofilter = response.data?.activePilots.map((item) => ({
            label: `${item?.staff?.identite?.firstname} ${item?.staff?.identite?.lastname}`,
            value: item?.staff?.id,
            institution_id: item.institution_id,
          }));
          setActivePilots(activepilotsTofilter);
          setCollectors(
            response.data?.collectors.map((item) => ({
              label: `${item?.identite?.firstname} ${item?.identite?.lastname}`,
              value: item?.identite_id,
            }))
          );
          await axios
            .get(`${appConfig.apiDomaine}/configuration-active-pilot`)
            .then((res) => {
              setDrived(Boolean(res.data.configuration.many_active_pilot * 1));
            })
            .catch((e) => console.log("error", e));
        })
        .catch((error) => {})
        .finally(() => setIsLoad(false));
    }
    if (verifyTokenExpire()) fetchData();
  }, [props.plan, props.userPermissions]);

  const formatFilterStaff = (staff) => {
    const newFilterStaffs = [];
    for (let i = 0; i < staff.length; i++) {
      newFilterStaffs.push({
        value: staff[i].id,
        label: `${
          staff[i].identite
            ? staff[i].identite.lastname + " " + staff[i].identite.firstname
            : null
        }`,
      });
    }
    return newFilterStaffs;
  };

  const filterUnitsByInstitution = (institutionSelected) => {
    setFilterUnits(
      formatSelectOption(
        units.filter(
          (unit) => unit.institution_id === institutionSelected.value
        ),
        "name",
        "fr"
      )
    );
  };

  const filterStaffsByUnit = (unitSelected) => {
    setFilterStaffs(
      formatFilterStaff(
        staffs.filter((staff) => staff.unit_id === unitSelected.value)
      )
    );
  };

  const filterObjectsByCategory = (categorySelected) => {
    setFilterObjects(
      formatSelectOption(
        objects.filter(
          (object) => object.claim_category_id === categorySelected.value
        ),
        "name",
        "fr"
      )
    );
  };

  const onChangeInstitution = (selected) => {
    setFilterUnits([]);
    setUnit(null);
    setFilterStaffs([]);
    setStaff(null);
    if (selected) {
      filterUnitsByInstitution(selected);
      filterPilotsByInstitution(selected);
    }
    setInstitution(selected);
    // setActivePilots(
    //   response.data?.activePilots.map((item) => ({
    //     label: `${item?.staff?.identite?.firstname} ${item?.staff?.identite?.lastname}`,
    //     value: item?.staff?.id,
    //   }))
    // );
  };
  const filterPilotsByInstitution = (institutionSelected) => {
    let newpilos = activepilotsTofilter.filter((pil) => {
      return pil.institution_id === institutionSelected.value;
    });
    setActivePilots(newpilos);

    // setFilterUnits(
    //   formatSelectOption(
    //     units.filter(
    //       (unit) => unit.institution_id === institutionSelected.value
    //     ),
    //     "name",
    //     "fr"
    //   )
    // );
  };

  const onChangeUnit = (selected) => {
    setFilterStaffs([]);
    setStaff(null);
    if (selected) filterStaffsByUnit(selected);
    setUnit(selected);
  };

  const onChangeCategory = (selected) => {
    console.log(" first ", selected);
    setFilterObjects([]);
    setObject(null);
    if (selected) filterObjectsByCategory(selected);
    setCategory(selected);
  };

  const onChangeToComplete = (e) => {
    setToComplete(e.target.checked);
  };

  const onChangeToAssignUnit = (e) => {
    setToAssignUnit(e.target.checked);
  };

  const onChangeToAssignStaff = (e) => {
    setToAssignStaff(e.target.checked);
  };

  const onChangeToTreat = (e) => {
    setToTreat(e.target.checked);
  };

  const onChangeToValidate = (e) => {
    setToValidate(e.target.checked);
  };

  const onChangeToMeasure = (e) => {
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
    setStaff(selected);
  };
  const onChangeTypeClient = (selected) => {
    setTypeClient(selected);
  };

  const onChangeActivePilot = (selected) => {
    setActivePilot(selected);
  };

  const onChangeObject = (selected) => {
    setObject(selected);
  };

  const onChangeStartDate = (e) => {
    if (endDate && e.target.value) {
      if (!(new Date(endDate) >= new Date(e.target.value)))
        ToastBottomEnd.fire(toastInvalidPeriodMessageConfig());
      else ToastBottomEnd.fire(toastValidPeriodMessageConfig());
    }
    setStartDate(e.target.value);
  };

  const onChangeEndDate = (e) => {
    if (startDate && e.target.value) {
      if (!(new Date(startDate) <= new Date(e.target.value)))
        ToastBottomEnd.fire(toastInvalidPeriodMessageConfig());
      else ToastBottomEnd.fire(toastValidPeriodMessageConfig());
    }
    setEndDate(e.target.value);
  };

  const showClaimDetail = async (claim, status) => {
    claim.myStatus = status ? status : "";
    await setClaimSelected(claim);
    document.getElementById("detailClaimButton").click();
  };

  const showModal = async (id) => {
    await setRelaunchId(id);
    document.getElementById("relaunch").click();
  };

  const handleTimeLimitChange = (e) => {
    setFilterTimeLimit(e.target.value);
  };

  return ready ? (
    verifyPermission(
      props.userPermissions,
      "list-monitoring-claim-any-institution"
    ) ||
    verifyPermission(
      props.userPermissions,
      "list-monitoring-claim-my-institution"
    ) ? (
      <div
        className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
        id="kt_content"
      >
        <div className="kt-subheader   kt-grid__item" id="kt_subheader">
          <div className="kt-container  kt-container--fluid ">
            <div className="kt-subheader__main">
              <h3 className="kt-subheader__title">{t("Suivi")}</h3>
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
                >
                  {t("Suivi des réclamations")}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
          <InfirmationTable
            information={t(
              "Cette interface permet d'effectuer le suivi de vos réclamations"
            )}
          />

          <div className="kt-portlet">
            <HeaderTablePage title={t("Suivi des réclamations")} />

            <div className="kt-portlet__body">
              <div className="form-group row bg-light pb-3 pt-3 rounded">
                <div className="col">
                  <label style={{ fontSize: "1.8rem" }}>
                    {t("Filtre statuts")}
                  </label>
                  <div className="kt-checkbox-inline">
                    <label className="kt-checkbox">
                      <input
                        type="checkbox"
                        checked={toComplete}
                        disabled={isLoad}
                        onChange={(e) => onChangeToComplete(e)}
                      />{" "}
                      {t("A complèter")}
                      <span />
                    </label>
                    <label className="kt-checkbox">
                      <input
                        type="checkbox"
                        checked={toAssignUnit}
                        disabled={isLoad}
                        onChange={(e) => onChangeToAssignUnit(e)}
                      />{" "}
                      {t("A affecter à une unité")}
                      <span />
                    </label>
                    <label className="kt-checkbox">
                      <input
                        type="checkbox"
                        checked={toAssignStaff}
                        disabled={isLoad}
                        onChange={(e) => onChangeToAssignStaff(e)}
                      />
                      {t("A affecter à un agent")}
                      <span />
                    </label>
                    <label className="kt-checkbox">
                      <input
                        type="checkbox"
                        checked={toTreat}
                        disabled={isLoad}
                        onChange={(e) => onChangeToTreat(e)}
                      />{" "}
                      {t("En cours")}
                      <span />
                    </label>
                    <label className="kt-checkbox">
                      <input
                        type="checkbox"
                        checked={toValidate}
                        disabled={isLoad}
                        onChange={(e) => onChangeToValidate(e)}
                      />{" "}
                      {t("A valider")}
                      <span />
                    </label>
                    <label className="kt-checkbox">
                      <input
                        type="checkbox"
                        checked={toMeasure}
                        disabled={isLoad}
                        onChange={(e) => onChangeToMeasure(e)}
                      />{" "}
                      {t("Satisfaction à mesurer")}
                      <span />
                    </label>
                    <label className="kt-checkbox">
                      <input
                        type="checkbox"
                        checked={
                          toComplete &&
                          toAssignUnit &&
                          toAssignStaff &&
                          toTreat &&
                          toValidate &&
                          toMeasure
                        }
                        disabled={isLoad}
                        onChange={(e) => onChangeAllChecked(e)}
                      />
                      {t("Tout filtrer")}
                      <span />
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group row bg-light pt-3 rounded">
                <div className="col">
                  <span
                    className="d-block mb-3"
                    style={{ fontSize: "1.8rem", fontWeight: "400" }}
                  >
                    {t("Autres filtres")}
                  </span>

                  <div
                    className="form-group row"
                    style={{ marginRight: "12px" }}
                  >
                    {verifyPermission(
                      props.userPermissions,
                      "list-monitoring-claim-any-institution"
                    ) ? (
                      <div className={"col"}>
                        <label htmlFor="institution">
                          {t("Institution concernée")}
                        </label>
                        <Select
                          placeholder={t("Veuillez sélectionner l'institution")}
                          isClearable
                          value={institution}
                          onChange={onChangeInstitution}
                          options={institutions}
                        />
                      </div>
                    ) : null}

                    <div className={"col"}>
                      <label htmlFor="unite">
                        {t("Unité en charge du traitement")}
                      </label>
                      <Select
                        isClearable
                        placeholder={t("Veuillez sélectionner l'unité")}
                        value={unit}
                        onChange={onChangeUnit}
                        isLoading={isLoad}
                        options={filterUnits}
                      />
                    </div>
                    {Drived && props.lead && (
                      <div className={"col"}>
                        <label htmlFor="staff">{t("Pilote(s) actif(s)")}</label>
                        <Select
                          isClearable
                          placeholder={t("Veuillez sélectionner l'agent")}
                          value={ActivePilot}
                          onChange={onChangeActivePilot}
                          isLoading={isLoad}
                          options={ActivePilots}
                        />
                      </div>
                    )}

                    <div className={"col"}>
                      <label htmlFor="staff">{t("Agent traitant")}</label>
                      <Select
                        isClearable
                        placeholder={t("Veuillez sélectionner l'agent")}
                        value={staff}
                        onChange={onChangeStaff}
                        isLoading={isLoad}
                        options={filterStaffs}
                      />
                    </div>
                    {/* Start Type Client */}
                    <div className={"col"}>
                      <label htmlFor="staff">{t("Type client")}</label>
                      <Select
                        isClearable
                        placeholder={t("Veuillez sélectionner le type client")}
                        value={typeClient}
                        onChange={onChangeTypeClient}
                        isLoading={isLoad}
                        options={filterTypeClient}
                      />
                    </div>
                    {/* End Type Client */}
                    {/* <div className={"col"}>
                      <label htmlFor="staff">{t("Collecteurs")}</label>
                      <Select
                        isClearable
                        placeholder={t("Veuillez sélectionner l'agent")}
                        value={Collector}
                        onChange={onChangeCollector}
                        isLoading={isLoad}
                        options={Collectors}
                      />
                    </div> */}
                  </div>

                  <div
                    className="form-group row"
                    style={{ marginRight: "12px" }}
                  >
                    <div className="col">
                      <label htmlFor="category">
                        {t("Catégorie de la réclamation traitée")}
                      </label>
                      <Select
                        value={category}
                        placeholder={t("Veuillez sélectionner la catégorie")}
                        isClearable
                        onChange={onChangeCategory}
                        isLoading={isLoad}
                        options={categories}
                      />
                    </div>

                    <div className="col">
                      <label htmlFor="object">
                        {t("Objet de la réclamation traitée")}
                      </label>
                      <Select
                        isClearable
                        value={object}
                        placeholder={t("Veuillez sélectionner l'objet")}
                        onChange={onChangeObject}
                        isLoading={isLoad}
                        options={filterObjects}
                      />
                    </div>

                    <div className="col">
                      <label htmlFor="expireDate">
                        {t("Délai de traitement")}
                      </label>
                      <select
                        name=""
                        id=""
                        className="form-control"
                        value={filterTimeLimit}
                        onChange={handleTimeLimitChange}
                      >
                        <option value="all">{t("Tout")}</option>
                        <option value="today">{t("Expire aujourd'hui")}</option>
                        <option value="timeout">{t("Délai dépassé")}</option>
                        <option value="notTimeout">
                          {t("Délai non dépassé")}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div
                    className="form-group row"
                    style={{ marginRight: "12px" }}
                  >
                    <div className="col-12">
                      <h4 className="">
                        {t("Période de reception de la réclamation")}
                      </h4>
                    </div>
                    <div className={"col"}>
                      <label htmlFor="startDate">{t("Date de début")}</label>
                      <input
                        type="date"
                        className="w-100 form-control"
                        value={startDate}
                        onChange={(e) => onChangeStartDate(e)}
                      />
                    </div>

                    <div className={"col"}>
                      <label htmlFor="endDate">{"Date de fin"}</label>
                      <input
                        type="date"
                        className="w-100 form-control"
                        value={endDate}
                        onChange={(e) => onChangeEndDate(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {isLoad ? (
                <div className="position-relative">
                  <Loader />
                </div>
              ) : (
                <div className="kanban-container" style={{ width: "1500px" }}>
                  {toComplete ? (
                    <ColToComplete
                      userPermissions={props.userPermissions}
                      onClick={showModal}
                      onShowDetail={(claim) =>
                        showClaimDetail(claim, "toComplete")
                      }
                      backgroundHeader="#CBD5E0"
                      colorHeader="#4A5568"
                      title={t("A completer")}
                      claims={claimsToComplete}
                      filterInstitution={institution}
                      filterCategory={category}
                      filterObject={object}
                      filterPilot={ActivePilot?.value}
                      filterCollector={Collector?.value}
                      typeClient={typeClient}
                      filterPeriod={
                        startDate && endDate
                          ? new Date(startDate) <= new Date(endDate)
                            ? {
                                start: new Date(startDate),
                                end: new Date(endDate),
                              }
                            : null
                          : null
                      }
                      filterTimeLimit={filterTimeLimit}
                    />
                  ) : null}

                  {toAssignUnit ? (
                    <ColToAssignUnit
                      userPermissions={props.userPermissions}
                      onShowDetail={(claim) =>
                        showClaimDetail(claim, "toAssignUnit")
                      }
                      backgroundHeader="#CBD5E0"
                      colorHeader="#4A5568"
                      title={t("A affecter à une unité")}
                      claims={claimsToAssignUnit}
                      onClick={showModal}
                      filterInstitution={institution}
                      filterCategory={category}
                      filterPilot={ActivePilot?.value}
                      filterCollector={Collector?.value}
                      typeClient={typeClient}
                      filterObject={object}
                      filterPeriod={
                        startDate && endDate
                          ? new Date(startDate) <= new Date(endDate)
                            ? {
                                start: new Date(startDate),
                                end: new Date(endDate),
                              }
                            : null
                          : null
                      }
                      filterTimeLimit={filterTimeLimit}
                    />
                  ) : null}

                  {toAssignStaff ? (
                    <ColToAssignStaff
                      onShowDetail={(claim) =>
                        showClaimDetail(claim, "toAssignStaff")
                      }
                      onClick={showModal}
                      plan={props.plan}
                      backgroundHeader="#CBD5E0"
                      colorHeader="#4A5568"
                      title={t("A affecter à un agent")}
                      claims={claimsToAssignStaff}
                      filterInstitution={institution}
                      filterUnit={unit}
                      filterCategory={category}
                      filterObject={object}
                      typeClient={typeClient}
                      filterPilot={ActivePilot?.value}
                      filterCollector={Collector?.value}
                      filterPeriod={
                        startDate && endDate
                          ? new Date(startDate) <= new Date(endDate)
                            ? {
                                start: new Date(startDate),
                                end: new Date(endDate),
                              }
                            : null
                          : null
                      }
                      filterTimeLimit={filterTimeLimit}
                    />
                  ) : null}

                  {toTreat ? (
                    <ColToTreat
                      onShowDetail={(claim) =>
                        showClaimDetail(claim, "toTreat")
                      }
                      onClick={showModal}
                      plan={props.plan}
                      backgroundHeader="#CBD5E0"
                      colorHeader="#4A5568"
                      title={t("En cours de traitement")}
                      claims={claimsToTreat}
                      filterInstitution={institution}
                      filterUnit={unit}
                      filterStaff={staff}
                      typeClient={typeClient}
                      filterCategory={category}
                      filterObject={object}
                      filterPilot={ActivePilot?.value}
                      filterCollector={Collector?.value}
                      filterPeriod={
                        startDate && endDate
                          ? new Date(startDate) <= new Date(endDate)
                            ? {
                                start: new Date(startDate),
                                end: new Date(endDate),
                              }
                            : null
                          : null
                      }
                      filterTimeLimit={filterTimeLimit}
                    />
                  ) : null}

                  {toValidate ? (
                    <ColToValidate
                      userPermissions={props.userPermissions}
                      onShowDetail={(claim) =>
                        showClaimDetail(claim, "toValidate")
                      }
                      onClick={showModal}
                      plan={props.plan}
                      backgroundHeader="#CBD5E0"
                      colorHeader="#4A5568"
                      title={t("A valider")}
                      claims={claimsToValidate}
                      filterInstitution={institution}
                      filterUnit={unit}
                      filterStaff={staff}
                      typeClient={typeClient}
                      filterCategory={category}
                      filterObject={object}
                      filterPilot={ActivePilot?.value}
                      filterCollector={Collector?.value}
                      filterPeriod={
                        startDate && endDate
                          ? new Date(startDate) <= new Date(endDate)
                            ? {
                                start: new Date(startDate),
                                end: new Date(endDate),
                              }
                            : null
                          : null
                      }
                      filterTimeLimit={filterTimeLimit}
                    />
                  ) : null}

                  {toMeasure ? (
                    <ColToMeasure
                      userPermissions={props.userPermissions}
                      onShowDetail={(claim) =>
                        showClaimDetail(claim, "toMeasure")
                      }
                      onClick={showModal}
                      backgroundHeader="#CBD5E0"
                      colorHeader="#4A5568"
                      title={t("A mesurer la satisfaction")}
                      claims={claimsToMeasure}
                      filterInstitution={institution}
                      filterUnit={unit}
                      filterStaff={staff}
                      typeClient={typeClient}
                      filterCategory={category}
                      filterPilot={ActivePilot?.value}
                      filterCollector={Collector?.value}
                      filterObject={object}
                      filterPeriod={
                        startDate && endDate
                          ? new Date(startDate) <= new Date(endDate)
                            ? {
                                start: new Date(startDate),
                                end: new Date(endDate),
                              }
                            : null
                          : null
                      }
                      filterTimeLimit={filterTimeLimit}
                    />
                  ) : null}

                  <button
                    style={{ display: "none" }}
                    id={"detailClaimButton"}
                    type="button"
                    className="btn btn-bold btn-label-brand btn-sm"
                    data-toggle="modal"
                    data-target="#kt_modal_4_2"
                  />
                  {claimSelected ? (
                    <DetailModal
                      claim={claimSelected}
                      lead={props.lead}
                      multiPilots={Drived}
                      onCloseModal={() => setClaimSelected(null)}
                    />
                  ) : null}
                  <button
                    style={{ display: "none" }}
                    id={"relaunch"}
                    type="button"
                    className="btn btn-bold btn-label-brand btn-sm"
                    data-toggle="modal"
                    data-target="#kt_modal_4"
                  />
                  <RelaunchModal
                    id={relaunchId}
                    onClose={() => setRelaunchId("")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ) : null
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    userPermissions: state.user.user.permissions,
    plan: state.plan.plan,
    lead: state?.user?.user?.staff?.is_pilot_lead || false,
    staff: state?.user?.user?.staff?.id || null,
  };
};

export default connect(mapStateToProps)(ClaimMonitoring);
