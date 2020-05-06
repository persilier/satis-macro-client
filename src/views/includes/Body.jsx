import React from "react";
import {
  Switch,
  Route,
} from "react-router-dom";
import SMS from "../pages/SMS";
import Mail from "../pages/Mail";
import PerformanceIndicator from "../pages/PerformanceIndicator";
import PerformanceEditForm from "../components/PerformanceEditForm";
import PerformanceAddForm from "../components/PerformanceAddForm";
import UnitType from "../pages/UnitType";
import UnitTypeAddForm from "../components/UnitTypeAddForm";
import UnitTypeEditForm from "../components/UnitTypeEditForm";
import Unit from "../pages/Unit";
import UnitAddForm from "../components/UnitAddForm";
import UnitEditForm from "../components/UnitEditForm";
import Position from "../pages/Position";
import PositionAddForm from "../components/PositionAddForm";
import PositionEditForm from "../components/PositionEditForm";

import Staff from "../pages/Staff";
import StaffAddForm from "../components/staff/StaffAddForm";
import StaffEditForm from "../components/staff/StaffEditForm";
import ClaimCategory from "../pages/ClaimCategory";
import ClaimCategoryAddForm from "../components/ClaimCategoryAddForm";
import ClaimCategoryEditForm from "../components/ClaimCategoryEditForm";
import ClaimObject from "../pages/ClaimObject";
import ClaimObjectAddForm from "../components/ClaimObjectAddForm";
import ClaimObjectEditForm from "../components/ClaimObjectEditForm";

import FAQs from "../pages/FAQs";
import FAQsPage from "../pages/FAQsPage";
import CategoryFAQs from "../pages/CategoryFAQs";
import Institution from "../pages/Institution";
import AddInstitutions from "../components/AddInstitutions";
import EditInstitutions from "../components/EditInstitution";
import AddCategoryFaqs from "../components/AddCategoryFaqs";
import EditCategoryFaqs from "../components/EditCategoryFaqs";
import AddFaqs from "../components/AddFaqs";
import EditFaqs from "../components/EditFaqs.jsx";
import CategoryClient from "../pages/CategoryClient";
import TypeClient from "../pages/TypeClient";
import AddCategoryClient from "../components/AddCategoryClient";
import EditCategoryClient from "../components/EditCategoryClient";
import AddTypeClient from "../components/AddTypeClient";
import EditTypeClient from "../components/EditTypeClient";
import Clients from "../pages/Clients";
import AddClients from "../components/Clients/AddClients";
import EditClient from "../components/Clients/EditClient";
import TestPagination from "../pages/TestPagination";

const Body = () => {
    return (
        <Switch>
            <Route exact path="/">
                <SMS/>
            </Route>

            <Route exact path="/settings/sms">
                <SMS/>
            </Route>

            <Route exact path="/settings/clients/category">
                <CategoryClient/>
            </Route>

            <Route exact path="/settings/clients/category/add">
                <AddCategoryClient/>
            </Route>

            <Route exact path="/settings/clients/type">
                <TypeClient/>
            </Route>

            <Route exact path="/settings/clients/type/add">
                <AddTypeClient/>
            </Route>

            <Route exact path="/settings/faqs/add">
                <FAQs/>
            </Route>

            <Route exact path="/settings/faqs/list">
                <FAQsPage/>
            </Route>

            <Route exact path="/settings/faqs/faq/add">
                <AddFaqs/>
            </Route>

            <Route exact path="/settings/faqs/category">
                <CategoryFAQs/>
            </Route>
            <Route exact path="/settings/faqs/category/add">
                <AddCategoryFaqs/>
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
                <AddClients/>
            </Route>

            <Route exact path="/settings/institution/add">
                <AddInstitutions/>
            </Route>

            <Route exact path="/settings/institution/edit/:editinstitutionlug">
                <EditInstitutions/>
            </Route>

            <Route exact path="/settings/clients/edit/:editclientid">
                <EditClient/>
            </Route>

            <Route exact path="/settings/faqs/category/edit/:editcategoryslug">
                <EditCategoryFaqs/>
            </Route>

            <Route exact path="/settings/faqs/faq/edit/:editfaqid">
                <EditFaqs/>
            </Route>

            <Route exact path="/settings/clients/type/edit/:edittypeid">
                <EditTypeClient/>
            </Route>

            <Route exact path="/settings/clients/category/edit/:editcategoryid">
                <EditCategoryClient/>
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
                <UnitType/>
            </Route>

            <Route exact path="/settings/unit_type/add">
                <UnitTypeAddForm/>
            </Route>

            <Route exact path="/settings/unit_type/detail">
                <h1>Détail</h1>
            </Route>

            <Route exact path="/settings/unit_type/:id/edit">
                <UnitTypeEditForm/>
            </Route>

            <Route exact path="/settings/unit">
                <Unit/>
            </Route>

            <Route exact path="/settings/unit/add">
                <UnitAddForm/>
            </Route>

            <Route exact path="/settings/unit/:id/edit">
                <UnitEditForm/>
            </Route>

            <Route exact path="/settings/positions">
                <Position/>
            </Route>

            <Route exact path="/settings/positions/add">
                <PositionAddForm/>
            </Route>

            <Route exact path="/settings/positions/:id/edit">
                <PositionEditForm/>
            </Route>

            <Route exact path="/settings/positions">
                <Position/>
            </Route>

            <Route exact path="/settings/positions/add">
                <PositionAddForm/>
            </Route>

            <Route exact path="/settings/positions/:id/edit">
                <PositionEditForm/>
            </Route>

            <Route exact path="/settings/claim_categories">
                <ClaimCategory/>
            </Route>

            <Route exact path="/settings/claim_categories/add">
                <ClaimCategoryAddForm/>
            </Route>

            <Route exact path="/settings/claim_categories/:id/edit">
                <ClaimCategoryEditForm/>
            </Route>

            <Route exact path="/settings/claim_objects">
                <ClaimObject/>
            </Route>

            <Route exact path="/settings/claim_objects/add">
                <ClaimObjectAddForm/>
            </Route>

            <Route exact path="/settings/claim_objects/:id/edit">
                <ClaimObjectEditForm/>
            </Route>

            <Route exact path="/settings/staffs">
                <Staff/>
            </Route>

            <Route exact path="/settings/staffs/add">
                <StaffAddForm/>
            </Route>

            <Route exact path="/settings/staffs/:id/edit">
                <StaffEditForm/>
            </Route>

            <Route exact path="/settings/test-pagination">
                <TestPagination/>
            </Route>
        </Switch>
    );
};

export default Body;
