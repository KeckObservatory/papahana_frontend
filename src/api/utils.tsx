import { Method, SourceAPI, Document } from "../typings/papahana";
import {api_funcs} from './ApiRoot';

export const mock_sem_id_call = (): Promise<string[]> => {
   const containers = 
   ["60a44a59415bce1d8a07e1c5",
   "60a44a59415bce1d8a07e1c7",
   "60a44a59415bce1d8a07e1c8",
   "60a44a59415bce1d8a07e1ca",
   "60a44a59415bce1d8a07e1cc"]
   
   const mockPromise = new Promise<string[]>((resolve) => {
      resolve(containers)
   })
   return mockPromise
}
export const mock_container_call = (): Promise<string[]> => {
   const obs = [
      "60a44a59415bce1d8a07e15c",
      "60a44a59415bce1d8a07e15d",
      "60a44a59415bce1d8a07e15e",
      "60a44a59415bce1d8a07e15f",
      "60a44a59415bce1d8a07e160"]
      
   const mockPromise = new Promise<string[]>((resolve) => {
      resolve(obs)
   })
   return mockPromise
}

export function api_call(resource: string, api: SourceAPI, method: Method, body={} as Document): Promise<Document | any> {
    switch(method) { 
        case 'get': { 
           return api_funcs.get(resource, api);
        } 
        case 'post': { 
           return api_funcs.post(resource, api, body);
        } 
        case 'remove': { 
           return api_funcs.remove(resource, api);
        } 
        case 'put': { 
           return api_funcs.put(resource, api, body);
        } 
     } 
}