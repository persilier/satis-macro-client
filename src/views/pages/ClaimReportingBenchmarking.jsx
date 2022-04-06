import {connect} from "react-redux";

const ClaimReportingBenchmarking = (props) => {

}

const mapStateToProps = state => {
    return {
        plan: state.plan.plan,
        userPermissions: state.user.user.permissions,
        activePilot: state.user.user.staff.is_active_pilot
    };
};

export default connect(mapStateToProps)(ClaimReportingBenchmarking);