import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete'

interface Props {
    deleteOB: Function
}

export default function DeleteDialog(props: Props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (confirmDelete: boolean) => {
    setOpen(false);
    if (confirmDelete) {
        props.deleteOB()
    }
  };

  return (
    <div>
       <IconButton color='primary' area-label='remove' onClick={handleClickOpen} >
         <DeleteIcon />
       </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this OB?  
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ () => { handleClose(false)} } color="primary">
            No 
          </Button>
          <Button onClick={ () => { handleClose(true)} } color="primary" autoFocus>
            Yes 
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
