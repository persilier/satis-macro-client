import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import * as serviceWorker from './serviceWorker';
import AppContainer from "./AppContainer";
import setupAxios from "./http/axiosConfig";
import axios from "axios";
import store from "./store";

setupAxios(axios, store);

ReactDOM.render(
    <Provider store={store}>
        <AppContainer/>
    </Provider>, document.getElementById('root')
);

serviceWorker.unregister();
