import {ApiCore} from "./ApiCore";

export function api_call(url: string, api: string) {

    const apiTasks = new ApiCore({
        getAll: true,
        url: url,
        api: api
    });

    return (
        apiTasks.getAll().then((res: any) => {
            return res;
        })
    )
}