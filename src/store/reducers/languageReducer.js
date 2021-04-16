import {CHANGE_LANGUAGE} from "../actions/languageAction";

const initialState = {
    languageSelected: "fr",
    countryLanguageImage: {
        "fr": "/personal/img/france.svg",
        "en": "/assets/media/flags/226-united-states.svg",
        "sp": "/assets/media/flags/128-spain.svg",
        "gm": "/assets/media/flags/162-germany.svg",
    }
};

const languageReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_LANGUAGE:
            return {
                ...state,
                languageSelected: action.language
            };
        default:
            return state;
    }
};

export default languageReducer;
