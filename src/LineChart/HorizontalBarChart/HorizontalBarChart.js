import React, {useEffect, useRef, useState} from "react";

import * as d3 from 'd3';
import {ProgressSpinner} from "primereact/progressspinner";




export const HorizontalBarChart = ({keywords, filteredNews, setFilteredNews, setLineChartFiltedredNews, lineChartFiltedredNews, loading}) => {


    console.log("estas são as keywords")
    console.log(keywords)
    console.log(filteredNews)

    const svgRef = useRef();

    useEffect(() => {

        let map = new Map();
        const news_ids = []

        for(let i = 0; i < lineChartFiltedredNews.length; i++){


            for(let k = 0; k < lineChartFiltedredNews[i]._source.image_positions.length; k++)
                news_ids.push(lineChartFiltedredNews[i]._id + "_" + k )

            for(let j = 0; j < lineChartFiltedredNews[i]._source.keywords.length; j++){

                let newsSet = map.get(lineChartFiltedredNews[i]._source.keywords[j].value)

                if(newsSet != undefined)
                    newsSet.push(i)
                else
                    newsSet = [i]

                map.set(lineChartFiltedredNews[i]._source.keywords[j].value, newsSet)
                map[Symbol.iterator] = function* () {
                    yield* [...map.entries()].sort((a, b) => b[1].length - a[1].length);
                }
            }
        }

        const obj = Object.fromEntries(map);
        keywords = Object.entries(obj).slice(0, 10)


        // set the dimensions and margins of the graph
        const margin = {top: 40, right: 30, bottom: 40, left: 200},
            width = 570 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;



// append the svg object to the body of the page
       let svg = d3.select(svgRef.current)
        svg.selectAll('*').remove();

            svg = d3.select(svgRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        if(keywords.length > 0) {
// Parse the Data
                // Add X axis
                const x = d3.scaleLinear()
                    .domain([0, keywords[0][1].length])
                    .range([0, width]);
                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x))
                    .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-45)")
                    .style("text-anchor", "end");


                // Y axis
                const y = d3.scaleBand()
                    .range([0, height])
                    .domain(keywords.map(d => d[0])) //.domain(data.map(d => d.Country))
                    .padding(.2)
                svg.append("g")
                    .call(d3.axisLeft(y))
                // console.log(keywords.keywords[0])
                // console.log(Object.entries(keywords.keywords).map(d => d[1].length))

                //Bars
                svg.selectAll("myRect")
                    .data(keywords)
                    .join("rect")
                    .attr("x", x(0.01))
                    .attr("y", (d => y(d[0]))) //d => y(d.Country)
                    .attr("width",(d => x(d[1].length)))// d => x(d.Value)
                    .attr("height", y.bandwidth())
                    .attr("fill", "#69b3a2")
                    .on('mouseover', function (d, i) {
                        d3.select(this).transition()
                            .duration('50')
                            .attr('opacity', '.65')
                    })
                    .on('mouseout', function (d, i) {
                        d3.select(this).transition()
                            .duration('50')
                            .attr('opacity', '1')
                    })
                    .on('click', function(d, i) {

                        const filteredNewsToSet = []
                        console.log(d.target.__data__[1])
                        console.log(filteredNews)
                        for(let i = 0; i < d.target.__data__[1].length; i++){
                            //console.log(d.target.__data__[1][i])
                            filteredNewsToSet.push(filteredNews[d.target.__data__[1][i]])
                        }
                        setFilteredNews(filteredNewsToSet)
                        setLineChartFiltedredNews(filteredNewsToSet)
                    })

            svg.append("text")
                .attr("x", (width / 2))
                .attr("y", height + (margin.top))
                .attr("text-anchor", "middle")
                .attr("font-weight",function(d,i) {return 100;})
                .attr("font-family", "Saira")
                .style("font-size", "14px")
                .text("Number of news");


            console.log("isto foi chamado")


        }


    }, [keywords, lineChartFiltedredNews, loading]);



    return (

        loading ? <ProgressSpinner style={{paddingTop:"50%", width: '50px', height: '50px', display: "flex", justifyContent: "center", alignItems: "center"}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/> : <div style={{display: "flex", justifyContent: "center", alignItems: "center"}} ref={svgRef}/>
    );
}
export default HorizontalBarChart;
