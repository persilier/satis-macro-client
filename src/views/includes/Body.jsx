import React from "react";
import {
  Switch,
  Route,
  useParams
} from "react-router-dom";
import SMS from "../pages/SMS";
import Mail from "../pages/Mail";
import PerformanceIndicator from "../pages/PerformanceIndicator";
import PerformanceEditForm from "../components/PerformanceEditForm";
import PerformanceAddForm from "../components/PerformanceAddForm";

const Body = () => {
    return (
        <Switch>
            <Route exact path="/">
                <SMS/>
            </Route>

            <Route exact path="/settings/sms">
                <SMS/>
            </Route>

            <Route exact path="/settings/mail">
                <Mail/>
            </Route>

            <Route exact path="/settings/performance_indicator">
                <PerformanceIndicator/>
            </Route>

            <Route excat path="/settings/performance_indicator/add">
                <PerformanceAddForm/>
            </Route>

            <Route excat path="/settings/performance_indicator/detail">
                <h1>Détail</h1>
            </Route>

            <Route excat path="/settings/performance_indicator/:id/edit">
                <PerformanceEditForm/>
            </Route>

            <Route exact path="/settings/unit_type">

            </Route>
        </Switch>
    );
};

export default Body;
