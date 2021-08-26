import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete'
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { IconButton, Tooltip } from '@material-ui/core';

interface Props {
handleDelete: Function
}

export const DeleteSequenceButton = (props: Props) => {


    const [open, setOpen] = React.useState(false);

    const handleClickOpen = (event: any) => {
        event.stopPropagation()
        setOpen(true);
    };

    const handleClose = (event: any, confirmDelete: boolean ) => {
        console.log('confirmDelete')
        console.log(confirmDelete)
        event.stopPropagation();
        setOpen(false);
        if (confirmDelete) {
            props.handleDelete()
        }
    };

    return (
        <div>
            <Tooltip title="Delete sequence">
                <IconButton
                    className="deleteme"
                    aria-label='delete'
                    onClick={handleClickOpen}
                    onFocus={(event) => event.stopPropagation()}
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={(event) => { handleClose(event, false) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete Sequence"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this sequence?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(event) => { handleClose(event, false) }} color="primary">
                        No
                    </Button>
                    <Button onClick={(event) => { handleClose(event, true) }} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};