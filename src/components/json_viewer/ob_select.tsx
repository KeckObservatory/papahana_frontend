import { mock_make_ob_list, mock_make_container_list, mock_make_sem_id_list } from '../../mocks/mock_utils'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import { useState, useEffect } from 'react';
import DropDown from '../drop_down'

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
   obList: ['a', 'b', 'c'],
   semIdList: ['2021A', '2021B', 'all'],
   containerIdList: ['1', '2', '3', 'all'],
   sem_id: 'all',
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
      //todo replace with proper api call
      mock_make_container_list(sid).then( (lst: string[]) => {
          setContainerIdList(lst)
      })
    }

    // get ob blocks from selected container id
    const handle_container_id_submit = (cid: string) => {
      setContainerId(cid)        
      const allUsers = cid === 'all' && sem_id !== 'all'
      const allSemester = cid === 'all' && sem_id === 'all'
      if (allUsers) {
        //todo replace with proper api call
        mock_make_ob_list(cid).then( (lst: string[]) => {
          console.log(`getting all ob ids for user`)
          setOBList(lst)
        })
      }
      else if (allSemester) {
        mock_make_ob_list(cid).then( (lst: string[]) => {
          console.log(`getting all ob ids for semester`)
          setOBList(lst)
        })
      }
      else {
        mock_make_ob_list(cid).then( (lst: string[]) => {
          console.log('getting all ob ids for container')
          setOBList(lst)
        })
      }
    }

    useEffect(() => { //run when props.observer_id changes
        mock_make_sem_id_list(props.observer_id).then( (lst: string[]) => {
            console.log(`setting semid list for observer ${props.observer_id}`)
            setSemIdList(lst)
        }).then( () => {
        mock_make_container_list(sem_id).then( (lst: string[]) => {
          console.log(`setting sem_id ${sem_id} containers for user ${props.observer_id}`)
          setContainerIdList(lst)
          if (lst.length>=1) {
            console.log(`setting container to first item of list: ${lst[0]}`)
            setContainerId(lst[0])
          }
        })
        }).then( () => {
            mock_make_ob_list(container_id).then( (lst: string[]) => {
              console.log(`getting obs ${lst.length} for container ${container_id} `)
              setOBList(lst)
              return lst
            })
            .then( (lst: string[]) => {
              if (lst.length >= 1) {
                console.log(`setting ob to first item of list: ${lst[0]}`)
                props.handleOBSelect(lst[0])
              }
            })
        })
    }, [props.observer_id])


    const handle_ob_id_select = (id: string) => {
        console.log(`ob id selected: ${id}`)
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
        <DropDown 
        placeholder={'container id'} 
        arr={containerIdList} 
        value={container_id} 
        handleChange={handle_container_id_submit} 
        label={'Container ID'}
        />
        <DropDown 
        placeholder={'observation blocks'} 
        arr={obList} 
        value={props.ob_id} 
        handleChange={handle_ob_id_select} 
        label={'Observation Block ID'}
        />
        </div>
    )
    }
