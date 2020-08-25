const appConfig =  {
    version: "2020.1",
    name: 'SATIS',
    appFullName: (plan) => `SATIS ${plan} 2020.1`,
    enterprise: 'DMD',
    contact: '21256325',
    apiDomaine: `http://satis-${localStorage.getItem('plan') ? localStorage.getItem('plan').toLowerCase() : ""}.local`,
    host: `satis-${localStorage.getItem('plan') ? localStorage.getItem('plan').toLowerCase() : ""}.local`,
};

export default appConfig;
