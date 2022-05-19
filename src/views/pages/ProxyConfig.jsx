import React, {useState, useEffect} from "react";
import axios from "axios";
import {connect} from "react-redux";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import appConfig from "../../config/appConfig";
import {verifyTokenExpire} from "../../middleware/verifyToken";
import InputRequire from "../components/InputRequire";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
    toastEditErrorMessageConfig,
    toastEditSuccessMessageConfig, toastErrorMessageWithParameterConfig
} from "../../config/toastConfig";
import Select from "react-select";
import {useTranslation} from "react-i18next";


const endPointConfig = {
    PRO: {
        plan: "PRO",
        create: `${appConfig.apiDomaine}/my/email-claim-configuration`,
        store: `${appConfig.apiDomaine}/my/email-claim-configuration`,
        storeKnowingIdentity: id => `${appConfig.apiDomaine}/my/email-claim-configuration/${id}`,
    },
    MACRO: {
        holding: {
            create: `${appConfig.apiDomaine}/my/email-claim-configuration`,
            store: `${appConfig.apiDomaine}/my/email-claim-configuration`,
            storeKnowingIdentity: id => `${appConfig.apiDomaine}/my/email-claim-configuration/${id}`,
        },
        filial: {
            create: `${appConfig.apiDomaine}/my/email-claim-configuration`,
            store: `${appConfig.apiDomaine}/my/email-claim-configuration`,
            storeKnowingIdentity: id => `${appConfig.apiDomaine}/my/email-claim-configuration/${id}`,
        }
    },
    HUB: {
        plan: "HUB",
        create: `${appConfig.apiDomaine}/any/email-claim-configuration`,
        store: `${appConfig.apiDomaine}/any/email-claim-configuration`,
        storeKnowingIdentity: id => `${appConfig.apiDomaine}/any/email-claim-configuration/${id}`,
    }
};

const ProxyConfig = (props) => {

    //usage of useTranslation i18n
    const {t, ready} = useTranslation();

    document.title = "Satis client - " + (ready ? t("Proxy Configuration") : "");

    if (!(verifyPermission(props.userPermissions, "my-email-claim-configuration")
        || verifyPermission(props.userPermissions, "any-email-claim-configuration")))
        window.location.href = ERROR_401;

    let endPoint = "";
    if (props.plan === "HUB") {
        endPoint = endPointConfig[props.plan];
    } else if (props.plan === "MACRO") {
        if (verifyPermission(props.userPermissions, 'my-email-claim-configuration'))
            endPoint = endPointConfig[props.plan].holding;
        else if (verifyPermission(props.userPermissions, 'my-email-claim-configuration'))
            endPoint = endPointConfig[props.plan].filial;
    } else
        endPoint = endPointConfig[props.plan];

    const defaultErrorProxy = {
        hosthttp: [],
        hosthttps: [],
        porthttp: [],
        porthttps: [],
        institution_id: [],
    };

    const defaultDataProxy = {
        hosthttp: "",
        hosthttps: "",
        porthttp: "",
        porthttps: "",
        institution_id: "",
    }

    const [reload, setReload] = useState(false);
    const [loadingProxy, setLoadingProxy] = useState(false);
    const [error, setError] = useState(defaultErrorProxy);
    const [data, setData] = useState(defaultDataProxy);
    const [configuration, setConfiguration] = useState("");
    const [institution, setInstitution] = useState(null);
    const [institutions, setInstitutions] = useState([])
    const [disabledInputEmail, setDisabledInputEmail] = useState(false);
    const [disabledInputSms, setDisabledInputSms] = useState(false);
    const [disabledInputIncoming, setDisabledInputIncoming] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (verifyPermission(props.userPermissions, 'my-email-claim-configuration')) {
                await axios.get(endPoint.create)
                    .then(response => {
                        const newData = {
                            hosthttp: response.data.hosthttp ? response.data.hosthttp : "",
                            hosthttps: response.data.hosthttps ? response.data.hosthttps : "",
                            porthttp: response.data.porthttp ? response.data.porthttp : "",
                            porthttps: response.data.porthttps ? response.data.porthttps : "",
                        }
                        setConfiguration(response.data.id ? response.data.id : "")
                        setData(newData);
                    })
                    .catch(error => {
                        console.log("Something is wrong");
                    });
            }
            else if (verifyPermission(props.userPermissions, 'any-email-claim-configuration')) {
                await axios.get(endPoint.create)
                    .then(async response => {
                        setInstitutions(formatOptions(response.data, "name", false, "email_claim_configuration"));
                    })
                    .catch(error => {
                        console.log("Something is wrong");
                    });

            }
        }

        if (verifyTokenExpire()) {
            fetchData();
        }
    }, [reload]);

    const onChangeServerHTTP = (e) => {
        const newData = {...data};
        newData.hosthttp = e.target.value;
        setData(newData);
    };
    const onChangeServerHTTPS = (e) => {
        const newData = {...data};
        newData.hosthttps = e.target.value;
        setData(newData);
    };

    const onChangePortHTTP = (e) => {
        const newData = {...data};
        newData.porthttp = e.target.value;
        setData(newData);
    };

    const onChangePortHTTPS = (e) => {
        const newData = {...data};
        newData.porthttps = e.target.value;
        setData(newData);
    };

    const onChangeInstitution = (selected) => {
        const newData = {...data};
        if (selected) {
            setInstitution(selected);
            if (selected.configuration !== null) {
                newData.hosthttp = selected.configuration.hosthttp ? selected.configuration.hosthttp : "";
                newData.hosthttps = selected.configuration.hosthttps ? selected.configuration.hosthttps : "";
                newData.porthttp = selected.configuration.porthttp ? selected.configuration.porthttp : "";
                newData.porthttps = selected.configuration.porthttps ? selected.configuration.porthttps : "";
                newData.institution_id = selected.configuration.institution_id ? selected.configuration.institution_id : "";
                selected.configuration.id && setConfiguration(selected.configuration.id);
            }
            else {
                setConfiguration("");
                newData.institution_id = selected.value;
                newData.hosthttp = "";
                newData.hosthttps = "";
                newData.porthttp =  "";
                newData.porthttps =  "";
            }
        } else {
            setInstitution(null);
            setConfiguration("");
            newData.institution_id = "";
            newData.hosthttp = "";
            newData.hosthttps = "";
            newData.porthttp =  "";
            newData.porthttps =  "";

        }
        setData(newData);
    };

    const onStore = async (e) => {
        e.preventDefault();
        const sendData = {...data};
        if (props.plan !== "HUB")
            delete sendData.institution_id;

        setLoadingProxy(true);
        if (verifyTokenExpire()) {
                await axios.post(endPoint.store, sendData)
                    .then(response => {
                    setLoadingProxy(false);
                    setError(defaultErrorProxy);
                    const newData = {...data};
                    setData(newData);
                    ToastBottomEnd.fire(toastAddSuccessMessageConfig());
                    setReload(!reload);
                })
                    .catch(error => {
                    setLoadingProxy(false);
                    setData(sendData);
                    if (error.response.data.code === 400)
                        ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(error.response.data.error));
                    else {
                        setError({...defaultErrorProxy, ...error.response.data.error});
                        ToastBottomEnd.fire(toastAddErrorMessageConfig);
                    }

                })
                ;
        }
    };

    const onUpdate = async (e) => {
        const sendData = {...data};
        e.preventDefault();

        if (props.plan !== "HUB")
            delete sendData.institution_id;

        setLoadingProxy(true);
        if (verifyTokenExpire()) {
            await axios.post(endPoint.storeKnowingIdentity(configuration), sendData)
                .then(response => {
                    setLoadingProxy(false);
                    setError(defaultErrorProxy);
                    const newData = {...data};
                    setData(newData);
                    ToastBottomEnd.fire(toastEditSuccessMessageConfig());
                    setReload(!reload);
                })
                .catch(error => {
                    setLoadingProxy(false);
                    if (error.response.data.code === 400)
                        ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(error.response.data.error));
                    else {
                        setError({...defaultErrorProxy, ...error.response.data.error});
                        ToastBottomEnd.fire(toastEditErrorMessageConfig);
                    }
                })
            ;
        }
    };

    const handleDisabledInputChangeEmail = (e) => {
        const newData = {...data};
        setData(newData);
        setDisabledInputEmail(e.target.checked);
    };
    const handleDisabledInputChangeSms = (e) => {
        const newData = {...data};
        setData(newData);
        setDisabledInputSms(e.target.checked);
    };
    const handleDisabledInputChangeIncoming = (e) => {
        const newData = {...data};
        setData(newData);
        setDisabledInputIncoming(e.target.checked);
    };


    const formatOptions = (options, labelKey, translate, configuration, valueKey = "id") => {
        const newOptions = [];
        for (let i = 0; i < options.length; i++) {
            if (translate)
                newOptions.push({value: (options[i])[valueKey], label: ((options[i])[labelKey])[translate], configuration: (options[i])[configuration]});
            else
                newOptions.push({value: (options[i])[valueKey], label: (options[i])[labelKey], configuration: (options[i])[configuration]});
        }
        return newOptions;
    };

    return (
        ready ? (
            verifyPermission(props.userPermissions, "update-mail-parameters") ? (
                <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                    <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                        <div className="kt-container  kt-container--fluid ">
                            <div className="kt-subheader__main">
                                <h3 className="kt-subheader__title">
                                    {t("Paramètres")}
                                </h3>
                                <span className="kt-subheader__separator kt-hidden"/>
                                <div className="kt-subheader__breadcrumbs">
                                    <a href="#link" className="kt-subheader__breadcrumbs-home">
                                        <i className="flaticon2-shelter"/>
                                    </a>
                                    <span className="kt-subheader__breadcrumbs-separator"/>
                                    <a href="#link" className="kt-subheader__breadcrumbs-link">
                                        Proxy configuration
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
                                                Proxy configuration
                                            </h3>
                                        </div>
                                    </div>

                                    <form method="POST" className="kt-form">
                                        <div className="kt-form kt-form--label-right">

                                            <div className="kt-portlet">
                                                <div className="kt-portlet__body  kt-portlet__body--fit">
                                                    <div className="row row-no-padding row-col-separator-lg">
                                                        <div className="col-md-12 col-lg-6 col-xl-3">

                                                            <div className="kt-widget24">
                                                                <div className="kt-widget24__details">
                                                                    <div className="kt-widget24__info">
                                                                        <h4 className="kt-widget24__stats kt-font-brand kt-widget24__title" style={{marginBottom: "30px"}}>
                                                                           Proxy HTTP
                                                                        </h4>
                                                                    </div>
                                                                </div>

                                                                <div className="kt-widget24__action" style={{display:"block"}}>

															   <div className={error.hosthttp.length ? "form-group row validated" : "form-group row"}>
                                                                    <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="host">{t("Serveur")} <InputRequire/></label>
                                                                    <div className="col-lg-9 col-xl-6">
                                                                        <input
                                                                            id="senderID"
                                                                            type="text"
                                                                            className={error.hosthttp.length ? "form-control is-invalid" : "form-control"}
                                                                            value={data.hosthttp}
                                                                            onChange={(e) => onChangeServerHTTP(e)}
                                                                        />
                                                                        {
                                                                            error.hosthttp.length ? (
                                                                                error.hosthttp.map((error, index) => (
                                                                                    <div key={index} className="invalid-feedback">
                                                                                        {error}
                                                                                    </div>
                                                                                ))
                                                                            ) : null
                                                                        }
                                                                      </div>
															   </div>

                                                               <div className={error.porthttp.length ? "form-group row validated" : "form-group row"}>
                                                                        <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="port">Port <InputRequire/></label>
                                                                        <div className="col-lg-9 col-xl-6">
                                                                            <input
                                                                                id="port"
                                                                                type="number"
                                                                                className={error.porthttp.length ? "form-control is-invalid" : "form-control"}
                                                                                value={data.porthttp}
                                                                                onChange={(e) => onChangePortHTTP(e)}
                                                                            />
                                                                            {
                                                                                error.porthttp.length ? (
                                                                                    error.porthttp.map((error, index) => (
                                                                                        <div key={index} className="invalid-feedback">
                                                                                            {error}
                                                                                        </div>
                                                                                    ))
                                                                                ) : null
                                                                            }
                                                                        </div>
                                                                    </div>


                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="col-md-12 col-lg-6 col-xl-3">

                                                            <div className="kt-widget24">
                                                                <div className="kt-widget24__details">
                                                                    <div className="kt-widget24__info">
                                                                        <h4 className="kt-widget24__title kt-widget24__stats kt-font-brand"  style={{marginBottom: "30px"}}>
                                                                           Proxy HTTPS
                                                                        </h4>
                                                                    </div>

                                                                </div>
                                                                <div className="kt-widget24__action" style={{display:"block"}}>

                                                                    <div className={error.hosthttps.length ? "form-group row validated" : "form-group row"}>
                                                                        <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="hosthttps">{t("Serveur")} <InputRequire/></label>
                                                                        <div className="col-lg-9 col-xl-6">
                                                                            <input
                                                                                id="senderID"
                                                                                type="text"
                                                                                className={error.hosthttps.length ? "form-control is-invalid" : "form-control"}
                                                                                value={data.hosthttps}
                                                                                onChange={(e) => onChangeServerHTTPS(e)}
                                                                            />
                                                                            {
                                                                                error.hosthttps.length ? (
                                                                                    error.hosthttps.map((error, index) => (
                                                                                        <div key={index} className="invalid-feedback">
                                                                                            {error}
                                                                                        </div>
                                                                                    ))
                                                                                ) : null
                                                                            }
                                                                        </div>
                                                                    </div>

                                                                    <div className={error.porthttps.length ? "form-group row validated" : "form-group row"}>
                                                                        <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="port">Port <InputRequire/></label>
                                                                        <div className="col-lg-9 col-xl-6">
                                                                            <input
                                                                                id="port"
                                                                                type="number"
                                                                                className={error.porthttps.length ? "form-control is-invalid" : "form-control"}
                                                                                value={data.port}
                                                                                onChange={(e) => onChangePortHTTPS(e)}
                                                                            />
                                                                            {
                                                                                error.porthttps.length ? (
                                                                                    error.porthttps.map((error, index) => (
                                                                                        <div key={index} className="invalid-feedback">
                                                                                            {error}
                                                                                        </div>
                                                                                    ))
                                                                                ) : null
                                                                            }
                                                                        </div>
                                                                    </div>


                                                                </div>
                                                            </div>


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-form-label col-lg-4 col-sm-12 pt-0">{t("Utiliser pour")} :
                                                     </label>
                                                <div className="col-lg-8 col-md-8 col-sm-12" style={{verticalAlign: "middle", margin: "auto"}}>
                                                    <div className="kt-checkbox-list" style={{display: "flex"}}>
                                                        <label className="kt-checkbox" style={{marginRight: "20px"}}>
                                                            <input id="is_client" type="checkbox"
                                                                   checked={disabledInputEmail}
                                                                   onChange={handleDisabledInputChangeEmail}/>
                                                            {t("Mail")} <span/>

                                                        </label>
                                                        <label className="kt-checkbox" style={{marginRight: "20px"}}>
                                                            <input id="is_client" type="checkbox"
                                                                   checked={disabledInputSms}
                                                                   onChange={handleDisabledInputChangeSms}/>
                                                            {t("SMS")} <span/>

                                                        </label>
                                                        <label className="kt-checkbox" style={{marginRight: "20px"}}>
                                                            <input id="is_client" type="checkbox"
                                                                   checked={disabledInputIncoming}
                                                                   onChange={handleDisabledInputChangeIncoming}/>
                                                            {t(" Incoming mail service")} <span/>

                                                        </label>
                                                    </div>
                                                </div>
                                            </div>


                                         {/*   <div className="kt-portlet__body">

                                                {
                                                    verifyPermission(props.userPermissions, 'any-email-claim-configuration') && (props.plan === "HUB") ? (
                                                        <div
                                                            className={error.institution_id.length ? "form-group row validated" : "form-group row"}>
                                                            <label className="col-xl-3 col-lg-3 col-form-label"
                                                                   htmlFor="institution">
                                                                {t("Institutions")}
                                                                <InputRequire/></label>
                                                            <div className="col-lg-9 col-xl-6">
                                                                <Select
                                                                    isClearable
                                                                    value={institution}
                                                                    placeholder={"Selectionner une institution"}
                                                                    onChange={onChangeInstitution}
                                                                    options={institutions}
                                                                />
                                                                {
                                                                    error.institution_id.length ? (
                                                                        error.institution_id.map((error, index) => (
                                                                            <div key={index} className="invalid-feedback">
                                                                                {error}
                                                                            </div>
                                                                        ))
                                                                    ) : null
                                                                }
                                                            </div>
                                                        </div>
                                                    ) : null
                                                }

                                                <div className={error.host.length ? "form-group row validated" : "form-group row"}>
                                                    <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="host">{t("Serveur")} <InputRequire/></label>
                                                    <div className="col-lg-9 col-xl-6">
                                                        <input
                                                            id="senderID"
                                                            type="text"
                                                            className={error.host.length ? "form-control is-invalid" : "form-control"}
                                                            value={data.host}
                                                            onChange={(e) => onChangeServer(e)}
                                                        />
                                                        {
                                                            error.host.length ? (
                                                                error.host.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>

                                                <div className={error.email.length ? "form-group row validated" : "form-group row"}>
                                                    <label className="col-xl-3 col-lg-3 col-form-label" htmlFor={"mail_username"}>Email <InputRequire/></label>
                                                    <div className="col-lg-9 col-xl-6">
                                                        <input
                                                            id="mail_username"
                                                            type="text"
                                                            className={error.email.length ? "form-control is-invalid" : "form-control"}
                                                            value={data.email}
                                                            onChange={(e) => onChangeUsername(e)}
                                                        />
                                                        {
                                                            error.email.length ? (
                                                                error.email.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>

                                                <div className={error.password.length ? "form-group row validated" : "form-group row"}>
                                                    <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="mail_password">{t("Mot de passe")} <InputRequire/></label>
                                                    <div className="col-lg-9 col-xl-6">
                                                        <input
                                                            id="mail_password"
                                                            type="password"
                                                            className={error.password.length ? "form-control is-invalid" : "form-control"}
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
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>

                                                <div className={error.port.length ? "form-group row validated" : "form-group row"}>
                                                    <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="port">Port <InputRequire/></label>
                                                    <div className="col-lg-9 col-xl-6">
                                                        <input
                                                            id="port"
                                                            type="number"
                                                            className={error.port.length ? "form-control is-invalid" : "form-control"}
                                                            value={data.port}
                                                            onChange={(e) => onChangePort(e)}
                                                        />
                                                        {
                                                            error.port.length ? (
                                                                error.port.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>

                                                <div className={error.protocol.length ? "form-group row validated" : "form-group row"}>
                                                    <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="protocol">{t("Protocole")} <InputRequire/></label>
                                                    <div className="col-lg-9 col-xl-6">
                                                        <input
                                                            id="protocol"
                                                            type="text"
                                                            className={error.protocol.length ? "form-control is-invalid" : "form-control"}
                                                            value={data.protocol}
                                                            onChange={(e) => onChangeProtocol(e)}
                                                        />
                                                        {
                                                            error.protocol.length ? (
                                                                error.protocol.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>

                                            </div>*/}

                                            <div className="kt-portlet__foot">
                                                <div className="kt-form__actions text-right">
                                                    {
                                                        !loadingProxy ? (
                                                            !configuration.length ? (
                                                                <button type="submit" onClick={(e) => onStore(e)} className="btn btn-primary">{t("Enregistrer")}</button>
                                                            ) : (
                                                                <button type="submit" onClick={(e) => onUpdate(e)} className="btn btn-primary">{t("Modifier")}</button>
                                                            )
                                                        ) : (
                                                            <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                                                {t("Chargement")}...
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
            ) : null
        ) : null
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan,
    };
};

export default connect(mapStateToProps)(ProxyConfig);
