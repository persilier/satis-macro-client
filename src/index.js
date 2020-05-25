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
import RouteApp from "./routeApp";
import NatureAppChoice from "./NatureAppChoice";

const rootReducer = combineReducers({
    identite: identiteReducer,
    language: languageReducer,
    user: authReducer,
});


const store = createStore(rootReducer, composeWithDevTools());

const choice = undefined;

ReactDOM.render(
    <Provider store={store}>
        {
            !choice ? (
                <RouteApp/>
            ) : (
                <RouteApp/>
            )
        }
    </Provider>, document.getElementById('root')
);

serviceWorker.unregister();
