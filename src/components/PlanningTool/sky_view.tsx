import { useD3 } from '../../hooks/useD3'
import * as d3 from 'd3'
import { OBCell, Target } from '../../typings/papahana'

const skyview = (svg: any, height: number, width: number, targets: Target[]) => {
    console.log('Targets in skyview:')
    console.log(targets)
    
    let ra: number[] = targets.map((target: Target) => {
        return target.ra_deg as number
    })
    let dec: number[] = targets.map((target: Target) => {
        return target.dec_deg as number
    })

    if (ra.length <= 0) return

    const x = d3.scaleLinear()
        .domain([Math.min(...ra)-10, Math.max(...ra)+10])
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
        .domain([Math.min(...dec)-10, Math.max(...dec)+10])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    const tooltip = d3.select("body")
        .append("h1")
        .style("position", "absolute")
        .style("background-color", "#515151")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("opacity", .85)
        .style("font", "13px sans-serif")
        .style("padding", "10px")
        .style("visibility", "hidden")
        .style('pointer-events', 'none')
        .style("color", "white")

    const txt = (d: any) => `target is ${d[0]} ra and ${d[0]} dec`

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (event: any, d: any) {
        tooltip
            .style("opacity", 1)
            .style("top", (event.pageY - 80) + "px")
            .style("left", (event.pageX - 80) + "px")
            .transition()
            .style("visibility", "visible")
            .text(txt(d))
    }

    const mousemove = function (event: any, d: any) {
        tooltip
            .style("opacity", 1)
            .style("top", (event.pageY - 80) + "px")
            .style("left", (event.pageX - 80) + "px")
            .transition()
            .delay(300)
            .duration(400)
            .style("visibility", "visible")
            .text(txt(d))
    }

    const mouseleave = function (event: any, d: any) {
        tooltip
            .transition()
            .delay(300)
            .duration(400)
            .style("opacity", 0)
    }
    svg
        .append("g")
        .selectAll("dot")
        .data(d3.zip(ra, dec))
        .join("circle")
        .attr("class", "myCircle")
        .attr("cx", (d: any) => x(d[0]))
        .attr("cy", (d: any) => y(d[1]))
        .attr("r", 8)
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("fill", "white")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
}

interface Props {
    height: number
    width: number
    selObs: OBCell[]
}

const hours_to_deg = (time: string, dec = false) => {
    let [hours, min, sec] = time.split(':')
    // let sign: number = dec ? (hours[0] === '+' ? 1 : -1) : 1
    let sign = 1
    if (hours[0] === '+') hours = hours.substring(1);
    if (hours[0] === '-') hours = hours.substring(1); sign=-1
    console.log([sign, hours, min, sec])
    const deg = 360 * sign * (parseInt(hours, 10) / 24
        + parseInt(min, 10) / 60
        + parseInt(sec, 10) / 60)
    // const deg = 360 * sign * (JSON.parse(hours) / 24
    return deg
}

export default function SkyView(props: Props) {

    let targets: Target[] = []
    props.selObs.forEach((obSel: OBCell) => {
        if (obSel.target) targets.push(obSel.target)
    })

    targets = targets.map((target: Target) => {
        target.ra_deg = hours_to_deg(target.ra)
        target.dec_deg = hours_to_deg(target.dec, true)
        return target
    })

    const ref = useD3((svg: any) => { skyview(svg, props.height, props.width, targets) })

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

SkyView.defaultProps = {
    width: 500,
    height: 500,
}