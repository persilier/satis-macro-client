import {logout} from "../helpers/function";

export const verifyExpiration = () => {
    if (new Date() > new Date(localStorage.getItem('date_expire'))) {
        logout();
        return true;
    }
    else
        refreshToken();
};

export const refreshToken = async () => {
    await axios.get(``)
        .then(() => {

        })
        .catch(() => {
            console.log("Something is wrong");
        })
    ;
};
