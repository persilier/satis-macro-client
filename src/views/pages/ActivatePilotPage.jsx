import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  toastAddErrorMessageConfig,
  toastAddSuccessMessageConfig,
} from "../../config/toastConfig";
import { ToastBottomEnd } from "../../views/components/Toast";
import Select from "react-select";
import { verifyPermission } from "../../helpers/permission";
import { ERROR_401 } from "../../config/errorPage";
import InputRequire from "../components/InputRequire";
import appConfig from "../../config/appConfig";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import { useTranslation } from "react-i18next";

const ActivatePilotPage = (props) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  document.title = "Satis client - " + ready ? t("Paramètre pilote actif") : "";

  if (!verifyPermission(props.userPermissions, "update-active-pilot"))
    window.location.href = ERROR_401;

  const [staffs, setStaffs] = useState([]);
  const [staff, setStaff] = useState(null);
  const [leadstaff, setleadstaffStaff] = useState(null);
  const [CurrentLead, setCurrentLead] = useState(null);
  const history = useHistory();

  const defaultError = {
    pilots: [],
    lead_pilot_id: [],
    is_multiple: false,
  };
  const [data, setData] = useState(defaultError);
  const [startRequest, setStartRequest] = useState(false);

  const formatListStaff = (list) => {
    const newList = [];
    list.map((l) =>
      newList.push({
        value: l.id,
        label: l.identite.lastname + " " + l.identite.firstname,
      })
    );
    return newList;
  };
  useEffect(() => {
    async function fetchData() {
      await axios
        .get(
          `${appConfig.apiDomaine}/active-pilot/institutions/${props.activeUserInstitution}`
        )
        .then(async (institutiondata) => {
          institutiondata = institutiondata.data;
          await axios
            .get(`${appConfig.apiDomaine}/configuration-active-pilot`)
            .then((activedata) => {
              activedata = activedata.data;
              const isMany =
                activedata?.configuration?.many_active_pilot === "1";
              setData({
                ...data,
                is_multiple: isMany,
              });

              setStaffs(formatListStaff(institutiondata));

              if (isMany) {
                const { lead_pilot, all_active_pilots } = activedata;
                setCurrentLead({
                  value: lead_pilot.id,
                  label:
                    lead_pilot.identite.lastname +
                    " " +
                    lead_pilot.identite.firstname,
                });
                setStaff(
                  all_active_pilots.map((el) => {
                    return {
                      value: el.staff.id,
                      label:
                        el.staff.identite.lastname +
                        " " +
                        el.staff.identite.firstname,
                    };
                  })
                );
                // for (let ai = 0; ai < institutiondata.length; ai++) {
                //   const el = institutiondata[ai];
                //   if (el.is_active_pilot) {
                //     activepilots.push({
                //       value: el.id,
                //       label: el.identite.lastname + " " + el.identite.firstname,
                //     });
                //   }
                // }
                // setStaff(activepilots);

                setleadstaffStaff({
                  value: lead_pilot.id,
                  label:
                    lead_pilot.identite.lastname +
                    " " +
                    lead_pilot.identite.firstname,
                });
              } else {
                institutiondata.map((el) => {
                  if (el.is_active_pilot) {
                    setStaff({
                      value: el.id,
                      label: el.identite.lastname + " " + el.identite.firstname,
                    });
                  }
                  return 1;
                });
              }
            })
            .catch((error) => {});
        })
        .catch((error) => {});
    }
    if (verifyTokenExpire()) fetchData();
  }, [props.userPermissions, props.activeUserInstitution]);

  useEffect(() => {
    setStaff(CurrentLead);
  }, [data.is_multiple]);
  const onSubmit = (e) => {
    e.preventDefault();
    let payload = {
      many_pilot: data.is_multiple ? 1 : 0,
    };
    if (data.is_multiple) {
      payload.pilots = (staff || []).map((m) => m.value);
      payload.lead_pilot_id = data.is_multiple ? leadstaff?.value : staff.value;
    } else {
      payload.lead_pilot_id = staff?.value;
    }
    setStartRequest(true);
    if (verifyTokenExpire()) {
      axios
        .post(`${appConfig.apiDomaine}/configuration-active-pilot`, payload)
        .then(async () => {
          setData({ ...data, pilots: [] });
          ToastBottomEnd.fire(toastAddSuccessMessageConfig());
          if (props.user.staff.is_active_pilot) {
            await axios
              .get(`${appConfig.apiDomaine}/login`)
              .then((response) => {
                setStartRequest(false);
                localStorage.setItem("userData", JSON.stringify(response.data));
                history.goBack();
              });
          } else setStartRequest(false);
        })
        .catch((errorRequest) => {
          setStartRequest(false);
          setData({ ...data, ...errorRequest.response.data.error });
          ToastBottomEnd.fire(toastAddErrorMessageConfig());
        });
    }
  };

  const handleStaffChange = (selected) => {
    setStaff(selected);
  };
  const handleLeadStaffChange = (selected) => {
    setleadstaffStaff(selected);
  };
  const handleCanBeTargetChange = (e) => {
    const newData = { ...data, is_multiple: e.target.checked };
    setData(newData);
    setStaff({});
    setleadstaffStaff({});
  };

  const printJsx = () => {
    return (
      <div
        className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor"
        id="kt_content"
      >
        <div className="kt-subheader   kt-grid__item" id="kt_subheader">
          <div className="kt-container  kt-container--fluid ">
            <div className="kt-subheader__main">
              <h3 className="kt-subheader__title">{t("Paramètres")}</h3>
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
                  {t("Pilote actif")}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
          <div className="row">
            <div className="col">
              <div className="kt-portlet">
                <div className="kt-portlet__head">
                  <div className="kt-portlet__head-label">
                    <h3 className="kt-portlet__head-title">
                      {t("Pilote actif")}
                    </h3>
                  </div>
                </div>

                <form method="POST" className="kt-form">
                  <div className="kt-form kt-form--label-right">
                    <div className="kt-portlet__body">
                      <div className={"form-group row"}>
                        <label
                          className="col-xl-3 col-lg-3 col-form-label"
                          htmlFor="manyPilot"
                        >
                          {t(" Plusieurs Pilotes")}
                        </label>
                        <div className="col-lg-9 col-xl-6">
                          <div className="kt-checkbox-inline">
                            <label
                              className="kt-checkbox"
                              style={{ height: 10 }}
                            >
                              <input
                                name="manyPilot"
                                type="checkbox"
                                checked={data.is_multiple}
                                onChange={handleCanBeTargetChange}
                                style={{ height: 10 }}
                              />
                              <span />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          data.pilots.length
                            ? "form-group row validated"
                            : "form-group row"
                        }
                      >
                        <label
                          className="col-xl-3 col-lg-3 col-form-label"
                          htmlFor="unit_type"
                        >
                          {t(
                            data.is_multiple
                              ? "Veillez choisir les pilotes actifs"
                              : "Veillez choisir le pilote actif"
                          )}
                          <InputRequire />
                        </label>
                        <div className="col-lg-9 col-xl-6">
                          <Select
                            isClearable
                            value={staff}
                            placeholder={"John doe"}
                            onChange={handleStaffChange}
                            options={staffs}
                            isMulti={data.is_multiple}
                          />
                          {data.pilots.length
                            ? data.pilots.map((error, index) => (
                                <div key={index} className="invalid-feedback">
                                  {error}
                                </div>
                              ))
                            : null}
                        </div>
                      </div>
                      {data.is_multiple ? (
                        <div
                          className={
                            data.lead_pilot_id.length
                              ? "form-group row validated"
                              : "form-group row"
                          }
                        >
                          <label
                            className="col-xl-3 col-lg-3 col-form-label"
                            htmlFor="unit_type"
                          >
                            {t("Veillez choisir le lead pilote")}
                            <InputRequire />
                          </label>
                          <div className="col-lg-9 col-xl-6">
                            <Select
                              isClearable
                              value={leadstaff}
                              placeholder={"John doe"}
                              onChange={handleLeadStaffChange}
                              options={staffs}
                            />
                            {data.lead_pilot_id.length
                              ? data.lead_pilot_id.map((error, index) => (
                                  <div key={index} className=" text-danger">
                                    {error}
                                  </div>
                                ))
                              : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="kt-portlet__foot">
                      <div className="kt-form__actions text-right">
                        {!startRequest ? (
                          <button
                            type="submit"
                            onClick={(e) => onSubmit(e)}
                            className="btn btn-primary"
                          >
                            {t("Enregistrer")}
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                            type="button"
                            disabled
                          >
                            {t("Chargement")}...
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return ready
    ? verifyPermission(props.userPermissions, "update-active-pilot")
      ? printJsx()
      : null
    : null;
};

const mapDispatchToProps = (state) => {
  return {
    activeUserInstitution: state.user.user.institution.id,
    userPermissions: state.user.user.permissions,
    user: state.user.user,
    plan: state.plan.plan,
    activePilot: state.user.user.staff.is_active_pilot,
  };
};

export default connect(mapDispatchToProps)(ActivatePilotPage);
