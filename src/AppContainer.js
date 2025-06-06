import React, {Component} from "react";
import NatureAppChoice from "./NatureAppChoice";
import {connect} from "react-redux";
import Echo from "laravel-echo";
import RouteApp from "./routeApp";
import {loadPlan} from "./store/actions/planAction";
import {loadYear} from "./store/actions/yearAction";
import appConfig from "./config/appConfig";
import {AUTH_TOKEN} from "./constants/token";
import axios from "axios";
import Loader from "./views/components/Loader";
import ls from 'localstorage-slim'

window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'e0acb5bac6ddb3b710f4',
    cluster: 'mt1',
    forceTLS: false,
    wsHost: appConfig.host,
    wsPort: appConfig.port,
    disableStats: true,
    authEndpoint: appConfig.apiDomaine + '/api/broadcasting/auth',
    auth: {
        headers: {
            Authorization: AUTH_TOKEN
        }
    }
});

class AppContainer extends Component {
    constructor(props) {
        super(props);
        if (ls.get("plan"))
            this.props.loadPlan(ls.get("plan"));
        this.state = {
            load: true
        };
    }

    componentDidMount() {
        axios.get(`${appConfig.apiDomaine}/plan`)
            .then(response => {
                this.setState({load: false});
                ls.set('plan', response.data.plan);
                if (response.data.year_installation!==null){
                    ls.set('year_installation', response.data.year_installation);
                }
                this.props.loadPlan(response.data.plan);
                this.props.loadYear(response.data.year_installation!==null?response.data.year_installation:"")
            })
            .catch(error => {
                this.setState({load: false});
                console.log("Something is wrong");
            });
    }

    render() {
        const plan = this.props.plan;
        const load = this.state.load;
        return (
            !plan ? (
                load ? (
                        <Loader/>
                    ) :
                    <NatureAppChoice/>
            ) : (
                <RouteApp/>
            )
        );
    }
}

const mapStateToProps = (state) => {
    return {
        plan: state.plan.plan
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadPlan: (plan) => dispatch(loadPlan(plan)),
        loadYear: (plan) => dispatch(loadYear(plan))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
