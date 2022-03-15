import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';


interface RenderTree {
    id: string;
    name: string;
    children?: readonly RenderTree[];
    type: string;
}

const data: RenderTree = {
    id: 'root',
    name: 'Semid - 1',
    type: 'semid',
    children: [
        {
            id: '1',
            name: 'Container - 1',
            type: 'container',
        },
        {
            id: '2',
            name: 'Container - 2',
            type: 'container',
            children: [
                {
                    id: '4',
                    type: 'ob',
                    name: 'OB - 4',
                },
            ],
        },
        {
            id: '2',
            name: 'Container - 2',
            type: 'container',
            children: [
                {
                    id: '5',
                    type: 'ob',
                    name: 'OB - 5',
                },
                {
                    id: '6',
                    type: 'ob',
                    name: 'OB - 6',
                },
                {
                    id: '7',
                    type: 'ob',
                    name: 'OB - 7',
                },
            ],
        },
    ],
};

interface PopoverProps {
    id: string,
    type: string
}

interface PButtonProps extends PopoverProps {

}

const PopoverButtons = (props: PButtonProps) => {

    const addContainer = () => {

    }

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

    const editOBName = () => {
        console.log(`editing ${props.type} id ${props.id}.`)
    }

    return (
        <div style={{ display: 'grid' }}>
            {props.type === 'semid' &&
                <div style={{ display: 'grid' }}>
                    <Button onClick={addContainer} >add container</Button>
                    <Button onClick={addOB} >add new OB</Button>
                </div>
            }
            {props.type === 'container' &&
                <div style={{ display: 'grid' }}>
                    <Button onClick={addOB}>add new OB</Button>
                    <Button onClick={removeContainer}>delete container</Button>
                    <Button onClick={editContainerName} >edit container name</Button>
                </div>
            }
            {props.type === 'ob' &&
                <div style={{ display: 'grid' }}>
                    <Button onClick={editOBName}>edit ob name</Button>
                    <Button onClick={removeOB}>delete ob</Button>
                </div>
            }
        </div>
    )
}

const BasicPopover = (props: PopoverProps) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

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
                <PopoverButtons type={props.type} id={props.id} />
            </Popover>
        </div>
    );
}

export default function ContainerTree() {

    const renderTree = (nodes: RenderTree) => (
        <div style={{ width: '100%', display: 'flex', alignItems: 'baseline' }}>
            <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
                {Array.isArray(nodes.children)
                    ? nodes.children.map((node) => renderTree(node))
                    : null}
            </TreeItem>
            <BasicPopover id={nodes.id} type={nodes.type} />
        </div >
    );

    return (
        <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={['root']}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
            {renderTree(data)}
        </TreeView>
    )
}