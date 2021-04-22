import React, { useState, useReducer } from 'react';
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import {api_call} from "../api/utils";
import TableHead from "@material-ui/core/TableHead";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from '@material-ui/core/TableContainer';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles'   


const useStyles = makeStyles( (theme: Theme) => ({
  table: {
    minWidth: 650,
    size: "small",
  },
  container: {
    maxHeight: 440
  },
}));

interface State {
    error: any;
    isLoaded: boolean;
    items: any;
    url: string;
}

interface Props {
    obsid: string;
}

const defaultState: State = {
    error: null,
    isLoaded: false,
    items: [],
    url: "cmd=getAllProposals&json=True&obsid=2003"
};

export const table_rows =(table_obj: any) => {
    var rows = table_obj.map((item: any) => (
            <TableRow>
                {get_rows(item)}
            </TableRow>
        )
    )
    return (rows)
}

const get_rows = (item: any) => {
    var rows: any = []
    Object.entries(item).map((key) => {
        rows.push(<TableCell align={'left'} style={{width: '8%'}}>{item[key[0]]}</TableCell>)
        }
    )
    return (rows)
}


export default function PropTable(props: Props) {
    const classes = useStyles();
    const [error, setError] = useState(defaultState.error)
    const [isLoaded, setIsLoaded] = useState(defaultState.isLoaded) 
    const [items, setItems] = useState(defaultState.items) 
    const [url, setUrl] = useState(defaultState.url)
    // const [state, setState ] = useState(defaultState) //use whole state?
    // const [state, setState] = useReducer(
    // (state: State, newState: State) => ({...state, ...newState}),
    // defaultState 
    // ) // use reducer is another option
    
    const componentDidMount = (): void => {
        api_call("cmd=getAllProposals&json=True&obsid=2003", "proposal")
            .then( (result: any) => {
                    setIsLoaded(true);
                    setItems(result);
                },
                (error: any) => {
                    setIsLoaded(true)
                    setError(error)
                }
            )
    }

    componentDidMount()

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading Proposal Information...</div>;
    } else {
        if (!(items.data) || !("AllProposals" in items.data)) {
            return (
            <TableContainer component={Paper}>
                <Table size="small" aria-label="Schedule">
                    <TableHead> No Proposals Found. </TableHead>
                </Table>
            </TableContainer>
            )
        }
        var tab_info = items.data['AllProposals'].reverse()
        return (
            <Grid container spacing={3}>
                <Grid item >
                    <Box width="100%" p={1} my={0.5}>
                            <Table size="small" aria-label="Proposals" >
                                <TableBody>
                                    {table_rows(tab_info)}
                                </TableBody>
                            </Table>
                    </Box>
                </Grid>
            </Grid>


        )
    }
}
