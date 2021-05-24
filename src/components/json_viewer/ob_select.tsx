import { get_ob_list, get_container_list, get_sem_id_list } from './../../api/utils'
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
      get_container_list(sid, props.observer_id).then( (lst: string[]) => {
          setContainerIdList(lst) // get new list of containers
          get_ob_list(sid, 'all', props.observer_id) //get new list of ob_blocks for all containers under new sem_id
      })
    }

    // get ob blocks from selected container id
    const handle_container_id_submit = (cid: string) => {
      setContainerId(cid)        
      get_ob_list(sem_id, cid, props.observer_id).then( (lst: string[]) => {
        console.log(`getting all ob ids for container: ${cid}`)
        setOBList(lst)
      })
    }

    useEffect(() => { //run when props.observer_id changes
      console.log('use effect triggered')
        get_sem_id_list(props.observer_id).then( (lst: string[]) => {
            console.log(`setting semid list for observer ${props.observer_id}`)
            setSemIdList(lst)
        }).then( () => {
        get_container_list(sem_id, props.observer_id).then( (lst: string[]) => {
          console.log(`setting sem_id ${sem_id} containers for user ${props.observer_id}`)
          setContainerIdList(lst)
          if (lst.length>=1) {
            console.log(`setting container to first item of list: ${lst[0]}`)
            setContainerId(lst[0])
          }
        })
        }).then( () => {
            get_ob_list(sem_id, container_id, props.observer_id).then( (lst: string[]) => {
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
