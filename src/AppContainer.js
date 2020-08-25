import React, {Component} from "react";
import NatureAppChoice from "./NatureAppChoice";
import {connect} from "react-redux";
import Echo from "laravel-echo";
import RouteApp from "./routeApp";
import {loadPlan} from "./store/actions/planAction";
import appConfig from "./config/appConfig";
import {AUTH_TOKEN} from "./constants/token";
window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'e0acb5bac6ddb3b710f4',
    cluster: 'mt1',
    forceTLS: false,
    wsHost: appConfig.host,
    wsPort: localStorage.getItem("plan") === "PRO" ? 6003 : 6001,
    disableStats: true,
    authEndpoint: appConfig.apiDomaine+'/api/broadcasting/auth',
    auth: {
        headers: {
            Authorization: AUTH_TOKEN
        }
    }
});

class AppContainer extends Component{
    constructor(props) {
        super(props);
        if (localStorage.getItem("plan"))
            this.props.loadPlan(localStorage.getItem("plan"))
    }

    render() {
        const {plan} = this.props.plan;
        return (
            !plan ? (
                <NatureAppChoice/>
            ) : (
                <RouteApp/>
            )
        );
    }
}

const mapStateToProps = (state) => {
    return {
        plan: state.plan
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadPlan: (plan) => dispatch(loadPlan(plan))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
