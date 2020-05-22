export const CONNECT_USER = 'CONNECT_USER';
export const USER = 'USER';
export const ADD_USER_INFO_TO_STORE = 'ADD_USER_INFO_TO_STORE';

export const connectUser = userData => {
    return { type: CONNECT_USER, userData: userData }
};

