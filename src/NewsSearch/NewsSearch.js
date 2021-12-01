import './NewsSearch.css'
import { Card, Button, Row, Col, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {logo192} from '../logo192.png';
import React, {useEffect, useState} from "react";
import axios from "axios";





const NewsSearch = ({filteredNews, setImageSrc}) => {
    console.log("este é o filtered news do newsSearch")
    console.log(filteredNews)

    const [newsCollection, setnewsCollection] = useState([]);
    const [isShown, setIsShown] = useState(false);


    // useEffect(() => {
    //
    //
    //
    // axios.get('http://localhost:3000/api/news',{
    //     headers: {
    //         'Access-Control-Allow-Origin': 'http://localhost:3000',
    //         'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    //         'Access-Control-Allow-Headers': 'application/json'
    //     }
    // }).then(response =>{
    //
    //     setnewsCollection(response.news);
    //     console.log(filteredNews)
    //     console.log("passou")
    //
    // })
    //
    // }, [filteredNews]);
    //
    // function handleMouseOver(news_image){
    //
    //     setIsShown(true);
    //     setImageSrc(news_image);
    //
    //     //<Card.Img variant="bottom" src={newsCollection[i].main_image}/>
    // }
    //
    // function handleMouseOut(){
    //
    //     setIsShown(false)
    //
    // }

    useEffect(() => {





    }, [filteredNews]);

        return(

            <>
                {isShown && (
                <div className="news_image_on_hover">

                        <Card.Img variant="bottom"  />

                </div>
                )}

            <Row xs={1} md={4} padding = "5px" style={{width: "100%", height: "0.80%"}} className="news_with_scroll">


                {filteredNews.map((news, idx) => (
                    <Col xs = "3.5" key={idx}>

                         <Card border="secondary" key={idx}  style={{width: '105%', marginBottom: '7%', marginLeft: '10%'}}>
                             <Carousel nextLabel='none' nextIcon= '' prevIcon='' style={{borderRadius: '50%'}} interval={null}>
                                 {news._source.image_positions.map (imageIndex => (
                                 <Carousel.Item style={{width:'100%'}}  >
                                     <img onClick={() => setImageSrc("https://large.novasearch.org/nytimes/images/" + news._source.parsed_section[imageIndex].hash + ".jpg")}
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
                            </Card.Body>
                        </Card>

                    </Col>
                ))}

            </Row>
                </>
        )



}


export default NewsSearch;
