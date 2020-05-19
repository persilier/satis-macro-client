import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {createStore, combineReducers} from "redux";
import {Provider} from "react-redux";
import {composeWithDevTools} from "redux-devtools-extension";
import * as serviceWorker from './serviceWorker';
import App from './views/layouts/App.jsx';
import LoginPage from "./modules/login/views/Pages/LoginPage.jsx";
import languageReducer from "./store/reducers/languageReducer";
import identiteReducer from "./store/reducers/IdentiteReducer";

const rootReducer = combineReducers({
    identite: identiteReducer,
    language: languageReducer
});

const login = false;
const store = createStore(rootReducer, composeWithDevTools());

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route exact path="/login">
                    { login ? <Redirect to={"/dashboard"}/> : <LoginPage /> }
                </Route>
                <Route path={"*"}>
                    { login ? <App/> : <Redirect to={"/login"}/> }
                </Route>
            </Switch>
        </Router>
    </Provider>, document.getElementById('root')
);

serviceWorker.unregister();
