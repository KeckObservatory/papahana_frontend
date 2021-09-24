import { get_ob_list, get_container_list, get_sem_id_list } from '../../api/utils'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import { useState, useEffect } from 'react';
import DropDown from '../drop_down'
import { Paper } from '@mui/material'
import SemidTree from './semid_tree'

export interface Props {
  observer_id: string
  handleOBSelect: Function
  ob_id: string | undefined | null
}

interface State {
  obList: string[]
  semIdList: string[]
  containerIdList: string[]
  container_id: string
  sem_id: string
}


const defaultState: State = {
  obList: [],
  semIdList: [],
  containerIdList: [],
  sem_id: '2017A_U033',
  container_id: 'all',
}

export default function ObservationBlockSelecter(props: Props) {
  const [obList, setOBList] = useState(defaultState.obList)
  const [semIdList, setSemIdList] = useState(defaultState.semIdList)
  const [containerIdList, setContainerIdList] = useState(defaultState.containerIdList)

  const [container_id, setContainerId] =
    useQueryParam('container_id', withDefault(StringParam, defaultState.container_id))
  const [sem_id, setSemId] =
    useQueryParam('sem_id', withDefault(StringParam, defaultState.sem_id))

  const handle_sem_id_submit = (sid: string) => {
    setSemId(sid)
    reset_container_and_ob_select()
  }

  // get ob blocks from selected container id
  const handle_container_id_submit = (cid: string) => {
    setContainerId(cid)
    get_ob_list(sem_id, cid, props.observer_id).then((lst: string[]) => {
      setOBList(lst)
    })
  }

  useEffect(() => { //run when props.observer_id changes
    get_sem_id_list(props.observer_id)
      .then((lst: string[]) => {
        setSemIdList(lst)
      })
      .then(() => { reset_container_and_ob_select() })
  }, [props.observer_id])

  const reset_container_and_ob_select = () => {
    get_container_list(sem_id, props.observer_id).then((lst: string[]) => {
      setContainerIdList(lst)
      if (lst.length >= 1) {
        setContainerId(lst[0])
      }
    })
      .then(() => {
        get_ob_list(sem_id, container_id, props.observer_id).then((lst: string[]) => {
          setOBList(lst)
          return lst
        })
          .then((lst: string[]) => {
            if (lst.length >= 1) {
              props.handleOBSelect(lst[0])
            }
          })
      })
  }

  const handle_ob_id_select = (id: string) => {
    props.handleOBSelect(id)
  }
  return (
    <div>
      <DropDown
        placeholder={'semester id'}
        arr={semIdList}
        value={sem_id}
        handleChange={handle_sem_id_submit}
        label={'Semester ID'}
      />
      <Paper>
        <SemidTree observer_id={props.observer_id} sem_id={sem_id} ob_selected={handle_ob_id_select} />
      </Paper>
    </div>
  )
}
