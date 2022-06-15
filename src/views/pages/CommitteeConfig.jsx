import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {ToastBottomEnd} from "../components/Toast";
import {
    toastEditErrorMessageConfig,
    toastEditSuccessMessageConfig
} from "../../config/toastConfig";
import appConfig from "../../config/appConfig";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import InputRequire from "../components/InputRequire";
import {verifyTokenExpire} from "../../middleware/verifyToken";
import {useTranslation} from "react-i18next";
import Select from "react-select";

const CommitteeConfig = (props) => {

    //usage of useTranslation i18n
    const {t, ready} = useTranslation();

    document.title = (ready ? t("Satis client - Paramètre configuration des comités") : "");
    if (!verifyPermission(props.userPermissions, 'update-min-fusion-percent-parameters'))
        window.location.href = ERROR_401;

    const defaultData = {
        min_fusion_percent: 0,
    };
    const defaultError = {
        min_fusion_percent: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);
    const [InputStandard, setInputStandard] = useState(false);
    const [InputSpecific, setInputSpecific] = useState(false);
    const [disable, setDisable] = useState(false);
    const [isLoad, setIsLoad] = useState(true)

    useEffect(() => {
        async function fetchData() {
            await axios.get(`${appConfig.apiDomaine}/configurations/min-fusion-percent`)
                .then(({data}) => {
                    setData({
                        min_fusion_percent: data,
                    });
                })
                .catch(error => {
                    //console.log("Something is wrong");
                })
            ;
        }

        if (verifyTokenExpire())
            fetchData();
    }, []);

    const handleRecurencePeriod = (e) => {
        const newData = {...data};
        newData.min_fusion_percent = parseInt(e.target.value);
        setData(newData);
    };

    const handleInputChangeStandard = (e) => {
        const newData = {...data};
        setInputStandard(e.target.checked);
        console.log(newData.proxy_modules)
        if (e.target.checked === true)
            newData.proxy_modules.push("Standard");
        else
            newData.proxy_modules.splice(newData.proxy_modules.indexOf("Standard"), 1);
        setData(newData);

    };

    const handleInputChangeSpecific = (e) => {
        const newData = {...data};
        setInputSpecific(e.target.checked);
        if (e.target.checked === true)
            newData.proxy_modules.push("Specific");
        else
            newData.proxy_modules.splice(newData.proxy_modules.indexOf("Specific"), 1);
        setData(newData);

    };


    const onSubmit = async (e) => {
        const sendData = {...data};
        e.preventDefault();

        setStartRequest(true);
        if (verifyTokenExpire()) {
            await axios.put(`${appConfig.apiDomaine}/configurations/min-fusion-percent`, sendData)
                .then(response => {
                    if (response?.data?.proxy_modules && response.data.proxy_modules.includes("mail"))
                        setInputStandard(true);
                    if (response?.data?.proxy_modules && response.data.proxy_modules.includes("incoming_mail_service"))
                        setInputSpecific(true);
                    if (Object.keys(response.data).length === 0)
                        setDisable(true);

                    setStartRequest(false);
                    setError(defaultError);
                    ToastBottomEnd.fire(toastEditSuccessMessageConfig());
                })
                .catch(errorRequest => {
                    setStartRequest(false);
                    setError({...defaultError, ...errorRequest.response.data.error});
                    ToastBottomEnd.fire(toastEditErrorMessageConfig());
                })
            ;
        }
    };

    return (
        ready ? (
            verifyPermission(props.userPermissions, 'update-min-fusion-percent-parameters') ? (
                <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                    <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                        <div className="kt-container  kt-container--fluid ">
                            <div className="kt-subheader__main">
                                <h3 className="kt-subheader__title">
                                    {t("Paramètre")}
                                </h3>
                                <span className="kt-subheader__separator kt-hidden"/>
                                <div className="kt-subheader__breadcrumbs">
                                    <a href="#link" className="kt-subheader__breadcrumbs-home">
                                        <i className="flaticon2-shelter"/>
                                    </a>
                                    <span className="kt-subheader__breadcrumbs-separator"/>
                                    <a href="#link" className="kt-subheader__breadcrumbs-link">
                                        {t("Configuration des comités")}
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
                                                {t("Comité de réclamation")}
                                            </h3>
                                        </div>
                                    </div>

                                    <form method="POST" className="kt-form">
                                        <div className="kt-form kt-form--label-right">
                                            <div className="kt-portlet__body">
                                                {/*   <div className={error.min_fusion_percent.length ? "form-group row validated" : "form-group row"}>
                                                    <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="min_fusion_percent">{t("Pourcentage")} <InputRequire/></label>
                                                    <div className="col-lg-9 col-xl-6">
                                                        <input
                                                            id="min_fusion_percent"
                                                            type="number"
                                                            className={error.min_fusion_percent.length ? "form-control is-invalid" : "form-control"}
                                                            placeholder="0"
                                                            value={data.min_fusion_percent}
                                                            onChange={(e) => handleRecurencePeriod(e)}
                                                        />
                                                        {
                                                            error.min_fusion_percent.length ? (
                                                                error.min_fusion_percent.map((error, index) => (
                                                                    <div key={index} className="invalid-feedback">
                                                                        {error}
                                                                    </div>
                                                                ))
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>*/}

                                                <div className="form-group row" >

                                                    <div className="" style={{display: "flex",verticalAlign: "middle",margin: "auto"}}>
                                                        <div className="kt-checkbox-list "  style={{marginRight: "20px"}}> <label htmlFor="">{t("Veuillez choisir le(s) comité(s)")}:</label></div>
                                                        <div className="kt-checkbox-list " style={{display: "flex"}}>
                                                            <label className="kt-checkbox"
                                                                   style={{marginRight: "20px"}}>
                                                                <input id="is_client" type="checkbox"
                                                                       checked={InputStandard}
                                                                       disabled={disable}
                                                                       onChange={handleInputChangeStandard}/>
                                                                {t("Comité Standard")} <span
                                                                style={{border: "2px solid"}}/>

                                                            </label>
                                                            <label className="kt-checkbox"
                                                                   style={{marginRight: "20px"}}>
                                                                <input id="is_client" type="checkbox"
                                                                       checked={InputSpecific}
                                                                       disabled={disable}
                                                                       onChange={handleInputChangeSpecific}/>
                                                                {t("Comité Spécifique")} <span
                                                                style={{border: "2px solid"}}/>

                                                            </label>
                                                        </div>
                                                    </div>

                                                </div>

                                                {InputStandard === true ?
                                                    (
                                                        <div className="form-group ">
                                                            <div className={"col-lg-9 col-md-9 col-sm-12 m-auto"}>
                                                                <label htmlFor="">{t("Agents concernés par le comité standard")}</label>
                                                                <Select
                                                                    isClearable
                                                                    isMulti
                                                                    clearValue
                                                                    //value={unit}
                                                                    //isLoading={isLoad}
                                                                    placeholder={t("Veuillez sélectionner les agents")}
                                                                    //onChange={onChangeUnit}
                                                                    //options={ (!unit || (unit && unit.length < 4))  ? units : [] }
                                                                    //options={unit}
                                                                />
                                                                {/*   {
                                                                 unit.length > 3 ? (
                                                                     <p className={"mt-1"} style={{ color:"red", fontSize:"10px", textAlign:"end"}}>Vous avez atteint le nombre maximal d'agences à sélectionner</p>
                                                                 ) : null
                                                               }
                                                         */}

                                                                {/*   {
                                                                 error.unit_targeted_id.length ? (
                                                                     error.unit_targeted_id.map((error, index) => (
                                                                         <div key={index} className="invalid-feedback">
                                                                             {error}
                                                                         </div>
                                                                     ))
                                                                 ) : null
                                                             }
                                                         */}
                                                            </div>
                                                        </div>
                                                    ) : null
                                                }
                                                { InputSpecific === true ?
                                                    (
                                                        <div className="form-group ">
                                                            <div className={"col-lg-9 col-md-9 col-sm-12 text-center m-auto"}>
                                                                <div className="alert alert-outline-primary fade show" role="alert">
                                                                    <div className="alert-icon"> <i className="flaticon-warning"></i></div>
                                                                    <div className="alert-text">
                                                                        {t(" Veuillez configurer le comité spécifique lors du transfert de la réclamation ")}
                                                                    </div>
                                                                    <div className="alert-close">
                                                                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                                                            <span aria-hidden="true"><i className="la la-close"></i></span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <span/>
                                                            </div>
                                                        </div>
                                                    ) : null
                                                }

                                            </div>
                                            <div className="kt-portlet__foot">
                                                <div className="kt-form__actions text-right">
                                                    {
                                                        !startRequest ? (
                                                            <button type="submit" onClick={(e) => onSubmit(e)}
                                                                    className="btn btn-primary">{t("Enregistrer")}</button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                                                type="button" disabled>
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
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(CommitteeConfig);
