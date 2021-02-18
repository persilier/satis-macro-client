const appConfig =  {
    version: "2020.1",
    name: 'Satis',
    // appFullName: "SatisFinTech SA"+" "+ new Date().getFullYear() ,
    appFullName: (year) => `Satis FinTech SA  ${year}`,
    enterprise: 'DMD',
    contact: '21256325',
    timeAfterDisconnection: 8,
    host: `satis-hub.local`,
    apiDomaine: `http://satis-hub.local`,
    port: 6001
};

export default appConfig;
