import { D3Types } from './../../typings/d3_force'
import * as React from 'react'
import * as d3 from 'd3'
import { D3DragEvent } from 'd3'
import { useEffect } from 'react'

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
        return () => {

        }
    }, [props.nodes])

    function onDragStart(event: D3DragEvent<SVGCircleElement, D3Types.Datum, never>, d: D3Types.Datum) {
        if (!event.active) {
            props.restartDrag()
        }
        d.fx = d.x
        d.fy = d.y
    }

    function onDrag(event: D3DragEvent<SVGCircleElement, D3Types.Datum, never>, d: D3Types.Datum) {
        d.fx = event.x
        d.fy = event.y
    }

    function onDragEnd(event: D3DragEvent<SVGCircleElement, D3Types.Datum, never>, d: D3Types.Datum) {
        if (!event.active) {
            props.stopDrag()
        }
        d.fx = null
        d.fy = null
    }

    const setMouseEventsListeners = () => {

        // @ts-ignore
        d3.selectAll('.node')
            .call(d3.drag<any, any>()
                .on('start', onDragStart)
                .on('drag', onDrag)
                .on('end', onDragEnd)
            )

    }

    const nodes = props.nodes.map((node: D3Types.Node, idx: number) => {
        return <Node key={'node-${idx}'} node={node} />
    })

    return (<g className="nodes">{nodes}</g>)
}