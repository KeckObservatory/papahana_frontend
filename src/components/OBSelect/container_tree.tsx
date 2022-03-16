import React, { useEffect } from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { Container } from '../../typings/papahana';
import { useObserverContext } from '../App'
import { get_containers } from '../../api/utils'
import NodePopover from './node_popover'
import { useSemIDContext } from './ob_select'

interface Props {
    handleOBSelect: Function
}

interface RenderTree {
    id: string;
    name: string;
    children?: readonly RenderTree[];
    type: string;
}

const containers_to_nodes = (containers: Container[]): RenderTree[] => {
    let nodes: any = []
    containers.forEach((container: Container) => {
        let node: any = {};
        node['name'] = container.name;
        node['id'] = container._id;
        node['type'] = 'container'
        node['children'] = container.observation_blocks.map((obStr: string) => {
            let leaf: RenderTree = { name: obStr, id: obStr, type: 'ob' }
            return leaf
        })
        nodes.push(node)
    })
    return nodes
}

export default function ContainerTree(props: Props) {

    const observer_id = useObserverContext()
    const [sem_id, _] = useSemIDContext()
    const rootTree: RenderTree = { 'id': 'root', 'name': sem_id, type: 'semid', children: undefined }
    const [containers, setContainers] = React.useState([] as Container[])
    const [tree, setTree] = React.useState(rootTree as RenderTree)

    useEffect(() => { //run when props.observer_id changes
        let newTree = { ...rootTree }
        get_containers(sem_id, observer_id).then((conts: Container[]) => {
            setContainers(conts)
            newTree['children'] = containers_to_nodes(containers)
            setTree(newTree)
        })
    }, [props])

    const renderTree = (nodes: RenderTree) => (
        <div style={{ width: '100%', display: 'flex', alignItems: 'baseline' }}>
            <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
                {Array.isArray(nodes.children)
                    ? nodes.children.map((node) => renderTree(node))
                    : null}
            </TreeItem>
            <NodePopover handleOBSelect={props.handleOBSelect}
                id={nodes.id}
                type={nodes.type}
                name={nodes.name} />
        </div >
    );

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