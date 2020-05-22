import { CONNECT_USER, LOGOUT_USER} from "../actions/authActions";

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
                user:{
                   username: action.userData.user.username
                },
                token:action.userData.token,
                isLogin: true,
            };
            localStorage.setItem('user', newState.user.username);
            localStorage.setItem('token', newState.token);
            localStorage.setItem('isLogin', newState.isLogin);
            // window.location.reload();
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