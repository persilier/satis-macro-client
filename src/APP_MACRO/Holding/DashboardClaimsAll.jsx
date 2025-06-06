import React, { useEffect, useState } from "react";
import { verifyPermission } from "../../helpers/permission";
import { connect } from "react-redux";
import { percentageData } from "../../helpers/function";
import LoadingTable from "../../views/components/LoadingTable";
import { verifyTokenExpire } from "../../middleware/verifyToken";
import { t } from "i18next";

const DashboardClaimsAll = (props) => {
  const [componentData, setComponentData] = useState("");
  const [data, setData] = useState("");
  const [totalData, setTotalData] = useState("");
  const [load, setLoad] = useState(true);
  const { dateEnd, dateStart, filterdate, spacialdate } = props;

  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      if (verifyTokenExpire()) {
        if (!isCancelled) {
          setComponentData(props.component);
          setData(props.response.data.statistics);
          setTotalData(
            props.response.data.statistics.totalRegistered.allInstitution
          );
          setLoad(false);
        }
      }
    }

    fetchData();
    return () => {
      isCancelled = true;
    };
  }, [props.response]);

  return verifyPermission(
    props.userPermissions,
    "show-dashboard-data-all-institution"
  ) ? (
    <div>
      <div className="kt-portlet__head">
        <div className="kt-portlet__head-label">
          <h5 className="kt-portlet__head-title">
            {/*Statistiques des Réclamations de toutes les Institutions sur les 30 derniers jours*/}
            {t("Statistiques des Réclamations de toutes les Institutions")}
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
          <div className="row row-no-padding row-col-separator-sm">
            <div className="col-md-12 col-lg-3 col-xl-3">
              <div className="kt-widget24">
                {/*<NavLink exact to="/process/total-claim-register">*/}
                <div className="kt-widget24__details">
                  <div className="kt-widget24__info">
                    <h5 className="kt-widget24__title">
                      {/*Total Réclamations Enregistrées*/}
                      {componentData
                        ? componentData.params.fr.total_enreg.value
                        : ""}
                    </h5>
                    <span className="kt-widget24__desc" />
                  </div>
                  <span className="kt-widget24__stats kt-font-brand">
                    {data.totalRegistered
                      ? data.totalRegistered.allInstitution
                      : "0"}
                  </span>
                </div>
                {/*</NavLink>*/}
              </div>
            </div>

            <div className="col-md-12 col-lg-3 col-xl-3">
              <div className="kt-widget24">
                {/*<NavLink exact to="/process/total-incomplete-claim">*/}
                <div className="kt-widget24__details">
                  <div className="kt-widget24__info">
                    <h5 className="kt-widget24__title">
                      {/*Total Réclamations Incomplètes*/}
                      {componentData
                        ? componentData.params.fr.total_incomplete.value
                        : ""}
                    </h5>
                    <span className="kt-widget24__desc" />
                  </div>
                  <span className="kt-widget24__stats kt-font-danger">
                    {data.totalIncomplete
                      ? data.totalIncomplete.allInstitution
                      : "0"}
                  </span>
                </div>
                {/*</NavLink>*/}

                <div className="progress progress--sm">
                  {data.totalIncomplete ? (
                    <div
                      className="progress-bar kt-bg-danger"
                      role="progressbar"
                      aria-valuenow={percentageData(
                        data.totalIncomplete.allInstitution,
                        totalData
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        width: percentageData(
                          data.totalIncomplete.allInstitution,
                          totalData
                        ),
                      }}
                    ></div>
                  ) : null}
                </div>

                <div className="kt-widget24__action">
                  <span className="kt-widget24__change">
                    {componentData
                      ? componentData.params.fr.pourcent_incomplet.value
                      : ""}
                  </span>
                  <span className="kt-widget24__number">
                    {percentageData(
                      data?.totalIncomplete?.allInstitution ?? 0,
                      totalData
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-3 col-xl-3">
              <div className="kt-widget24">
                {/*<NavLink exact to="/process/total-complete-claim">*/}
                <div className="kt-widget24__details">
                  <div className="kt-widget24__info">
                    <h5 className="kt-widget24__title">
                      {/*Total Réclamations Complètes*/}
                      {componentData
                        ? componentData.params.fr.total_complet.value
                        : ""}
                    </h5>
                    <span className="kt-widget24__desc" />
                  </div>
                  <span className="kt-widget24__stats kt-font-success">
                    {data.totalComplete
                      ? data.totalComplete.allInstitution
                      : "0"}
                  </span>
                </div>
                {/*</NavLink>*/}

                <div className="progress progress--sm">
                  {data.totalComplete ? (
                    <div
                      className="progress-bar kt-bg-success"
                      role="progressbar"
                      aria-valuenow={percentageData(
                        data.totalComplete.allInstitution,
                        totalData
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        width: percentageData(
                          data.totalComplete.allInstitution,
                          totalData
                        ),
                      }}
                    ></div>
                  ) : null}
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
                        data?.totalComplete?.allInstitution ?? 0,
                        totalData
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-3 col-xl-3">
              <div className="kt-widget24">
                {/*<NavLink exact to="/process/total-claim-transfer-to-unit">*/}
                <div className="kt-widget24__details">
                  <div className="kt-widget24__info">
                    <h5 className="kt-widget24__title">
                      {/*Total Réclamations Transférées à une Unité*/}
                      {componentData
                        ? componentData.params.fr.total_to_unit.value
                        : ""}
                    </h5>
                    <span className="kt-widget24__desc" />
                  </div>
                  <span className="kt-widget24__stats kt-font-brand">
                    {data.totalTransferredToUnit
                      ? data.totalTransferredToUnit.allInstitution
                      : "0"}
                  </span>
                </div>
                {/*</NavLink>*/}

                <div className="progress progress--sm">
                  {data.totalTransferredToUnit ? (
                    <div
                      className="progress-bar kt-bg-brand"
                      role="progressbar"
                      aria-valuenow={percentageData(
                        data.totalTransferredToUnit.allInstitution,
                        totalData
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        width: percentageData(
                          data.totalTransferredToUnit.allInstitution,
                          totalData
                        ),
                      }}
                    ></div>
                  ) : null}
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
                        data?.totalTransferredToUnit?.allInstitution ?? 0,
                        totalData
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-3 col-xl-3">
              <div className="kt-widget24">
                {/*<NavLink exact to="/process/total-claim-in-treatment">*/}
                <div className="kt-widget24__details">
                  <div className="kt-widget24__info">
                    <h5 className="kt-widget24__title">
                      {/*Total Réclamations en Cours de Traitement*/}
                      {componentData
                        ? componentData.params.fr.total_in_treatment.value
                        : ""}
                    </h5>
                    <span className="kt-widget24__desc" />
                  </div>
                  <span className="kt-widget24__stats kt-font-warning">
                    {data.totalBeingProcess
                      ? data.totalBeingProcess.allInstitution
                      : "0"}
                  </span>
                </div>
                {/*</NavLink>*/}

                <div className="progress progress--sm">
                  {data.totalBeingProcess ? (
                    <div
                      className="progress-bar kt-bg-warning"
                      role="progressbar"
                      aria-valuenow={percentageData(
                        data.totalBeingProcess.allInstitution,
                        totalData
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        width: percentageData(
                          data.totalBeingProcess.allInstitution,
                          totalData
                        ),
                      }}
                    ></div>
                  ) : null}
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
                        data?.totalBeingProcess?.allInstitution ?? 0,
                        totalData
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-3 col-xl-3">
              <div className="kt-widget24">
                {/*<NavLink exact to="/process/total-claim-treat">*/}
                <div className="kt-widget24__details">
                  <div className="kt-widget24__info">
                    <h5 className="kt-widget24__title">
                      {/*Total Réclamations Traitées*/}
                      {componentData
                        ? componentData.params.fr.total_treat.value
                        : ""}
                    </h5>
                    <span className="kt-widget24__desc" />
                  </div>
                  <span className="kt-widget24__stats kt-font-success">
                    {data.totalTreated ? data.totalTreated.allInstitution : "0"}
                  </span>
                </div>
                {/*</NavLink>*/}

                <div className="progress progress--sm">
                  {data.totalTreated ? (
                    <div
                      className="progress-bar kt-bg-success"
                      role="progressbar"
                      aria-valuenow={percentageData(
                        data.totalTreated.allInstitution,
                        totalData
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        width: percentageData(
                          data.totalTreated.allInstitution,
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
                        data?.totalTreated?.allInstitution ?? 0,
                        totalData
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-3 col-xl-3">
              <div className="kt-widget24">
                {/*<NavLink exact to="/process/total-unfounded-claim">*/}
                <div className="kt-widget24__details">
                  <div className="kt-widget24__info">
                    <h5 className="kt-widget24__title">
                      {/*Total Réclamations Non Fondées*/}
                      {componentData
                        ? componentData.params.fr.total_unfound.value
                        : ""}
                    </h5>
                    <span className="kt-widget24__desc" />
                  </div>
                  <span className="kt-widget24__stats kt-font-success">
                    {data.totalUnfounded
                      ? data.totalUnfounded.allInstitution
                      : "0"}
                  </span>
                </div>
                {/*</NavLink>*/}

                <div className="progress progress--sm">
                  {data.totalUnfounded ? (
                    <div
                      className="progress-bar kt-bg-success"
                      role="progressbar"
                      aria-valuenow={percentageData(
                        data.totalUnfounded.allInstitution,
                        totalData
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        width: percentageData(
                          data.totalUnfounded.allInstitution,
                          totalData
                        ),
                      }}
                    />
                  ) : null}
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
                        data?.totalUnfounded?.allInstitution ?? 0,
                        totalData
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-3 col-xl-3">
              <div className="kt-widget24">
                {/*<NavLink exact to="/process/total-claim-satisfaction-measure">*/}
                <div className="kt-widget24__details">
                  <div className="kt-widget24__info">
                    <h5 className="kt-widget24__title">
                      {/*Total Satisfaction Mesurée*/}
                      {componentData
                        ? componentData.params.fr.total_satisfated.value
                        : ""}
                    </h5>
                    <span className="kt-widget24__desc" />
                  </div>
                  <span className="kt-widget24__stats kt-font-danger">
                    {data.totalMeasuredSatisfaction
                      ? data.totalMeasuredSatisfaction.allInstitution
                      : "0"}
                  </span>
                </div>
                {/*</NavLink>*/}

                <div className="progress progress--sm">
                  {data.totalMeasuredSatisfaction ? (
                    <div
                      className="progress-bar kt-bg-danger"
                      role="progressbar"
                      aria-valuenow={percentageData(
                        data.totalMeasuredSatisfaction.allInstitution,
                        totalData
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        width: percentageData(
                          data.totalMeasuredSatisfaction.allInstitution,
                          totalData
                        ),
                      }}
                    ></div>
                  ) : null}
                </div>
                <div className="kt-widget24__action">
                  <span className="kt-widget24__change">
                    {/*%  Satisfaction Mesurée*/}
                    {componentData
                      ? componentData.params.fr.pourcent_satisfated.value
                      : ""}
                  </span>
                  <span className="kt-widget24__number">
                    <span className="kt-widget24__number">
                      {percentageData(
                        data?.totalMeasuredSatisfaction?.allInstitution ?? 0,
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
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    userPermissions: state.user.user.permissions,
  };
};

export default connect(mapStateToProps)(DashboardClaimsAll);
