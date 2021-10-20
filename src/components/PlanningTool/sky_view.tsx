
import React from 'react';
import { useD3 } from '../../hooks/useD3'
import * as d3 from 'd3'
import { OBCell, Target } from '../../typings/papahana'
import * as dayjs from 'dayjs'
import { date_to_juld, KECK_LONG, get_gmt, ra_dec_to_az_alt, get_nadir, hours_to_deg, get_target_traj, get_times, get_air_mass } from './sky_view_util'

interface Data { time: Date, value: number, type: string, tgt?: string, units?: string }

const format_values = (values: [], times: Date[], tgt: string, units?: string): Data[] => {
    let data: Data[] = []
    for (let idx = 0; idx < times.length; idx++) {
        const d: Data = { time: times[idx], value: values[idx], units: units, type: 'trajectory', tgt: tgt }
        data.push(d)
    }
    return data
}

const check_calc = (nadir: Date) => { 
    console.log('nadir', nadir)
    console.log('juld', date_to_juld(nadir))
    console.log('gst', get_gmt(nadir))
    console.log('lst', get_gmt(nadir) - KECK_LONG)
    let [ra, dec] = ["17:31:16", "+33:27:43"] as any[]
    ra = hours_to_deg(ra)
    dec = hours_to_deg(dec)
    console.log('ra', ra)
    console.log('dec', dec)
}

const make_data = (targets: Target[]) => {
    let [ra, dec, alt, az, airMass]: number[][] = [[], [], [], [], []]
    // let myData: Data[] = [] 

    const nadir = get_nadir()
    check_calc(nadir)

    const times = get_times(nadir, 105)
    let myData: Data[][] = []
    let mergedData: Data[] = []

    targets.forEach((target: Target) => {
        ra.push(target.ra_deg as number)
        dec.push(target.dec_deg as number)
        const azAlt = ra_dec_to_az_alt(target.ra_deg as number, target.dec_deg as number, nadir)
        az.push(azAlt[0])
        alt.push(azAlt[1])
        let traj = get_target_traj(target.ra_deg as number, target.dec_deg as number, times) as any
        traj = traj.map( (azAlt: any) => azAlt[1])
        let am = get_air_mass(target.ra_deg as number, target.dec_deg as number, times) as any
        const data = format_values(am, times, target.name, 'degrees')
        // const data = format_traj(traj, times, target.name, 'degrees')
        mergedData = [...mergedData, ...data]
        myData.push(data)

    })
    return myData
}


const add_axes = (svg: any, xScale: any, yScale: any, width: number, height: number,
                  xOffset: number, xTxtOffset: number, yOffset: number, yTxtOffset: number, 
                  yLabel="Value [ ]") => { 
  // Add the x Axis
  const xAxisGenerator = d3.axisBottom(xScale).ticks(12)
  const xAxis = svg.append("g")

  xAxis.call(xAxisGenerator)
      .attr("transform", "translate(0," + xOffset + ")")
    //   .style("color", "white")
      .style("font-size","1rem")

  // text label for the x axis
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           xTxtOffset + ")")
      .style("text-anchor", "middle")
      .text("Date")
      .style("font-size","1rem")
      .style("fill", "white");

  // Add the y Axis

  const yAxisGenerator = d3.axisLeft(yScale)
  const yAxis = svg.append("g")

  yAxis
  .attr("transform", "translate(" + yOffset + ", 0)")
      .style("color", "white")
      .style("font-size","1rem")
      .call(yAxisGenerator)

  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 + yTxtOffset)
      .attr("x",0 - (height / 2))
      .style("text-anchor", "middle")
      .text(yLabel)   
      .style("fill", "white")
      .style("font-size","1rem");
}

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

const skyview = (svg: any, outerHeight: number, outerWidth: number,
     marginLeft: number, marginRight: number,
     marginTop: number, marginBottom: number, targets: Target[]) => {
    const myData = make_data(targets)
    if (myData.length <= 0) return
    const startDate = myData[0][0].time
    const endDate = myData[0][myData[0].length - 1].time
    const values = myData.flat().map(d => d.value)
    const yMin: number = d3.min(values) as number
    const yMax: number = d3.max(values) as number

    const height = outerHeight - marginTop - marginBottom
    const width = outerWidth - marginRight - marginLeft

    const xScale = d3.scaleTime([startDate, endDate],
        [marginLeft, width]
    )
    const yScale = d3.scaleLinear([yMin-1, yMax+1],
        [height, marginTop]
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

    //dots appear over line when cursored over
    for (const i in myData) {
        svg.append('circle')
            .attr('class', 'marker ' + myData[i][0].tgt)
            .attr('cx', 100)
            .attr('cy', 100)
            .attr('r', 5)
            .attr('fill', 'grey')
            .style('opacity', 0)
    }

    //tooltip with legend appears when cursor is on canvas
    const tooltip = d3.select("body")
        .append("h1")
        .attr('class', 'tooltip')
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

    //vertical line is drawn offset from cursor
    const ruler = svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', height)
        .attr('width', 2)
        .attr('class', 'ruler')
        .style('stroke', 'lightgray')
        .attr('opacity', 0)

    var bisectDate = d3.bisector(function(d: any) { return d.time; }).left;

    const moveRuler = (event: any) => {
        const [xp, yp] = d3.pointer(event, svg.node())
        const xpoint = xScale.invert(xp)

        var d: any
        var keyData: any[] = []
        for (const idx in myData) {
            const i = bisectDate(myData[idx], xpoint, 1)
            const d0 = myData[idx][i - 1]
            const d1 = myData[idx][i]
            if(!d1) continue
            d = xpoint.getTime() - d0.time.getTime() > d1.time.getTime() - xpoint.getTime() ? d1 : d0;
            svg.selectAll('.marker.' + myData[idx][0].tgt)
                .attr('cx', xScale(d.time))
                .attr('cy', yScale(d.value))
                .style('opacity', 1);

            const c = colors(d.tgt)
            const k: any = {time: d.time, color: c, txt: d.tgt, value: Math.round(d.value * 1000) / 1000}
            keyData.push(k)
        }

        tooltip
            .style("opacity", 1)
            .style("visibility", "visible")
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px")
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
        .attr('d', line.curve(d3.curveBasis))
        .style('stroke', (d: any | Data[]) => colors(d[0].tgt))
        .style('stroke-width', 2)

        .style('fill', 'transparent')

    // add the axes
    // axes go on last
    const xOffset = height 
    const xTxtOffset = xOffset + 40
    const yOffset = marginLeft 
    const yTxtOffset = yOffset - 60
    const valueTxt = "Alt [deg]"
    add_axes(svg, xScale, yScale, width, height, xOffset, xTxtOffset, yOffset, yTxtOffset, valueTxt) 
}

interface Props {
    outerHeight: number
    outerWidth: number
    selObs: OBCell[]
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBottom: number;
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



    let ref = useD3((svg: any) => { skyview(svg, props.outerHeight, props.outerWidth,
         props.marginLeft, props.marginRight, props.marginTop, props.marginBottom,targets) })

    return (
        <svg
            ref={ref as any}
            style={{
                height: props.outerHeight,
                width: props.outerWidth,
            }}
        >
        </svg>
    );
}

SkyView.defaultProps = {
    outerWidth: 1000,
    outerHeight: 625,
    marginRight: 0,
    marginLeft: 120,
    marginTop: 0,
    marginBottom: 60,
}