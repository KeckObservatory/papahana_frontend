
import * as React from 'react';
// import TreeView from '@mui/lab/TreeView';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Tree, NodeModel, useDragOver } from "@minoru/react-dnd-treeview";

interface RenderTree {
    id: number;
    parent: number;
    droppable: boolean;
    text: string;
    data: any;
}

const data: RenderTree[] = [
    {
        "id": 1,
        "parent": 0,
        "droppable": true,
        "text": "Container 1",
        "data": {
            "type": "container"
        }
    },
    {
        "id": 2,
        "parent": 1,
        "droppable": false,
        "text": "OB 1",
        "data": {
            "type": "ob"
        }
    },
    {
        "id": 3,
        "parent": 1,
        "droppable": false,
        "text": "OB 2",
        "data": {
            "type": "ob"
        }
    },
    {
        "id": 4,
        "parent": 0,
        "droppable": true,
        "text": "Container 2",
        "data": {
            "type": "container"
        }
    },
    {
        "id": 7,
        "parent": 0,
        "droppable": false,
        "text": "OB 3",
        "data": {
            "type": "ob"
        }
    }
]

interface PopoverProps {
    node: RenderTree
}

interface PButtonProps extends PopoverProps {

}

const PopoverButtons = (props: PButtonProps) => {

    const addContainer = () => {

    }

    const addOB = () => {
        console.log(`creating new ob in ${props.node.text} id ${props.node.id}.`)
    }

    const removeContainer = () => {
        console.log(`removing ${props.node.text} id ${props.node.id}.`)
    }

    const editContainerName = () => {
        console.log(`editing ${props.node.text} id ${props.node.id}.`)
    }

    const removeOB = () => {
        console.log(`removing ${props.node.text} id ${props.node.id}.`)
    }

    const editOBName = () => {
        console.log(`editing ${props.node.text} id ${props.node.id}.`)
    }

    return (
        <div style={{ display: 'grid' }}>
            {props.node.data.type === 'semid' &&
                <div style={{ display: 'grid' }}>
                    <Button onClick={addContainer} >add container</Button>
                    <Button onClick={addOB} >add new OB</Button>
                </div>
            }
            {props.node.data.type === 'container' &&
                <div style={{ display: 'grid' }}>
                    <Button onClick={addOB}>add new OB</Button>
                    <Button onClick={removeContainer}>delete container</Button>
                    <Button onClick={editContainerName} >edit container name</Button>
                </div>
            }
            {props.node.data.type === 'ob' &&
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
                <Typography sx={{ p: 2 }}>The content of the {props.node.text} id {props.node.id}.</Typography>
                <PopoverButtons node={props.node} />
            </Popover>
        </div>
    );
}

interface NodeProps {
    node: any;
    depth: any;
    isOpen: boolean;
    onToggle: Function;
}

// const MyNode = (props: NodeProps) => {
//     return (
//         <div>
//             <Typography>{props.node.text}</Typography>
//             <BasicPopover node={props.node}/>
//         </div>
//     )
// }

export const MyNode: React.FC<NodeProps> = (props) => {
    const { id, droppable, data } = props.node;
    const indent = props.depth * 24;
  
    const handleToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      props.onToggle(props.node.id);
    };
  
    const dragOverProps = useDragOver(id, props.isOpen, props.onToggle as any);
  
    return (
      <div
        style={{ paddingInlineStart: indent }}
        {...dragOverProps}
      >
        <div>
          {props.node.droppable && (
            <div onClick={handleToggle}>
                <Typography>RA</Typography>
            </div>
          )}
        </div>
        <div>
          <Typography>Hello there</Typography>
        </div>
        <BasicPopover node={props.node} />
      </div>
    );
  };

export default function ContainerDnDTree() {

    const renderTree = (node: NodeModel<any>, { depth, isOpen, onToggle }: any) => {
        return (
            <MyNode
                node={node}
                depth={depth}
                isOpen={isOpen}
                onToggle={onToggle}
            />
        )
    }

    const handleDrop = () => {

    }

    return (
        // <Tree
        //     tree={data}
        //     rootId={0}
        //     onDrop={handleDrop}
        //     render={(node, { depth, isOpen, onToggle }) => (
        //         <div style={{ marginLeft: depth * 10 }}>
        //           {node.droppable && (
        //             <span onClick={onToggle}>{isOpen ? "[-]" : "[+]"}</span>
        //           )}
        //           {node.text}
        //         </div>
        //     )}
        // />
        <Tree
        tree={data}
        rootId={0}
        render={(node, { depth, isOpen, onToggle }) => (
          <div style={{ marginInlineStart: depth * 10 }}>
            {node.droppable && (
              <span onClick={onToggle}>{isOpen ? "[-]" : "[+]"}</span>
            )}
            {node.text}
          </div>
        )}
        dragPreviewRender={(monitorProps) => (
          <div>{monitorProps.item.text}</div>
        )}
        onDrop={handleDrop}
      />
    )
}