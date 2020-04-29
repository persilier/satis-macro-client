import React, {useEffect, useState} from 'react';
import axios from 'axios';
import appConfig from "../../config/appConfig";


const FaqListe = () => {

    const [data, setData] = useState([]);
    const [category, setCategory] = useState([]);
    useEffect(() => {
        axios.get(appConfig.apiDomaine+`/faq-categories`)
            .then(response => {
                setCategory(response.data)
            });

        axios.get(appConfig.apiDomaine+`/faqs`)
            .then(response => {
                setData(response.data)
            })
    }, []);

    return (
        <div>
            <div className="row">
                <div className="col-xl-9">
                    <div className="accordion accordion-solid accordion-toggle-plus" id="accordionExample1">

                        {category.data ? (
                            category.data.map((cat, i) => (
                                <div className="card" key={i}>
                                    <h6 className="text-dark">
                                        {cat.name}
                                    </h6>

                                    {data.data ? (
                                        data.data.map((elemt, id) => (
                                            <div className="card-header" id={"heading" + id} key={id}>
                                                {(elemt.category.name === cat.name) ? (
                                                    <div>
                                                        <div className="card-title" data-toggle="collapse"
                                                             data-target={"#collapse" + id} aria-expanded="false"
                                                             aria-controls={"collapse" + id}>
                                                            {elemt.question}
                                                        </div>

                                                        <div id={"collapse" + id} className="collapse show"
                                                             aria-labelledby={"heading" + id}
                                                             data-parent="#accordionExample1">
                                                            <div className="card-body">
                                                                <p>
                                                                    {elemt.answer}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : ''}
                                            </div>
                                        ))
                                    ) : ''}
                                </div>
                            ))
                        ) : ""}

                    </div>
                </div>
            </div>
        </div>
    )
};

export default FaqListe;