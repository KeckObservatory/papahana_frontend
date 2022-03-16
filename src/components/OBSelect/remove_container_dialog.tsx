
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { container_api_funcs } from './../../api/ApiRoot'
import { useSemIDContext } from './ob_select'

interface Props {
    container_id: string
    name: string
}

export default function RemoveContainerDialog(props: Props) {
    const [open, setOpen] = React.useState(false);
    const [sem_id, reset_container_and_ob_select] = useSemIDContext()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRemove = () => {
        setOpen(false);
        container_api_funcs.remove(props.container_id).then((response: string) => {
            console.log(`container ${response} removed`)
            reset_container_and_ob_select()
        })
    };

    return (
        <div style={{ display: 'grid' }}>
            <Button variant="outlined" onClick={handleClickOpen}>
                Remove container
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Remove Container</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the container named {props.name}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleRemove}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}