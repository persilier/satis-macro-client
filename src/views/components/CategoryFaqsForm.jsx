import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Link,
    useParams
} from "react-router-dom";
import {ToastBottomEnd} from "./Toast";
import {
    toastAddSuccessMessageConfig,
    toastErrorMessageWithParameterConfig
} from "../../config/toastConfig";
import appConfig from "../../config/appConfig";

const CategoryFaqsForm = () => {
    const {editcategoryslug}=useParams();
    const defaultData = {
        name: "",
    };
    const defaultError = {
        name: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        if (editcategoryslug){
            axios.get(appConfig.apiDomaine+`/faq-categories/${editcategoryslug}`)
                .then(response => {
                    const newCategory={
                        name:response.data.name,
                    };
                    setData(newCategory)
                })
        }
    }, []);

    const onChangeName = (e) => {
        const newData = {...data};
        newData.name = e.target.value;
        setData(newData);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);
        if(editcategoryslug){
            axios.put(appConfig.apiDomaine+`/faq-categories/${editcategoryslug}`, data)
                .then(response => {
                    setStartRequest(false);
                    setError(defaultError);
                    setData(defaultData);
                    ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                })
                .catch(error => {
                    setStartRequest(false);
                    setError({...defaultError});
                    // ToastBottomEnd.fire(toastAddErrorMessageConfig);
                    ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(error.response.data.error));
                })
            ;
        }else{
            axios.post(appConfig.apiDomaine+`/faq-categories`, data)
                .then(response => {
                    setStartRequest(false);
                    setError(defaultError);
                    setData(defaultData);
                    ToastBottomEnd.fire(toastAddSuccessMessageConfig);
                })
                .catch(error => {
                    setStartRequest(false);
                    setError({...defaultError});
                    // ToastBottomEnd.fire(toastAddErrorMessageConfig);
                    ToastBottomEnd.fire(toastErrorMessageWithParameterConfig(error.response.data.error));
                })
            ;
        }

    };

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
                            <a href="#" className="kt-subheader__breadcrumbs-home"><i
                                className="flaticon2-shelter"/></a>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <Link to="/settings/faqs/category" className="kt-subheader__breadcrumbs-link">
                                Categorie FAQ
                            </Link>
                            <span className="kt-subheader__breadcrumbs-separator"/>
                            <a href="" onClick={e => e.preventDefault()} className="kt-subheader__breadcrumbs-link">
                                {
                                    editcategoryslug ? "Modification" : "Ajout"
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
                                        editcategoryslug?
                                                "Modification des catégories de FAQ":" Ajout des catégories de FAQ"
                                    }
                                    </h3>
                                </div>
                            </div>

                            <form method="POST" className="kt-form">
                                <div className="kt-portlet__body">

                                    <div className={error.name.length ? "form-group  validated" : "form-group"}>
                                        <label htmlFor="name">le Nom</label>
                                        <div className="col-md-6 mb-3">
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
                                    <div className="kt-form__actions">
                                        {
                                            !startRequest ? (
                                                <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-primary">Envoyer</button>
                                            ) : (
                                                <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                                    Loading...
                                                </button>
                                            )
                                        }
                                        {
                                            !startRequest ? (
                                                <Link to="/settings/faqs/category" className="btn btn-secondary mx-2">
                                                    Quitter
                                                </Link>
                                            ) : (
                                                <Link to="/settings/faqs/category" className="btn btn-secondary mx-2" disabled>
                                                    Quitter
                                                </Link>
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

export default CategoryFaqsForm;
