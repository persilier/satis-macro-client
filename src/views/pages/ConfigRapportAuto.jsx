import React, {useEffect, useState} from "react";
import axios from "axios";
import {loadCss, filterDataTableBySearchValue, forceRound, formatSelectOption} from "../../helpers/function";
import LoadingTable from "../components/LoadingTable";
import appConfig from "../../config/appConfig";

import InfirmationTable from "../components/InfirmationTable";
import Select from "react-select";

import HeaderTablePage from "../components/HeaderTablePage";
import TagsInput from "react-tagsinput";
import {verifyPermission} from "../../helpers/permission";
import {Link} from "react-router-dom";

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token');

loadCss("/assets/plugins/custom/datatables/datatables.bundle.css");

const ConfigRapportAuto = () => {

    const periodeData = [
        {
            label:"Jour",
            email: []
        },
        {
            label:"Semaine",
            email: []
        },
        {
            label:"Mois",
            email: []
        },
    ];

    const defaultData = {
        periodeData:periodeData,
        institutions_id: ""
    };

    const [load, setLoad] = useState(true);
    const [data, setData] = useState(defaultData);
    const [disabledInput, setDisabledInput] = useState(false);
    const [institution, setInstitution] = useState(null);
    const [institutions, setInstitutions] = useState([]);
    const [startRequest, setStartRequest] = useState(false);

    useEffect(() => {
        axios.get(appConfig.apiDomaine + `/any/clients/create`)
            .then(response => {
                const options = [
                    response.data.institutions ? response.data.institutions.map((institution) => ({
                        value: institution.id,
                        label: institution.name
                    })) : ""
                ];
                setInstitutions(options);
            });
    }, []);

    const onChangeEmail = (id,mail) => {
        const newData = {...data};
        newData.periodeData.email=mail;
    console.log(mail,"MAIL")
    console.log(id,"id")
        // for (var i=0; i<newData.periodeData.length;i++){
        //     console.log(newData.periodeData[i].label, "ID")
        //     if (newData.periodeData[i].label===id){
        //         newData.periodeData[i].email=mail
        //     }
        // }
console.log(newData,"NEW")
        setData(newData);
    };

    const handleDisabledInputChange = () => {
        setDisabledInput(!disabledInput);
    };
    const onChangeInstitution = (selected) => {
        const newData = {...data};
        if (selected) {
            newData.institutions_id = selected.value;
            setInstitution(selected);
        } else setInstitution(null);
        setData(newData);
    };

    const onSubmit=(e)=>{
        e.preventDefault(e);
        setStartRequest(true);
    };

    return (
        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            Paramètres
                        </h3>
                        <span className="kt-subheader__separator kt-hidden"/>
                        <div className="kt-subheader__breadcrumbs">
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#" className="kt-subheader__breadcrumbs-home"><i
                                    className="flaticon2-shelter"/></a>
                                <span className="kt-subheader__breadcrumbs-separator"/>
                                <a href="" onClick={e => e.preventDefault()}
                                   className="kt-subheader__breadcrumbs-link">
                                    Configuration des Exigences
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                <InfirmationTable
                    information={"A common UI paradigm to use with interactive tables is to present buttons that will trigger some action. See official documentation"}/>

                <div className="kt-portlet">
                    <HeaderTablePage
                        addPermission={""}
                        title={"Configuration des Rapports Automatiques"}
                    />

                    {/*{*/}
                    {/*    load ? (*/}
                    {/*        <LoadingTable/>*/}
                    {/*    ) : (*/}
                    <div className="kt-portlet__body">
                        <div className="kt-section">
                            <div className="kt-section__content">

                                <div className="form-group row">
                                    <div className={"col d-flex align-items-center mt-4"}>
                                        <label className="kt-checkbox">
                                            <input type="checkbox" value={disabledInput}
                                                   onChange={handleDisabledInputChange}/>
                                            Toutes les institutions<span/>
                                        </label>
                                    </div>

                                    <div className={"col"}>
                                        <label htmlFor="client">Selectionez le client</label>
                                        <Select
                                            isClearable
                                            isDisabled={disabledInput}
                                            placeholder={"Veuillez sélectionner l'institution"}
                                            value={institution}
                                            onChange={onChangeInstitution}
                                            options={institutions[0]}
                                        />
                                    </div>
                                </div>

                                <table className="table table-striped">
                                    <thead>
                                    <tr>
                                        <th>Périodes</th>
                                        <th>Email(s)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {console.log(data,"DATA")}
                                    {
                                        data.periodeData.map((periode, i) => (
                                            <tr key={i}>
                                                <td>{periode.label}</td>
                                                <td>
                                                    <TagsInput
                                                        id={periode.label}
                                                        value={periode.email}
                                                        onChange={()=>onChangeEmail(periode.label)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                    {/*    )*/}
                    {/*}*/}
                    <div className="kt-portlet__foot">
                        <div className="kt-form__actions text-right">
                            {
                                !startRequest ? (
                                    <button type="submit" onClick={(e) => onSubmit(e)}
                                            className="btn btn-primary">Enregistrer</button>
                                ) : (
                                    <button
                                        className="btn btn-primary kt-spinner kt-spinner--left kt-spinner--md kt-spinner--light"
                                        type="button" disabled>
                                        Chargement...
                                    </button>
                                )
                            }
                            {
                                !startRequest ? (
                                    <Link to="/dashbord" className="btn btn-secondary mx-2">
                                        Quitter
                                    </Link>
                                ) : (
                                    <Link to="/dashbord" className="btn btn-secondary mx-2" disabled>
                                        Quitter
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ConfigRapportAuto;
