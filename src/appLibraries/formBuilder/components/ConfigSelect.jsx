import React, {useState} from "react";

const ConfigSelect = (props) => {
    const [label, setLabel] = useState('');
    const [id, setId] = useState('');
    const [placeholder, setPlaceholder] = useState('');
    const [inputClass, setInputClass] = useState('col-md-12');
    const [name, setName] = useState('');
    const [model, setModel] = useState('actor');
    const [required, setRequired] = useState(false);
    const [maxLength, setMaxLength] = useState('');
    const [minLength, setMinLength] = useState('');
    const [regExp, setRegExp] = useState('');

    const onChangeInput = (e) => {
        switch (e.target.id) {
            case 'label':
                setLabel(e.target.value);
                break;
            case 'id':
                setId(e.target.value);
                break;
            case 'minLength':
                setMinLength(e.target.value);
                break;
            case 'maxLength':
                setMaxLength(e.target.value);
                break;
            case 'model':
                setModel(e.target.value);
                break;
            case 'inputClass':
                setInputClass(e.target.value);
                break;
            case 'name':
                setName(e.target.value);
                break;
            case 'placeholder':
                setPlaceholder(e.target.value);
                break;
            case 'regExp':
                setRegExp(e.target.value);
                break;
            default:
                setRequired(!required);
                break;
        }
    };

    if (props.information) {
        props.getElementData({
            type: 'select',
            id: id,
            placeholder: placeholder,
            label: label,
            inputClass: inputClass,
            name: name,
            model: model,
            required: required,
            maxLength: maxLength,
            minLength: minLength,
            regExp: regExp
        });
    }

    return (
        <div className="col-md-9">
            <h4 className={"text-center"}>Select</h4>
            <div className="form-row">
                <div className="col">
                    <label htmlFor="label">Label</label>
                    <input
                        id={"label"}
                        type="text"
                        className="form-control"
                        value={label}
                        onChange={(e) => onChangeInput(e)}
                    />
                </div>

                <div className="col">
                    <label htmlFor="id">Id</label>
                    <input
                        id={"id"}
                        type="text"
                        className="form-control"
                        value={id}
                        onChange={(e) => onChangeInput(e)}
                    />
                </div>

                <div className="col">
                    <label htmlFor="placeholder">Placeholder</label>
                    <input
                        id={"placeholder"}
                        type="text"
                        className="form-control"
                        value={placeholder}
                        onChange={(e) => onChangeInput(e)}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="col">
                    <label htmlFor="inputClass">Class</label>
                    <select
                        id="inputClass"
                        className="form-control"
                        value={inputClass}
                        onChange={(e) => onChangeInput(e)}
                    >
                        <option value="col-md-3">col-md-3</option>
                        <option value="col-md-4">col-md-4</option>
                        <option value="col-md-5">col-md-5</option>
                        <option value="col-md-6">col-md-6</option>
                        <option value="col-md-7">col-md-7</option>
                        <option value="col-md-8">col-md-8</option>
                        <option value="col-md-9">col-md-9</option>
                        <option value="col-md-10">col-md-10</option>
                        <option value="col-md-11">col-md-11</option>
                        <option value="col-md-12">col-md-12</option>
                    </select>
                </div>

                <div className="col">
                    <label htmlFor="name">Name</label>
                    <input id={"name"} type="text" className="form-control" value={name}
                           onChange={(e) => onChangeInput(e)}/>
                </div>
            </div>

            <div className="form-row">
                <div className="col">
                    <label htmlFor="model">Model</label>
                    <select name="model" id="model" className="form-control" value={model}
                            onChange={(e) => onChangeInput(e)}>
                        <option value="Actor">Actor</option>
                        <option value="Institution">Institution</option>
                        <option value="User">User</option>
                        <option value="Unite Institution">Unite Institution</option>
                    </select>
                </div>
            </div>

            <h4 className={"text-center"}>Validation</h4>
            <div className="form-row">
                <div className="custom-control custom-checkbox">
                    <input
                        type="checkbox"
                        id="customCheck1"
                        name={"required"}
                        className="custom-control-input"
                        value={required}
                        onChange={(e) => onChangeInput(e)}
                    />
                    <label htmlFor="customCheck1" className="custom-control-label">Required</label>
                </div>
            </div>

            <div className="form-row">
                <div className="col">
                    <label htmlFor="minLength">Min length</label>
                    <input id={"minLength"} type="number" className={"form-control"} value={minLength}
                           onChange={(e) => onChangeInput(e)}/>
                </div>

                <div className="col">
                    <label htmlFor="maxLength">Max length</label>
                    <input id={"maxLength"} type="number" className={"form-control"} value={maxLength}
                           onChange={(e) => onChangeInput(e)}/>
                </div>

                <div className="col">
                    <label htmlFor="regExp">RegExp</label>
                    <input id={"regExp"} type="text" className={"form-control"} value={regExp}
                           onChange={(e) => onChangeInput(e)}/>
                </div>
            </div>
        </div>
    )
};

export default ConfigSelect;
