import appConfig from "../config/appConfig";
import { logout } from "../helpers/function";
import {isTimeOut} from "../helpers";

export default function setupAxios(axios, store) {
<<<<<<< HEAD
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("token");
            config.baseURL = appConfig.apiDomaine;
            config.headers.post["Content-Type"] = "application/json";
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
=======
  axios.interceptors.request.use(
    (config) => {
      if(isTimeOut()){
        console.log("TIME_IS_OUT!!!!")
        logout();
      }
      const token = localStorage.getItem("token");
      config.baseURL = appConfig.apiDomaine;
      config.headers.post["Content-Type"] = "application/json";
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
>>>>>>> 162be4624f8b5563c241f4d43ddeca566d7003bb

            return config;
        },
        (err) => Promise.reject(err)
    );

<<<<<<< HEAD
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
=======
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {

      if (401 === error.response.status || 498 === error.response.status) {
        console.log("CHECK WITH BACKEND EXPIRED TOKEN CODE");
      } else {
        return Promise.reject(error);
      }
    }
  );
>>>>>>> 162be4624f8b5563c241f4d43ddeca566d7003bb
}
