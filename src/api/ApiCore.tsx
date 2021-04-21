// core.js

import {apiProvider} from './ApiRoot';

interface options {
    getAll: boolean;
    url: string;
    api: string;
};

export class ApiCore {
    getAll: any;

    constructor(options: options) {

        if (options.getAll) {
            this.getAll = () => {
                return apiProvider.getAll(options.url, options.api);
            };
        }

    }
}
