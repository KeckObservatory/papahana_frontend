import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddContainerDialog from './add_container_dialog'
import RemoveContainerDialog from './remove_container_dialog'

interface PButtonProps extends Props {

}

interface Props {
    id: string,
    type: string
    handleOBSelect: Function
}

const PopoverButtons = (props: PButtonProps) => {

    const addOB = () => {
        console.log(`creating new ob in ${props.type} id ${props.id}.`)
    }

    const removeContainer = () => {
        console.log(`removing ${props.type} id ${props.id}.`)
    }

    const editContainerName = () => {
        console.log(`editing ${props.type} id ${props.id}.`)
    }

    const removeOB = () => {
        console.log(`removing ${props.type} id ${props.id}.`)
    }

    const selectOB = () => {
        console.log(`selecting ${props.type} id ${props.id}.`)
        props.handleOBSelect(props.id)
        
    }

    return (
        <div style={{ display: 'grid' }}>
            {props.type === 'semid' &&
                <div style={{ display: 'grid' }}>
                    <AddContainerDialog />
                </div>
            }
            {props.type === 'container' &&
                <div style={{ display: 'grid' }}>
                    <Button onClick={addOB}>add new OB</Button>
                    <RemoveContainerDialog container_id={props.id}/>
                    <Button onClick={editContainerName} >edit container name</Button>
                </div>
            }
            {props.type === 'ob' &&
                <div style={{ display: 'grid' }}>
                    <Button onClick={selectOB}>edit ob</Button>
                    {/* <Button onClick={removeOB}>delete ob</Button> */}
                </div>
            }
        </div>
    )
}

const NodePopover = (props: Props) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div style={{ marginLeft: 'auto' }}>
            <IconButton onClick={handleClick} aria-label="more">
                <MoreVertIcon />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>The content of the {props.type} id {props.id}.</Typography>
                <PopoverButtons handleOBSelect={props.handleOBSelect} type={props.type} id={props.id} />
            </Popover>
        </div>
    );
}

export default NodePopover 