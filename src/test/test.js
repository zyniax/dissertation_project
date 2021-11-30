import React, {useEffect, useRef} from "react";
import * as d3 from "d3";
import "./test.css"
import {Card, Carousel} from "react-bootstrap";

export const Test = ({setBrushExtent}) => {


    const svgRef = useRef();

    useEffect(() => {

        const data = {
            "name": "flare",
            "children": [
                {
                    "name": "animate",
                    "children": [
                        {"name": "Easing", "size": 17010},
                        {"name": "FunctionSequence", "size": 5842},
                        {
                            "name": "interpolate",
                            "children": [
                                {"name": "ArrayInterpolator", "size": 1983},
                                {"name": "ColorInterpolator", "size": 2047},
                                {"name": "DateInterpolator", "size": 1375},
                                {"name": "Interpolator", "size": 8746},
                                {"name": "MatrixInterpolator", "size": 2202},
                                {"name": "NumberInterpolator", "size": 1382},
                                {"name": "ObjectInterpolator", "size": 1629},
                                {"name": "PointInterpolator", "size": 1675},
                                {"name": "RectangleInterpolator", "size": 2042}
                            ]
                        },
                        {"name": "ISchedulable", "size": 1041},
                        {"name": "Parallel", "size": 5176},
                        {"name": "Pause", "size": 449},
                        {"name": "Scheduler", "size": 5593},
                        {"name": "Sequence", "size": 5534},
                        {"name": "Transition", "size": 9201},
                        {"name": "Transitioner", "size": 19975},
                        {"name": "TransitionEvent", "size": 1116},
                        {"name": "Tween", "size": 6006}
                    ]
                },
                {
                    "name": "physics",
                    "children": [
                        {"name": "DragForce", "size": 1082},
                        {"name": "GravityForce", "size": 1336},
                        {"name": "IForce", "size": 319},
                        {"name": "NBodyForce", "size": 10498},
                        {"name": "Particle", "size": 2822},
                        {"name": "Simulation", "size": 9983},
                        {"name": "Spring", "size": 2213},
                        {"name": "SpringForce", "size": 1681}
                    ]
                },
                {
                    "name": "query",
                    "children": [
                        {"name": "AggregateExpression", "size": 1616},
                        {"name": "And", "size": 1027},
                        {"name": "Arithmetic", "size": 3891},
                        {"name": "Average", "size": 891},
                        {"name": "BinaryExpression", "size": 2893},
                        {"name": "Comparison", "size": 5103},
                        {"name": "CompositeExpression", "size": 3677},
                        {"name": "Count", "size": 781},
                        {"name": "DateUtil", "size": 4141},
                        {"name": "Distinct", "size": 933},
                        {"name": "Expression", "size": 5130},
                        {"name": "ExpressionIterator", "size": 3617},
                        {
                            "name": "methods",
                            "children": [
                                {"name": "add", "size": 593},
                                {"name": "and", "size": 330},
                                {"name": "average", "size": 287},
                                {"name": "count", "size": 277},
                                {"name": "distinct", "size": 292},
                                {"name": "div", "size": 595},
                                {"name": "eq", "size": 594},
                                {"name": "fn", "size": 460},
                                {"name": "gt", "size": 603},
                                {"name": "gte", "size": 625},
                                {"name": "iff", "size": 748},
                                {"name": "isa", "size": 461},
                                {"name": "lt", "size": 597},
                                {"name": "lte", "size": 619},
                                {"name": "max", "size": 283},
                                {"name": "min", "size": 283},
                                {"name": "mod", "size": 591},
                                {"name": "mul", "size": 603},
                                {"name": "neq", "size": 599},
                                {"name": "not", "size": 386},
                                {"name": "or", "size": 323},
                                {"name": "orderby", "size": 307},
                                {"name": "range", "size": 772},
                                {"name": "select", "size": 296},
                                {"name": "stddev", "size": 363},
                                {"name": "sub", "size": 600},
                                {"name": "sum", "size": 280},
                                {"name": "update", "size": 307},
                                {"name": "variance", "size": 335},
                                {"name": "where", "size": 299},
                                {"name": "xor", "size": 354},
                                {"name": "_", "size": 264}
                            ]
                        },
                        {"name": "Minimum", "size": 843},
                        {"name": "Not", "size": 1554},
                        {"name": "Or", "size": 970},
                        {"name": "Query", "size": 13896},
                        {"name": "Range", "size": 1594},
                        {"name": "StringUtil", "size": 4130},
                        {"name": "Sum", "size": 791},
                        {"name": "Variable", "size": 1124},
                        {"name": "Variance", "size": 1876},
                        {"name": "Xor", "size": 1101}
                    ]
                },
                {
                    "name": "scale",
                    "children": [
                        {"name": "IScaleMap", "size": 2105},
                        {"name": "LinearScale", "size": 1316},
                        {"name": "LogScale", "size": 3151},
                        {"name": "OrdinalScale", "size": 3770},
                        {"name": "QuantileScale", "size": 2435},
                        {"name": "QuantitativeScale", "size": 4839},
                        {"name": "RootScale", "size": 1756},
                        {"name": "Scale", "size": 4268},
                        {"name": "ScaleType", "size": 1821},
                        {"name": "TimeScale", "size": 5833}
                    ]
                },
                {
                    "name": "vis",
                    "children": [
                        {
                            "name": "axis",
                            "children": [
                                {"name": "Axes", "size": 1302},
                                {"name": "Axis", "size": 24593},
                                {"name": "AxisGridLine", "size": 652},
                                {"name": "AxisLabel", "size": 636},
                                {"name": "CartesianAxes", "size": 6703}
                            ]
                        },
                        {
                            "name": "controls",
                            "children": [
                                {"name": "AnchorControl", "size": 2138},
                                {"name": "ClickControl", "size": 3824},
                                {"name": "Control", "size": 1353},
                                {"name": "ControlList", "size": 4665},
                                {"name": "DragControl", "size": 2649},
                                {"name": "ExpandControl", "size": 2832},
                                {"name": "HoverControl", "size": 4896},
                                {"name": "IControl", "size": 763},
                                {"name": "PanZoomControl", "size": 5222},
                                {"name": "SelectionControl", "size": 7862},
                                {"name": "TooltipControl", "size": 8435}
                            ]
                        },
                        {
                            "name": "data",
                            "children": [
                                {"name": "Data", "size": 20544},
                                {"name": "DataList", "size": 19788},
                                {"name": "DataSprite", "size": 10349},
                                {"name": "EdgeSprite", "size": 3301},
                                {"name": "NodeSprite", "size": 19382},
                                {
                                    "name": "render",
                                    "children": [
                                        {"name": "ArrowType", "size": 698},
                                        {"name": "EdgeRenderer", "size": 5569},
                                        {"name": "IRenderer", "size": 353},
                                        {"name": "ShapeRenderer", "size": 2247}
                                    ]
                                },
                                {"name": "ScaleBinding", "size": 11275},
                                {"name": "Tree", "size": 7147},
                                {"name": "TreeBuilder", "size": 9930}
                            ]
                        },
                        {
                            "name": "events",
                            "children": [
                                {"name": "DataEvent", "size": 2313},
                                {"name": "SelectionEvent", "size": 1880},
                                {"name": "TooltipEvent", "size": 1701},
                                {"name": "VisualizationEvent", "size": 1117}
                            ]
                        },
                        {
                            "name": "legend",
                            "children": [
                                {"name": "Legend", "size": 20859},
                                {"name": "LegendItem", "size": 4614},
                                {"name": "LegendRange", "size": 10530}
                            ]
                        },
                        {
                            "name": "operator",
                            "children": [
                                {
                                    "name": "distortion",
                                    "children": [
                                        {"name": "BifocalDistortion", "size": 4461},
                                        {"name": "Distortion", "size": 6314},
                                        {"name": "FisheyeDistortion", "size": 3444}
                                    ]
                                },
                                {
                                    "name": "encoder",
                                    "children": [
                                        {"name": "ColorEncoder", "size": 3179},
                                        {"name": "Encoder", "size": 4060},
                                        {"name": "PropertyEncoder", "size": 4138},
                                        {"name": "ShapeEncoder", "size": 1690},
                                        {"name": "SizeEncoder", "size": 1830}
                                    ]
                                },
                                {
                                    "name": "filter",
                                    "children": [
                                        {"name": "FisheyeTreeFilter", "size": 5219},
                                        {"name": "GraphDistanceFilter", "size": 3165},
                                        {"name": "VisibilityFilter", "size": 3509}
                                    ]
                                },
                                {"name": "IOperator", "size": 1286},
                                {
                                    "name": "label",
                                    "children": [
                                        {"name": "Labeler", "size": 9956},
                                        {"name": "RadialLabeler", "size": 3899},
                                        {"name": "StackedAreaLabeler", "size": 3202}
                                    ]
                                },
                                {
                                    "name": "layout",
                                    "children": [
                                        {"name": "AxisLayout", "size": 6725},
                                        {"name": "BundledEdgeRouter", "size": 3727},
                                        {"name": "CircleLayout", "size": 9317},
                                        {"name": "CirclePackingLayout", "size": 12003},
                                        {"name": "DendrogramLayout", "size": 4853},
                                        {"name": "ForceDirectedLayout", "size": 8411},
                                        {"name": "IcicleTreeLayout", "size": 4864},
                                        {"name": "IndentedTreeLayout", "size": 3174},
                                        {"name": "Layout", "size": 7881},
                                        {"name": "NodeLinkTreeLayout", "size": 12870},
                                        {"name": "PieLayout", "size": 2728},
                                        {"name": "RadialTreeLayout", "size": 12348},
                                        {"name": "RandomLayout", "size": 870},
                                        {"name": "StackedAreaLayout", "size": 9121},
                                        {"name": "TreeMapLayout", "size": 9191}
                                    ]
                                },
                                {"name": "Operator", "size": 2490},
                                {"name": "OperatorList", "size": 5248},
                                {"name": "OperatorSequence", "size": 4190},
                                {"name": "OperatorSwitch", "size": 2581},
                                {"name": "SortOperator", "size": 2023}
                            ]
                        },
                        {"name": "Visualization", "size": 16540}
                    ]
                }
            ]
        }








        const width = 910,
            height = 800;

        let i = 0;

        const root = d3.hierarchy(data);
        const transform = d3.zoomIdentity;
        let node, link, edgepaths;



        const svg = d3.select(svgRef.current).append('svg')
            .attr("width", width )
            .attr("height", height)
            .call(d3.zoom().scaleExtent([1/2, 8]).on('zoom', zoomed))
            .append('g')
            .attr('transform', 'translate(40,0)');

        // ver isto melhor, pode ser que dê problema mais para a frente
        svg.append('defs').append('marker')
            .attr("id",'arrowhead')
            .attr('viewBox','-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
            .attr('refX',23) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
            .attr('refY',0)
            .attr('orient','auto')
            .attr('markerWidth',13)
            .attr('markerHeight',13)
            .attr('xoverflow','visible')
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', 'red')
            .style('stroke','none');



        // const simulation = d3.forceSimulation()
        //     .force('link', d3.forceLink().id(function(d) { return d.id; }))
        //     .force('charge', d3.forceManyBody().strength(-3500).distanceMax(200))
        //     .force('center', d3.forceCenter( width/2, height/4 ))
        //     .on('tick', ticked)

        const simulation = d3
            .forceSimulation()
            // Allocate coordinates for the vertices
            //.nodes(data.vertexes)
            // Link
            .force('link', d3.forceLink())
            // For setting the center of gravity of the system
            .force('center', d3.forceCenter(width / 2, height / 2))
            // The gravity
            .force('charge', d3.forceManyBody().strength(-200))
            // The collision force, for preventing the vertices from overlapping
            .force('collide',d3.forceCollide().radius(60).iterations(2))
            .on('tick', ticked)



        function update() {
            const nodes = flatten(root)
            const links = root.links()

            link = svg
                .selectAll('.link')
                .data(links, function(d){ return d.target.id })

            link.exit().remove()

            const linkEnter = link
                .enter()
                .append('line')
                .attr('class', 'link')
                .style('stroke', '#aaa' )
                .attr('marker-end','url(#arrowhead)')

             edgepaths = svg.selectAll(".edgepath") //make path go along with the link provide position for link labels
                .data(links, function(d){ return d.target.id })
                .enter()
                .append('path')
                .attr('class', 'edgepath')
                .attr('fill-opacity', 0)
                .attr('stroke-opacity', 0)
                .attr('id', function (d, i) {return 'edgepath' + i})
                .style("pointer-events", "none");

            const edgelabels = svg.selectAll(".edgelabel")
                .data(links, function(d){ return d.target.id })
                .enter()
                .append('text')
                .style("pointer-events", "none")
                .attr('class', 'edgelabel')
                .attr('id', function (d, i) {return 'edgelabel' + i})
                .attr('font-size', 14)
                .attr('fill', '#aaa');

            edgelabels.append('textPath') //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
                .attr('xlink:href', function (d, i) {return '#edgepath' + i})
                .style("text-anchor", "middle")
                .style("pointer-events", "none")
                .attr("startOffset", "50%")
                .attr("x", 10)
                .attr("y", 10)
                .text("d => d.type");


            link = linkEnter.merge(link)

            node = svg
                .selectAll('.node')
                .data(nodes, function(d){ return d.id })

            node.exit().remove()

            const nodeEnter = node
                .enter()
                .append('g')
                .attr('class', 'node')
                .attr('stroke', '#aaa')
                .attr('stroke-width', 2)
                .style('fill', color)
                .style('opacity', 1)
                .on('click', clicked)
                .call(d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended))

            nodeEnter.append('circle')
                .attr("r", 35)
                .style('text-anchor', function(d){ return d.children ? 'end' : 'start'; })
                .text(function(d){ return d.data.name })

            nodeEnter.append("text")
                .attr("dy", 4)
                .attr("dx", -15)
                .attr("stroke", "white")
                .attr("stroke-width", "0")
                .style("font-size", "15")
                .style('fill', 'black')
                .text("Ronaldo");
            nodeEnter.append("text")
                .attr("dy",15)
                .attr("dx", -6)
                .attr("stroke", "white")
                .attr("stroke-width", "0")
                .style("font-size", "10")
                .style('fill', 'black')
                .text("8.6");

            node = nodeEnter.merge(node)
            simulation.nodes(nodes)
            simulation.force('link').links(links)
        }

        function sizeContain(num) {
            num = num > 1000 ? num/1000 : num/100
            if (num < 4) num = 4
            return num
        }

        function color(d) {
            return d._children ? "#51A1DC" // collapsed package
                : d.children ? "#51A1DC" // expanded package
                    : "#F94B4C"; // leaf node
        }

        function radius(d) {
            return d._children ? 8
                : d.children ? 8
                    : 4
        }

        function ticked() {
            link
                .attr('x1', function(d){ return d.source.x; })
                .attr('y1', function(d){ return d.source.y; })
                .attr('x2', function(d){ return d.target.x; })
                .attr('y2', function(d){ return d.target.y; })

            node
                .attr('transform', function(d){ return `translate(${d.x}, ${d.y})`})
            edgepaths
                .attr('d', d => 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y);
        }

        function clicked(event, d) {
            if (!event.defaultPrevented) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update()
            }
        }


        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
        }

        function dragged(event, d) {
            d.fx = event.x
            d.fy = event.y
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
        }

        function flatten(root) {
            const nodes = []
            function recurse(node) {
                if (node.children) node.children.forEach(recurse)
                if (!node.id) node.id = ++i;
                else ++i;
                nodes.push(node)
            }
            recurse(root)
            return nodes
        }

        function zoomed(event) {
            svg.attr('transform', event.transform)
        }

        update()

    }, [])

    return (
        <div ref={svgRef} >
            <div id="pre">
                <Card border="secondary" key={1}  style={{width: '220px', marginTop: '15px', marginLeft: '15px', zIndex: '10'}}>
                    <Carousel nextLabel='none' nextIcon= '' prevIcon='' style={{borderRadius: '50%'}} interval={null}>
                        <Carousel.Item style={{width:'220px', height:'165px'}}  >
                            <img
                                style={{width:'220px', height:'165px', objectFit: "cover", overflow: "hidden"}}
                                className="d-block w-100"
                                alt="First slide"
                            />
                        </Carousel.Item>)}
                    </Carousel>

                    <Card.Body >
                        <Card.Title  > {1}. {"Ronaldo’s 3 Goals Carry Portugal to World Cup Berth"}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{"2013-11-20"}</Card.Subtitle>
                        <Card.Text style={{fontFamily: "unset", fontSize: "0.75em"}}>
                            {"A second-half hat trick by Cristiano Ronaldo took Portugal to the World Cup finals with a 4-2 aggregate victory in its World Cup playoff against Sweden on Tuesday...."}
                        </Card.Text>
                        <Card.Link style={{fontFamily: "arial", fontSize: "0.75em", float:"right"}} variant="primary" href={"pre"}>See more</Card.Link>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}



export default Test
