import * as React from 'react'
import * as d3 from 'd3'
import { Simulation, SimulationNodeDatum } from 'd3-force'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Links from './links'
import Labels from './labels'
import Nodes from './nodes'
import { D3Types, DispatchIdx } from './../../typings/d3_force'
import { Scoby } from '../../typings/papahana'

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
    let name = nodeType === 'ob' ? row.name : row[x_id]
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

const add_to_links = (row: Scoby, links: D3Types.Link[]): D3Types.Link[] => {
    // each row adds two links sem_id -> container_id and container_id -> ob_id
    if (row.sem_id && row.container_id) {
        const link: D3Types.Link = {
            source: row.sem_id,
            target: row.container_id,
            value: 'sem_id to container_id'
        }
        links.push(link)
    }
    if (row.container_id && row.ob_id) {
        const link: D3Types.Link = {
            source: row.container_id,
            target: row.ob_id,
            value: 'container_id to ob_id'
        }
        links.push(link)
    }
    return links
}

const scoby_arr_to_data_object = (rows: Scoby[]): D3Types.DataObject => {
    let nodes: D3Types.Node[] = []
    let links: D3Types.Link[] = []
    // book keeping for three arrays of unique sem_ids, ob_ids, and container_ids.
    let sets: OBSet = { sem: [], ob: [], container: [] }
    rows.forEach((row: Scoby) => {
        // add to node
        [nodes, sets] = add_to_nodes(row, nodes, sets)
        links = add_to_links(row, links)
    })
    const dataObject: D3Types.DataObject = { nodes: nodes, links: links }
    return dataObject
}

export default function GraphForceLayout(props: Props) {
    let simulation: Simulation<SimulationNodeDatum, undefined> | undefined = undefined

    // EE: the clone data is needed to avoid:
    // TypeError: Cannot add property index, object is not extensible
    const dataObj = scoby_arr_to_data_object(props.data)
    console.log('dataObj')
    console.log(dataObj)
    const [clonedData, setClonedData] = useState(dataObj)


    useEffect(() => {
        simulatePositions()
        drawTicks()
        addZoomCapabilities()
    }, [props])


    const simulatePositions = () => {
        simulation = d3
            .forceSimulation()
            .nodes(clonedData?.nodes as SimulationNodeDatum[])
            .force(
                'link',
                d3
                    .forceLink()
                    .id((d) => {
                        return (d as D3Types.Node).name
                    })
                    .distance(props.linkDistance)
                    .strength(props.linkStrength)
            )
            .force('charge', d3.forceManyBody().strength(props.chargeStrength))
            .force('center', d3.forceCenter(props.centerWidth, props.centerHeight))

        // @ts-ignore
        simulation.force('link').links(clonedData?.links)
    }

    const drawTicks = () => {
        const nodes = d3.selectAll('.node')
        const links = d3.selectAll('.link')
        const labels = d3.selectAll('.label')

        if (simulation) {
            simulation.nodes(clonedData?.nodes as SimulationNodeDatum[]).on('tick', onTickHandler)
        }

        function onTickHandler() {
            links
                .attr('x1', (d) => {
                    return (d as { source: D3Types.Point }).source.x
                })
                .attr('y1', (d) => {
                    return (d as { source: D3Types.Point }).source.y
                })
                .attr('x2', (d) => {
                    return (d as { target: D3Types.Point }).target.x
                })
                .attr('y2', (d) => {
                    return (d as { target: D3Types.Point }).target.y
                })
            nodes
                .attr('cx', (d) => {
                    return (d as D3Types.Point).x
                })
                .attr('cy', (d) => {
                    return (d as D3Types.Point).y
                })
            labels
                .attr('x', (d) => {
                    return (d as D3Types.Point).x + 5
                })
                .attr('y', (d) => {
                    return (d as D3Types.Point).y + 5
                })
        }
    }

    const addZoomCapabilities = () => {
        const container = d3.select('.container')
        const zoom = d3
            .zoom()
            .scaleExtent([1, 8])
            .translateExtent([
                [100, 100],
                [300, 300],
            ])
            .extent([
                [100, 100],
                [200, 200],
            ])
            .on('zoom', (event) => {
                let { x, y, k } = event.transform
                x = 0
                y = 0
                k *= 1
                container.attr('transform', `translate(${x}, ${y})scale(${k})`).attr('width', props.width).attr('height', props.height)
            })

        // @ts-ignore
        container.call(zoom)
    }

    const restartDrag = () => {
        if (simulation) simulation.alphaTarget(0.2).restart()
    }

    const stopDrag = () => {
        if (simulation) simulation.alphaTarget(0)
    }

    const initialScale = 1
    const initialTranslate = [0, 0]
    return (
        <svg className="container" x={0} y={0} width={props.width} height={props.height} transform={`translate(${initialTranslate[0]}, ${initialTranslate[1]})scale(${initialScale})`}>
            <g>
                <Links links={clonedData?.links as D3Types.Link[]} />
                <Nodes nodes={clonedData?.nodes as D3Types.Node[]} restartDrag={restartDrag} stopDrag={stopDrag} />
                <Labels nodes={clonedData?.nodes as D3Types.Node[]} onNodeSelected={props.onNodeSelected} />
            </g>
        </svg>
    )
}