import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete'
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, Tooltip } from '@mui/material';

interface Props {
handleDelete: Function
id: string
name: string 
}

export const DeleteComponentButton = (props: Props) => {


    const [open, setOpen] = React.useState(false);
    const title = "Delete Component"
    const msg = "Are you sure you want to delete this component from the Observing Block?" 

    const handleClickOpen = (event: any) => {
        event.stopPropagation()
        setOpen(true);
    };

    const handleClose = (event: any, confirmDelete: boolean ) => {
        console.log('confirmDelete for', props.id, props.name, confirmDelete)
        event.stopPropagation();
        setOpen(false);
        if (confirmDelete) {
            props.handleDelete(props.id)
        }
    };

    return (
        <div>
            <Tooltip title={title}>
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
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {msg}
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