import {Sigma, RandomizeNodePositions, RelativeSize, SigmaEnableSVG  } from 'react-sigma';
import React, {useEffect, useRef, useState} from "react";
import "./GraphVisualization.css"
import * as d3 from 'd3';
import data from "bootstrap/js/src/dom/data";





export const Graph_visualization2 = () => {

    const svgRef = useRef();

    useEffect(() => {


        const dataset =  {
            nodes: [
                {id: 1, name: 'AGGR', label: 'Aggregation', group: 'Team C', runtime: 20},
                {id: 2, name: 'ASMT', label: 'Assessment Repository', group: 'Team A', runtime: 60},
                {id: 3, name: 'CALC', label: 'Final Calc', group: 'Team C', runtime: 30},
                {id: 4, name: 'DEMO', label: 'Demographic', group: 'Team B', runtime: 40},
                {id: 5, name: 'ELIG', label: 'Eligibility', group: 'Team B', runtime: 20},
                {id: 6, name: 'GOAL', label: 'Goal Setting', group: 'Team C', runtime: 60},
                {id: 7, name: 'GROW', label: 'Growth Model', group: 'Team C', runtime: 60},
                {id: 8, name: 'LINK', label: 'Linkage', group: 'Team A', runtime: 100},
                {id: 9, name: 'MOSL', label: 'MOSL', group: 'Team A', runtime: 80},
                {id: 10, name: 'MOTP', label: 'MOTP', group: 'Team A', runtime: 20},
                {id: 11, name: 'REPT', label: 'Reporting', group: 'Team E', runtime: 240},
                {id: 12, name: 'SEDD', label: 'State Data', group: 'Team A', runtime: 30},
                {id: 13, name: 'SNAP', label: 'Snapshot', group: 'Team A', runtime: 40}
            ],
            links: [
                {source: 1, target: 3, type: 'Next -->>'},
                {source: 6, target: 1, type: 'Next -->>'},
                {source: 7, target: 1, type: 'Next -->>'},
                {source: 9, target: 1, type: 'Next -->>'},
                {source: 2, target: 4, type: 'Next -->>'},
                {source: 2, target: 6, type: 'Next -->>'},
                {source: 2, target: 7, type: 'Next -->>'},
                {source: 2, target: 8, type: 'Next -->>'},
                {source: 2, target: 9, type: 'Next -->>'},
                {source: 10, target: 3, type: 'Next -->>'},
                {source: 3, target: 11, type: 'Next -->>'},
                {source: 8, target: 5, type: 'Go to ->>'},
                {source: 8, target: 11, type: 'Go to ->>'},
                {source: 6, target: 9, type: 'Go to ->>'},
                {source: 7, target: 9, type: 'Go to ->>'},
                {source: 8, target: 9, type: 'Go to ->>'},
                {source: 9, target: 11, type: 'Go to ->>'},
                {source: 12, target: 9, type: 'Go to ->>'},
                {source: 13, target: 11, type: 'Go to ->>'},
                {source: 13, target: 2, type: 'Go to ->>'},
                {source: 13, target: 4, type: 'This way>>'},
                {source: 13, target: 5, type: 'This way>>'},
                {source: 13, target: 8, type: 'This way>>'},
                {source: 13, target: 9, type: 'This way>>'},
                {source: 13, target: 10, type: 'This way>>'},
                {source: 4, target: 7, type: 'Next -->>'},
                {source: 4, target: 2, type: 'Next -->>'}
            ]
        };



// set the dimensions and margins of the graph
        const margin = {top: 10, right: 30, bottom: 30, left: 40},
            width = 400 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
        const svg = d3.select(svgRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                `translate(${margin.left}, ${margin.top})`);


            // Initialize the links
            const link = svg
                .selectAll("line")
                .data(dataset.links)
                .join("line")
                .style("stroke", "#aaa")

            // Initialize the nodes
            const node = svg
                .selectAll("circle")
                .data(dataset.nodes)
                .join("circle")
                .attr("r", 20)
                .style("fill", "#69b3a2")

            // Let's list the force we wanna apply on the network
            const simulation = d3.forceSimulation(dataset.nodes)                 // Force algorithm is applied to data.nodes
                .force("link", d3.forceLink()                               // This force provides links between nodes
                    .id(function(d) { return d.id; })                     // This provide  the id of a node
                    .links(dataset.links)                                    // and this the list of links
                )
                .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
                .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
                .on("end", ticked);

            // This function is run at each iteration of the force algorithm, updating the nodes position.
            function ticked() {
                link
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node
                    .attr("cx", function (d) { return d.x+6; })
                    .attr("cy", function(d) { return d.y-6; });
            }



    }, []);

    return (

        <div style={{marginTop: "10px"}} ref={svgRef}/>
    )

}
export default Graph_visualization2;
