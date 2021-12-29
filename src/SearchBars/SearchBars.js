import {Card, Col, Row} from "react-bootstrap";
import axios from "axios";
import './SearchBars.css'
import React, {useEffect, useState} from "react";


const SearchBars = ({image, setFilteredNews, setKeywords, setThreeDImageData}) => {

    const [searchTerm, setSearchTerm] = useState("")
    const [searchTermHistory, setSearchTermHistory] = useState([])


const handleMouseClickRequest = () => {

    //https://dissertationserver.herokuapp.com/
    axios.get('http://localhost:3000/api/request/' + searchTerm,{
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'application/json'
        }
    }).then(response =>{


        setFilteredNews(response.data.searchWordResult.body.hits.hits)
        setKeywords(response.data.keywords)
        setThreeDImageData(response.data)

        console.log("esta é a nova data mas nova nova")
        console.log(response.data)
        console.log("oyeahyeah")
        console.log(response.data.searchWordResult.body.hits.hits)
        console.log(response.data.keywords)

    })
}


    return(

    <>

        <section className="webdesigntuts-workshop">
            <form>
                <input type="search" placeholder="What are you looking for?" onChange={(event) => {setSearchTerm(event.target.value)}}/>
                <button onClick={() => {handleMouseClickRequest(); setSearchTermHistory(searchTermHistory => [...searchTermHistory,searchTerm])}}>Search</button>
            </form>

        </section>

        <div style={{width: "22%",margin: "auto", marginTop: "0.5%", }}>
            {searchTermHistory.map((pastSearchTerm, idx) => (
                <>

                <span style={{fontWeight: 600, cursor: "pointer", float:"left", marginRight: "0.8%"}} onClick={(event => {console.log("entrei no x")})}>&#10799;</span>
        <text style={{fontSize:"16px", fontFamily: "garamond", float:"left", fontWeight: 400, marginRight: "1.5%"}}> {(idx+1) + ". " + pastSearchTerm} </text>
                </>

            ))}
        </div>
    </>)


};


export default SearchBars;
