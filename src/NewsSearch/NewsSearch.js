import './NewsSearch.css'
import {Card, Button, Row, Col, Carousel, Tabs, Tab} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {logo192} from '../logo192.png';
import React, {useEffect, useState} from "react";
import axios from "axios";
import { ImNewspaper } from 'react-icons/im';
import {Fa500Px, FaBeer} from 'react-icons/fa';
import {BsImage} from 'react-icons/bs'





const NewsSearch = ({filteredNews, setImageSrc, setFilteredNews, setKeywords, setThreeDImageData, setLineChartFiltedredNews, selectedNewsId, setSelectedNewsId, selectedNews, setSelectedNews, pastResultSearchNews, setPastResultSearchNews, searchTermHistory, setSearchTermHistory, setnodeEdges, setNodes, setInitialFilteredNews, setWordsToNews, pastNodeEdges, setPastNodeEdges, pastNodes, setPastNodes, pastWordToNewsMap, setPastWordToNewsMap}) => {
    console.log("este é o filtered news do newsSearch")
    console.log(filteredNews)
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const sortNewsByDate = () => {
        filteredNews.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b._source.pub_date) - new Date(a._source.pub_date);
        });
    }


    const handleMouseClickRequest = (news) => {


        const news_id = news._id + "_" + news._source.parsed_section[news._source.image_positions[index]].order

        //https://dissertationserver.herokuapp.com/
        axios.get('http://localhost:3000/api/request/search/' + news_id ,{
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'application/json'
            }
        }).then(response =>{


            setInitialFilteredNews(response.data.searchWordResult.body.hits.hits)
            setnodeEdges(response.data.edges)
            setNodes(response.data.nodes)
            setKeywords(response.data.keywords)
            setThreeDImageData(response.data)
            setFilteredNews(response.data.searchWordResult.body.hits.hits)
            setLineChartFiltedredNews(response.data.searchWordResult.body.hits.hits)
            setSelectedNewsId(response.data.searchWordResult.body.hits.hits[0]._id + "_" + response.data.searchWordResult.body.hits.hits[0]._source.parsed_section[response.data.searchWordResult.body.hits.hits[0]._source.image_positions[0]].order)
            pastResultSearchNews.push(response.data.searchWordResult.body.hits.hits)
            setPastResultSearchNews(pastResultSearchNews)
            const wordsToNewsMap = new Map(Object.entries(response.data.wordToNewsMap));
            setWordsToNews(wordsToNewsMap)


            pastNodes.push(response.data.nodes)
            pastNodeEdges.push(response.data.edges)
            pastWordToNewsMap.push(wordsToNewsMap)

            setPastNodes(pastNodes)
            setPastNodeEdges(pastNodeEdges)
            setPastWordToNewsMap(pastWordToNewsMap)

        })
    }

    const handleVisualMouseClickRequest = (news) => {



        const news_id = news._id + "_" + news._source.parsed_section[news._source.image_positions[index]].order

        //https://dissertationserver.herokuapp.com
        axios.get('http://localhost:3000/api/request/ByImage/' + news_id ,{
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'application/json'
            }
        }).then(response =>{


            setInitialFilteredNews(response.data.searchWordResult.body.hits.hits)
            setnodeEdges(response.data.edges)
            setNodes(response.data.nodes)
            setKeywords(response.data.keywords)
            setThreeDImageData(response.data)
            setFilteredNews(response.data.searchWordResult.body.hits.hits)
            setLineChartFiltedredNews(response.data.searchWordResult.body.hits.hits)
            setSelectedNewsId(response.data.searchWordResult.body.hits.hits[0]._id + "_" + response.data.searchWordResult.body.hits.hits[0]._source.parsed_section[response.data.searchWordResult.body.hits.hits[0]._source.image_positions[0]].order)
            pastResultSearchNews.push(response.data.searchWordResult.body.hits.hits)
            setPastResultSearchNews(pastResultSearchNews)

            const wordsToNewsMap = new Map(Object.entries(response.data.wordToNewsMap));
            setWordsToNews(wordsToNewsMap)

            pastNodes.push(response.data.nodes)
            pastNodeEdges.push(response.data.edges)
            pastWordToNewsMap.push(wordsToNewsMap)

            setPastNodes(pastNodes)
            setPastNodeEdges(pastNodeEdges)
            setPastWordToNewsMap(pastWordToNewsMap)


        })
    }

    useEffect(() => {





    }, [filteredNews]);

        return(

            <>



                {selectedNews != "" && ( <div style={{position: "relative"}}>


                    <Card border="danger"   style={{width: '70%', marginLeft: "17.5%", marginBottom:" 5%"}}>
                        <Carousel nextLabel='none' nextIcon= '' prevIcon='' style={{borderRadius: '50%'}} interval={null}  onSelect={handleSelect}>
                            {selectedNews._source.image_positions.map (imageIndex => (
                                <Carousel.Item style={{width:'100%'}}  >
                                    <img onClick={() => setImageSrc("https://large.novasearch.org/nytimes/images/" + selectedNews._source.parsed_section[imageIndex].hash + ".jpg")}
                                         style={{width:'100%', height:'223px', objectFit: "cover", overflow: "hidden"}}
                                         className="d-block w-100"
                                         src={"https://large.novasearch.org/nytimes/images/" + selectedNews._source.parsed_section[imageIndex].hash + ".jpg"}
                                         alt="First slide"
                                    />
                                </Carousel.Item>))}
                        </Carousel>

                        <Card.Body >

                            <BsImage onClick={() => handleMouseClickRequest(selectedNews)}
                                     style={{width:'12%', height:'27px', objectFit: "cover", overflow: "hidden", float:"right", marginTop: "-5%", marginRight:" -6.5%"}}
                            />
                            <ImNewspaper onClick={() => handleMouseClickRequest(selectedNews)}
                                         style={{width:'15%', height:'27px', objectFit: "cover", overflow: "hidden", float:"right", marginTop: "-5%"}}

                            />
                            <Card.Title  > {1}. {selectedNews._source.headline.main}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{selectedNews._source.pub_date.substring(0,10)}</Card.Subtitle>
                            <Card.Text style={{fontFamily: "unset", fontSize: "0.75em"}}>
                                {selectedNews._source.snippet}
                            </Card.Text>
                            <Card.Link style={{fontFamily: "arial", fontSize: "0.75em", float:"right"}} variant="primary" href={selectedNews._source.web_url}>See more</Card.Link>

                        </Card.Body>
                    </Card>
                </div>
                )}



            <Row xs={1} md={3} padding = "5px" style={{width: "100%", height: "0.80%", position: "relative"}} className="news_with_scroll">


                {filteredNews.map((news, idx) => (
                    <Col xs = "3.5" key={idx}>

                         <Card border="secondary" key={idx}  style={{width: '105%', marginBottom: '7%', marginLeft: '10%'}}>
                             <Carousel nextLabel='none' nextIcon= '' prevIcon='' style={{borderRadius: '50%'}} interval={null}  onSelect={handleSelect}>
                                 {news._source.image_positions.map (imageIndex => (
                                 <Carousel.Item style={{width:'100%'}}  >
                                     <img onClick={() => {setSelectedNews(news);
                                     setSelectedNewsId(news._id + "_" + news._source.parsed_section[imageIndex].order)} }

                                         style={{width:'100%', height:'165px', objectFit: "cover", overflow: "hidden"}}
                                         className="d-block w-100"
                                         src={"https://large.novasearch.org/nytimes/images/" + news._source.parsed_section[imageIndex].hash + ".jpg"}
                                         alt="First slide"
                                     />
                                 </Carousel.Item>))}
                             </Carousel>

                            <Card.Body >

                                <Card.Title  > {idx + 1}. {news._source.headline.main}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{news._source.pub_date.substring(0,10)}</Card.Subtitle>
                                <Card.Text style={{fontFamily: "unset", fontSize: "0.75em"}}>
                                    {news._source.snippet}
                                </Card.Text>
                                <Card.Link style={{fontFamily: "arial", fontSize: "0.75em", float:"right"}} variant="primary" href={news._source.web_url}>See more</Card.Link>

                                <BsImage onClick={() => {handleVisualMouseClickRequest(news, index); setSearchTermHistory(searchTermHistory => [...searchTermHistory,news._source.headline.main + " (image)"])}}
                                         style={{width:'15%', height:'27px', objectFit: "cover", overflow: "hidden", float:"left"}}
                                />
                                <ImNewspaper onClick={() => {handleMouseClickRequest(news, index); setSearchTermHistory(searchTermHistory => [...searchTermHistory,news._source.headline.main + " (text)"])}}
                                             style={{width:'15%', height:'29px', objectFit: "cover", overflow: "hidden", float:"left"}}

                                />
                                <ImNewspaper onClick={() => {handleMouseClickRequest(news, index); setSearchTermHistory(searchTermHistory => [...searchTermHistory,news._source.headline.main + " (text)"])}}
                                             style={{width:'15%', height:'29px', objectFit: "cover", overflow: "hidden", float:"left"}}

                                />
                            </Card.Body>

                        </Card>

                    </Col>
                ))}

            </Row>
                </>
        )


}


export default NewsSearch;
