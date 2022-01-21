import moment from "moment";

export const isTimeOut = () => {
  let savedTimeout =
    parseInt(localStorage.getItem("DTimeout")) ||
    moment()
      .add(120, "seconds")
      .format("x");
      
  console.log("savedTimeout", savedTimeout);
  let currentTimeOut = moment().format("x");
  console.log("currentTimeOut", currentTimeOut);
  if (savedTimeout > currentTimeOut && savedTimeout - currentTimeOut > 60000) {
    localStorage.setItem(
      "DTimeout",
      moment(savedTimeout, "x")
        .add(60, "seconds")
        .format("x")
    );
    return false;
  } else {
    return true;
  }
};
