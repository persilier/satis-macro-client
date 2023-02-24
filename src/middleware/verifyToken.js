import {logout} from "../helpers/function";
import ls from 'localstorage-slim'

export const verifyTokenExpire = () => {
    if (new Date() > new Date(ls.get('date_expire'))) {
        logout();
        return false;
    }
    else {
        return true;
    }
};
