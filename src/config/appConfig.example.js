const publicDomain = `http://127.0.0.1`;
const privateDomain = `http://127.0.0.1`;
const appConfig = {
  version: "2020.1",
  name: "SATIS",
  appFullName: (plan, year) => `SATIS ${plan} ${year} 2020.1`,
  enterprise: "DMD",
  contact: "21256325",
  timeAfterDisconnection: 8,
  apiDomaine:
    appHost !== publicDomain ? `${publicDomain}:8000` : `${privateDomain}:8000`,
  host: `host`,
  port: 8000,
  language: "fr",
  useManyLanguage: "false",
  listConnectData: {
    PRO: {
      grant_type: "grant_type",
      client_id: 2,
      client_secret: "client_secret",
      username: "username",
      password: "password",
    },
    HUB: {
      grant_type: "grant_type",
      client_id: 2,
      client_secret: "client_secret",
      username: "username",
      password: "password",
    },
    MACRO: {
      grant_type: "grant_type",
      client_id: 2,
      client_secret: "client_secret",
      username: "username",
      password: "password",
    },
  },
};
export default appConfig;
