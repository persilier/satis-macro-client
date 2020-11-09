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

const PercentageMinFusion = (props) => {
    document.title = "Satis client - Paramètre pourcentage minimum fusion";
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

    useEffect(() => {
        async function fetchData () {
            await axios.get(`${appConfig.apiDomaine}/configurations/min-fusion-percent`)
                .then(({data}) => {
                    console.log("data:", data);
                    setData({
                        min_fusion_percent: data,
                    });
                })
                .catch(error => {
                    console.log("Something is wrong");
                })
            ;
        }
        fetchData();
    }, []);

    const handleRecurencePeriod = (e) => {
        const newData = {...data};
        newData.min_fusion_percent = parseInt(e.target.value);
        setData(newData);
    };

    const onSubmit = async (e) => {
        const sendData = {...data};
        e.preventDefault();

        setStartRequest(true);
        await axios.put(`${appConfig.apiDomaine}/configurations/min-fusion-percent`, sendData)
            .then(response => {
                setStartRequest(false);
                setError(defaultError);
                ToastBottomEnd.fire(toastEditSuccessMessageConfig);
            })
            .catch(errorRequest => {
                setStartRequest(false);
                setError({...defaultError, ...errorRequest.response.data.error});
                ToastBottomEnd.fire(toastEditErrorMessageConfig);
            })
        ;
    };

    return (
        verifyPermission(props.userPermissions, 'update-min-fusion-percent-parameters') ? (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Paramètre
                            </h3>
                            <span className="kt-subheader__separator kt-hidden"/>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#link" className="kt-subheader__breadcrumbs-home">
                                    <i className="flaticon2-shelter"/>
                                </a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#link" className="kt-subheader__breadcrumbs-link">
                                    Pourcentage mininum fusion
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
                                            Pourcentage minimum fusion
                                        </h3>
                                    </div>
                                </div>

                                <form method="POST" className="kt-form">
                                    <div className="kt-form kt-form--label-right">
                                        <div className="kt-portlet__body">
                                            <div className={error.min_fusion_percent.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="min_fusion_percent">Pourcentage minimum <InputRequire/></label>
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
                                            </div>
                                        </div>
                                        <div className="kt-portlet__foot">
                                            <div className="kt-form__actions text-right">
                                                {
                                                    !startRequest ? (
                                                        <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-primary">Enregistrer</button>
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
        ) : null
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions
    };
};

export default connect(mapStateToProps)(PercentageMinFusion);
