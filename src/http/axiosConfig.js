import appConfig from "../config/appConfig";

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
}
