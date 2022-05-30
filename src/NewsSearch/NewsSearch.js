import './NewsSearch.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import {Card, Row, Col, Carousel, Tabs, Tab} from 'react-bootstrap';
import { Button } from 'primereact/button';
import React, {useEffect, useState} from "react";
import axios from "axios";
import { ImNewspaper } from 'react-icons/im';
import {BsImage} from 'react-icons/bs'
import { Tooltip } from 'primereact/tooltip';
import {GrTextAlignFull} from 'react-icons/gr'
import {NotificationManager} from "react-notifications";
import {ProgressSpinner} from "primereact/progressspinner";





const NewsSearch = ({filteredNews, setImageSrc, setFilteredNews, setKeywords, setThreeDImageData, setLineChartFiltedredNews, selectedNewsId, setSelectedNewsId, selectedNews, setSelectedNews, pastResultSearchNews, setPastResultSearchNews, searchTermHistory, setSearchTermHistory, setnodeEdges, setNodes, setInitialFilteredNews, setWordsToNews, pastNodeEdges, setPastNodeEdges, pastNodes, setPastNodes, pastWordToNewsMap, setPastWordToNewsMap, applicationState, setApplicationState, pastApplicationState, setPastApplicationState, setLoading}) => {
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


    const handleMultimodalClickRequest = (news) => {

        setLoading(true)
        setSelectedNews("")


        const news_id = news._id + "_" + news._source.parsed_section[news._source.image_positions[index]].order

        //https://dissertationserver.herokuapp.com/
        axios.post('http://localhost:3000/api/request/similarNews/byText/' + news_id ,{
            data: {
                state: applicationState,
                new_interaction:{"op": "text", "results": [{ "id": "0", "score": 1.70}, { "id": "1", "score": 2.70}]}
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'application/json'

            }
        }).then(response =>{

            setSelectedNews("")

            setInitialFilteredNews(response.data.searchWordResult.body.hits.hits)
            setnodeEdges(response.data.edges)
            setNodes(response.data.nodes)
            setKeywords(response.data.keywords)
            setThreeDImageData(response.data)
            setFilteredNews(response.data.searchWordResult.body.hits.hits)
            setLineChartFiltedredNews(response.data.searchWordResult.body.hits.hits)
            //setSelectedNewsId(response.data.searchWordResult.body.hits.hits[0]._id + "_" + response.data.searchWordResult.body.hits.hits[0]._source.parsed_section[response.data.searchWordResult.body.hits.hits[0]._source.image_positions[0]].order)
            pastResultSearchNews.push(response.data.searchWordResult.body.hits.hits)
            setPastResultSearchNews(pastResultSearchNews)

            const wordsToNewsMap = new Map(Object.entries(response.data.wordToNewsMap));
            setWordsToNews(wordsToNewsMap)

            applicationState = response.data.state.state
            console.log("resposnsestate", applicationState)
            setApplicationState(applicationState)


            pastNodes.push(response.data.nodes)
            pastNodeEdges.push(response.data.edges)
            pastWordToNewsMap.push(wordsToNewsMap)
            pastApplicationState.push(applicationState)

            setPastNodes(pastNodes)
            setPastNodeEdges(pastNodeEdges)
            setPastWordToNewsMap(pastWordToNewsMap)
            setPastApplicationState(pastApplicationState)

            setSearchTermHistory(searchTermHistory => [...searchTermHistory,news._source.headline.main + " (text)"])


            setLoading(false)
        })
            .catch((error) => {

                setLoading(false)


                NotificationManager.error('No results found', 'Error!', 3000)
                if(error.response) console.log(error.response.data);

                //setLineChartFiltedredNews(pastResultSearchNews[pastResultSearchNews.length-1])


            })
    }

    const handleImageMouseClickRequest = (news) => {


        setLoading(true)




        const news_id = news._id + "_" + news._source.parsed_section[news._source.image_positions[index]].order


        //https://dissertationserver.herokuapp.com
            axios.post('http://localhost:3000/api/request/similarNews/byImage/' + news_id ,{
                data: {
                    state: applicationState,
                    new_interaction:{"op": "text", "results": [{ "id": "0", "score": 1.70}, { "id": "1", "score": 2.70}]}
                },
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                    'Access-Control-Allow-Headers': 'application/json'

                }
        }).then(response =>{


            console.log("datad2", response.data)
            setSelectedNews("")

            setInitialFilteredNews(response.data.searchWordResult.body.hits.hits)
            setnodeEdges(response.data.edges)
            setNodes(response.data.nodes)
            setKeywords(response.data.keywords)
            setThreeDImageData(response.data)
            setFilteredNews(response.data.searchWordResult.body.hits.hits)
            setLineChartFiltedredNews(response.data.searchWordResult.body.hits.hits)
            //setSelectedNewsId(response.data.searchWordResult.body.hits.hits[0]._id + "_" + response.data.searchWordResult.body.hits.hits[0]._source.parsed_section[response.data.searchWordResult.body.hits.hits[0]._source.image_positions[0]].order)
            pastResultSearchNews.push(response.data.searchWordResult.body.hits.hits)
            setPastResultSearchNews(pastResultSearchNews)

            const wordsToNewsMap = new Map(Object.entries(response.data.wordToNewsMap));
            setWordsToNews(wordsToNewsMap)

            applicationState = response.data.state.state
            console.log("resposnsestate", applicationState)
            setApplicationState(applicationState)


            pastNodes.push(response.data.nodes)
            pastNodeEdges.push(response.data.edges)
            pastWordToNewsMap.push(wordsToNewsMap)
            pastApplicationState.push(applicationState)

            setPastNodes(pastNodes)
            setPastNodeEdges(pastNodeEdges)
            setPastWordToNewsMap(pastWordToNewsMap)
            setPastApplicationState(pastApplicationState)

            setSearchTermHistory(searchTermHistory => [...searchTermHistory,news._source.headline.main + " (text)"])

            setLoading(false)


        })
            .catch((error) => {

                setLoading(false)


                NotificationManager.error('No results found', 'Error!', 3000)
                if(error.response) console.log(error.response.data);

                //setLineChartFiltedredNews(pastResultSearchNews[pastResultSearchNews.length-1])


            })
    }

    useEffect(() => {





    }, [filteredNews, selectedNews]);

        return(

            <>



                {selectedNews == "" ? "":
                ( <div style={{position: "relative"}}>


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

                            <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary p-button-text" tooltip="News based on this piece"  tooltipOptions={{ className: "hoverClass", position: "bottom"}}  onClick={() => {handleMultimodalClickRequest(selectedNews); setSearchTermHistory(searchTermHistory => [...searchTermHistory,selectedNews._source.headline.main + " (text)"])}} >
                                <ImNewspaper style={{width:'100%', height: "20px"}}/>
                            </Button>

                            <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary p-button-text" tooltip="News based on this image" tooltipOptions={{ className: "hoverClass", position: "bottom"}} onClick={() => {handleImageMouseClickRequest(selectedNews); setSearchTermHistory(searchTermHistory => [...searchTermHistory,selectedNews._source.headline.main + " (image)"])}}>
                                <BsImage style={{width:'100%', height: "17px"}}/>
                            </Button>
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


                                <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary p-button-text" tooltip="News based on this piece"  tooltipOptions={{ className: "hoverClass", position: "bottom"}}  onClick={() => {handleMultimodalClickRequest(news, index)}} >
                                <ImNewspaper style={{width:'100%', height: "20px"}}/>
                                </Button>

                                <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary p-button-text" tooltip="News based on this image" tooltipOptions={{ className: "hoverClass", position: "bottom"}} onClick={() => {handleImageMouseClickRequest(news, index)}}>
                                    <BsImage style={{width:'100%', height: "17px"}}/>
                                </Button>


                                <Card.Link style={{fontFamily: "arial", fontSize: "0.75em", float:"right", marginTop: "12%"}} variant="primary" href={news._source.web_url}>See more</Card.Link>
                            </Card.Body>

                        </Card>

                    </Col>
                ))}

            </Row>
                </>
        )


}


export default NewsSearch;
