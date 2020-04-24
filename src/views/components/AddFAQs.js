import React, {useEffect, useState} from "react";
import axios from "axios";

const AddFAQs = (props) => {
    const [quiz, setQuiz] = useState(undefined);
    const [answers, setAnswers]=useState(undefined);
    const [category, setCategory] = useState('Choose one category');
    const [getCategory, setGetCategory] = useState(undefined);
    const [categorieData, setCategorieData] = useState([]);
    const [loadRequest, setLoadRequest] = useState(false);


    useEffect(() => {
        axios.get('http://127.0.0.1:8000/faq-categories')
            .then(response => setCategorieData(response.data))
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

    const addFaq = () => {
        setLoadRequest(true);
        if (category !== undefined) {
            axios({
                method: 'post',
                url: `http://127.0.0.1:8000/faqs`,
                data: {
                    question: quiz,
                    answer:answers,
                    faq_category_id:getCategory
                },
            })
                .then(function (response) {
                    console.log(response, 'OK');
                    if (response.status === 201) {
                       setLoadRequest(false)
                    }
                })
                .catch(function (response) {
                    console.log(response);
                });
        }else {
            alert("veuillez saisir les champs")
        }
    };
    return (
        <div>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">New FAQ</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
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
                                <input type="text" className="form-control" aria-describedby="emailHelp"
                                       placeholder="Veillez entrer le libellé de la catégorie" onChange={(e)=>onChangeQuiz(e)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Answers</label>
                                <input type="text" className="form-control" aria-describedby="emailHelp"
                                       placeholder="Veillez entrer le libellé de la catégorie" onChange={(e)=>onChangeAnswers(e)}
                                />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal">
                            Close
                        </button>

                        {
                            loadRequest === false ? (
                                <button type="button"
                                        className="btn btn-primary"
                                        onClick={() => addFaq()}>
                                    Send
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn btn-info"
                                    id="kt_blockui_3_3">Loading...
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

export default AddFAQs;