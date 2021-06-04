import { Instrument } from './../typings/papahana.d';
import { mock_kcwi_instrument_package } from './mock_template';

import { mock_semesters } from './mock_semesters'
import { mock_containers } from './mock_containers'
import { mock_observation_blocks } from './mock_obs'
import { mock_ob } from './mock_ob'
import { ObservationBlock, Semester, Container, InstrumentPackage } from "../typings/papahana";


export const mock_get_instrument_package = (instrument: Instrument): Promise<InstrumentPackage> => {
const mockPromise = new Promise<InstrumentPackage>( (resolve) => {
   resolve(mock_kcwi_instrument_package)
})
return mockPromise
}

export const mock_ob_get = (ob_id: string): Promise<ObservationBlock> => {
const mockPromise = new Promise<ObservationBlock>( (resolve) => {
   resolve(mock_ob)
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
      resolve(mock_containers)
   })
   return mockPromise
}

export const mock_get_observation_block_from_controller = (container_id: string): Promise<ObservationBlock[]> => {
   const mockPromise = new Promise<ObservationBlock[]>((resolve) => {
      resolve(mock_observation_blocks)
   })
   return mockPromise
}