import axios from "axios";
import {verifyPermission} from "../helpers/permission";
import appConfig from "../config/appConfig";
import {verifyTokenExpire} from "../middleware/verifyToken";

//AUTH
export function resetPassword(input) {
    return axios.put(`/change-password`, input);
}

export function logoutUser(){
    return axios.get(`/logout`)
}

// ClaimReportingBenchmarking
export function benchmarkingReport(userPermissions, sendData) {
    let endpoint = "";

    if (verifyPermission(userPermissions, 'list-benchmarking-reporting'))
        endpoint = `/my/benchmarking-rapport`

    if (verifyTokenExpire()) {
        return axios.post(endpoint, sendData);
    }
}

// ClaimSystemUsageReport
export function systemUsageReport(userPermissions, sendData) {
    let endpoint = "";

    if (verifyPermission(userPermissions, 'list-system-usage-reporting'))
        endpoint = "/my/system-usage-rapport"

    if (verifyTokenExpire()) {
        return axios.post(endpoint, sendData)
    }
}

// HistoricRevivals
export function getHistoricRevivals(userPermissions, numberPerPage, page = null, id = null) {
    let endpoint = "";

    if (verifyPermission(userPermissions, 'list-unit-revivals')) {
        if (page)
            endpoint = `/revivals?size=${numberPerPage}&page=${page}`;
        else
            endpoint = `/revivals?size=${numberPerPage}`;
    }
    if (verifyPermission(userPermissions, 'list-staff-revivals') && id) {
        if (page)
            endpoint = `/revivals/staff/${id}?size=${numberPerPage}&page=${page}`;
        else
            endpoint = `/revivals/staff/${id}?size=${numberPerPage}`;
    }

    if (verifyTokenExpire()) {
        return axios.get(endpoint);
    }

}

export function getStaffs(userPermissions) {
    let endpoint = "";

    if (verifyPermission(userPermissions, 'show-my-staff-monitoring'))
        endpoint = `/my/unit-staff`;

    if (verifyTokenExpire())
        return axios.get(endpoint);
}

//MonitoringDetails
export function getClaimDetails(userPermissions, claimId) {
    let endpoint = "";

    endpoint = `claims/${claimId}`;
    
    if (verifyTokenExpire())
        return axios.get(endpoint);
}