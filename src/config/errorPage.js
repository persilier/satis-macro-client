import {logout} from "../helpers/function";

export const ERROR_401 = "/error401";



export const redirectErrorPage = code => {
    if (code === 403 || code === 500)
        window.location.href = `/error${code}`;
    else if (code === 401)
        logout();
};
