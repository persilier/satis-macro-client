const appConfig =  {
    version: "2020.1",
    name: 'Satis',
    // appFullName: "SatisFinTech SA"+" "+ new Date().getFullYear() ,
    appFullName: (year) => `Satis FinTech SA  ${year}`,
    enterprise: 'DMD',
    contact: '21256325',
    timeAfterDisconnection: 8,
    host: `satis-pro.local`,
    apiDomaine: `http://satis-pro.local`,
    port: 6001
};

export default appConfig;
