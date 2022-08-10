import React from 'react';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import DropDown from './../drop_down'

const Instruments = ['KCWI', 'KPF'];

export interface SimpleDialogProps {
    open: boolean;
    inst: string;
    onClose: (value?: string) => void;
}

export interface Props {
    addOB: (inst: string) => void;
}

function SelectInstrumentDialog(props: SimpleDialogProps) {
    const { onClose, inst, open } = props;

    const handleClose = () => {
        onClose();
    };

    const set_inst = (newInst: string) => {
        console.log('instrument selected', newInst)
        onClose(newInst)

    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Select New OB Instrument</DialogTitle>
            <DropDown
                placeholder={'instrument'}
                arr={Instruments}
                handleChange={set_inst}
                label={'Instrument'}
            />
        </Dialog>
    );
}

export default function SelectInstrument(props: Props) {
    const [open, setOpen] = React.useState(false);
    const [inst, setInst] = React.useState(Instruments[0]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (newInst?: string) => {
        setOpen(false);
        if (newInst) {
            setInst(newInst);
            props.addOB(newInst)
        }
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                New OB
            </Button>
            <SelectInstrumentDialog
                inst={inst}
                open={open}
                onClose={handleClose}
            />
        </div>
    );
}