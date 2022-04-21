import React, { useEffect } from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { DetailedContainer, ObservationBlock } from '../../typings/papahana';
import { useObserverContext } from '../App'
import { get_containers } from '../../api/utils'
import NodePopover from './node_popover'
import { useOBSelectContext } from './ob_select'
import { get_select_funcs } from '../../api/ApiRoot'

interface Props {
    handleOBSelect: Function
    containers: DetailedContainer[]
    setOB: Function
}

interface RenderTree {
    id: string;
    name: string;
    children?: readonly RenderTree[];
    ob_details?: Partial<ObservationBlock> ;
    type: string;
}

export interface TreeNode {
    name: string
    id: string;
    type: string;
    children: RenderTree[];
}

const containers_to_nodes = (containers: DetailedContainer[]): RenderTree[] => {
    let nodes: TreeNode[] = []
    containers.forEach((container: DetailedContainer) => {

        const children = container.ob_details.map((obd: Partial<ObservationBlock>) => {
            let leaf: RenderTree = {
                name: obd.metadata?.name as string,
                id: obd._id as string,
                type: 'ob',
                ob_details: obd
            }
            return leaf
        })

        let node: Partial<TreeNode> = {};
        node['name'] = container.name;
        node['id'] = container._id;
        node['type'] = 'container'
        node['children'] = children
        nodes.push(node as TreeNode)
    })
    return nodes
}

export default function ContainerTree(props: Props) {

    const ob_select_object = useOBSelectContext()
    const rootTree: RenderTree = {
        id: 'root',
        name: ob_select_object.sem_id,
        type: 'semid',
        children: undefined
    }
    const [tree, setTree] = React.useState(rootTree as RenderTree)
    let names = new Set(props.containers.map((c: DetailedContainer) => {
        return c.name
    }))

    useEffect(() => {
        console.log('container tree triggered')
        names = new Set(props.containers.map((c: DetailedContainer) => {
            return c.name
        }))
        let newTree = { ...rootTree }
        newTree['children'] = containers_to_nodes(props.containers)
        setTree(newTree)
    }, [props.containers])

    const renderTree = (nodes: RenderTree, parentNodeId?: string) => {
        const isLeaf = !Array.isArray(nodes.children)
        return(
        <div style={{ width: '100%', display: 'flex', alignItems: 'baseline' }}>
            <TreeItem key={Date.now()} nodeId={nodes.id} label={nodes.name}>
                {isLeaf ? null : nodes.children?.map((node) => renderTree(node, nodes.id)) }
            </TreeItem>
            <NodePopover handleOBSelect={props.handleOBSelect}
                parentNodeId={parentNodeId}
                id={nodes.id}
                type={nodes.type}
                container_names={names}
                ob_details={nodes.ob_details}
                setOB={props.setOB}
                name={nodes.name} />
        </div >
    );
}

    return (
        <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={['root']}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
            {renderTree(tree)}
        </TreeView>
    )
}