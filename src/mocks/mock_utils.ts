import { Instrument, ObservationBlock } from './../typings/papahana.d';
// import { mock_kcwi_instrument_package } from './mock_template';

// import { mock_observation_blocks } from './mock_obs'
// import { mock_ob } from './mock_ob'
import { mock_semesters } from './mock_semesters'
import { Semester, Container, InstrumentPackage } from "../typings/papahana";
import {default as mock_obs} from './ob.json'
import {default as mock_templates} from './templates.json'
import {default as mock_containers} from './containers.json'
import {default as mock_instrument_packages} from './instrument_packages.json'


export const mock_get_instrument_package = (instrument: Instrument): Promise<InstrumentPackage> => {
const mockPromise = new Promise<InstrumentPackage>( (resolve) => {
   const ip = mock_instrument_packages[0] as InstrumentPackage
   // const ip = JSON.parse(mock_instrument_packages[0]) as InstrumentPackage
   resolve(ip)
})
return mockPromise
}

export const mock_ob_get = (ob_id: string): Promise<ObservationBlock> => {
const mockPromise = new Promise<ObservationBlock>( (resolve) => {
   resolve(mock_obs[0] as ObservationBlock | any )
})
return mockPromise
}

export const mock_get_semesters = (observer_id: string): Promise<Semester[]> => {
   const mockPromise = new Promise<Semester[]>((resolve) => {
      resolve(mock_semesters)
   })
   return mockPromise
}

export const mock_get_containers = (sem_id: string): Promise<Container[]> => {
   const mockPromise = new Promise<Container[]>((resolve) => {
      resolve(mock_containers as Container | any)
   })
   return mockPromise
}

export const mock_get_observation_block_from_controller = (container_id: string): Promise<ObservationBlock[]> => {
   const mockPromise = new Promise<ObservationBlock[]>((resolve) => {
      resolve(mock_obs as ObservationBlock[] | any)
   })
   return mockPromise
}