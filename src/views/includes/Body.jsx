import React from "react";
import {
  Switch,
  Route,
} from "react-router-dom";
import InstitutionPage from "../pages/InstitutionPage";
import FAQPage from "../pages/FAQPage";
import FAQS from "../pages/FAQS";
import FaqCategoryDataTable from "../pages/FaqCategoryDataTable";
import DataTable from "../components/DataTable";
import UpdateFaqCategory from "../components/UpdateFaqCategory";
import UpdateFaq from "../components/UpdateFaq";
import UpdateInstitution from "../components/UpdateInstitution";
import CategoryClientPage from "../pages/CategoryClientPage";
import ClientPage from "../pages/ClientPage";
import UpdateCategoryClient from "../components/UpdateCategoryClient";
import TypeClientPage from "../pages/TypeClientPage";
import UpdateTypeClient from "../components/UpdateTypeClient";


const Body = () => {
    return (
        <Switch>
            <Route exact path="/">
                <FAQPage/>
            </Route>
            <Route exact path="/settings/sms">
                <h1>Coucou!!!</h1>
            </Route>
            <Route exact path="/settings/institution">
                <InstitutionPage/>
            </Route>
            <Route exact path="/settings/faq/category">
                <FaqCategoryDataTable/>
            </Route>
            <Route exact path="/settings/faq/addfaq">
                <FAQS/>
            </Route>
            <Route exact path="/settings/client">
                <ClientPage/>
            </Route>
            <Route exact path={`/settings/faq/category/:categoryelemtslug`}>
                <UpdateFaqCategory/>
            </Route>
            <Route exact path={`/settings/client/category/:categoryelemtid`}>
                <UpdateCategoryClient/>
            </Route>
            <Route exact path={`/settings/faq/:faqelemtslug`}>
                <UpdateFaq/>
            </Route>
            <Route exact path={`/settings/client/type/:typeelemtid`}>
                <UpdateTypeClient/>
            </Route>
            <Route exact path={`/settings/institution/:institutionelemtslug`}>
                <UpdateInstitution/>
            </Route>
            <Route exact path="/settings/faq">
                <FAQPage/>
            </Route>
            <Route exact path="/settings/client/category">
                <CategoryClientPage/>
            </Route>
            <Route exact path="/settings/client/type">
                <TypeClientPage/>
            </Route>
        </Switch>
    );
};

export default Body;
