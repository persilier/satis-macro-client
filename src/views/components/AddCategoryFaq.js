import React, {useEffect, useState} from "react";
import axios from "axios";

const AddCategoryFaq = (props) => {

    const [loadRequest, setLoadRequest] = useState(false);
    const [categorie, setCategorie] = useState(undefined);

    const onChangeCategorie = (e) => {
        setCategorie(e.target.value);
    };

    const addFaq = () => {
        setLoadRequest(true);
        if (categorie !== undefined) {
            axios({
                method: 'post',
                url: `http://127.0.0.1:8000/faq-categories`,
                data: {
                    name: categorie,
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
        }
    };
    return (
        <div>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">New Category</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label>Libellé</label>
                                <input type="text" className="form-control" aria-describedby="emailHelp"
                                       placeholder="Veillez entrer le libellé de la catégorie"
                                       onChange={(e) => onChangeCategorie(e)}
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
                                    className="btn btn-info"
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

export default AddCategoryFaq;