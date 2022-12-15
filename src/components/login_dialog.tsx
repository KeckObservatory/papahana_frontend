import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';

const LoginDialog = () => {

    const [open, setOpen] = useState(false);
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        console.log('info stored internally')
        setOpen(false);
    }

    const handleUseridChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser(event.target.value)

    }
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    return (
        <div>
            <Tooltip title="Login to begin recieving streams">
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleClickOpen}
                >
                    <LoginIcon />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Authentication and Authorization</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <DialogContentText>
                            Enter your Keck username and password here to be granted access to observation blocks.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            onChange={handleUseridChange}
                            margin="dense"
                            id="name"
                            label="Keck User Name"
                            value={user}
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            required
                            onChange={handlePasswordChange}
                            margin="dense"
                            id="name"
                            label="Password"
                            type="password"
                            value={password}
                            fullWidth
                            variant="standard"
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default LoginDialog