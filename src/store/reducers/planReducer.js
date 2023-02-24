import {CHANGE_PLAN, LOAD_PLAN} from "../actions/planAction";
import ls from 'localstorage-slim'

const initialState = {
    plan: undefined,
};

const planReducer = (state = initialState, action) => {
    ls.config.encrypt = true;
    switch (action.type) {
        case CHANGE_PLAN:
            ls.set('plan', action.plan);
            window.location.href = "/login";
            return {
                plan: action.plan
            };
        case LOAD_PLAN:
            return {
                plan: action.plan
            };
        default :
            return state;
    }
};

export default planReducer;
