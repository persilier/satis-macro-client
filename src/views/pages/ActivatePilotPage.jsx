import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
} from "../../config/toastConfig";
import {ToastBottomEnd} from "../../views/components/Toast";
import Select from "react-select";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import {AUTH_TOKEN} from "../../constants/token";
import InputRequire from "../components/InputRequire";
import appConfig from "../../config/appConfig";
import {verifyTokenExpire} from "../../middleware/verifyToken";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

const ActivatePilotPage = (props) => {
    document.title = "Satis client - Paramètre pilote actif";

    if (!(verifyPermission(props.userPermissions, 'update-active-pilot')))
        window.location.href = ERROR_401;

    const [staffs, setStaffs] = useState([]);
    const [staff, setStaff] = useState(null);

    const defaultError = {
        staff_id: [],
    };
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    const formatListStaff = (list) => {
        const newList = [];
        list.map(l => newList.push({value: l.id, label: l.identite.lastname+" "+l.identite.firstname}));
        return newList;
    };

    useEffect(() => {
        async function fetchData() {
            await axios.get(`${appConfig.apiDomaine}/active-pilot/institutions/${props.activeUserInstitution}`)
                .then(({data}) => {
                    setStaffs(formatListStaff(data));
                })
                .catch(error => {
                    console.log("something is wrong");
                })
            ;
        }
        if (verifyTokenExpire())
            fetchData();
    }, [props.userPermissions, props.activeUserInstitution]);

    const handleStaffChange = (selected) => {
        setStaff(selected);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);
        if (verifyTokenExpire()) {
            axios.put(`${appConfig.apiDomaine}/active-pilot/institutions/${props.activeUserInstitution}`, {staff_id: staff ? staff.value : ""})
                .then( async () => {
                    setStaff(null);
                    setError(defaultError);
                    ToastBottomEnd.fire(toastAddSuccessMessageConfig);

                        await axios.get(`${appConfig.apiDomaine}/login`)
                            .then(response => {
                                setStartRequest(false);
                                localStorage.setItem("userData", JSON.stringify(response.data));
                                window.location.href = "/";
                            })
                        ;
                })
                .catch(errorRequest => {
                    setStartRequest(false);
                    setError({...defaultError, ...errorRequest.response.data.error});
                    ToastBottomEnd.fire(toastAddErrorMessageConfig);
                })
            ;
        }
    };

    const printJsx = () => {
        return (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Paramètres
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link" style={{cursor: "text"}}>
                                    Pilote actif
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <div className="row">
                        <div className="col">
                            <div className="kt-portlet">
                                <div className="kt-portlet__head">
                                    <div className="kt-portlet__head-label">
                                        <h3 className="kt-portlet__head-title">
                                            Pilote actif
                                        </h3>
                                    </div>
                                </div>

                                <form method="POST" className="kt-form">
                                    <div className="kt-form kt-form--label-right">
                                        <div className="kt-portlet__body">
                                            <div className={error.staff_id.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="unit_type">Veillez choisir le pilote actif <InputRequire/></label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <Select
                                                        isClearable
                                                        value={staff}
                                                        placeholder={"John doe"}
                                                        onChange={handleStaffChange}
                                                        options={staffs}
                                                    />
                                                    {
                                                        error.staff_id.length ? (
                                                            error.staff_id.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="kt-portlet__foot">
                                            <div className="kt-form__actions text-right">
                                                {
                                                    !startRequest ? (
                                                        <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-primary">{"Enregistrer"}</button>
                                                    ) : (
                                                        <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                                            Chargement...
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        verifyPermission(props.userPermissions, 'update-active-pilot') ? (
            printJsx()
        ) : null
    );
};

const mapDispatchToProps = state => {
    return {
        activeUserInstitution: state.user.user.institution.id,
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan,
        activePilot: state.user.user.staff.is_active_pilot
    };
};

export default connect(mapDispatchToProps)(ActivatePilotPage);
