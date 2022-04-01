import { Method, SourceAPI, Document, Semester, Container, Scoby, Instrument, InstrumentPackage, Template, ContainerObs } from "../typings/papahana";
import { ob_api_funcs, semid_api_funcs, get_select_funcs } from './ApiRoot';
import { ObservationBlock } from '../typings/papahana'
import { resolve } from "path";

export const get_sem_id_list = (): Promise<string[]> => {
   //make sem_id list from semesters
   const promise = new Promise<string[]>((resolve) => {
      get_select_funcs.get_semesters().then((semesters: string[]) => {
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
      get_select_funcs.get_template(name).then((templateObject: { [key: string]: Template }) => {
         const template = templateObject[name]
         resolve(template)
      }).catch(err => {
         console.log(`get_template err: ${err}`)
      })
   })
   return promise
}


const create_sc_table = async (semesters: string[]) => {
   let sem_cons: [string, string][] = []
   await semesters.forEach(async (sem_id: string) => {
      await get_containers(sem_id).then(async (containers: Container[]) => {
         containers.forEach((container: Container) => {
            const cid = container._id
            const sem_con = [sem_id, cid] as [string, string]
            sem_cons.push(sem_con)
         })
      })
   })

   return sem_cons
}

export const make_semid_scoby_table_and_containers = async (sem_id: string): Promise<[Scoby[], Container[]]> => {
   let scoby: Scoby[] = []
   return get_containers(sem_id)
      .then(async (containers: Container[]) => { // adds all obs in a special container
         const obs = await semid_api_funcs.get_semester_obs(sem_id)
         let allContainer: Container = {
            name: 'all obs',
            observation_blocks: [],
            _id: 'all obs',
            sem_id: sem_id
         }
         obs.forEach((ob: ObservationBlock) => {
            allContainer.observation_blocks.push(ob._id)
         })
         containers.push(allContainer)

         return containers
      })
      .then(async (containers: Container[]) => {
         containers.forEach(async (container: Container) => {
            const cid = container._id
            // const obs = await get_select_funcs.get_observation_blocks_from_container(cid)

            // Use this when the database containers refer to existing OBs
            // obs.forEach((ob: ObservationBlock) => {
            //    const row = {
            //       sem_id: sem_id,
            //       container_id: cid,
            //       container_name: container.name,
            //       ob_id: ob._id,
            //       name: ob.metadata.name
            //    } as Scoby
            //    scoby.push(row)
            // })
            container.observation_blocks.forEach((ob_id: string) => {
               const s = {
                  sem_id: sem_id,
                  container_id: cid,
                  ob_id: ob_id,
                  container_name: container.name
               }
               scoby.push(s)
            })
         })
         return [scoby, containers]
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

export const make_scoby_table = (): Promise<Scoby[]> => {
   return get_select_funcs.get_semesters()
      .then((semesters: string[]) => {
         return create_sc_table(semesters)
      })
      .then((sem_cons: [string, string][]) => create_scoby_table(sem_cons))
}



export const get_obs_from_semester = async (sem_id: string): Promise<ContainerObs> => {
   const container_obs = await get_select_funcs.get_semesters()
      .then((semesters: string[]) => {
         const semester = semesters.find((elem: string) => elem === sem_id)
         if (!semester) {
            console.log(`semid ${sem_id} not found`);
            return []
         }
         return create_sc_table([semester])
      })
      .then((sem_cons: [string, string][]) => {
         const container_obs: ContainerObs = {}
         sem_cons.forEach(async (sem_cid: [string, string]) => {
            const cid = sem_cid[1]
            const obs = await get_select_funcs.get_observation_blocks_from_container(cid)
            container_obs[cid] = obs
         })
         return container_obs
      })

   const promise = new Promise<ContainerObs>((resolve) => {
      resolve(container_obs)
   })
   return promise

}

export const get_container_list = (sem_id: string): Promise<string[]> => {
   //make container list from containers and sem_id
   const promise = new Promise<string[]>((resolve) => {
      get_select_funcs.get_semesters().then((semesters: string[]) => {
         resolve(make_container_list(semesters, sem_id))
      })
   })
   return promise
}

export const get_containers = (sem_id: string): Promise<Container[]> => {
   //make container given sem_id
   const promise = new Promise<Container[]>((resolve) => {
      if (!sem_id) {
         resolve([])
      }
      else {
         resolve(get_select_funcs.get_containers(sem_id))
      }
   })
   return promise
}



export const make_container_list = async (semesters: string[], sem_id: string) => {
   //populates container_list for sem_id

   const find_sem_id = (semester: string): boolean => {
      return semester === sem_id
   }

   let container_list: string[] = ['all']
   let cl: string[] = []
   var sc: [string, string][];
   if (sem_id === 'all') {
      sc = await create_sc_table(semesters);
   }
   else { //todo: replace with appropriate api call for semester
      const semester = semesters.find(find_sem_id)
      if (semester) {
         sc = await create_sc_table([semester as string]);
      }
      else {
         sc = []
      }
   }

   sc.forEach((semid_cid: [string, string]) => {
      cl.push(semid_cid[1])
   })

   container_list = container_list.concat(Array.from(new Set(cl))) // remove duplicate containers across all sem_ids
   return container_list
}

export const get_ob_list = (sem_id: string, container_id: string): Promise<string[]> => {
   //make container list from containers and sem_id
   const promise = new Promise<string[]>((resolve) => {
      get_containers(sem_id).then((containers: Container[]) => {
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