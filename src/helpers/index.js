import moment from "moment";
import ls from 'localstorage-slim'

export const isTimeOut = (timeout = process.env.REACT_APP_SESSION_TIMEOUT) => {
  let savedTimeout = parseInt(ls.get("DTimeout")) || moment().format("x");
  let currentTimeOut = moment().format("x");


  if (currentTimeOut - savedTimeout < timeout) {
    ls.set("DTimeout", moment().format("x"));
    return false;
  }   
  return true;
};
