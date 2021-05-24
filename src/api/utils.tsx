import { Method, SourceAPI, Document, Semester, Container } from "../typings/papahana";
import { api_funcs, get_select_funcs } from './ApiRoot';
import { ObservationBlock } from '../typings/papahana'

export const get_sem_id_list = (observer_id: string): Promise<string[]> => {
   //make sem_id list from semesters
   const promise = new Promise<string[]>( (resolve) => {
      get_select_funcs.get_semesters(observer_id).then( (semesters: Semester[]) => {
        resolve(make_sem_id_list(semesters))
      })
   })
   return promise
}

export const make_sem_id_list = (semesters: Semester[]): string[] => {
   //let sem_ids: string[] = ['all'] // not possible to have both 'all' sem_id and 'all' containers`
   let sem_ids: string[] = []
   semesters.forEach( (sem: Semester) => {
     sem_ids.push(sem.sem_id)
   })
   return sem_ids 
}

export const get_container_list = (sem_id: string, observer_id: string): Promise<string[]> => {
   //make container list from containers and sem_id
   const promise = new Promise<string[]>( (resolve) => {
      get_select_funcs.get_semesters(observer_id).then( (semesters: Semester[]) => {
        resolve(make_container_list(semesters, sem_id))
      })
   })
   return promise
}

export const make_container_list = (semesters: Semester[], sem_id: string): string[] => {
   //populates container_list for sem_id
   let container_list: string[] = ['all']
   if (sem_id === 'all') {
     let cl: string[] = []
     semesters.forEach( (semester: Semester) => {
           cl = cl.concat(semester.container_list)
     })
     container_list = container_list.concat(Array.from(new Set(cl))) // remove duplicate containers across all sem_ids
     console.log(`adding ${container_list.length} (all) containers to drop down menu`)
   }
   else { //todo: replace with appropriate api call for semester
     const find_sem_id = (semester: Semester): boolean  => {
        return semester.sem_id === sem_id
     }
     const semester = semesters.find( find_sem_id )
     console.log(`semester selected: ${semester}`)
     if (semester) { 
      console.log(`adding ${semester.container_list.length} containers to drop down menu`)
      container_list = container_list.concat(semester.container_list)
     }
   }
   return container_list 
}

export const get_ob_list = (sem_id: string, container_id: string, observer_id: string ): Promise<string[]> => {
   //make container list from containers and sem_id
   const promise = new Promise<string[]>( (resolve) => {
      get_select_funcs.get_containers(sem_id, observer_id).then( (containers: Container[]) => {
        resolve(make_ob_list(containers, container_id))
      })
   })
   return promise
}
export const make_ob_list = (containers: Container[], container_id: string): string[] => {
   //populates ob_id list for given container_id
   let ob_list: string[] = []
   if (container_id === 'all') {
     let ol: string[] = []
     containers.forEach( (container: Container) => {
           ol = ol.concat(container.observation_blocks)
     })
     ob_list = Array.from(new Set(ol)) // remove duplicate containers across all containers 
     console.log(`adding ${ob_list.length} (all) ob to drop down menu`)
   }
   else { //todo: replace with appropriate api call for semester
     const find_container_id = (container: Container):boolean => {
        return container._id === container_id
     }
     console.log(`container ${containers[0]._id} is ${container_id}?`)
     const container = containers.find( find_container_id ) as Container 
     if (container)  {
       console.log(`adding ${container.observation_blocks.length} ob to drop down menu`)
       ob_list = container.observation_blocks
     }
   }
   return ob_list 
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