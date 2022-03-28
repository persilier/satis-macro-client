const appConfig = {
    version: "2020.1",
    name: 'SATIS',
    appFullName: (plan) => `SATIS ${plan} 2020.1`,
    enterprise: 'DMD',
    contact: '21256325',
    timeAfterDisconnection: 8,
    apiDomaine: `http://url`,
    host: `host`,
    port: 8000,
    language: "fr",
    listConnectData: {
        PRO: {
            grant_type: "grant_type",
            client_id: 2,
            client_secret: "client_secret",
            username: "username",
            password: "password"
        },
        HUB: {
            grant_type: "grant_type",
            client_id: 2,
            client_secret: "client_secret",
            username: "username",
            password: "password"
        },
        MACRO: {
            grant_type: "grant_type",
            client_id: 2,
            client_secret: "client_secret",
            username: "username",
            password: "password"
        }
    }
};
export default appConfig

