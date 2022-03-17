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
import { Container } from '../../typings/papahana';


interface Props {
    container_id: string
    name: string
}

export default function EditContainerNameDialog(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const ob_select_object = useOBSelectContext()

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
      container_api_funcs.get(props.container_id).then((container: Container) => {
        console.log(`container ${container._id} retrieved, editing name`)
        container.name = name
        return container_api_funcs.put(container._id, container)
      }).finally(() => {
        ob_select_object.reset_container_and_ob_select()
        ob_select_object.setTrigger(ob_select_object.trigger)
      })
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Edit container name
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Container</DialogTitle>
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
          <Button onClick={handleCreate}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}