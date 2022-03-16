
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
}

export default function RemoveContainerDialog(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [sem_id, reset_container_and_ob_select] = useSemIDContext()

  const handleClickOpen = () => {
    setOpen(true);
  };

  const nameChange = (evt: any) => {
    setName(evt.target.value)
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemove = () => {
    if (name.length > 0) {
      setOpen(false);
      container_api_funcs.remove(props.container_id).then((response: string) => {
        console.log(`container ${response} removed`)
        reset_container_and_ob_select()
      })
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Remove container
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Remove Container</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this container? 
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="container name"
            value={name}
            type="name"
            onChange={nameChange}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleRemove}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}