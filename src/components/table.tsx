import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { make_scoby_table } from '../api/utils';
import { Scoby } from '../typings/papahana';
import MaterialTable, { Icons, Action, MTableFilterRow } from 'material-table'
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import GraphForceLayout from './graph_force_layout/graph_force_layout'
import { DispatchIdx } from './../typings/d3_force'


const tableIcons: Icons = {
  Add: forwardRef((props: unknown, ref: any) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props: any, ref: any) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props: any, ref: any) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props: any, ref: any) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props: any, ref: any) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props: any, ref: any) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props: any, ref: any) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props: any, ref: any) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props: any, ref: any) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props: any, ref: any) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props: any, ref: any) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props: any, ref: any) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props: any, ref: any) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props: any, ref: any) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props: any, ref: any) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props: any, ref: any) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props: any, ref: any) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

interface Props {
  observer_id: string
}

interface State {
  rows: Scoby[]
  rowsPerPage: number
  checked: boolean
  selectedIdx: number[] | number
  filteredRows: Scoby[]
}

const defaultState: State = {
  rows: [],
  rowsPerPage: 9,
  checked: false,
  selectedIdx: [0],
  filteredRows: []
}

interface GCProps {
  setSelectedIdx: DispatchIdx
  rows: Scoby[]
}

const GraphLayoutConditional = (props: GCProps) => {
  if (props.rows.length === 0) {
    return null
  }
  return (
    <GraphForceLayout
      width={1000}
      height={350}
      data={props.rows} //todo: undo this when Graph is working!!!
      onNodeSelected={props.setSelectedIdx}
      linkDistance={80}
      linkStrength={1}
      chargeStrength={-1}
      centerWidth={500}
      centerHeight={170}
    />
  )
}

export default function BasicTable(props: Props) {
  const classes = useStyles();
  const [rows, setRows] = useState(defaultState.rows)
  const [selectedIdx, setSelectedIdx] = useState(defaultState.selectedIdx)
  // const [filteredRows, setFilteredRows] = useState({ FilterRow: (props: any) => <MTableFilterRow {...props} />, });
  const [filteredRows, setFilteredRows] = useState(defaultState.filteredRows);

  useEffect(() => { //run when props.observer_id changes
    console.log('table use effect triggered')
    make_scoby_table(props.observer_id)
      .then((scoby_table: Scoby[]) => {
        let newRows: Scoby[] = []
        let idx = 0
        scoby_table.forEach((scoby: Scoby) => {
          scoby.row_id = idx.toString()
          newRows.push(scoby)
          idx++
        })
        setRows(newRows)
      })
  }, [props.observer_id])

  const handleSelected = (event: any, rows: Scoby[] | Scoby) => {
    if (!Array.isArray(rows)) {
      rows = [rows]
    }
    setFilteredRows(rows)
  }

  const actions: Action<Scoby>[] = [
    {
      icon: tableIcons.Add as any,
      tooltip: 'Send rows to Force Diagram',
      onClick: handleSelected,
      hidden: false
    }
  ]

  const columns = [
    { title: "Name", field: "name", filtering: false },
    { title: "Semester ID", field: "sem_id", filtering: false },
    { title: "Container ID", field: "container_id", filtering: false },
    { title: "Observation Block ID", field: "ob_id", filtering: false },
    { title: "Row ID", field: "row_id", filtering: false, hidden: true },
  ]

  return (
    <div className={classes.table}>
      <MaterialTable
        icons={tableIcons}
        title={"SCOBY Table"}
        columns={columns}
        data={rows}
        options={{ filtering: true, exportButton: true, selection: true }}
        actions={actions}
      />
      <GraphLayoutConditional rows={rows} setSelectedIdx={setSelectedIdx} />
    </div>)
}