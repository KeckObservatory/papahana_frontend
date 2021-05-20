import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles'
import { mock_container_call, mock_sem_id_call } from '../../api/utils'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import { useState } from 'react';
import DropDown from '../drop_down'

const useStyles = makeStyles( (theme: Theme) => ({
    formControl: {
        minWidth: 120,
        margin: theme.spacing(1),
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
        margin: theme.spacing(1),
        width: theme.spacing(50),
        }
      },
    }
))
export interface Props {
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
    const classes = useStyles();
    const [obList, setOBList] = useState(defaultState.obList)
    const [semIdList, setSemIdList] = useState(defaultState.semIdList)
    const [containerIdList, setContainerIdList] = useState(defaultState.containerIdList)

    const [container_id, setContainerId] = useQueryParam('container_id', withDefault(StringParam, 'all'))
    const [sem_id, setSemId] = useQueryParam('sem_id', withDefault(StringParam, 'all'))

    let obsList: string[] = []

    //get sem ids of observer_id
    // mock_sem_id_call().then( (lst: string[]) => {
    //   console.log('setting semid list')
    // //   setSemIdList(lst)
    // })

    // get container ids from selected sem id 
    const handle_sem_id_submit = (sid: string) => {
      setSemId(sid)        
      
      mock_sem_id_call().then( (lst: string[]) => {
        setContainerIdList(lst)
      })
    }

    // get ob blocks from selected container id
    const handle_container_id_submit = (cid: string) => {
      setContainerId(cid)        
      mock_container_call().then( (lst: string[]) => {
        setOBList(lst)
      })
    }

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