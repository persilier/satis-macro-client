import React, {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router"

const UpdateFaq = () => {

    const [quiz, setQuiz] = useState(undefined);
    const [answers, setAnswers]=useState(undefined);
    const [category, setCategory] = useState('');
    const [getCategory, setGetCategory] = useState(undefined);
    const [categorieData, setCategorieData] = useState([]);
    const [loadRequest, setLoadRequest] = useState(false);

    const {faqelemtslug} = useParams();

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/faq-categories')
            .then(response => setCategorieData(response.data));

        axios.get(`http://127.0.0.1:8000/faqs/${faqelemtslug}`)
            .then(response => {
                setAnswers(response.data.answer);
                setQuiz(response.data.question);
            })

    }, []);

    const onChangeSelect = (e) => {
        setCategory(e.target.value);
        let select = document.getElementById("categorie");
        let choice = select.selectedIndex;
        let valeur = select.options[choice].value;
        setGetCategory(document.getElementById('categorie').value = valeur)
    };

    const onChangeQuiz = (e) => {
        setQuiz(e.target.value);
    };
    const onChangeAnswers = (e) => {
        setAnswers(e.target.value) ;
    };

    const updateCatFaq = () => {
        setLoadRequest(true);
        axios({
            method: 'put',
            url: `http://127.0.0.1:8000/faqs/${faqelemtslug}`,
            data: {
               question:quiz,
                answer: answers,
                faq_category_id:getCategory
            },
        })
            .then(function (response) {
                console.log(response, 'OK');
                if (response.status===200){
                    setLoadRequest(false)
                }
            })
            .catch(function (response) {
                console.log(response);
            });
    };

    return (
        <div>
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                FAQs </h3>
                            <span className="kt-subheader__separator kt-hidden"></span>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter"></i></a>
                                <span className="kt-subheader__breadcrumbs-separator"></span>
                                <a href="" className="kt-subheader__breadcrumbs-link">
                                    Pages </a>
                                <span className="kt-subheader__breadcrumbs-separator"></span>
                                <a href="" className="kt-subheader__breadcrumbs-link">
                                    Faqs </a>
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
                                            Modifier FAQ
                                        </h3>
                                    </div>
                                </div>
                                {console.log(quiz,"QUIZ")}
                                {console.log(answers,"ANSWERS")}
                                <form className="kt-form" >
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
                                        <div className="form-group">
                                            {console.log(categorieData.data, "HELLO")}
                                            <label htmlFor="exampleSelect1">Catégorie</label>
                                            {categorieData.data ?(
                                                <select name="categorie" id="categorie" className="form-control" value={category}
                                                        onChange={(e) => onChangeSelect(e)}>
                                                    {categorieData.data.map((element, i) => (
                                                        <option key={i} value={element.id}>{element.name}</option>
                                                    ))}
                                                </select>
                                            ):''
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label>Quiz</label>
                                            <input
                                                id="category"
                                                type="text"
                                                className="form-control"
                                                value={quiz}
                                                onChange={(e) => onChangeQuiz(e)}
                                                placeholder={"Veillez entrer le libellé"}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Answers</label>
                                            <input
                                                id="category"
                                                type="text"
                                                className="form-control"
                                                value={answers}
                                                onChange={(e) => onChangeAnswers(e)}
                                                placeholder={"Veillez entrer le libellé"}
                                            />
                                        </div>
                                    </div>
                                </form>
                                <div className="kt-portlet__foot">
                                        {
                                            loadRequest === false ? (
                                                <button type="button"
                                                        className="btn btn-primary"
                                                        onClick={(e) => updateCatFaq(e)}>
                                                    Send
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-info"
                                                    id="kt_blockui_3_3">Loading...
                                                </button>
                                            )
                                        }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default UpdateFaq;