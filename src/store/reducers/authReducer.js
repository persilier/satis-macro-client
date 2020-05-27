import {CONNECT_USER, LOGOUT_USER, UPDATE_USER} from "../actions/authActions";

const initialState = {
    user: {},
    token: "",
    isLogin: false,
};

export default function (state = initialState, action) {
    let newState = {};
    switch (action.type) {
        case CONNECT_USER:
            newState = {
                user: action.userData.user,
                token:action.userData.token,
                isLogin: true,
            };
            window.location.href = "/dashboard";
            return newState;
        case LOGOUT_USER:
            newState= {
                user: {},
                isLogin: false,
            };
            const plan = localStorage.getItem('plan');
            localStorage.clear();
            localStorage.setItem('plan', plan);
            window.location.href = "/login";
            return newState;
        case UPDATE_USER:
            newState={
                user: JSON.parse(localStorage.getItem('userData')),
                isLogin:localStorage.getItem('isLogin'),
                token:localStorage.getItem('token')
            };
            return newState;
        default:
            return state;
    }
}
