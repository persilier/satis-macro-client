import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { addTreatment } from "../../store/actions/treatmentAction";
import axios from "axios";
import appConfig from "../../config/appConfig";
import { ToastBottomEnd } from "./Toast";
import {
  toastAddErrorMessageConfig,
  toastAddSuccessMessageConfig,
} from "../../config/toastConfig";
import InputRequire from "./InputRequire";
import { useTranslation } from "react-i18next";

const TreatmentForm = (props) => {
  //usage of useTranslation i18n
  const { t, ready } = useTranslation();

  const defaultData = {
    amount_returned: "",
    solution: "",
    comments: "",
    preventive_measures: "",
    can_communicate: false,
    solution_communicated: "",
  };

  const defaultError = {
    amount_returned: [],
    solution: [],
    comments: [],
    preventive_measures: [],
    can_communicate: [],
    solution_communicated: [],
  };

  const [data, setData] = useState(defaultData);
  const [error, setError] = useState(defaultError);
  const [startRequest, setStartRequest] = useState(false);
  const [CanCommunicate, setCanCommunicate] = useState(0);
  const [Solution, setSolution] = useState("");

  useEffect(() => {
    if (props.activeTreatment) {
      setData({
        amount_returned: props.activeTreatment.amount_returned
          ? props.activeTreatment.amount_returned
          : "",
        solution: props.activeTreatment.solution
          ? props.activeTreatment.solution
          : "",
        comments: props.activeTreatment.comments
          ? props.activeTreatment.comments
          : "",
        preventive_measures: props.activeTreatment.preventive_measures
          ? props.activeTreatment.preventive_measures
          : "",
      });
    }
  }, [props.activeTreatment]);

  const onChangeAmount = (e) => {
    const newData = { ...data };
    newData.amount_returned = e.target.value;
    setData(newData);
    props.addTreatment(newData);
  };

  const onChangeSolution = (e) => {
    const newData = { ...data };
    newData.solution = e.target.value;
    setData(newData);
    props.addTreatment(newData);
  };

  const onSolutionSetting = (e) => {
    e.preventDefault();
    setStartRequest(true);
    const newData = {
      can_communicate: CanCommunicate,
      solution: CanCommunicate ? Solution : "",
    };
    axios
      .put(
        appConfig.apiDomaine + `/claim-assignment-adhoc-staff/{id}/treatment`,
        newData
      )
      .then((response) => {
        ToastBottomEnd.fire(toastAddSuccessMessageConfig());
        // window.location.href = "/process/claim-unsatisfied";
      })
      .catch((error) => {
        ToastBottomEnd.fire(toastAddErrorMessageConfig());
      })
      .finally(() => {
        setStartRequest(false);
      });
  };

  const onChangeComments = (e) => {
    const newData = { ...data };
    newData.comments = e.target.value;
    setData(newData);
    props.addTreatment(newData);
  };

  const onChangePreventiveMeasures = (e) => {
    const newData = { ...data };
    newData.preventive_measures = e.target.value;
    setData(newData);
    props.addTreatment(newData);
  };
  const onClick = (e) => {
    let newData = {
      ...data,
    };
    if (props.escalade) {
      newData = {
        ...data,
        solution_communicated: CanCommunicate ? Solution : "",
        can_communicate: CanCommunicate,
      };
    }
    e.preventDefault();
    setStartRequest(true);
    if (!newData.amount_returned) delete newData.amount_returned;
    let endpoint = "";
    if (props.escalade) {
      endpoint =
        appConfig.apiDomaine +
        `/claim-assignment-adhoc-staff/${props.getId}/treatment`;
    } else {
      endpoint =
        appConfig.apiDomaine +
        `/claim-assignment-staff/${props.getId}/treatment`;
    }
    axios
      .put(endpoint, newData)
      .then((response) => {
        setStartRequest(false);
        ToastBottomEnd.fire(toastAddSuccessMessageConfig());
        if (props.escalade) {
          window.location.href =
            "/process/escalation/ad-hoc/claim-assign-pending/to-staff";
        } else {
          window.location.href = "/process/claim-assign/to-staff";
        }
      })
      .catch((error) => {
        setStartRequest(false);
        setError({ ...defaultError, ...error.response.data.error });
        ToastBottomEnd.fire(toastAddErrorMessageConfig());
      });
  };
  //console.log("props:", props);
  return ready ? (
    <div>
      {props.amount_disputed >= 0 ? (
        <div
          className={
            error.amount_returned.length
              ? "form-group row validated"
              : "form-group row"
          }
        >
          <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="name">
            {" "}
            {props.currency
              ? "Montant retourné en " + props.currency
              : "Montant retourné"}{" "}
            {props.amount_disputed ? <InputRequire /> : null}{" "}
          </label>
          <div className="col-lg-9 col-xl-6">
            <input
              id="amount"
              type="number"
              // required={props.amount_disputed ? true : false}
              min={0}
              className={
                error.amount_returned.length
                  ? "form-control is-invalid"
                  : "form-control"
              }
              placeholder="Veuillez entrer le montant à retourner"
              value={data.amount_returned}
              onChange={(e) => onChangeAmount(e)}
            />
            {error.amount_returned.length
              ? error.amount_returned.map((error, index) => (
                  <div key={index} className="invalid-feedback">
                    {error}
                  </div>
                ))
              : ""}
          </div>
        </div>
      ) : null}
      <div
        className={
          error.solution.length ? "form-group row validated" : "form-group row"
        }
      >
        <label
          className="col-xl-3 col-lg-3 col-form-label"
          htmlFor="description"
        >
          {t("Solution")} <InputRequire />
        </label>
        <div className="col-lg-9 col-xl-6">
          <textarea
            id="solution"
            className={
              error.solution.length ? "form-control is-invalid" : "form-control"
            }
            placeholder={t("Veuillez entrer la solution proposée")}
            cols="30"
            rows="5"
            value={data.solution}
            onChange={(e) => onChangeSolution(e)}
          />
          {error.solution.length
            ? error.solution.map((error, index) => (
                <div key={index} className="invalid-feedback">
                  {error}
                </div>
              ))
            : null}
        </div>
      </div>

      <div
        className={
          error.preventive_measures.length
            ? "form-group row validated"
            : "form-group row"
        }
      >
        <label
          className="col-xl-3 col-lg-3 col-form-label"
          htmlFor="description"
        >
          {t("Mesures préventives")}
          {/*<InputRequire/>*/}
        </label>
        <div className="col-lg-9 col-xl-6">
          <textarea
            id="measures"
            className={
              error.preventive_measures.length
                ? "form-control is-invalid"
                : "form-control"
            }
            placeholder={t("Veuillez entrer la mesure préventive")}
            cols="30"
            rows="5"
            value={data.preventive_measures}
            onChange={(e) => onChangePreventiveMeasures(e)}
          />
          {error.preventive_measures.length
            ? error.preventive_measures.map((error, index) => (
                <div key={index} className="invalid-feedback">
                  {error}
                </div>
              ))
            : null}
        </div>
      </div>

      <div
        className={
          error.comments.length ? "form-group row validated" : "form-group row"
        }
      >
        <label
          className="col-xl-3 col-lg-3 col-form-label"
          htmlFor="description"
        >
          {t("Commentaires")}
        </label>
        <div className="col-lg-9 col-xl-6">
          <textarea
            id="comments"
            className={
              error.comments.length ? "form-control is-invalid" : "form-control"
            }
            placeholder={t("Veuillez entrer un commentaire")}
            cols="30"
            rows="5"
            value={data.comments}
            onChange={(e) => onChangeComments(e)}
          />
          {error.comments.length
            ? error?.comments?.map?.((error, index) => (
                <div key={index} className="invalid-feedback">
                  {error}
                </div>
              ))
            : null}
        </div>
      </div>
      {props.escalade && (
        <div className="kt-portlet__body col-12">
          <div className="kt-section kt-section--first">
            <div className="kt-section__body">
              <div
                className={
                  error?.can_communicate?.length
                    ? "form-group validated"
                    : "form-group"
                }
              >
                <span
                  style={{
                    transform: "scale(0.9,0.9)",
                    marginLeft: "-24px",
                  }}
                  className="kt-switch col-12"
                >
                  <label>
                    <input
                      style={{}}
                      id="inactivity_control"
                      type="checkbox"
                      checked={CanCommunicate}
                      name="can_communicate"
                      onChange={(e) => {
                        const { checked } = e.target;
                        setCanCommunicate(checked ? 1 : 0);
                      }}
                    />
                    <span />
                    <div
                      style={{
                        fontSize: "16px",
                        whiteSpace: "nowrap",
                        marginTop: "6px",
                      }}
                    >
                      {t("Voulez vous communiquer la solution au réclamant")}
                    </div>
                  </label>
                </span>
              </div>
              <div
                hidden={!CanCommunicate}
                className={
                  error?.solution_communicated?.length
                    ? "form-group validated"
                    : "form-group"
                }
              >
                <label htmlFor="description">
                  {t("Solution")}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <textarea
                  id="description"
                  className={
                    error?.solution_communicated.length
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  placeholder={t("Veuillez entrer la description du motif")}
                  cols="62"
                  rows="7"
                  required={true}
                  value={Solution}
                  onChange={(e) => setSolution(e.target.value)}
                />
                {error?.solution_communicated?.length
                  ? error?.solution_communicated?.map?.((error, index) => (
                      <div key={index} className="invalid-feedback">
                        {error}
                      </div>
                    ))
                  : ""}
              </div>
            </div>
          </div>
        </div>
      )}
      {!startRequest ? (
        <button className="btn btn-success" onClick={(e) => onClick(e)}>
          {t("TRAITER")}
        </button>
      ) : (
        <button
          className="btn btn-success kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
          type="button"
          disabled
        >
          {t("Chargement")}...
        </button>
      )}
    </div>
  ) : null;
};
const mapStateToProps = (state) => {
  return {
    treatment: state.treatment,
  };
};

export default connect(mapStateToProps, { addTreatment })(TreatmentForm);
