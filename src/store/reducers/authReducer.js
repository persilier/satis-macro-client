import {LOGOUT_USER, UPDATE_USER} from "../actions/authActions";

const initialState = {
    user: {},
    token: "",
};

export default function (state = initialState, action) {
    let newState = {};
    switch (action.type) {
        case LOGOUT_USER:
            const plan = localStorage.getItem('plan');
            localStorage.clear();
            localStorage.setItem('plan', plan);
            window.location.href = "/login";
            break;
        case UPDATE_USER:
            newState={
                user: JSON.parse(localStorage.getItem('userData')),
                staff: localStorage.getItem('staffData'),
                isLogin:localStorage.getItem('isLogin'),
                token:localStorage.getItem('token')
            };
            return newState;
        default:
            return state;
    }
}
