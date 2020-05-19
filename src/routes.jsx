import React, {useEffect} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {connect} from 'react-redux';
import App from "./views/layout/App";
import LoginPage from "./appAuthModule/views/containers/LoginPage";
import * as authActions from "./store/actions/authActions";
import Configuration from "./views/container/Configuration";


class routes extends React.Component{
    componentDidMount() {

        if (localStorage.getItem('isLogin')) {
            const userInfo = {
                user: {
                    name: localStorage.getItem('userName'),
                },
                isLogin: localStorage.getItem('isLogin'),
                token: localStorage.getItem('token'),
            };
            this.props.addUserInfoToStore(userInfo);
        }
    }
    connect=(userInfo)=>{
        this.props.addUserInfoToStore(userInfo)
    };
    render() {
        const isLogin = this.props.user.isLogin;
        const token= this.props.user.token;
        console.log(isLogin);
        console.log("token",token);
        console.log(this.props.user);
        return (
            <Router>
                <Switch>
                    <Route exact path="/login">
                        { isLogin ? <Redirect to={"/"}/> : <LoginPage onChangeConnected={this.connect}/> }
                    </Route>
                    <Route path={"*"}>
                        { isLogin ? <App/> : <Redirect to={"/login"}/> }
                    </Route>
                </Switch>
            </Router>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addUserInfoToStore: userInfo => dispatch(authActions.addUserInfoToStore(userInfo))
    }
};

const mapStateToProps = state => {
    console.log('mapStateToProps', state);
    return {
        user: state.user,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(routes);