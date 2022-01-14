import Line_chart from "./LineChart/LineChart";
import NewsSearch from "./NewsSearch/NewsSearch";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchBars from "./SearchBars/SearchBars";
import Manual_cropper from "./ManualCroppingImage/ManualCroppingImage";
import ThreeDWorldVisualization from "./3DWorldVisualization/ThreeDWorldVisualization";
import React, {useEffect, useState} from "react";
import NavBar from './Navbar Components/Navbar'
import {BrowserRouter as Router} from 'react-router-dom'
import RelevantHeadlines from "./LineChart/RelevantHeadlines/RelevantHeadlines";
import {Card, Col, Row, ListGroup, Tabs, Tab} from "react-bootstrap";
import ThreeDImageVisualization from "./EmbeddingsVisualization/3DVisualizationClasses/3DImagesVisualization";
import HorizontalBarChart from "./LineChart/HorizontalBarChart/HorizontalBarChart";
import Test from "./GraphVisualizations/KeywordsGraphVisualization/test"
import WordGraphVisualization from "./GraphVisualizations/WordGraphVisualization/WordGraphVisualization"
import colapsibleGraphVisualization from "./ColapsibleGraphVisualization/ColapsibleGraphVisualization";
import ColapsibleGraphVisualization from "./ColapsibleGraphVisualization/ColapsibleGraphVisualization";


function App() {
    const [image, setImageSrc] = useState("");
    const [brushExtent, setBrushExtent] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [threeDImageData, setThreeDImageData] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [lineChartFiltedredNews, setLineChartFiltedredNews] = useState([]);
    const [nodes, setNodes] = useState("");
    const [nodeEdges, setnodeEdges] = useState("");
    const [wordsToNews, setWordsToNews] = useState([]);
    const [selectedNewsId, setSelectedNewsId] = useState("");






    console.log("preeeeeeeeeeeee" + image)

    useEffect(() => {


    fetch("./out.json")
        .then(function(resp)
    {
        return resp.json();
    })
        .then(function (data){

            console.log(data.hits)
            console.log(data.hits.hits[0]._source.snippet)
            console.log(data.hits.hits[0]._source.headline.main)
            console.log(data.hits.hits[0]._source.keywords[0].value)
            console.log(data.hits.hits[0]._source.multimedia[0].url)
            console.log(data.hits.hits[0]._source.pub_date)
            console.log(data.hits.hits[0]._source)
            setFilteredNews(data.hits.hits)
            setLineChartFiltedredNews(data.hits.hits)
            console.log(data)

    });

    }, []);

  return (



      <>
          <Router>
              <NavBar/>
          </Router>



          <div className="SearchBarsDiv" style={{marginTop: "1%"}}>
              <SearchBars setFilteredNews={setFilteredNews} setKeywords={setKeywords} setThreeDImageData={setThreeDImageData} setLineChartFiltedredNews={setLineChartFiltedredNews} setNodes={setNodes} setnodeEdges={setnodeEdges} setWordsToNews={setWordsToNews} />
          </div>



          <div style={{width: "97%", overflow: "hidden " , marginTop: "5.5%", height: "100%", marginLeft: "2.5%"}}>



              <Row style={{width: "100%"}}>


                  <Col>

                      <Tabs style={{position: "absolute", marginTop: "-4%"}} defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-1">
                          <Tab eventKey="Embeddings" title="Embeddings">
                              <ThreeDImageVisualization threeDImageData={threeDImageData} filteredNews={filteredNews}/>

                          </Tab>

                          <Tab eventKey="Similar News" title="Similar News">
                              <Card style={{backgroundColor: "#fff",  borderRadius: "0.625rem", boxShadow: "0 2px 0 rgba(90, 97, 105, 0.11), 0 4px 8px rgba(90, 97, 105, 0.12), 0 10px 10px rgba(90, 97, 105, 0.06), 0 7px 70px rgba(90, 97, 105, 0.1)" }}>


                                  <div style={{float:"left", marginBottom: '10%'}}>

                                      <Test selectedNewsId={selectedNewsId}/>
                                      <WordGraphVisualization nodes={nodes} nodeEdges={nodeEdges} wordsToNews={wordsToNews} setFilteredNews={setFilteredNews} filteredNews={filteredNews} setLineChartFiltedredNews={setLineChartFiltedredNews}/>

                                  </div>
                              </Card>
                          </Tab>

                          <Card style={{backgroundColor: "#fff",  borderRadius: "0.625rem", boxShadow: "0 2px 0 rgba(90, 97, 105, 0.11), 0 4px 8px rgba(90, 97, 105, 0.12), 0 10px 10px rgba(90, 97, 105, 0.06), 0 7px 70px rgba(90, 97, 105, 0.1)" }}>


                              <div style={{float:"left", marginBottom: '10%'}}>

                                  <Test/>

                              </div>
                          </Card>
                          <Tab eventKey="Time Analysis" title="Time Analysis">

                              <Card style={{backgroundColor: "#fff",  borderRadius: "0.625rem", boxShadow: "0 2px 0 rgba(90, 97, 105, 0.11), 0 4px 8px rgba(90, 97, 105, 0.12), 0 10px 10px rgba(90, 97, 105, 0.06), 0 7px 70px rgba(90, 97, 105, 0.1)" }}>


                                  <div style={{float:"left", marginBottom: '10%'}}>

                                      <Line_chart setBrushExtent={setBrushExtent} style={{float:"left"}} setFilteredNews={setFilteredNews} filteredNews={filteredNews} brushExtent={brushExtent} lineChartFiltedredNews={lineChartFiltedredNews} setLineChartFiltedredNews={setLineChartFiltedredNews} />
                                      <HorizontalBarChart keywords={keywords} filteredNews={filteredNews} setLineChartFiltedredNews={setLineChartFiltedredNews} setFilteredNews={setFilteredNews}/>

                                  </div>
                              </Card>
                          </Tab>

                          <ThreeDImageVisualization threeDImageData={threeDImageData} filteredNews={filteredNews}/>


                      </Tabs>
                      </Col>

                  <Col>

              <Card style={{justifyContent: "center", backgroundColor: "#fff",  borderRadius: "0.625rem", boxShadow: "0 2px 0 rgba(90, 97, 105, 0.11), 0 4px 8px rgba(90, 97, 105, 0.12), 0 10px 10px rgba(90, 97, 105, 0.06), 0 7px 70px rgba(90, 97, 105, 0.1)" }}>
                <div>
                    <NewsSearch filteredNews={lineChartFiltedredNews} setImageSrc={setImageSrc} setFilteredNews={setFilteredNews} setKeywords={setKeywords} setThreeDImageData={setThreeDImageData} setLineChartFiltedredNews={setLineChartFiltedredNews} selectedNewsId={selectedNewsId} setSelectedNewsId={setSelectedNewsId} />
                     <Manual_cropper image={image}/>
                </div>

              </Card>
                  </Col>


              </Row>

        <ThreeDWorldVisualization  setFilteredNews={setFilteredNews}/>
          </div>

      </>


  );

}



export default App;
