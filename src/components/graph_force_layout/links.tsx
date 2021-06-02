
import { D3Types } from './../../typings/d3_force'
import * as React from 'react'
import * as d3 from 'd3'
import { useEffect } from 'react'

const uuid = require('react-uuid')

interface Props {
    links: D3Types.Link[]
}

interface LinkProps {
    link: D3Types.Link,
}

export function Link(props: LinkProps) {
    // const ref: SVGElement | undefined = undefined
    const ref = React.createRef<SVGLineElement>()
    console.log('link ref')
    console.log(ref)
    console.log('links')
    console.log(props.link)
    useEffect(() => {
        if (ref) { d3.select(ref.current).data([props.link]) }
    },
        [props.link])

    const onMouseOverHandler = (event: React.MouseEvent<SVGLineElement, MouseEvent>, link: LinkProps) => {
        d3.select('.linkGroup')
            .append('text')
            .attr('class', 'linkTextValue')
            .text((link.link.value as string).replace(/(.{50})..+/, '$1…'))
            .attr('x', event.nativeEvent.offsetX)
            .attr('y', event.nativeEvent.offsetY)
    }

    const onMouseOutHandler = () => {
        d3.select('.linkTextValue').remove()
    }

    return (
        <g className="linkGroup">
            <line
                // eslint-disable-next-line no-return-assign
                ref={(ref: SVGLineElement) => (ref = ref)}
                className="link"
                onMouseOver={(event) => {
                    onMouseOverHandler(event, props)
                }}
                onMouseOut={(event) => {
                    onMouseOutHandler()
                }}
            />
        </g>
    )
}


export default function Links(props: Props) {
    console.log('Links props')
    console.log(props.links)
    const links = props.links.map((link: D3Types.Link) => {
        return <Link key={`links=${uuid()}`} link={link} />
    })

    return (<g className="links">{links}</g>)
}