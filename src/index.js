import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import * as serviceWorker from './serviceWorker';
import App from './views/layouts/App.jsx';
import LoginPage from "./modules/login/views/Pages/LoginPage.jsx";
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import identiteReducer from "./store/reducers/Identite";

const rootReducers = combineReducers({
    identite: identiteReducer,
});
const store = createStore(rootReducers);

const login = true;

ReactDOM.render(
    <Provider store={store}>
        <Router>
            {
                !login ? (
                    <LoginPage />
                ) : (
                    <App/>
                )
            }
        </Router>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
