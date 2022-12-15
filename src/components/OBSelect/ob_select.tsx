import React, { createContext, useContext } from 'react';
import { get_ob_list, get_container_list, get_sem_id_list, make_semid_scoby_table_and_containers } from '../../api/utils'
import { useState, useEffect } from 'react';
import DropDown from '../drop_down'
import { Paper } from '@mui/material'
import { useObserverContext } from './../App'
import ContainerTree from './container_tree'
import ContainerTable from './container_table'
import { DetailedContainer, Scoby, SemesterIds } from '../../typings/papahana';
import { useOBSelectContext } from './../ODT/side_menu'

export interface Props {
  handleOBSelect: Function
  ob_id: string | undefined | null
  setOB: Function
  setInstrument: Function
}

interface State {
  obList: string[]
  semIdList: string[]
  containerIdList: string[]
  containerIdNames: object[]
  rows: Scoby[]
  containers: DetailedContainer[]
}

const defaultState: State = {
  obList: [],
  semIdList: [],
  containerIdList: [],
  containerIdNames: [],
  rows: [],
  containers: [],
}



interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function ObservationBlockSelecter(props: Props) {
  const [semIdList, setSemIdList] = useState(defaultState.semIdList)
  const [rows, setRows] = useState(defaultState.rows)
  const [containers, setContainers] = useState(defaultState.containers)
  const [containerIdNames, setContainerIdNames] = React.useState(defaultState.containerIdNames)

  const ob_sel = useOBSelectContext()



  const observerContext = useObserverContext()


  const handle_sem_id_submit = (sid: string) => {
    ob_sel.setSemId(sid)
    ob_sel.setTrigger(ob_sel.trigger + 1)
    ob_sel.reset_container_and_ob_select()
  }

  useEffect(() => { 
    get_sem_id_list()
      .then((semesters: SemesterIds) => {
        observerContext.setObserverId(semesters.keck_id)
        Array.isArray(semesters.associations)? setSemIdList(semesters.associations) : setSemIdList([])
      })
      .then(() => {
        ob_sel.setTrigger(ob_sel.trigger + 1)
        ob_sel.reset_container_and_ob_select()
      })
  }, [])


  useEffect(() => {
    console.log('trigger changed!')
    make_semid_scoby_table_and_containers(ob_sel.sem_id)
      .then((scoby_containers: [Scoby[], DetailedContainer[]]) => {
        const [scoby, cntners] = scoby_containers
        const contset: object[] = []
        cntners.forEach((c: DetailedContainer) => {
          if (c.name !== 'All OBs') {
            contset.push({
            _id: c._id,
            name: c.name
          })
          }
        })
        setContainers(cntners)
        setRows(scoby)
        setContainerIdNames(contset)
      })
  }, [ob_sel.trigger])



  return (
      <React.Fragment>
        <DropDown
          placeholder={'semester id'}
          arr={semIdList}
          value={ob_sel.sem_id}
          handleChange={handle_sem_id_submit}
          label={'Semester ID'}
          highlightOnEmpty={true}
        />
        <Paper>
          <ContainerTree setInstrument={props.setInstrument} setOB={props.setOB} containers={containers} handleOBSelect={props.handleOBSelect} />
          <ContainerTable rows={rows} containerIdNames={containerIdNames} handleOBSelect={props.handleOBSelect} />
        </Paper>
      </React.Fragment>
  )
}
