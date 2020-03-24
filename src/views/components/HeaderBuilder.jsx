import React, {useState} from "react";
import {addData} from "../../constants/headerBuilder";

const HeaderBuilder = (props) => {
    const data = props.editData ? props.editData : addData;
    const [state, setState] = useState(data);

    const onChangeDescription = (e) => {
        const newState = {...state};
        newState.description = e.target.value;
        setState(newState);
    };

    const onChangePrint = (index) => {
        const newState = {...state};
        newState.content[index].print = !newState.content[index].print;
        setState(newState);
    };

    const onChangeElementDescription = (index, e) => {
        const newState = {...state};
        newState.content[index].description = e.target.value;
        setState(newState);
    };

    const onChangeLabel = (index, e) => {
        const newState = {...state};
        newState.content[index].label = e.target.value;
        setState(newState);
    };

    const onSubmit = () => {
        props.getData(state);
    };

    return (
        <div>
            <h1 className="text-center">Header Builder</h1>
            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                <div className="row">
                    <div className="col-md-12">

                        <div className="kt-portlet">
                            <div className="kt-form">
                                <div className="kt-portlet__body">
                                    <div className="form-group">
                                        <label htmlFor={"description"}>Description</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            id="description"
                                            cols="30"
                                            rows="2"
                                            value={state.description}
                                            onChange={(e) => onChangeDescription(e)}
                                            placeholder={"Veillez entrer la description du header builder"}
                                        />
                                    </div>
                                    <div style={{height: "300px", overflow: "scroll", overflowX: "hidden"}}>
                                        {
                                            state.content.map((element, index) => (
                                                <div className="form-row" key={index}>
                                                    <div className="form-group col-md-3">
                                                        <label htmlFor={"label"+index}>Libellé</label>
                                                        <input
                                                            id={"label"+index}
                                                            type="text"
                                                            className="form-control"
                                                            value={element.label}
                                                            onChange={(e) => onChangeLabel(index, e)}
                                                            placeholder={"Veillez entrer le libellé"}
                                                        />
                                                    </div>

                                                    <div className="form-group col">
                                                        <label htmlFor={"eDescription"+index}>Description</label>
                                                        <textarea
                                                            className="form-control"
                                                            name="description"
                                                            id={"eDescription"+index}
                                                            cols="30"
                                                            rows="2"
                                                            value={element.description}
                                                            onChange={(e) => onChangeElementDescription(index, e)}
                                                            placeholder={"Veillez entrer la description"}
                                                        />
                                                    </div>

                                                    <div className="col-md-2 form-group" style={{display: "flex", alignItems: "center"}}>
                                                        <label className="kt-checkbox kt-checkbox--brand">
                                                            <input
                                                                type="checkbox"
                                                                checked={element.print}
                                                                onChange={(e) => onChangePrint(index)}
                                                            /> Afficher
                                                            <span/>
                                                        </label>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                                <div className="kt-portlet__foot">
                                    <div className="kt-form__actions">
                                        <button type="reset" className="btn btn-primary" onClick={() => onSubmit()}>Enregistrer</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <pre className="mt-4" style={{backgroundColor: "#f7f7f7", padding: "10px", borderRadius: "5px", wordWrap: "normal", wordBreak: "normal"}}>
                {
                    JSON.stringify(state)
                }
            </pre>
        </div>
    );
};

export default HeaderBuilder;
