import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/layouts/App.jsx';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router} from "react-router-dom";


ReactDOM.render(
    <Router>
        <App />
    </Router> , document.getElementById('root'));

serviceWorker.unregister();
