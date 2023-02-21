import ls from "localstorage-slim";

ls.config.encrypt = true;

export const AUTH_TOKEN = `Bearer ${ls.get("token")}`;
