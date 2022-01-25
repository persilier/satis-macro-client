import appConfig from "../config/appConfig";
import { logout } from "../helpers/function";
import { isTimeOut } from "../helpers";
import { logoutUser } from "./crud";

export default function setupAxios(axios, store) {
  axios.interceptors.request.use(
    (config) => {
      if (isTimeOut()) {
        /*logoutUser()
          .then(({ data }) => {
            console.log(data);
            console.log("TIME_IS_OUT!!!!");
            logout();
          })
          .catch(console.log);*/
      }
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
      if (401 === error.response.status || 498 === error.response.status) {
        console.log("CHECK WITH BACKEND EXPIRED TOKEN CODE");
      } else {
        return Promise.reject(error);
      }
    }
  );
}
