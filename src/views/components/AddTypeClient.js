import React, {useEffect, useState} from "react";
import axios from "axios";

const AddTypeClient = (props) => {

    const [name, setName] = useState(undefined);
    const [description, setDescription] = useState(undefined);
    const [institution, setInstitution] = useState('Choose one category');
    const [getInstitution, setGetInstitution] = useState(undefined);
    const [institutionData, setInstitutionData] = useState([]);
    const [loadRequest, setLoadRequest] = useState(false);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/institutions')
            .then(response => setInstitutionData(response.data))
    }, []);

    const onChangeSelect = (e) => {
        setInstitution(e.target.value);
        let select = document.getElementById("institution");
        let choice = select.selectedIndex;
        let valeur = select.options[choice].value;
        setGetInstitution(document.getElementById('institution').value = valeur)
    };
    const onChangeName = (e) => {
        setName(e.target.value);
    };
    const onChangeDescription = (e) => {
        setDescription(e.target.value);
    };

    const addTypeClient = () => {
        setLoadRequest(true);
        axios({
            method: 'post',
            url: `http://127.0.0.1:8000/type-clients`,
            data: {
                name: name,
                description: description,
                institutions_id: getInstitution
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
    };
    return (
        <div>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">New Type</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                {console.log(institutionData.data, "HELLO")}
                                <label htmlFor="exampleSelect1">Institution</label>
                                {institutionData.data ? (
                                    <select name="institution" id="institution" className="form-control" value={institution}
                                            onChange={(e) => onChangeSelect(e)}>
                                        {institutionData.data.map((element, i) => (
                                            <option key={i} value={element.id}>{element.name}</option>
                                        ))}
                                    </select>
                                ) : ''
                                }
                            </div>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" className="form-control" aria-describedby="emailHelp"
                                       placeholder="Veillez entrer le libellé de la catégorie"
                                       onChange={(e) => onChangeName(e)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input type="text" className="form-control" aria-describedby="emailHelp"
                                       placeholder="Veillez entrer le libellé de la catégorie"
                                       onChange={(e) => onChangeDescription(e)}
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
                                        onClick={() => addTypeClient()}>
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

export default AddTypeClient;