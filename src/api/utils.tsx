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

    return (
        apiTasks.get().then((res: any) => {
            return res;
        })
    )
}