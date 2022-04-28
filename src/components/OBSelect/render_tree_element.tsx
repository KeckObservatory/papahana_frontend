import React from 'react';
import TreeItem, {
    TreeItemProps,
    useTreeItem,
    TreeItemContentProps,
} from '@mui/lab/TreeItem';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import NodePopover from './node_popover'
import { RenderTree } from './container_tree'


interface RenderTreeProps {
    nodes: RenderTree
    parentNodeId: string
    names: Set<string> 
    setOB: Function
    handleOBSelect: Function
}

const CustomContent = React.forwardRef(function CustomContent(
    props: TreeItemContentProps,
    ref,
) {
    const {
        classes,
        className,
        label,
        nodeId,
        icon: iconProp,
        expansionIcon,
        displayIcon,
    } = props;

    const {
        disabled,
        expanded,
        selected,
        focused,
        handleExpansion,
        handleSelection,
        preventSelection,
    } = useTreeItem(nodeId);

    const icon = iconProp || expansionIcon || displayIcon;

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        preventSelection(event);
    };

    const handleExpansionClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        //   console.log('expansion click', event)
        handleExpansion(event);
    };

    const handleSelectionClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        console.log('selection click', event)
        props.onClick?.(event)
        handleSelection(event);
    };

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className={clsx(className, classes.root, {
                [classes.expanded]: expanded,
                [classes.selected]: selected,
                [classes.focused]: focused,
                [classes.disabled]: disabled,
            })}
            onMouseDown={handleMouseDown}
            ref={ref as React.Ref<HTMLDivElement>}
        >
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div onClick={handleExpansionClick} className={classes.iconContainer}>
                {icon}
            </div>
            <Typography
                onClick={handleSelectionClick}
                component="div"
                className={classes.label}
            >
                {label}
            </Typography>
        </div>
    );
});

const CustomTreeItem = (props: TreeItemProps) => (
    <TreeItem ContentComponent={CustomContent} {...props} />
);

export const RenderTreeElement = (props: RenderTreeProps) => {

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [anchorPos, setAnchorPos] = React.useState({ top: 200, left: 400 });

    const isLeaf = !Array.isArray(props.nodes.children)
    const divRef = React.useRef();

    const onClick = (event: any) => {
        console.log('onClick triggered!', event.target)
        const pos = {top: event.clientY, left: event.clientX}
        setAnchorPos(pos)
        setAnchorEl(event.target);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const pid = open ? 'simple-popover' : undefined;

    return (
        <div style={{ width: '100%', display: 'flex', alignItems: 'baseline' }}>
            <CustomTreeItem
                ref={divRef}
                onClick={onClick}
                key={Date.now()}
                nodeId={props.nodes.id}
                label={props.nodes.name}>
                {isLeaf ? null :
                    props.nodes.children?.map((node) => (
                        <RenderTreeElement 
                        names={props.names}
                        nodes={node} 
                        parentNodeId={props.nodes.id} 
                        setOB={props.setOB}
                        handleOBSelect={props.handleOBSelect}
                        />
                    ))}
            </CustomTreeItem>
            <NodePopover 
                handleOBSelect={props.handleOBSelect}
                anchorPos={anchorPos}
                parentNodeId={props.parentNodeId}
                id={props.nodes.id}
                pid={pid}
                open={open}
                handleClose={handleClose}
                type={props.nodes.type}
                container_names={props.names}
                ob_details={props.nodes.ob_details}
                setOB={props.setOB}
                name={props.nodes.name} />
        </div >
    );
}

