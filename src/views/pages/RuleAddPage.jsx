import React, {useState, useEffect} from "react";
import axios from "axios";
import {connect} from "react-redux";
import {
    useParams,
    Link
} from "react-router-dom";
import appConfig from "../../config/appConfig";
import {ERROR_401, redirectError401Page} from "../../config/errorPage";
import {verifyPermission} from "../../helpers/permission";
import {AUTH_TOKEN} from "../../constants/token";
import InputRequire from "../components/InputRequire";
import {ToastBottomEnd} from "../components/Toast";
import Select from "react-select";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

const RuleAddPage = (props) => {
    const {id} = useParams();
    if (id) {
        if (!verifyPermission(props.userPermissions, 'update-unit-type'))
            window.location.href = ERROR_401;
    } else {
        if (!verifyPermission(props.userPermissions, 'store-unit-type'))
            window.location.href = ERROR_401;
    }
    const defaultData = {
        name: "",
        institution_type: [],
        permission: []
    };
    const defaultError = {
        name: [],
        institution_type: "",
        permission: []
    };
    const [institutionTypes, setInstitutionTypes] = useState([{value: "onesine", label: "onesine"}, {value: "tony", label: "tony"}]);
    const [institutionType, setInstitutionType] = useState(null);
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        async function fetchData () {
            if (id) {
                await axios.get(`${appConfig.apiDomaine}/unit-types/${id}/edit`)
                    .then(response => {
                        const newData = {
                            name: response.data.unitType.name.fr,
                            can_be_target: response.data.unitType.can_be_target === 1,
                            can_treat: response.data.unitType.can_treat === 1,
                            description: response.data.unitType.description.fr,
                        };
                        setData(newData);
                    })
                    .catch(error => {
                        console.log("Something is wrong");
                    })
                ;
            }
        }
        fetchData();
    }, [id, appConfig.apiDomaine]);

    const handleNameChange = (e) => {
        const newData = {...data};
        newData.name = e.target.value;
        setData(newData);
    };

    const handleInstitutionType = (selected) => {
        const newData = {...data};
        const values = [];
        if (selected)
            selected.map(el => values.push(el.value));
        newData.institution_type = values;
        setInstitutionType(selected);
        setData(newData);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);
        if (id) {

        } else {

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
                                <Link to="/settings/rules" className="kt-subheader__breadcrumbs-link">
                                    Roles
                                </Link>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="#button" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link" style={{cursor: "text"}}>
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
                                                id ? "Modification de role" : "Ajout de role"
                                            }
                                        </h3>
                                    </div>
                                </div>

                                <form method="POST" className="kt-form">
                                    <div className="kt-form kt-form--label-right">
                                        <div className="kt-portlet__body">
                                            <div className={error.name.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="name">Nom <InputRequire/></label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <input
                                                        id="name"
                                                        type="text"
                                                        className={error.name.length ? "form-control is-invalid" : "form-control"}
                                                        placeholder="Veillez entrer le nom du type d'unité"
                                                        value={data.name}
                                                        onChange={(e) => handleNameChange(e)}
                                                    />
                                                    {
                                                        error.name.length ? (
                                                            error.name.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : null
                                                    }
                                                </div>
                                            </div>

                                            <div className={error.institution_type.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="unit_type">Veillez choisir le pilote actif <InputRequire/></label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <Select
                                                        isClearable
                                                        isMulti
                                                        value={institutionType}
                                                        placeholder={"collecteur"}
                                                        onChange={handleInstitutionType}
                                                        options={institutionTypes}
                                                    />
                                                    {
                                                        error.institution_type.length ? (
                                                            error.institution_type.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : null
                                                    }
                                                </div>
                                            </div>

                                            {
                                                institutionType ? (
                                                    <div className={error.permission.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="unit_type">Permissions <InputRequire/></label>
                                                        <div className="col-lg-9 col-xl-6">
                                                            <div className="kt-checkbox-inline">
                                                                <label className="kt-checkbox">
                                                                    <input type="checkbox"/> Permission 1<span/>
                                                                </label>
                                                                <label className="kt-checkbox">
                                                                    <input type="checkbox"/> Permission 2<span/>
                                                                </label>
                                                                <label className="kt-checkbox">
                                                                    <input type="checkbox"/> Permission 3<span/>
                                                                </label>
                                                                <label className="kt-checkbox">
                                                                    <input type="checkbox"/> Permission 4<span/>
                                                                </label>
                                                                <label className="kt-checkbox">
                                                                    <input type="checkbox"/> Permission 5<span/>
                                                                </label>
                                                                <label className="kt-checkbox">
                                                                    <input type="checkbox"/> Permission 6<span/>
                                                                </label>
                                                                <label className="kt-checkbox">
                                                                    <input type="checkbox"/> Permission 7<span/>
                                                                </label>
                                                                <label className="kt-checkbox">
                                                                    <input type="checkbox"/> Permission 8<span/>
                                                                </label>
                                                                <label className="kt-checkbox">
                                                                    <input type="checkbox"/> Permission 9<span/>
                                                                </label>
                                                                <label className="kt-checkbox">
                                                                    <input type="checkbox"/> Permission 10<span/>
                                                                </label>
                                                            </div>
                                                            {
                                                                error.permission.length ? (
                                                                    error.permission.map((error, index) => (
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
                                        </div>

                                        <div className="kt-portlet__foot">
                                            <div className="kt-form__actions text-right">
                                                {
                                                    !startRequest ? (
                                                        <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-primary">Envoyer</button>
                                                    ) : (
                                                        <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                                            Chargement...
                                                        </button>
                                                    )
                                                }
                                                {
                                                    !startRequest ? (
                                                        <Link to="/settings/rules" className="btn btn-secondary mx-2">
                                                            Quitter
                                                        </Link>
                                                    ) : (
                                                        <Link to="/settings/rules" className="btn btn-secondary mx-2" disabled>
                                                            Quitter
                                                        </Link>
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
        id ?
            verifyPermission(props.userPermissions, 'update-unit-type') ? (
                printJsx()
            ) : null
            : verifyPermission(props.userPermissions, 'store-unit-type') ? (
                printJsx()
            ) : null
    );
};

const mapStateToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
    };
};

export default connect(mapStateToProps)(RuleAddPage);
