import React, {useEffect, useRef, useState} from "react";

import * as d3 from 'd3';
import {Card, Col, Container, Row} from "react-bootstrap";
import Chart_Pie from "../LineChart/ChartPie/ChartPie";
import axios from "axios";


export const Embedding_visualization = ({setBrushExtent, setFilteredNews, filteredNews}) => {

    const [tsneResults, setTsneResults] = useState();

    useEffect(() => {

    axios.get('http://localhost:3000/api/request/umap',{
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'application/json'
        }
    }).then(response =>{

        console.log("este é resultado do tsne")
        console.log(response.data)
        setTsneResults(response.data)


        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 900 - margin.left - margin.right,
            height = 900 - margin.top - margin.bottom;

// append the svg object to the body of the page
        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                `translate(${margin.left}, ${margin.top})`);

//Read the data
        d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv").then(function (data) {

            // Add X axis
            const x = d3.scaleLinear()
                .domain([0, 8])
                .range([0, width]);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x));

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, 9])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // Color scale: give me a specie name, I return a color
            const color = d3.scaleOrdinal()
                .domain(["setosa", "versicolor", "virginica"])
                .range(["#440154ff", "#21908dff", "#fde725ff"])


            // Highlight the specie that is hovered
            const highlight = function (event, d) {

                const selected_specie = d.Species

                d3.selectAll(".dot")
                    .transition()
                    .duration(200)
                    .style("fill", "lightgrey")
                    .attr("r", 3)

                d3.selectAll("." + selected_specie)
                    .transition()
                    .duration(200)
                    .style("fill", color(selected_specie))
                    .attr("r", 7)
            }

            // Highlight the specie that is hovered
            const doNotHighlight = function (event, d) {
                d3.selectAll(".dot")
                    .transition()
                    .duration(200)
                    .style("fill", d => color(d.Species))
                    .attr("r", 5)
            }



            // Add dots
            svg.append('g')
                .attr("class", "dots")
                .selectAll("dot")
                .data(response.data)
                .enter()
                .append("circle")
                // .attr("class", function (d) {
                //     return "dot " + d.Species
                // })
                .attr("cx", function (d) {
                    console.log("este éo d0 " + d[0])
                    return x((d[0] * 8));
                })
                .attr("cy", function (d) {
                    console.log("este éo d1 " + d[1])
                    return y((d[1] * 9));
                })
                .attr("r", 2)
                .style("fill", "red")
                .on("mouseover", highlight)
                .on("mouseleave", doNotHighlight);

            //adding an image to the group
            svg.select('.dots')
                .append("svg:image")
                .attr("xlink:href", "https://www.tv7dias.pt/wp-content/uploads/2020/10/4Z4A4233_resized.jpg")
                .attr("height", "40")
                .attr("width", "40")
                .attr("x", 642.0684216284482)
                .attr("y", 233)



        })

    })
    }, []);

    const svgRef = useRef();




    return (

        <div style={{ width: "800px", height: "300px", marginBottom: "100px"}}>

            <svg style={{marginTop: "10px"}} ref={svgRef}/>

        </div>
    );
}

    export default Embedding_visualization
