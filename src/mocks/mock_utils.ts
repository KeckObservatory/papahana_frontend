import { Instrument, ObservationBlock, Recipe, SemesterIds, Target, Template, TemplateMetadata } from './../typings/papahana.d';
// import { mock_kcwi_instrument_package } from './mock_template';

// import { mock_observation_blocks } from './mock_obs'
// import { mock_ob } from './mock_ob'
import { mock_semesters } from './mock_semesters'
import { Container, InstrumentPackage } from "../typings/papahana";
import { default as mock_obs } from './ob.json'
import { default as mock_templates } from './templates.json'
import { default as mock_containers } from './containers-demo.json'
import { default as mock_instrument_packages } from './instrument_packages.json'
import { default as mock_instrument_recipes} from './recipes.json'
import { mock_targets, mock_metadata } from './mock_ob_metadata_targets'
import { default as mock_ob_table_rows } from './ob_table_rows.json'
import { OBTableRow } from '../typings/ddoi_api';
import { resolve } from 'dns';

export const mock_get_container_ob_metadata = (semid: string, container_id?: string) => {
   const mockPromise = new Promise<Partial<ObservationBlock[]>>((resolve) => {
      resolve( mock_metadata as any )
   })
   return mockPromise 
}

export const mock_get_ob_table = () => {
   const mockPromise = new Promise<OBTableRow[]>( (resolve) => {
      resolve(mock_ob_table_rows as OBTableRow[])
   })
   return mockPromise
}

export const mock_get_targets = (semid: string) => {
   const mockPromise = new Promise<Target[]>( (resolve) => {
      let targets = [] as Target[]
      (mock_obs as unknown as ObservationBlock[]).forEach( (ob: ObservationBlock) => {
         if (ob.metadata.sem_id.includes(semid)) {
            ob.target && targets.push(ob.target)
         }
      })
      resolve(targets)
   })
   return mockPromise
}

export const mock_get_container_ob_target= (semid: string, container_id?: string) => {
   const mockPromise = new Promise<Partial<ObservationBlock[]>>((resolve) => {
      resolve( mock_targets as any )
   })
   return mockPromise 
}

export const mock_get_instrument_package = (instrument: Instrument): Promise<InstrumentPackage> => {
   const mockPromise = new Promise<InstrumentPackage>((resolve) => {
      const ips = mock_instrument_packages
      const ip = ips.find((ip) => ip.metadata.instrument === instrument)
      resolve(ip as any as InstrumentPackage)
   })
   return mockPromise
}


export const mock_get_template_metadata = (instrument: Instrument): Promise<{[key: string]: Template}> => {
   const mockPromise = new Promise<{[key: string]: Template}>((resolve) => {
      let tm = {} as any
      mock_templates.forEach( (t: any) => {
         if (t.metadata.instrument === instrument) {
            tm[t.metadata.name] = t
         }
         if (t.metadata.name.includes('target')){
            tm[t.metadata.name] = t //include targets
         }
      })
      resolve(tm)
   })
   return mockPromise
}

export const mock_get_instrument_recipes = (instrument: Instrument): Promise<Recipe[]> => {
   const mockPromise = new Promise<Recipe[]>((resolve) => {
      //@ts-ignore
      const mir = mock_instrument_recipes[instrument] as Recipe[]
      resolve(mir)
   })
   return mockPromise
}

export const mock_get_template = (name: string): Promise<{ [key: string]: Template }> => {
   const mockPromise = new Promise<{ [key: string]: Template }>((resolve) => {
      const altName= name.replace('kcwi', 'KCWI')
      const template = mock_templates.find(t => t.metadata.name === altName) as unknown | Template 
      let template_obj = {} 
      //@ts-ignore
      template_obj[name] = template
      resolve(template_obj)
   })
   return mockPromise
}

export const mock_get_semester_obs = (sem_id: string) => {
   const mockPromise = new Promise<ObservationBlock[]>((resolve) => {
      resolve(mock_obs as unknown as ObservationBlock[])
   })
   return mockPromise
}

export const mock_ob_get = (ob_id: string): Promise<ObservationBlock> => {
   const mockPromise = new Promise<ObservationBlock>((resolve) => {
      const idx = Math.floor(Math.random() * mock_obs.length)
      resolve(mock_obs[idx] as unknown as ObservationBlock)
   })
   return mockPromise
}

export const mock_get_semesters = (): Promise<SemesterIds> => {
   const mockPromise = new Promise<SemesterIds>((resolve) => {
      const semids = {
         associations: mock_semesters.map(sem => sem.sem_id),
         keck_id: 2003
      }
      resolve(semids)
   })
   return mockPromise
}

export const mock_get_containers = (sem_id: string): Promise<Container[]> => {
   const mockPromise = new Promise<Container[]>((resolve) => {
      const sem_id_containers = mock_containers.filter((container: Container) => {
         return container.sem_id === sem_id
      }) as Container[]
      resolve(sem_id_containers)
   })
   return mockPromise
}

const sliceIntoChunks = (arr: Array<unknown>, chunkSize: number) => {
   const res = [];
   for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
   }
   return res;
}

export const mock_get_observation_block_from_container = (container_id: string): Promise<ObservationBlock[]> => {
   const mockPromise = new Promise<ObservationBlock[]>((resolve) => {
      const obsChunks = sliceIntoChunks(mock_obs, 5)
      const idx = Math.floor(Math.random() * obsChunks.length)
      const obs = obsChunks[idx] as ObservationBlock[]
      resolve(obs)
   })
   return mockPromise
}

export const mock_ob_post = (ob: ObservationBlock): Promise<string> => {
   const mockPromise = new Promise<string>((resolve) => {
       resolve('12345abcdefg')
   })
   return mockPromise
}