import React, {useEffect, useState} from "react";
import axios from "axios";
import { connect } from "react-redux";
import HeaderTablePage from "../components/HeaderTablePage";
import LoadingTable from "../components/LoadingTable";
import appConfig from "../../config/appConfig";
import {notificationConfig} from "../../constants/notification";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastEditErrorMessageConfig,
    toastSuccessMessageWithParameterConfig
} from "../../config/toastConfig";
import {AUTH_TOKEN} from "../../constants/token";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import InputRequire from "../components/InputRequire";
import {verifyTokenExpire} from "../../middleware/verifyToken";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

const ConfigNotification = (props) => {
    if (!verifyPermission(props.userPermissions, "update-notifications"))
        window.location.href = ERROR_401;
    const [data, setData] = useState([]);
    const [error, setError] = useState({
        "notifications.acknowledgment-of-receipt": [],
        "notifications.register-a-claim": [],
        "notifications.complete-a-claim": [],
        "notifications.transferred-to-targeted-institution": [],
        "notifications.transferred-to-unit": [],
        "notifications.assigned-to-staff": [],
        "notifications.reject-a-claim": [],
        "notifications.treat-a-claim": [],
        "notifications.invalidate-a-treatment": [],
        "notifications.validate-a-treatment": [],
        "notifications.communicate-the-solution": [],
        "notifications.communicate-the-solution-unfounded": [],
        "notifications.add-contributor-to-discussion": [],
        "notifications.post-discussion-message": [],
        "notifications.reminder-before-deadline": [],
        "notifications.reminder-after-deadline": [],
        "notifications.recurrence-alert": [],
    });
    const [load, setLoad] = useState(true);
    const [startUpdate, setStartUpdate] = useState(false);

    useEffect(() => {
        async function fetchData() {
            await axios.get(`${appConfig.apiDomaine}/notifications/edit`)
                .then(({data}) => {
                    console.log("data:", data);
                    setData(data);
                    setLoad(false);
                })
                .catch(error => {
                    setLoad(false);
                    console.log("something is wrong")
                })
            ;
        }
        if (verifyTokenExpire())
            fetchData();
    }, [appConfig.apiDomaine]);

    const handleTextChange = (e, index) => {
        const newData = [...data];
        newData[index].text = e.target.value;
        setData(newData);
    };

    const formatUpdateData = () => {
        const updateData = {};
        for (const key in data)
            updateData[data[key].event] = data[key].text;
        return updateData;
    };

    const updateConfig = () => {
        setStartUpdate(true);
        const updateData = {
            "notifications": formatUpdateData(),
        };

        if (verifyTokenExpire()) {
            axios.put(`${appConfig.apiDomaine}/notifications`, updateData)
                .then(({data}) => {
                    setStartUpdate(false);
                    ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig("Succès de la modification"));
                })
                .catch(({response}) => {
                    ToastBottomEnd.fire(toastEditErrorMessageConfig);
                    setError({...error, ...response.data.error});
                    setStartUpdate(false);
                    console.log("error", response.data.error)
                })
            ;
        }
    };

    return (
        verifyPermission(props.userPermissions, "update-notifications") ? (
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
                                    Notification
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <div className="kt-portlet">
                        <HeaderTablePage
                            title={"Configuration notification"}
                        />

                        {
                            load ? (
                                <LoadingTable/>
                            ) : (
                                <div className="kt-portlet__body">
                                    <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                        <div>
                                            <strong>
                                                Légende: <br/> <br/>
                                            </strong>
                                            <div className="row">
                                                <div className="col-6">{"{claim_reference}"} {"<===>"} Référence de la reclamation</div>
                                                <div className="col-6">{"{claim_object}"} {"<===>"} Objet de la reclamtion</div>
                                                <br/> <br/>
                                                <div className="col-6">{"{claim_status}"} {"<===>"} Status de la réclamaion</div>
                                                <div className="col-6">{"{responsible_staff}"} {"<===>"} Staff en charge du traitement</div>
                                                <br/> <br/>
                                                <div className="col-6">{"{solution_communicated}"} {"<===>"} Solution à communiquer</div>
                                                <div className="col-6">{"{created_by}"} {"<===>"} Celui qui à enregister la réclamation</div>
                                                <br/> <br/>
                                                <div className="col-6">{"{discussion_name}"} {"<===>"} Nom de la discussion</div>
                                                <div className="col-6">{"{posted_by}"} {"<===>"} Celui qui à poster la réclamation</div>
                                            </div>
                                            <br/><br/>
                                        </div>
                                        <div className="row">
                                            {
                                                data.map((el, index) => (
                                                    <div key={index} className={error[`notifications.${el.event}`].length ? "col-6 form-group validated" : "col-6 form-group"}>
                                                        <label htmlFor={el.event}>{notificationConfig[el.event]} <InputRequire/></label>
                                                        <textarea
                                                            id={el.event}
                                                            cols="30"
                                                            rows="3"
                                                            className={ error[`notifications.${el.event}`].length ? "form-control is-invalid" :  "form-control"}
                                                            value={el.text}
                                                            onChange={e => handleTextChange(e, index)}
                                                        />

                                                        {
                                                            error[`notifications.${el.event}`].length ? (
                                                                error[`notifications.${el.event}`].map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : null
                                                        }
                                                    </div>
                                                ))
                                            }

                                            <div className="col-12 form-group text-center">
                                                {
                                                    !startUpdate ? (
                                                        <button onClick={updateConfig} className="btn btn-primary">Modifier</button>
                                                    ) : (
                                                        <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                                            Chargement...
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        ) : null
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(ConfigNotification);
