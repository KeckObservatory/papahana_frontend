import { useD3 } from '../../hooks/useD3'
import * as d3 from 'd3'

const skyview = (svg: any, height: number, width: number) => {
    // set the dimensions and margins of the graph

    // append the svg object to the body of the page
    // const svg = d3.select("#my_dataviz")
    //   .append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //   .append("g")
    //     .attr("transform",`translate(${margin.left},${margin.top})`);

    //Read the data
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/connectedscatter.csv",

        // When reading the csv, I must format variables:
        (d: any) => {
            return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value }
        }).then(

            // Now I can use this dataset:
            function (data: any) {

                // Add X axis --> it is a date format
                const x = d3.scaleTime()
                    .domain(d3.extent(data, (d: any) => d.date) as any)
                    .range([0, width]);
                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x));

                // Add Y axis
                const y = d3.scaleLinear()
                    .domain([8000, 9200])
                    .range([height, 0]);
                svg.append("g")
                    .call(d3.axisLeft(y));

                // Add the line
                svg.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .curve(d3.curveBasis) // Just add that to have a curve instead of segments
                        .x((d: any) => x(d.date))
                        .y((d: any) => y(d.value))
                    )


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

                const txt = (d: any) => `date is ${d.date}\nvalue is ${d.value}`

                // Three function that change the tooltip when user hover / move / leave a cell
                const mouseover = function (event: any, d: any) {

                    tooltip
                        .style("opacity", 1)
                        .style("top", (event.pageY - 80) + "px")
                        .style("left", (event.pageX - 80) + "px")
                        .transition()
                        // .delay(300)
                        // .duration(400)
                        .style("visibility", "visible")
                        .text(txt(d))
                    console.log('mouseover', event, d)
                }

                const mousemove = function (event: any, d: any) {
                    tooltip
                        //.html("Exact value: " + d.value)
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

                // Add the points
                svg
                    .append("g")
                    .selectAll("dot")
                    .data(data)
                    .join("circle")
                    .attr("class", "myCircle")
                    .attr("cx", (d: any) => x(d.date))
                    .attr("cy", (d: any) => y(d.value))
                    .attr("r", 8)
                    .attr("stroke", "#69b3a2")
                    .attr("stroke-width", 3)
                    .attr("fill", "white")
                    .on("mouseover", mouseover)
                    .on("mousemove", mousemove)
                    .on("mouseleave", mouseleave)
            })


}

interface Props {
    height: number
    width: number
}

export default function SkyView(props: Props) {

    const ref = useD3((svg: any) => { skyview(svg, props.height, props.width) })

    return (
        <svg
            ref={ ref as any }
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