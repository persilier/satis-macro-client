import {ADD_IDENTITE} from "../actions/IdentiteAction";

const initialState = {
    identite:{
        firstname:"",
        lastname: "",
        sexe: "",
        ville: "",
        telephone: [],
        email: [],
        id_card: [],
    }

};

export default function identiteReducer (state = initialState, actions) {
    switch (actions.type) {
        case ADD_IDENTITE:
            const data = actions.data;
            return {
                firstname:data.firstname,
                lastname: data.lastname,
                sexe:data.sexe,
                ville: data.ville,
                telephone: data.telephone,
                email:data.email,
                id_card:data.id_card,
            };
        default:
    }
    return state;
};