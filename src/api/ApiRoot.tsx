// provider.js
// get, push, put, delete

import axios  from 'axios';
import { handleResponse, handleError } from './response';
import { Document } from './../typings/papahana'


// Define your api url from any source.
// Pulling from your .env file when on the server or from localhost when locally

// const BASE_URL: any = {
//     papahana_demo: 'https://vm-appserver.keck.hawaii.edu/api/ddoi/v0/obsBlocks?',
//     papahana_local: 'http://localhost:50000/v0/obsBlocks?'
// }

var BASE_URL = 'http://localhost:50000/v0/obsBlocks?'
console.log(BASE_URL)
console.log(process.env)
const get = (resource: string, api_type: string): Promise<Document> => {
    const url = `${BASE_URL}${resource}`
    console.log(url)
    return axios
        .get(url)
        .then(handleResponse)
        .catch(handleError);
};

const post = (resource: string, api_type: string, model: object): Promise<any> => {
    return axios
        .post(`${BASE_URL}${resource}`, model)
        .then(handleResponse)
        .catch(handleError);
};

const put = (resource: string, api_type: string, model: object): Promise<any> => {
    const url = `${BASE_URL}${resource}`
    console.log(`put url ${url}`)
    console.log(`model ${model}`)
    console.log(model)
    return axios
        .put(url, model)
        .then(handleResponse)
        .catch(handleError);
};

const remove = (resource: string, api_type: string ): Promise<any> => {
    return axios
        .delete(`${BASE_URL}${resource}`)
        .then(handleResponse)
        .catch(handleError);
};

export const api_funcs = {
    get,
    post,
    put,
    remove,
};
