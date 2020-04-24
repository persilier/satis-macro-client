import React, {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router"


const UpdateTypeClient = () => {

    const [name, setName] = useState(undefined);
    const [description, setDescription]=useState(undefined);
    const [institution, setInstitution] = useState('');
    const [getInstitution, setGetInstitution] = useState(undefined);
    const [institutionData, setInstitutionData] = useState([]);
    const [loadRequest, setLoadRequest] = useState(false);
    const {typeelemtid} = useParams();

    useEffect(() => {
        console.log(useParams);
        axios.get('http://127.0.0.1:8000/institutions')
            .then(response => setInstitutionData(response.data));

        axios.get(`http://127.0.0.1:8000/type-clients/${typeelemtid}`)
            .then(response => {
                setName(response.data.name);
                setDescription(response.data.description);
                setGetInstitution(response.data.institution.name)
            })

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
        setDescription(e.target.value) ;
    };

    const updateTypeClient = () => {
        setLoadRequest(true);
        axios({
            method: 'put',
            url: `http://127.0.0.1:8000/type-clients/${typeelemtid}`,
            data: {
                name:name,
                description: description,
                institutions_id:getInstitution
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
                                TYPE CLIENT </h3>
                            <span className="kt-subheader__separator kt-hidden"></span>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter"></i></a>
                                <span className="kt-subheader__breadcrumbs-separator"></span>
                                <a href="" className="kt-subheader__breadcrumbs-link">
                                    Pages </a>
                                <span className="kt-subheader__breadcrumbs-separator"></span>
                                <a href="" className="kt-subheader__breadcrumbs-link">
                                    Type </a>
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
                                            Modifier Type client
                                        </h3>
                                    </div>
                                </div>

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
                                            {console.log(institutionData.data, "HELLO")}
                                            <label htmlFor="exampleSelect1">Institution</label>
                                            {institutionData.data ?(
                                                <select name="institution" id="institution" className="form-control" value={institution}
                                                        onChange={(e) => onChangeSelect(e)}>
                                                    {institutionData.data.map((element, i) => (
                                                        <option key={i} value={element.id}>{element.name}</option>
                                                    ))}
                                                </select>
                                            ):''
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input
                                                id="category"
                                                type="text"
                                                className="form-control"
                                                value={name}
                                                onChange={(e) => onChangeName(e)}
                                                placeholder={"Veillez entrer le libellé"}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Description</label>
                                            <input
                                                id="category"
                                                type="text"
                                                className="form-control"
                                                value={description}
                                                onChange={(e) => onChangeDescription(e)}
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
                                                    onClick={(e) => updateTypeClient(e)}>
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

export default UpdateTypeClient;