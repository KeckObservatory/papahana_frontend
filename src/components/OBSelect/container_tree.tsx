import React, { useEffect, useContext } from 'react';
import TreeView from '@mui/lab/TreeView';
import { DetailedContainer, ObservationBlock } from '../../typings/papahana';
import { useOBSelectContext } from './../ODT/side_menu'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { RenderTreeElement } from './render_tree_element'
import { useOBContext } from '../ODT/observation_data_tool_view';


interface Props {
    containers: DetailedContainer[]
}

export interface RenderTree {
    id: string;
    name: string;
    children?: readonly RenderTree[];
    ob_details?: Partial<ObservationBlock>;
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



    return (
        <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={['root']}
            defaultExpandIcon={<ChevronRightIcon />}
            multiSelect={false}
            sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
            {/* {RenderTree(tree, tree.id)} */}
            <RenderTreeElement 
            nodes={tree} 
            parentNodeId={tree.id}
            names={names}
            />
        </TreeView>
    )
}