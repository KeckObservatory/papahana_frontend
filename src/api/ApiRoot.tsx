// provider.js

import axios from 'axios';
import { handleResponse, handleError } from './response';

// Define your api url from any source.
// Pulling from your .env file when on the server or from localhost when locally

interface urls {
    telSched: string;
    proposal: string;
    koarti:  string;
}

const BASE_URL: any = {
    telSched: 'https://www3build.keck.hawaii.edu/api/telSchedule?',
    // proposal: 'https://www3build.keck.hawaii.edu/api/proposalsApi?',
    proposal: 'https://vm-appserver.keck.hawaii.edu/api/proposalsApi?',
    koarti:  'https://www3build.keck.hawaii.edu/api/koarti?'
}


/** @param {string} resource */
const getAll = (resource: string, api_type: string) => {

    return axios
        .get(`${BASE_URL[api_type]}${resource}`)

        .then(handleResponse)
        .catch(handleError);
};

export const apiProvider = {
    getAll,
};
