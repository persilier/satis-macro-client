import React, {useState, useEffect, useMemo, useRef} from "react";
import {connect} from "react-redux";
import Select from "react-select";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import InfirmationTable from "../components/InfirmationTable";
import HeaderTablePage from "../components/HeaderTablePage";
import {forceRound, formatDateToTimeStampte} from "../../helpers/function";
import axios from "axios";
import appConfig from "../../config/appConfig";
import {verifyTokenExpire} from "../../middleware/verifyToken";
import {ToastBottomEnd} from "../components/Toast";
import {toastErrorMessageWithParameterConfig, toastSuccessMessageWithParameterConfig} from "../../config/toastConfig";

const Logs = (props) => {
    document.title = "Satis Paramètre - Logs";
    const [logs, setLogs] = useState([]);
    const defaultErrors = {
        causer_id: [],
        log_action: [],
        date_start: [],
        date_end: []
    };
    const [error, setError] = useState(defaultErrors);
    const [actor, setActor] = useState(null);
    const [actors, setActors] = useState([]);
    const [action, setAction] = useState(null);
    const [actions, setActions] = useState([]);
    const startDate = useRef(null);
    const endDate = useRef(null);
    const onePageNumber = 50;
    const [endIndex, setEndIndex] = useState(onePageNumber);
    const [loadMore, setLoadMore] = useState(false);
    const [loadFilter, setLoadFilter] = useState(false);
    const [nextUrl, setNextUrl] = useState(null);

    useEffect(() => {
        async function fetchData() {
            axios.get(`${appConfig.apiDomaine}/activity-log/create`)
                .then(response => {
                    const logData = response.data.logs
                    setNextUrl(logData.next_page_url);
                    setLogs(logData.data);
                    setActors(response.data.filters.causers.map(item => {
                        return {
                            value: item.id,
                            label: item.identite.lastname+" "+item.identite.firstname
                        }
                    }));
                    const logActions = response.data.filters.log_actions;
                    setActions(Object.keys(logActions).map(item => {
                        return {
                            value: item,
                            label: logActions[item]
                        }
                    }));
                })
                .catch(error => {
                    console.log("Something is wrong");
                })
            ;
        }

        if (verifyTokenExpire())
            fetchData();
    }, []);

    if (!verifyPermission(props.userPermissions, "activity-log"))
        window.location.href = ERROR_401;

    const showElements = useMemo(() => {
        return logs.slice(0, endIndex);
    }, [logs, endIndex]);

    const showMore = () => {
        if ((endIndex / onePageNumber) < forceRound(logs.length / onePageNumber) - 1) {
            setEndIndex(i => i+onePageNumber);
        } else {
            if (verifyTokenExpire()) {
                if (nextUrl !== null) {
                    setLoadMore(true);
                    axios.get(`${nextUrl}`)
                        .then(response => {
                            setLoadMore(false);
                            setNextUrl(response.data.logs.next_page_url);
                            setLogs(l => {
                                return [
                                    ...l,
                                    ...response.data.logs.data
                                ]
                            });
                            setEndIndex(i => i+onePageNumber);
                        })
                        .catch(error => {
                            console.log("Something is wrong");
                        })
                    ;
                }
            }
        }
    };

    const filterLogs = e => {
        e.preventDefault();
        setLoadFilter(true);
        if (verifyTokenExpire()) {
            const sendData = {
                causer_id: actor !== null ? actor.value : '',
                log_action: action !== null ? action.value : '',
                date_start: startDate.current.value,
                date_end: endDate.current.value
            };
            if (!sendData.date_end)
                delete sendData.date_end;
            if (!sendData.date_start)
                delete sendData.date_start;
            if (!sendData.causer_id)
                delete sendData.causer_id;
            if (!sendData.log_action)
                delete sendData.log_action;
            axios.get(`${appConfig.apiDomaine}/activity-log`, {params: sendData})
                .then(response => {
                    setNextUrl(response.data.next_page_url);
                    setLogs(response.data.data);
                    setEndIndex(onePageNumber);

                    ToastBottomEnd.fire(toastSuccessMessageWithParameterConfig('Success du filtrage'));
                    setLoadFilter(false);
                    setError(defaultErrors);
                    setEndIndex(onePageNumber);
                })
                .catch(error => {
                    ToastBottomEnd.fire(toastErrorMessageWithParameterConfig('Echec du filtrage'))
                    console.log("error:", error.response.data.error);
                    setError({...defaultErrors, ...error.response.data.error});
                    console.log("Something is wrong");
                })
                .finally(() => {setLoadFilter(false);})
            ;
        }
    };

    const showAction = key => {
        let result = "";
        actions.forEach(item => {
            if (item.value === key) {
                result = item.value
            }
        });
        return result
    };

    return (
        verifyPermission(props.userPermissions, 'activity-log') && (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Paramètres
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <span className="kt-subheader__separator kt-hidden"/>
                                <div className="kt-subheader__breadcrumbs">
                                    <a href="#icone" className="kt-subheader__breadcrumbs-home"><i
                                        className="flaticon2-shelter"/></a>
                                    <span className="kt-subheader__breadcrumbs-separator"/>
                                    <a href="#button" onClick={e => e.preventDefault()}
                                       className="kt-subheader__breadcrumbs-link">
                                        Logs
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <InfirmationTable information={"Historique des Logs"}/>

                    <div className="kt-portlet">
                        <HeaderTablePage title={"Logs"}/>

                        <div className="kt-portlet__body">
                            <div id="kt_table_1_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                <form className="kt-form kt-form--fit kt-margin-b-20" onSubmit={filterLogs}>
                                    <div className="form-group row bg-light pb-3 pt-3 rounded">
                                        <div className="col">
                                            <div className="form-group row">
                                                <div className="col">
                                                    <label htmlFor="actor">Acteur</label>
                                                    <Select
                                                        options={actors}
                                                        value={actor}
                                                        onChange={value => setActor(value)}
                                                        placeholder={"Veillez selectioner l'acteur"}
                                                        isClearable
                                                    />
                                                </div>

                                                <div className="col">
                                                    <label htmlFor="actor">Action</label>
                                                    <Select
                                                        options={actions}
                                                        value={action}
                                                        onChange={value => setAction(value)}
                                                        placeholder={"Veillez selectionner l'action"}
                                                        isClearable
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className="col">
                                                    <label htmlFor="actor">Date de debut</label>
                                                    <input
                                                        ref={startDate}
                                                        type="date"
                                                        className={`form-control ${error.date_start.length ? 'is-invalid' : ''}`}
                                                    />
                                                    {error.date_start.length !== 0 && (
                                                        <>
                                                            {error.date_start.map((item, index) => (
                                                                <p key={index} className="invalid-feedback">{item}</p>
                                                            ))}
                                                        </>
                                                    )}
                                                </div>

                                                <div className="col">
                                                    <label htmlFor="actor">Date de fin</label>
                                                    <input
                                                        ref={endDate}
                                                        type="date"
                                                        className={`form-control ${error.date_end.length ? 'is-invalid' : ''}`}
                                                    />
                                                    {error.date_end.length !== 0 && (
                                                        <>
                                                            {error.date_end.map((item, index) => (
                                                                <p key={index} className="invalid-feedback">{item}</p>
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="kt-form__actions text-center">
                                                {loadFilter ? (
                                                    <button className="btn btn-primary kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light">
                                                        Filtrer
                                                    </button>
                                                ) : (
                                                    <button type="submit" className="btn btn-primary">Filtrer</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                <div className="kt-separator kt-separator--space-md"/>

                                <div className="position-relative">
                                    {showElements.map((item, index) => (
                                        <div key={index}>
                                            <div className="tab-content">
                                                <div className="d-flex justify-content-between">
                                                    <h5>
                                                        {
                                                            item.causer ? (
                                                                item.causer.identite ? item.causer.identite.lastname+" "+item.causer.identite.firstname : ''
                                                            ) : ''
                                                        }
                                                    </h5>
                                                    <span>{formatDateToTimeStampte(item.created_at)}</span>
                                                </div>
                                                <div style={{marginTop: "1%"}}>
                                                    <strong>Action: </strong>
                                                    <span className="mx-2">{showAction(item.log_action)}</span>
                                                </div>

                                                <div style={{marginTop: "1%"}}>
                                                    <strong>IP: </strong>
                                                    <span className="mx-2">{item.ip_address}</span>
                                                </div>
                                            </div>
                                            <div className="kt-separator kt-separator--space-md kt-separator--border-dashed"/>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center">
                                    {loadMore ? (
                                        <button className="btn btn-primary kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light">
                                            Voire Plus
                                        </button>
                                    ) : (
                                        <button onClick={showMore} className="btn btn-primary">Voire Plus</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

const mapStateToProps = (state) => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(Logs);