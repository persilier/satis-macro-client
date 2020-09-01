import React, {useEffect, useState} from 'react';
import axios from "axios";
import appConfig from "../../../config/appConfig";
import {verifyPermission} from "../../../helpers/permission";
import {connect} from "react-redux";
import LoadingTable from "../LoadingTable";

const DashboardSummaryReport = (props) => {
    const [load, setLoad] = useState(true);

    const reportColor = [
        {
            id: 0,
            rowColor: "table-primary",
            rang:1,
        },
        {
            id: 1,
            rowColor: "table-success",
            rang:2,
        },
        {
            id: 2,
            rowColor: "table-bland",
            rang:3,
        },
        {
            id: 3,
            rowColor: "table-warning",
            rang:4,
        },
        {
            id: 4,
            rowColor: "table-danger",
            rang:5
        },

    ];

    const [data, setData] = useState("");


    useEffect(() => {
        let isCancelled = false;

        async function fetchData() {
            axios.get(appConfig.apiDomaine + "/dashboard")
                .then(response => {
                    if (!isCancelled) {
                        let claimObjects = response.data.claimObjectsUse;
                        let newData = [];
                        for (const key in claimObjects) {
                            let totalObjectUse = claimObjects[key];
                            if (verifyPermission(props.userPermissions, "show-dashboard-data-all-institution")) {
                                newData.push({canal: key, label: totalObjectUse.allInstitution})
                            } else if (verifyPermission(props.userPermissions, "show-dashboard-data-my-institution")) {
                                newData.push({canal: key, label: totalObjectUse.myInstitution})
                            }
                        }
                        newData.sort(function (a, b) {
                            return b.label - a.label;
                        });
                        const result = newData.filter(function (event) {
                            return newData.indexOf(event) < 5
                        });
                        setData(result);
                        setLoad(false)
                    }
                })
                .catch(error => {
                    setLoad(false);
                    console.log("Something is wrong");
                })
        }

        fetchData();
        return () => {
            isCancelled = true;
        }
    }, []);
    return (
        (verifyPermission(props.userPermissions, "show-dashboard-data-all-institution") ||
            verifyPermission(props.userPermissions, "show-dashboard-data-my-institution")) ?
            <div className="kt-portlet">
                <div className="kt-portlet kt-portlet--height-fluid ">
                    <div className="kt-portlet__head">
                        <div className="kt-portlet__head-label">
                            <h3 className="kt-portlet__head-title">
                                Statistique des cinq (05) plus fréquents Objets de Réclamations sur les 30 derniers jours
                            </h3>
                        </div>
                    </div>
                    {
                        load ? (
                            <LoadingTable/>
                        ) : (
                            <div className="kt-portlet__body">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>Rang</th>
                                        <th>Objets de Réclamations</th>
                                        <th>Total</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    {data ?
                                        data.map((report, i) => (
                                            reportColor.map((color, j) => (
                                                i === j ?
                                                    <tr className={color.rowColor} key={i}>
                                                        <td>{color.rang}</td>

                                                        <td>{report.canal}</td>

                                                        <td>{report.label}</td>
                                                    </tr>
                                                    : <tr key={j} style={{display: 'none'}}></tr>
                                            ))
                                        ))
                                        : <tr style={{display: 'none'}}></tr>
                                    }

                                    </tbody>
                                </table>

                            </div>
                        )
                    }

                </div>
            </div>
            : ""
    );
};
const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(DashboardSummaryReport);