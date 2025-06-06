import React, { useEffect, useState } from "react";
import { verifyPermission } from "../../../helpers/permission";
import { ERROR_401 } from "../../../config/errorPage";
import axios from "axios";
import appConfig from "../../../config/appConfig";
import { connect } from "react-redux";
import { percentageData } from "../../../helpers/function";
import LoadingTable from "../LoadingTable";
import { verifyTokenExpire } from "../../../middleware/verifyToken";

const DashboardClaimsUnit = (props) => {
  const [data, setData] = useState("");
  const [totalData, setTotalData] = useState("");
  const [load, setLoad] = useState(true);
  const [componentData, setComponentData] = useState("");
  const { dateEnd, dateStart, filterdate, spacialdate } = props;

  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      if (!isCancelled) {
        setComponentData(props.component);
        setData(props.response.data.statistics);
        setTotalData(props.response.data.statistics.totalRegistered.myUnit);
        setLoad(false);
      }
    }

    if (verifyTokenExpire()) fetchData();
    return () => {
      isCancelled = true;
    };
  }, [props.response]);

  return verifyPermission(
    props.userPermissions,
    "show-dashboard-data-my-unit"
  ) ? (
    <div>
      <div className="kt-portlet__head">
        <div className="kt-portlet__head-label">
          <h5 className="kt-portlet__head-title">
            Statistiques des Réclamations de mon Unité{" "}
            {spacialdate !== ""
              ? ` sur les ${spacialdate?.match(/\d+/)[0]} derniers ${
                  spacialdate?.includes("months") ? " mois" : "jours"
                }`
              : filterdate !== ""
              ? ` au ${filterdate}`
              : dateStart !== ""
              ? ` du ${dateStart} au ${dateEnd}`
              : " sur les 30 derniers jours"}
          </h5>
        </div>
      </div>
      {load ? (
        <LoadingTable />
      ) : (
        <div className="kt-portlet__body kt-portlet__body--fit">
          <div className="row row-no-padding row-col-separator-lg">
            <div className="col-md-12 col-lg-3 col-xl-3">
              <div className="kt-widget24">
                <div className="kt-widget24__details">
                  <div className="kt-widget24__info">
                    <h5 className="kt-widget24__title">
                      {/*Total Réclamations Enregistrées*/}

                      {componentData
                        ? componentData.params.fr.total_enreg.value
                        : ""}
                    </h5>
                    <span className="kt-widget24__desc"></span>
                  </div>
                  <span className="kt-widget24__stats kt-font-brand">
                    {data.totalRegistered ? data.totalRegistered.myUnit : "0"}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-3 col-xl-3">
              <div className="kt-widget24">
                <div className="kt-widget24__details">
                  <div className="kt-widget24__info">
                    <h5 className="kt-widget24__title">
                      {/*Total Réclamations Incomplètes*/}
                      {componentData
                        ? componentData.params.fr.total_incomplete.value
                        : ""}
                    </h5>
                    <span className="kt-widget24__desc"></span>
                  </div>
                  <span className="kt-widget24__stats kt-font-danger">
                    {data.totalIncomplete ? data.totalIncomplete.myUnit : "0"}
                  </span>
                </div>
                <div className="progress progress--sm">
                  {data.totalIncomplete ? (
                    <div
                      className="progress-bar kt-bg-danger"
                      role="progressbar"
                      aria-valuenow={percentageData(
                        data.totalIncomplete.myUnit,
                        totalData
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        width: percentageData(
                          data.totalIncomplete.myUnit,
                          totalData
                        ),
                      }}
                    ></div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="kt-widget24__action">
                  <span className="kt-widget24__change">
                    {/*% Réclamations Incomplètes*/}
                    {componentData
                      ? componentData.params.fr.pourcent_incomplet.value
                      : ""}
                  </span>

                  <span className="kt-widget24__number">
                    {percentageData(
                      data?.totalIncomplete?.myUnit ?? 0,
                      totalData
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-3 col-xl-3">
              <div className="kt-widget24">
                <div className="kt-widget24__details">
                  <div className="kt-widget24__info">
                    <h5 className="kt-widget24__title">
                      {/*Total Réclamations Complètes*/}
                      {componentData
                        ? componentData.params.fr.total_complet.value
                        : ""}
                    </h5>
                    <span className="kt-widget24__desc"></span>
                  </div>
                  <span className="kt-widget24__stats kt-font-success">
                    {data.totalComplete ? data.totalComplete.myUnit : "0"}
                  </span>
                </div>
                <div className="progress progress--sm">
                  {data.totalComplete ? (
                    <div
                      className="progress-bar kt-bg-success"
                      role="progressbar"
                      aria-valuenow={percentageData(
                        data.totalComplete.myUnit,
                        totalData
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        width: percentageData(
                          data.totalComplete.myUnit,
                          totalData
                        ),
                      }}
                    ></div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="kt-widget24__action">
                  <span className="kt-widget24__change">
                    {/*% Réclamations Complètes*/}
                    {componentData
                      ? componentData.params.fr.pourcent_complete.value
                      : ""}
                  </span>
                  <span className="kt-widget24__number">
                    <span className="kt-widget24__number">
                      {percentageData(
                        data?.totalComplete?.myUnit ?? 0,
                        totalData
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-3 col-xl-3">
              <div className="kt-widget24">
                <div className="kt-widget24__details">
                  <div className="kt-widget24__info">
                    <h5 className="kt-widget24__title">
                      {/*Total Réclamations Transférées à une Unité*/}
                      {componentData
                        ? componentData.params.fr.total_to_unit.value
                        : ""}
                    </h5>
                    <span className="kt-widget24__desc"></span>
                  </div>
                  <span className="kt-widget24__stats kt-font-brand">
                    {data.totalTransferredToUnit
                      ? data.totalTransferredToUnit.myUnit
                      : "0"}
                  </span>
                </div>
                <div className="progress progress--sm">
                  {data.totalTransferredToUnit ? (
                    <div
                      className="progress-bar kt-bg-brand"
                      role="progressbar"
                      aria-valuenow={percentageData(
                        data.totalTransferredToUnit.myUnit,
                        totalData
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        width: percentageData(
                          data.totalTransferredToUnit.myUnit,
                          totalData
                        ),
                      }}
                    ></div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="kt-widget24__action">
                  <span className="kt-widget24__change">
                    {/*% Réclamations Transférées à une Unité*/}
                    {componentData
                      ? componentData.params.fr.pourcent_to_unit.value
                      : ""}
                  </span>
                  <span className="kt-widget24__number">
                    <span className="kt-widget24__number">
                      {percentageData(
                        data?.totalTransferredToUnit?.myUnit ?? 0,
                        totalData
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-3 col-xl-3">
              <div className="kt-widget24">
                <div className="kt-widget24__details">
                  <div className="kt-widget24__info">
                    <h5 className="kt-widget24__title">
                      {/*Total Réclamations en Cours de Traitement*/}
                      {componentData
                        ? componentData.params.fr.total_in_treatment.value
                        : ""}
                    </h5>
                    <span className="kt-widget24__desc"></span>
                  </div>
                  <span className="kt-widget24__stats kt-font-warning">
                    {data.totalBeingProcess
                      ? data.totalBeingProcess.myUnit
                      : "0"}
                  </span>
                </div>
                <div className="progress progress--sm">
                  {data.totalBeingProcess ? (
                    <div
                      className="progress-bar kt-bg-warning"
                      role="progressbar"
                      aria-valuenow={percentageData(
                        data.totalBeingProcess.myUnit,
                        totalData
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        width: percentageData(
                          data.totalBeingProcess.myUnit,
                          totalData
                        ),
                      }}
                    ></div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="kt-widget24__action">
                  <span className="kt-widget24__change">
                    {/*% Réclamations en Cours de Traitement*/}
                    {componentData
                      ? componentData.params.fr.pourcent_in_treatment.value
                      : ""}
                  </span>
                  <span className="kt-widget24__number">
                    <span className="kt-widget24__number">
                      {percentageData(
                        data?.totalBeingProcess?.myUnit ?? 0,
                        totalData
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-3 col-xl-3">
              <div className="kt-widget24">
                <div className="kt-widget24__details">
                  <div className="kt-widget24__info">
                    <h5 className="kt-widget24__title">
                      {/*Total Réclamations Traitées*/}
                      {componentData
                        ? componentData.params.fr.total_treat.value
                        : ""}
                    </h5>
                    <span className="kt-widget24__desc"></span>
                  </div>
                  <span className="kt-widget24__stats kt-font-success">
                    {data.totalTreated ? data.totalTreated.myUnit : "0"}
                  </span>
                </div>
                <div className="progress progress--sm">
                  {data.totalTreated ? (
                    <div
                      className="progress-bar kt-bg-success"
                      role="progressbar"
                      aria-valuenow={percentageData(
                        data.totalTreated.myUnit,
                        totalData
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        width: percentageData(
                          data.totalTreated.myUnit,
                          totalData
                        ),
                      }}
                    ></div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="kt-widget24__action">
                  <span className="kt-widget24__change">
                    {/*% Réclamations Traitées*/}
                    {componentData
                      ? componentData.params.fr.pourcent_treat.value
                      : ""}
                  </span>
                  <span className="kt-widget24__number">
                    <span className="kt-widget24__number">
                      {percentageData(
                        data?.totalTreated?.myUnit ?? 0,
                        totalData
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-3 col-xl-3">
              <div className="kt-widget24">
                <div className="kt-widget24__details">
                  <div className="kt-widget24__info">
                    <h5 className="kt-widget24__title">
                      {/*Total Réclamations Non Fondées*/}
                      {componentData
                        ? componentData.params.fr.total_unfound.value
                        : ""}
                    </h5>
                    <span className="kt-widget24__desc"></span>
                  </div>
                  <span className="kt-widget24__stats kt-font-success">
                    {data.totalUnfounded ? data.totalUnfounded.myUnit : "0"}
                  </span>
                </div>
                <div className="progress progress--sm">
                  {data.totalUnfounded ? (
                    <div
                      className="progress-bar kt-bg-success"
                      role="progressbar"
                      aria-valuenow={percentageData(
                        data.totalUnfounded.myUnit,
                        totalData
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        width: percentageData(
                          data.totalUnfounded.myUnit,
                          totalData
                        ),
                      }}
                    ></div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="kt-widget24__action">
                  <span className="kt-widget24__change">
                    {/*% Réclamations Non Fondées*/}
                    {componentData
                      ? componentData.params.fr.pourcent_unfound.value
                      : ""}
                  </span>
                  <span className="kt-widget24__number">
                    <span className="kt-widget24__number">
                      {percentageData(
                        data?.totalUnfounded?.myUnit ?? 0,
                        totalData
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-3 col-xl-3">
              <div className="kt-widget24">
                <div className="kt-widget24__details">
                  <div className="kt-widget24__info">
                    <h5 className="kt-widget24__title">
                      {/*Total Satisfaction Mesurée*/}
                      {componentData
                        ? componentData.params.fr.total_satisfated.value
                        : ""}
                    </h5>
                    <span className="kt-widget24__desc"></span>
                  </div>
                  <span className="kt-widget24__stats kt-font-danger">
                    {data.totalMeasuredSatisfaction
                      ? data.totalMeasuredSatisfaction.myUnit
                      : "0"}
                  </span>
                </div>
                <div className="progress progress--sm">
                  {data.totalMeasuredSatisfaction ? (
                    <div
                      className="progress-bar kt-bg-danger"
                      role="progressbar"
                      aria-valuenow={percentageData(
                        data.totalMeasuredSatisfaction.myUnit,
                        totalData
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        width: percentageData(
                          data.totalMeasuredSatisfaction.myUnit,
                          totalData
                        ),
                      }}
                    ></div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="kt-widget24__action">
                  <span className="kt-widget24__change">
                    {/*% Satisfaction Mesurée*/}
                    {componentData
                      ? componentData.params.fr.pourcent_satisfated.value
                      : ""}
                  </span>
                  <span className="kt-widget24__number">
                    <span className="kt-widget24__number">
                      {percentageData(
                        data?.totalMeasuredSatisfaction?.myUnit ?? 0,
                        totalData
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    ""
  );
};

const mapStateToProps = (state) => {
  return {
    userPermissions: state.user.user.permissions,
  };
};

export default connect(mapStateToProps)(DashboardClaimsUnit);
