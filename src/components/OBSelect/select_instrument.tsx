import React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DropDown from './../drop_down'
import { Instrument } from '../../typings/papahana';

const Instruments: Instrument[] = ['KCWI', 'KPF', 'SSC'];

export interface SimpleDialogProps {
    open: boolean;
    inst: Instrument;
    onClose: (value?: Instrument) => void;
}

export interface Props {
    addOB: (inst: Instrument) => void;
}

function SelectInstrumentDialog(props: SimpleDialogProps) {
    const { onClose, inst, open } = props;

    const handleClose = () => {
        onClose();
    };

    const set_inst = (newInst: Instrument) => {
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

    const handleClose = (newInst?: Instrument) => {
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