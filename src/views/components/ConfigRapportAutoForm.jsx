import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {
    Link,
    useParams
} from "react-router-dom";
import {ToastBottomEnd} from "./Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig, toastEditSuccessMessageConfig,
} from "../../config/toastConfig";
import appConfig from "../../config/appConfig";
import {ERROR_401} from "../../config/errorPage";
import {verifyPermission} from "../../helpers/permission";
import Select from "react-select";
import TagsInput from "react-tagsinput";
import {verifyTokenExpire} from "../../middleware/verifyToken";

const endPointConfig = {
    PRO: {
        plan: "PRO",
        list: `${appConfig.apiDomaine}/my/reporting-claim/config`,
    },
    MACRO: {
        holding: {
            list: `${appConfig.apiDomaine}/any/reporting-claim/config`,
        },
        filial: {
            list: `${appConfig.apiDomaine}/my/reporting-claim/config`,
        }
    },

};

const ConfigRapportAutoForm = (props) => {
    const {id} = useParams();

    let endPoint = "";
    if (props.plan === "MACRO") {
        if (verifyPermission(props.userPermissions, 'config-reporting-claim-any-institution'))
            endPoint = endPointConfig[props.plan].holding;
        else if (verifyPermission(props.userPermissions, 'config-reporting-claim-any-institution'))
            endPoint = endPointConfig[props.plan].filial
    } else {
        endPoint = endPointConfig[props.plan]
    }

    const defaultData = {
        institution_id: "",
        period: "",
        email: [],
    };
    const defaultError = {
        institution_id: "",
        period: [],
        email: [],
    };
    const [data, setData] = useState(defaultData);
    const [periodData, setPeriodData] = useState(null);
    const [period, setPeriod] = useState(null);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);
    const [disabledInput, setDisabledInput] = useState(false);
    const [institution, setInstitution] = useState(null);
    const [institutions, setInstitutions] = useState(null);

    useEffect(() => {
        if (verifyTokenExpire()) {
            if (id) {
                axios.get(endPoint.list + `/${id}/edit`)
                    .then(response => {
                        console.log(response.data);
                        const newRapport = {
                            period: (response.data.reportingTask.period !== null) ? (response.data.reportingTask.period) : '',
                            email: response.data.reportingTask.email,
                            institution_id:response.data.reportingTask.institution_targeted_id!==null?response.data.reportingTask.institution_targeted_id:""
                        };

                        setData(newRapport);

                        if (response.data.reportingTask.period !== null) {
                            setPeriodData(response.data.period);
                            setPeriod(response.data.reportingTask.period_tag);
                        }
                        if (response.data.reportingTask.institution_targeted_id !== null) {
                            setInstitutions(response.data.institutions);
                            setInstitution({value: response.data.reportingTask.institution_targeted.id, label: response.data.reportingTask.institution_targeted.name});

                        }
                    })
            }
            axios.get(endPoint.list + `/create`)
                .then(response => {
                    let options =
                        response.data.institutions.length ? response.data.institutions.map(institution => ({
                            value: institution.id, label: institution.name
                        })) : ""
                    ;
                    setInstitutions(options);
                    setPeriodData(response.data.period)
                })
            ;
        }
    }, []);

    const onChangePeriod = (selected) => {
        const newData = {...data};
        newData.period = selected.value;
        setPeriod(selected);
        setData(newData);
    };

    const onChangeEmail = (mail) => {
        const newData = {...data};
        newData.email = mail;
        setData(newData);
    };

    const handleDisabledInputChange = () => {
        setDisabledInput(!disabledInput);
    };
    const onChangeInstitution = (selected) => {
        const newData = {...data};
        if (selected) {
            newData.institution_id = selected.value;
            setInstitution(selected);
        } else setInstitution(null);
        setData(newData);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);
        if (verifyTokenExpire()) {
            if (id) {
                axios.put(endPoint.list + `/${id}`, data)
                    .then(response => {
                        setStartRequest(false);
                        setError(defaultError);
                        setData(defaultData);
                        ToastBottomEnd.fire(toastEditSuccessMessageConfig);
                        window.location.href="/settings/rapport-auto"
                    })
                    .catch(error => {
                        setStartRequest(false);
                        setError({...defaultError, ...error.response.data.error});
                        ToastBottomEnd.fire(toastAddErrorMessageConfig);
                    })
                ;
            } else {
                axios.post(endPoint.list, data)
                    .then(response => {
                        setStartRequest(false);
                        setError(defaultError);
                        setData(defaultData);
                        ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                    })
                    .catch(error => {
                        setStartRequest(false);
                        setError({...defaultError, ...error.response.data.error});
                        ToastBottomEnd.fire(toastAddErrorMessageConfig);
                    })
                ;
            }
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
                                <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <Link to="/settings/clients/category" className="kt-subheader__breadcrumbs-link">
                                    Rapport Automatique
                                </Link>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()}
                                   className="kt-subheader__breadcrumbs-link">
                                    {
                                        id ? "Modification" : "Ajout"
                                    }
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
                                            {
                                                id ? "Modification des rapports automatiques" : "Ajout des rapports automatiques"
                                            }
                                        </h3>
                                    </div>
                                </div>

                                <form method="POST" className="kt-form">
                                    <div className="kt-portlet__body">
                                        <div className="tab-content">
                                            <div className="tab-pane active" id="kt_user_edit_tab_1" role="tabpanel">
                                                <div className="kt-form kt-form--label-right">
                                                    <div className="kt-form__body">
                                                        <div className="kt-section kt-section--first">
                                                            <div className="kt-section__body">

                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label"
                                                                           htmlFor="institution">
                                                                        <input
                                                                            type="checkbox"
                                                                            value={disabledInput}
                                                                            onChange={handleDisabledInputChange}/>
                                                                        <span/>    Toutes les institutions<span/></label>
                                                                    <div className="col-lg-9 col-xl-6">
                                                                        <Select
                                                                            isClearable
                                                                            isDisabled={disabledInput}
                                                                            placeholder={"Veuillez sélectionner une institution"}
                                                                            value={institution}
                                                                            onChange={onChangeInstitution}
                                                                            options={institutions?institutions.map(institution=>institution):""}
                                                                        />
                                                                    </div>

                                                                </div>
                                                                <div
                                                                    className={error.period.length ? "form-group row validated" : "form-group row"}>
                                                                    <label className="col-xl-3 col-lg-3 col-form-label"
                                                                           htmlFor="exampleSelect1">Période(s)</label>
                                                                    <div className="col-lg-9 col-xl-6">
                                                                            <Select
                                                                                value={period}
                                                                                onChange={onChangePeriod}
                                                                                options={periodData }
                                                                            />
                                                                        {
                                                                            error.period.length ? (
                                                                                error.period.map((error, index) => (
                                                                                    <div key={index}
                                                                                         className="invalid-feedback">
                                                                                        {error}
                                                                                    </div>
                                                                                ))
                                                                            ) : null
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <div
                                                                    className={error.email.length ? "form-group row validated" : "form-group row"}>
                                                                    <label className="col-xl-3 col-lg-3 col-form-label"
                                                                           htmlFor="email">Votre Email(s)</label>
                                                                    <div className=" col-lg-9 col-xl-6">
                                                                        <TagsInput
                                                                            value={data.email}
                                                                            onChange={onChangeEmail}
                                                                            inputProps={{
                                                                                className: "react-tagsinput-input",
                                                                                placeholder: "Email(s)"
                                                                            }}
                                                                        />
                                                                        {
                                                                            error.email.length ? (
                                                                                error.email.map((error, index) => (
                                                                                    <div key={index}
                                                                                         className="invalid-feedback">
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
                                                                            <button type="submit"
                                                                                    onClick={(e) => onSubmit(e)}
                                                                                    className="btn btn-primary">Enregistrer</button>
                                                                        ) : (
                                                                            <button
                                                                                className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                                                                type="button" disabled>
                                                                                Loading...
                                                                            </button>
                                                                        )
                                                                    }
                                                                    {
                                                                        !startRequest ? (
                                                                            <Link to="/settings/rapport-auto"
                                                                                  className="btn btn-secondary mx-2">
                                                                                Quitter
                                                                            </Link>
                                                                        ) : (
                                                                            <Link to="/settings/rapport-auto"
                                                                                  className="btn btn-secondary mx-2"
                                                                                  disabled>
                                                                                Quitter
                                                                            </Link>
                                                                        )
                                                                    }

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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
        verifyPermission(props.userPermissions, 'config-reporting-claim-my-institution') ? (
            printJsx()
        ) : null
    );

};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan,
    }
};

export default connect(mapStateToProps)(ConfigRapportAutoForm);
