import * as React from 'react'
import { Simulation, SimulationNodeDatum } from 'd3-force'
import { useEffect, useState } from 'react'
import { D3Types, DispatchIdx } from '../../typings/d3_force'
import { Scoby } from '../../typings/papahana'
import { ForceGraph2D } from 'react-force-graph'
import { useTheme } from '@material-ui/core'
import { lightBlue, deepOrange} from '@material-ui/core/colors';
import { Theme } from '@rjsf/material-ui'

// const useStyles = makeStyles( (theme: Theme ) => {
//     forceGraph: {
//         linkColor: theme.palette.primary}
// })


interface Props {
    width: number
    height: number
    data: Scoby[]
    onNodeSelected: DispatchIdx
    linkDistance: number
    linkStrength: number
    chargeStrength: number
    centerWidth: number
    centerHeight: number
}

interface OBSet {
    sem: string[]
    container: string[]
    ob: string[]
}

type NodeType = 'ob' | 'container' | 'sem'

const GREEN = '#8dd3c7'
const YELLOW = '#ffffb3'
const PURPLE = '#bebada'
const GREY = '#d9d9d9'

const create_node = (x_id: keyof Scoby, nodeType: NodeType, row: Scoby): D3Types.Node => {
    // let name = nodeType === 'ob' ? row.name : row[x_id]
    let name = row[x_id]
    let radiusSize: number
    let fillColor: string
    switch (nodeType) {
        case 'ob': {
            radiusSize = 20;
            fillColor = GREEN
            break;
        }
        case 'container': {
            radiusSize = 30;
            fillColor = PURPLE
            break;
        }
        case 'sem': {
            radiusSize = 40;
            fillColor = YELLOW
            break;
        }
        default: {
            radiusSize = 10;
            fillColor = GREY
            break;
        }
    }
    const node: D3Types.Node = { name: name as string, group: nodeType, radiusSize: radiusSize, fillColor: fillColor }
    return node
}

const add_to_nodes = (row: Scoby, nodes: D3Types.Node[], sets: OBSet): [ D3Types.Node[], OBSet ] => {
    const set_keys = Object.keys(sets)
    set_keys.forEach((nodeType: string) => {
        const set_id = nodeType + '_id' as keyof Scoby
        const rowIncludesKey: boolean = Object.keys(row).includes(set_id)
        const idNotInSet: boolean = !sets[nodeType as keyof OBSet].includes(set_id)
        if (rowIncludesKey && idNotInSet) {
            sets[nodeType as keyof OBSet].push(row[set_id] as string)
            const node = create_node(set_id, nodeType as NodeType, row)
            nodes.push(node)
        }
    })
    return [nodes, sets]
}

const add_to_links = (row: Scoby, links: D3Types.Link[], color?: string): D3Types.Link[] => {
    // each row adds two links sem_id -> container_id and container_id -> ob_id
    if (row.sem_id && row.container_id) {
        let link: D3Types.Link = {
            source: row.sem_id,
            target: row.container_id,
            value: 'sem_id to container_id'
        }
        if (color) link['color'] = color;
        links.push(link)
    }
    if (row.container_id && row.ob_id) {
        let link: D3Types.Link = {
            source: row.container_id,
            target: row.ob_id,
            value: 'container_id to ob_id'
        }
        if (color) link['color'] = color;
        links.push(link)
    }
    return links
}

const scoby_arr_to_data_object = (rows: Scoby[], linkColor: string = GREEN): D3Types.DataObject => {
    let nodes: D3Types.Node[] = []
    let links: D3Types.Link[] = []
    // book keeping for three arrays of unique sem_ids, ob_ids, and container_ids.
    let sets: OBSet = { sem: [], ob: [], container: [] }
    rows.forEach((row: Scoby) => {
        // add to node
        [nodes, sets] = add_to_nodes(row, nodes, sets)
        links = add_to_links(row, links, linkColor)
    })
    const dataObject: D3Types.DataObject = { nodes: nodes, links: links }
    return dataObject
}

export default function GraphForceLayout(props: Props) {
    const [clonedData, setClonedData] = useState({nodes: [], links: []} as D3Types.DataObject )

    const theme = useTheme()
    let linkColor: string = deepOrange[900] 
    if (theme.palette.type === 'dark') {
        linkColor = lightBlue[200] 
    }
    useEffect(() => {
        const dataObj = scoby_arr_to_data_object(props.data, linkColor)
        console.log('dataObj')
        console.log(dataObj)
        setClonedData(dataObj)
    }, [props])

    const fillColor = (node: D3Types.Node): string => {
        return node.fillColor
    }

    console.log(theme)
    return (
        <ForceGraph2D
        graphData={clonedData}
        width={800}
        height={350}
        nodeId='name'
        nodeAutoColorBy="group"
        linkWidth={1}
        />
    )
}