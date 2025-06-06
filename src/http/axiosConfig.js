import appConfig from "../config/appConfig";
import { logout, script_appender } from "../helpers/function";
import { isTimeOut } from "../helpers";
import { logoutUser } from "./crud";
import { ExpirationConfirmation } from "../views/components/ConfirmationAlert";
import { ExpireConfig } from "../config/confirmConfig";
import i18n from "i18next";
import ls from "localstorage-slim";

export default function setupAxios(axios, store) {
  axios.defaults.withCredentials = true;
  axios.interceptors.request.use(
    (config) => {
      const token = ls.get("token");
      config.baseURL = appConfig.apiDomaine;
      config.headers.post["Content-Type"] = "application/json";
      // config.headers.post["X-Content-Type-Options"] = "nosniff";
      // config.headers.post["X-XSS-Protection"] = "1; mode=block";
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (err) => Promise.reject(err)
  );

  axios.interceptors.response.use(
    (response) => {
      script_appender("/assets/js/jquery.tablesorter.min.js");
      script_appender("/assets/js/main.js");

      if (window.location.href !== "/login") {
        if (ls.get("userData") !== null) {
          if (isTimeOut()) {
            logoutUser()
              .then(({ data }) => {
                localStorage.removeItem("userData");
                ExpirationConfirmation.fire(
                  ExpireConfig(
                    i18n.t(
                      "Par suite d'inactivité de votre compte, vous avez été déconnecté(e), veuillez vous reconnecter."
                    )
                  )
                ).then((res) => {
                  if (res.value) {
                    logout();
                  }
                });
              })
              .catch(console.log);

            return response;
          }
        }
      }
      return response;
    },
    (error) => {
      if (window.location.href !== "/login") {
        if (ls.get("userData") !== null) {
          if (isTimeOut()) {
            logoutUser()
              .then(({ data }) => {
                localStorage.removeItem("userData");
                ExpirationConfirmation.fire(
                  ExpireConfig(
                    i18n.t(
                      "Vous avez été déconnecter pour durer d'inactivité de votre compte, veuillez vous reconnecter"
                    )
                  )
                ).then((res) => {
                  if (res.value) {
                    //  logout();
                  }
                });
              })
              .catch(console.log);
            return Promise.reject(error);
          }
          if (error.response.status === 401) {
            console.log(error.response.status);
            //  logout();
          }
        }
      }

      return Promise.reject(error);
    }
  );
}
