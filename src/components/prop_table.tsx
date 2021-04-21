import React from 'react';
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import {api_call} from "../api/utils";
import TableHead from "@material-ui/core/TableHead";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TableCell from "@material-ui/core/TableCell";

interface MyState {
    error: any;
    isLoaded: any;
    items: any;
    url: any;
}

interface MyProps {
    obsid: string;
}

export class PropTable extends React.Component<MyProps, MyState> {
    constructor(props: any) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            url: "cmd=getAllProposals&json=True&obsid=2003"
        };
    }

    componentDidMount() {
        api_call("cmd=getAllProposals&json=True&obsid=2003", "proposal")
            .then(
                (result: any) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                },
                (error: any) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const { error, isLoaded, items } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading Proposal Information...</div>;
        } else {
            console.log("Results:", items)

            if (!(items.data) || !("AllProposals" in items.data)) {
                return (
                    <Table size="small" aria-label="Schedule">
                        <TableHead> No Proposals Found. </TableHead>
                    </Table>
                )
            }
            var tab_info = items.data['AllProposals'].reverse()

            return (
                <Grid container spacing={3}>
                    <Grid item >
                        <Box width="100%" bgcolor="grey.300" p={1} my={0.5}>
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
}


export function table_rows(table_obj: any) {
    var rows = table_obj.map((item: any) => (
            <TableRow>
                {get_rows(item)}
            </TableRow>

        )
    )

    return (rows)
}

function get_rows(item: any){
    var rows: any = []

    Object.entries(item).map((key) => {
        rows.push(<TableCell align={'left'} style={{width: '8%'}}>{item[key[0]]}</TableCell>)

        }
    )
    return (
        rows
    )
}