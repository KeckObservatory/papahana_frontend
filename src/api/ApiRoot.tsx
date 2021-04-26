// provider.js
// get, push, put, delete

import axios from 'axios';
import { handleResponse, handleError } from './response';

// Define your api url from any source.
// Pulling from your .env file when on the server or from localhost when locally

const BASE_URL: any = {
    papahana_demo: 'https://vm-appserver.keck.hawaii.edu/api/ddoi/v0/obsBlocks?',
    papahana_local: 'localhost:500001/v0/obsBlocks?'
}

const get = (resource: string, api_type: string) => {
    return axios
        .get(`${BASE_URL[api_type]}${resource}`)
        .then(handleResponse)
        .catch(handleError);
};

const post = (resource: string, api_type: string, model: object) => {
    return axios
        .post(`${BASE_URL[api_type]}${resource}`, model)
        .then(handleResponse)
        .catch(handleError);
};

const put = (resource: string, api_type: string, model: object) => {
    return axios
        .put(`${BASE_URL[api_type]}${resource}`, model)
        .then(handleResponse)
        .catch(handleError);
};

const remove = (resource: string, api_type: string, id: string) => {
    return axios
        .delete(`${BASE_URL[api_type]}${resource}`, { data: { ob_id: id } })
        .then(handleResponse)
        .catch(handleError);
};

export const api_funcs = {
    get,
    post,
    put,
    remove,
};
