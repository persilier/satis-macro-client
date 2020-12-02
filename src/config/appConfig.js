const appConfig =  {
    version: "2020.1",
    name: 'SATIS',
    appFullName: (plan) => `SATIS ${plan} 2020.1`,
    enterprise: 'DMD',
    contact: '21256325',
    timeAfterDisconnection: 8,
    apiDomaine: `http://satis-${localStorage.getItem('plan') ? localStorage.getItem('plan').toLowerCase() : ""}.local`,
    host: `satis-${localStorage.getItem('plan') ? localStorage.getItem('plan').toLowerCase() : ""}.local`,
    port: localStorage.getItem("plan") === "PRO" ? 6003 : localStorage.getItem("plan") === "HUB" ? 6002 : 6001
};

export default appConfig;
