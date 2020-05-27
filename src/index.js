import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {createStore, combineReducers} from "redux";
import {Provider} from "react-redux";
import {composeWithDevTools} from "redux-devtools-extension";
import * as serviceWorker from './serviceWorker';
import languageReducer from "./store/reducers/languageReducer";
import identiteReducer from "./store/reducers/IdentiteReducer";
import authReducer from "./store/reducers/authReducer";
import planReducer from "./store/reducers/planReducer";
import AppContainer from "./AppContainer";

const rootReducer = combineReducers({
    identite: identiteReducer,
    language: languageReducer,
    user: authReducer,
    plan: planReducer
});


const store = createStore(rootReducer, composeWithDevTools());

ReactDOM.render(
    <Provider store={store}>
        <AppContainer/>
    </Provider>, document.getElementById('root')
);

serviceWorker.unregister();
