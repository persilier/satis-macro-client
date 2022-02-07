import appConfig from "../config/appConfig";
import { logout } from "../helpers/function";
import { isTimeOut } from "../helpers";
import { logoutUser } from "./crud";

export default function setupAxios(axios, store) {
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("token");
            config.baseURL = appConfig.apiDomaine;
            config.headers.post["Content-Type"] = "application/json";
            config.headers.post["X-Content-Type-Options"] = "nosniff";
            config.headers.post["X-XSS-Protection"] = "1; mode=block";
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (err) => Promise.reject(err)
    );

/*    axios.interceptors.response.use(
        (response) => {
            if (isTimeOut()) {
                logoutUser()
                    .then(({ data }) => {
                        console.log(data);
                        console.log("TIME_IS_OUT!!!!");
                        logout();
                    })
                    .catch(console.log);
                return response;
            }
            return response;
        },
        (error) => {
            if (isTimeOut()) {
                logoutUser()
                    .then(({ data }) => {
                        console.log(data);
                        console.log("TIME_IS_OUT!!!!");
                        logout();
                    })
                    .catch(console.log);
                return Promise.reject(error);
            }
            if (401 === error.response.status || 498 === error.response.status) {
                console.log("CHECK WITH BACKEND EXPIRED TOKEN CODE");
            }
            return Promise.reject(error);
        }
    );*/
}
