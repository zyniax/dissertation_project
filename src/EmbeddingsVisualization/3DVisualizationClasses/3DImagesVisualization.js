import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import ThreeMeshUI from 'three-mesh-ui'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import './3DImageVisualization.css';
import { SelectionBox } from "./SelectionBox"
import { SelectionHelper } from './SelectionHelper';
import React, {useRef, useEffect, useState} from "react";
import axios from "axios";
import TextSprite from '@seregpie/three.text-sprite';
import {Card, Carousel} from "react-bootstrap";
import {FlakesTexture} from "three/examples/jsm/textures/FlakesTexture";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';



export const ThreeDImageVisualization = ({threeDImageData, filteredNews}) => {

    const ref = useRef();
    let imageIndex = 0
    const [clickedImage, setClickedImage] = useState("")


    let sceneSpheres = [];
    let additionalSphereKeywords = [];
    let lastIntersectedSpheres = []
    let createdPlanes = []
    let key = 0
    const widthMultiplier = 600
    const heightMultiplier = 600
    const depthMultiplier = 100



    useEffect(()=>{

        console.log("wste é o threedimage data")
        console.log(threeDImageData)

        if(threeDImageData.length != 0){



            key++;
            const response = threeDImageData
        // axios.get('http://localhost:3000/api/request/umap3D',{
        //     headers: {
        //         'Access-Control-Allow-Origin': 'http://localhost:3000',
        //         'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        //         'Access-Control-Allow-Headers': 'application/json'
        //     }
        // }).then(response => {

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
            var light = new THREE.DirectionalLight( 0xfdfcf0, 0.2 )
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


            const selectionBox = new SelectionBox( camera, scene );
            const helper = new SelectionHelper( selectionBox, renderer, 'selectBox' );
            //scene.add(loader)


            const texture = new THREE.TextureLoader().load('https://large.novasearch.org/nytimes/images/206cd0c3321f129171d53aca579372662e99b8f946c01d27c42e10a8daf42f47.jpg');

// immediately use the texture for material creation

            var planeTest;

            function createPanels(response){
                console.log(response)

                for(var i = 0; i < threeDImageData.embeddings.length; i++){
                    const texture = new THREE.TextureLoader().load('https://large.novasearch.org/nytimes/images/206cd0c3321f129171d53aca579372662e99b8f946c01d27c42e10a8daf42f47.jpg');

                    texture.magFilter = THREE.LinearFilter;
                    texture.minFilter = THREE.LinearFilter;

                    const geometry = new THREE.PlaneGeometry(4, 4, 1);
                    const material = new THREE.MeshBasicMaterial({map: texture});

                    const plane= new THREE.Mesh(geometry, material);
                    //texture.minFilter = THREE.NearestFilter
                    //texture.magFilter = THREE.NearestFilter
                    planeTest = plane
                    plane.position.set(threeDImageData.embeddings[i][0] * widthMultiplier, threeDImageData.embeddings[i][1]*heightMultiplier, threeDImageData.embeddings[i][2] * depthMultiplier)
                    scene.add(plane)
                }

            }

            function createSmallPoints(response){
                console.log(response)

                for(var i = 0; i < threeDImageData.embeddings.length; i++){
                    //const texture = new THREE.TextureLoader().load('https://large.novasearch.org/nytimes/images/206cd0c3321f129171d53aca579372662e99b8f946c01d27c42e10a8daf42f47.jpg');
                    const geometry = new THREE.SphereGeometry(2, 100, 1);
                    const material = new THREE.MeshBasicMaterial({color: "white"});
                    const smallSphere = new THREE.Mesh(geometry, material);
                    smallSphere.position.set(threeDImageData.embeddings[i][0] * widthMultiplier, threeDImageData.embeddings[i][1]*heightMultiplier, threeDImageData.embeddings[i][2] * depthMultiplier)
                    scene.add(smallSphere)
                }

            }

            function replaceSmallPointsForPanels(){

            }

            renderer.domElement.addEventListener( 'click', function ( event ) {


                for ( const item of selectionBox.collection ) {

                    // item.material.color.set( 0xffffff );

                }

                let canvasBounds = renderer.domElement.getBoundingClientRect();

                selectionBox.startPoint.set(
                    ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1,
                    - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1, 0);


                mouse.x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
                mouse.y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;

                raycaster.setFromCamera( mouse, camera );
                const intersects = raycaster.intersectObjects(scene.children, true);

                console.log("este é o intersects")
                console.log(intersects)

                // se a interseção for maior do que 1 significa que clicou na esfera opaca e na fotografia com um só clique, ou seja o clique apanha tanto a esfera opaca como a fotografia
                if(intersects.length > 1 && intersects[1].object.geometry.type === 'PlaneGeometry' && intersects[0].object.geometry.type === 'SphereGeometry' && intersects[0].object.visible === false)
                    flyToObject(intersects[1].object)

                else if (intersects.length > 0 && (intersects[0].object.geometry.type === 'PlaneGeometry' || (intersects[0].object.geometry.type === 'SphereGeometry' && intersects[0].object.visible === true)))
                    flyToObject(intersects[0].object)




            } );

            renderer.domElement.addEventListener( 'pointermove', function ( event ) {

                if ( helper.isDown ) {

                    //for ( let i = 0; i < selectionBox.collection.length; i ++ ) {

                    // selectionBox.collection[ i ].material.color.set( 0x000000 );

                    console.log("asdasd")

                    //}


                    let canvasBounds = renderer.domElement.getBoundingClientRect();

                    selectionBox.endPoint.set(
                        ((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1,
                        -((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1, 0);


                    const allSelected = selectionBox.select();

                    // for ( let i = 0; i < allSelected.length; i ++ ) {

                    //   allSelected[ i ].material.color.set( 0xffffff );

                    // }


                }
            })

            renderer.domElement.addEventListener( 'pointerup', function ( event ) {
                let canvasBounds = renderer.domElement.getBoundingClientRect();

                selectionBox.endPoint.set(
                    ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 -1,
                    - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1, 0);



                const allSelected = selectionBox.select();

                for ( let i = 0; i < allSelected.length; i ++ ) {

                    //allSelected[ i ].material.color.set( 0x000000 );

                }
                console.log(camera.position)

            } );

            renderer.domElement.addEventListener( 'pointermove', function ( event ) {

                let canvasBounds = renderer.domElement.getBoundingClientRect();

                mouse.x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
                mouse.y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;

                raycaster.setFromCamera( mouse, camera );
                const intersects = raycaster.intersectObjects(scene.children, true);
                let currentObject = null;



                if (intersects.length > 0) {
                    currentObject = intersects[0].object;
                    //arrowHelper.cone.material.opacity = 0

                    if (intersects[0].object.geometry.type === 'PlaneGeometry'){
                        //console.log(intersects[0] + "    " + threeDImageData.newsIds.length)
                        const indexOfImage = intersects[0].object.indexOfImage
                        const newsIdAndImagePosition =  threeDImageData.newsIds[indexOfImage]

                        const newsId = newsIdAndImagePosition.split("_")[0]
                         imageIndex = newsIdAndImagePosition.split("_")[1]
                        console.log("este é o imageIndex")
                        console.log(imageIndex)

                        const news = threeDImageData.searchWordResult.body.hits.hits

                        for(let l = 0; l < news.length; l++){
                                if(news[l]._id == newsId){
                                    let newsImageAndIndex = []
                                    newsImageAndIndex[0] = news[l]
                                    newsImageAndIndex[1] = imageIndex
                                    setClickedImage(newsImageAndIndex)
                                    console.log("true")
                                    console.log(news[l])
                                    console.log(newsImageAndIndex)
                                }

                        }
                    }

                        //setClickedImage("https://www.palpitedigital.com/y/5327/imagens-google-e1604596848141.jpg")

                    if (intersects[0].object.geometry.type === 'SphereGeometry'){
                        const newsLinks = ["https://madre.com.pt/wp-content/uploads/2021/07/IMG_8004-scaled.jpg", "https://www.jcs.pt/upload/1457541812.jpg", "https://www.fccnn.com/news/article769232.ece/alternates/BASE_LANDSCAPE/2222824%2Bfire.jpg", "https://wwmt.com/resources/media2/16x9/full/1015/center/80/7d7ef12f-5b4b-450c-af92-bd5a341a649e-large16x9_FIREGENERIC.png"]

                        const random = Math.floor(Math.random() * newsLinks.length);
                        //setClickedImage(newsLinks[random])

                        lastIntersectedSpheres.push(intersects[0].object);

                        const sphere = intersects[0].object;
                        const spherePosition = intersects[0].object.position;
                        const sphereRadius = intersects[0].object.geometry.parameters.radius;

                        if(!sphere.hasKeywords){
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
                        if(sceneSpheres[i].visible == false){

                            const indexesOfImagesInsideSphere = sceneSpheres[i].pointsIndexes


                            for(let j = 0; j < indexesOfImagesInsideSphere.length; j++) {

                                console.log(threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][2])
                                console.log(threeDImageData.embeddings[indexesOfImagesInsideSphere])
                                if(camera.position.z - (threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][2] * depthMultiplier) < 15 && createdPlanes[i][j].showingHighQualityImage == false ){



                                console.log("llllllllllllllllllllllllllll entrei no high")



                                        const geometry = new THREE.PlaneGeometry(4, 4, 1);
                                        const texture = new THREE.TextureLoader().load('./pre_highQuality/transferir.jpg');
                                        //const texture = new THREE.CanvasTexture(imageBitmap);



                                        // texture.magFilter = THREE.LinearFilter;
                                        // texture.minFilter = THREE.LinearFilter;
                                        // texture.needsUpdate = true;

                                        const material = new THREE.MeshBasicMaterial({map: texture});
                                        const plane = new THREE.Mesh(geometry, material);

                                        plane.showingBadQualityImage = true
                                        plane.showingMediumQualityImage = true
                                        plane.showingHighQualityImage = true
                                        plane.indexOfImage = j

                                        planeTest = plane
                                        plane.position.set(threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][0] * widthMultiplier, threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][1] * heightMultiplier, threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][2] * depthMultiplier)
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
                                 if(camera.position.z - (threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][2] * depthMultiplier) < 35 && createdPlanes[i][j].showingMediumQualityImage == false  && createdPlanes[i][j].showingHighQualityImage == false){


                                    console.log("kkkkkkkkkkkkkkkkkkkkkkk entrei no medium")


                                    const planeMesh = createdPlanes[i][j]
                                    planeMesh.geometry.dispose();
                                    planeMesh.material.dispose();
                                    console.log("removi")
                                    scene.remove(planeMesh);



                                    const geometry = new THREE.PlaneGeometry(4, 4, 1);
                                    const texture = new THREE.TextureLoader().load('./pre_mediumQuality/003d3159614e83d323610c2613bd93d21b1732affed6a642bc6338094a9c42cf-min.jpg');
                                    //const texture = new THREE.CanvasTexture(imageBitmap);



                                    // texture.magFilter = THREE.LinearFilter;
                                    // texture.minFilter = THREE.LinearFilter;
                                    // texture.needsUpdate = true;

                                    const material = new THREE.MeshBasicMaterial({map: texture});
                                    const plane = new THREE.Mesh(geometry, material);

                                    plane.showingBadQualityImage = true
                                    plane.showingMediumQualityImage = true
                                    plane.showingHighQualityImage = false
                                     plane.indexOfImage = j

                                    planeTest = plane
                                    plane.position.set(threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][0] * widthMultiplier, threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][1] * heightMultiplier, threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][2] * depthMultiplier)
                                    //plane.position.set(Math.random()* 400, Math.random() * 400, Math.random() * 100)

                                    createdPlanes[i][j] = plane

                                    //console.log(planeMesh)



                                    scene.add(plane)

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

                            if(sceneSpheres[i].visible == false){

                                const indexesOfImagesInsideSphere = sceneSpheres[i].pointsIndexes
                                console.log("entrei na parte das bolas brancas")
                                console.log(sceneSpheres[i].pointsIndexes)

                                for(let j = createdPlanes[i].length; j > 0; j--){
                                    const planeMesh = createdPlanes[i].pop()
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

                                // for(let i = 0; i < indexesOfImagesInsideSphere.length; i++){
                                //     //const texture = new THREE.TextureLoader().load('https://large.novasearch.org/nytimes/images/206cd0c3321f129171d53aca579372662e99b8f946c01d27c42e10a8daf42f47.jpg');
                                //     const geometry = new THREE.SphereGeometry(2, 100, 1);
                                //     const material = new THREE.MeshBasicMaterial({color: "white"});
                                //     const smallSphere = new THREE.Mesh(geometry, material);
                                //     smallSphere.position.set(threeDImageData.embeddings[indexesOfImagesInsideSphere[i]][0] * widthMultiplier, threeDImageData.embeddings[indexesOfImagesInsideSphere[i]][1] * heightMultiplier, threeDImageData.embeddings[indexesOfImagesInsideSphere[i]][2] * depthMultiplier)
                                //     scene.add(smallSphere)
                                //
                                // }
                                sceneSpheres[i].visible = true



                            }
                        }
                    }
                }

            }


            document.addEventListener( 'mousewheel', onMouseWheel, false );






            //createPanels(response)
            //createSmallPoints(response)

            scene.background = new THREE.Color("#171717")
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            function dbclick( event ) {

                // calculate mouse position in normalized device coordinates
                // (-1 to +1) for both components
                let canvasBounds = renderer.domElement.getBoundingClientRect();
                mouse.x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
                mouse.y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;

                window.requestAnimationFrame(render);

            }

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
                            'Access-Control-Allow-Origin': 'http://localhost:3000',
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

            window.addEventListener( 'dblclick', dbclick, false );
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

            function getNewInstance(){
                instance = new TextSprite({
                    alignment: 'center',
                    color: '#db4035',
                    fontFamily: '"Times New Roman", Times, serif',
                    fontSize: 20,
                    fontWeight: "900",
                    fontStyle: 'areal',
                    text: [
                        'Cats',


                    ].join('\n'),
                });
                return instance
            }


            function addAdditionalKeywordsToSpheres(sphere, spherePosition, sphereRadius){
                sphere.hasKeywords = true
                instance = getNewInstance()
                instance.position.set(spherePosition.x + sphereRadius + 25, spherePosition.y, spherePosition.z)
                additionalSphereKeywords.push(instance)
                scene.add(instance)



                instance = getNewInstance()
                instance.position.set(spherePosition.x - sphereRadius - 25, spherePosition.y, spherePosition.z)
                additionalSphereKeywords.push(instance)
                scene.add(instance)



                getNewInstance()
                instance.position.set(spherePosition.x, spherePosition.y - sphereRadius - 10, spherePosition.z)
                additionalSphereKeywords.push(instance)
                scene.add(instance)
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
            //                 "The males of this species grow to maximum total length of 73 cm (29 in): body 58 cm (23 in), tail 15 cm (5.9 in). Females grow to a maximum total length of 58 cm (23 in). The males are surprisingly long and slender compared to the females.\nThe head has a short snout, more so in males than in females.\nThe eyes are large and surrounded by 9–16 circumorbital scales. The orbits (eyes) are separated by 7–9 scales.",
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









//             const dir = new THREE.Vector3(planeTest.position.x, planeTest.position.y, planeTest.position.z);
// //normalize the direction vector (convert to vector of length 1)
//             dir.normalize();


            const origin = new THREE.Vector3( 0, 0, 100 );
            const length = 50;
            const hex = 0x004999;


            // const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
            // arrowHelper.line.visible = false
            // arrowHelper.setLength (50, 20, 12)
            // console.log(arrowHelper.cone)
            // scene.add( arrowHelper );

            const sphere = new THREE.Mesh(new THREE.SphereGeometry(15, 50, 100),
                new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./news.jpg')}))





            scene.add( sphere );

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
                    const sphereCenter = new THREE.Vector3(((((clusterPoints[i+1] - clusterPoints[i]) / 2) + clusterPoints[i]) * widthMultiplier), ((((clusterPoints[i+3] - clusterPoints[i+2]) / 2) + clusterPoints[i+2]) * heightMultiplier), ((((clusterPoints[i+5] - clusterPoints[i+4]) / 2) + clusterPoints[i+4]) * depthMultiplier));
                    const sphereRadius = Math.sqrt((midwayPoints.x ** 2) + (midwayPoints.y ** 2) + (midwayPoints.z ** 2))
                    console.log("este é o raio da esfera")
                    console.log(sphereRadius)
                    console.log("este é o centro da esfera")
                    console.log(sphereCenter)

                    clusterSphere = new THREE.Mesh(new THREE.SphereGeometry(sphereRadius, 50, 500),
                        new THREE.MeshBasicMaterial({
                            transparent: true,
                            opacity: 1.0,
                            map: new THREE.TextureLoader().load('./news.jpg')
                        }))

                    // tem de ser i%6 porque o cluster points(for de cima) aumenta de 6 em 6 e o clusterIndexes aumenta de 1 em 1


                    clusterSphere.position.set(sphereCenter.x, sphereCenter.y, sphereCenter.z)
                    console.log("entrei neste for que me esta a irritar eae")
                    let ballGeo = new THREE.SphereGeometry(sphereRadius, 64, 30)
                    let ballMat = new THREE.MeshPhysicalMaterial(ballMaterial)
                    let ballMesh = new THREE.Mesh(ballGeo, ballMat)
                    ballMesh.position.set(clusterSphere.position.x, clusterSphere.position.y, clusterSphere.position.z);
                    ballMesh.hasKeywords = false;
                    ballMesh.pointsIndexes = threeDImageData.clusterIndexes[i/6]
                    ballMesh.material.opacity = 0.2;

                    let instance = new TextSprite({
                        alignment: 'center',
                        color: '#db4035',
                        fontFamily: '"Times New Roman", Times, serif',
                        fontSize: 20,
                        fontWeight: "900",
                        fontStyle: 'areal',
                        text: [
                            'Cats',


                        ].join('\n'),
                    });

                    instance.position.set(sphereCenter.x,sphereCenter.y + sphereRadius + 10, sphereCenter.z)
                    console.log(instance)
                    console.log(instance.scale)
                    scene.add(instance)
                    scene.add(ballMesh)
                    sceneSpheres.push(ballMesh)
                }


                console.log("esta é a clustersphere")
                // eslint-disable-next-line no-unused-expressions


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
                fontSize: 20,
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

                    //const texture = new THREE.TextureLoader().load('https://large.novasearch.org/nytimes/images/206cd0c3321f129171d53aca579372662e99b8f946c01d27c42e10a8daf42f47.jpg');
                    //const texture = GLTLloader.load('https://large.novasearch.org/nytimes/images/206cd0c3321f129171d53aca579372662e99b8f946c01d27c42e10a8daf42f47.jpg');

                    //talvez mudar só para loader

                        //./ExampleImage.jpg
                        //https://large.novasearch.org/nytimes/images/206cd0c3321f129171d53aca579372662e99b8f946c01d27c42e10a8daf42f47.jpg

                        // onLoad callback

                    const geometry = new THREE.PlaneGeometry(4, 4, 1);
                    const texture = new THREE.TextureLoader().load('./pre_badQuality/003d3159614e83d323610c2613bd93d21b1732affed6a642bc6338094a9c42cf-min.jpg');

                            // texture.magFilter = THREE.LinearFilter;
                            // texture.minFilter = THREE.LinearFilter;
                            // texture.needsUpdate = true;

                            const material = new THREE.MeshBasicMaterial( { map: texture } );
                            const plane= new THREE.Mesh(geometry, material);


                            planeTest = plane
                            plane.position.set(threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][0] * widthMultiplier, threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][1] * heightMultiplier, threeDImageData.embeddings[indexesOfImagesInsideSphere[j]][2] * depthMultiplier)
                            //plane.position.set(Math.random()* 400, Math.random() * 400, Math.random() * 100)
                            if(createdPlanes[i] == undefined)
                                createdPlanes[i] = []


                            plane.showingBadQualityImage = false
                            plane.showingMediumQualityImage = false
                            plane.showingHighQualityImage = false
                            plane.indexOfImage = j
                            createdPlanes[i].push(plane)
                            scene.add(plane)

                    // const geometry = new THREE.PlaneGeometry(4, 4, 1);
                    // const material = new THREE.MeshBasicMaterial({map: texture});

                }

                console.log("esta é a primeira scene")
                console.log(scene.children)
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

                console.log("estye é o meu index")
                console.log(index)




                if(clickedObject.geometry.type === 'PlaneGeometry')
                    controls.target.set(objectPosition.x, objectPosition.y, objectPosition.z + 10)
                else if(clickedObject.geometry.type === 'SphereGeometry'){
                    const sphereRadius = clickedObject.geometry.boundingSphere.radius
                    controls.target.set(objectPosition.x, objectPosition.y, objectPosition.z + sphereRadius + 100)
                    const indexesOfImagesInsideSphere = clickedObject.pointsIndexes
                    createPanelsOfCluster(indexesOfImagesInsideSphere, index)

                }



                console.log(clickedObject)
                console.log("este é o clickedpanel")

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
                    // console.log(lastPosition)


                    //console.log("entrei no update")
                    //camera.position.x = controls.target.x;
                    //camera.position.y = controls.target.y;
                    //camera.position.z = controls.target.z;
                    // console.log(camera.position)
                    // console.log(controls.target)
                    // console.log(planeTest.position)

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
                    if(clickedObject.geometry.type === 'SphereGeometry')
                        clickedObject.visible = false
                    //camera.position.set(0, 0 ,1000)
                    // camera.translateX(controls.target.x)
                    // camera.translateY(controls.target.y)

                    //controls.quaternion0 =1000
                    //controls.update()
                    // controls.enabled = true;
                    // controls.update();
                    //controls2 = new TrackballControls(camera, renderer.domElement);
                    //controls.reset()

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

            function updateHelperPosition() {



                sphere.position.x =  camera.position.x;
                sphere.position.y =  camera.position.y + initialHeightFov / 2 - 100;
                sphere.position.z = 100
                // arrowHelper.position.x = camera.position.x //- width/2
                // arrowHelper.position.y = camera.position.y + heightFov / 2 - 100;
                // arrowHelper.setDirection(new THREE.Vector3(planeTest.position.x - camera.position.x, planeTest.position.y - camera.position.y - heightFov / 2 + 100, planeTest.position.z).normalize())
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
        <>



            <div key = {key} ref={ref} style={{width: '100px', height: '100px', position:'relative'}}>
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
                            <Card.Link style={{fontFamily: "arial", fontSize: "0.75em", float:"right"}} variant="primary" href={"pre"}>See more</Card.Link>
                        </Card.Body>
                    </Card>
                </div>): <></>}
            </div>
        </>
    )


}
export default ThreeDImageVisualization
