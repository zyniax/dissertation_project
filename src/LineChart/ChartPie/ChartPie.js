import React, {useEffect, useRef, useState} from "react";
import './ChartPie.css'
import {Card, Col, Row, Carousel, Container} from "react-bootstrap";

import * as d3 from 'd3';
import Line_chart from "../LineChart";


export const Chart_Pie = ({percentage}) => {


    const svgRef = useRef();


    useEffect(() => {
        console.log("percentage" + percentage)
        function calcPercent(percent) {
            return [percentage, 100-percentage];
        };




        // set the dimensions and margins of the graph
        var duration   = 500,
            transition = 200;
           var width = 70,
               height = 70,
            text_y = "5px";

            var dataset = {
                    lower: calcPercent(0),
                    upper: calcPercent(100)
                },
                radius = Math.min(width, height) / 2,
                pie = d3.pie().sort(null),
                format = d3.format(".0%");

            var arc = d3.arc()
                .innerRadius(radius - 5)
                .outerRadius(radius);

            //mudar isto
        var svg = d3.select(svgRef.current)

        //mudat isto
        svg.selectAll("*").remove();


         svg = d3.select(svgRef.current).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


            var path = svg.selectAll("path")
                .data(pie(dataset.lower))
                .enter().append("path")
                .attr("class", function(d, i) { return "color" + i })
                .attr("d", arc)
                .each(function(d) { this._current = d; }); // store the initial values

            var text = svg.append("text")
                .attr("class", "chartText")
                .attr("text-anchor", "middle")
                .attr("dy", text_y)
                .join(
                    function(update) {
                        console.log("apsdasdsdfsdcxv")
                        var progress = 0;
                        var timeout = setTimeout(function () {
                            clearTimeout(timeout);
                            path = path.data(pie(dataset.upper)); // update the data
                            path.transition().duration(duration).attrTween("d", function (a) {
                                // Store the displayed angles in _current.
                                // Then, interpolate from _current to the new angles.
                                // During the transition, _current is updated in-place by d3.interpolate.
                                var i  = d3.interpolate(this._current, a);
                                var i2 = d3.interpolate(progress, percentage)
                                this._current = i(0);
                                return function(t) {
                                    text.text( format(i2(t) / 100) );
                                    return arc(i(t));
                                };
                            }); // redraw the arcs
                        }, 200);
                    })


            if (typeof(percentage) === "string") {
                text.text(percentage);
            }




    }, [percentage])

    return (
        <div style={{marginLeft: '-20px', marginTop: '-10px'}} ref={svgRef}/>
    );


}



export default Chart_Pie;
