import { Method, SourceAPI, Document } from "../typings/papahana";
import {api_funcs} from './ApiRoot';


export function api_call(url: string, api: SourceAPI, method: Method, body={} as Document): Promise<Document | any> {
    switch(method) { 
        case 'get': { 
           return api_funcs.get(url, api);
        } 
        case 'post': { 
           return api_funcs.post(url, api, body);
        } 
        case 'remove': { 
           return api_funcs.remove(url, api);
        } 
        case 'put': { 
           return api_funcs.put(url, api, body);
        } 
     } 
}