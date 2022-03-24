import React, { createContext, useContext } from 'react';
import { get_ob_list, get_container_list, get_sem_id_list, make_semid_scoby_table_and_containers } from '../../api/utils'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import { useState, useEffect } from 'react';
import DropDown from '../drop_down'
import { Paper } from '@mui/material'
import { useObserverContext } from './../App'
import ContainerTree from './container_tree'
import ContainerTable from './container_table'
import { Container, Scoby } from '../../typings/papahana';

export interface Props {
  handleOBSelect: Function
  ob_id: string | undefined | null
  setOB: Function
}

interface State {
  obList: string[]
  semIdList: string[]
  containerIdList: string[]
  container_id: string
  sem_id: string
  rows: Scoby[]
  containers: Container[]
  containerIdNames: object[]
  trigger: number
}


const defaultState: State = {
  obList: [],
  semIdList: [],
  containerIdList: [],
  sem_id: '',
  container_id: 'all',
  rows: [],
  containers: [],
  containerIdNames: [],
  trigger: 0
}

export interface OBSelectContextObject {
  sem_id: string,
  reset_container_and_ob_select: Function,
  trigger: number,
  setTrigger: Function
}

const init_object = {
  sem_id: '',
  reset_container_and_ob_select: ()=>{},
  trigger: 0,
  setTrigger: ()=>{}
}


const OBSelectContext = createContext<OBSelectContextObject>(init_object)
export const useOBSelectContext = () => useContext(OBSelectContext)

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function ObservationBlockSelecter(props: Props) {
  const [obList, setOBList] = useState(defaultState.obList)
  const [semIdList, setSemIdList] = useState(defaultState.semIdList)
  const [containerIdList, setContainerIdList] = useState(defaultState.containerIdList)
  const [trigger, setTrigger] = useState(defaultState.trigger)
  const [rows, setRows] = useState(defaultState.rows)
  const [containerIdNames, setContainerIdNames] = useState(defaultState.containerIdNames)
  const [containers, setContainers] = useState(defaultState.containers)

  const observer_id = useObserverContext()

  const [container_id, setContainerId] =
    useQueryParam('container_id', withDefault(StringParam, defaultState.container_id))
  const [sem_id, setSemId] =
    useQueryParam('sem_id', withDefault(StringParam, defaultState.sem_id))

  const reset_container_and_ob_select = () => {
    get_container_list(sem_id, observer_id).then((lst: string[]) => {
      setContainerIdList(lst)
      if (lst.length >= 1) {
        setContainerId(lst[0])
      }
    })
      .then(() => {
        get_ob_list(sem_id, container_id, observer_id).then((lst: string[]) => {
          setOBList(lst)
          return lst
        })
      })
  }

  const handle_sem_id_submit = (sid: string) => {
    setSemId(sid)
    setTrigger(trigger+1)
    reset_container_and_ob_select()
  }

  useEffect(() => { //run when props.observer_id changes
    get_sem_id_list(observer_id)
      .then((lst: string[]) => {
        setSemIdList(lst)
      })
      .then(() => { reset_container_and_ob_select() })
  }, [observer_id])


  useEffect(() => {
    console.log('trigger changed!')
    make_semid_scoby_table_and_containers(ob_select_object.sem_id, observer_id)
    .then((scoby_containers: [Scoby[], Container[]]) => {
        const [scoby, cntners] = scoby_containers
        const contset: object[] = [] 
        cntners.forEach((c: Container) => contset.push({
          _id: c._id,
          name: c.name
        }))
        // scoby.forEach((sc: Scoby) => contset.push({
        //   _id: sc.container_id,
        //   name: sc.container_name
          
        // }))
        setContainers(cntners)
        setRows(scoby)
        setContainerIdNames(contset)
    })
  }, [trigger])


  const ob_select_object = {
    sem_id: sem_id,
    reset_container_and_ob_select: reset_container_and_ob_select,
    trigger: trigger,
    setTrigger: setTrigger 
  }

  return (
    <OBSelectContext.Provider value={ob_select_object}>
      <div>
        <DropDown
          placeholder={'semester id'}
          arr={semIdList}
          value={sem_id}
          handleChange={handle_sem_id_submit}
          label={'Semester ID'}
        />
        <Paper>
          <ContainerTree setOB={props.setOB} containers={containers} handleOBSelect={props.handleOBSelect} />
          <ContainerTable rows={rows} containerIdNames={containerIdNames}/>
        </Paper>
      </div>
    </ OBSelectContext.Provider>
  )
}
