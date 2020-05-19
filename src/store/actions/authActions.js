export const CONNECT_USER = 'CONNECT_USER';
export const ADD_USER_INFO_TO_STORE = 'ADD_USER_INFO_TO_STORE';
export const LOGOUT_USER = "LOGOUT_USER";

export const connectUser = userData => {
    return { type: CONNECT_USER, userData: userData }
};

export const addUserInfoToStore = userInfo => {
    return { type: ADD_USER_INFO_TO_STORE, userInfo: userInfo }
};

export const logoutUser = () => {
    return { type: LOGOUT_USER }
};