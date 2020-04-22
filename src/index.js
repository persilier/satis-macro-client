import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import * as serviceWorker from './serviceWorker';
import App from './views/layouts/App.jsx';
import LoginPage from "./modules/login/views/Pages/LoginPage.jsx";

const login = true;

ReactDOM.render(
    <Router>
        {
            !login ? (
                <LoginPage />
            ) : (
                <App/>
            )
        }
    </Router>, document.getElementById('root')
);

serviceWorker.unregister();
