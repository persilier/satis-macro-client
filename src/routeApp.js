import React, {Component} from 'react';
import {BrowserRouter as Router, Route,Switch, Redirect} from "react-router-dom";
import LoginPage from "./modules/login/views/Pages/LoginPage.jsx";
import App from "./views/layouts/App";
import {connect} from 'react-redux';
import {connectUser} from "./store/actions/authActions";

class RouteApp extends Component {
    componentDidMount() {

        if (localStorage.getItem('isLogin')) {
            const userInfo = {
                user: {
                    name: localStorage.getItem('userName'),
                },
                isLogin: localStorage.getItem('isLogin'),
                token: localStorage.getItem('token'),
            };
            this.props.connectUser(userInfo);
        }
    }

    connect=(userInfo)=>{
        this.props.connectUser(userInfo)
    };

    render() {
        // const login=false;
        const isLogin = this.props.user.isLogin;
        return (
            <Router>
                <Switch>
                    <Route exact path="/login">
                        { isLogin ? <Redirect to={"/"}/> : <LoginPage connectUser={connect} /> }
                    </Route>
                    <Route path={"/"}>
                        { isLogin ? <App/> : <Redirect to={"/login"}/> }
                    </Route>
                </Switch>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps) (RouteApp);