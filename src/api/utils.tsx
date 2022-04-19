import { Method, SourceAPI, Document, Semester, Container, Scoby, Instrument, InstrumentPackage, Template, ContainerObs, OBDetail, DetailedContainer } from "../typings/papahana";
import { ob_api_funcs, semid_api_funcs, get_select_funcs, get_container_ob_metadata, get_container_ob_target } from './ApiRoot';
import { ObservationBlock, SemesterIds } from '../typings/papahana'
import { resolve } from "path";

export const get_sem_id_list = (): Promise<SemesterIds> => {
   //make sem_id list from semesters
   const promise = new Promise<SemesterIds>((resolve) => {
      get_select_funcs.get_semesters().then((semesterIds: SemesterIds) => {
         resolve(semesterIds)
      })
   })
   return promise
}

export const get_instrument_package = (instrument: Instrument): Promise<InstrumentPackage> => {
   const promise = new Promise<InstrumentPackage>((resolve) => {
      get_select_funcs.get_instrument_package(instrument).then((instrumentPackage: InstrumentPackage) => {
         resolve(instrumentPackage)
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

export const get_container_target_metadata = async (sem_id: string, container_id?: string) => {
   const metadata = await get_container_ob_metadata(sem_id, container_id)
   const targets = await get_container_ob_target(sem_id, container_id)
   let obs: Partial<ObservationBlock>[] = []
   metadata.forEach((md: Partial<ObservationBlock>) => {
      const target = targets.find((t: Partial<ObservationBlock>) => t._id === md._id)
      if (target) {
         md['target'] = target['target']
      }
      else {
      }
      // const ob = target ? md['target'] = target['target'] : md
      obs.push(md)
   })
   return obs
}

export const make_all_ob_container = async (sem_id: string, detailedContainers: DetailedContainer[]) => { //make synthetic container for all obs
   let allContainer: DetailedContainer = {
      name: 'all obs',
      observation_blocks: [],
      ob_details: [],
      _id: 'all obs',
      sem_id: sem_id
   }
   let partialObs: Partial<ObservationBlock>[] = []
   if (sem_id) {
      partialObs = await get_container_target_metadata(sem_id)
   }
   allContainer['ob_details'] = partialObs
   detailedContainers.push(allContainer)
   // console.log('detailedContainer with all obs', detailedContainers)
   return detailedContainers
}

export const make_detailed_containers = async (sem_id: string, containers: Container[]) => { // adds all obs in a special container
   const detailedContainers: DetailedContainer[] = [];
   await containers.forEach(async (container: Container) => {
      // let dContainer: Partial<DetailedContainer> = container
      let partialObs: Partial<ObservationBlock>[] = []
      if (sem_id) {
         partialObs = await get_container_target_metadata(sem_id, container._id)
      }
      // dContainer['ob_details'] = partialObs
      // detailedContainers.push(dContainer as DetailedContainer)
      const dContainer = {...container, 'ob_details': partialObs}
      detailedContainers.push(dContainer)
   })
   console.log('containers', containers, 'detailedContainers', detailedContainers)
   return detailedContainers
}

const scoby_rows_and_det_containers = (sem_id: string, detailedContainers: DetailedContainer[]) => {
   let scoby: Scoby[] = []
   console.log('detailedContainer with all obs', detailedContainers)
   detailedContainers.forEach((container: DetailedContainer) => {
      const cid = container._id
      console.log('on detailed container', container)
      container.ob_details.forEach((ob: Partial<ObservationBlock>) => {
         console.log('making row', ob, container)
         const row = {
            sem_id: sem_id,
            container_id: cid,
            ob_id: ob._id,
            container_name: container.name,
            name: ob.metadata?.name as string,
            ra: ob.target?.parameters.target_coord_ra,
            dec: ob.target?.parameters.target_coord_dec,
            comment: ob.comment as string,
            ob_type: ob.metadata?.ob_type as string,
            version: ob.metadata?.version as string,
         }
         scoby.push(row)
      })
   })
   return scoby 
}

export const make_semid_scoby_table_and_containers = async (sem_id: string): Promise<[Scoby[], DetailedContainer[]]> => {
   return get_containers(sem_id)
      .then(async (containers: Container[]) => {
         return await make_detailed_containers(sem_id, containers)
      })
      .then(async (detailedContainers: DetailedContainer[]) => {
         return await make_all_ob_container(sem_id, detailedContainers)
      })
      .then((detailedContainers: DetailedContainer[]) => {
         console.log('detailedContainer with all obs', detailedContainers)
         const scoby = scoby_rows_and_det_containers(sem_id, detailedContainers)
         return [scoby, detailedContainers]
      })
}

export const make_semid_scoby_table_and_containers_bak = async (sem_id: string): Promise<[Scoby[], Container[]]> => {
   let scoby: Scoby[] = []
   return get_containers(sem_id)
      .then(async (containers: Container[]) => { // adds all obs in a special container
         let obs: ObservationBlock[] = []
         if (sem_id) {
            obs = await semid_api_funcs.get_semester_obs(sem_id)
         }

         let allContainer: DetailedContainer = {
            name: 'all obs',
            observation_blocks: [],
            ob_details: [],
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
      .then((semesters: SemesterIds) => {
         return create_sc_table(semesters.associations)
      })
      .then((sem_cons: [string, string][]) => create_scoby_table(sem_cons))
}



export const get_obs_from_semester = async (sem_id: string): Promise<ContainerObs> => {
   const container_obs = await get_select_funcs.get_semesters()
      .then((semesters: SemesterIds) => {
         const semester = semesters.associations.find((elem: string) => elem === sem_id)
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
      get_select_funcs.get_semesters().then((semesters: SemesterIds) => {
         resolve(make_container_list(semesters.associations, sem_id))
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