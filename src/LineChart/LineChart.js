import React, {useEffect, useRef, useState} from "react";
import Tooltip from "../Tooltip/Tooltip";
import Chart_Pie from "./ChartPie/ChartPie";
import {Card, Col, Row, Carousel, Container} from "react-bootstrap";
import { ProgressSpinner } from 'primereact/progressspinner';

import * as d3 from 'd3';
import axios from "axios";







export const Line_chart = ({setBrushExtent, filteredNews, brushExtent, setLineChartFiltedredNews, loading, pastResultSearchNews, setPastResultSearchNews, setKeywords, setThreeDImageData, setFilteredNews, setSearchTermHistory}) => {

    console.log("este é o tamanho do filtered news" + filteredNews.length)

    const newsLength = filteredNews.length

    const [arrayLenght, getArrayLength] = useState(newsLength);
    const [stateNumberOfDatesBetweenTheStartingAndEndDate, setnumberOfDatesBetweenTheStartingAndEndDate] = useState(0);

    const handleMultiModalMouseClickRequest = (news, imageIndex) => {



        const news_id = news._id + "_" + news._source.parsed_section[imageIndex].order

        //https://dissertationserver.herokuapp.com/
        axios.get('http://localhost:3000/api/request/similarNews/byText/' + news_id ,{
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'application/json'
            }
        }).then(response =>{


            setKeywords(response.data.keywords)
            setThreeDImageData(response.data)
            setFilteredNews(response.data.searchWordResult.body.hits.hits)
            setLineChartFiltedredNews(response.data.searchWordResult.body.hits.hits)
            pastResultSearchNews.push(response.data.searchWordResult.body.hits.hits)
            setPastResultSearchNews(pastResultSearchNews)

        })
    }

    const handleVisualMouseClickRequest = (news, imageIndex) => {

        console.log("yelele", news)
        console.log("!!", imageIndex)
        const news_id = news._id + "_" + news._source.parsed_section[imageIndex].order

        console.log("!!!", news_id)

        //https://dissertationserver.herokuapp.com
        axios.get('http://localhost:3000/api/request/similarNews/byImage/' + news_id ,{
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'application/json'
            }
        }).then(response =>{


            setKeywords(response.data.keywords)
            setThreeDImageData(response.data)
            setFilteredNews(response.data.searchWordResult.body.hits.hits)
            setLineChartFiltedredNews(response.data.searchWordResult.body.hits.hits)
            pastResultSearchNews.push(response.data.searchWordResult.body.hits.hits)
            setPastResultSearchNews(pastResultSearchNews)

        })
    }





    const svgRef = useRef();



        useEffect(() => {

            setnumberOfDatesBetweenTheStartingAndEndDate(filteredNews.length)
            let svg = d3.select(svgRef.current)
            svg.selectAll('*').remove();

            // set the dimensions and margins of the graph
            const margin = {top: 10, right: 30, bottom: 30, left: 45},
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

                var pastBrushedData = {
                    data: null,
                    domain0: null,
                    domain1: null
                }



                    var data = filteredNews

                    getArrayLength(data.length)

                    // Add X axis --> it is a date format
                    var x = d3.scaleTime()
                        .domain(d3.extent(data, function (d) {
                            return d3.timeParse("%Y-%m-%d")(d._source.pub_date.substring(0, 10))
                        }))
                        .range([3, width * 0.995]);
                    const xAxis = svg.append("g")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x));


                let isTooltipClicked = false
                pastBrushedData.data = data
                pastBrushedData.domain0 = x.domain()[0]
                pastBrushedData.domain1 = x.domain()[1]
                var brushedData = pastBrushedData

                var pastBrushedArray = [brushedData]

                    // Add Y axis
                    var y = d3.scaleLinear()
                        .domain([d3.min(data, function (d) {
                            return (d._score * 0.97);
                        })
                            , d3.max(data, function (d) {
                            return (+d._score * 1.02);
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
                        }).on('click', handleMouseClick)
                        .on('mouseover', handleMouseOver)
                        .on('mouseout', function () {

                            d3.select(this)
                                .transition()
                                .duration(300)
                                .attr('stroke-width', 0)

                            svg.selectAll(".score,.date,.keywords,.headline").remove()

                            const informationWidth = (width * 0.01)
                            const informationHeight = (height * 0.02)

                            svg.append("text")
                                .attr("class", "score")
                                .attr("x", informationWidth)
                                .attr("y", informationHeight)
                                .attr("dy", ".35em")
                                .style("font-size", "12px")
                                .style("font-family", "Saira")
                                .html("Score ");

                            svg.append("text")
                                .attr("class", "date")
                                .attr("x", informationWidth)
                                .attr("y", informationHeight * 2.4)
                                .attr("dy", ".35em")
                                .style("font-size", "12px")
                                .style("font-family", "Saira")
                                .html("Date: ");

                            svg.append("text")
                                .attr("class", "keywords")
                                .attr("x", informationWidth)
                                .attr("y", informationHeight * 3.8)
                                .attr("dy", ".35em")
                                .style("font-size", "12px")
                                .style("font-family", "Saira")
                                .html("Keywords: ");

                            svg.append("text")
                                .attr("class", "headline")
                                .attr("x", informationWidth)
                                .attr("y", informationHeight * 5.2)
                                .attr("dy", ".35em")
                                .style("font-size", "12px")
                                .style("font-family", "Saira")
                                .html("Headline: ");


                            if(!isTooltipClicked){

                                tooltip.style("opacity", 0)
                                tooltip.style("left", "0px")
                                tooltip.style("top", "0px")
                                tooltip.html("o")
                            }



                            //setMouseOverNews("")
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

                const informationWidth = (width * 0.01)
                const informationHeight = (height * 0.02)

                    svg.append("text")
                        .attr("class", "score")
                        .attr("x", informationWidth)
                        .attr("y", informationHeight)
                        .attr("dy", ".35em")
                        .style("font-size", "12px")
                        .style("font-family", "Saira")
                        .html("Score");

                    svg.append("text")
                        .attr("class", "date")
                        .attr("x", informationWidth)
                        .attr("y", informationHeight * 2.4)
                        .attr("dy", ".35em")
                        .style("font-size", "12px")
                        .style("font-family", "Saira")
                        .html("Date: ");

                    svg.append("text")
                        .attr("class", "keywords")
                        .attr("x", informationWidth)
                        .attr("y", informationHeight * 3.8)
                        .attr("dy", ".35em")
                        .style("font-size", "12px")
                        .style("font-family", "Saira")
                        .html("Keywords: ");

                    svg.append("text")
                        .attr("class", "headline")
                        .attr("x", informationWidth)
                        .attr("y", informationHeight * 5.4)
                        .attr("dy", ".35em")
                        .style("font-size", "12px")
                        .style("font-family", "Saira")
                        .html("Headline: ");

                svg.append("text")
                    .attr("class", "dblClick")
                    .attr("x", width * 0.87)
                    .attr("y", height * 0.98)
                    .attr("dy", ".35em")
                    .style("font-size", "12px")
                    .style("font-family", "Saira")
                    .html("Double click to go back ");


                    function brushed(event) {


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

                            var date1 = "" + x.invert(extent[0]) + ""
                            var date2 = "" + x.invert(extent[1]) + ""

                            var pastBrushedData = {
                                data: null,
                                domain0: null,
                                domain1: null
                            }

                            pastBrushedData.domain0 = x.domain()[0]
                            pastBrushedData.domain1 = x.domain()[1]
                            pastBrushedData.data = data

                            var brushedData = pastBrushedData

                            console.log("Esx 1111" + date1)
                            console.log("Ex 2222" + date2)
                            console.log("esx", x(extent[0]))
                            console.log("exc", x(extent[1]))

                            var date3 = new Date(x.invert(extent[0])).toISOString()
                            var date4 = new Date(x.invert(extent[1])).toISOString()

                            var date5 = new Date(date3.substring(0, date3.indexOf("T")))
                            var date6 = new Date(date4.substring(0, date4.indexOf("T")))

                            var numberOfDatesBetweenTheStartingAndEndDate = 0;
                            pastBrushedArray.push(brushedData)
                            console.log("estas são as datas", pastBrushedArray)

                            data = data.filter(a => {
                                var date = new Date(a._source.pub_date);
                                return date >= date5 && date <= date6

                            });



                            numberOfDatesBetweenTheStartingAndEndDate = data.length
                            setnumberOfDatesBetweenTheStartingAndEndDate(numberOfDatesBetweenTheStartingAndEndDate)
                            setLineChartFiltedredNews(data)


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

                        let domain0;
                        let domain1;

                        if(pastBrushedArray.length > 1){
                            var pastBrush = pastBrushedArray.pop()
                            data = pastBrush.data
                             domain0 = pastBrush.domain0
                             domain1 = pastBrush.domain1
                        }

                        else{
                            var pastBrush = pastBrushedArray[0]
                            data = pastBrush.data
                            domain0 = pastBrush.domain0
                            domain1 = pastBrush.domain1
                        }

                        x.domain([domain0, domain1])


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

                        setnumberOfDatesBetweenTheStartingAndEndDate(data.length);
                        setLineChartFiltedredNews(data)
                    });


            //tooltip
            const tooltip = d3.select('body').append('div')
                .attr("class", "tooltip")
                .style('position', 'absolute')
                .style('background', '#f4f4f4')
                .style('padding', '5 15px')
                .style('border', '1px #333 solid')
                .style('border-radius', '5px')
                .style('opacity', '1')



             const tooltip2 = d3.select('body').append("div")

                function handleMouseClick(event, d){

                    isTooltipClicked = !isTooltipClicked


                    //buscar o lugar da imagem nos dados
                    let imageIndex = 0
                    if(d._source.image_positions.length > 0)
                        imageIndex = d._source.image_positions[0]

                    tooltip.style("opacity", 1)
                    tooltip.html( `<div class="card border-success"
                    style="width: 220px; z-index: 10; position: absolute;"><div class="carousel slide"
                    style="border-radius: 50%;"><div class="carousel-indicators"><button type="button" data-bs-target="" aria-label="Slide 1" class="active" aria-current="true"></button></div><div class="carousel-inner"><div class="active carousel-item" style="width: 100%;"><img class="d-block w-100" src="https://large.novasearch.org/nytimes/images/${d._source.parsed_section[imageIndex].hash }.jpg"  alt="First slide" style="width: 100%; height: 100px; object-fit: cover; overflow: hidden;"></div></div><a class="carousel-control-prev" role="button" href="#"><span class="visually-hidden">Previous</span></a><a class="carousel-control-next" role="button" href="#"><span class="visually-hidden">none</span></a></div><div class="card-body"><div class="card-title h5" style="font-size: .95em;"> ${d._source.headline.main} </div><div class="mb-2 text-muted card-subtitle h6" style="font-size: 0.75em;">${d._source.pub_date.substring(0, 10)}</div><p class="card-text" style="font-family: unset; font-size: 0.70em;">${d._source.snippet}</p>
                 <button id="multiModalButton" class="p-button p-component p-button-rounded p-button-secondary p-button-text p-button-icon-only"><span class="p-button-icon p-c pi pi-bookmark"></span><svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1.1" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 20px;"><path d="M14 4v-2h-14v11c0 0.552 0.448 1 1 1h13.5c0.828 0 1.5-0.672 1.5-1.5v-8.5h-2zM13 13h-12v-10h12v10zM2 5h10v1h-10zM8 7h4v1h-4zM8 9h4v1h-4zM8 11h3v1h-3zM2 7h5v5h-5z"></path></svg></button>
                <button id="imageButton" class="p-button p-component p-button-rounded p-button-secondary p-button-text p-button-icon-only"><span class="p-button-icon p-c pi pi-bookmark"></span><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 17px;"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"></path></svg></button>
                 <a class="card-link" variant="primary" href="${d._source.web_url}" style="font-family: arial; font-size: 0.75em; float: right; margin-top: 3%;">See more</a></div></div>`)
                        .style('left', (event.pageX * 1.02) + 'px')
                        .style('top', (event.pageY * 1.02 + 'px'))


                    document.getElementById("imageButton").addEventListener("click", () => {handleVisualMouseClickRequest(d, imageIndex); setSearchTermHistory(searchTermHistory => [...searchTermHistory, d._source.headline.main + " (image)"])})
                    document.getElementById("multiModalButton").addEventListener("click", () => {handleMultiModalMouseClickRequest(d, imageIndex); setSearchTermHistory(searchTermHistory => [...searchTermHistory, d._source.headline.main + " (multiModal)"])})
                }



            function handleMouseOver(event, d, i) {  // Add interactivity


                const informationWidth = (width * 0.01)
                const informationHeight = (height * 0.02)


                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr('stroke-width', 7)

                svg.select(".score")
                    .attr("x", informationWidth)
                    .attr("y", informationHeight)
                    .attr("dy", ".35em")
                    .text("Score " + d._score)

                svg.select(".date")
                    .attr("x", informationWidth)
                    .attr("y", informationHeight * 2.4)
                    .attr("dy", ".35em")
                    .text("Date: " + d._source.pub_date.substring(0, 10))

                svg.select(".keywords")
                    .attr("x", informationWidth)
                    .attr("y", informationHeight * 3.8)
                    .attr("dy", ".35em")
                    .text("Keywords: " + d._source.keywords.map(keyword => (" " + keyword.value)))

                svg.select(".headline")
                    .attr("x", informationWidth)
                    .attr("y", informationHeight * 5.2)
                    .attr("dy", ".35em")
                    .text("Headline: " + d._source.headline.main);



                isTooltipClicked = false

                //buscar o lugar da imagem nos dados
                let imageIndex = 0
                if(d._source.image_positions.length > 0)
                    imageIndex = d._source.image_positions[0]

                tooltip.style("opacity", 1)
                tooltip.html( `<div class="card border-success"
                    style="width: 220px; z-index: 10; position: absolute;"><div class="carousel slide"
                    style="border-radius: 50%;"><div class="carousel-indicators"><button type="button" data-bs-target="" aria-label="Slide 1" class="active" aria-current="true"></button></div><div class="carousel-inner"><div class="active carousel-item" style="width: 100%;"><img class="d-block w-100" src="https://large.novasearch.org/nytimes/images/${d._source.parsed_section[imageIndex].hash }.jpg"  alt="First slide" style="width: 100%; height: 100px; object-fit: cover; overflow: hidden;"></div></div><a class="carousel-control-prev" role="button" href="#"><span class="visually-hidden">Previous</span></a><a class="carousel-control-next" role="button" href="#"><span class="visually-hidden">none</span></a></div><div class="card-body"><div class="card-title h5" style="font-size: .95em;"> ${d._source.headline.main} </div><div class="mb-2 text-muted card-subtitle h6" style="font-size: 0.75em;">${d._source.pub_date.substring(0, 10)}</div><p class="card-text" style="font-family: unset; font-size: 0.70em;">${d._source.snippet}</p>
                 <button class="p-button p-component p-button-rounded p-button-secondary p-button-text p-button-icon-only"><span class="p-button-icon p-c pi pi-bookmark"></span><svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1.1" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 20px;"><path d="M14 4v-2h-14v11c0 0.552 0.448 1 1 1h13.5c0.828 0 1.5-0.672 1.5-1.5v-8.5h-2zM13 13h-12v-10h12v10zM2 5h10v1h-10zM8 7h4v1h-4zM8 9h4v1h-4zM8 11h3v1h-3zM2 7h5v5h-5z"></path></svg></button>
                 <button class="p-button p-component p-button-rounded p-button-secondary p-button-text p-button-icon-only"><span class="p-button-icon p-c pi pi-bookmark"></span><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 17px;"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"></path></svg></button>
                 <a class="card-link" variant="primary" href="${d._source.web_url}" style="font-family: arial; font-size: 0.75em; float: right; margin-top: 3%;">See more</a></div></div>`)
                    .style('left', (event.pageX * 1.02) + 'px')
                    .style('top', (event.pageY * 1.02 + 'px'))




                // Specify where to put label of text
            }
        }
        }, [filteredNews, loading]);



    return (

        loading ? <ProgressSpinner style={{paddingTop:"50%" ,width: '50px', height: '50px', display: "flex", justifyContent: "center", alignItems: "center"}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/> : <div id='linechart'>
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
