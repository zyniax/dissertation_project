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
import {Card, Col, Row, ListGroup, Tabs, Tab, ButtonGroup, ToggleButton} from "react-bootstrap";
import ThreeDImageVisualization from "./EmbeddingsVisualization/3DVisualizationClasses/3DImagesVisualization";
import HorizontalBarChart from "./LineChart/HorizontalBarChart/HorizontalBarChart";
import Test from "./GraphVisualizations/KeywordsGraphVisualization/test"
import WordGraphVisualization from "./GraphVisualizations/WordGraphVisualization/WordGraphVisualization"
import paraTrabalho from "./Navbar Components/paraTrabalho";
import ParaTrabalho from "./Navbar Components/paraTrabalho";
import {NotificationContainer} from "react-notifications";




function App() {
    const [image, setImageSrc] = useState("");
    const [brushExtent, setBrushExtent] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [newsOfTheDay, setNewsOfTheDay] = useState([]);
    const [threeDImageData, setThreeDImageData] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [lineChartFiltedredNews, setLineChartFiltedredNews] = useState([]);
    const [nodes, setNodes] = useState("");
    const [pastNodes, setPastNodes] = useState([]);
    const [nodeEdges, setnodeEdges] = useState("");
    const [pastNodeEdges, setPastNodeEdges] = useState([]);
    const [wordsToNews, setWordsToNews] = useState([]);
    const [pastWordToNewsMap, setPastWordToNewsMap] = useState([])
    const [pastThreeDImageData, setPastThreeDImageData] = useState([])
    const [selectedNews, setSelectedNews] = useState([])
    const [selectedNewsId, setSelectedNewsId] = useState("");
    const [searchTermHistory, setSearchTermHistory] = useState([])
    const [pastResultSearchNews,setPastResultSearchNews] = useState([])
    const [searchTerm, setSearchTerm] = useState([])
    const [applicationState, setApplicationState] = useState([])
    const [initialFilteredNews, setInitialFilteredNews] = useState([])
    const [pastApplicationState, setPastApplicationState] = useState([])
    const [loading, setLoading] = useState(false)
    const [clusterKeywords, setClusterKeywords] = useState([])
    const [key, setKey] = useState('home');







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
            setNewsOfTheDay(data.hits.hits)
            setLineChartFiltedredNews(data.hits.hits)

            console.log(data)

    });

    }, []);



  return (



      <>

          <NotificationContainer/>

          <Router>
              <NavBar/>
          </Router>



          <div className="SearchBarsDiv" style={{marginTop: "1%"}}>
              <SearchBars setFilteredNews={setFilteredNews} setKeywords={setKeywords} setThreeDImageData={setThreeDImageData} setLineChartFiltedredNews={setLineChartFiltedredNews}
                          setNodes={setNodes} setnodeEdges={setnodeEdges} setWordsToNews={setWordsToNews} newsOfTheDay={newsOfTheDay} setSelectedNewsId={setSelectedNewsId}
                          searchTermHistory={searchTermHistory} setSearchTermHistory={setSearchTermHistory} pastResultSearchNews={pastResultSearchNews}
                          setPastResultSearchNews={setPastResultSearchNews} searchTermHistory={searchTermHistory} setSearchTermHistory={setSearchTermHistory}
                          searchTerm={searchTerm} setSearchTerm={setSearchTerm} applicationState={applicationState} setApplicationState={setApplicationState}
                          setInitialFilteredNews={setInitialFilteredNews} pastNodes={pastNodes} setPastNodes={setPastNodes} pastNodeEdges={pastNodeEdges}
                          setPastNodeEdges={setPastNodeEdges} pastWordToNewsMap={pastWordToNewsMap} setPastWordToNewsMap={setPastWordToNewsMap}
                          pastApplicationState={pastApplicationState} setPastApplicationState={setPastApplicationState} pastThreeDImageData={pastThreeDImageData} setPastThreeDImageData={setPastThreeDImageData}
                          setLoading={setLoading} loading={loading}  setClusterKeywords={setClusterKeywords} setSelectedNews={setSelectedNews}/>
          </div>


          <div style={{width: "97%", overflow: "hidden " , marginTop: "5.5%", height: "100%", marginLeft: "2.5%"}}>



              <Row style={{width: "100%"}}>


                  <Col>

                      <Tabs defaultActiveKey="Time Analysis" onSelect={(k) => setKey(k)} style={{position: "absolute", marginTop: "-4%"}} id="uncontrolled-tab-example" className="mb-1">

                          <Tab  eventKey="Similar News" title="Similar News">
                              <Card style={{backgroundColor: "#fff",  borderRadius: "0.625rem", boxShadow: "0 2px 0 rgba(90, 97, 105, 0.11), 0 4px 8px rgba(90, 97, 105, 0.12), 0 10px 10px rgba(90, 97, 105, 0.06), 0 7px 70px rgba(90, 97, 105, 0.1)" }}>


                                  <div style={{float:"left", marginBottom: '10%'}}>

                                      <Test selectedNewsId={selectedNewsId} setSelectedNewsId={setSelectedNewsId} setSelectedNews={setSelectedNews} filteredNews={lineChartFiltedredNews} setFilteredNews={setFilteredNews} setKeywords={setKeywords} setThreeDImageData={setThreeDImageData} setLineChartFiltedredNews={setLineChartFiltedredNews}  selectedNews={selectedNews} pastResultSearchNews={pastResultSearchNews} setPastResultSearchNews={setPastResultSearchNews} searchTermHistory={searchTermHistory} setSearchTermHistory={setSearchTermHistory}/>

                                  </div>
                              </Card>
                          </Tab>

                          <Tab   eventKey="Embeddings" title="Embeddings">

                              {key=='Embeddings' && <ThreeDImageVisualization threeDImageData={threeDImageData} filteredNews={filteredNews} filteredNews={lineChartFiltedredNews} setImageSrc={setImageSrc} setFilteredNews={setFilteredNews} setKeywords={setKeywords} setThreeDImageData={setThreeDImageData}
                                                                  setLineChartFiltedredNews={setLineChartFiltedredNews} selectedNewsId={selectedNewsId} setSelectedNewsId={setSelectedNewsId}
                                                                  selectedNews={selectedNews} setSelectedNews={setSelectedNews} pastResultSearchNews={pastResultSearchNews}
                                                                  setPastResultSearchNews={setPastResultSearchNews} searchTermHistory={searchTermHistory} setSearchTermHistory={setSearchTermHistory}
                                                                  setNodes={setNodes} setnodeEdges={setnodeEdges} setInitialFilteredNews={setInitialFilteredNews} setWordsToNews={setWordsToNews}
                                                                  pastNodes={pastNodes} setPastNodes={setPastNodes} pastNodeEdges={pastNodeEdges} setPastNodeEdges={setPastNodeEdges} pastWordToNewsMap={pastWordToNewsMap}
                                                                  setPastWordToNewsMap={setPastWordToNewsMap} pastApplicationState={pastApplicationState} setPastApplicationState={setPastApplicationState}
                                                                  applicationState={applicationState} setApplicationState={setApplicationState} loading={loading} clusterKeywords={clusterKeywords}/>}


                          </Tab>

                          <Tab  eventKey="Time Analysis" title="Time Analysis">

                              <Card style={{backgroundColor: "#fff",  borderRadius: "0.625rem", boxShadow: "0 2px 0 rgba(90, 97, 105, 0.11), 0 4px 8px rgba(90, 97, 105, 0.12), 0 10px 10px rgba(90, 97, 105, 0.06), 0 7px 70px rgba(90, 97, 105, 0.1)" }}>


                                  <div style={{float:"left", marginBottom: '10%'}}>


                                      <Line_chart setBrushExtent={setBrushExtent} style={{float:"left"}} setFilteredNews={setFilteredNews} filteredNews={filteredNews} brushExtent={brushExtent} lineChartFiltedredNews={lineChartFiltedredNews} setLineChartFiltedredNews={setLineChartFiltedredNews} loading={loading}
                                                  pastResultSearchNews={pastResultSearchNews} setPastResultSearchNews={setPastResultSearchNews} setKeywords={setKeywords} setThreeDImageData={setThreeDImageData} setFilteredNews={setFilteredNews} setSearchTermHistory={setSearchTermHistory}/>


                                      <Tabs style={{borderBottom: '0px', borderColor: '#fff'}}>

                                          <Tab style={{borderColor: '#fff'}} eventKey="WordGraph" title="WordGraph">

                                              <WordGraphVisualization nodes={nodes} nodeEdges={nodeEdges} wordsToNews={wordsToNews} setFilteredNews={setFilteredNews} filteredNews={filteredNews} setLineChartFiltedredNews={setLineChartFiltedredNews} initialFilteredNews={initialFilteredNews} loading={loading}/>

                                          </Tab>


                                       <Tab style={{borderColor: '#fff'}} eventKey="BarChart" title="BarChart">
                                           <HorizontalBarChart  keywords={keywords} filteredNews={filteredNews} setLineChartFiltedredNews={setLineChartFiltedredNews} setFilteredNews={setFilteredNews} lineChartFiltedredNews={lineChartFiltedredNews} loading={loading}/>

                                       </Tab>

                                      </Tabs>
                                          </div>
                              </Card>
                          </Tab>

                          <ThreeDImageVisualization threeDImageData={threeDImageData} filteredNews={filteredNews}/>


                      </Tabs>
                      </Col>

                  <Col>

              <Card style={{justifyContent: "center", backgroundColor: "#fff",  borderRadius: "0.625rem", boxShadow: "0 2px 0 rgba(90, 97, 105, 0.11), 0 4px 8px rgba(90, 97, 105, 0.12), 0 10px 10px rgba(90, 97, 105, 0.06), 0 7px 70px rgba(90, 97, 105, 0.1)" }}>
                <div>
                    <NewsSearch filteredNews={lineChartFiltedredNews} setImageSrc={setImageSrc} setFilteredNews={setFilteredNews} setKeywords={setKeywords} setThreeDImageData={setThreeDImageData}
                                setLineChartFiltedredNews={setLineChartFiltedredNews} selectedNewsId={selectedNewsId} setSelectedNewsId={setSelectedNewsId}
                                selectedNews={selectedNews} setSelectedNews={setSelectedNews} pastResultSearchNews={pastResultSearchNews}
                                setPastResultSearchNews={setPastResultSearchNews} searchTermHistory={searchTermHistory} setSearchTermHistory={setSearchTermHistory}
                                setNodes={setNodes} setnodeEdges={setnodeEdges} setInitialFilteredNews={setInitialFilteredNews} setWordsToNews={setWordsToNews}
                                pastNodes={pastNodes} setPastNodes={setPastNodes} pastNodeEdges={pastNodeEdges} setPastNodeEdges={setPastNodeEdges} pastWordToNewsMap={pastWordToNewsMap}
                                setPastWordToNewsMap={setPastWordToNewsMap} pastApplicationState={pastApplicationState} setPastApplicationState={setPastApplicationState}
                                applicationState={applicationState} setApplicationState={setApplicationState} setLoading={setLoading} />

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
