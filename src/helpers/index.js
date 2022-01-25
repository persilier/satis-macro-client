import moment from "moment";

export const isTimeOut = (timeout = process.env.REACT_APP_SESSION_TIMEOUT) => {
  let savedTimeout =
    parseInt(localStorage.getItem("DTimeout")) || moment().format("x");
  let currentTimeOut = moment().format("x");
  if (currentTimeOut - savedTimeout < timeout) {
    localStorage.setItem("DTimeout", moment().format("x"));
    return false;
  }   
  return true;
};
