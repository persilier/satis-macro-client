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