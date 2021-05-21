import { mock_ob, mock_container_list, mock_ob_id_list, mock_sem_id_list } from "../components/json_viewer/mock_ob";
import { Method, SourceAPI, Document } from "../typings/papahana";
import {api_funcs} from './ApiRoot';
import { ObservationBlock } from '../typings/papahana'

export const mock_get_sem_id_list = (observer_id: string): Promise<string[]> => {
   let semid = [...mock_sem_id_list]
   console.log(`mock data for observer_id: ${observer_id}`)
   semid.push('all')
   const mockPromise = new Promise<string[]>((resolve) => {
      resolve(semid)
   })
   return mockPromise 
}

export const mock_sem_id_call = (sem_id: string): Promise<string[]> => {
   let containers = [ ...mock_container_list ]
   containers.push('all')
   const mockPromise = new Promise<string[]>((resolve) => {
      resolve(containers)
   })
   return mockPromise
}
export const mock_container_call = (container_id: string): Promise<string[]> => {
   let obs = [ ...mock_ob_id_list ]
   const mockPromise = new Promise<string[]>((resolve) => {
      resolve(obs)
   })
   return mockPromise
}

export const mock_ob_get = (ob_id: string): Promise<ObservationBlock> => {
const mockPromise = new Promise<ObservationBlock>( (resolve) => {
   resolve(mock_ob)
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