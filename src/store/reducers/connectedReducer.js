import { CONNECTED_USER } from "../actions/connectedAction";

const initialState = {
    isConnected: false,
};

const connectedReducer = (state = initialState, action) => {
    switch (action.type) {
        case CONNECTED_USER:
            return {
                year: action.year
            };
        default :
            return state;
    }
};

export default connectedReducer;
