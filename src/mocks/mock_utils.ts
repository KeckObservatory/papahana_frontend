
import { mock_semesters } from './mock_semesters'
import { mock_containers } from './mock_containers'
import { mock_ob } from './mock_ob'
import { make_sem_id_list, make_container_list, make_ob_list } from './../api/utils'
import { ObservationBlock, Semester, Container } from "../typings/papahana";

export const mock_ob_get = (ob_id: string): Promise<ObservationBlock> => {
const mockPromise = new Promise<ObservationBlock>( (resolve) => {
   resolve(mock_ob)
})
return mockPromise
}

export const mock_make_sem_id_list = (observer_id: string): Promise<string[]> => {
   const mockPromise = new Promise<string[]>((resolve) => {
      resolve(make_sem_id_list(mock_semesters))
   })
   return mockPromise
}

export const mock_make_container_list = (sem_id: string): Promise<string[]> => {
   const mockPromise = new Promise<string[]>((resolve) => {
      resolve(make_container_list(mock_semesters, sem_id))
   })
   return mockPromise
}

export const mock_make_ob_list = (container_id: string): Promise<string[]> => {
   const mockPromise = new Promise<string[]>((resolve) => {
      resolve(make_ob_list(mock_containers, container_id))
   })
   return mockPromise
}