// core.js

import {apiProvider} from './ApiRoot';

// const apiTasks = new ApiCore({
//     getAll: true,
//     url: url,
//     api: api
// });

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
