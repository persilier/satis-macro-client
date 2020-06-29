import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers} from "redux";
import {Provider} from "react-redux";
import {composeWithDevTools} from "redux-devtools-extension";
import * as serviceWorker from './serviceWorker';
import languageReducer from "./store/reducers/languageReducer";
import identityReducer from "./store/reducers/IdentityReducer";
import authReducer from "./store/reducers/authReducer";
import planReducer from "./store/reducers/planReducer";
import treatmentReducer from "./store/reducers/treatmentReducer";
import AppContainer from "./AppContainer";

const rootReducer = combineReducers({
    identity: identityReducer,
    language: languageReducer,
    user: authReducer,
    plan: planReducer,
    treatment:treatmentReducer
});


const store = createStore(rootReducer, composeWithDevTools());

ReactDOM.render(
    <Provider store={store}>
        <AppContainer/>
    </Provider>, document.getElementById('root')
);

serviceWorker.unregister();
