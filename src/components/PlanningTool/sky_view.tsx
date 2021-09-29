import { useD3 } from '../../hooks/useD3'
import * as d3 from 'd3'
import { OBCell, Target } from '../../typings/papahana'

const HT_OFFSET = 600 // hawaii time offset from ut time
const KECK_LONG = 360-155.4747 // absolute longitude of keck observatory
const KECK_LAT = 19.8260

const skyview = (svg: any, height: number, width: number, targets: Target[]) => {
    console.log('Targets in skyview:')
    console.log(targets)
    
    let [ra, dec, alt, az]: number[][] = [[], [], [], []]

    targets.forEach((target: Target) => {
        ra.push(target.ra_deg as number)
        dec.push(target.dec_deg as number)
        const azAlt = ra_dec_to_az_alt(target.ra_deg as number, target.dec_deg as number)
        az.push(azAlt[0])
        alt.push(azAlt[1])
    })

    if (ra.length <= 0) return
    const data = d3.zip(az, alt)
    console.log( 'az, alt' )
    console.log( az, alt )

    d3.selectAll("svg > *").remove(); // clear old scales and points

    const x = d3.scaleLinear()
        .domain([Math.min(...az)-10, Math.max(...az)+10])
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
        .domain([Math.min(...alt)-10, Math.max(...alt)+10])
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

const txt = (d: any) => `target is ${d[0]} azimuth and ${d[1]} altitude`

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
        .data(data)
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

const date_to_juld = (date: Date) => {
    return Math.floor( date.getTime()/864000 ) - (HT_OFFSET / 1440 ) + 2440587.5
}

const get_gmt = (date?: Date) => {
    /* Taken from Jean Meeus's Astronomical Algorithms textbook. Using equations
    12.1 & 12.4*/
    if (!date) date = new Date()
    const JD = date_to_juld(date)
    const T = ( JD - 2_451_545.0 ) / 36_525 // 12.1
    const Theta0 = 280.46061837 
                   + 360.98564736629 * (JD - 2451545.0) 
                   + T * T * 0.000387933 
                   - T * T * T / 38710000 // 12.4
    return Theta0
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

const ra_dec_to_az_alt = (ra: number, dec: number, date?: Date) => {

    if (!date) date = new Date()
    const hourAngle = (get_gmt(date) - KECK_LONG) % 360
    const sinAlt =  Math.sin(Math.PI / 180 * dec) * Math.sin(Math.PI / 180 * KECK_LAT) 
            + Math.cos(Math.PI / 180 * dec) * Math.cos(Math.PI / 180 * KECK_LAT) * Math.cos(Math.PI / 180 * hourAngle)
    const alt = Math.asin(sinAlt)
    const A = ( Math.sin(Math.PI / 180 * dec) - Math.sin(alt) * Math.sin(Math.PI / 180 * KECK_LAT))
              / Math.cos(alt) * Math.cos(Math.PI / 180 * KECK_LAT)
    const az = Math.sin(hourAngle) < 0? A: 2 * Math.PI - A

    return [ 180 / Math.PI * alt, 180 / Math.PI * az ]
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
    width: 450,
    height: 500,
}