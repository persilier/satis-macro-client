import React, {useState, useEffect} from "react";
import axios from "axios";

const SMS = () => {
    const defaultData = {
        senderID: "",
        username: "",
        indicatif: "",
        password: "",
        api: ""
    };
    const defaultError = {
        senderID: [],
        username: [],
        indicatif: [],
        password: [],
        api: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/configurations/sms")
            .then(response => {
                const newData = {...defaultData, ...response.data};
                setData(newData);
            })
            .catch(error => {
                console.log("Something is wrong");
            })
        ;
    }, []);

    const onChangeSenderID = (e) => {
        const newData = {...data};
        newData.senderID = e.target.value;
        setData(newData);
    };

    const onChangeUsername = (e) => {
        const newData = {...data};
        newData.username = e.target.value;
        setData(newData);
    };

    const onChangeIndicatif = (e) => {
        const newData = {...data};
        newData.indicatif = e.target.value;
        setData(newData);
    };

    const onChangePassword = (e) => {
        const newData = {...data};
        newData.password = e.target.value;
        setData(newData);
    };

    const onChangeApi = (e) => {
        const newData = {...data};
        newData.api = e.target.value;
        setData(newData);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        setStartRequest(true);
        axios.put("http://127.0.0.1:8000/configurations/sms", data)
            .then(response => {
                setStartRequest(false);
                setError(defaultError);
                setData(defaultData);
            })
            .catch(errorRequest => {
                setStartRequest(false);
                setError({...error, ...errorRequest.response.data.error});
            })
        ;
    };

    return (
        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            Base controls
                        </h3>
                        <span className="kt-subheader__separator kt-hidden"/>
                        <div className="kt-subheader__breadcrumbs">
                            <a href="#" className="kt-subheader__breadcrumbs-home">
                                <i className="flaticon2-shelter"/>
                            </a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                Forms
                            </a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                Form Controls </a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" className="kt-subheader__breadcrumbs-link">
                                Base Inputs
                            </a>
                        </div>
                    </div>
                    <div className="kt-subheader__toolbar">
                        <div className="kt-subheader__wrapper">
                            <a href="#" className="btn kt-subheader__btn-primary">
                                Actions &nbsp;
                            </a>
                            <div className="dropdown dropdown-inline" data-toggle="kt-tooltip" title="Quick actions" data-placement="left">
                                <a href="#" className="btn btn-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"/><path d="M5.857 2h7.88a1.5 1.5 0 01.968.355l4.764 4.029A1.5 1.5 0 0120 7.529v12.554c0 1.79-.02 1.917-1.857 1.917H5.857C4.02 22 4 21.874 4 20.083V3.917C4 2.127 4.02 2 5.857 2z" fill="#000" fill-rule="nonzero" opacity=".3"/><path d="M11 14H9a1 1 0 010-2h2v-2a1 1 0 012 0v2h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2z" fill="#000"/></g></svg>
                                </a>
                                <div className="dropdown-menu dropdown-menu-fit dropdown-menu-md dropdown-menu-right">
                                    <ul className="kt-nav">
                                        <li className="kt-nav__head">
                                            Add anything or jump to:
                                            <i className="flaticon2-information" data-toggle="kt-tooltip" data-placement="right" title="Click to learn more..."/>
                                        </li>
                                        <li className="kt-nav__separator"/>
                                        <li className="kt-nav__item">
                                            <a href="#" className="kt-nav__link">
                                                <i className="kt-nav__link-icon flaticon2-drop"/>
                                                <span className="kt-nav__link-text">Order</span>
                                            </a>
                                        </li>
                                        <li className="kt-nav__item">
                                            <a href="#" className="kt-nav__link">
                                                <i className="kt-nav__link-icon flaticon2-calendar-8"/>
                                                <span className="kt-nav__link-text">Ticket</span>
                                            </a>
                                        </li>
                                        <li className="kt-nav__item">
                                            <a href="#" className="kt-nav__link">
                                                <i className="kt-nav__link-icon flaticon2-telegram-logo"/>
                                                <span className="kt-nav__link-text">Goal</span>
                                            </a>
                                        </li>
                                        <li className="kt-nav__item">
                                            <a href="#" className="kt-nav__link">
                                                <i className="kt-nav__link-icon flaticon2-new-email"/>
                                                <span className="kt-nav__link-text">Support Case</span>
                                                <span className="kt-nav__link-badge">
                                                    <span className="kt-badge kt-badge--success">5</span>
                                                </span>
                                            </a>
                                        </li>
                                        <li className="kt-nav__separator"/>
                                        <li className="kt-nav__foot">
                                            <a className="btn btn-label-brand btn-bold btn-sm" href="#">Upgrade plan</a>
                                            <a className="btn btn-clean btn-bold btn-sm" href="#" data-toggle="kt-tooltip" data-placement="right" title="Click to learn more...">Learn more</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
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
                                        SMS
                                    </h3>
                                </div>
                            </div>

                            <form method="POST" className="kt-form">
                                <div className="kt-portlet__body">
                                    <div className="form-group form-group-last">
                                        <div className="alert alert-secondary" role="alert">
                                            <div className="alert-icon">
                                                <i className="flaticon-warning kt-font-brand"/>
                                            </div>
                                            <div className="alert-text">
                                                The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes.
                                            </div>
                                        </div>
                                    </div>
                                    <div className={error.senderID.length ? "form-group validated" : "form-group"}>
                                        <label htmlFor="senderID">Sender ID</label>
                                        <input
                                            id="senderID"
                                            type="text"
                                            className={error.senderID.length ? "form-control is-invalid" : "form-control"}
                                            placeholder="Veillez entrer le sender ID"
                                            value={data.senderID}
                                            onChange={(e) => onChangeSenderID(e)}
                                        />
                                        {
                                            error.senderID.length ? (
                                                error.senderID.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                            ) : ""
                                        }

                                    </div>
                                    <div className={error.username.length ? "form-group validated" : "form-group"}>
                                        <label htmlFor="username">User Name</label>
                                        <input
                                            id="username"
                                            type="text"
                                            className={error.username.length ? "form-control is-invalid" : "form-control"}
                                            placeholder="Veillez entrer votre name"
                                            value={data.username}
                                            onChange={(e) => onChangeUsername(e)}
                                        />
                                        {
                                            error.username.length ? (
                                                error.username.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                            ) : ""
                                        }
                                    </div>
                                    <div className={error.password.length ? "form-group validated" : "form-group"}>
                                        <label htmlFor="password">Password</label>
                                        <input
                                            type="password"
                                            className={error.password.length ? "form-control is-invalid" : "form-control"}
                                            id="password"
                                            placeholder="Password"
                                            value={data.password}
                                            onChange={(e) => onChangePassword(e)}
                                        />
                                        {
                                            error.password.length ? (
                                                error.password.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                            ) : ""
                                        }
                                    </div>
                                    <div className={error.indicatif.length ? "form-group validated" : "form-group"}>
                                        <label htmlFor="indicatif">Indicatif Pays</label>
                                        <input
                                            type="number"
                                            className={error.indicatif.length ? "form-control is-invalid" : "form-control"}
                                            id="indicatif"
                                            placeholder="Veillez entrer l'indicatif"
                                            value={data.indicatif}
                                            onChange={(e) => onChangeIndicatif(e)}
                                        />
                                        {
                                            error.indicatif.length ? (
                                                error.indicatif.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                            ) : ""
                                        }
                                    </div>
                                    <div className={error.api.length ? "form-group validated" : "form-group"}>
                                        <label htmlFor="api">API</label>
                                        <input
                                            type="text"
                                            className={error.api.length ? "form-control is-invalid" : "form-control"}
                                            id="api"
                                            placeholder="Veillez entrer l'API"
                                            value={data.api}
                                            onChange={(e) => onChangeApi(e)}
                                        />
                                        {
                                            error.api.length ? (
                                                error.api.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                            ) : ""
                                        }
                                    </div>
                                </div>
                                <div className="kt-portlet__foot">
                                    <div className="kt-form__actions">
                                        {
                                            !startRequest ? (
                                                <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-primary">Submit</button>
                                            ) : (
                                                <button className="btn btn-primary" type="button" disabled>
                                                    <span className="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"/>
                                                    Loading...
                                                </button>
                                            )
                                        }
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

export default SMS;
