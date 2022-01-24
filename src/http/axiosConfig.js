import appConfig from "../config/appConfig";
import { logout } from "../helpers/function";

export default function setupAxios(axios, store) {
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("token");
            config.baseURL = appConfig.apiDomaine;
            config.headers.post["Content-Type"] = "application/json";
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (err) => Promise.reject(err)
    );

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (window.location.pathname !== '/login') {
                if (new Date() > new Date(localStorage.getItem("date_expire"))) {
                    logout();
                }
                if (401 === error.response.status || 498 === error.response.status) {
                    console.log("CHECK WITH BACKEND EXPIRED TOKEN CODE");
                } else {
                    return Promise.reject(error);
                }
            } else {
                return Promise.reject(error);
            }
        }
    );
}
