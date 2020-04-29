import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Link,
    useParams
} from "react-router-dom";
import {ToastBottomEnd} from "./Toast";
import {toastAddErrorMessageConfig, toastAddSuccessMessageConfig} from "../../config/toastConfig";
import appConfig from "../../config/appConfig";

const EditFaqs = () => {
    const defaultData = {
        faq_category_id: "",
        question: "",
        answer: "",
    };
    const defaultError = {
        faq_category_id: [],
        question: [],
        answer: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [categorieData, setCategorieData] = useState([]);
    const [getCategory, setGetCategory] = useState(undefined);
    const [startRequest, setStartRequest] = useState(false);

    const {editfaqid} = useParams();
    useEffect(() => {
        axios.get(appConfig.apiDomaine+'/faq-categories')
            .then(response => {
                setCategorieData(response.data)
            });

        axios.get(appConfig.apiDomaine+`/faqs/${editfaqid}`)
            .then(response => {
                const newFaq = {
                    faq_category_id: response.data.category.id,
                    question: response.data.question,
                    answer: response.data.answer
                };
                setData(newFaq)
            })

    }, []);
    const onChangeCategory = (e) => {
        let select = document.getElementById("categorie");
        let choice = select.selectedIndex;
        let valeur = select.options[choice].value;
        setGetCategory(document.getElementById('categorie').value = valeur);
        const newData = {...data};
        newData.faq_category_id = e.target.value;
        setData(newData);
    };

    const onChangeQuiz = (e) => {
        const newData = {...data};
        newData.question = e.target.value;
        setData(newData);
    };

    const onChangeAnswers = (e) => {
        const newData = {...data};
        newData.answer = e.target.value;
        setData(newData);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const formData = {
            faq_category_id: getCategory,
            question: data.question,
            answer: data.answer
        };
        setStartRequest(true);
        axios.put(appConfig.apiDomaine+`/faqs/${editfaqid}`, data)
            .then(response => {
                setStartRequest(false);
                setError(defaultError);
                setData(defaultData);
                ToastBottomEnd.fire(toastAddSuccessMessageConfig);
            })
            .catch(error => {
                setStartRequest(false);
                setError({...defaultError});
                ToastBottomEnd.fire(toastAddErrorMessageConfig);
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
                                        Modifier une FAQ
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
                                                The example form below demonstrates common HTML form elements that
                                                receive updated styles from Bootstrap with additional classes.
                                            </div>
                                        </div>
                                    </div>


                                    <div
                                        className={error.faq_category_id.length ? "form-group validated" : "form-group"}>
                                        <label htmlFor="exampleSelect1">Catégorie</label>
                                        {categorieData.data ? (
                                            <select
                                                name="categorie"
                                                id="categorie"
                                                className={error.faq_category_id.length ? "form-control is-invalid" : "form-control"}
                                                value={data.faq_category_id}
                                                onChange={(e) => onChangeCategory(e)}>
                                                <option value=""> None</option>
                                                {categorieData.data.map((element, i) => (
                                                    <option key={i} value={element.id}>{element.name}</option>
                                                ))}
                                            </select>
                                        ) : ''
                                        }

                                        {
                                            error.faq_category_id.length ? (
                                                error.faq_category_id.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                            ) : ""
                                        }
                                    </div>

                                    <div className={error.question.length ? "form-group validated" : "form-group"}>
                                        <label htmlFor="quiz">La question</label>
                                        <input
                                            id="quiz"
                                            type="text"
                                            className={error.question.length ? "form-control is-invalid" : "form-control"}
                                            placeholder="Veillez entrer la question"
                                            value={data.question}
                                            onChange={(e) => onChangeQuiz(e)}
                                        />
                                        {
                                            error.question.length ? (
                                                error.question.map((error, index) => (
                                                    <div key={index} className="invalid-feedback">
                                                        {error}
                                                    </div>
                                                ))
                                            ) : ""
                                        }
                                    </div>

                                    <div className={error.answer.length ? "form-group validated" : "form-group"}>
                                        <label htmlFor="answer">La réponse'</label>
                                        <textarea
                                            id="answer"
                                            className={error.answer.length ? "form-control is-invalid" : "form-control"}
                                            placeholder="Veillez entrer la réponse"
                                            cols="30"
                                            rows="5"
                                            value={data.answer}
                                            onChange={(e) => onChangeAnswers(e)}
                                        />
                                        {
                                            error.answer.length ? (
                                                error.answer.map((error, index) => (
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
                                                <button type="submit" onClick={(e) => onSubmit(e)}
                                                        className="btn btn-primary">Submit</button>
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
                                                <Link to="/settings/faqs/add" className="btn btn-secondary mx-2">
                                                    Cancel
                                                </Link>
                                            ) : (
                                                <Link to="/settings/faqs/add" className="btn btn-secondary mx-2"
                                                      disabled>
                                                    Cancel
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

export default EditFaqs;
