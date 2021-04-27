import {ApiCore} from "./ApiCore";

export function api_call(url: string, api: string, method: string) {

    const api_tasks = new ApiCore({
        get: true,
        put: true,
        post: true,
        remove: true,
        url: url,
        api: api
    });

    var func_str: string = "api_tasks." + method

    return (
        eval(func_str)().then((res: any) => {
            return res;
        })
    )

}