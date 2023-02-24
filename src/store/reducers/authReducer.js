import {LOGOUT_USER, UPDATE_USER} from "../actions/authActions";
import {logout} from "../../helpers/function";
import ls from 'localstorage-slim';

const initialState = {
    user: {},
    token: "",
};

export default function (state = initialState, action) {

    ls.config.encrypt = true;
    let newState = {};
    switch (action.type) {
        case LOGOUT_USER:
            logout();
            break;
        case UPDATE_USER:
            newState = {
                user: JSON.parse(ls.get('userData')),
                staff: ls.get('staffData'),
                isLogin: ls.get('isLogin'),
                token: ls.get('token'),
                refresh_token: ls.get('refresh_token'),
                expire_in: ls.get('expire_in')
            };
            return newState;
        default:
            return state;
    }
}
