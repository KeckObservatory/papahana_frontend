import * as React from 'react'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { D3Types, DispatchIdx } from './../../typings/d3_force'
import * as d3 from 'd3'


interface LabelProps {
    node: D3Types.Node
    onNodeSelected: DispatchIdx
}

interface Props {
    nodes: D3Types.Node[]
    onNodeSelected: DispatchIdx
}

export const Label = (props: LabelProps) => {
    // const ref: SVGTextElement | undefined = undefined
    const ref = React.createRef<SVGTextElement>()

    useEffect(() => {
        if (ref) { d3.select(ref.current).data([props.node]) }
    })

    return (
        <text
            style={{ cursor: 'pointer' }}
            className="label"
            // eslint-disable-next-line no-return-assign
            ref={(ref: SVGTextElement) => (ref = ref)}
            onClick={() => {
                props.onNodeSelected(((props.node as unknown) as { index: number }).index - 1)
            }}
        >
            {props.node.name}
        </text>
    )

}

export default function Labels(props: Props) {
    const labels = props.nodes.map((node: D3Types.Node, key: number) => {
        return <Label key={`label-${key}`} node={node} onNodeSelected={props.onNodeSelected} />
    })

    return (
        <g className="labels">{labels}</g>
    )
}
