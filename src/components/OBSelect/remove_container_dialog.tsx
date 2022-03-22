
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { container_api_funcs } from './../../api/ApiRoot'
import { useOBSelectContext } from './ob_select'

interface Props {
    container_id: string
    name: string
}

export default function RemoveContainerDialog(props: Props) {
    const [open, setOpen] = React.useState(false);
    const ob_select_object = useOBSelectContext()
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
            // ob_select_object.reset_container_and_ob_select()
            ob_select_object.setTrigger(ob_select_object.trigger + 1)
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