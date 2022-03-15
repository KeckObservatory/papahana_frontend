import axios from 'axios';
import { handleResponse, handleError } from './response';
import { Container, ObservationBlock, Semester, Instrument, InstrumentPackage, Template } from './../typings/papahana'
import { mock_get_instrument_package, mock_get_template, mock_get_containers, mock_get_observation_block_from_container, mock_get_semesters, mock_ob_get } from '../mocks/mock_utils';

// Define your api url from any source.
// Pulling from your .env file when on the server or from localhost when locally
const IS_PRODUCTION: boolean = process.env.REACT_APP_ENVIRONMENT==='production'
console.log(`is PRODUCTION? set to ${IS_PRODUCTION}`) 
var PRODUCTION_URL = 'https://www3build.keck.hawaii.edu/api/ddoi/'
var DEV_URL = 'http://localhost:50000/v0/' //use locally or for testing (npm start or npm run demobuild)
var BASE_URL = IS_PRODUCTION ? PRODUCTION_URL : DEV_URL // sets for production vs dev
var OB_URL = BASE_URL + 'obsBlocks' 
var CONTAINER_URL = BASE_URL + 'containers'
var SEMESTERS_URL = BASE_URL + 'semesterIds'
var INSTRUMENT_URL = BASE_URL + 'instrumentPackages'
var TEMPLATE_URL = BASE_URL + '/templates'
console.log('backend url set to')
console.log(BASE_URL)


const get_semesters = (observer_id: string): Promise<string[]> => {
    const url = `${SEMESTERS_URL}?obs_id=${observer_id}`
    return axios
        .get(url)
        .then(handleResponse)
        .catch(handleError);
}

const get_instrument_package = (instrument: Instrument): Promise<InstrumentPackage[]> => {
    const url = `${INSTRUMENT_URL}/${instrument}`
    return axios
        .get(url)
        .then(handleResponse)
        .catch(handleError);
}


const get_template = (name: string, ip_version: string='0.1.0', inst: string='KCWI'): Promise<Template> => {
    const url = `${INSTRUMENT_URL}/${inst}/templates?ip_version=${ip_version}&template_name=${name}`
    console.log('get_template url:', url)
    return axios
        .get(url)
        .then(handleResponse)
        .catch(handleError);
}

const get_containers = (sem_id: string, observer_id: string): Promise<Container[]> => {
    const url = `${SEMESTERS_URL}${sem_id}/containers?obs_id=${observer_id}`
    return axios
        .get(url)
        .then(handleResponse)
        .catch(handleError);
}

const get_observation_blocks_from_container = (container_id: string): Promise<ObservationBlock[]> => {
    const url = `${CONTAINER_URL}/items/?container_id=${container_id}`
    return axios
        .get(url)
        .then(handleResponse)
        .catch(handleError);
};

const ob_get = (ob_id: string ): Promise<ObservationBlock> => {
    const url = `${OB_URL}?ob_id=${ob_id}`
    return axios
        .get(url)
        .then(handleResponse)
        .catch(handleError);
}

const ob_post = (ob: object): Promise<string> => {
    return axios
        .post(`${OB_URL}`, ob)
        .then(handleResponse)
        .catch(handleError);
};

const ob_put = (ob_id: string, ob: ObservationBlock): Promise<any> => {
    const url = `${OB_URL}?ob_id=${ob_id}`
    return axios
        .put(url, ob)
        .then(handleResponse)
        .catch(handleError);
};

const ob_remove = (ob_id: string): Promise<any> => {
    return axios
        .delete(`${OB_URL}?ob_id=${ob_id}`)
        .then(handleResponse)
        .catch(handleError);
};

const container_get = (container_id: string): Promise<Container> => {
    const url = `${CONTAINER_URL}?container_id=${container_id}`
    return axios
        .get(url)
        .then(handleResponse)
        .catch(handleError);
}

const container_post = (container: object): Promise<string> => {
    return axios
        .post(`${CONTAINER_URL}`, container)
        .then(handleResponse)
        .catch(handleError);
};

const container_put = (container_id: string, container: Container): Promise<any> => {
    const url = `${CONTAINER_URL}?container_id=${container_id}`
    return axios
        .put(url, container)
        .then(handleResponse)
        .catch(handleError);
};

const container_remove = (container_id: string): Promise<any> => {
    return axios
        .delete(`${CONTAINER_URL}?container_id=${container_id}`)
        .then(handleResponse)
        .catch(handleError);
};

export const get_select_funcs = {
    get_template: IS_PRODUCTION ? get_template : mock_get_template,
    get_semesters: IS_PRODUCTION ? get_semesters : mock_get_semesters,
    get_containers: IS_PRODUCTION ? get_containers : mock_get_containers,
    get_observation_blocks_from_container: IS_PRODUCTION ? get_observation_blocks_from_container : mock_get_observation_block_from_container,
    get_instrument_package: IS_PRODUCTION ? get_instrument_package : mock_get_instrument_package
}

export const ob_api_funcs = {
    get: IS_PRODUCTION ? ob_get : mock_ob_get,
    post: ob_post,
    put: ob_put,
    remove: ob_remove,
};

export const container_api_funcs = {
    get: container_get,
    post: container_post,
    put: container_put,
    remove: container_remove
}
