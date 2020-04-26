import React, {useState} from "react";
import axios from "axios";
import {
    Link
} from "react-router-dom";
import {ToastBottomEnd} from "./Toast";
import {toastAddErrorMessageConfig, toastAddSuccessMessageConfig} from "../../config/toastConfig";

const ModalAddCategoryFaq = (props) => {

    const defaultData = {
        name: "",
    };
    const defaultError = {
        name: [],
    };
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState(defaultError);
    const [startRequest, setStartRequest] = useState(false);

    const onChangeName = (e) => {
        const newData = {...data};
        newData.name = e.target.value;
        setData(newData);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setStartRequest(true);
        axios.post(`http://127.0.0.1:8000/faq-categories`, data)
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
        <div>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">New Category</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        <form method="POST" className="kt-form">
                            <div className={error.name.length ? "form-group validated" : "form-group"}>
                                <label htmlFor="name">le Nom</label>
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
                        </form>
                    </div>
                    <div className="modal-footer">
                        {
                            !startRequest ? (
                                <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-primary">Submit</button>
                            ) : (
                                <button className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light" type="button" disabled>
                                    Loading...
                                </button>
                            )
                        }
                        {
                            !startRequest ? (
                                <Link to="/settings/faqs/category" className="btn btn-secondary mx-2"  data-dismiss="modal">
                                    close
                                </Link>
                            ) : (
                                <Link to="/settings/faqs/category" className="btn btn-secondary mx-2" disabled  data-dismiss="modal">
                                    close
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ModalAddCategoryFaq;