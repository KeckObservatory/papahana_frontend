import React, { useEffect } from 'react';
import { Container } from '../../typings/papahana';
import Tree, { Node, NodeId, Leaf } from '@naisutech/react-tree';
import { get_containers } from '../../api/utils'
import { makeStyles } from '@mui/styles'
import { Button } from '@mui/material';
import { Theme } from '@mui/material/styles'
import { useObserverContext } from './../App'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(1),
        display: 'flex',
        flexWrap: 'nowrap',
        flexGrow: 1
    },
    tree: {
        margin: theme.spacing(1),
        display: 'flex',
        maxHeight: theme.spacing(35),
        width: '100%',
        flexDirection: 'column',
    },
    button: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        height: theme.spacing(4),
        textAlign: 'center',
        backgroundColor: theme.palette.primary.main,
        width: '80%'
    },
}))
interface Props {
    sem_id: string;
    handleOBSelect: Function;
}


const containers_to_nodes = (containers: Container[]): Node[] => {
    let nodes: Node[] = []
    containers.forEach((container: Container) => {
        let node: any = {};
        node['label'] = container.name;
        node['id'] = container._id;
        node['parentId'] = null
        node['items'] = container.observation_blocks.map((obStr: string) => {
            let leaf: Leaf = { label: obStr, parentId: container._id, id: obStr }
            return leaf
        })
        nodes.push(node)
    })
    return nodes
}

const find_item_by_id = (containers: Container[], id: string): string | undefined => {
    for (let idx = 0; idx < containers.length; idx++) {
        const c = containers[idx]
        if (c._id === id) {
            return
        }
        else {
            const obStrings = c.observation_blocks
            for (let jdx = 0; jdx < obStrings.length; jdx++) {
                const obStr = obStrings[jdx]
                if (obStr === id) {
                    return obStr
                }
            }
        }
    }
}

export default function SemidTree(props: Props) {
    const classes = useStyles()

    const [containers, setContainers] = React.useState([] as Container[])
    const [nodes, setNodes] = React.useState([] as Node[])

    useEffect(() => { //run when props change
        get_containers(props.sem_id).then((conts: Container[]) => {
            setContainers(conts)
            setNodes(containers_to_nodes(containers))
        })
    }, [props])


    const handle_selection = (nodeIds: NodeId[]) => {
        const nodeId = nodeIds[nodeIds.length - 1] as string; //select last selected item
        const elem = find_item_by_id(containers, nodeId)
        if (elem) {
            console.log(`${JSON.stringify(elem)} is an ob. selecting.`)
            props.handleOBSelect(elem)
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.tree}>
                <Tree
                    nodes={nodes}
                    grow
                    showEmptyItems={false}
                    size="full"
                    onSelect={handle_selection}
                    containerStyle={{}}
                    theme={'dark'} >
                    {(controls: any) => {
                        return <Button className={classes.button} onClick={() => controls.toggleOpenCloseAllNodes()}>Open/close all nodes</Button>
                    }}
                </Tree>
            </div>
        </div>
    )
}