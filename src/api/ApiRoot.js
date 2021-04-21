// provider.js

import axios from 'axios';
import { handleResponse, handleError } from './response';

// Define your api url from any source.
// Pulling from your .env file when on the server or from localhost when locally
const BASE_URL = {
    telSched: 'https://www3build.keck.hawaii.edu/api/telSchedule?',
    proposal: 'https://www3build.keck.hawaii.edu/api/proposalsApi?',
    // koarti:  'https://vm-appserver.keck.hawaii.edu/api/koarti?'
    // koarti:  'https://www3build.keck.hawaii.edu/api/koarti?'
    // koarti:  'https://vm-koarti.keck.hawaii.edu:55557/koarti_api?'
    koarti:  'https://www3build.keck.hawaii.edu/api/proposalsApi?'
}


/** @param {string} resource */
const getAll = (resource, api_type) => {

    return axios
        .get(`${BASE_URL[api_type]}${resource}`)

        .then(handleResponse)
        .catch(handleError);
};

export const apiProvider = {
    getAll,
};
