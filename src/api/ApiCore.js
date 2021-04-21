// core.js

import {apiProvider} from './ApiRoot';

export class ApiCore {
    constructor(options) {
        if (options.getAll) {
            this.getAll = () => {
                return apiProvider.getAll(options.url, options.api);
            };
        }

    }
}
