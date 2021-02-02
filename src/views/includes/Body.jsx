import React from "react";
import {
    Switch,
    Route,
    Redirect
} from "react-router-dom";
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
import FilialeInstitutionForm from "../../APP_MACRO/Filiale/FilialeInstitutionForm";
import Currency from "../pages/Currency";
import CurrencyForm from "../components/CurrencyForm";
import Channel from "../pages/Channel";
import ChannelForm from "../components/ChannelForm";
import ClaimAdd from "../pages/ClaimAdd";
import ConfigRequirements from "../pages/ConfigRequirements";
import HoldingClientForm from "../../APP_MACRO/Holding/HoldingClientForm";
import RelationShip from "../pages/RelationShip";
import RelationShipForm from "../components/RelationShipForm";
import IncompleteClaims from "../pages/IncompleteClaims";
import IncompleteClaimsEdit from "../components/IncompleteClaimsEdit";
import ConfigProcessingCircuit from "../pages/ConfigProcessingCircuit";
import ClaimAssign from "../pages/ClaimAssign";
import ClaimAssignDetail from "../pages/ClaimAssignDetail";
import ClaimList from "../pages/ClaimList";
import ClaimAssignToStaff from "../pages/ClaimAssignToStaff";
import ClaimToValidatedList from "../pages/ClaimToValidatedList";
import ClaimMonitoring from "../pages/ClaimMonitoring";
import ClaimReporting from "../pages/ClaimReporting";
import Dashboards from "../pages/Dashboards";
import SatisfactionMeasure from "../pages/SatisfactionMeasure";
import ClaimsArchived from "../pages/ClaimsArchived";
import ConfigNotification from "../pages/ConfigNotification";
import Chats from "../pages/Discussions/Chats";
import AddChatsForm from "../pages/Discussions/AddChatsForm";
import AddMemberForm from "../pages/Discussions/AddMemberForm";
import Participants from "../pages/Discussions/Participants";
import RemoveChats from "../pages/Discussions/RemoveChats";
import StaffChannels from "../components/StaffChannels";
import ConfigRapportAuto from "../pages/ConfigRapportAuto";
import MessageApi from "../pages/MessageApi";
import MessageAPIForm from "../components/MessageAPIForm";
import InstitutionMessageApi from "../pages/InstitutionMessageApi";
import ConfigRapportAutoForm from "../components/ConfigRapportAutoForm";
import ClaimListDetail from "../pages/ClaimListDetail";
import ClaimAssignToStaffDetail from "../pages/ClaimAssignToStaffDetail";
import ClaimToValidatedListDetail from "../pages/ClaimToValidatedListDetail";
import SatisfactionMeasureDetail from "../pages/SatisfactionMeasureDetail";
import ClaimsArchivedDetail from "../pages/ClaimsArchivedDetail";
import User from "../pages/User";
import UserAdd from "../pages/UserAdd";
import QualificationPeriod from "../pages/QualificationPeriod";
import TreatmentPeriod from "../pages/TreatmentPeriod";
import QualificationPeriodAdd from "../pages/QualificationPeriodAdd";
import TreatmentPeriodAdd from "../pages/TreatmentPeriodAdd";
import ParametersComponent from "../pages/ParametersComponent";
// import ParametersComponentForm from "../components/ParametersComponentForm";
import ParametersComponentEdit from "../components/ParametersComponentEdit";
import UserEdit from "../pages/UserEdit";
import ConfigCoefficient from "../components/ConfigCoefficient";
import ImportClientForm from "../components/Clients/ImportClientForm";
import ImportInstitutionForm from "../components/Institutions/ImportInstitutionForm";
import HistoricClaimsAdd from "../pages/HistoricClaimsAdd";
import HistoricClaimsTraetment from "../pages/HistoricClaimsTraetment";
import ClaimObjectImportPage from "../pages/ClaimObjectImportPage";
import StaffImportPage from "../pages/StaffImportPage";
import ClaimCategoryImportPage from "../pages/ClaimCategoryImportPage";
import ActivatePilotPage from "../pages/ActivatePilotPage";
import RulePage from "../pages/RulePage";
import RuleAddPage from "../pages/RuleAddPage";
import RuleEditPage from "../pages/RuleEditPage";
import ProfilePage from "../pages/ProfilePage";
import ClaimImportPage from "../pages/ClaimImportPage";
import RecurencePage from "../pages/RecurencePage";
import RejectLimitPage from "../pages/RejectLimitPage";
import PercentageMinFusion from "../pages/PercentageMinFusion";
import ClaimDetail from "../pages/ClaimDetail";

const Body = () => {
    return (
        <Switch>
            {/*<Route exact path="/settings/sms">
                <SMS/>
            </Route>*/}
            <Route exact path="/settings/config">
                <ParametersComponent/>
            </Route>

            <Route exact path="/historic/claims/add">
                <HistoricClaimsAdd/>
            </Route>

            <Route exact path="/historic/claims/treat">
                <HistoricClaimsTraetment/>
            </Route>

            <Route exact path="/settings/config/edit/:id">
                <ParametersComponentEdit/>
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

            <Route exact path="/settings/importClients">
                <ImportClientForm/>
            </Route>

            <Route exact path="/settings/importInstitutions">
                <ImportInstitutionForm/>
            </Route>

            <Route exact path="/settings/relationship">
                <RelationShip/>
            </Route>

            <Route exact path="/settings/relationship/add">
                <RelationShipForm/>
            </Route>

            <Route exact path="/settings/relationship/edit/:id">
                <RelationShipForm/>
            </Route>

            <Route exact path="/settings/clients/add">
                <ClientForm/>
            </Route>

            <Route exact path="/settings/any/clients/add">
                <HoldingClientForm/>
            </Route>

            <Route exact path="/settings/any/clients/edit/:id">
                <HoldingClientForm/>
            </Route>

            <Route exact path="/settings/institution/add">
                <InstitutionForm/>
            </Route>

            <Route exact path="/settings/institution/edit">
                <FilialeInstitutionForm/>
            </Route>

            <Route exact path="/settings/institution/edit/:id">
                <InstitutionForm/>
            </Route>

            <Route exact path="/settings/relance">
                <ConfigCoefficient/>
            </Route>

            <Route exact path="/settings/faqs/category/edit/:id">
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

            <Route exact path="/settings/claim_category/import">
                <ClaimCategoryImportPage/>
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

            <Route exact path="/settings/claim_objects/import">
                <ClaimObjectImportPage/>
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

            <Route exact path="/settings/staffs/import">
                <StaffImportPage/>
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

            <Route exact path="/settings/currencies">
                <Currency/>
            </Route>

            <Route exact path="/settings/currencies/add">
                <CurrencyForm/>
            </Route>

            <Route exact path="/settings/currencies/:id/edit">
                <CurrencyForm/>
            </Route>

            <Route exact path="/settings/channels">
                <Channel/>
            </Route>

            <Route exact path="/settings/channels/add">
                <ChannelForm/>
            </Route>

            <Route exact path="/settings/channels/:id/edit">
                <ChannelForm/>
            </Route>

            <Route exact path="/process/claims/add">
                <ClaimAdd/>
            </Route>

            <Route exact path="/process/claims/import">
                <ClaimImportPage/>
            </Route>

            <Route exact path="/process/incomplete_claims">
                <IncompleteClaims/>
            </Route>

            <Route exact path="/process/incomplete_claims/edit/:id">
                <IncompleteClaimsEdit/>
            </Route>

            <Route exact path="/settings/requirement">
                <ConfigRequirements/>
            </Route>

            <Route exact path="/settings/processing-circuit">
                <ConfigProcessingCircuit/>
            </Route>

            <Route exact path="/process/claim-assign">
                <ClaimAssign/>
            </Route>

            <Route exact path="/process/claim-assign/:id/detail">
                <ClaimAssignDetail/>
            </Route>

            <Route exact path="/process/claim-assign/to-staff">
                <ClaimAssignToStaff/>
            </Route>

            <Route exact path="/process/claim-assign/to-staff/:id/detail">
                <ClaimAssignToStaffDetail/>
            </Route>

            <Route exact path="/process/unit-claims">
                <ClaimList/>
            </Route>

            <Route exact path="/process/claim-list-detail/:id/detail">
                <ClaimListDetail/>
            </Route>

            <Route exact path="/process/claim-to-validated">
                <ClaimToValidatedList/>
            </Route>

            <Route exact path="/process/claim-to-validated/:id/detail">
                <ClaimToValidatedListDetail/>
            </Route>

            <Route exact path="/monitoring/claims/monitoring">
                <ClaimMonitoring/>
            </Route>

            <Route exact path="/monitoring/claims/reporting">
                <ClaimReporting/>
            </Route>

            <Route exact path="/process/claims/:id/detail">
                <ClaimDetail/>
            </Route>

            <Route exact path="/process/claim_measure">
                <SatisfactionMeasure/>
            </Route>

            <Route exact path="/process/claim_measure/:id/detail">
                <SatisfactionMeasureDetail/>
            </Route>

            <Route exact path="/process/claim_archived">
                <ClaimsArchived/>
            </Route>

            <Route exact path="/process/claim_archived/:id/detail">
                <ClaimsArchivedDetail/>
            </Route>

            <Route exact path="/settings/notification">
                <ConfigNotification/>
            </Route>

            <Route exact path="/chat">
                <Chats/>
            </Route>

            <Route exact path="/treatment/chat/add">
                <AddChatsForm/>
            </Route>

            <Route exact path="/treatment/chat/contributor/:id">
                <Participants/>
            </Route>

            <Route exact path="/treatment/chat/remove_chat">
                <RemoveChats/>
            </Route>

            <Route exact path="/treatment/chat/add_user/:id">
                <AddMemberForm/>
            </Route>

            <Route exact path="/settings/message-apis">
                <MessageApi/>
            </Route>

            <Route exact path="/settings/message-apis/add">
                <MessageAPIForm/>
            </Route>

            <Route exact path="/settings/message-apis/:id/edit">
                <MessageAPIForm/>
            </Route>

            <Route exact path="/settings/institutions/:id/message-apis">
                <InstitutionMessageApi/>
            </Route>

            <Route exact path="/settings/institution-message-apis">
                <InstitutionMessageApi/>
            </Route>

            <Route exact path="/dashboard">
                <Dashboards/>
            </Route>

            <Route exact path="/feedback-channels">
                <StaffChannels/>
            </Route>

            <Route exact path="/settings/rapport-auto">
                <ConfigRapportAuto/>
            </Route>

            <Route exact path="/settings/rapport/add">
                <ConfigRapportAutoForm/>
            </Route>

            <Route exact path="/settings/rapport/edit/:id">
                <ConfigRapportAutoForm/>
            </Route>

            <Route exact path="/settings/users">
                <User/>
            </Route>

            <Route exact path="/settings/users/add">
                <UserAdd/>
            </Route>

            <Route exact path="/settings/users/:id/edit">
                <UserEdit/>
            </Route>

            <Route exact path="/settings/rules">
                <RulePage/>
            </Route>

            <Route exact path="/settings/rules/add">
                <RuleAddPage/>
            </Route>

            <Route exact path="/settings/rules/:id/edit">
                <RuleAddPage/>
            </Route>

            <Route exact path="/settings/qualification-period">
                <QualificationPeriod/>
            </Route>

            <Route exact path="/settings/qualification-period/add">
                <QualificationPeriodAdd/>
            </Route>

            <Route exact path="/settings/treatment-period">
                <TreatmentPeriod/>
            </Route>

            <Route exact path="/settings/treatment-period/add">
                <TreatmentPeriodAdd/>
            </Route>

            <Route exact path="/settings/activate-pilot">
                <ActivatePilotPage/>
            </Route>

            <Route exact path="/settings/account">
                <ProfilePage/>
            </Route>

            <Route exact path="/settings/account/personal-information">
                <ProfilePage/>
            </Route>

            <Route exact path="/settings/account/change-password">
                <ProfilePage/>
            </Route>

            <Route exact path="/settings/recurence">
                <RecurencePage/>
            </Route>

            <Route exact path="/settings/reject-limit">
                <RejectLimitPage/>
            </Route>

            <Route exact path="/settings/percentage-min-fusion">
                <PercentageMinFusion/>
            </Route>

            <Route path={"*"}>
                <Redirect to={"/dashboard"}/>
            </Route>
        </Switch>
    );
};

export default Body;
