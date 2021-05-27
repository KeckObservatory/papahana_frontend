import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { make_scoby_table } from '../api/utils';
import { Scoby } from '../typings/papahana';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import MaterialTable, { Icons } from 'material-table'
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
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
}

const defaultState: State = {
    rows: [],
    rowsPerPage: 9,
    checked: false
}

export default function BasicTable(props: Props) {
  const classes = useStyles();
  const [rows, setRows] = useState(defaultState.rows)
  const [checked, setChecked] = useState(defaultState.checked)
    useEffect(() => { //run when props.observer_id changes
      console.log('table use effect triggered')
        make_scoby_table(props.observer_id)
        .then( (scoby_table: Scoby[]) => {
          let newRows: Scoby[] = []
          let idx = 0
          scoby_table.forEach( (scoby: Scoby) => {
              scoby.row_id = idx++
              newRows.push(scoby)
          })
          console.log(newRows)
          setRows(newRows)
        })
    }, [props.observer_id])

   const filterValue = (value: boolean) => {
     if (value) {
       const filtered = rows.filter(row => row.ob_id.trim().length > 0);
       setRows(filtered);
     }
     else {
       setRows([...rows])
     }
     setChecked(value)
   }

   const columns = [
     {
       title: "Name", 
       field: "name",
       filterComponent: (props: unknown) => {
         console.log(props)
         return (
           <FormControlLabel
             control={
             <Checkbox
               checked={checked}
               color="primary"
               onChange={ (evt) => {filterValue(evt.target.checked)}}
               />
           }
           label="Custom filter"
           labelPlacement="end"
           />

         )
       }
     },
     { title: "Semester ID", field: "sem_id", filtering: false},
     { title: "Container ID", field: "container_id", filtering: false},
     { title: "Observation Block ID", field: "ob_id", filtering: false},
     { title: "Row ID", field: "row_id", filtering: false, hidden: true},
   ]

  return (
      <div className={classes.table}>
        <MaterialTable
          icons={tableIcons}
          title={"SCOBY Table"}
          columns={columns}
          data={rows}
          options= { { filtering: true } }
        />
      </div>)
}