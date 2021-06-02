import { D3Types } from './../../typings/d3_force'
import * as React from 'react'
import * as d3 from 'd3'
import { D3DragEvent } from 'd3'
import { useEffect, useRef } from 'react'
const uuid = require('react-uuid')

interface Props {
    nodes: D3Types.Node[]
    restartDrag: () => void
    stopDrag: () => void
}

interface NodeProps {
    node: D3Types.Node,
    key: string
}

export function Node(props: NodeProps) {
    const ref: SVGCircleElement | undefined = undefined
    // const ref = useRef<SVGCircleElement | undefined >(undefined)
    console.log('node ref')
    console.log(ref)

    useEffect(() => {
        if (ref) { d3.select(ref).data([props.node]) }
    },
        [props.node])

    return (
        <circle className="node" r={props.node.radiusSize} fill={props.node.fillColor as string} ref={(ref: SVGCircleElement) => (ref = ref)}>
            <title>{props.node.name}</title>
        </circle>
    )
}


export default function Nodes(props: Props) {
    useEffect(() => {
        setMouseEventsListeners()
    }, [props.nodes])

    function onDragStart(event: D3DragEvent<SVGCircleElement, D3Types.Datum, never>, d: D3Types.Datum) {
        console.log('event')
        console.log(event)
        console.log('d')
        console.log(d)
        if (!event.active) {
            props.restartDrag()
        }
        if (d) {
        d.fx = d.x
        d.fy = d.y
        }
    }

    function onDrag(event: D3DragEvent<SVGCircleElement, D3Types.Datum, never>, d: D3Types.Datum) {
        if (d) {
        d.fx = event.x
        d.fy = event.y
        }
    }

    function onDragEnd(event: D3DragEvent<SVGCircleElement, D3Types.Datum, never>, d: D3Types.Datum) {
        if (!event.active) {
            props.stopDrag()
        }
        if (d) {
        d.fx = null
        d.fy = null
        }
    }

    const setMouseEventsListeners = () => {
        // @ts-ignore
        d3.selectAll('.node')
            .call(d3.drag<any, any>()
            // .call(d3.drag<SVGCircleElement, D3Types.Datum>()
                .on('start', onDragStart)
                .on('drag', onDrag)
                .on('end', onDragEnd)
            )
    }

    const nodes = props.nodes.map((node: D3Types.Node) => {
        return <Node key={`node-${uuid()}`} node={node} />
    })

    return (<g className="nodes">{nodes}</g>)
}