import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import ThreeMeshUI from 'three-mesh-ui'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import './3DImageVisualization.css';
//import { SelectionBox } from "./SelectionBox"
import { SelectionHelper } from './SelectionHelper';
import React, {useRef, useEffect, useState} from "react";
import axios from "axios";
import TextSprite from '@seregpie/three.text-sprite';
import {Card, Carousel} from "react-bootstrap";
import {FlakesTexture} from "three/examples/jsm/textures/FlakesTexture";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Button} from "primereact/button";
import {ImNewspaper} from "react-icons/im";
import {BsImage} from "react-icons/bs";
import {ProgressSpinner} from "primereact/progressspinner";




export const ThreeDImageVisualization = ({threeDImageData, applicationState, setApplicationState, pastApplicationState, pastNodeEdges, pastNodes, pastResultSearchNews, pastWordToNewsMap, setFilteredNews, setInitialFilteredNews, setKeywords, setLineChartFiltedredNews, setnodeEdges, setNodes, setPastApplicationState, setPastNodeEdges, setPastNodes, setPastResultSearchNews, setPastWordToNewsMap, setSearchTermHistory, setSelectedNewsId, setThreeDImageData, setWordsToNews, loading, clusterKeywords}) => {

    const ref = useRef();
    let imageIndex = 0
    const [clickedImage, setClickedImage] = useState("")
    const [index, setIndex] = useState(0);
    let ctrlKeyPressed = false

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const handleMultimodalClickRequest = (news) => {


        const news_id = news._id + "_" + news._source.parsed_section[news._source.image_positions[index]].order

        //https://dissertationserver.herokuapp.com/
        axios.get('http://localhost:3000/api/request/similarNews/byText/' + news_id ,{
            params: {
                state: applicationState,
                new_interaction:{"op": "text", "results": [{ "id": "0", "score": 1.70}, { "id": "1", "score": 2.70}]},
            },
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

        })
    }

    const handleImageMouseClickRequest = (news) => {




        const news_id = news._id + "_" + news._source.parsed_section[news._source.image_positions[index]].order

        //https://dissertationserver.herokuapp.com
        axios.get('http://localhost:3000/api/request/similarNews/byImage/' + news_id ,{
            params: {
                state: applicationState,
                new_interaction:{"op": "text", "results": [{ "id": "0", "score": 1.70}, { "id": "1", "score": 2.70}]},
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'application/json'
            }
        }).then(response =>{


            console.log("datad2", response.data)
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




        })
    }


    let sceneSpheres = [];
    let arrowHelperArray = []
    let additionalSphereKeywords = [];
    let lastIntersectedSpheres = []
    let createdPlanes = []
    let key = 0
    const widthMultiplier = 600
    const heightMultiplier = 600
    const depthMultiplier = 100
    const sphereRadiusMultiplier = 22





    useEffect(()=>{

        console.log("jkl")

        if(threeDImageData.length != 0){


            key++;
            const response = threeDImageData

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                50,
                900 / 900,
                0.1,
                1000
            )

            const renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true

                }
            )

            renderer.setSize(900, 900)
            renderer.setPixelRatio(window.devicePixelRatio)
            document.body.appendChild((renderer.domElement))
            ref.current.appendChild(renderer.domElement);

            //Create a new ambient light
            var light = new THREE.AmbientLight( 0x404040 ); // soft white light
            scene.add( light );

//Create a new directional light
            var light = new THREE.DirectionalLight( 0xfdfcf0, 0.4 )
            light.position.set(0,0,20)
            scene.add( light )




            // instantiate a loader
            const loader = new THREE.ImageLoader();
            const textureLoader = new THREE.TextureLoader();

// load a image resource
            loader.load(
                // resource URL
                './news',

                // onLoad callback
                function (image) {
                    // use the image, e.g. draw part of it on a canvas
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    context.drawImage(image, 100, 100);
                },

                // onProgress callback currently not supported
                undefined,

                // onError callback
                function () {
                    console.error('An error happened.');
                }
            );



            //const selectionBox = new SelectionBox( camera, scene );
            //const helper = new SelectionHelper( selectionBox, renderer, 'selectBox' );

            if(ctrlKeyPressed)
            scene.add(loader)


            const texture = new THREE.TextureLoader().load('https://large.novasearch.org/nytimes/images/206cd0c3321f129171d53aca579372662e99b8f946c01d27c42e10a8daf42f47.jpg');

// immediately use the texture for material creation

            var planeTest;

            function createPanels(response){
                console.log(response)

                for(var i = 0; i < threeDImageData.embeddings.length; i++){
                    const texture = new THREE.TextureLoader().load('https://large.novasearch.org/nytimes/images/206cd0c3321f129171d53aca579372662e99b8f946c01d27c42e10a8daf42f47.jpg');

                    texture.magFilter = THREE.LinearFilter;
                    texture.minFilter = THREE.LinearFilter;

                    const geometry = new THREE.PlaneGeometry(12, 12, 1);
                    const material = new THREE.MeshPhysicalMaterial({map: texture});



                    const plane= new THREE.Mesh(geometry, material);
                    //texture.minFilter = THREE.NearestFilter
                    //texture.magFilter = THREE.NearestFilter
                    planeTest = plane
                    plane.position.set(threeDImageData.embeddings[i][0] * widthMultiplier, threeDImageData.embeddings[i][1]*heightMultiplier, threeDImageData.embeddings[i][2] * depthMultiplier)
                    scene.add(plane)
                }

            }


            renderer.domElement.addEventListener( 'mousedown', function ( event ) {

                if (ctrlKeyPressed) {
                    //for (const item of selectionBox.collection)
                        //item.material.color.set(0xffffff);


                    let canvasBounds = renderer.domElement.getBoundingClientRect();

                    //selectionBox.startPoint.set(
                        //((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1,
                        //-((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1, 0);


                    mouse.x = ((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1;
                    mouse.y = -((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1;

                }
            })

            renderer.domElement.addEventListener( 'click', function ( event ) {

                raycaster.setFromCamera( mouse, camera );
                const intersects = raycaster.intersectObjects(scene.children, true);

                console.log("este ?? o intersects")
                console.log(intersects)

                // se a interse????o for maior do que 1 significa que clicou na esfera opaca e na fotografia com um s?? clique, ou seja, o clique apanha tanto a esfera opaca como a fotografia
                if(intersects.length > 1 && intersects[1].object.geometry.type === 'PlaneGeometry' && intersects[0].object.geometry.type === 'SphereGeometry' && intersects[0].object.visible === false && !intersects[0].object.arrowHelperSphere ){
                    flyToObject(intersects[1].object)
                }


                else if (intersects.length > 0 && (intersects[0].object.geometry.type === 'PlaneGeometry' || (intersects[0].object.geometry.type === 'SphereGeometry' && intersects[0].object.visible === true  && !intersects[0].object.arrowHelperSphere ))){
                    flyToObject(intersects[0].object)
                }





            } );

            renderer.domElement.addEventListener( 'pointermove', function ( event ) {

                // if ( helper.isDown ) {
                //
                //     //for ( let i = 0; i < selectionBox.collection.length; i ++ ) {
                //
                //     // selectionBox.collection[ i ].material.color.set( 0x000000 );
                //
                //     console.log("asdasd")
                //
                //     //}
                //
                //
                //     if(ctrlKeyPressed) {
                //         let canvasBounds = renderer.domElement.getBoundingClientRect();
                //
                //         selectionBox.endPoint.set(
                //             ((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1,
                //             -((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1, 0);
                //
                //         console.log("eventX", (event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left) * 2 - 1)
                //         console.log("eventY", -((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1)
                //
                //         const allSelected = selectionBox.select();
                //
                //         console.log("allSelected", allSelected)
                //
                //         // for (let i = 0; i < allSelected.length; i++) {
                //         //
                //         //     allSelected[i].material.color.set(0x000000);
                //         //
                //         // }
                //     }
                //
                // }
            })

            renderer.domElement.addEventListener( 'pointerup', function ( event ) {
                if(ctrlKeyPressed) {
                    let canvasBounds = renderer.domElement.getBoundingClientRect();

                    //selectionBox.endPoint.set(
                        //((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1,
                        //-((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1, 0);


                    //const allSelected = selectionBox.select();

                    //for (let i = 0; i < allSelected.length; i++) {

                        //allSelected[ i ].material.color.set( 0x000000 );

                    //}
                    console.log(camera.position)
                }

            } );

            renderer.domElement.addEventListener( 'pointermove', function ( event ) {

                let canvasBounds = renderer.domElement.getBoundingClientRect();

                mouse.x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
                mouse.y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;

                raycaster.setFromCamera( mouse, camera );
                const intersects = raycaster.intersectObjects(scene.children, true);
                let currentObject = null;



                if (intersects.length > 0) {

                    for(let i = 0; i < intersects.length; i++){

                    //console.log("intersects", intersects)
                    if (intersects[i].object.geometry.type === 'PlaneGeometry'){
                        //console.log(intersects[0] + "    " + threeDImageData.newsIds.length)
                        const indexOfImage = intersects[i].object.indexOfImage
                        //console.log("index da image", indexOfImage)
                        const newsIdAndImagePosition =  threeDImageData.newsIds[indexOfImage]

                        const newsId = newsIdAndImagePosition.split("_")[0]
                         imageIndex = newsIdAndImagePosition.split("_")[1]
                        //console.log("este ?? o imageIndex")
                        //console.log(imageIndex)

                        const news = threeDImageData.searchWordResult.body.hits.hits
                        console.log("news do 150", news[150])

                        for(let l = 0; l < news.length; l++){
                                if(news[l]._id == newsId){
                                    let newsImageAndIndex = []
                                    newsImageAndIndex[0] = news[l]
                                    newsImageAndIndex[1] = imageIndex
                                    setClickedImage(newsImageAndIndex)
                                    //console.log("true")
                                    console.log("KEYWORDS", news[l]._source.keywords)
                                    //console.log(newsImageAndIndex)
                                 }
                         }
                        }
                    }


                    if (intersects[0].object.geometry.type === 'SphereGeometry' && intersects[0].object.visible == true){
                        const newsLinks = ["https://madre.com.pt/wp-content/uploads/2021/07/IMG_8004-scaled.jpg", "https://www.jcs.pt/upload/1457541812.jpg", "https://www.fccnn.com/news/article769232.ece/alternates/BASE_LANDSCAPE/2222824%2Bfire.jpg", "https://wwmt.com/resources/media2/16x9/full/1015/center/80/7d7ef12f-5b4b-450c-af92-bd5a341a649e-large16x9_FIREGENERIC.png"]

                        const random = Math.floor(Math.random() * newsLinks.length);
                        //setClickedImage(newsLinks[random])

                        lastIntersectedSpheres.push(intersects[0].object);

                        const sphere = intersects[0].object;
                        const spherePosition = intersects[0].object.position;
                        const sphereRadius = intersects[0].object.geometry.parameters.radius;
                        console.log("sphereIndex", sphere.index)

                        if(!sphere.hasKeywords && !sphere.arrowHelperSphere){
                            addAdditionalKeywordsToSpheres(sphere, spherePosition, sphereRadius)
                        }

                    }


                } else {
                    if (currentObject === null){
                        //arrowHelper.cone.material.opacity = 1
                        if(lastIntersectedSpheres.length != 0){
                            removeAdditionalKeywordsInSpheres();
//
                        }

                    }

                }

            })

            // key handler
            // document.onkeydown = function(e) {
            //     //e.preventDefault();
            //     if (e.ctrlKey ) {             // left
            //         console.log("ola")
            //         controls.noPan = !controls.noPan
            //         ctrlKeyPressed = controls.noPan
            //     }
            // };

            function onMouseWheel(event) {



                // zoom out
                if(event.wheelDelta>0){

                    for(let i = 0; i < sceneSpheres.length; i++){

                        if(sceneSpheres[i].visible == true && camera.position.z <= (sceneSpheres[i].position.z + sceneSpheres[i].geometry.boundingSphere.radius + 100) && (camera.position.x + updatedInitialWidthFov/2 > sceneSpheres[i].position.x - sceneSpheres[i].geometry.boundingSphere.radius && camera.position.x - updatedInitialWidthFov/2 < sceneSpheres[i].position.x + sceneSpheres[i].geometry.boundingSphere.radius) && (camera.position.y + updatedHeightFov/2 > sceneSpheres[i].position.y + sceneSpheres[i].geometry.boundingSphere.radius && camera.position.y - updatedInitialWidthFov/2 < sceneSpheres[i].position.y - sceneSpheres[i].geometry.boundingSphere.radius) ){


                                const indexesOfImagesInsideSphere = sceneSpheres[i].pointsIndexes
                                createPanelsOfCluster(indexesOfImagesInsideSphere, i)
                                sceneSpheres[i].visible = false
                                console.log(sceneSpheres[i].pointsIndexes)


                            //console.log(object)
                            //console.log(sceneSpheres[i])
                        }
                        if(sceneSpheres[i].visible == false && sceneSpheres[i].clicked == true){

                            const indexesOfImagesInsideSphere = sceneSpheres[i].pointsIndexes


                            for(let j = 0; j < indexesOfImagesInsideSphere.length; j++) {

                                console.log(threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][2])
                                console.log(threeDImageData.embeddings[indexesOfImagesInsideSphere])
                                if(camera.position.z - (threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][2] * depthMultiplier) < 135 && createdPlanes[i] != undefined && createdPlanes[i][j] != undefined && createdPlanes[i][j].showingHighQualityImage == false ){


                                    const newsIdAndImagePosition =  threeDImageData.newsIds[indexesOfImagesInsideSphere[j]]

                                    //const newsIdAndImagePosition =  threeDImageData.newsIds[indexOfImage]

                                    const newsId = newsIdAndImagePosition.split("_")[0]
                                    imageIndex = newsIdAndImagePosition.split("_")[1]

                                    const news = threeDImageData.searchWordResult.body.hits.hits
                                    console.log("news do 150", news[150])
                                    let newsImageAndIndex = []

                                    for(let l = 0; l < news.length; l++){
                                        if(news[l]._id == newsId){

                                            newsImageAndIndex[0] = news[l]
                                            newsImageAndIndex[1] = imageIndex
                                            setClickedImage(newsImageAndIndex)
                                            //console.log("true")
                                            console.log("KEYWORDS", news[l]._source.keywords)
                                            //console.log(newsImageAndIndex)
                                        }
                                    }


                                    const geometry = new THREE.PlaneGeometry(12, 12, 1);
                                    const texture = new THREE.TextureLoader().load("https://large.novasearch.org/nytimes/images/" + newsImageAndIndex[0]._source.parsed_section[newsImageAndIndex[0]._source.image_positions[newsImageAndIndex[1]]].hash + ".jpg");

                                    // texture.magFilter = THREE.LinearFilter;
                                    // texture.minFilter = THREE.LinearFilter;
                                    // texture.needsUpdate = true;

                                    const material = new THREE.MeshPhysicalMaterial({map: texture});
                                    const plane = new THREE.Mesh(geometry, material);

                                        // texture.magFilter = THREE.LinearFilter;
                                        // texture.minFilter = THREE.LinearFilter;
                                        // texture.needsUpdate = true;


                                        plane.showingBadQualityImage = true
                                        plane.showingMediumQualityImage = true
                                        plane.showingHighQualityImage = true
                                        plane.indexOfImage = indexesOfImagesInsideSphere[j]

                                        const sphereRadius = parseInt(sceneSpheres[i].geometry.parameters.radius)

                                        planeTest = plane
                                        plane.position.set(threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][0] * widthMultiplier + sphereRadius * sphereRadiusMultiplier, threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][1] * heightMultiplier + sphereRadius * sphereRadiusMultiplier, threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][2] * depthMultiplier)
                                        //plane.position.set(Math.random()* 400, Math.random() * 400, Math.random() * 100)
                                        const planeMesh = createdPlanes[i][j]
                                        //console.log(planeMesh)
                                        planeMesh.geometry.dispose();
                                        planeMesh.material.dispose();
                                        texture.dispose();
                                        scene.remove(planeMesh);

                                        createdPlanes[i][j] = plane
                                        scene.add(plane)

                                    console.log("pre3")

                                }
                                 if(camera.position.z - (threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][2] * depthMultiplier) < 230 && createdPlanes[i] != undefined && createdPlanes[i][j] != undefined && createdPlanes[i][j].showingMediumQualityImage == false  && createdPlanes[i][j].showingHighQualityImage == false){


                                     const newsIdAndImagePosition =  threeDImageData.newsIds[indexesOfImagesInsideSphere[j]]

                                     //const newsIdAndImagePosition =  threeDImageData.newsIds[indexOfImage]

                                     const newsId = newsIdAndImagePosition.split("_")[0]
                                     imageIndex = newsIdAndImagePosition.split("_")[1]

                                     const news = threeDImageData.searchWordResult.body.hits.hits
                                     console.log("news do 150", news[150])
                                     let newsImageAndIndex = []

                                     for(let l = 0; l < news.length; l++){
                                         if(news[l]._id == newsId){

                                             newsImageAndIndex[0] = news[l]
                                             newsImageAndIndex[1] = imageIndex
                                             setClickedImage(newsImageAndIndex)
                                             //console.log("true")
                                             console.log("KEYWORDS", news[l]._source.keywords)
                                             //console.log(newsImageAndIndex)
                                         }
                                     }


                                     const geometry = new THREE.PlaneGeometry(12, 12, 1);
                                     const texture = new THREE.TextureLoader().load("https://large.novasearch.org/nytimes/images/" + newsImageAndIndex[0]._source.parsed_section[newsImageAndIndex[0]._source.image_positions[newsImageAndIndex[1]]].hash + ".jpg");

                                     // texture.magFilter = THREE.LinearFilter;
                                     // texture.minFilter = THREE.LinearFilter;
                                     // texture.needsUpdate = true;

                                     const material = new THREE.MeshPhysicalMaterial({map: texture});
                                     const plane = new THREE.Mesh(geometry, material);

                                     // texture.magFilter = THREE.LinearFilter;
                                     // texture.minFilter = THREE.LinearFilter;
                                     // texture.needsUpdate = true;


                                     plane.showingBadQualityImage = true
                                     plane.showingMediumQualityImage = true
                                     plane.showingHighQualityImage = false
                                     plane.indexOfImage = indexesOfImagesInsideSphere[j]

                                     const sphereRadius = parseInt(sceneSpheres[i].geometry.parameters.radius)

                                     planeTest = plane
                                     plane.position.set(threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][0] * widthMultiplier + sphereRadius * sphereRadiusMultiplier, threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][1] * heightMultiplier + sphereRadius * sphereRadiusMultiplier, threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][2] * depthMultiplier)
                                     //plane.position.set(Math.random()* 400, Math.random() * 400, Math.random() * 100)
                                     const planeMesh = createdPlanes[i][j]
                                     //console.log(planeMesh)
                                     planeMesh.geometry.dispose();
                                     planeMesh.material.dispose();
                                     texture.dispose();
                                     scene.remove(planeMesh);

                                     createdPlanes[i][j] = plane
                                     scene.add(plane)

                                     console.log("pre3")

                                }
                            }

                        }
                    }
                }
                // zoom out, but not through object
                else if(event.wheelDelta < 0){

                    for(let i = 0; i < sceneSpheres.length; i++){

                        if(camera.position.z > (sceneSpheres[i].position.z + sceneSpheres[i].geometry.boundingSphere.radius + 100) || (camera.position.x + updatedInitialWidthFov/2 < sceneSpheres[i].position.x - sceneSpheres[i].geometry.boundingSphere.radius || camera.position.x - updatedInitialWidthFov/2 > sceneSpheres[i].position.x + sceneSpheres[i].geometry.boundingSphere.radius) || (camera.position.y + updatedHeightFov/2 < sceneSpheres[i].position.y - sceneSpheres[i].geometry.boundingSphere.radius || camera.position.y - updatedInitialWidthFov/2 > sceneSpheres[i].position.y + sceneSpheres[i].geometry.boundingSphere.radius) ){

                            // const geometry = new THREE.SphereGeometry(2, 100, 1);
                            // const material = new THREE.MeshBasicMaterial({color: "white"});
                            // const smallSphere = new THREE.Mesh(geometry, material);
                            // //smallSphere.position.set(sceneSpheres[i].position.x, sceneSpheres[i].position.y + sceneSpheres[i].geometry.boundingSphere.radius, sceneSpheres[i].position.z + sceneSpheres[i].geometry.boundingSphere.radius)
                            // smallSphere.position.set(camera.position.x, camera.position.y + updatedHeightFov/2, sceneSpheres[i].z)
                            // scene.add(smallSphere)

                            if(sceneSpheres[i].visible == false && sceneSpheres[i].clicked == true){

                                const indexesOfImagesInsideSphere = sceneSpheres[i].pointsIndexes
                                console.log("entrei na parte das bolas brancas")
                                console.log(sceneSpheres[i].pointsIndexes)


                                for(let p = 0; p < createdPlanes.length; p++){


                                    if(createdPlanes[p] != undefined)
                                    for (let j = createdPlanes[p].length; j > 0; j--) {
                                        const planeMesh = createdPlanes[p].pop()
                                        //console.log(planeMesh)
                                        planeMesh.geometry.dispose();
                                        planeMesh.material.dispose();
                                        texture.dispose();
                                        scene.remove(planeMesh);
                                        //scene.dispose(createdPlanes.pop().geometry.dispose())
                                        //scene.dispose(createdPlanes.pop().material.dispose())
                                        //scene.remove(createdPlanes.pop())
                                        //console.log(sceneChildrens[j])
                                    }
                                }

                                    // for(let i = 0; i < indexesOfImagesInsideSphere.length; i++){
                                    //     //const texture = new THREE.TextureLoader().load('https://large.novasearch.org/nytimes/images/206cd0c3321f129171d53aca579372662e99b8f946c01d27c42e10a8daf42f47.jpg');
                                    //     const geometry = new THREE.SphereGeometry(2, 100, 1);
                                    //     const material = new THREE.MeshBasicMaterial({color: "white"});
                                    //     const smallSphere = new THREE.Mesh(geometry, material);
                                    //     smallSphere.position.set(threeDImageData.embeddings[indexesOfImagesInsideSphere[i]][0] * widthMultiplier, threeDImageData.embeddings[indexesOfImagesInsideSphere[i]][1] * heightMultiplier, threeDImageData.embeddings[indexesOfImagesInsideSphere[i]][2] * depthMultiplier)
                                    //     scene.add(smallSphere)
                                    //
                                    // }

                                    //sceneSpheres.forEach(sphere => sphere.visible = true)


                            }
                            console.log("createdPlanes", createdPlanes)
                            //console.log("createdPlanes[0]", createdPlanes[0])
                            //console.log("createdPlanes[0].length", createdPlanes[0].length)
                            //&& createdPlanes[0] != undefined && createdPlanes[0].length == 0
                            if(createdPlanes != undefined ){

                                console.log("createdPlanes", createdPlanes)
                                sceneSpheres[i].visible = true
                                sceneSpheres[i].clicked = false
                            }

                        }
                    }
                }

            }

            var hasBeenFixed = false

            window.addEventListener( 'mousewheel', onMouseWheel, false );
            window.addEventListener("", fixTrackBalls, false)
            //
            function fixTrackBalls(){
                if(!hasBeenFixed){
                    console.log("ABCD")
                    controls = new TrackballControls(camera, renderer.domElement);
                    defineTrackballControlsSettings()
                }
                hasBeenFixed = true
            }






            //createPanels(response)
            //createSmallPoints(response)

            scene.background = new THREE.Color("#171717")
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            // function dbclick( event ) {
            //
            //     // calculate mouse position in normalized device coordinates
            //     // (-1 to +1) for both components
            //     let canvasBounds = renderer.domElement.getBoundingClientRect();
            //     mouse.x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
            //     mouse.y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;
            //
            //     window.requestAnimationFrame(render);
            //
            // }

            function render() {

                // update the picking ray with the camera and mouse position
                raycaster.setFromCamera( mouse, camera );

                // calculate objects intersecting the picking ray
                const intersects = raycaster.intersectObjects(scene.children, false);


                if(intersects.length > 0){
                    var pickedObject = intersects[0].object
                    pickedObject.material.color.set( 0xff0000 );
                    //Obter a source da imagem do object clickado

                    for( var i = scene.children.length - 1; i >= 0; i--) {
                        var obj = scene.children[i];
                        scene.remove(obj);
                    }

                    axios.get('http://localhost:3000/api/request/umap3D',{
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                            'Access-Control-Allow-Headers': 'application/json'
                        }
                    }).then(response => {

                        createPanels(response)


                    })
                    renderer.render( scene, camera );
                }




                renderer.render( scene, camera );

            }

            //window.addEventListener( 'dblclick', dbclick, false );
            //window.addEventListener('mouseover', ohHover, false);


            // const containerSize = 2
            //
            //     const container = new ThreeMeshUI.Block({
            //         ref: "container",
            //         padding: 0.050 * containerSize,
            //         fontFamily: './Robot-mds.json',
            //         fontTexture: './Roboto-msdf.png',
            //         fontColor: new THREE.Color(0xffffff),
            //         backgroundOpacity: 1,
            //         offset: 5
            //     });
            //
            //
            //
            //     container.position.set(400, 400, 100);
            //     // container.rotation.x = -0.55;
            //     scene.add(container);
            //
            //
            //     const title = new ThreeMeshUI.Block({
            //         height: 8 * containerSize,
            //         width: 60 * containerSize,
            //         margin: 1.0 * containerSize,
            //         justifyContent: "center",
            //         fontSize: 3.6 * containerSize,
            //     });
            //
            //     title.add(
            //         new ThreeMeshUI.Text({
            //             content: "spiny bush viper",
            //         })
            //     );
            //
            //     container.add(title);
            //
            //     //
            //
            //     const leftSubBlock = new ThreeMeshUI.Block({
            //         height: 38 * containerSize,
            //         width: 40 * containerSize,
            //         margin: 1.00 * containerSize,
            //         padding: 0.50 * containerSize,
            //         alignContent: "left",
            //         justifyContent: "end",
            //         offset: 1.0* containerSize
            //     });
            //
            //     const caption = new ThreeMeshUI.Block({
            //         height: 1.4 * containerSize,
            //         width: 7.4 * containerSize,
            //         alignContent: "center",
            //         justifyContent: "center",
            //     });
            //
            //     caption.add(
            //         new ThreeMeshUI.Text({
            //             content: "Mind your fingers",
            //             fontSize: 0.8 * containerSize,
            //         })
            //     );
            //
            //     leftSubBlock.add(caption);
            //
            //     //
            //
            //     const rightSubBlock = new ThreeMeshUI.Block({
            //         margin: 0.50 * containerSize,
            //     });
            //
            //     const subSubBlock1 = new ThreeMeshUI.Block({
            //         height: 7.0 * containerSize,
            //         width: 10 * containerSize,
            //         margin: 0.50 * containerSize,
            //         padding: 0.4 * containerSize,
            //         fontSize: 1.2 * containerSize,
            //         justifyContent: "center",
            //         backgroundOpacity: 0,
            //     }).add(
            //         new ThreeMeshUI.Text({
            //             content: "Known for its extremely keeled dorsal scales that give it a ",
            //         }),

            function getNewInstance(keyword) {


                console.log("clusterkeywords", clusterKeywords)

                if ( keyword != undefined) {

                console.log("vamos ver se d??", keyword)
                instance = new TextSprite({
                    alignment: 'center',
                    color: '#db4035',
                    fontFamily: '"Times New Roman", Times, serif',
                    fontSize: 15,
                    fontWeight: "900",
                    fontStyle: 'areal',
                    text: [
                        keyword,


                    ].join('\n'),
                });
                return instance
            }
            return ""
        }


            function addAdditionalKeywordsToSpheres(sphere, spherePosition, sphereRadius){

                const mostCommonKeywordsArray = getMostCommonKeywords(sphere, sphere.index)

                console.log("moas common keywords", mostCommonKeywordsArray)


                sphere.hasKeywords = true
                instance = getNewInstance(mostCommonKeywordsArray[1][0])
                if(instance != ""){
                    const wordDistance = instance.text.length * 3.5
                    instance.position.set(spherePosition.x + sphereRadius + 7 + wordDistance, spherePosition.y, spherePosition.z)
                    additionalSphereKeywords.push(instance)
                    scene.add(instance)
                }




                instance = getNewInstance(mostCommonKeywordsArray[2][0])
                if(instance != "") {
                    const wordDistance = instance.text.length * 3.5
                    instance.position.set(spherePosition.x - sphereRadius - 7 - wordDistance, spherePosition.y, spherePosition.z)
                    additionalSphereKeywords.push(instance)
                    scene.add(instance)
                }



                getNewInstance(mostCommonKeywordsArray[3][0])
                if(instance != "") {
                    instance.position.set(spherePosition.x, spherePosition.y - sphereRadius - 10, spherePosition.z)
                    additionalSphereKeywords.push(instance)
                    scene.add(instance)
                }
            }

            function removeAdditionalKeywordsInSpheres(){

                for(let i = 0; i < lastIntersectedSpheres.length; i++)
                    lastIntersectedSpheres[i].hasKeywords = false

                console.log("pre1")
                lastIntersectedSpheres = []


                for(let i = 0 ; i < additionalSphereKeywords.length; i++)
                    scene.remove(additionalSphereKeywords[i])


                console.log("pre2")
                additionalSphereKeywords = []

            }
            //
            //         new ThreeMeshUI.Text({
            //             content: "bristly",
            //             fontColor: new THREE.Color(0x92e66c),
            //         }),
            //
            //         new ThreeMeshUI.Text({
            //             content: " appearance.",
            //         })
            //     );
            //
            //     const subSubBlock2 = new ThreeMeshUI.Block({
            //         height: 24.6 * containerSize,
            //         width: 16 * containerSize,
            //         margin: 0.2 * containerSize,
            //         padding: 0.4 * containerSize,
            //         fontSize: 1.10 * containerSize,
            //         alignContent: "left",
            //         backgroundOpacity: 0,
            //     }).add(
            //         new ThreeMeshUI.Text({
            //             content:
            //                 "The males of this species grow to maximum total length of 73 cm (29 in): body 58 cm (23 in), tail 15 cm (5.9 in). Females grow to a maximum total length of 58 cm (23 in). The males are surprisingly long and slender compared to the females.\nThe head has a short snout, more so in males than in females.\nThe eyes are large and surrounded by 9???16 circumorbital scales. The orbits (eyes) are separated by 7???9 scales.",
            //         })
            //     );
            //
            //     rightSubBlock.add(subSubBlock1, subSubBlock2);
            //
            //     //
            //
            //     const contentContainer = new ThreeMeshUI.Block({
            //         contentDirection: "row",
            //         padding: 0.4 * containerSize,
            //         margin: 0.5 * containerSize,
            //         backgroundOpacity: 0,
            //     });
            //
            //     contentContainer.add(leftSubBlock, rightSubBlock);
            //     container.add(contentContainer);
            //
            //     //
            //
            //     new THREE.TextureLoader().load("spiny_bush_viper.jpg", (texture) => {
            //         leftSubBlock.set({
            //             backgroundTexture: texture,
            //         });
            //     });











            //scene.add( clusterSphere );


            let envmaploader = new THREE.PMREMGenerator(renderer);
            let clusterSphere;
            let instance;
            //renderer.outputEncoding = THREE.sRGBEncoding
            new RGBELoader().load("./cayley_interior_4k.hdr", function (hdrmap) {

                let envmap = envmaploader.fromCubemap(hdrmap);
                let texture2 = new THREE.CanvasTexture(new FlakesTexture())
                texture2.wrapS = THREE.RepeatWrapping;
                texture2.wrapT = THREE.RepeatWrapping;
                texture2.repeat.x = 10;
                texture2.repeat.y = 6;

                const ballMaterial = {
                    clearcoat: 1.0,
                    cleacoatRoughness: 0.1,
                    metalness: 0.9,
                    roughness: 0.5,
                    color: 0xffffff,
                    normalMap: texture2,
                    transparent: true,
                    normalScale: new THREE.Vector2(0.15, 0.15),
                    envMap: envmap.texture
                }


                for(let i = 0; i < threeDImageData.clustersPoints.length; i+= 6){
                    const clusterPoints = threeDImageData.clustersPoints
                    const midwayPoints = new THREE.Vector3((((clusterPoints[i+1] - clusterPoints[i])) * widthMultiplier) / 2, (((clusterPoints[i+3] - clusterPoints[i+2])) * heightMultiplier) / 2, (((clusterPoints[i+5] - clusterPoints[i+4]) * depthMultiplier) / 2))
                    const sphereCenter = new THREE.Vector3(((((clusterPoints[i+1] + clusterPoints[i]) / 2) ) * widthMultiplier), ((((clusterPoints[i+3] + clusterPoints[i+2]) / 2) ) * heightMultiplier), ((((clusterPoints[i+5] + clusterPoints[i+4]) / 2)) * depthMultiplier));
                    const sphereRadius = Math.sqrt((midwayPoints.x ** 2) + (midwayPoints.y ** 2) + (midwayPoints.z ** 2))
                    console.log("este ?? o raio da esfera")
                    console.log(sphereRadius)
                    console.log("este ?? o centro da esfera")
                    console.log(sphereCenter)

                    clusterSphere = new THREE.Mesh(new THREE.SphereGeometry(sphereRadius, 50, 500),
                        new THREE.MeshPhysicalMaterial({
                            transparent: true,
                            opacity: 1.0,
                            map: new THREE.TextureLoader().load('./news.jpg')
                        }))

                    // tem de ser i%6 porque o cluster points(for de cima) aumenta de 6 em 6 e o clusterIndexes aumenta de 1 em 1


                    clusterSphere.position.set(sphereCenter.x  + sphereRadius * sphereRadiusMultiplier, sphereCenter.y + sphereRadius * sphereRadiusMultiplier, sphereCenter.z)
                    console.log("entrei neste for que me esta a irritar eae")
                    let ballGeo = new THREE.SphereGeometry(sphereRadius, 64, 30)
                    let ballMat = new THREE.MeshPhysicalMaterial(ballMaterial)
                    let ballMesh = new THREE.Mesh(ballGeo, ballMat)
                    ballMesh.position.set(clusterSphere.position.x, clusterSphere.position.y, clusterSphere.position.z);
                    ballMesh.hasKeywords = false;
                    ballMesh.index = i/6
                    ballMesh.pointsIndexes = threeDImageData.clusterIndexes[i/6]
                    ballMesh.material.opacity = 0.2;

                    const mostCommonKeywords = getMostCommonKeywords(ballMesh)

                    let instance = new TextSprite({
                        alignment: 'center',
                        color: '#db4035',
                        fontFamily: '"Times New Roman", Times, serif',
                        fontSize: 15,
                        fontWeight: "900",
                        fontStyle: 'areal',
                        text: [
                            mostCommonKeywords[0][0],

                        ].join('\n'),
                    });

                    instance.position.set(sphereCenter.x + sphereRadius * sphereRadiusMultiplier,sphereCenter.y + sphereRadius + 10 + sphereRadius * sphereRadiusMultiplier, sphereCenter.z)
                    scene.add(instance)
                    scene.add(ballMesh)
                    sceneSpheres.push(ballMesh)
                }




                for(let i = 0; i < sceneSpheres.length; i++){

                    const dir = new THREE.Vector3(sceneSpheres[i].position.x, sceneSpheres[i].position.y, sceneSpheres[i].position.z);
                    //normalize the direction vector (convert to vector of length 1)
                    dir.normalize();

                    const origin = new THREE.Vector3( camera.position.x, camera.position.y + updatedHeightFov / 2 - 100, 100 );
                    const length = 50;
                    const hex = 0x004999;


                    const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
                    arrowHelper.line.visible = false
                    arrowHelper.setLength (50, 20, 12)
                    console.log(arrowHelper.cone)
                    scene.add( arrowHelper );
                    //arrowHelperArray[0].position.x = camera.position.x //- 200
                    //arrowHelperArray[0].position.y = camera.position.y + updatedHeightFov / 2 - 100;
                    arrowHelperArray.push(arrowHelper)


                    console.log("esta ?? a clustersphere")
                    // eslint-disable-next-line no-unused-expressions


                }



            })

            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.25;

            // const container = new ThreeMeshUI.Block({
            //     height: 75,
            //     width: 50,
            // });
            //

            instance = new TextSprite({
                alignment: 'center',
                color: '#db4035',
                fontFamily: '"Times New Roman", Times, serif',
                fontSize: 15,
                fontWeight: "900",
                fontStyle: 'areal',
                text: [
                    'Cats',


                ].join('\n'),
            });

            // instance.position.set(100,100, 100)
            // scene.add(instance)
            // container.position.set( 400, 400, 400 );
            // //container.rotation.x = -0.55;
            //
            // const imageBlock = new ThreeMeshUI.Block({
            //     height: 50,
            //     width: 50,
            //     offset: 5 // distance separating the inner block from its parent
            // });
            //
            // const textBlock = new ThreeMeshUI.Block({
            //     height: 20,
            //     width: 40,
            //     margin: 2.5, // like in CSS, horizontal and vertical distance from neighbour
            //     offset: 2.5, // distance separating the inner block from its parent
            // });
            //
            // textureLoader.load( './moon_texture.jpg', (texture)=> {
            //
            //     imageBlock.set({ backgroundTexture: texture });
            //
            // });
            //
            // container.set({
            //     fontFamily: './Robot-mds.json',
            //     fontTexture: './Roboto-msdf.png',
            // });
            //
            // const text = new ThreeMeshUI.Text({
            //     content: 'The spiny bush viper is known for its extremely keeled dorsal scales.'
            // });
            //
            //  textBlock.add( text );
            //
            // text.set({
            //     fontColor: new THREE.Color( 0xd2ffbd ),
            //     fontSize: 3.5
            // });
            //
            // textBlock.set({
            //     alignContent: 'right', // could be 'center' or 'left'
            //     justifyContent: 'end', // could be 'center' or 'start'
            //     padding: 1.5
            // });
            //
            // textBlock.add(
            //     new ThreeMeshUI.Text({
            //         content: ' Mind your fingers.',
            //         fontSize: 4.5,
            //         fontColor: new THREE.Color( 0xefffe8 )
            //     })
            // );
            //
            // container.add( imageBlock, textBlock );
            //
            // scene.add( container );

            // function ohHover(event){
            //     console.log("a mexer")
            //     // update the picking ray with the camera and mouse position
            //     console.log(mouse.x)
            //     console.log(mouse.y)
            //
            //     var raycaster = new THREE.Raycaster();
            //     raycaster.setFromCamera( mouse, camera );
            //     var intersects = raycaster.intersectObjects( arrowHelper );
            //     console.log(arrowHelper.cone.position)
            //
            //     if(intersects.length > 0) {
            //         intersects.cone.opacity = 0
            //         console.log("entrouaqui")
            //
            //     }
            //         //Obter a source da imagem do object clickado
            // }

            // Instantiate a loader
            const GLTLloader = new GLTFLoader();

            // instantiate a loader


// set options if needed
            const loaderImageBitMap = new THREE.ImageBitmapLoader();
            loaderImageBitMap.setOptions( { imageOrientation: 'flipY' } );

// load a image resource





            function createPanelsOfCluster(indexesOfImagesInsideSphere, i){

                for(let j = 0; j < indexesOfImagesInsideSphere.length; j++){

                    //talvez mudar s?? para loader
                    console.log("indexesdasimagesdentrodaesfera", indexesOfImagesInsideSphere)
                    console.log("aba", threeDImageData)

                        // onLoad callback
                    const newsIdAndImagePosition =  threeDImageData.newsIds[indexesOfImagesInsideSphere[j]]

                    //const newsIdAndImagePosition =  threeDImageData.newsIds[indexOfImage]

                    const newsId = newsIdAndImagePosition.split("_")[0]
                    imageIndex = newsIdAndImagePosition.split("_")[1]
                    //console.log("este ?? o imageIndex")
                    //console.log(imageIndex)

                    const news = threeDImageData.searchWordResult.body.hits.hits
                    console.log("news do 150", news[150])
                    let newsImageAndIndex = []

                    for(let l = 0; l < news.length; l++){
                        if(news[l]._id == newsId){

                            newsImageAndIndex[0] = news[l]
                            newsImageAndIndex[1] = imageIndex
                            setClickedImage(newsImageAndIndex)
                            //console.log("true")
                            console.log("KEYWORDS", news[l]._source.keywords)
                            //console.log(newsImageAndIndex)
                        }
                    }


                    const geometry = new THREE.PlaneGeometry(12, 12, 1);
                    const texture = new THREE.TextureLoader().load("https://large.novasearch.org/nytimes/images/" + newsImageAndIndex[0]._source.parsed_section[newsImageAndIndex[0]._source.image_positions[newsImageAndIndex[1]]].hash + ".jpg");

                            // texture.magFilter = THREE.LinearFilter;
                            // texture.minFilter = THREE.LinearFilter;
                            // texture.needsUpdate = true;

                            const material = new THREE.MeshPhysicalMaterial( { map: texture } );
                            const plane= new THREE.Mesh(geometry, material);
                            const sphereRadius = parseInt(sceneSpheres[i].geometry.parameters.radius)




                            planeTest = plane
                            plane.position.set((threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][0] * widthMultiplier) + sphereRadius * sphereRadiusMultiplier, threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][1] * heightMultiplier + sphereRadius * sphereRadiusMultiplier, threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][2] * depthMultiplier)
                            //plane.position.set(Math.random()* 400, Math.random() * 400, Math.random() * 100)
                            if(createdPlanes[i] == undefined)
                                createdPlanes[i] = []


                            plane.showingBadQualityImage = false
                            plane.showingMediumQualityImage = false
                            plane.showingHighQualityImage = false
                    console.log("abcd", indexesOfImagesInsideSphere)
                            plane.indexOfImage = indexesOfImagesInsideSphere[j]
                            createdPlanes[i].push(plane)
                            scene.add(plane)

                    // const geometry = new THREE.PlaneGeometry(4, 4, 1);
                    // const material = new THREE.MeshBasicMaterial({map: texture});

                }

            }

            function flyToObject(clickedObject) {
                // get a new camera to reset .up and .quaternion on this.camera

                //camera.position.set(0,0,900)
                //console.log(controls.type)
                // if (controls.type === 'trackball') {
                //     // console.log("entrei entrei")
                //     // console.log(controls.target)
                //     //controls.target.set(0, 0, 900);
                //     //defineTrackballControlsSettings()
                //     var time = 0,
                //         q0 = camera.quaternion.clone();
                //     new TWEEN.Tween(controls.target)
                //         .to({
                //             x: 0,
                //             y: 0,
                //             z: 900
                //         }, 500)
                //     //controls.update();
                // }
                // console.log("entrei")
                // console.log(planeTest.position.x)
                // console.log(planeTest.position.y)
                // console.log(camera.position)

                var quaternion = controls.quaternion0

                var objectPosition = clickedObject.position

                var camera2 = new THREE.PerspectiveCamera(
                    50,
                    window.innerWidth / window.innerHeight,
                    0.1,
                    1000
                )

                var lastPosition;
                var time = 0,
                    q0 = camera.quaternion.clone();


                let index = 0
                //find spheres k
                for(let k = 0; k < sceneSpheres.length; k++)
                    if(clickedObject.uuid === sceneSpheres[k].uuid)
                        index = k

                console.log("estye ?? o meu index")
                console.log(index)




                if(clickedObject.geometry.type === 'PlaneGeometry')
                    controls.target.set(objectPosition.x, objectPosition.y, objectPosition.z + 30)
                else if(clickedObject.geometry.type === 'SphereGeometry' ){
                    console.log(clickedObject)
                    const sphereRadius = clickedObject.geometry.boundingSphere.radius
                    controls.target.set(objectPosition.x, objectPosition.y, objectPosition.z + sphereRadius + 100)
                    const indexesOfImagesInsideSphere = clickedObject.pointsIndexes
                    createPanelsOfCluster(indexesOfImagesInsideSphere, index)

                }



                console.log(clickedObject)
                console.log("este ?? o clickedpanel")

                var position = { x : objectPosition.x, y: objectPosition.y };
                var target = { x : 0, y: 0 };
                //console.log("entrei no tween")

                var tween = new TWEEN.Tween(camera.position).to(controls.target, 1000);
                tween.easing(TWEEN.Easing.Cubic.Out)
                //tween.delay(500)
                //controls = new TrackballControls(camera, renderer.domElement);
                //defineTrackballControlsSettings()
                tween.onUpdate(function(){

                    time++;
                    var deg = time / (60); // scale time 0:1
                    THREE.Quaternion.slerp(q0, camera2.quaternion, camera.quaternion, deg);
                    //console.log(camera.position)
                    lastPosition = camera.position

                });
                tween.onComplete(function (){
                    //camera.position.z = controls.target.z
                    //THREE.Quaternion.slerp(q0, camera.quaternion, camera.quaternion, 1000/60);
                    var q = camera2.quaternion,
                        p = camera2.position,
                        u = camera2.up,
                        c = controls.target,
                        zMin = 1
                    camera.position.set(lastPosition.x, lastPosition.y, lastPosition.z);
                    camera.up.set(u.x, u.y, u.z);
                    camera.quaternion.set(q.x, q.y, q.z, q.w);
                    controls.target = new THREE.Vector3(c.x, c.y, zMin);
                    controls.update();
                    if(clickedObject.geometry.type === 'SphereGeometry'){

                        sceneSpheres.forEach(sphere =>( sphere.visible = false))
                        clickedObject.clicked = true
                        removeAdditionalKeywordsInSpheres();
                    }


                })

                tween.start()



            }



            // function tweenCamera() {
            //
            //     controls.enabled = false;
            //
            //     var targetPosition = new THREE.Vector3( 10, 10, 10 );
            //
            //     var position = new THREE.Vector3().copy( camera.position );
            //     controls.target.set(planeTest.position.x, planeTest.position.y, planeTest.position.z + 10)
            //
            //     var tween = new TWEEN.Tween( position )
            //         .to( controls.target, 1000 )
            //         .easing( TWEEN.Easing.Back.InOut )
            //         .onUpdate( function () {
            //             camera.position.copy( position );
            //             camera.lookAt( targetPosition );
            //         } )
            //         .onComplete( function () {
            //             camera.position.copy( targetPosition );
            //             camera.lookAt( targetPosition );
            //             controls.enabled = true;
            //         } )
            //         .start();
            //
            // }
            // }
            //prepare scope globals to transition camera

            //     .onUpdate(() => {
            //
            //         time++;
            //         var deg = time / (5 * 60); // scale time 0:1
            //         THREE.Quaternion.slerp(q0, camera.quaternion, camera.quaternion, deg);
            //     })}
            //     // .onComplete(() => {
            //     var q = camera.quaternion,
            //         p = camera.position,
            //         u = camera.up,
            //         c = controls.target
            //         //zMin = getMinCellZ();
            //     camera.position.set(p.x, p.y, p.z);
            //     camera.up.set(u.x, u.y, u.z);
            //     camera.quaternion.set(q.x, q.y, q.z, q.w);
            //     if (controls.type == 'trackball') {
            //         controls.target = new THREE.Vector3(c.x, c.y, 0);
            //         controls.update();
            // }})}

            function getMostCommonKeywords(sphere){



                const indexesOfImagesInsideSphere = sphere.pointsIndexes
                const news = threeDImageData.searchWordResult.body.hits.hits

                let keywordsMap = new Map()

                for(let i = 0; i < indexesOfImagesInsideSphere.length; i++) {

                    if(news[indexesOfImagesInsideSphere[i]] != undefined)
                    for (let k = 0; k < news[indexesOfImagesInsideSphere[i]]._source.keywords.length; k++) {


                        console.log("clusterPre", news[indexesOfImagesInsideSphere[i]])
                        let newsSet = keywordsMap.get(news[indexesOfImagesInsideSphere[i]]._source.keywords[k].value)

                        if (newsSet != undefined)
                            newsSet.push(i)
                        else
                            newsSet = [i]

                        keywordsMap.set(news[indexesOfImagesInsideSphere[i]]._source.keywords[k].value, newsSet)
                        keywordsMap[Symbol.iterator] = function* () {
                            yield* [...keywordsMap.entries()].sort((a, b) => b[1].length - a[1].length);
                        }
                    }
                }

                const obj = Object.fromEntries(keywordsMap);

                return Object.entries(obj).slice(0, 4)
            }







            const sphere = new THREE.Mesh(new THREE.SphereGeometry(15, 50, 100),
                new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load('./news.jpg')}))



            sphere.arrowHelperSphere = true
            scene.add( sphere );




            function defineTrackballControlsSettings(){

                controls.zoomSpeed = 0.3;
                controls.panSpeed = 0.4;
                controls.enableDamping = true;
                controls.dampingFactor = 0.07;
                controls.rotateSpeed = 0.2;
                controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
                controls.mouseButtons.MIDDLE = THREE.MOUSE.ZOOM;
                controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
                //controls.noRotate = true
                //controls.noPan = true


                controls.maxDistance = 1000.0;
                camera.translateZ(1000);
                controls.type = 'trackball';
                controls.update();
                ThreeMeshUI.update();

            }

            var controls = new TrackballControls(camera, renderer.domElement);
            defineTrackballControlsSettings();

            let initialVFOV = (camera.fov * Math.PI) / 180;
            let initialHeightFov = 2 * Math.tan(initialVFOV / 2) * Math.abs(camera.position.z);
            let initialwidthFov = initialHeightFov * camera.aspect;

            let updatedVFOV = initialVFOV
            let updatedHeightFov = initialHeightFov
            let updatedInitialWidthFov = initialwidthFov

            console.log("HEIGHT DESTA TRETA", renderer.domElement.height)
            console.log("WIDTH DESTA TRETA", renderer.domElement.width)

            function updateHelperPosition() {



                sphere.position.x =  camera.position.x;
                sphere.position.y =  camera.position.y + initialHeightFov / 2 - 100;
                sphere.position.z = 100

                if(arrowHelperArray != []){
                    for(let i = 0; i < arrowHelperArray.length; i++){


                        arrowHelperArray[i].position.x = camera.position.x //- 200
                        arrowHelperArray[i].position.y = camera.position.y + initialHeightFov / 2 - 100;
                        arrowHelperArray[i].setDirection(new THREE.Vector3(sceneSpheres[i].position.x - camera.position.x, sceneSpheres[i].position.y - camera.position.y - updatedHeightFov / 2 + 100, sceneSpheres[i].position.z).normalize())
                    }
                }
            }



            function returnKeywords(){

            }







            function animate() {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
                controls.update();
                ThreeMeshUI.update();
                TWEEN.update();
                updateHelperPosition();
                //console.log(updatedHeightFov)
                updatedVFOV = (camera.fov * Math.PI) / 180;
                updatedHeightFov = 2 * Math.tan(updatedVFOV / 2) * Math.abs(camera.position.z);
                updatedInitialWidthFov = updatedHeightFov * camera.aspect;
                // if(sceneSpheres[0] != undefined){
                //     sceneSpheres[1].rotation.x += 0.01
                //     sceneSpheres[1].rotation.y += 0.01
                //
                //     sceneSpheres[0].rotation.x += 0.01
                //     sceneSpheres[0].rotation.y += 0.03
                //     sceneSpheres[0].rotation.z += 0.02
                //
                //     //if()
                // }



            }

            animate();
            //renderer.setClearColor( 0x212529, 1 );
            //renderer.setClearColor( 0x000000, 0 );
        // acaba aqui o get axios})
        }

    },[threeDImageData])


    return(
        loading ? <ProgressSpinner style={{paddingTop:"50%" ,width: '50px', height: '50px', display: "flex", justifyContent: "center", alignItems: "center"}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"/> :
        <>
             <div id={"threeDImageVisualization"} key = {key} ref={ref} style={{width: '100px', height: '100px', position:'relative'}}>
                {clickedImage!= "" ? (<div id="overlay">
                    <Card border="secondary" key={1}  style={{width: '220px', marginTop: '15px', marginLeft: '15px'}}>
                        <Carousel nextLabel='none' nextIcon= '' prevIcon='' style={{borderRadius: '50%'}} interval={null}>
                            <Carousel.Item style={{width:'220px', height:'165px'}}  >
                                <img
                                    style={{width:'220px', height:'165px', objectFit: "cover", overflow: "hidden"}}
                                    className="d-block w-100"
                                    src={"https://large.novasearch.org/nytimes/images/" + clickedImage[0]._source.parsed_section[clickedImage[0]._source.image_positions[clickedImage[1]]].hash + ".jpg"}
                                    alt="First slide"
                                />
                            </Carousel.Item>)}
                        </Carousel>

                        <Card.Body >
                            <Card.Title  > {1}. {clickedImage[0]._source.headline.main}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{clickedImage[0]._source.pub_date.substring(0,10)}</Card.Subtitle>
                            <Card.Text style={{fontFamily: "unset", fontSize: "0.75em"}}>
                                {clickedImage[0]._source.snippet}
                            </Card.Text>
                            <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary p-button-text" onClick={() => {handleMultimodalClickRequest(clickedImage[0], index); setSearchTermHistory(searchTermHistory => [...searchTermHistory,clickedImage[0]._source.headline.main + " (text)"])}} >
                                <ImNewspaper style={{width:'100%', height: "20px"}}

                                />
                            </Button>

                            <Button icon="pi pi-bookmark" className="p-button-rounded p-button-secondary p-button-text" onClick={() => {handleImageMouseClickRequest(clickedImage[0], index); setSearchTermHistory(searchTermHistory => [...searchTermHistory,clickedImage[0]._source.headline.main + " (image)"])}}>
                                <BsImage style={{width:'100%', height: "17px"}}
                                />
                            </Button>

                            <Card.Link style={{fontFamily: "arial", fontSize: "0.75em", float:"right"}} variant="primary" href={"pre"}>See more</Card.Link>
                        </Card.Body>
                    </Card>
                </div>): <></>}
            </div>
        </>
    )


}
export default ThreeDImageVisualization
