import React, {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router"

const UpdateInstitution = () => {

    const [name, setName] = useState(undefined);
    const [acronyme, setAcronyme]=useState(undefined);
    const [isoCode, setIsoCode] = useState('');
    const {institutionelemtslug} = useParams();
    const [loadRequest, setLoadRequest] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/institutions/${institutionelemtslug}`)
            .then(response => {
                setAcronyme(response.data.acronyme);
                setName(response.data.name);
                setIsoCode(response.data.iso_code)
            })
    }, []);

    const onChangeIso= (e) => {
        setIsoCode(e.target.value);
    };
    const onChangeName = (e) => {
        setName(e.target.value);
    };
    const onChangeAcronyme = (e) => {
        setAcronyme(e.target.value) ;
    };

    const updateInstitution = () => {
        setLoadRequest(true);
        axios({
            method: 'put',
            url: `http://127.0.0.1:8000/institutions/${institutionelemtslug}`,
            data: {
                name:name,
                acronyme: acronyme,
                iso_code:isoCode
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
                                INSTITUTION </h3>
                            <span className="kt-subheader__separator kt-hidden"></span>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter"></i></a>
                                <span className="kt-subheader__breadcrumbs-separator"></span>
                                <a href="" className="kt-subheader__breadcrumbs-link">
                                    Pages </a>
                                <span className="kt-subheader__breadcrumbs-separator"></span>
                                <a href="" className="kt-subheader__breadcrumbs-link">
                                    Institution </a>
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
                                            Modifier Institution
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
                                            <label>Acronyme</label>
                                            <input
                                                id="category"
                                                type="text"
                                                className="form-control"
                                                value={acronyme}
                                                onChange={(e) => onChangeAcronyme(e)}
                                                placeholder={"Veillez entrer le libellé"}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Iso_Code</label>
                                            <input
                                                id="category"
                                                type="text"
                                                className="form-control"
                                                value={isoCode}
                                                onChange={(e) => onChangeIso(e)}
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
                                                    onClick={() => updateInstitution()}>
                                                Send
                                            </button>
                                        ) : (
                                            <button type="button"
                                                    className="btn btn-info"
                                                    id="kt_blockui_3_3">
                                                Loading...
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

export default UpdateInstitution;