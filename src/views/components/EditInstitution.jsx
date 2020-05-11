import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    useParams,
    Link
} from "react-router-dom";
import {ToastBottomEnd} from "./Toast";
import {
    toastAddErrorMessageConfig,
    toastAddSuccessMessageConfig,
    toastErrorMessageWithParameterConfig
} from "../../config/toastConfig";
import appConfig from "../../config/appConfig";
import apiConfig from "../../config/apiConfig";

const EditInstitutions = () => {
    const {editinstitutionlug} = useParams();
    const defaultData = {
        name: "",
        acronyme: "",
        iso_code: "",
        logo: ""
    };
    const defaultError = {
        name: [],
        acronyme: [],
        iso_code: [],
        logo: [],
    };
    const [data, setData] = useState(defaultData);
    const [logo, setLogo] = useState(undefined);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        axios.get(appConfig.apiDomaine + `/institutions/${editinstitutionlug}`)
            .then(response => {
                console.log(response, "GET_INSTITUTION");
                const newInstitution = {
                    name: response.data.name,
                    acronyme: response.data.acronyme,
                    iso_code: response.data.iso_code,
                    logo:response.data.logo
                };
                setData(newInstitution)
            })
    }, []);

    const onChangeName = (e) => {
        const newData = {...data};
        newData.name = e.target.value;
        setData(newData);
    };

    const onChangeAcronyme = (e) => {
        const newData = {...data};
        newData.acronyme = e.target.value;
        setData(newData);
    };

    const onChangeIsoCode = (e) => {
        const newData = {...data};
        newData.iso_code = e.target.value;
        setData(newData);
    };

    const onChangeFile = (e) => {
        const newData = {...data};
        newData.logo = e.target.files[0];
        setData(newData);
        setLogo(newData);
        var reader = new FileReader();
        reader.onload = function(e) {
            var image=document.getElementById('Image1');
            console.log(image,'image');
            image.src= e.target.result;
        };
        reader.readAsDataURL(newData.logo);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        {console.log(data.logo.name,"data")}
        const formData = new FormData();
        if (logo){
            formData.append('logo', data.logo);
        }
        formData.set('name', data.name);
        formData.set('acronyme', data.acronyme);
        formData.set('iso_code', data.iso_code);
        formData.append("_method", "put");
        setStartRequest(true);
        axios.post(appConfig.apiDomaine + `/institutions/${editinstitutionlug}`, formData)
            .then(response => {
                setStartRequest(false);
                setError(defaultError);
                // setData(defaultData);
                ToastBottomEnd.fire(toastAddSuccessMessageConfig);
            })
            .catch(error => {
                setStartRequest(false);
                setError({...defaultError});
                // ToastBottomEnd.fire(toastAddErrorMessageConfig);
                ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(error.response.data.error));
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
                            <div className="dropdown dropdown-inline" data-toggle="kt-tooltip" title="Quick actions"
                                 data-placement="left">
                                <a href="#" className="btn btn-icon" data-toggle="dropdown" aria-haspopup="true"
                                   aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                        <g fill="none" fill-rule="evenodd">
                                            <path d="M0 0h24v24H0z"/>
                                            <path
                                                d="M5.857 2h7.88a1.5 1.5 0 01.968.355l4.764 4.029A1.5 1.5 0 0120 7.529v12.554c0 1.79-.02 1.917-1.857 1.917H5.857C4.02 22 4 21.874 4 20.083V3.917C4 2.127 4.02 2 5.857 2z"
                                                fill="#000" fill-rule="nonzero" opacity=".3"/>
                                            <path
                                                d="M11 14H9a1 1 0 010-2h2v-2a1 1 0 012 0v2h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2z"
                                                fill="#000"/>
                                        </g>
                                    </svg>
                                </a>
                                <div className="dropdown-menu dropdown-menu-fit dropdown-menu-md dropdown-menu-right">
                                    <ul className="kt-nav">
                                        <li className="kt-nav__head">
                                            Add anything or jump to:
                                            <i className="flaticon2-information" data-toggle="kt-tooltip"
                                               data-placement="right" title="Click to learn more..."/>
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
                                            <a className="btn btn-clean btn-bold btn-sm" href="#"
                                               data-toggle="kt-tooltip" data-placement="right"
                                               title="Click to learn more...">Learn more</a>
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
                                        Modification d'une institution
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
                                                                <label className="col-xl-3 col-lg-3 col-form-label">Logo</label>
                                                                <div className="col-lg-9 col-xl-6">
                                                                    <div className="kt-avatar kt-avatar--outline"
                                                                         id="kt_user_add_avatar">
                                                                        <div className="kt-avatar__holder">
                                                                            <img id="Image1" className="kt-avatar__holder" src={data.logo} alt="logo"/>
                                                                        </div>
                                                                        <label className="kt-avatar__upload"
                                                                               id="files"
                                                                               data-toggle="kt-tooltip"
                                                                               title="Change avatar">
                                                                            <i className="fa fa-pen"></i>
                                                                            <input type="file"
                                                                                   id="file"
                                                                                   name="kt_user_add_user_avatar"
                                                                                   onChange={(e)=>onChangeFile(e)}
                                                                            />
                                                                        </label>
                                                                        <span className="kt-avatar__cancel"
                                                                              data-toggle="kt-tooltip"
                                                                              title="Cancel avatar">
                                                                            <i className="fa fa-times"></i>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className={error.name.length ? "form-group row validated" : "form-group row"}>
                                                                <label className="col-xl-3 col-lg-3 col-form-label"
                                                                       htmlFor="name">le Nom</label>
                                                                <div className="col-lg-9 col-xl-6">
                                                                    <input
                                                                        id="name"
                                                                        type="text"
                                                                        className={error.name.length ? "form-control is-invalid" : "form-control"}
                                                                        placeholder="Veillez entrer le nom"
                                                                        value={data.name}
                                                                        onChange={(e) => onChangeName(e)}
                                                                    />
                                                                    {
                                                                        error.name.length ? (
                                                                            error.name.map((error, index) => (
                                                                                <div key={index}
                                                                                     className="invalid-feedback">
                                                                                    {error}
                                                                                </div>
                                                                            ))
                                                                        ) : ""
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div
                                                                className={error.acronyme.length ? "form-group row validated" : "form-group row"}>
                                                                <label className="col-xl-3 col-lg-3 col-form-label"
                                                                       htmlFor="Acronyme">L'acronyme'</label>
                                                                <div className="col-lg-9 col-xl-6">
                                                                    <input
                                                                        id="Acronyme"
                                                                        className={error.acronyme.length ? "form-control is-invalid" : "form-control"}
                                                                        placeholder="Veillez entrer l'acronyme"
                                                                        type="text"
                                                                        value={data.acronyme}
                                                                        onChange={(e) => onChangeAcronyme(e)}
                                                                    />
                                                                    {
                                                                        error.acronyme.length ? (
                                                                            error.acronyme.map((error, index) => (
                                                                                <div key={index}
                                                                                     className="invalid-feedback">
                                                                                    {error}
                                                                                </div>
                                                                            ))
                                                                        ) : ""
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div
                                                                className={error.iso_code.length ? "form-group row validated" : "form-group row"}>
                                                                <label className="col-xl-3 col-lg-3 col-form-label"
                                                                       htmlFor="value">Le Code Iso</label>
                                                                <div className="col-lg-9 col-xl-6">
                                                                    <input
                                                                        id="value"
                                                                        type="text"
                                                                        className={error.iso_code.length ? "form-control is-invalid" : "form-control"}
                                                                        placeholder="Veillez entrer le code ISO"
                                                                        value={data.iso_code}
                                                                        onChange={(e) => onChangeIsoCode(e)}
                                                                    />
                                                                    {
                                                                        error.iso_code.length ? (
                                                                            error.iso_code.map((error, index) => (
                                                                                <div key={index}
                                                                                     className="invalid-feedback">
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
                                                                        <button type="submit"
                                                                                onClick={(e) => onSubmit(e)}
                                                                                className="btn btn-primary">Envoyer</button>
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
                                                                        <Link to="/settings/institution"
                                                                              className="btn btn-secondary mx-2">
                                                                            Quitter
                                                                        </Link>
                                                                    ) : (
                                                                        <Link to="/settings/institution"
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

export default EditInstitutions;
