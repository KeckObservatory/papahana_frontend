import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { SortDirection } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { OBCell } from '../../../typings/papahana'
import Tooltip from '@mui/material/Tooltip';
import { descending_comparator, get_comparator, stable_sort } from './utils'

import EnhancedTableHead from './enhanced_table_head'
import EnhancedTableToolbar from './enhanced_table_toolbar';

interface Props {
    rows: OBCell[]
}


interface State {
    rowsPerPage: number
    checked: boolean
    selectedIdx: number[] | number
    filteredRows: OBCell[]
    rows: OBCell[]
}

const defaultState: State = {
    rowsPerPage: 9,
    checked: false,
    selectedIdx: [0],
    filteredRows: [],
    rows: []  
}


const headCells = [
    {
        id: 'id',
        align: 'center',
        disablePadding: false,
        label: 'ID',
    },
    {
        id: 'name',
        align: 'center',
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'type',
        align: 'center',
        disablePadding: false,
        label: 'Type',
    },
    {
        id: 'ra',
        align: 'center',
        disablePadding: false,
        label: 'RA',
    },
    {
        id: 'dec',
        align: 'center',
        disablePadding: false,
        label: 'Dec',
    },
    {
        id: 'cid',
        align: 'center',
        disablePadding: false,
        label: 'Container ID',
    },
];

const handleSelected = (event: any, row: OBCell[] | OBCell) => {

}

export default function EnhancedTable(props: Props) {
    const [order, setOrder] = React.useState<SortDirection>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof OBCell>('name');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof OBCell,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = props.rows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    //@ts-ignore
    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    //@ts-ignore
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    //@ts-ignore
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    //@ts-ignore
    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.rows.length) : 0;

    return (
        <Box sx={{ maxWidth: '80em', minWidth: '50em', margin: 'auto' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            headCells={headCells}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={props.rows.length}
                        />
                        <TableBody>
                            {stable_sort(props.rows, get_comparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row: OBCell, index: number) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    const isItemSelected = isSelected(row.id);
                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.id)}
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.id}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">{row.id}</TableCell>
                                            <TableCell align="center">{row.name}</TableCell>
                                            <TableCell align="center">{row.type}</TableCell>
                                            <TableCell align="center">{row.ra}</TableCell>
                                            <TableCell align="center">{row.dec}</TableCell>
                                            <TableCell align="center">{row.cid}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={props.rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </Box>
    );
}