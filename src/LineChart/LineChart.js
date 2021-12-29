import React, {useEffect, useRef, useState} from "react";
import Tooltip from "../Tooltip/Tooltip";
import Chart_Pie from "./ChartPie/ChartPie";
import {Card, Col, Row, Carousel, Container} from "react-bootstrap";
import HorizontalBarChart from "./HorizontalBarChart/HorizontalBarChart";

import * as d3 from 'd3';
import RelevantHeadlines from "./RelevantHeadlines/RelevantHeadlines";


var dataset1 = [
    {id: 1, title: 'Where Port Reigns, Unfortified Wines Undergo a Stylistic Evolution', publication_date: '2014-02-03', subtitle: 'The Douro Valley in Portugal seems an unlikely source for bottles with delicacy and subtlety, but producers are now creating elegant reds and whites.', web_url: 'https://www.nytimes.com/2019/07/25/dining/drinks/douro-valley-still-wines.html', main_image: ["https://images.squarespace-cdn.com/content/v1/58d34f8859cc687828ac898b/1573744657822-ZBPTF4JYY3HFBSR1TR4R/ke17ZwdGBToddI8pDm48kFJh-pNMbEWuIua_4t_HF8VZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpxIZIr-ZEpQ2ki8KDAfgr7FF79vNyAExzgeOSUgMOBd1jA6L5AngCnVNXXj7tmtOW4/1b79d79f45e363bccfe518284711414c.jpg?format=750w", "https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8MTYlM0E5fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"], second_Image:"https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8MTYlM0E5fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80", value: 10000, Keywords: "Cristiano Ronaldo, Real Madrid, Laliga, Goals", Topics: "Football, Atletism, Sports"},
    {id: 2, title: 'Portuguese Join Europe’s Chorus of Discontent', publication_date: '2013-11-28', subtitle: 'Protests and work stoppages have become much more common, as daily life for many Portuguese families has become a struggle to stay afloat....', web_url: 'https://www.nytimes.com/2012/11/28/world/europe/portuguese-join-europes-chorus-of-discontent.html', main_image: ["https://veja.abril.com.br/wp-content/uploads/2021/07/GettyImages-1325118902.jpg"], value: 8000},
    {id: 3, title: 'Portugal’s Cristiano Ronaldo Can’t Mask Frustration in Tie With Austria', publication_date: '2016-06-19', subtitle: 'A steady stream of unclaimed opportunities made a 0-0 draw against Austria an exercise in frustration for Portugal’s Cristiano Ronaldo....', web_url: 'https://www.nytimes.com/2016/06/19/sports/soccer/portugals-ronaldo-cant-mask-frustration-during-tie-with-austria.html', main_image: ["https://images.squarespace-cdn.com/content/v1/57aa5b0e9f7456bea43ce25a/1508860145904-53YCC7RRVIP6G7G0VVTI/10_Vinhos_Jancis_Robinson_DT.jpg"], value: 900},
    {id: 4, title: 'Ronaldo Dethrones Messi as World Player of Year', publication_date: '2016-01-14', subtitle: 'Cristiano Ronaldo, who scored 66 goals in 56 games last year, did not win a team trophy, but he did lead his national team to a place in the World Cup....', web_url: 'https://www.nytimes.com/2014/01/14/sports/soccer/ronaldo-dethrones-messi-as-world-player-of-year.html', main_image: ["https://www.collinsdictionary.com/images/full/galaxy_364586081.jpg"], value: 5700},
    {id: 5, title: 'Telling the Story of 41 Years on the Run', publication_date: '2017-10-29', subtitle: 'Captured in Portugal last month, George Wright recounts his odyssey since he escaped from prison and hijacked a plane....', web_url: 'https://www.nytimes.com/2011/10/29/nyregion/george-wright-tells-story-of-hijacking-from-portugal.html', main_image: ["https://static.pexels.com/photos/111788/pexels-photo-111788-large.jpeg", "http://cdn.wallpaperhi.com/1920x1200/20120425/yellow%20cars%20ford%20mustang%20shelby%20gt350%20old%20cars%20yellow%20cars%201920x1200%20wallpaper_www.wallpaperhi.com_94.jpg"], value: 8900, Keywords: "Cristiano Ronaldo, Real Madrid, Laliga, Goals", Topics: "Football, Atletism, Sports"},
    {id: 6, title: 'Merkel Vows Full Support for Portugal', publication_date: '2015-11-13', subtitle: 'Chancellor Angela Merkel of Germany sought to reassure Portuguese leaders on Monday that fiscal overhauls would be rewarded with long-term growth and stability....', web_url: 'https://www.nytimes.com/2012/11/13/business/global/merkel-vows-support-for-portugal.html', main_image: ["https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80"], value: 4000},
    {id: 7, title: 'Scorched Portugal Turns to the Goat as a Low-Cost Firefighter', publication_date: '2017-09-12', subtitle: 'Portugal is using goats to clear the underbrush that fuels wildfires in hard to reach places and abandoned lands. If only it can find shepherds to tend them.', web_url: 'https://www.nytimes.com/2019/08/17/world/europe/portugal-wildfires-goats-climate-change.html', main_image: ["https://ichef.bbci.co.uk/news/640/cpsprodpb/4272/production/_115301071_gettyimages-1229485853.jpg"], value: 3000},
    {id: 8, title: 'France Loses a Soccer Championship, but Achieves a Rare Unity', publication_date: '2016-07-11', subtitle: 'Despite a loss, France saw the finals of the European Championships as an opportunity to unite and recover after a difficult and divisive year....', web_url: 'https://www.nytimes.com/2016/07/11/world/europe/uefa-euro-2016-france.html', main_image: ["https://observatoriodocinema.uol.com.br/wp-content/uploads/2020/07/michael-jackson-obs.jpg"], value: 4000},
    {id: 9, title: 'Cristiano Ronaldo, Quiet Superstar, Can Win Portugal’s Heart With Euros Title', publication_date: '2016-07-10', subtitle: 'Ronaldo has had years of success at Real Madrid but still seeks his first major title for Portugal, which faces France in the European Championships final on Sunday....', web_url: 'https://www.nytimes.com/2016/07/10/sports/soccer/cristiano-ronaldo-portugal-euro-2016-final.html', main_image: ["https://lancelivre.pt/wp-content/uploads/2020/05/michael-jordan-recordes.jpg"], value: 5200},
    {id: 10, title: 'With Goal for Germany, Mario Gomez Vindicates Coach’s Faith", "kicker": "Euro 2015"', publication_date: '2015-06-10', subtitle: 'Germany took a hard-earned 1-0 victory over Portugal in its opening match of Euro 2012 with a late goal by Mario Gomez, who made an unexpected start....', web_url: 'https://www.nytimes.com/2012/06/10/sports/soccer/euro-2012-late-goal-by-mario-gomez-lifts-germany.html', main_image: ["https://bordalo.observador.pt/v2/q:85/rs:fill:2000/c:2000:1123:nowe:0:210/plain/https://s3.observador.pt/wp-content/uploads/2021/07/16123740/sl-benfica.jpeg"], value: 1200},
    {id: 11, title: 'Europe Decides Against Fines for Spain and Portugal', publication_date: '2013-07-28', subtitle: 'Officials apparently feared that punishing the countries for overspending would have spurred more austerity and helped fuel anti-European movements....', web_url: 'https://www.nytimes.com/2016/07/28/business/eu-spain-portugal-budget-fines.html', main_image: ["https://www.clementoni.com/media/prod/pt/35071/fresian-black-horse-500-pecas-high-quality-collection_vAKiTEG.jpg"], value: 900},



];





export const Line_chart = ({setBrushExtent, setFilteredNews, filteredNews, brushExtent}) => {

    const [stateNumberOfDatesBetweenTheStartingAndEndDate, setnumberOfDatesBetweenTheStartingAndEndDate] = useState(dataset1.length);
    const [arrayLenght, getArrayLength] = useState();

    const svgRef = useRef();

    useEffect(() => {




        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 30, bottom: 30, left: 25},
            // eslint-disable-next-line no-restricted-globals
            width = (outerWidth * 0.50) - margin.left - margin.right,
            // eslint-disable-next-line no-restricted-globals
            height = (outerHeight*0.47) - margin.top - margin.bottom;


// append the svg object to the body of the page
        const svg = d3.select(svgRef.current)
            //.attr("viewBox", [0, 0, 500, 450])
            .attr("width", width  + margin.left + margin.right)
            .attr("height", height + 30 + margin.top + margin.bottom)
            .append("g")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);


//Read the data
        d3.json("./out.json",

            // When reading the csv, I must format variables:
            function(d){
            console.log("esta é a dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + d)
                return { pub_date : d3.timeParse("%Y-%m-%d")(filteredNews._source.pub_date.substring(0,10)), value : d.value,  }

            }).then(

            // Now I can use this dataset:
            function(fakeData) {

                var data = fakeData.hits.hits
                console.log("esta é a data")
                console.log(data)
                getArrayLength(data.length)
                console.log("este é o score" + data[0]._score)
                // Add X axis --> it is a date format
                var x = d3.scaleTime()
                    .domain(d3.extent(data, function(d) { return d3.timeParse("%Y-%m-%d")(d._source.pub_date.substring(0,10)) }))
                    .range([ 0, width ]);
               const xAxis = svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

                // Add Y axis
                var y = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d) { return + d._score; })])
                    .range([ height, 0 ]);
               const yAxis = svg.append("g")
                    .call(d3.axisLeft(y));

                // Add a clipPath: everything out of this area won't be drawn.
                var clip = svg.append("defs").append("svg:clipPath")
                    .attr("id", "clip")
                    .append("svg:rect")
                    .attr("width", width )
                    .attr("height", height )
                    .attr("x", 0)
                    .attr("y", 0);

                // Add brushing
                var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
                    .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
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
                        .x(function(d) { return x(d.date) })
                        .y(function(d) { return y(d.value) })
                        .curve(d3.curveMonotoneX)
                    )



                // Add the brushing
                line
                    .append("g")
                    .attr("class", "brush")
                    .call(brush);

                // A function that set idleTimeOut to null
                var idleTimeout
                function idled() { idleTimeout = null; }

                 var circle = svg.selectAll("circle")
                   .data(data)
                  .enter().append("circle")
                  .style("stroke", "steelblue")
                  .style("fill", "steelblue")
                  .attr("clip-path", "url(#clip)")
                  .attr("r", 4)
                  .attr("cx", function(d) { return x(d3.timeParse("%Y-%m-%d")(d._source.pub_date.substring(0,10))) })
                  .attr("cy", function(d) { return y(d._score) })
                 .on('mouseover',handleMouseOver)
                .on('mouseout',function () {
                   d3.select(this)
                       .transition()
                       .duration(300)
                       .attr('stroke-width',0)
                    //tooltip.transition()
                        //.style('opacity', 0)

                    svg.selectAll(".score,.date,.keywords,.headline").remove()

                    svg.append("text")
                        .attr("class", "score")
                        .attr("x", 10)
                        .attr("y", 10)
                        .attr("dy", ".35em")
                        .style("font-size", "12px")
                        .style("font-family", "Saira")
                        .html("Score " );

                    svg.append("text")
                        .attr("class", "date")
                        .attr("x", 10)
                        .attr("y", 22)
                        .attr("dy", ".35em")
                        .style("font-size", "12px")
                        .style("font-family", "Saira")
                        .html("Date: "  );

                    svg.append("text")
                        .attr("class", "keywords")
                        .attr("x", 10)
                        .attr("y", 34)
                        .attr("dy", ".35em")
                        .style("font-size", "12px")
                        .style("font-family", "Saira")
                        .html("Keywords: " );

                    svg.append("text")
                        .attr("class", "headline")
                        .attr("x", 10)
                        .attr("y", 46)
                        .attr("dy", ".35em")
                        .style("font-size", "12px")
                        .style("font-family", "Saira")
                        .html("Headline: " );
                 })

                var x2 = d3.scaleTime()
                    .domain(d3.extent(data, function(d) { return d.date; }))
                    .range([ 0, width ]),
                 y2 = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d) { return +d.value; })])
                    .range([ 30, 0 ]);


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
                    .html("Score"  );

                svg.append("text")
                    .attr("class", "date")
                    .attr("x", 10)
                    .attr("y", 22)
                    .attr("dy", ".35em")
                    .style("font-size", "12px")
                    .style("font-family", "Saira")
                    .html("Date: "  );

                svg.append("text")
                    .attr("class", "keywords")
                    .attr("x", 10)
                    .attr("y", 34)
                    .attr("dy", ".35em")
                    .style("font-size", "12px")
                    .style("font-family", "Saira")
                    .html("Keywords: " );

                svg.append("text")
                    .attr("class", "headline")
                    .attr("x", 10)
                    .attr("y", 46)
                    .attr("dy", ".35em")
                    .style("font-size", "12px")
                    .style("font-family", "Saira")
                    .html("Headline: " );







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
                            .x(function(d) { return x(d.date) })
                            .y(function(d) { return y(d.value) })
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
                        .attr("cx", function(d) { return x(d3.timeParse("%Y-%m-%d")(d._source.pub_date.substring(0,10))) })
                        .attr("cy", function(d) { return y(d._score) })
                }


                // A function that update the chart for given boundaries
                function updateChart(event) {

                    // What are the selected boundaries?
                    const extent = event.selection
                    console.log("evente selecito;" +  event.selection)


                    // If no selection, back to initial coordinate. Otherwise, update X axis domain
                    if(!extent){
                        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                        x.domain([ 4,8])
                    }else{
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

                        console.log(dataset2)


                        numberOfDatesBetweenTheStartingAndEndDate = dataset2.length
                        setnumberOfDatesBetweenTheStartingAndEndDate(numberOfDatesBetweenTheStartingAndEndDate)
                        setFilteredNews(dataset2)
                        console.log(numberOfDatesBetweenTheStartingAndEndDate)
                        console.log(dataset2)


                        setBrushExtent([ date1.substring(0, date1.indexOf(":") - 2), date2.substring(0, date2.indexOf(":") - 2)])
                        x.domain([x.invert(extent[0]), x.invert(extent[1]) ])



                        line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
                    }


                    // Update axis and line position
                    xAxis.transition().duration(1000).call(d3.axisBottom(x))
                    line
                        .select('.line')
                        .transition()
                        .duration(1000)
                        .attr("d", d3.line()
                            .x(function(d) { return x(d.date) })
                            .y(function(d) { return y(d.value) })
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
                        .attr("cx", function(d) { return x(d3.timeParse("%Y-%m-%d")(d._source.pub_date.substring(0,10))) })
                        .attr("cy", function(d) { return y(d._score) })

                    //d3.select(".brush2").call(brush2.move, [0,50] ,[100, 95]); ver isto depois
                }






                // If user double click, reinitialize the chart
                svg.on("dblclick",function(){
                    x.domain(d3.extent(data, function(d) { return d3.timeParse("%Y-%m-%d")(d._source.pub_date.substring(0,10)); }))
                    xAxis.transition().call(d3.axisBottom(x))
                    line
                        .select('.line')
                        .transition()
                        .attr("d", d3.line()
                            .x(function(d) { return x(d.date) })
                            .y(function(d) { return y(d.value) })
                            .curve(d3.curveMonotoneX)
                        )

                    svg.selectAll("circle")
                        .transition()
                        .delay(500)
                        .duration(500)
                        .attr("opacity", "1")
                        .attr("cx", function(d) { return x(d3.timeParse("%Y-%m-%d")(d._source.pub_date.substring(0,10))) })
                        .attr("cy", function(d) { return y(d._score) })

                    setnumberOfDatesBetweenTheStartingAndEndDate(dataset1.length);
                });

            })



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
                .attr('stroke-width',7)

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
                .text("Date: " + d._source.pub_date.substring(0,10))

            svg.select(".keywords")
                .attr("x", 10)
                .attr("y", 34)
                .attr("dy", ".35em")
                .text("Keywords: " + d._source.keywords.map(keyword => (" " + keyword.value)))

            svg.select(".headline")
                .attr("x", 10)
                .attr("y", 46)
                .attr("dy", ".35em")
                .text("Headline: " + d._source.headline.main );

            // tooltip.html("<p><b>Number of headlines</b>: " + 126 + "</p> <p><b>Data</b>: " + d.publication_date + "</p>" +
            //     "<p> Keywords: " +d.Keywords + " </p><p>Topics: Football, Atletism, Sports</p>")
            //     .style('left', (event.pageX) + 'px')
            //     .style('top', (event.pageY+ 'px'));





                // Specify where to put label of text
        }

    }, []);



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
                                        <Chart_Pie percentage={stateNumberOfDatesBetweenTheStartingAndEndDate/arrayLenght*100}/>
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
                                        <span style={{fontSize: '24px', fontWeight: '350', color:'#6857da'}}>{stateNumberOfDatesBetweenTheStartingAndEndDate}</span>
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
