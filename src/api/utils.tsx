import { Method, SourceAPI, Document, Semester, Container, Scoby, Instrument, InstrumentPackage, Template } from "../typings/papahana";
import { ob_api_funcs, get_select_funcs } from './ApiRoot';
import { ObservationBlock } from '../typings/papahana'
import { resolve } from "path";

export const get_sem_id_list = (observer_id: string): Promise<string[]> => {
   //make sem_id list from semesters
   const promise = new Promise<string[]>((resolve) => {
      get_select_funcs.get_semesters(observer_id).then((semesters: string[]) => {
         resolve(semesters as string[])
      })
   })
   return promise
}

export const get_instrument_package = (instrument: Instrument): Promise<InstrumentPackage> => {
   const promise = new Promise<InstrumentPackage>((resolve) => {
      get_select_funcs.get_instrument_package(instrument).then((instrumentPackage: InstrumentPackage[]) => {
         resolve(instrumentPackage[0])
      })
   })
   return promise
}

export const get_template = (name: string): Promise<Template> => {
   const promise = new Promise<Template>((resolve) => {
      get_select_funcs.get_template(name).then((template: Template) => {
         const keys = Object.keys(template)
         if (keys.length === 1) {
            const tmp = Object.values(template)[0]
            resolve(tmp)
         }
      }).catch(err => {
         console.log(`get_template err: ${err}`)
      })
   })
   return promise
}


const create_sc_table = async (semesters: string[], observer_id: string) => {
   let sem_cons: [string, string][] = []
   await semesters.forEach(async (sem_id: string) => {
      await get_containers(sem_id, observer_id).then(async (containers: Container[]) => {
         containers.forEach((container: Container) => {
            const cid = container._id
            const sem_con = [sem_id, cid] as [string, string]
            sem_cons.push(sem_con)
         })
      })
   })

   return sem_cons
}

export const make_semid_scoby_table = async (sem_id: string, observer_id: string): Promise<Scoby[]> => {
      let scoby: Scoby[] = []
      return get_containers(sem_id, observer_id).then(async (containers: Container[]) => {
         containers.forEach((container: Container) => {
            const cid = container._id
            container.observation_blocks.forEach( (ob_id: string) => {
               const s = {
                  sem_id: sem_id,
                  container_id: cid,
                  ob_id: ob_id,
                  name: container.name
               }
               scoby.push(s)
            })
         })
      return scoby 
      })
}

const create_scoby_table = async (sem_cons: [string, string][]): Promise<Scoby[]> => {
   let rows: Scoby[] = []
   sem_cons.forEach(async (sem_con: [string, string]) => {
      const [sem_id, cid] = sem_con
      const obs = await get_select_funcs.get_observation_blocks_from_container(cid)
      obs.forEach((ob: ObservationBlock) => {
         const row = {
            sem_id: sem_id,
            container_id: cid,
            ob_id: ob._id,
            name: ob.metadata.name
         } as Scoby
         rows.push(row)
      })
   })
   return rows
}

export const make_scoby_table = (observer_id: string): Promise<Scoby[]> => {
   return get_select_funcs.get_semesters(observer_id)
      .then((semesters: string[]) => {
         return create_sc_table(semesters, observer_id)
      })
      .then((sem_cons: [string, string][]) => create_scoby_table(sem_cons))
}

export const get_obs_from_semester = async (observer_id: string, sem_id: string): Promise<any> => {
   const container_obs = await get_select_funcs.get_semesters(observer_id)
      .then((semesters: string[]) => {
         const semester = semesters.find((elem: string) => elem === sem_id)
         if (!semester) {
            console.log(`semid ${sem_id} not found for observer_id`);
            return []
         }
         return create_sc_table([semester], observer_id)
      })
      .then((sem_cons: [string, string][]) => {
         const container_obs: any = {}
         sem_cons.forEach(async (sem_cid: [string, string]) => {
            const cid = sem_cid[1]
            const obs = await get_select_funcs.get_observation_blocks_from_container(cid)
            container_obs[cid] = obs
         })
         return container_obs
      })

   const promise = new Promise<string[]>((resolve) => {
      resolve(container_obs)
   })
   return promise

}

export const make_sem_id_list = (semesters: Semester[]): string[] => {
   //let sem_ids: string[] = ['all'] // not possible to have both 'all' sem_id and 'all' containers`
   let sem_ids: string[] = []
   semesters.forEach((sem: Semester) => {
      sem_ids.push(sem.sem_id)
   })
   return sem_ids
}

export const get_container_list = (sem_id: string, observer_id: string): Promise<string[]> => {
   //make container list from containers and sem_id
   const promise = new Promise<string[]>((resolve) => {
      get_select_funcs.get_semesters(observer_id).then((semesters: string[]) => {
         resolve(make_container_list(semesters, sem_id, observer_id))
      })
   })
   return promise
}

export const get_containers = (sem_id: string, observer_id: string): Promise<Container[]> => {
   //make container given sem_id and observer_id 
   const promise = new Promise<Container[]>((resolve) => {
      resolve(get_select_funcs.get_containers(sem_id, observer_id))
   })
   return promise
}



export const make_container_list = async (semesters: string[], sem_id: string, observer_id: string) => {
   //populates container_list for sem_id

   const find_sem_id = (semester: string): boolean => {
      return semester === sem_id
   }

   let container_list: string[] = ['all']
   let cl: string[] = []
   var sc;
   if (sem_id === 'all') {
      sc = await create_sc_table(semesters, observer_id);
   }
   else { //todo: replace with appropriate api call for semester
      const semester = semesters.find(find_sem_id)
      sc = await create_sc_table([semester as string], observer_id);
   }

   sc.forEach((semid_cid: [string, string]) => {
      cl.push(semid_cid[1])
   })

   container_list = container_list.concat(Array.from(new Set(cl))) // remove duplicate containers across all sem_ids
   return container_list
}

export const get_ob_list = (sem_id: string, container_id: string, observer_id: string): Promise<string[]> => {
   //make container list from containers and sem_id
   const promise = new Promise<string[]>((resolve) => {
      get_select_funcs.get_containers(sem_id, observer_id).then((containers: Container[]) => {
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
      containers.forEach((container: Container) => {
         ol = ol.concat(container.observation_blocks)
      })
      ob_list = Array.from(new Set(ol)) // remove duplicate containers across all containers 
   }
   else { //todo: replace with appropriate api call for semester
      const find_container_id = (container: Container): boolean => {
         return container._id === container_id
      }
      const container = containers.find(find_container_id) as Container
      if (container) {
         ob_list = container.observation_blocks
      }
   }
   return ob_list
}