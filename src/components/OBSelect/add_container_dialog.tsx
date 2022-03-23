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
  container_names: Set<string>
  handleClose: Function
}

export default function AddContainterDialog(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [nameTaken, setNameTaken] = React.useState(false)
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
    console.log('contaier_names', props.container_names)
    console.log(props.container_names.has(name))
    if (props.container_names.has(name)) {
      setNameTaken(true)
      return
    }
    else { 
      setNameTaken(false)
    }

    if (name.length > 0) {
      const container = { name: name, sem_id: ob_select_object.sem_id, observation_blocks: [] }
      container_api_funcs.post(container).then((response: string) => {
        console.log(`container ${response} created`)
        // ob_select_object.reset_container_and_ob_select()
        ob_select_object.setTrigger(ob_select_object.trigger + 1)
      })

      setOpen(false);
      props.handleClose()
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
          <DialogContentText>
            {nameTaken && "Enter a unique name"}
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