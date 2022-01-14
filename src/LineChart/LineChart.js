import React, {useEffect, useRef, useState} from "react";
import Tooltip from "../Tooltip/Tooltip";
import Chart_Pie from "./ChartPie/ChartPie";
import {Card, Col, Row, Carousel, Container} from "react-bootstrap";
import HorizontalBarChart from "./HorizontalBarChart/HorizontalBarChart";

import * as d3 from 'd3';
import RelevantHeadlines from "./RelevantHeadlines/RelevantHeadlines";








export const Line_chart = ({setBrushExtent, setFilteredNews, filteredNews, brushExtent, lineChartFiltedredNews, setLineChartFiltedredNews}) => {

    console.log("este é o tamanho do filtered news" + filteredNews.length)

    const newsLength = filteredNews.length

    const [arrayLenght, getArrayLength] = useState(newsLength);
    const [stateNumberOfDatesBetweenTheStartingAndEndDate, setnumberOfDatesBetweenTheStartingAndEndDate] = useState(0);



    const svgRef = useRef();



        useEffect(() => {
            setnumberOfDatesBetweenTheStartingAndEndDate(filteredNews.length)
            let svg = d3.select(svgRef.current)
            svg.selectAll('*').remove();

            // set the dimensions and margins of the graph
            const margin = {top: 10, right: 30, bottom: 30, left: 25},
                // eslint-disable-next-line no-restricted-globals
                width = (outerWidth * 0.50) - margin.left - margin.right,
                // eslint-disable-next-line no-restricted-globals
                height = (outerHeight * 0.47) - margin.top - margin.bottom;


// append the svg object to the body of the page
             svg = d3.select(svgRef.current)
                //.attr("viewBox", [0, 0, 500, 450])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + 30 + margin.top + margin.bottom)
                .append("g")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);


//Read the data
            if(filteredNews.length > 0) {


                    var data = filteredNews

                    getArrayLength(data.length)

                    // Add X axis --> it is a date format
                    var x = d3.scaleTime()
                        .domain(d3.extent(data, function (d) {
                            return d3.timeParse("%Y-%m-%d")(d._source.pub_date.substring(0, 10))
                        }))
                        .range([0, width]);
                    const xAxis = svg.append("g")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x));

                    // Add Y axis
                    var y = d3.scaleLinear()
                        .domain([0, d3.max(data, function (d) {
                            return +d._score;
                        })])
                        .range([height, 0]);
                    const yAxis = svg.append("g")
                        .call(d3.axisLeft(y));

                    // Add a clipPath: everything out of this area won't be drawn.
                    var clip = svg.append("defs").append("svg:clipPath")
                        .attr("id", "clip")
                        .append("svg:rect")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("x", 0)
                        .attr("y", 0);

                    // Add brushing
                    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
                        .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

                    // Create the line variable: where both the line and the brush take place
                    var line = svg.append('g')
                        .attr("clip-path", "url(#clip)")

                    // Add the line
                    line.append("path")
                        .datum(data)
                        .attr("class", "line")  // I add the class line to be able to modify this line later on.
                        .attr("fill", "none")
                        .attr("stroke", "steelblue")
                        .attr("stroke-width", 1.5)
                        .attr("d", d3.line()
                            .x(function (d) {
                                return x(d.date)
                            })
                            .y(function (d) {
                                return y(d.value)
                            })
                            .curve(d3.curveMonotoneX)
                        )


                    // Add the brushing
                    line
                        .append("g")
                        .attr("class", "brush")
                        .call(brush);

                    // A function that set idleTimeOut to null
                    var idleTimeout

                    function idled() {
                        idleTimeout = null;
                    }

                    var circle = svg.selectAll("circle")
                        .data(data)
                        .enter().append("circle")
                        .style("stroke", "steelblue")
                        .style("fill", "steelblue")
                        .attr("clip-path", "url(#clip)")
                        .attr("r", 4)
                        .attr("cx", function (d) {
                            return x(d3.timeParse("%Y-%m-%d")(d._source.pub_date.substring(0, 10)))
                        })
                        .attr("cy", function (d) {
                            return y(d._score)
                        })
                        .on('mouseover', handleMouseOver)
                        .on('mouseout', function () {
                            d3.select(this)
                                .transition()
                                .duration(300)
                                .attr('stroke-width', 0)

                            svg.selectAll(".score,.date,.keywords,.headline").remove()

                            svg.append("text")
                                .attr("class", "score")
                                .attr("x", 10)
                                .attr("y", 10)
                                .attr("dy", ".35em")
                                .style("font-size", "12px")
                                .style("font-family", "Saira")
                                .html("Score ");

                            svg.append("text")
                                .attr("class", "date")
                                .attr("x", 10)
                                .attr("y", 22)
                                .attr("dy", ".35em")
                                .style("font-size", "12px")
                                .style("font-family", "Saira")
                                .html("Date: ");

                            svg.append("text")
                                .attr("class", "keywords")
                                .attr("x", 10)
                                .attr("y", 34)
                                .attr("dy", ".35em")
                                .style("font-size", "12px")
                                .style("font-family", "Saira")
                                .html("Keywords: ");

                            svg.append("text")
                                .attr("class", "headline")
                                .attr("x", 10)
                                .attr("y", 46)
                                .attr("dy", ".35em")
                                .style("font-size", "12px")
                                .style("font-family", "Saira")
                                .html("Headline: ");
                        })

                    var x2 = d3.scaleTime()
                            .domain(d3.extent(data, function (d) {
                                return d.date;
                            }))
                            .range([0, width]),
                        y2 = d3.scaleLinear()
                            .domain([0, d3.max(data, function (d) {
                                return +d.value;
                            })])
                            .range([30, 0]);


                    var xAxis2 = d3.axisBottom(x2)

                    var brush2 = d3.brushX()
                        .extent([[0, 0], [width, 30]])
                        .on("end", brushed)


                    var context = svg.append("g")
                        .attr("class", "context")
                        .attr("transform", "translate(0," + (height + 30) + ")")


                    context.append("g")
                        .attr("class", "axis axis--x")
                        .call(xAxis2);

                    context.append("g")
                        .attr("class", "brush2")
                        .call(brush2)
                        .call(brush2.move, x.range());

                    // Create a new <text> element for every data element.

                    svg.append("text")
                        .attr("class", "score")
                        .attr("x", 10)
                        .attr("y", 10)
                        .attr("dy", ".35em")
                        .style("font-size", "12px")
                        .style("font-family", "Saira")
                        .html("Score");

                    svg.append("text")
                        .attr("class", "date")
                        .attr("x", 10)
                        .attr("y", 22)
                        .attr("dy", ".35em")
                        .style("font-size", "12px")
                        .style("font-family", "Saira")
                        .html("Date: ");

                    svg.append("text")
                        .attr("class", "keywords")
                        .attr("x", 10)
                        .attr("y", 34)
                        .attr("dy", ".35em")
                        .style("font-size", "12px")
                        .style("font-family", "Saira")
                        .html("Keywords: ");

                    svg.append("text")
                        .attr("class", "headline")
                        .attr("x", 10)
                        .attr("y", 46)
                        .attr("dy", ".35em")
                        .style("font-size", "12px")
                        .style("font-family", "Saira")
                        .html("Headline: ");


                    //add the rectangle with time
                    //svg.append("rect")
                    //   .datum(data)// I add the class line to be able to modify this line later on.
                    //  .attr("fill", "none")
                    //  .attr("stroke", "steelblue")
                    //  .attr("stroke-width", 1.5)
                    //  .attr("d", d3.line()
                    //      .x(function(d) { return x2(d.date) })
                    //      .y(function(d) { return y2(d.value) })
                    //       .curve(d3.curveMonotoneX)
                    //   )
                    //   .attr("class", "zoom")
                    //   .attr("width", 370)
                    //   .attr("height", 46)

                    function brushed(event) {

                        // var s = event.selection || x2.range();
                        // x.domain(s.map(x2.invert, x2));
                        // xAxis.transition().duration(1000).call(d3.axisBottom(x))

                        line
                            .select('.line')
                            .transition()
                            .duration(1000)
                            .attr("d", d3.line()
                                .x(function (d) {
                                    return x(d.date)
                                })
                                .y(function (d) {
                                    return y(d.value)
                                })
                                .curve(d3.curveMonotoneX)
                            )

                        // isto está sketchy
                        svg.selectAll("circle")
                            .attr("opacity", "0")

                        svg.selectAll("circle")
                            .transition()
                            .delay(1000)
                            .duration(1)
                            .attr("opacity", "1")
                            .attr("cx", function (d) {
                                return x(d3.timeParse("%Y-%m-%d")(d._source.pub_date.substring(0, 10)))
                            })
                            .attr("cy", function (d) {
                                return y(d._score)
                            })
                    }


                    // A function that update the chart for given boundaries
                    function updateChart(event) {

                        // What are the selected boundaries?
                        const extent = event.selection
                        console.log("evente selecito;" + event.selection)


                        // If no selection, back to initial coordinate. Otherwise, update X axis domain
                        if (!extent) {
                            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                            x.domain([4, 8])
                        } else {
                            //var a = d3.timeDay.count(dataset1[0].publication_date, dataset1[2].publication_date);
                            //console.log(dataset1[0].publication_date < dataset1[2].publication_date)
                            //var shownNews = 0;
                            //for(var i = 0; i < dataset1.length; i++){
                            //    if(x.invert(extent[0]) < dataset1[i].publication_date)
                            ///        shownNews++;
                            //    console.log(shownNews)
                            // }
                            var date1 = "" + x.invert(extent[0]) + ""
                            var date2 = "" + x.invert(extent[1]) + ""

                            console.log("Esx 1111" + extent[0])
                            console.log("Ex 2222" + extent[1])

                            var date3 = new Date(x.invert(extent[0])).toISOString()
                            var date4 = new Date(x.invert(extent[1])).toISOString()

                            var date5 = new Date(date3.substring(0, date3.indexOf("T")))
                            var date6 = new Date(date4.substring(0, date4.indexOf("T")))

                            var numberOfDatesBetweenTheStartingAndEndDate = 0;
                            var dataset2;

                            dataset2 = data.filter(a => {
                                var date = new Date(a._source.pub_date);
                                return date >= date5 && date <= date6

                            });



                            numberOfDatesBetweenTheStartingAndEndDate = dataset2.length
                            setnumberOfDatesBetweenTheStartingAndEndDate(numberOfDatesBetweenTheStartingAndEndDate)
                            setLineChartFiltedredNews(dataset2)

                            setBrushExtent([date1.substring(0, date1.indexOf(":") - 2), date2.substring(0, date2.indexOf(":") - 2)])


                            x.domain([x.invert(extent[0]), x.invert(extent[1])])

                            console.log("este é o brushExtent" + brushExtent)

                            line.select(".brush").call(brush.move, null) // This removes the grey brush area as soon as the selection has been done
                        }


                        // Update axis and line position
                        xAxis.transition().duration(1000).call(d3.axisBottom(x))
                        line
                            .select('.line')
                            .transition()
                            .duration(1000)
                            .attr("d", d3.line()
                                .x(function (d) {
                                    return x(d.date)
                                })
                                .y(function (d) {
                                    return y(d.value)
                                })
                                .curve(d3.curveMonotoneX)
                            )

                        // isto está sketchy
                        svg.selectAll("circle")
                            .attr("opacity", "0")

                        svg.selectAll("circle")
                            .transition()
                            .delay(1000)
                            .duration(1)
                            .attr("opacity", "1")
                            .attr("cx", function (d) {
                                return x(d3.timeParse("%Y-%m-%d")(d._source.pub_date.substring(0, 10)))
                            })
                            .attr("cy", function (d) {
                                return y(d._score)
                            })

                        //d3.select(".brush2").call(brush2.move, [0,50] ,[100, 95]); ver isto depois
                    }


                    // If user double click, reinitialize the chart
                    svg.on("dblclick", function () {
                        x.domain(d3.extent(data, function (d) {
                            return d3.timeParse("%Y-%m-%d")(d._source.pub_date.substring(0, 10));
                        }))
                        xAxis.transition().call(d3.axisBottom(x))
                        line
                            .select('.line')
                            .transition()
                            .attr("d", d3.line()
                                .x(function (d) {
                                    return x(d.date)
                                })
                                .y(function (d) {
                                    return y(d.value)
                                })
                                .curve(d3.curveMonotoneX)
                            )

                        svg.selectAll("circle")
                            .transition()
                            .delay(500)
                            .duration(500)
                            .attr("opacity", "1")
                            .attr("cx", function (d) {
                                return x(d3.timeParse("%Y-%m-%d")(d._source.pub_date.substring(0, 10)))
                            })
                            .attr("cy", function (d) {
                                return y(d._score)
                            })

                        setnumberOfDatesBetweenTheStartingAndEndDate(filteredNews.length);
                    });


            //tooltip
            // const tooltip = d3.select('body').append('div')
            //     .style('position', 'absolute')
            //     .style('background', '#f4f4f4')
            //     .style('padding', '5 15px')
            //     .style('border', '1px #333 solid')
            //     .style('border-radius', '5px')
            //     .style('opacity', '0')
            //
            // const tooltip2 = d3.select('body').append("div")


            function handleMouseOver(event, d, i) {  // Add interactivity


                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr('stroke-width', 7)

                //tooltip.transition()
                //.style('opacity', 1)


                svg.select(".score")
                    .attr("x", 10)
                    .attr("y", 10)
                    .attr("dy", ".35em")
                    .text("Score " + d._score)

                svg.select(".date")
                    .attr("x", 10)
                    .attr("y", 22)
                    .attr("dy", ".35em")
                    .text("Date: " + d._source.pub_date.substring(0, 10))

                svg.select(".keywords")
                    .attr("x", 10)
                    .attr("y", 34)
                    .attr("dy", ".35em")
                    .text("Keywords: " + d._source.keywords.map(keyword => (" " + keyword.value)))

                svg.select(".headline")
                    .attr("x", 10)
                    .attr("y", 46)
                    .attr("dy", ".35em")
                    .text("Headline: " + d._source.headline.main);

                // tooltip.html("<p><b>Number of headlines</b>: " + 126 + "</p> <p><b>Data</b>: " + d.publication_date + "</p>" +
                //     "<p> Keywords: " +d.Keywords + " </p><p>Topics: Football, Atletism, Sports</p>")
                //     .style('left', (event.pageX) + 'px')
                //     .style('top', (event.pageY+ 'px'));


                // Specify where to put label of text
            }
        }
        }, [filteredNews]);



    return (

        <div id='linechart'>
            <Container >
                <Row style={{width: "100%"}}>
                    <Col >
                        <Card style={{ width: '90%', boxShadow: "0 2px 0 rgba(90, 97, 105, 0.11), 0 4px 8px rgba(90, 97, 105, 0.12), 0 10px 10px rgba(90, 97, 105, 0.06), 0 7px 70px rgba(90, 97, 105, 0.1)", marginTop:"5%" }}>
                            <Card.Body style={{height:'120px'}}>
                                <Card.Title  style={{fontFamily: 'sans-serif', fontSize: '16px', fontWeight: 'bold' }}> Considered News</Card.Title>
                                <ul style={{display: 'flex'}}>
                                    <il>
                                        <Chart_Pie percentage={(stateNumberOfDatesBetweenTheStartingAndEndDate/arrayLenght)*100}/>
                                    </il>
                                    <il  >

                                        <span style={{fontSize: '24px', marginLeft: '80px', fontWeight: '350', color:'#1072b8'}}>{arrayLenght}</span>
                                    </il>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col >
                        <Card style={{ width: '90%', boxShadow: "0 2px 0 rgba(90, 97, 105, 0.11), 0 4px 8px rgba(90, 97, 105, 0.12), 0 10px 10px rgba(90, 97, 105, 0.06), 0 7px 70px rgba(90, 97, 105, 0.1)", marginTop:"5%"  }}>
                        <Card.Body style={{height:'120px'}}>
                            <Card.Title style={{fontFamily: 'sans-serif', fontSize: '16px', fontWeight: 'bold' }}>Shown News</Card.Title>
                            <ul>
                              <il>

                              </il>
                                <il>
                                    <span style={{fontSize: '24px', fontWeight: '350', color:'#7ace4c'}}>{stateNumberOfDatesBetweenTheStartingAndEndDate}</span>
                                </il>
                            </ul>
                        </Card.Body>
                    </Card>
                    </Col>

                    <Col >
                        <Card style={{ width: '90%', boxShadow: "0 2px 0 rgba(90, 97, 105, 0.11), 0 4px 8px rgba(90, 97, 105, 0.12), 0 10px 10px rgba(90, 97, 105, 0.06), 0 7px 70px rgba(90, 97, 105, 0.1)", marginTop:"5%"  }}>
                            <Card.Body style={{height:'120px'}}>
                                <Card.Title style={{fontFamily: 'sans-serif', fontSize: '16px', fontWeight: 'bold' }}>Relevant Timeline</Card.Title>
                                <ul>
                                    <il>

                                    </il>
                                    <il>
                                        <span style={{fontSize: '16px', fontWeight: '350', color:'#6857da'}}>{brushExtent}</span>
                                    </il>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </Container>

            <div style={{display:"flex"}}>
                <svg style={{marginTop: "1.8%"}} ref={svgRef}/>

            </div>

        </div>
    );
}
export default Line_chart;
