import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import { IconButton, Tooltip } from '@mui/material';
import TargetTable from './TargetTable';

interface Props {
  addSeq: Function 
}

export default function TargetDialog(props: Props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = async () => {
    setOpen(true);
  };

  const handleClose = (confirmDelete: boolean) => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Add Existing Target to OB">
        <IconButton color='primary' area-label='remove' onClick={handleClickOpen} >
          <ModeStandbyIcon/>
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={'md'}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Add exisitng Target"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Select Target that will be added to current OB
          </DialogContentText>
        </DialogContent>
        <TargetTable addSeq={props.addSeq} />
        <DialogActions>
          <Button onClick={() => { handleClose(false) }} color="primary">
            Close Dialog 
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

