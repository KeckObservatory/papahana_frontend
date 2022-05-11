import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { container_api_funcs } from './../../api/ApiRoot'
import { useOBSelectContext } from './../ODT/side_menu'
import { Container } from '../../typings/papahana';


interface Props {
    container_id: string
    name: string
    container_names: Set<string>
    handleClose: Function
}

export default function EditContainerNameDialog(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [nameTaken, setNameTaken] = React.useState(false);
  const ob_select_object = useOBSelectContext()

  const handleClickOpen = () => {
    setOpen(true);
  };

  const nameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      setName(evt.target.value)
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {

    if (props.container_names.has(name)) {
      setNameTaken(true)
      return
    }
    else {
      setNameTaken(false)
    }

    if (name.length > 0) {
      container_api_funcs.get(props.container_id).then((container: Container) => {
        console.log(`container ${container._id} retrieved, editing name`)
        container.name = name
        return container_api_funcs.put(container._id, container)
      }).finally(() => {
        // ob_select_object.reset_container_and_ob_select()
        ob_select_object.setTrigger(ob_select_object.trigger + 1)
        setOpen(false);
        props.handleClose()
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
          <DialogContentText>
            {nameTaken && "Please enter a unique container name"} 
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