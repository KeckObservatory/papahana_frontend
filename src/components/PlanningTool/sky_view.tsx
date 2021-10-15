
import React from 'react';
import { useD3 } from '../../hooks/useD3'
import * as d3 from 'd3'
import { OBCell, Target } from '../../typings/papahana'
import { ra_dec_to_az_alt, get_nadir, hours_to_deg, get_target_traj, get_times } from './sky_view_util'

interface Data { time: Date, value: number, type: string, tgt?: string, units?: string }

const format_traj = (trace: [number, number][], times: Date[], tgt: string, units?: string): Data[] => {
    let data: Data[] = []
    for (let idx = 0; idx < times.length; idx++) {
        const d: Data = { time: times[idx], value: trace[idx][1], units: units, type: 'trajectory', tgt: tgt }
        data.push(d)
    }
    return data
}

const skyview = (svg: any, height: number, width: number, targets: Target[]) => {
    let [ra, dec, alt, az]: number[][] = [[], [], [], []]
    // let myData: Data[] = [] 

    const nadir = get_nadir()

    let myData: Data[][] = []
    let mergedData: Data[] = []

    targets.forEach((target: Target) => {
        ra.push(target.ra_deg as number)
        dec.push(target.dec_deg as number)
        const times = get_times(nadir, 25)
        const azAlt = ra_dec_to_az_alt(target.ra_deg as number, target.dec_deg as number, nadir)
        az.push(azAlt[0])
        alt.push(azAlt[1])
        const traj = get_target_traj(target.ra_deg as number, target.dec_deg as number, times)
        const fTraj = format_traj(traj, times, target.name, 'degrees')
        mergedData = [...mergedData, ...fTraj]
        myData.push(fTraj)
    })

    if (ra.length <= 0) return
    const startDate = myData[0][0].time
    const endDate = myData[0][myData[0].length - 1].time
    const values = myData.flat().map(d => d.value)
    const yMin: number = d3.min(values) as number
    const yMax: number = d3.max(values) as number

    const xScale = d3.scaleTime([startDate, endDate],
        [0, width]
    )
    const yScale = d3.scaleLinear([yMin, yMax],
        [height, 0]
    )

    let tdx = 0
    const tgts = myData.map(d => {
        let t = d[0].tgt
        t = t ? t : JSON.stringify(tdx)
        tdx++
        return t
    })

    const colors = d3.scaleOrdinal(
        tgts, d3.schemeCategory10
    )

    const line = d3.line()
        .x((d: any | Data) => xScale(d.time))
        .y((d: any | Data) => yScale(d.value))

    for (const i in myData) {
        svg.append('circle')
            .attr('class', 'marker ' + myData[i][0].tgt)
            .attr('cx', 100)
            .attr('cy', 100)
            .attr('r', 5)
            .attr('fill', 'grey')
            .style('opacity', 0)
    }

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
        .style('display', 'none')
        // .style("color", "white")

    const ruler = svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', height)
        .attr('width', 2)
        .attr('class', 'ruler')
        .style('stroke', 'lightgray')
        .attr('opacity', 0)

    var bisectDate = d3.bisector(function(d: any) { return d.time; }).left;
    const formatDate = (date: Date ) =>{
        var year = date.getFullYear(),
            month = date.getMonth() + 1, // months are zero indexed
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds(),
            hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
            minuteFormatted = minute < 10 ? "0" + minute : minute,
            morning = hour < 12 ? "am" : "pm";
    
        return month + "/" + day + "/" + year + " " + hourFormatted + ":" +
                minuteFormatted + morning;
    }


    // var graph1 = svg.append('g').attr('class', 'texts').style("visibility", "visible")

    const moveRuler = (event: any) => {
        const [xp, yp] = d3.pointer(event, svg.node())
        const xpoint = xScale.invert(xp)

        var d: any
        var keys: string[] = []
        var keyData: any[] = []
        for (const idx in myData) {
            const i = bisectDate(myData[idx], xpoint, 1)
            const d0 = myData[idx][i - 1]
            const d1 = myData[idx][i]
            d = xpoint.getTime() - d0.time.getTime() > d1.time.getTime() - xpoint.getTime() ? d1 : d0;
            svg.selectAll('.marker.' + myData[idx][0].tgt)
                .attr('cx', xScale(d.time))
                .attr('cy', yScale(d.value))
                .style('opacity', 1);

            const c = colors(d.tgt)
            const txt =  d3.format( ',.3f' )( d.value ) 
            const key =`<li>
                        <circle class="span-${d.tgt}" style="background-color: ${c}"></circle>
                        <span>${d.tgt }</span>
                        <span >${txt}</span>
                        </li>` 
            const k: any = {time: d.time, color: c, txt: d.tgt, value: Math.round(d.value * 1000) / 1000}
            keyData.push(k)
            keys.push(key)
        }

        // var texts = graph1
        // .selectAll('texts')
        // .data(keyData)
        // .enter().append("text")
        // .attr("class", "lineLabel")
        // .style("top", (event.pageY - 250) + "px")
        // .style("left", (event.pageX - 200) + "px")

        // var tspans = texts.selectAll('texts')
        //     .data(keyData)
        //     .enter()
        //     .append('tspan')

        //     .style("display", "inline-block")
        //     .style("opacity", 1)
        //     .style("visibility", "visible")
        //     .style('fill', function(d: any) { return d.color; })
        //     .style('font-weight', '600')
        //     .text(function(d: any) { console.log(d); return d.txt });

        tooltip
            .style("opacity", 1)
            .style("visibility", "visible")
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX - 10) + "px")
            .style('font-size', '20px')
            .style("display", "inline-block")
            .html(`
            <div>
                <h4>${ formatDate(d.time)}</h4>
            </div>
            `)
            .selectAll("mylegend")
            .data(keyData)
            .enter() //for each line, list out name and value
            .append('div')
            .style( 'background-color' ,(d: any) => d.color)
            .html( (d: any) => {
                return d.txt + ': ' + d.value

            })
            // .html(`
            // <div>
            //     <h4>${ formatDate(d.time)}</h4>
            //     <ul>
            //     ${ keys.join(``) }
            //     </ul>
            // </div>
            // `)

        ruler
            .attr('x', xScale(d.time))
            .style('opacity', 1);

    }

    const hideRuler = () => {
        d3.selectAll('.ruler')
            .style('opacity', 0);
        d3.selectAll('.marker')
            .style('opacity', 0);
        d3.selectAll('.label')
            .style('opacity', 0);
        // d3.selectAll('.texts')
        //     .style('opacity', 0);
        tooltip
            .style("opacity", 0)
    }

    svg
        .on("mousemove", moveRuler)
        .on("mouseleave", hideRuler)

    const lineClass = svg.selectAll('path')
        .data(myData)
        .join('path')
        .attr('class', 'chart-lines')
        .attr('d', line.curve(d3.curveNatural))
        .style('stroke', (d: any | Data[]) => colors(d[0].tgt))
        .style('stroke-width', 2)
        .style('fill', 'transparent')

}

interface Props {
    height: number
    width: number
    selObs: OBCell[]
}


export default function SkyView(props: Props) {

    React.useEffect(() => {
        d3.selectAll("svg > *").remove(); // clear old scales and points
    }, [props.selObs])

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