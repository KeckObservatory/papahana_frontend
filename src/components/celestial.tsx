import { useD3 } from '../hooks/useD3'

const celestial = (svg: SVGGraphicsElement, height: number, width: number) => { 

}

interface Props {
    height: number 
    width: number
}


export default function Celestial(props: Props) {

    const ref = useD3((svg: SVGGraphicsElement) => { celestial(svg, props.height, props.width) })

    return (
        <svg
            ref={ref as any}
            style={{
                height: props.height,
                width: props.width,
                marginRight: "0px",
                marginLeft: "0px",
            }}
        >
        </svg>
    );
}

Celestial.defaultProps = {
    width: 500,
    height: 500,
}