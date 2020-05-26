import React, {useState} from "react";
import TagsInput from "react-tagsinput";
import './staff/react-tagsinput.css';
import {connect} from "react-redux";
import {addIdentite} from "../../store/actions/IdentiteAction";

const IndentiteForm = (props) => {
    const defaultData = {
        firstname: "",
        lastname: "",
        sexe: "",
        ville: "",
        telephone: [],
        email: [],
        id_card: [],
    };
    const defaultError = {
        firstname: [],
        lastname: [],
        sexe: [],
        ville: [],
        telephone: [],
        email: "",
        id_card: [],
    };
    const [data, setData] = useState(props.getLoading ? props.getIdentite : defaultData);
    const [error] = useState(defaultError);

    const onChangeFirstName = (e) => {
        const newData = {...data};
        newData.firstname = e.target.value;
        setData(newData);
        props.addIdentite(newData)
    };

    const onChangeLastName = (e) => {
        const newData = {...data};
        newData.lastname = e.target.value;
        setData(newData);
        props.addIdentite(newData)
    };

    const onChangeTelephone = (tel) => {
        const newData = {...data};
        newData.telephone = tel;
        setData(newData);
        props.addIdentite(newData)
    };

    const onChangeSexe = (e) => {
        const newData = {...data};
        newData.sexe = e.target.value;
        setData(newData);
        props.addIdentite(newData)
    };
    const onChangeEmail = (mail) => {
        const newData = {...data};
        newData.email = mail;
        setData(newData);
        props.addIdentite(newData)
    };
    const onChangeVille = (e) => {
        const newData = {...data};
        newData.ville = e.target.value;
        setData(newData);
        props.addIdentite(newData)
    };
    const onChangeIdCard = (card) => {
        const newData = {...data};
        newData.id_card = card;
        setData(newData);
        console.log(props.addIdentite(newData));
        {
            console.log(newData, 'CARD')
        }
    };

    return (
        <div>
            <div className="kt-portlet__body">
                <div className="kt-section kt-section--first">
                    <h5 className="kt-section__title kt-section__title-lg">Identité:</h5>
                    <div className="form-group row">
                        <div className={error.lastname.length ? "col validated" : "col"}>
                            <label htmlFor="lastname">Votre nom de famille</label>
                            <input
                                id="lastname"
                                type="text"
                                className={error.lastname.length ? "form-control is-invalid" : "form-control"}
                                placeholder="Veillez entrer le nom de famille"
                                value={data.lastname}
                                onChange={(e) => onChangeLastName(e)}
                            />
                            {
                                error.lastname.length ? (
                                    error.lastname.map((error, index) => (
                                        <div key={index} className="invalid-feedback">
                                            {error}
                                        </div>
                                    ))
                                ) : ""
                            }
                        </div>

                        <div className={error.firstname.length ? "col validated" : "col"}>
                            <label htmlFor="firstname">Votre prénom</label>
                            <input
                                id="firstname"
                                type="text"
                                className={error.firstname.length ? "form-control is-invalid" : "form-control"}
                                placeholder="Veillez entrer le prénom"
                                value={data.firstname}
                                onChange={(e) => onChangeFirstName(e)}
                            />
                            {
                                error.firstname.length ? (
                                    error.firstname.map((error, index) => (
                                        <div key={index} className="invalid-feedback">
                                            {error}
                                        </div>
                                    ))
                                ) : ""
                            }
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className={error.sexe.length ? " col validated" : "col"}>
                            <label htmlFor="sexe">Votre sexe</label>
                            <select
                                id="sexe"
                                className={error.sexe.length ? "form-control is-invalid" : "form-control"}
                                value={data.sexe}
                                onChange={(e) => onChangeSexe(e)}
                            >
                                <option value="" disabled={true}>Veillez choisir le Sexe
                                </option>
                                <option value="F">Féminin</option>
                                <option value="M">Masculin</option>
                            </select>
                            {
                                error.sexe.length ? (
                                    error.sexe.map((error, index) => (
                                        <div key={index} className="invalid-feedback">
                                            {error}
                                        </div>
                                    ))
                                ) : ""
                            }
                        </div>
                        <div className={error.ville.length ? "col validated" : "col"}>
                            <label htmlFor="ville">Votre ville</label>
                            <input
                                id="ville"
                                type="text"
                                className={error.ville.length ? "form-control is-invalid" : "form-control"}
                                placeholder="Veillez entrer votre ville"
                                value={data.ville}
                                onChange={(e) => onChangeVille(e)}
                            />
                            {
                                error.ville.length ? (
                                    error.ville.map((error, index) => (
                                        <div key={index} className="invalid-feedback">
                                            {error}
                                        </div>
                                    ))
                                ) : ""
                            }
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className={error.telephone.length ? "col validated" : "col"}>
                            <label htmlFor="telephone">Votre Téléphone(s)</label>
                            <TagsInput
                                value={data.telephone}
                                onChange={onChangeTelephone}
                            />
                            {
                                error.telephone.length ? (
                                    error.telephone.map((error, index) => (
                                        <div key={index} className="invalid-feedback">
                                            {error}
                                        </div>
                                    ))
                                ) : ""
                            }
                        </div>

                        <div className={error.email.length ? "col validated" : "col"}>
                            <label htmlFor="email">Votre Email(s)</label>
                            <TagsInput
                                value={data.email}
                                onChange={onChangeEmail}
                            />
                            {
                                error.email.length ? (
                                    error.email.map((error, index) => (
                                        <div key={index} className="invalid-feedback">
                                            {error}
                                        </div>
                                    ))
                                ) : ""
                            }
                        </div>
                    </div>

                    <div
                        className={error.id_card.length ? "form-group validated" : "form-group"}>
                        <label htmlFor="account">Numero Carte d'Identité</label>
                        <TagsInput
                            value={data.id_card}
                            onChange={onChangeIdCard}/>
                        {
                            error.id_card.length ? (
                                error.id_card.map((error, index) => (
                                    <div key={index} className="invalid-feedback">
                                        {error}
                                    </div>
                                ))
                            ) : ""
                        }
                    </div>

                </div>
            </div>
        </div>
    )
};
const mapStateToProps = state => {
    return {
        identite: state.identite
    }
};

export default connect(mapStateToProps, {addIdentite})(IndentiteForm);