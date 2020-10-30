import {LOGOUT_USER, UPDATE_USER} from "../actions/authActions";
import {logout} from "../../helpers/function";

const initialState = {
    user: {},
    token: "",
};

export default function (state = initialState, action) {
    let newState = {};
    switch (action.type) {
        case LOGOUT_USER:
            logout();
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
