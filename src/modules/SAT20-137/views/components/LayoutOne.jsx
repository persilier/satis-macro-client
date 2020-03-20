import React, {useState} from "react";
import Modal from "./Modal";
import styled from "styled-components";
import EditPanelModal from "./EditPanelModal.jsx";
import {PANEL_ONE, PANEL_TWO} from "../../constants/globalConstants";
import TextField from "./TextField";
import Textarea from "./Textarea";
import Select from "./Select";

const ActionButton = styled.span`
    margin-left: auto;
    cursor: pointer;
`;

const LayoutOne = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [showEditPanelModal, setShowEditPanelModal] = useState(false);
    const [editPanel, setEditPanel] = useState(undefined);
    const [panelOne, setPanelOne] = useState({title: 'Panel 1', content: []});
    const [panelTwo, setPanelTwo] = useState({title: 'Panel 2', content: []});
    const [action, setAction] = useState({title: '', endpoint: '/login'});
    const [description, setDescription] = useState('');

    const onClickAddButton = (layout) => {
        setEditPanel(layout);
        setShowModal(true);
    };

    const onClickEditButton = (layout) => {
        setEditPanel(layout);
        setShowEditPanelModal(true);
    };

    const handleCloseModal =  () => {
        setShowModal(false);
    };

    const handleCloseEditPanelModal =  () => {
        setEditPanel(undefined);
        setShowEditPanelModal(false);
    };

    const returnLayoutChoice = () => {
        props.returnLayoutChoice();
    };

    const updatePanelOne = (title) => {
        const newPanelOne = {
            ...panelOne,
            title: title
        };
        setPanelOne(newPanelOne);
    };

    const updatePanelTwo = (title) => {
        const newPanelTwo = {
            ...panelTwo,
            title: title
        };
        setPanelTwo(newPanelTwo);
    };

    const addElementPanelOne = (element) => {
        let newPanelOne = panelOne;
        newPanelOne.content.push(element);
        setPanelOne(newPanelOne);
    };

    const addElementPanelTwo = (element) => {
        let newPanelTwo = panelTwo;
        newPanelTwo.content.push(element);
        setPanelTwo(newPanelTwo);
    };

    const onClickSaveButton = () => {
        const newForm = {
            name: '',
            description: description,
            content: {
                'layout': 'layout-1',
                'panel-1': panelOne,
                'panel-2': panelTwo,
                'action': action,
            }
        };
        props.getFormData(newForm);
    };

    const deleteInput = (index, panel) => {
        if (panel === 'panel-1') {
            let newPanelOne = {...panelOne};
            newPanelOne.content.splice(index, 1);
            setPanelOne(newPanelOne);
        } else {
            let newPanelTwo = {...panelTwo};
            newPanelTwo.content.splice(index, 1);
            setPanelTwo(newPanelTwo);
        }
    };

    const printInputs = (input, index, panel) => {
        if (input.type === 'text' || input.type === 'password' || input.type === 'email' || input.type === 'number' || input.type === 'date' || input.type === 'file' || input.type === 'tel') {
            return (
                <TextField deleteInput={(index, panel) => deleteInput(index, panel)} key={index} input={input} index={index} panel={panel}/>
            )
        } else if (input.type === 'textarea') {
            return (
                <Textarea deleteInput={(index, panel) => deleteInput(index, panel)} key={index} input={input} panel={panel}/>
            )
        } else if (input.type === 'select' || input.type === 'checkbox-group' || input.type === 'radio-group') {
            return (
                <Select deleteInput={(index, panel) => deleteInput(index, panel)} key={index} input={input} panel={panel}/>
            );
        }
    };

    const onChangeInput = (e) => {
        let newAction = {...action};
        if (e.target.id === 'select') {
            newAction.endpoint = e.target.value
        } else if (e.target.id === 'text') {
            newAction.title = e.target.value;
        } else {
            setDescription(e.target.value);
        }
        setAction(newAction);
    };

    return (
        <div className={"mb-4"}>
            <div className="form-row mb-3">
                <div className="col">
                    <label htmlFor="description">Description du formulaire</label>
                    <textarea
                        id="description"
                        cols="10"
                        rows="3"
                        className="form-control"
                        placeholder={"Veillez entrer la description du formulaire"}
                        value={description}
                        onChange={(e) => onChangeInput(e)}
                    />
                </div>
            </div>

            <div className={"row"}>
                <div className="col" style={{paddingRight: '1px'}}>
                    <div className="card">
                        <div className="card-header" style={{display: "flex"}}>
                            {panelOne.title}
                            <ActionButton>
                                <i
                                    className={"fa fa-pencil-square-o mr-1"}
                                    onClick={() => onClickEditButton(PANEL_ONE)}
                                />
                                <i
                                    className={"fa fa-plus ml-1"}
                                    onClick={() => onClickAddButton(PANEL_ONE)}
                                />
                            </ActionButton>
                        </div>
                        <div className="card-body">
                            {
                                panelOne.content.length ? (
                                    <div className="form-row">
                                        {
                                            panelOne.content.map((input, index) => printInputs(input, index, 'panel-1'))
                                        }
                                    </div>
                                ) : 'Veillez editer votre panel'
                            }
                        </div>
                    </div>
                </div>

                <div className="col" style={{paddingLeft: '1px'}}>
                    <div className="card">
                        <div className="card-header" style={{display: "flex"}}>
                            {panelTwo.title}
                            <ActionButton>
                                <i
                                    className={"fa fa-pencil-square-o mr-1"}
                                    onClick={() => onClickEditButton(PANEL_TWO)}
                                />
                                <i
                                    className={"fa fa-plus ml-1"}
                                    onClick={() => onClickAddButton(PANEL_TWO)}
                                />
                            </ActionButton>
                        </div>
                        <div className="card-body">
                            {
                                panelTwo.content.length ? (
                                    <div className="form-row">
                                        {
                                            panelTwo.content.map((index, input) => printInputs(index, input, 'panel-2'))
                                        }
                                    </div>
                                ) : 'Veillez editer votre panel'
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-row">
                <div className="col">
                    <label htmlFor="select">Action Submit Button</label>
                    <select name="" id="select" className={"form-control"} value={action.endpoint} onChange={(e) => onChangeInput(e)}>
                        <option value="/login">/login</option>
                        <option value="/sing-up">/sign-up</option>
                        <option value="/actor/create">/actor/create</option>
                        <option value="/institution/create">/institution/create</option>
                        <option value="/agent/create">/agent/create</option>
                        <option value="/unit-institution/create">/unite-institution/create</option>
                    </select>
                </div>
                <div className="col">
                    <label htmlFor="text">Title Submit Button</label>
                    <input id={"text"} type="text" className={"form-control"} value={action.title} onChange={(e) => onChangeInput(e)}/>
                </div>
            </div>

            <div className="form-row mt-3" style={{display: "flex", justifyContent: "flex-end"}}>
                {
                    props.defaultLayoutSelected ? '' : (
                        <button
                            onClick={() => returnLayoutChoice()}
                            className={"btn btn-default ml-2 pr-5 pl-5"}
                        >
                            Close
                        </button>
                    )
                }
                <button
                    onClick={onClickSaveButton}
                    className={"btn btn-primary ml-2 pr-5 pl-5"}
                >
                    Save
                </button>
            </div>

            <Modal
                isOpen={showModal}
                panel={editPanel}
                panelOne={addElementPanelOne}
                panelTwo={addElementPanelTwo}
                onRequestClose={handleCloseModal}
                contentLabel="Minimal Modal Example"
                ariaHideApp={false}
                handleCloseModal={handleCloseModal}
            />

            <EditPanelModal
                panel={editPanel}
                panelOne={updatePanelOne}
                panelTwo={updatePanelTwo}
                isOpen={showEditPanelModal}
                onRequestClose={handleCloseEditPanelModal}
                contentLabel="Minimal Modal Example"
                ariaHideApp={false}
                handleCloseModal={handleCloseEditPanelModal}
            />
        </div>
    );
};

export default LayoutOne;
