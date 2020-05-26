import React from "react";
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import SMS from "../pages/SMS";
import Mail from "../pages/Mail";
import PerformanceIndicator from "../pages/PerformanceIndicator";
import UnitType from "../pages/UnitType";
import Unit from "../pages/Unit";
import Position from "../pages/Position";
import Staff from "../pages/Staff";
import ClaimCategory from "../pages/ClaimCategory";
import ClaimObject from "../pages/ClaimObject";
import FAQs from "../pages/FAQs";
import FAQsPage from "../pages/FAQsPage";
import CategoryFAQs from "../pages/CategoryFAQs";
import Institution from "../pages/Institution";
import CategoryFaqsForm from "../components/CategoryFaqsForm";
import FaqsForm from "../components/FaqsForm.jsx";
import CategoryClient from "../pages/CategoryClient";
import TypeClient from "../pages/TypeClient";
import CategoryClientForm from "../components/CategoryClientForm";
import TypeClientForm from "../components/TypeClientForm";
import Clients from "../pages/Clients";
import ClientForm from "../components/Clients/ClientForm";
import TestPagination from "../pages/TestPagination";
import SeverityLevel from "../pages/SeverityLevel";
import UnitTypeForm from "../components/UnitTypeForm";
import PerformanceIndicatorForm from "../components/PerformanceIndicatorForm";
import UnitForm from "../components/UnitForm";
import PositionForm from "../components/PositionForm";
import ClaimCategoryForm from "../components/ClaimCategoryForm";
import ClaimObjectForm from "../components/ClaimObjectForm";
import StaffForm from "../components/staff/StaffForm";
import SeverityLevelForm from "../components/SeverityLevelForm";
import InstitutionForm from "../components/Institutions/InstitutionForm";
import TypeInstitutionsForm from "../components/Institutions/TypeInstitutionsForm";
import TypeInstitution from "../pages/TypeInstitution";

const Body = () => {
    return (
        <Switch>
            <Route exact path="/settings/sms">
                <SMS/>
            </Route>

            <Route exact path="/settings/clients/category">
                <CategoryClient/>
            </Route>

            <Route exact path="/settings/clients/category/add">
                <CategoryClientForm/>
            </Route>

            <Route exact path="/settings/clients/type">
                <TypeClient/>
            </Route>

            <Route exact path="/settings/clients/type/add">
                <TypeClientForm/>
            </Route>

            <Route exact path="/settings/faqs/add">
                <FAQs/>
            </Route>

            <Route exact path="/settings/faqs/list">
                <FAQsPage/>
            </Route>

            <Route exact path="/settings/faqs/faq/add">
                <FaqsForm/>
            </Route>

            <Route exact path="/settings/faqs/category">
                <CategoryFAQs/>
            </Route>
            <Route exact path="/settings/faqs/category/add">
                <CategoryFaqsForm/>
            </Route>

            <Route exact path="/settings/mail">
                <Mail/>
            </Route>

            <Route exact path="/settings/institution">
                <Institution/>
            </Route>

            <Route exact path="/settings/clients">
                <Clients/>
            </Route>

            <Route exact path="/settings/clients/add">
                <ClientForm/>
            </Route>

            <Route exact path="/settings/institution/add">
                <InstitutionForm/>
            </Route>

            <Route exact path="/settings/institution/edit/:editinstitutionlug">
                <InstitutionForm/>
            </Route>
            <Route exact path="/settings/institution/type">
                <TypeInstitution/>
            </Route>
            <Route exact path="/settings/institution/type/add">
                <TypeInstitutionsForm/>
            </Route>

            <Route exact path="/settings/institution/type/edit/:edittypeid">
                <TypeInstitutionsForm/>
            </Route>

            <Route exact path="/settings/clients/edit/:editclientid">
                <ClientForm/>
            </Route>

            <Route exact path="/settings/faqs/category/edit/:editcategoryslug">
                <CategoryFaqsForm/>
            </Route>

            <Route exact path="/settings/faqs/faq/edit/:editfaqid">
                <FaqsForm/>
            </Route>

            <Route exact path="/settings/clients/type/edit/:edittypeid">
                <TypeClientForm/>
            </Route>

            <Route exact path="/settings/clients/category/edit/:editcategoryid">
                <CategoryClientForm/>
            </Route>


            <Route exact path="/settings/performance_indicator">
                <PerformanceIndicator/>
            </Route>

            <Route excat path="/settings/performance_indicator/add">
                <PerformanceIndicatorForm/>
            </Route>

            <Route excat path="/settings/performance_indicator/:id/edit">
                <PerformanceIndicatorForm/>
            </Route>

            <Route exact path="/settings/unit_type">
                <UnitType/>
            </Route>

            <Route exact path="/settings/unit_type/add">
                <UnitTypeForm/>
            </Route>

            <Route exact path="/settings/unit_type/:id/edit">
                <UnitTypeForm/>
            </Route>

            <Route exact path="/settings/unit">
                <Unit/>
            </Route>

            <Route exact path="/settings/unit/add">
                <UnitForm/>
            </Route>

            <Route exact path="/settings/unit/:id/edit">
                <UnitForm/>
            </Route>

            <Route exact path="/settings/positions">
                <Position/>
            </Route>

            <Route exact path="/settings/positions/add">
                <PositionForm/>
            </Route>

            <Route exact path="/settings/positions/:id/edit">
                <PositionForm/>
            </Route>

            <Route exact path="/settings/positions">
                <Position/>
            </Route>

            <Route exact path="/settings/positions/add">
                <PositionForm/>
            </Route>

            <Route exact path="/settings/positions/:id/edit">
                <PositionForm/>
            </Route>

            <Route exact path="/settings/claim_categories">
                <ClaimCategory/>
            </Route>

            <Route exact path="/settings/claim_categories/add">
                <ClaimCategoryForm/>
            </Route>

            <Route exact path="/settings/claim_categories/:id/edit">
                <ClaimCategoryForm/>
            </Route>

            <Route exact path="/settings/claim_objects">
                <ClaimObject/>
            </Route>

            <Route exact path="/settings/claim_objects/add">
                <ClaimObjectForm/>
            </Route>

            <Route exact path="/settings/claim_objects/:id/edit">
                <ClaimObjectForm/>
            </Route>

            <Route exact path="/settings/staffs">
                <Staff/>
            </Route>

            <Route exact path="/settings/staffs/add">
                <StaffForm/>
            </Route>

            <Route exact path="/settings/staffs/:id/edit">
                <StaffForm/>
            </Route>

            <Route exact path="/settings/test-pagination">
                <TestPagination/>
            </Route>

            <Route exact path="/settings/severities">
                <SeverityLevel/>
            </Route>

            <Route exact path="/settings/severities/add">
                <SeverityLevelForm/>
            </Route>

            <Route exact path="/settings/severities/:id/edit">
                <SeverityLevelForm/>
            </Route>

            <Route path={"*"}>
                <Redirect to={"/dashboard"}/>
            </Route>
        </Switch>
    );
};

export default Body;
