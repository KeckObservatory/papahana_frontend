import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { container_api_funcs } from './../../api/ApiRoot'

export default function AddContainterDialog() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const nameChange = (evt: any) => {
    setName(evt.target.value)
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    if (name.length > 0) {
      setOpen(false);
      const container = { name: name, sem_id: '', observation_blocks: [] }
      container_api_funcs.post(container).then((response: string) => {
        console.log(`container ${response} created`)
      })
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add new container
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Container</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a new container name
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
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}