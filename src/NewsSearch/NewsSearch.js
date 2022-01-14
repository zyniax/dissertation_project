import './NewsSearch.css'
import {Card, Button, Row, Col, Carousel, Tabs, Tab} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {logo192} from '../logo192.png';
import React, {useEffect, useState} from "react";
import axios from "axios";
import { ImNewspaper } from 'react-icons/im';
import {Fa500Px, FaBeer} from 'react-icons/fa';
import {BsImage} from 'react-icons/bs'





const NewsSearch = ({filteredNews, setImageSrc, setFilteredNews, setKeywords, setThreeDImageData, setLineChartFiltedredNews, selectedNewsId, setSelectedNewsId}) => {
    console.log("este é o filtered news do newsSearch")
    console.log(filteredNews)

    const [selectedNews, setSelectedNews] = useState([])

    const sortNewsByDate = () => {
        filteredNews.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b._source.pub_date) - new Date(a._source.pub_date);
        });
    }


    const handleMouseClickRequest = () => {



        //https://dissertationserver.herokuapp.com/
        axios.get('http://localhost:3000/api/request/search' ,{
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'application/json'
            }
        }).then(response =>{

            setFilteredNews(response.data.searchWordResult.body.hits.hits)
            setKeywords(response.data.keywords)
            setThreeDImageData(response.data)
            setLineChartFiltedredNews(response.data.searchWordResult.body.hits.hits)

        })
    }

    useEffect(() => {





    }, [filteredNews]);

        return(

            <>



                {selectedNews != "" && ( <div style={{position: "relative"}}>


                    <Card border="danger"   style={{width: '70%', marginLeft: "17.5%", marginBottom:" 5%"}}>
                        <Carousel nextLabel='none' nextIcon= '' prevIcon='' style={{borderRadius: '50%'}} interval={null}>
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
                            <BsImage onClick={() => handleMouseClickRequest()}
                                     style={{width:'12%', height:'27px', objectFit: "cover", overflow: "hidden", float:"right", marginTop: "-5%", marginRight:" -6.5%"}}
                            />
                            <ImNewspaper onClick={() => handleMouseClickRequest()}
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
                             <Carousel nextLabel='none' nextIcon= '' prevIcon='' style={{borderRadius: '50%'}} interval={null}>
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

                                <BsImage onClick={() => handleMouseClickRequest()}
                                     style={{width:'12%', height:'27px', objectFit: "cover", overflow: "hidden", float:"right", marginTop: "-5%", marginRight:" -6.5%"}}
                                />
                                <ImNewspaper onClick={() => handleMouseClickRequest()}
                                        style={{width:'15%', height:'27px', objectFit: "cover", overflow: "hidden", float:"right", marginTop: "-5%"}}

                                />

                                <Card.Title  > {idx + 1}. {news._source.headline.main}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{news._source.pub_date.substring(0,10)}</Card.Subtitle>
                                <Card.Text style={{fontFamily: "unset", fontSize: "0.75em"}}>
                                    {news._source.snippet}
                                </Card.Text>
                                <Card.Link style={{fontFamily: "arial", fontSize: "0.75em", float:"right"}} variant="primary" href={news._source.web_url}>See more</Card.Link>
                            </Card.Body>
                        </Card>

                    </Col>
                ))}

            </Row>
                </>
        )


}


export default NewsSearch;
