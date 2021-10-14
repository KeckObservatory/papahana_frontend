
import React from 'react';
import { useD3 } from '../../hooks/useD3'
import * as d3 from 'd3'
import { OBCell, Target } from '../../typings/papahana'
import { ra_dec_to_az_alt, get_nadir, hours_to_deg, get_target_traj, get_times } from './sky_view_util'

interface Data {time: Date, value: number, type: string, tgt?: string, units?: string}

const format_traj = ( trace: [number, number][], times: Date[], tgt: string, units?: string): Data[] => {
    let data: Data[] = []
    for (let idx=0; idx<times.length; idx++) {
        const d: Data = {time: times[idx], value: trace[idx][1], units: units, type: 'trajectory', tgt: tgt}
        data.push(d)
    }
    return data
}

const skyview = (svg: any, height: number, width: number, targets: Target[]) => {
    let [ra, dec, alt, az]: number[][] = [[], [], [], []]
    // let myData: Data[] = [] 

    const nadir = get_nadir()

    // set the ranges
    var x = d3.scaleTime().range([width, 0]);
    var y = d3.scaleLinear().range([0, height]);
    var valueLines: any = []
    let myData: Data[][]= []
    let mergedData: Data[]= []

    targets.forEach((target: Target) => {
        ra.push(target.ra_deg as number)
        dec.push(target.dec_deg as number)
        const times = get_times(nadir, 5)
        const azAlt = ra_dec_to_az_alt(target.ra_deg as number, target.dec_deg as number, nadir)
        az.push(azAlt[0])
        alt.push(azAlt[1])
        const traj = get_target_traj(target.ra_deg as number, target.dec_deg as number, times)
        const fTraj = format_traj(traj, times, target.name, 'degrees') 


        // define the line
        let valueLine = d3.line()
            .x(function(d: any) { return x(d.time); })
            .y(function(d: any) { return y(d.value); });

        mergedData = [...mergedData, ...fTraj]
        myData.push(fTraj)
        valueLines.push(valueLine)
    })

    if (ra.length <= 0) return

    let tdx = 0
    const tgts = myData.map( d => {
        let t = d[0].tgt
        t = t ? t : JSON.stringify(tdx)
        tdx++
        return t
    })

    const colors = d3.scaleOrdinal(
            tgts, d3.schemeCategory10
        )


    const startDate = myData[0][0].time
    const endDate = myData[0][myData[0].length - 1].time
    const values = myData.flat().map(d => d.value)
    const yMin: number = d3.min( values ) as number
    const yMax: number = d3.max( values ) as number

    const xScale = d3.scaleTime( [startDate, endDate],
            [0, width]
            )
    

    const yScale = d3.scaleLinear( [yMin, yMax],
            [height, 0]
            )

    const yAxis = () => {
        return d3.axisLeft(yScale)
    }

    const xAxis = () => {
        return d3.axisBottom(xScale)
    }

    const line = d3.line()
    .x( (d: any | Data) => xScale(d.time) )
    .y( (d: any | Data) => yScale(d.value) )

    const dot = svg.append("g")
    .attr("display", "none");

    dot.append("circle")
        .attr("r", 9.5);

    dot.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .attr("y", height-8);


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

    const txt = (d: Data) => `target is ${d.tgt} with ${d.type} ${d.value} ${d.units}`


    const ruler = svg.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', height)
    .attr('width', 2)
    .attr('class', 'ruler')
    .style( 'stroke', 'lightgray' )
    .attr('opacity', 0)


    const moveRuler = (event: any) => {
        const [ xp, yp ] = d3.pointer(event, svg.node())
        const xpoint = x.invert(xp)
        const ypoint = y.invert(yp)
        console.log('pointer', xp, yp, ypoint)
        ruler 
            .attr('x', x(xpoint))
            .style('opacity',1);
        
        d3.selectAll('.label')
            .attr('x', x(xpoint))
            .attr('y', y(yp))
            .text(xpoint.toString())
            .style('opacity',1);
        
        tooltip
            .style("opacity", 1)
            .style("top", (event.pageY - 80) + "px")
            .style("left", (event.pageX - 80) + "px")
            .transition()
            .style("visibility", "visible")
            .text(xpoint.toISOString())

        
        // for (const i in series) {
        //     const found_idx_points = series[i].data.map(d => d.x).indexOf(x_value)
        //     if ( found_idx_points > -1) {
        //     const y_value = series[i].data[found_idx_points].y
        //     d3.selectAll('.marker.'+series[i].name)
        //         .attr('cx', x(x_value))
        //         .attr('cy', y(y_value))
        //         .style('opacity',1);
        //     } else {
        //     d3.selectAll('.marker.'+series[i].name)
        //         .style('opacity',0);
        //     }
        // }
  }

    const rect = svg.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', height)
    .attr('width', width)
    .attr('stroke', 'red')
    .attr('stroke-width', '3px')
    .attr('stroke-opacity', 0.3)
    .attr('fill', 'none')

    svg
    .on("mousemove", moveRuler)
    .on("mouseleave", hideRuler)


    const lineClass = svg.selectAll('path')
    .data( myData )
    .join('path')
      .attr('class', 'chart-lines')
      // Using our line generator here
      .attr('d', line)
      // Every data point in the array has a name key
      // so we just grab the one from d[0]
      .style('stroke', (d: any | Data[]) => colors(d[0].tgt))
      .style('stroke-width', 2)
      .style('fill', 'transparent')
}

const hideRuler = () => {
    d3.selectAll('.ruler')
      .style('opacity',0);
    d3.selectAll('.marker')
      .style('opacity',0);
      d3.selectAll('.label')
        .style('opacity',0);
  }


const skyviewBak = (svg: any, height: number, width: number, targets: Target[]) => {
    // console.log('Targets in skyview:')
    // console.log(targets)
    
    let [ra, dec, alt, az]: number[][] = [[], [], [], []]
    let myData: Data[] = [] 

    const nadir = get_nadir()

    // set the ranges
    var x = d3.scaleTime().range([width, 0]);
    var y = d3.scaleLinear().range([0, height]);
    var valueLines: any = []

    targets.forEach((target: Target) => {
        ra.push(target.ra_deg as number)
        dec.push(target.dec_deg as number)
        const times = get_times(nadir, 5)
        const azAlt = ra_dec_to_az_alt(target.ra_deg as number, target.dec_deg as number, nadir)
        az.push(azAlt[0])
        alt.push(azAlt[1])
        const traj = get_target_traj(target.ra_deg as number, target.dec_deg as number, times)
        const fTraj = format_traj(traj, times, target.name, 'degrees') 


        // define the line
        let valueLine = d3.line()
            .x(function(d: any) { return x(d.time); })
            .y(function(d: any) { return y(d.value); });

        myData = [...myData, ...fTraj]
        valueLines.push(valueLine)


    })

    console.log('myData', myData)
    if (ra.length <= 0) return

    const minTime = myData.reduce(function (a: Data, b: Data) { return a.time < b.time ? a: b; }); 
    const maxTime = myData.reduce(function (a: Data, b: Data) { return a.time > b.time ? a : b; }); 
    const minValue = myData.reduce(function (a: Data, b: Data) { return a.value < b.value ? a: b; });
    const maxValue = myData.reduce(function (a: Data, b: Data) { return a.value > b.value ? a: b; });

    x.domain([minTime.time, maxTime.time])
    y.domain([minValue.value, maxValue.value])

    // const data = d3.zip(az, alt)
    // console.log( 'az, alt' )
    // console.log( az, alt )

    // d3.selectAll("svg > *").remove(); // clear old scales and points

    // const x = d3.scaleLinear()
    //     .domain([Math.min(...az)-10, Math.max(...az)+10])
    //     .range([width, 0]);
    // svg.append("g")
    //     .attr("transform", `translate(0, ${height})`)
    //     .call(d3.axisBottom(x));

    // const y = d3.scaleLinear()
    //     .domain([Math.min(...alt)-10, Math.max(...alt)+10])
    //     .range([0, height]);
    // svg.append("g")
    //     .call(d3.axisLeft(y));

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

    const txt = (d: Data) => `target is ${d.tgt} with ${d.type} ${d.value} ${d.units}`

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (event: any, d: Data) {
        tooltip
            .style("opacity", 1)
            .style("top", (event.pageY - 80) + "px")
            .style("left", (event.pageX - 80) + "px")
            .transition()
            .style("visibility", "visible")
            .text(txt(d))
    }

    const mousemove = function (event: any, d: Data) {
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

    const mouseleave = function (event: any, d: Data) {
        tooltip
            .transition()
            .delay(300)
            .duration(400)
            .style("opacity", 0)
    }

//   // Add the valueline path.
//     valueLines.forEach( (line: any) => {
//         svg.append("path")
//             // .selectAll(".targets")
//             .datum(myData)
//             .attr("fill", "none")
//             .attr("stroke", "steelblue")
//             .attr("stroke-width", 1.5)
//             .attr("stroke-linejoin", "round")
//             .attr("stroke-linecap", "round")
//             .attr("d", line)
//             .on("mouseover", mouseover)
//             .on("mousemove", mousemove)
//             .on("mouseleave", mouseleave)
//     })

    var tgts = svg.selectAll(".targets")
    .data(myData).enter().append('g').attr("class", "target")

    var lines = document.getElementsByClassName('line')

    var line = d3.line()
      .x(function(d: any) {
        return x(d.time);
      })
      .y(function(d: any) {
        return y(d.value);
      });

    tgts.append("path")
    .attr("class", "line")
    .attr("d", function(d: any) { 
        return line(d)
    })
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")

    var mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

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