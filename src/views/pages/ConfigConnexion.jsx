import React, {useEffect, useState} from "react";
import {loadCss} from "../../helpers/function";
import {connect} from "react-redux";
import InfirmationTable from "../components/InfirmationTable";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import Loader from "../components/Loader";
import InputRequire from "../components/InputRequire";



loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const ConfigConnexion = (props) => {
    document.title = "Satis client - Paramètre Connexion";

    if (!verifyPermission(props.userPermissions, "update-components-parameters"))
        window.location.href = ERROR_401;

    const defaultData = {
        inactivity_time: "",
    };
    const defaultError = {
        inactivity_time: [],
    };

    const [load, setLoad] = useState(false);
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [isInactivityTime, setIsInactivityTime] = useState(false);

    const onChangeInactivityTime = (e) => {
        const newData = {...data};
        newData.inactivity_time = e.target.value;
        setData(newData);
    }

    const onChangeIsInactivityTime = (e) => {
        const newData = {...data};
        newData.inactivity_time = "";
        setData(newData);
        setIsInactivityTime(e.target.checked);
    }

    return (
        load ? (
            <Loader/>
        ) : (
            verifyPermission(props.userPermissions, 'update-min-fusion-percent-parameters') ? (
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
                                    <a href="#button" onClick={e => e.preventDefault()}
                                       className="kt-subheader__breadcrumbs-link">
                                        Configurer connexion
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">

                        <InfirmationTable
                            information={"Configuration du processus de connexion"}
                        />

                        <div className="row">
                            <div className="col">
                                <div className="kt-portlet">

                                    <div className="kt-portlet__head">
                                        <div className="kt-portlet__head-label">
                                            <h3 className="kt-portlet__head-title">
                                                Configurer connexion
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="kt-form">
                                        <div className="kt-portlet__body">

                                            <div className="kt-section">
                                                <div className="kt-section__body">
                                                    <h3 className="kt-section__title kt-section__title-lg">Temps d'inactivité</h3>

                                                    <div className="form-group row">
                                                        <label className="col-3 col-form-label">Contrôle du temps d'inactivité <InputRequire/></label>
                                                        <div className="col-3">
                                                            <span className="kt-switch">
                                                                <label>
                                                                    <input
                                                                        id="is_inactivity_time"
                                                                        type="checkbox"
                                                                        value={isInactivityTime}
                                                                        onChange={(e => onChangeIsInactivityTime(e))}
                                                                    />
                                                                    <span />
                                                                </label>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className={load === true ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-4 col-form-label" htmlFor="number_reject_max">Durée d'inactivité maximale tolérée <InputRequire/></label>
                                                        <div className="col-lg-8 col-xl-6">
                                                            <input
                                                                disabled={!isInactivityTime}
                                                                id="inactivity_time"
                                                                type="number"
                                                                className={load === true ? "form-control is-invalid" : "form-control"}
                                                                placeholder="0"
                                                                value={data.inactivity_time}
                                                                onChange={(e => onChangeInactivityTime(e))}
                                                            />
{/*                                                            {
                                                                error.number_reject_max.length ? (
                                                                    error.number_reject_max.map((error, index) => (
                                                                        <div key={index} className="invalid-feedback">
                                                                            {error}
                                                                        </div>
                                                                    ))
                                                                ) : null
                                                            }*/}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            ) : null
        )
    )
}

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan,
    };
};

export default connect(mapStateToProps)(ConfigConnexion);