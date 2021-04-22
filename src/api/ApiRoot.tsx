// provider.js

import axios from 'axios';
import { handleResponse, handleError } from './response';

// Define your api url from any source.
// Pulling from your .env file when on the server or from localhost when locally

const BASE_URL: any = {
    papahana_demo: 'https://vm-appserver.keck.hawaii.edu/api/ddoi/v0/obsBlocks?',
    papahana_local: 'localhost:500001/v0/obsBlocks?'
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
