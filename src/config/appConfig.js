const appConfig =  {
    version: "2020.1",
    name: 'Satis',
    // appFullName: "SatisFinTech SA"+" "+ new Date().getFullYear() ,
    appFullName: (year) => `Satis FinTech SA  ${year}`,
    enterprise: 'DMD',
    contact: '21256325',
    timeAfterDisconnection: 8,
    host:"satis-hub.local",
    // host: `satis-${localStorage.getItem('plan') ? localStorage.getItem('plan').toLowerCase() : ""}.local`,
    apiDomaine: `http://satis-pro.local`,
    port: localStorage.getItem("plan") === "PRO" ? 6003 : localStorage.getItem("plan") === "HUB" ? 6002 : 6001,
};

export default appConfig;
