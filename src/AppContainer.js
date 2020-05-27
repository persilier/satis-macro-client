import React, {Component} from "react";
import NatureAppChoice from "./NatureAppChoice";
import {connect} from "react-redux"
import RouteApp from "./routeApp";
import {loadPlan} from "./store/actions/planAction";

class AppContainer extends Component{
    componentDidMount() {
        if (localStorage.getItem("plan")) {
            this.props.loadPlan(localStorage.getItem("plan"))
        }
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
