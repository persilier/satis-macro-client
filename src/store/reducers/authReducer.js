import {ADD_USER_INFO_TO_STORE, CONNECT_USER, LOGOUT_USER} from "../actions/authActions";

const initialState = {
    user: {},
    token:"",
    isLogin: false,};

export default function(state = initialState, action) {
    let newState = {};
    switch (action.type) {
        case CONNECT_USER:
            newState = {
                user: action.userData.name,
                token:action.userData.access_token,
                isLogin: true,
            };
            console.log();
            localStorage.setItem('isLogin', newState.isLogin);
            localStorage.setItem('userName', newState.user);
            localStorage.setItem('token', newState.token);
            // window.location.reload();
            return newState;
        case ADD_USER_INFO_TO_STORE:
            newState = {
                user: {
                    name: action.userInfo.name,
                },
                isLogin: action.userInfo.isLogin,
                token:action.userInfo.token
            };
            return newState;
        case LOGOUT_USER:
            newState= {
                user: {},
                isLogin: false,
            };
            localStorage.clear();
            window.location.reload();
            return newState;
        default:
            return state;
    }
}