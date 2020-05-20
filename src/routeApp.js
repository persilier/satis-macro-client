import React, {Component} from 'react';
import {BrowserRouter as Router, Route,Switch, Redirect} from "react-router-dom";
import LoginPage from "./modules/login/views/Pages/LoginPage.jsx";
import App from "./views/layouts/App";
import {connect} from 'react-redux';
import {addUserInfoToStore} from "./store/actions/authActions";

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
            this.props.addUserInfoToStore(userInfo);
        }
    }

    connect=(userInfo)=>{
        this.props.addUserInfoToStore(userInfo)
    };

    render() {
        // const login=false;
        const isLogin = this.props.user.isLogin;
        const token= this.props.user.token;
        console.log(isLogin);
        console.log("token",token);
        console.log(this.props.user , "user");
        return (
            <Router>
                <Switch>
                    <Route exact path="/login">
                        { isLogin ? <Redirect to={"/"}/> : <LoginPage connectUser={connect} /> }
                    </Route>
                    <Route path={"*"}>
                        { !isLogin ? <App/> : <Redirect to={"/login"}/> }
                    </Route>
                </Switch>
            </Router>
        );
    }
}

const mapStateToProps = state => {
    console.log('mapStateToProps', state);
    return {
        user: state.user,
    }
};

export default connect(mapStateToProps, {addUserInfoToStore}) (RouteApp);