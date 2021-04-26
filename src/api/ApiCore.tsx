// core.js

import {api_funcs} from './ApiRoot';

interface options {
    get: boolean;
    post: boolean;
    put: boolean;
    remove: boolean;
    url: string;
    api: string;
};

export class ApiCore {
    get: any
    post: any
    put: any
    remove: any

    constructor(options: options) {

        this.get = () => {
            return api_funcs.get(options.url, options.api);
        };

        this.post = (model: object) => {
            return api_funcs.post(options.url, options.api, model);
        };

        this.put = (model: object) => {
            return api_funcs.put(options.url, options.api, model);
        };

        this.remove = (id: string) => {
            return api_funcs.remove(options.url, options.api, id);
        };

        // if (options.get) {
        //     this.get = () => {
        //         return api_funcs.get(options.url, options.api);
        //     };
        // }
        //
        // if (options.post) {
        //     this.post = (model: object) => {
        //         return api_funcs.post(options.url, options.api, model);
        //     };
        // }
        //
        // if (options.put) {
        //     this.put = (model: object) => {
        //         return api_funcs.put(options.url, options.api, model);
        //     };
        // }
        //
        // if (options.remove) {
        //     this.remove = (id: string) => {
        //         return api_funcs.remove(options.url, options.api, id);
        //     };
        // }

    }
}
