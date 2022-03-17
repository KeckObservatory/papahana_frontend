import React, { createContext, useContext } from 'react';
import { get_ob_list, get_container_list, get_sem_id_list } from '../../api/utils'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import { useState, useEffect } from 'react';
import DropDown from '../drop_down'
import { Paper } from '@mui/material'
import SemidTree from './semid_tree'
import { useObserverContext } from './../App'
import ContainerTree from './container_tree'
import ContainerTable from './container_table'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

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
  tabNumber: number
}


const defaultState: State = {
  obList: [],
  semIdList: [],
  containerIdList: [],
  sem_id: '',
  container_id: 'all',
  tabNumber: 0
}


const SemIDContext = createContext<[string, Function]>( ['', ()=>{}] )
export const useSemIDContext = () => useContext(SemIDContext)

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ObservationBlockSelecter(props: Props) {
  const [obList, setOBList] = useState(defaultState.obList)
  const [tabNumber, setTabNumber] = useState(defaultState.tabNumber)
  const [semIdList, setSemIdList] = useState(defaultState.semIdList)
  const [containerIdList, setContainerIdList] = useState(defaultState.containerIdList)
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
          // .then((lst: string[]) => {
          //   if (lst.length >= 1) {
          //     props.handleOBSelect(lst[0])
          //   }
          // })
      })
  }

  const handle_sem_id_submit = (sid: string) => {
    setSemId(sid)
    reset_container_and_ob_select()
  }

  useEffect(() => { //run when props.observer_id changes
    get_sem_id_list(observer_id)
      .then((lst: string[]) => {
        setSemIdList(lst)
      })
      .then(() => { reset_container_and_ob_select() })
  }, [observer_id])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
      setTabNumber(newValue)
  }


  return (
    <SemIDContext.Provider value={[sem_id, reset_container_and_ob_select]}>
    <div>
      <DropDown
        placeholder={'semester id'}
        arr={semIdList}
        value={sem_id}
        handleChange={handle_sem_id_submit}
        label={'Semester ID'}
      />
      <Paper>
        {/* <SemidTree sem_id={sem_id} handleOBSelect={props.handleOBSelect} /> */}
        {/* <Tabs value={tabNumber} onChange={handleTabChange}>
          <Tab label="Containers" />
          <Tab label="OBs" />
        </Tabs>
        <TabPanel value={tabNumber} index={0}>
        <ContainerTree handleOBSelect={props.handleOBSelect}/>
        </TabPanel>
        <TabPanel value={tabNumber} index={1}>
        <ContainerTable/>
        </TabPanel> */}
        <ContainerTree handleOBSelect={props.handleOBSelect}/>
        <ContainerTable/>
      </Paper>
    </div>
    </ SemIDContext.Provider>
  )
}
