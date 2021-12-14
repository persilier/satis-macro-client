import React, {useState, useEffect, useMemo, useRef} from "react";
import {connect} from "react-redux";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import InfirmationTable from "../components/InfirmationTable";
import HeaderTablePage from "../components/HeaderTablePage";
import {forceRound} from "../../helpers/function";

const Logs = (props) => {
    document.title = "Satis Paramètre - Logs";
    const [logs, setLogs] = useState([]);
    const actor = useRef(null);
    const action = useRef(null);
    const startDate = useRef(null);
    const endDate = useRef(null);
    const onePageNumber = 2;
    const [endIndex, setEndIndex] = useState(onePageNumber);
    const [loadMore, setLoadMore] = useState(false);
    const [loadFilter, setLoadFilter] = useState(false);

    useEffect(() => {
        setLogs([
            {
                user: 'Lewhe Onesine',
                action: 'Connexion',
                date: '12/05/2021',
                ip: '120.36.52.125'
            },
            {
                user: 'Sogbossi Marielle',
                action: 'Traitement de réclamation',
                date: '12/10/2021',
                ip: '120.36.52.125'
            },
            {
                user: 'Lewhe Adrielle',
                action: 'Deconnexion',
                date: '12/10/2021',
                ip: '120.36.52.125'
            },
            {
                user: 'Lewhe Carine',
                action: 'Traitement de réclamation',
                date: '12/10/2021',
                ip: '120.36.52.125'
            },
            {
                user: 'Lewhe Eunice',
                action: 'Traitement de réclamation',
                date: '12/10/2021',
                ip: '120.36.52.125'
            },
            {
                user: 'Hounssou Romaric',
                action: 'Traitement de réclamation',
                date: '12/10/2021',
                ip: '120.36.52.125'
            },
            {
                user: 'Lewhe Carine',
                action: 'Traitement de réclamation',
                date: '12/10/2021',
                ip: '120.36.52.125'
            },
            {
                user: 'Hachemin Loïc',
                action: 'Traitement de réclamation',
                date: '12/10/2021',
                ip: '120.36.52.125'
            },
            {
                user: 'Aghuia Goodwin',
                action: 'Traitement de réclamation',
                date: '12/10/2021',
                ip: '120.36.52.125'
            },
            {
                user: 'Hounpkonou Loïc',
                action: 'Traitement de réclamation',
                date: '12/10/2021',
                ip: '120.36.52.125'
            },
            {
                user: 'Houndolo Elodie',
                action: 'Traitement de réclamation',
                date: '12/10/2021',
                ip: '120.36.52.125'
            },
        ]);
    }, []);

    if (!verifyPermission(props.userPermissions, "update-components-parameters"))
        window.location.href = ERROR_401;

    const showElements = useMemo(() => {
        return logs.slice(0, endIndex);
    }, [logs, endIndex]);

    const showMore = () => {
        if ((endIndex / onePageNumber) < forceRound(logs.length / onePageNumber) - 1) {
            setEndIndex(i => i+onePageNumber);
        } else {
            setLoadMore(true);
            setTimeout(() => {
                setLogs(l => {
                    return [
                        ...l,
                        {
                            user: 'Zannou Jean',
                            action: 'Traitement de réclamation',
                            date: '12/10/2021',
                            ip: '120.36.52.125'
                        },
                        {
                            user: 'Dossou Christian ',
                            action: 'Traitement de réclamation',
                            date: '12/10/2021',
                            ip: '120.36.52.125'
                        },
                    ]
                });
                setEndIndex(i => i+onePageNumber);

                setLoadMore(false);
            }, 5000);
        }
    };

    const filterLogs = e => {
        e.preventDefault();
        setLoadFilter(true);
        setTimeout(() => {
            setLoadFilter(false);
            setEndIndex(onePageNumber);
            console.log("filterData:", {
                actor: actor.current.value,
                action: action.current.value,
                startDate: startDate.current.value,
                endDate: endDate.current.value
            });
        }, 5000);
    };

    return (
        verifyPermission(props.userPermissions, 'update-components-parameters') && (
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
                                                    <input
                                                        ref={actor}
                                                        type="text"
                                                        placeholder="Veillez entrer l'acteur"
                                                        className="form-control "
                                                    />
                                                </div>

                                                <div className="col">
                                                    <label htmlFor="actor">Action</label>
                                                    <input
                                                        ref={action}
                                                        type="text"
                                                        placeholder="Veillez entrer l'action"
                                                        className="form-control "
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className="col">
                                                    <label htmlFor="actor">Date de debut</label>
                                                    <input
                                                        ref={startDate}
                                                        type="date"
                                                        className="form-control"
                                                    />
                                                </div>

                                                <div className="col">
                                                    <label htmlFor="actor">Date de fin</label>
                                                    <input
                                                        ref={endDate}
                                                        type="date"
                                                        className="form-control"
                                                    />
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
                                                    <h5>{item.user}</h5>
                                                    <span>{item.date}</span>
                                                </div>
                                                <div style={{marginTop: "1%"}}>
                                                    <strong>Action: </strong>
                                                    <span className="mx-2">{item.action}</span>
                                                </div>

                                                <div style={{marginTop: "1%"}}>
                                                    <strong>IP: </strong>
                                                    <span className="mx-2">{item.ip}</span>
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