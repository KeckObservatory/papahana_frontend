import * as React from 'react'
import { useEffect, useState } from 'react'
import { D3Types, DispatchIdx } from '../../typings/d3_force'
import { Scoby } from '../../typings/papahana'
import { ForceGraph2D } from 'react-force-graph'
import { useTheme } from '@mui/material'
import * as d3 from 'd3-scale-chromatic'

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

const size_and_color_node = (nodeType: NodeType, darkTheme: boolean): [number, string] => {
    let radiusSize: number
    let fillColor: string
    switch (nodeType) {
        case 'ob': {
            radiusSize = 20;
            fillColor = darkTheme? d3.schemeAccent[0] : d3.schemeCategory10[0]
            break;
        }
        case 'container': {
            radiusSize = 30;
            fillColor = darkTheme? d3.schemeAccent[3] : d3.schemeCategory10[3]
            break;
        }
        case 'sem': {
            radiusSize = 40;
            fillColor = darkTheme? d3.schemeAccent[2] : d3.schemeCategory10[2]
            break;
        }
        default: {
            radiusSize = 10;
            fillColor = darkTheme? d3.schemeAccent[0] : d3.schemeCategory10[0]
            break;
        }
    }
    return [radiusSize, fillColor]
}

const create_node = (x_id: keyof Scoby, nodeType: NodeType, row: Scoby, darkTheme: boolean): D3Types.Node => {
    // let name = nodeType === 'ob' ? row.name : row[x_id]
    let name = row[x_id]
    let [ radiusSize, fillColor ] = size_and_color_node(nodeType, darkTheme)
    let msg = `${nodeType}: ${name}`
    const node: D3Types.Node = { name: name as string, msg: msg, group: nodeType, radiusSize: radiusSize, fillColor: fillColor }
    return node
}

const add_to_nodes = (row: Scoby, nodes: D3Types.Node[], sets: OBSet, darkTheme: boolean): [ D3Types.Node[], OBSet ] => {
    const set_keys = Object.keys(sets)
    Object.entries(sets).forEach( (entry: [ string, string[] ]) => {
        const [nodeType, set] = entry
        const _id = nodeType + '_id' as keyof Scoby
        const rowIncludesKey: boolean = Object.keys(row).includes(_id)
        const idNotInSet: boolean = !set.includes(row[_id] as string)
        if (rowIncludesKey && idNotInSet) {
            sets[ nodeType as keyof OBSet ].push(row[_id] as string)
            const node = create_node(_id, nodeType as keyof OBSet, row, darkTheme)
            nodes.push(node)
        }
    })
    return [nodes, sets]
}

const color_link = ( link: D3Types.Link, darkMode: boolean ): D3Types.Link => {
    const color: string = darkMode? d3.schemeGreys[4][1] : d3.schemeGreys[4][4]
    link['color'] = color
    return link
}

const add_to_links = (row: Scoby, links: D3Types.Link[], darkMode: boolean): D3Types.Link[] => {
    // each row adds two links sem_id -> container_id and container_id -> ob_id

    if (row.sem_id && row.container_id) {
        let link: D3Types.Link = {
            source: row.sem_id,
            target: row.container_id,
            value: 'sem_id to container_id',
        }
        link = color_link(link, darkMode)
        links.push(link)
    }
    if (row.container_id && row.ob_id) {
        let link: D3Types.Link = {
            source: row.container_id,
            target: row.ob_id,
            value: 'container_id to ob_id',
        }
        link = color_link(link, darkMode)
        links.push(link)
    }
    return links
}

const scoby_arr_to_data_object = (rows: Scoby[], darkTheme: boolean): D3Types.DataObject => {
    let nodes: D3Types.Node[] = []
    let links: D3Types.Link[] = []
    // book keeping for three arrays of unique sem_ids, ob_ids, and container_ids.
    let sets: OBSet = { sem: [], ob: [], container: [] }
    rows.forEach((row: Scoby) => {
        // add to node
        [nodes, sets] = add_to_nodes(row, nodes, sets, darkTheme)
        links = add_to_links(row, links, darkTheme)
    })
    const dataObject: D3Types.DataObject = { nodes: nodes, links: links }
    return dataObject
}

export default function GraphForceLayout(props: Props) {
    const [clonedData, setClonedData] = useState({nodes: [], links: []} as D3Types.DataObject )

    const theme = useTheme()
    const darkMode = true 
    useEffect(() => {
        const dataObj = scoby_arr_to_data_object(props.data, darkMode)
        setClonedData(dataObj)
    }, [props])

    const fillColor = (node: D3Types.Node): string | undefined => {
        return node.fillColor
    }

    return (
        <ForceGraph2D
        graphData={clonedData}
        width={props.width}
        height={props.height}
        nodeId={'name'}
        nodeLabel={'msg'}
        nodeColor='fillColor'
        linkWidth={1}
        />
    )
}