import {ApiCore} from "./ApiCore";

export function api_call(url: string, api: string, method: string) {

    const apiTasks = new ApiCore({
        get: true,
        put: true,
        post: true,
        remove: true,
        url: url,
        api: api
    });


    if (method === 'get') {
        var func = apiTasks.get
    }
    if (method === 'put') {
        var func = apiTasks.put
    }
    if (method === 'post') {
        var func = apiTasks.post
    }
    if (method === 'remove') {
        var func = apiTasks.remove
    }

    return (
        // apiTasks.get().then((res: any) => {
        func().then((res: any) => {
            return res;
        })
    )

}