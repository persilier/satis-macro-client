import React, {Component} from 'react';
import {BrowserRouter as Router, Route,Switch, Redirect} from "react-router-dom";
import LoginPage from "./modules/login/views/Pages/LoginPage.jsx";
import App from "./views/layouts/App";
import {connect} from 'react-redux';
import {connectUser, updateUser} from "./store/actions/authActions";

class RouteApp extends Component {
    componentDidMount() {
        if (localStorage.getItem('isLogin')) {
            this.props.updateUser();
        }
    }

    connect=(userInfo)=>{
        this.props.connectUser(userInfo)
    };

    render() {
        const isLogin = this.props.user.isLogin;
        return (
            <Router>
                {
                    !isLogin ? (
                        <LoginPage connectUser={connect} />
                    ) : <App/>
                }
            </Router>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        connectUser: userData => {
            dispatch(connectUser(userData))
        },
        updateUser: () => {
            dispatch(updateUser())
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps) (RouteApp);
