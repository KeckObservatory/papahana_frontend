import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import ApprovalIcon from '@mui/icons-material/Approval';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { IconButton } from '@mui/material';
import { useOBContext } from './ODT/observation_data_tool_view';


export interface SimpleDialogProps {
    open: boolean;
    handleClose: Function;
}


function ValidationDialog(props: SimpleDialogProps) {
    const { open, handleClose } = props;
    const ob_context = useOBContext()
    return (
        <Dialog maxWidth="lg" onClose={() => handleClose()} open={open}>
            <DialogTitle>Target Validation Errors</DialogTitle>
            <DialogContent dividers>
                {ob_context.errors &&
                    ob_context.errors.map((err) => {
                        let msg = err.message
                        if (err.keyword === 'required') {
                            msg = `${err.params.missingProperty}: ${err.message}`
                        }
                        if (err.keyword === 'type') {
                            msg = `${err.instancePath.substring(1)}: ${err.message}`
                        }
                        if (err.keyword === 'minimum' || err.keyword === 'maximum') {
                            msg = `${err.instancePath.substring(1)}: ${err.message}`
                        }
                        return (
                            <Typography gutterBottom>
                                {msg}
                            </Typography>)
                    })
                }
            </DialogContent>
        </Dialog>
    );
}


export default function ValidationDialogButton() {
    const [open, setOpen] = React.useState(false);
    const [icon, setIcon] = React.useState(<ApprovalIcon />)
    const ob_context = useOBContext()

    React.useEffect(() => {
        if (ob_context.errors.length > 0) {
            setIcon(<LocalFireDepartmentIcon color="warning" />)
        }
        else {
            setIcon(<VerifiedIcon color="success" />)
        }
    }, [ob_context.ob, ob_context.errors])

    const handleClickOpen = () => {
        if (ob_context.errors.length > 0) {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Tooltip title="Select to see target validation errors (if any)">
                <IconButton onClick={handleClickOpen}>
                    {icon}
                </IconButton>
            </Tooltip>
            <ValidationDialog
                open={open}
                handleClose={handleClose}
            />
        </>
    );
}