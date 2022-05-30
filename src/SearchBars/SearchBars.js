import {Card, Col, Row} from "react-bootstrap";
import axios from "axios";
import './SearchBars.css'
import React, {useEffect, useState} from "react";
import 'react-notifications/lib/notifications.css';
import {NotificationManager} from 'react-notifications';


const SearchBars = ({setFilteredNews, setKeywords, setThreeDImageData, setLineChartFiltedredNews, setNodes, setnodeEdges, setWordsToNews, newsOfTheDay, setSelectedNewsId, pastResultSearchNews, setPastResultSearchNews, searchTermHistory, setSearchTermHistory, searchTerm, setSearchTerm, applicationState, setApplicationState, setInitialFilteredNews, pastNodes, setPastNodes, pastNodeEdges, setPastNodeEdges, pastWordToNewsMap, setPastWordToNewsMap, pastApplicationState, setPastApplicationState, pastThreeDImageData, setPastThreeDImageData, setLoading, loading, setClusterKeywords, setSelectedNews}) => {





const handleMouseClickRequest = () => {

    setLoading(true)



    axios.post('http://localhost:3000/api/request/' + searchTerm,{
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



        setLoading(false)

        console.log("ole ola esta festa não esta ma")

        setSelectedNews("")

        setInitialFilteredNews(response.data.searchWordResult.body.hits.hits)
        setFilteredNews(response.data.searchWordResult.body.hits.hits)
        setLineChartFiltedredNews(response.data.searchWordResult.body.hits.hits)
        setKeywords(response.data.keywords)
        setThreeDImageData(response.data)
        setnodeEdges(response.data.edges)
        setNodes(response.data.nodes)
        setClusterKeywords(response.data.clusterKeywords)
        //setSelectedNewsId(response.data.searchWordResult.body.hits.hits[0]._id + "_" + response.data.searchWordResult.body.hits.hits[0]._source.parsed_section[response.data.searchWordResult.body.hits.hits[0]._source.image_positions[0]].order)
        pastResultSearchNews.push(response.data.searchWordResult.body.hits.hits)
        setPastResultSearchNews(pastResultSearchNews)


        applicationState = response.data.state.state
        console.log("resposnsestate", applicationState)
        setApplicationState(applicationState)


        const wordsToNewsMap = new Map(Object.entries(response.data.wordToNewsMap));
        setWordsToNews(wordsToNewsMap)

        pastNodes.push(response.data.nodes)
        pastNodeEdges.push(response.data.edges)
        pastWordToNewsMap.push(wordsToNewsMap)
        pastApplicationState.push(applicationState)
        pastThreeDImageData.push(response.data)


        setPastNodes(pastNodes)
        setPastNodeEdges(pastNodeEdges)
        setPastWordToNewsMap(pastWordToNewsMap)
        setPastApplicationState(pastApplicationState)
        setPastThreeDImageData(pastThreeDImageData)

        setSearchTermHistory(searchTermHistory => [...searchTermHistory,searchTerm])


        NotificationManager.success('Success message', 'Query completed', 3000);



        console.log("este é o wordstonewsMap",wordsToNewsMap)
        console.log("esta é a nova data mas nova nova")
        console.log(response.data)
        console.log("oyeahyeah")
        console.log(response.data.searchWordResult.body.hits.hits)
        console.log(response.data.keywords)
        console.log("este é o word to newsmap", response.data.wordToNewsMap)



    })
        .catch((error) => {

            setLoading(false)


            NotificationManager.error('No results found', 'Error!', 3000)
            if(error.response) console.log(error.response.data);

            //setLineChartFiltedredNews(pastResultSearchNews[pastResultSearchNews.length-1])


        })
}

    const handleCrossMouseClick = (idx) => {

        setLoading(true)



        var searchesToRemove = pastResultSearchNews
        var historyToRemove = searchTermHistory

        searchesToRemove.splice(idx, pastResultSearchNews.length - idx)
        setPastResultSearchNews(searchesToRemove)

        historyToRemove.splice(idx, searchTermHistory.length - idx)
        setSearchTermHistory(historyToRemove)

        pastNodes.splice(idx, pastNodes.length - idx)
        setPastNodes(pastNodes)

        pastNodeEdges.splice(idx, pastNodeEdges.length - idx)
        setPastNodeEdges(pastNodeEdges)


        pastWordToNewsMap.splice(idx, pastWordToNewsMap.length - idx)
        setPastWordToNewsMap(pastWordToNewsMap)

        pastApplicationState.splice(idx, pastApplicationState.length - idx)
        setPastApplicationState(pastApplicationState)

        pastThreeDImageData.splice(idx, pastThreeDImageData.length - idx)
        setPastThreeDImageData(pastThreeDImageData)


        if(searchesToRemove.length - 1 >= 0){
            setApplicationState(pastApplicationState[pastApplicationState.length - 1])
            setNodes(pastNodes[pastNodes.length - 1])
            setnodeEdges(pastNodeEdges[pastNodeEdges.length - 1])
            setWordsToNews(pastWordToNewsMap[pastWordToNewsMap.length - 1])
            setInitialFilteredNews(searchesToRemove[searchesToRemove.length - 1])
            setFilteredNews(searchesToRemove[searchesToRemove.length - 1])
            setLineChartFiltedredNews(searchesToRemove[searchesToRemove.length-1])
            //setSelectedNewsId(searchesToRemove[searchesToRemove.length - 1][0]._id + "_" + searchesToRemove[searchesToRemove.length - 1][0]._source.parsed_section[searchesToRemove[searchesToRemove.length - 1][0]._source.image_positions[0]].order)
            setThreeDImageData(pastThreeDImageData[pastThreeDImageData.length-1])
        }
        else {
            setInitialFilteredNews(newsOfTheDay)
            setFilteredNews(newsOfTheDay)
            setLineChartFiltedredNews(newsOfTheDay)
            //setSelectedNewsId(newsOfTheDay[0]._id + "_" + newsOfTheDay[0]._source.parsed_section[newsOfTheDay[0]._source.image_positions[0]].order)
            setNodes([])
            setnodeEdges([])
            setWordsToNews([])
            setPastWordToNewsMap([])
            setApplicationState([])
            setPastApplicationState([])
            setThreeDImageData([])

        }

        setLoading(false)

    }


    return(

    <>

        <section className="webdesigntuts-workshop">
            <form>
                <input type="search" placeholder="What are you looking for?" defaultValue={searchTerm} onChange={(event) => {console.log(".l.", event.target); setSearchTerm(event.target.value)}}/>
                <button onClick={() => {handleMouseClickRequest(); }}>Search</button>
            </form>

        </section>

        <div style={{width: "22%",margin: "auto", marginTop: "0.5%", }}>
            {searchTermHistory.map((pastSearchTerm, idx) => (
                <>

                <span style={{fontWeight: 600, cursor: "pointer", float:"left", marginRight: "0.8%"}} onClick={() => {handleCrossMouseClick(idx); console.log("este é o past result",pastResultSearchNews)}}>&#10799;</span>
        <text style={{fontSize:"16px", fontFamily: "garamond", float:"left", fontWeight: 400, marginRight: "1.5%"}}> {(idx+1) + ". " + pastSearchTerm} </text>
                </>

            ))}

        </div>





    </>)


};


export default SearchBars;
