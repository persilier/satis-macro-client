import appConfig from "../../config/appConfig";
import axios from 'axios';
import ls from 'localstorage-slim'

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// axios.defaults.headers.common['Authorization'] = "Bearer "+ls.get('token');

class AppLibrariesModel {

    save() {

    };

    static add(user) {
        // USER AXIOS TO PUT DATA IN DATABASE
        return "add";
    }

    static allHeader() {
        return new Promise((resolve, reject) => {
            axios.get(appConfig.apiDomaine + '/header')
                .then(response => resolve(response))
                .catch(error => reject(error));
        })
    }

    static finById(id) {
        return {

        };
    }

    static update(user) {

    }

    static delete(user) {

    }
}

export default AppLibrariesModel;