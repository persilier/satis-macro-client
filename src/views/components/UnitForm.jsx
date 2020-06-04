import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {
    useParams,
    Link
} from "react-router-dom";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
    toastEditErrorMessageConfig,
    toastEditSuccessMessageConfig
} from "../../config/toastConfig";
import {ToastBottomEnd} from "../../views/components/Toast";
import Select from "react-select";
import {formatSelectOption} from "../../helpers/function";
import appConfig from "../../config/appConfig";
import FormInformation from "../../views/components/FormInformation";
import {verifyPermission} from "../../helpers/permission";
import {ERROR_401} from "../../config/errorPage";
import {AUTH_TOKEN} from "../../constants/token";

axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

const endPointConfig = {
    PRO: {
        plan: "PRO",
        store: `${appConfig.apiDomaine}/my/units`,
        update: id => `${appConfig.apiDomaine}/my/units/${id}`,
        create: `${appConfig.apiDomaine}/my/units/create`,
        edit: id => `${appConfig.apiDomaine}/my/units/${id}/edit`
    },
    MACRO: {
        holding: {
            store: `${appConfig.apiDomaine}/any/units`,
            update: id => `${appConfig.apiDomaine}/any/units/${id}`,
            create: `${appConfig.apiDomaine}/any/units/create`,
            edit: id => `${appConfig.apiDomaine}/any/units/${id}/edit`
        },
        filial: {
            store: `${appConfig.apiDomaine}/my/units`,
            update: id => `${appConfig.apiDomaine}/my/units/${id}`,
            create: `${appConfig.apiDomaine}/my/units/create`,
            edit: id => `${appConfig.apiDomaine}/my/units/${id}/edit`
        }
    },
    HUB: {
        plan: "HUB",
        store: `${appConfig.apiDomaine}/without-link/units`,
        update: id => `${appConfig.apiDomaine}/without-link/units/${id}`,
        create: `${appConfig.apiDomaine}/without-link/units/create`,
        edit: id => `${appConfig.apiDomaine}/without-link/units/${id}/edit`,
    }
};

const HoldingUnitForm = (props) => {
    const {id} = useParams();
    if (!id) {
        if (!(verifyPermission(props.userPermissions, 'store-any-unit') || verifyPermission(props.userPermissions, 'store-my-unit') || verifyPermission(props.userPermissions, 'store-without-link-unit')))
            window.location.href = ERROR_401;
    } else {
        if (!(verifyPermission(props.userPermissions, 'update-any-unit') || verifyPermission(props.userPermissions, 'update-my-unit') || verifyPermission(props.userPermissions, 'update-without-link-unit')))
            window.location.href = ERROR_401;
    }

    let endPoint = "";
    if (props.plan === "MACRO") {
        if (verifyPermission(props.userPermissions, 'store-any-unit') || verifyPermission(props.userPermissions, 'update-any-unit'))
            endPoint = endPointConfig[props.plan].holding;
        else if (verifyPermission(props.userPermissions, 'store-my-unit') || verifyPermission(props.userPermissions, 'update-my-unit'))
            endPoint = endPointConfig[props.plan].filial
    } else
        endPoint = endPointConfig[props.plan];

    const [unitTypes, setUnitTypes] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [unitType, setUnitType] = useState({});
    const [institution, setInstitution] = useState({});
    const [parents, setParents] = useState([]);
    const [parent, setParent] = useState({});

    const defaultData = {
        name: "",
        description: "",
        unit_type_id: unitTypes.length ? unitTypes[0].id : "",
        institution_id: institutions.length ? institutions[0].id : "",
        parent_id: parents.length ? parents[0].id : ""
    };
    const defaultError = {
        name: [],
        description: [],
        unit_type_id: [],
        parent_id: [],
        institution_id: []
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        if (id) {
            axios.get(endPoint.edit(id))
                .then(response => {
                    console.log(response.data, "data");
                    console.log(response.data.unitTypes, "Unit Type list");
                    const newData = {
                        name: response.data.unit.name["fr"],
                        description: response.data.unit.description["fr"],
                        unit_type_id: response.data.unit.unit_type_id,
                        institution_id: response.data.unit.institution_id ? response.data.unit.institution_id : "",
                        parent_id: response.data.unit.parent_id ? response.data.unit.parent_id : ""
                    };
                    setUnitType({value: response.data.unit.unit_type_id, label: response.data.unit.unit_type.name["fr"]});
                    setUnitTypes(formatSelectOption(response.data.unitTypes, "name", "fr"));
                    if (verifyPermission(props.userPermissions, 'update-any-unit')) {
                        setInstitutions(formatSelectOption(response.data.institutions, "name", false));
                        setInstitution({value: response.data.unit.institution.id, label: response.data.unit.institution.name["fr"]});
                    }
                    setParents(formatSelectOption(response.data.parents, "name", "fr"));
                    setParent(response.data.unit.parent_id ? {value: response.data.unit.parent_id, label: response.data.unit.parent.name["fr"]} : "");
                    setData(newData);
                })
                .catch(error => {
                    console.log("Something is wrong");
                })
            ;
        } else {
            axios.get(endPoint.create)
                .then(response => {
                    const newData = {...data};
                    newData.institution_id = "";
                    newData.unit_type_id = "";
                    newData.parent_id = "";
                    setUnitTypes(formatSelectOption(response.data.unitTypes, "name", "fr"));
                    setParents(formatSelectOption(response.data.parents, 'name', "fr"));
                    if (verifyPermission(props.userPermissions, 'store-any-unit'))
                        setInstitutions(formatSelectOption(response.data.institutions, "name", false));
                    setData(newData);
                })
                .catch(error => {
                    console.log("something is wrong");
                })
            ;
        }
    }, []);

    const onChangeName = (e) => {
        const newData = {...data};
        newData.name = e.target.value;
        setData(newData);
    };

    const onChangeDescription = (e) => {
        const newData = {...data};
        newData.description = e.target.value;
        setData(newData);
    };

    const onChangeUnitType = (selected) => {
        const newData = {...data};
        newData.unit_type_id = selected.value;
        setUnitType(selected);
        setData(newData);
    };

    const onChangeInstitution = (selected) => {
        const newData = {...data};
        newData.institution_id = selected.value;
        setInstitution(selected);
        setData(newData);
    };

    const onChangeParent= (selected) => {
        const newData = {...data};
        newData.parent_id = selected.value;
        setParent(selected);
        setData(newData);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);
        let newData = data;
        if(!(verifyPermission(props.userPermissions, 'store-any-unit') || verifyPermission(props.userPermissions, 'update-any-unit')))
            delete newData.institution_id;
        if (id) {
            axios.put(endPoint.update(id), newData)
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
        } else {
            axios.post(endPoint.store, newData)
                .then(response => {
                    setStartRequest(false);
                    if (verifyPermission(props.userPermissions, 'store-any-unit'))
                        setInstitution({});
                    setUnitType({});
                    setParent({});
                    setError(defaultError);
                    setData(defaultData);
                    ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                })
                .catch(errorRequest => {
                    setStartRequest(false);
                    setError({...defaultError, ...errorRequest.response.data.error});
                    ToastBottomEnd.fire(toastAddErrorMessageConfig);
                })
            ;
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
                                <a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <Link to="/settings/unit" className="kt-subheader__breadcrumbs-link">
                                    Unité
                                </Link>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link">
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
                                                id ? "Modification d'unité" : "Ajout d'unité"
                                            }
                                        </h3>
                                    </div>
                                </div>

                                <form method="POST" className="kt-form">
                                    <div className="kt-form kt-form--label-right">
                                        <div className="kt-portlet__body">
                                            <FormInformation information={"The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classes."}/>

                                            <div className={error.name.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="name">Nom de l'unité</label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <input
                                                        id="name"
                                                        type="text"
                                                        className={error.name.length ? "form-control is-invalid" : "form-control"}
                                                        placeholder="Veillez entrer le nom de l'unité"
                                                        value={data.name}
                                                        onChange={(e) => onChangeName(e)}
                                                    />
                                                    {
                                                        error.name.length ? (
                                                            error.name.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>
                                            </div>

                                            <div className={error.parent_id.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="institution">Unité Parent</label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <Select
                                                        value={parent}
                                                        onChange={onChangeParent}
                                                        options={parents}
                                                    />
                                                    {
                                                        error.parent_id.length ? (
                                                            error.parent_id.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>
                                            </div>

                                            <div className={error.unit_type_id.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="unit_type">Type d'unité</label>
                                                <div className="col-lg-9 col-xl-6">
                                                    <Select
                                                        value={unitType}
                                                        onChange={onChangeUnitType}
                                                        options={unitTypes}
                                                    />
                                                    {
                                                        error.unit_type_id.length ? (
                                                            error.unit_type_id.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>
                                            </div>

                                            {
                                                verifyPermission(props.userPermissions, 'store-any-unit') || verifyPermission(props.userPermissions, 'update-any-unit') ? (
                                                    <div className={error.institution_id.length ? "form-group row validated" : "form-group row"}>
                                                        <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="institution">Institution</label>
                                                        <div className="col-lg-9 col-xl-6">
                                                            <Select
                                                                value={institution}
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
                                                                ) : ""
                                                            }
                                                        </div>
                                                    </div>
                                                ) : ""
                                            }

                                            <div className={error.description.length ? "form-group row validated" : "form-group row"}>
                                                <label className="col-xl-3 col-lg-3 col-form-label" htmlFor="description">La description</label>
                                                <div className="col-lg-9 col-xl-6">
                                                <textarea
                                                    id="description"
                                                    className={error.description.length ? "form-control is-invalid" : "form-control"}
                                                    placeholder="Veillez entrer la description"
                                                    cols="30"
                                                    rows="5"
                                                    value={data.description}
                                                    onChange={(e) => onChangeDescription(e)}
                                                />
                                                    {
                                                        error.description.length ? (
                                                            error.description.map((error, index) => (
                                                                <div key={index} className="invalid-feedback">
                                                                    {error}
                                                                </div>
                                                            ))
                                                        ) : ""
                                                    }
                                                </div>
                                            </div>
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
                                                        <Link to="/settings/unit" className="btn btn-secondary mx-2">
                                                            Quitter
                                                        </Link>
                                                    ) : (
                                                        <Link to="/settings/unit" className="btn btn-secondary mx-2" disabled>
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
            verifyPermission(props.userPermissions, 'update-any-unit') || verifyPermission(props.userPermissions, 'update-my-unit') || verifyPermission(props.userPermissions, 'update-without-link-unit') ? (
                printJsx()
            ) : ""
        :
            verifyPermission(props.userPermissions, 'store-any-unit') || verifyPermission(props.userPermissions, 'store-my-unit') || verifyPermission(props.userPermissions, 'update-without-link-unit') ? (
                printJsx()
            ) : ""
    );
};

const mapDispatchToProps = state => {
    return {
        userPermissions: state.user.user.permissions,
        plan: state.plan.plan
    };
};

export default connect(mapDispatchToProps)(HoldingUnitForm);
