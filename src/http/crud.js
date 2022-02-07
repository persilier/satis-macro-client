import axios from "axios";

//AUTH
export function resetPassword(input) {
    return axios.put(`/change-password`, input);
}

export function logoutUser(){
    return axios.get(`/logout`)
}

// get method
export function getMethod(endpoint) {
    return axios.get(endpoint)
}

// post method
export function postMethod(endpoint, data) {
    return axios.post(endpoint, data)
}

// put method
export function putMethod(endpoint, data) {
    return axios.put(endpoint)
}

// delete method
export function deleteMethod(endpoint) {
    return axios.delete(endpoint)
}