import logo from './logo.svg';
import Line_chart from "./LineChart/LineChart";
import NewsSearch from "./NewsSearch/NewsSearch";
import './App.css';
import {Background} from "./BackgroundVisualization";
import SearchBars from "./SearchBars/SearchBars";
import Manual_cropper from "./ManualCroppingImage/ManualCroppingImage";
import Tooltip from "./Tooltip/Tooltip";
import ThreeDWorldVisualization from "./3DWorldVisualization/ThreeDWorldVisualization";
import Graph_visualization from "./GraphVisualization/GraphVisualization";
import React, {useEffect, useState} from "react";
import NavBar from './Navbar Components/Navbar'
import {BrowserRouter as Router} from 'react-router-dom'
import RelevantHeadlines from "./LineChart/RelevantHeadlines/RelevantHeadlines";
import Chart_Pie from "./LineChart/ChartPie/ChartPie";
import {Card, Col, Row, ListGroup} from "react-bootstrap";
import Embedding_visualization from "./EmbeddingsVisualization/2DVisualizationTest";
import ThreeDImageVisualization from "./EmbeddingsVisualization/3DVisualizationClasses/3DImagesVisualization";
import HorizontalBarChart from "./LineChart/HorizontalBarChart/HorizontalBarChart";
import Graph_visualization2 from "./GraphVisualization/GraphVisualization2";


function App() {
    const [image, setImageSrc] = useState("");
    const [brushExtent, setBrushExtent] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [keywords, setKeywords] = useState([]);



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
            console.log(data)

    });

    }, []);

  return (



      <>
          <Router>
              <NavBar/>
          </Router>



          <div className="SearchBarsDiv" style={{marginBottom: "10px", marginTop: "20px"}}>
              <SearchBars setFilteredNews={setFilteredNews} setKeywords={setKeywords} />
          </div>



          <div style={{width: "90%", overflow: "hidden " , marginTop: "60px", height: "100%", marginLeft: "220px" }}>



            <Card border="light">
              <div style={{float:"left", marginBottom: '100px'}}>
                  <Line_chart setBrushExtent={setBrushExtent} style={{float:"left"}} setFilteredNews={setFilteredNews} filteredNews={filteredNews}  />
                  <HorizontalBarChart keywords={keywords} filteredNews={filteredNews} setFilteredNews={setFilteredNews}/>
                  <RelevantHeadlines brushExtent={brushExtent} />

              </div>


            </Card>



              <Card border="light">
              <div  style={{display: "flex", justifyContent: "center", marginTop:'30px'}}>
                  <NewsSearch filteredNews={filteredNews} setImageSrc={setImageSrc} />
              </div>
              </Card>
          </div>




          <Graph_visualization/>
        <Manual_cropper image={image}/>

        <ThreeDWorldVisualization setFilteredNews={setFilteredNews}/>

        <ThreeDImageVisualization filteredNews={filteredNews}/>



      </>


  );

}



export default App;
