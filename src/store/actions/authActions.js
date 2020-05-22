export const CONNECT_USER = 'CONNECT_USER';
export const USER = 'USER';
export const LOGOUT_USER = "LOGOUT_USER";


export const connectUser = userData => {
    return { type: CONNECT_USER, userData: userData }
};

export const logoutUser = () => {
    return { type: LOGOUT_USER }
};