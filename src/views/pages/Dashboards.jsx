import React, {useEffect, useState} from 'react';
import axios from "axios";
import DashboardClaimsAll from "../../APP_MACRO/Holding/DashboardClaimsAll";
import DashboardClaimsMy from "../components/DashboardForm/DashboardClaimsMy";
import DashboardClaimsUnit from "../components/DashboardForm/DashboardClaimsUnit";
import DashboardSummaryReport from "../components/DashboardForm/DashboardSummaryReport";
import DashboardStatClaim from "../components/DashboardForm/DashboardStatClaim";
import DashboardStatistic from "../components/DashboardForm/DashboardStatistic";
import GraphChannel from "../components/DashboardForm/GraphChannel";
import DashboardClaimsActivity from "../components/DashboardForm/DashboardClaimsActivity";
// import ClaimToInstitution from "../components/DashboardForm/ClaimToInstitution";
import ClaimToPointOfServices from "../components/DashboardForm/ClaimToPointOfServices";
import {verifyPermission} from "../../helpers/permission";
import {connect} from "react-redux";
import appConfig from "../../config/appConfig";
import {verifyTokenExpire} from "../../middleware/verifyToken";
import LoadingTable from "../components/LoadingTable";
import Select from "react-select";
import {formatSelectOption} from "../../helpers/function";
import DashboardPieChart from "../components/DashboardForm/DashboardPieChart";

const Dashboards = (props) => {
    document.title = "Satis client - Dashboard";

    const defaultData = {institution_targeted_id: ""};

    const [response, setResponse] = useState(null);
    const [dataInstitution, setDataInstitution] = useState([]);
    const [institution, setInstitution] = useState([]);
    const [data, setData] = useState(defaultData);
    const [load, setLoad] = useState(true);

    const getResponseAxios=(data)=>{
        axios.post(appConfig.apiDomaine + "/dashboard",data)
            .then(response => {
                setResponse(response);
                setDataInstitution(response.data.institutions);
                setLoad(false)
            })
            .catch(error => console.log("Something is wrong"))
        ;
    };
    useEffect(() => {
        async function fetchData() {
            await getResponseAxios()
        }

        if (verifyTokenExpire())
            fetchData();
    }, []);

    const onChangeInstitution = (selected) => {
        const newData = {...data};
        setLoad(true);

        if (selected) {
            newData.institution_targeted_id = selected.value;
            setInstitution(selected);
           getResponseAxios(newData)
        }else {
            newData.institution_targeted_id = "";
            setInstitution(null);
           getResponseAxios()
        }
        setData(newData);
    };

    return (
        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            Tableau de bord
                        </h3>
                    </div>
                    {
                        verifyPermission(props.userPermissions, "show-dashboard-data-all-institution") ?
                            <div className={"col-5"}>
                                <div
                                    className={"form-group row"}>
                                    <label className="col-xl-2 col-lg-3 col-form-label"
                                           htmlFor="exampleSelect1">Institution</label>
                                    <div className="col-lg-9 col-xl-2">
                                        {dataInstitution ? (
                                            <Select
                                                isClearable
                                                classNamePrefix="select"
                                                placeholder={"Choisissez une institution pour le filtre"}
                                                className="basic-single"
                                                value={institution}
                                                onChange={onChangeInstitution}
                                                options={formatSelectOption(dataInstitution, 'name', false)}
                                            />
                                        ) : ''
                                        }

                                    </div>
                                </div>
                            </div>
                            : ""
                    }

                </div>
            </div>
            {
                load ? (
                    <LoadingTable/>
                ) : (
                    <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                        {response ? (
                            <div>
                                {
                                    verifyPermission(props.userPermissions, "show-dashboard-data-all-institution") ?
                                        <div className="kt-portlet">
                                            <DashboardClaimsAll
                                                response={response}
                                            />
                                        </div> : null
                                }

                                {
                                    verifyPermission(props.userPermissions, "show-dashboard-data-my-institution") ?
                                        <div className="kt-portlet">
                                            <DashboardClaimsMy response={response}/>
                                        </div> : null
                                }

                                {
                                    verifyPermission(props.userPermissions, "show-dashboard-data-my-unit") ?
                                        <div className="kt-portlet">
                                            <DashboardClaimsUnit response={response}/>
                                        </div> : null
                                }

                                {
                                    verifyPermission(props.userPermissions, "show-dashboard-data-my-activity") ?
                                        <div className="kt-portlet">
                                            <DashboardClaimsActivity response={response}/>
                                        </div> : null
                                }

                                <div>
                                    <DashboardSummaryReport
                                        response={response}
                                    />
                                </div>

                                <div>
                                    <GraphChannel response={response}/>
                                </div>

                                <div>
                                    <DashboardStatClaim response={response}/>
                                </div>

                                <div>
                                    <DashboardStatistic response={response}/>
                                </div>
                                {
                                    !data.institution_targeted_id ?
                                        <div>
                                            {
                                                verifyPermission(props.userPermissions, "show-dashboard-data-all-institution") &&
                                                (verifyPermission(props.userPermissions, "show-dashboard-data-my-institution")) ?
                                                    <div className="kt-portlet" id={"institution"}>
                                                        {/*<ClaimToInstitution response={response}/>*/}
                                                        <DashboardPieChart response={response}/>

                                                    </div> : null
                                            }
                                        </div>
                                        : ""
                                }
                                <div>
                                    {
                                        verifyPermission(props.userPermissions, "show-dashboard-data-all-institution") &&
                                        verifyPermission(props.userPermissions, "show-dashboard-data-my-institution") ?
                                            <div className="kt-portlet">
                                                <ClaimToPointOfServices response={response}/>
                                            </div> : null
                                    }
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="kt-portlet">
                                    <div className="kt-portlet__head">
                                        <div className="kt-portlet__head-label">
                                            <h3 className="kt-portlet__head-title">
                                                Statistiques des Réclamations de toutes les Institutions sur les 30
                                                derniers
                                                jours
                                            </h3>
                                        </div>
                                    </div>
                                    <LoadingTable/>
                                </div>

                                <div className="kt-portlet">
                                    <div className="kt-portlet__head">
                                        <div className="kt-portlet__head-label">
                                            <h3 className="kt-portlet__head-title">
                                                Statistiques des Réclamations de mon Institution sur les 30 derniers
                                                jours
                                            </h3>
                                        </div>
                                    </div>
                                    <LoadingTable/>
                                </div>

                                <div className="kt-portlet">
                                    <div className="kt-portlet__head">
                                        <div className="kt-portlet__head-label">
                                            <h3 className="kt-portlet__head-title">
                                                Statistique des cinq (05) plus fréquents Objets de Réclamations sur les
                                                30
                                                derniers jours
                                            </h3>
                                        </div>
                                    </div>
                                    <LoadingTable/>
                                </div>

                                <div className="kt-portlet">
                                    <div className="kt-portlet__head">
                                        <div className="kt-portlet__head-label">
                                            <h3 className="kt-portlet__head-title">
                                                Total des Réclamations reçues par Canal sur les 30 derniers jours
                                            </h3>
                                        </div>
                                    </div>
                                    <LoadingTable/>
                                </div>

                                <div className="kt-portlet">
                                    <div className="kt-portlet__head">
                                        <div className="kt-portlet__head-label">
                                            <h3 className="kt-portlet__head-title">
                                                Evolution de la satisfaction des réclamants sur les 11 derniers mois
                                            </h3>
                                        </div>
                                    </div>
                                    <LoadingTable/>
                                </div>

                                <div className="kt-portlet">
                                    <div className="kt-portlet__head">
                                        <div className="kt-portlet__head-label">
                                            <h3 className="kt-portlet__head-title">
                                                Evolution de la satisfaction des réclamations sur les 11 derniers mois
                                            </h3>
                                        </div>
                                    </div>
                                    <LoadingTable/>
                                </div>

                                <div className="kt-portlet">
                                    <div className="kt-portlet__head">
                                        <div className="kt-portlet__head-label">
                                            <h3 className="kt-portlet__head-title">
                                                Satisfaction des institutions qui reçoivent plus de réclamations sur les
                                                30
                                                derniers jours
                                            </h3>
                                        </div>
                                    </div>
                                    <LoadingTable/>
                                </div>
                            </div>
                        )}
                    </div>
                )}
        </div>

    );

};

const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(Dashboards);
