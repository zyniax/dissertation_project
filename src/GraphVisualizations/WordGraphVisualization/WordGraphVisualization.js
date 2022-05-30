import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import { ProgressSpinner } from 'primereact/progressspinner';
import {Card, Carousel, Col} from "react-bootstrap";
import axios from "axios";

export const WordGraphVisualization = ({nodes, nodeEdges, wordsToNews, setFilteredNews, filteredNews, setLineChartFiltedredNews, initialFilteredNews, loading}) => {

    const [mouseOverNews, setMouseOverNews] = useState("")


    const svgRef = useRef();
    let firstRender = true;

    useEffect(() => {





        var width = 800;
        var height = 600;
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        if(nodes != "" && nodeEdges != "" && wordsToNews.size > 0) {

            //console.log("este são os node edges", nodeEdges)
            console.log("estes são as wordstonews", wordsToNews)
            console.log("nodeEdges, ", nodeEdges)


                var isFocus = false
                var clickedNodesWords = []
                var clickedNodesIndex = []

                var label = {
                    'nodes': [],
                    'links': []
                };

                nodes.forEach(function (d, i) {
                    label.nodes.push({node: d});
                    label.nodes.push({node: d});
                    label.links.push({
                        source: i * 2,
                        target: i * 2 + 1
                    });
                });

                var labelLayout = d3.forceSimulation(label.nodes)
                    .force("charge", d3.forceManyBody().strength(-50))
                    .force("link", d3.forceLink(label.links).distance(0).strength(2));

                var graphLayout = d3.forceSimulation(nodes)
                    .force("charge", d3.forceManyBody().strength(-3000))
                    .force("center", d3.forceCenter(width / 2, height / 2))
                    .force("x", d3.forceX(width / 2).strength(1))
                    .force("y", d3.forceY(height / 2).strength(1))
                    .force("link", d3.forceLink(nodeEdges).id(function (d) {
                        return d.id;
                    }).distance(50).strength(1))
                    .on("tick", ticked);

                var adjlist = [];

                nodeEdges.forEach(function (d) {
                    adjlist[d.source.index + "-" + d.target.index] = true;
                    adjlist[d.target.index + "-" + d.source.index] = true;

                });

                function neigh(a, b) {
                    return a == b || adjlist[a + "-" + b];
                }

                let svg = d3.select(svgRef.current)
                svg.selectAll('*').remove();

                 svg = d3.select(svgRef.current)
                    .append('svg')
                    .attr("width", width)
                    .attr("height", height)
                    .call(d3.zoom().scaleExtent([.1, 4]).on('zoom', zoomed))
                    .append('g')
                    .attr('transform', 'translate(40,0)');





                var container = svg.append("g");


                function zoomed(event) {
                    svg.attr('transform', event.transform)
                }

                // svg.call(
                //     d3.zoom()
                //         .scaleExtent([.1, 4])
                //         .on("zoom", function() { container.attr("transform", event.transform); })
                // );

                var link = container.append("g").attr("class", "links")
                    .selectAll("line")
                    .data(nodeEdges)
                    .enter()
                    .append("line")
                    .attr("stroke", "#aaa")
                    .attr("stroke-width", "1px");

                var min = d3.min(nodes, function (d) { return d.size; });
                var max = d3.max(nodes, function (d) { return d.size; });

                var scale = d3.scaleSqrt().domain([ min, max ]).range([ 3, 25 ]);


                var node = container.append("g").attr("class", "nodes")
                    .selectAll("g")
                    .data(nodes)
                    .enter()
                    .append("circle")
                    .attr("r", function (d) {
                        console.log("estes são os dnodes", nodes)
                        return scale(d.size);
                    })
                    .attr("fill", function (d) {
                        return color(8);
                    })

                node.on("mouseover", function(event,o){
                    labelNode.attr("font-weight", function(o){
                        if(o.node.id === d3.select(event.target).datum().id)
                            return 900
                    })
                })

                node.call(
                    d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended)
                );

                var labelNode = container.append("g").attr("class", "labelNodes")
                    .selectAll("text")
                    .data(label.nodes)
                    .enter()
                    .append("text")
                    .text(function (d, i) {
                        return i % 2 == 0 ? "" : d.node.id;
                    })
                    .style("fill", "#555")
                    .style("font-family", "Arial")
                    .style("font-size", 12)
                    .style("pointer-events", "none") // to prevent mouseover/drag capture





                node.on("click", function (event, d) {

                    //index do node clickado
                    if(clickedNodesWords.length == 0){

                        // var index = d3.select(event.target).datum().index;
                        var nodeWord = d3.select(event.target).datum().id
                        const newsIDs = wordsToNews.get(nodeWord)
                        const newFilteredNews = []

                        clickedNodesWords.push(nodeWord)
                        console.log("newsIDs", newsIDs)
                        console.log("filteredNewsDoWordGraph", filteredNews)

                        for(let i = 0; i < newsIDs.length; i++){
                            for(let j = 0; j < filteredNews.length; j++){
                                if(newsIDs[i] == (filteredNews[j]._id))
                                    newFilteredNews.push(filteredNews[j])
                            }
                        }

                        d3.select(this).style("fill", "red").attr('stroke-width', 4)


                        console.log("newFilteredNews", newFilteredNews)
                        focus(event, d)
                        setFilteredNews(newFilteredNews)
                        setLineChartFiltedredNews(newFilteredNews)



                        //entra no if se já tiver algum node clickado (vermelho) e o nó clickado está vermelho
                    }else if( clickedNodesWords.length > 0 && d3.select(this).style("fill") == 'red' ){

                        console.log("pre8")
                        const wordToRemove = clickedNodesWords.indexOf(d3.select(event.target).datum().id);
                        const indexToRemove = clickedNodesWords.indexOf(d3.select(event.target).datum().index);


                        // retirar do vetor o node clickado
                        if (wordToRemove > -1)
                            clickedNodesWords.splice(wordToRemove, 1);

                        if (indexToRemove > -1)
                            clickedNodesIndex.splice(indexToRemove,1)

                        d3.select(this).style("fill", "#1f76b4")


                        if(clickedNodesWords.length == 0){
                            unfocus()
                            setFilteredNews(initialFilteredNews)
                            setLineChartFiltedredNews(initialFilteredNews)
                        }
                        else{

                            if(clickedNodesWords.length == 1){
                                const selectedNode = node.filter(function(d) { return d3.select(this).style("fill") == 'red' ? d : ""})
                                console.log("nodeSe", selectedNode._groups[0][0].__data__.index)
                                console.log("nodeSe2", event)
                                focus(selectedNode._groups[0][0].__data__.index, d)

                            }


                            const filteredArray = []
                            const newFilteredNews = []

                            for(let i = 0; i < clickedNodesWords.length; i++)
                                filteredArray.push(wordsToNews.get(clickedNodesWords[i]))


                            const newsIDs = filteredArray.reduce((a, b) => a.filter(c => b.some(d => d._id == c._id)));


                            for(let i = 0; i < newsIDs.length; i++){
                                for(let j = 0; j < filteredNews.length; j++){
                                    if(newsIDs[i] == (filteredNews[j]._id))
                                        newFilteredNews.push(filteredNews[j])
                                }
                            }

                            setFilteredNews(newFilteredNews)
                            setLineChartFiltedredNews(newFilteredNews)


                        }



                    }else if( clickedNodesWords.length > 0){

                        const filteredArray = []
                        const newFilteredNews = []
                        var nodeWord = d3.select(event.target).datum().id
                        var index = d3.select(event.target).datum().index;

                        d3.select(this).style("fill", "red")


                        clickedNodesWords.push(nodeWord)
                        clickedNodesIndex.push(index)

                        for(let i = 0; i < clickedNodesWords.length; i++)
                            filteredArray.push(wordsToNews.get(clickedNodesWords[i]))

                        console.log("este é o filteredArray", filteredArray)

                        const newsIDs = filteredArray.reduce((a, b) => a.filter(c => b.includes(c)));
                        console.log("resultReduce", newsIDs)

                        for(let i = 0; i < newsIDs.length; i++){
                            for(let j = 0; j < filteredNews.length; j++){
                                if(newsIDs[i] == (filteredNews[j]._id))
                                    newFilteredNews.push(filteredNews[j])
                            }
                        }

                        setFilteredNews(newFilteredNews)
                        setLineChartFiltedredNews(newFilteredNews)

                    }
                })
            // .on("mouseout", function (event, d) {
            //     if(!isFocus)
            //         unfocus()
            // });

            function setFilteredNewsBasedOnClickedWords(event, clickedNodesWords, nodeWord){

                const filteredArray = []
                var nodeWord = d3.select(event.target).datum().id
                var index = d3.select(event.target).datum().index;

                d3.select(this).style("fill", "red")

                clickedNodesWords.push(nodeWord)
                clickedNodesIndex.push(index)

                for(let i = 0; i < clickedNodesWords.length; i++)
                    filteredArray.push(wordsToNews.get(clickedNodesWords[i]))

                const result = filteredArray.reduce((a, b) => a.filter(c => b.includes(c)))
                setFilteredNews(result)
                setLineChartFiltedredNews(result)



            }

                function ticked() {

                    node.call(updateNode);
                    link.call(updateLink);

                    labelLayout.alphaTarget(0.3).restart();
                    labelNode.each(function (d, i) {
                        if (i % 2 == 0) {
                            d.x = d.node.x;
                            d.y = d.node.y;
                        } else {
                            var b = this.getBBox();

                            var diffX = d.x - d.node.x;
                            var diffY = d.y - d.node.y;

                            var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                            var shiftX = b.width * (diffX - dist) / (dist * 2);
                            shiftX = Math.max(-b.width, Math.min(0, shiftX));
                            var shiftY = 16;
                            this.setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
                        }
                    });
                    labelNode.call(updateNode);

                }

                function fixna(x) {
                    if (isFinite(x)) return x;
                    return 0;
                }


                function focus(event, d) {

                    // o index pode ser retirado do event.target em certos casos, mas em outros o index vai ser o objeto "event", apesar do nome ser mau
                    var index

                    if(event.target != undefined)
                     index = d3.select(event.target).datum().index;
                    else
                        index = event

                    node.style("opacity", function (o) {
                        return neigh(index, o.index) ? 1 : 0.1;
                    });

                    labelNode.attr("display", function (o) {
                        return neigh(index, o.node.index) ? "block" : "none";
                    });
                    link.style("opacity", function (o) {
                        return o.source.index == index || o.target.index == index ? 1 : 0.1;
                    });
                }

                function unfocus() {
                    labelNode.attr("display", "block");
                    node.style("opacity", 1);
                    link.style("opacity", 1);
                }

                function updateLink(link) {
                    link.attr("x1", function (d) {
                        return fixna(d.source.x);
                    })
                        .attr("y1", function (d) {
                            return fixna(d.source.y);
                        })
                        .attr("x2", function (d) {
                            return fixna(d.target.x);
                        })
                        .attr("y2", function (d) {
                            return fixna(d.target.y);
                        });
                }

                function updateNode(node) {
                    node.attr("transform", function (d) {
                        return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
                    });
                }

                function dragstarted(event, d) {
                    event.sourceEvent.stopPropagation();
                    if (!event.active) graphLayout.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }

                function dragged(event, d) {
                    d.fx = event.x;
                    d.fy = event.y;
                }

                function dragended(event, d) {
                    if (!event.active) graphLayout.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }
        }
    }, [nodes, wordsToNews, loading])


    return (
        loading ? <ProgressSpinner style={{paddingTop:"50%", width: '50px', height: '50px', display: "flex", justifyContent: "center", alignItems: "center"}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/> : <div  ref={svgRef} style={{ position:'relative'}} />
    );
}

export default WordGraphVisualization
