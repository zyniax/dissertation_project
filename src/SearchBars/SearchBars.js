import {Card, Col, Row} from "react-bootstrap";
import axios from "axios";
import './SearchBars.css'
import {useEffect, useState} from "react";


const SearchBars = ({image, setFilteredNews, setKeywords}) => {

    const [searchTerm, setSearchTerm] = useState("")


const handleMouseClickRequest = () => {
    // axios({
    //     method: 'get',
    //     url: 'https://elasticsearch:muAwikri@api.novasearch.org/nscluster/elasticsearch/v7.13/nytimes-articles/_search?pretty',
    //     data: {
    //         "query": {
    //             "bool": {
    //                 "filter": {
    //                     "term": {
    //                         "lead_paragraph": "israel"
    //                     }
    //                 }
    //             }
    //         }
    //     },
    //     headers: {
    //         'Access-Control-Allow-Origin': 'http://localhost:3000',
    //         'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    //         'Access-Control-Allow-Headers': 'application/json'
    //     }
    // }).then((response) => {
    //     console.log(response.data)
    // })



    axios.get('http://localhost:3000/api/request/' + searchTerm,{
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'application/json'
        }
    }).then(response =>{

        console.log("esta é a nova data mas nova nova")
        console.log(response.data)
        setFilteredNews(response.data.searchWordResult.body.hits.hits)
        setKeywords(response.data.keywords)
        console.log("oyeahyeah")
        console.log(response.data.searchWordResult.body.hits.hits)
        console.log(response.data.keywords)
        //console.log(response.data.body.hits.hits)

    })
}


    return(

    <>

        <section className="webdesigntuts-workshop">
            {/*<form>*/}
                <input type="search" placeholder="What are you looking for?" onChange={(event) => {setSearchTerm(event.target.value)}}/>
                <button onClick={() => {handleMouseClickRequest()}}>Search</button>


            {/*</form>*/}
        </section>


    </>)


};


export default SearchBars;
