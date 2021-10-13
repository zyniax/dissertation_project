import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import ThreeMeshUI from 'three-mesh-ui'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
//import './3DImageVisualization.css';
import { SelectionBox } from "./SelectionBox"
import { SelectionHelper } from './SelectionHelper';
import {useRef, useEffect, useState} from "react";
import axios from "axios";


export const ThreeDImageVisualization = (filteredNews) => {

    const ref = useRef();
    const [clickedImage, setClickedImage] = useState("")

    useEffect(()=>{
        //http://localhost:3000/api/request/umap3D

        axios.get('https://dissertationserver.herokuapp.com/api/request/umap3D',{
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'application/json'
            }
        }).then(response => {

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                50,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            )

            const renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true

                }
            )

            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.setPixelRatio(window.devicePixelRatio)
            document.body.appendChild((renderer.domElement))
            ref.current.appendChild(renderer.domElement);


//create a sphere


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

                for(var i = 0; i < response.data.length; i++){
                    const geometry = new THREE.PlaneGeometry(1, 1, 1);
                    const material = new THREE.MeshBasicMaterial({map: texture});
                    const plane= new THREE.Mesh(geometry, material);
                    planeTest = plane



                    // if(response.data[i][2] > 0 && response.data[i][2] < 0.325){
                    //     response.data[i][2] = 0
                    // }
                    // else if(response.data[i][2] >= 0.325 && response.data[i][2] < 0.650){
                    //     response.data[i][2] = 10
                    // }
                    // else if (response.data[i][2] >= 0.650){
                    //     response.data[i][2] = 20
                    // }

                    plane.position.set(response.data[i][0] * 400, response.data[i][1]*400, response.data[i][2] * 100)
                    scene.add(plane)
                }

            }

            renderer.domElement.addEventListener( 'pointerdown', function ( event ) {


                for ( const item of selectionBox.collection ) {

                   // item.material.color.set( 0xffffff );

                }

                let canvasBounds = renderer.domElement.getBoundingClientRect();

                selectionBox.startPoint.set(
                    ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1,
                    - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1, 0);

            } );

            renderer.domElement.addEventListener( 'pointermove', function ( event ) {

                if ( helper.isDown ) {

                    //for ( let i = 0; i < selectionBox.collection.length; i ++ ) {

                       // selectionBox.collection[ i ].material.color.set( 0x000000 );



                    //}


                    let canvasBounds = renderer.domElement.getBoundingClientRect();

                    selectionBox.endPoint.set(
                        ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 -1,
                        - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1, 0);


                    const allSelected = selectionBox.select();

                   // for ( let i = 0; i < allSelected.length; i ++ ) {

                     //   allSelected[ i ].material.color.set( 0xffffff );

                   // }

                }

            } );

            renderer.domElement.addEventListener( 'pointerup', function ( event ) {
                let canvasBounds = renderer.domElement.getBoundingClientRect();

                selectionBox.endPoint.set(
                    ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 -1,
                    - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1, 0);



                const allSelected = selectionBox.select();

                for ( let i = 0; i < allSelected.length; i ++ ) {

                    //allSelected[ i ].material.color.set( 0x000000 );

                }

            } );


            createPanels(response)


            scene.background = new THREE.Color("#171717")

            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            function click( event ) {

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

                    axios.get('https://dissertationserver.herokuapp.com/api/request/umap3D',{
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

            window.addEventListener( 'click', click, false );


            const containerSize = 2

                const container = new ThreeMeshUI.Block({
                    ref: "container",
                    padding: 0.050 * containerSize,
                    fontFamily: './Robot-mds.json',
                    fontTexture: './Roboto-msdf.png',
                    fontColor: new THREE.Color(0xffffff),
                    backgroundOpacity: 1,
                    offset: 5
                });



                container.position.set(400, 400, 100);
                // container.rotation.x = -0.55;
                scene.add(container);


                const title = new ThreeMeshUI.Block({
                    height: 8 * containerSize,
                    width: 60 * containerSize,
                    margin: 1.0 * containerSize,
                    justifyContent: "center",
                    fontSize: 3.6 * containerSize,
                });

                title.add(
                    new ThreeMeshUI.Text({
                        content: "spiny bush viper",
                    })
                );

                container.add(title);

                //

                const leftSubBlock = new ThreeMeshUI.Block({
                    height: 38 * containerSize,
                    width: 40 * containerSize,
                    margin: 1.00 * containerSize,
                    padding: 0.50 * containerSize,
                    alignContent: "left",
                    justifyContent: "end",
                    offset: 1.0* containerSize
                });

                const caption = new ThreeMeshUI.Block({
                    height: 1.4 * containerSize,
                    width: 7.4 * containerSize,
                    alignContent: "center",
                    justifyContent: "center",
                });

                caption.add(
                    new ThreeMeshUI.Text({
                        content: "Mind your fingers",
                        fontSize: 0.8 * containerSize,
                    })
                );

                leftSubBlock.add(caption);

                //

                const rightSubBlock = new ThreeMeshUI.Block({
                    margin: 0.50 * containerSize,
                });

                const subSubBlock1 = new ThreeMeshUI.Block({
                    height: 7.0 * containerSize,
                    width: 10 * containerSize,
                    margin: 0.50 * containerSize,
                    padding: 0.4 * containerSize,
                    fontSize: 1.2 * containerSize,
                    justifyContent: "center",
                    backgroundOpacity: 0,
                }).add(
                    new ThreeMeshUI.Text({
                        content: "Known for its extremely keeled dorsal scales that give it a ",
                    }),

                    new ThreeMeshUI.Text({
                        content: "bristly",
                        fontColor: new THREE.Color(0x92e66c),
                    }),

                    new ThreeMeshUI.Text({
                        content: " appearance.",
                    })
                );

                const subSubBlock2 = new ThreeMeshUI.Block({
                    height: 24.6 * containerSize,
                    width: 16 * containerSize,
                    margin: 0.2 * containerSize,
                    padding: 0.4 * containerSize,
                    fontSize: 1.10 * containerSize,
                    alignContent: "left",
                    backgroundOpacity: 0,
                }).add(
                    new ThreeMeshUI.Text({
                        content:
                            "The males of this species grow to maximum total length of 73 cm (29 in): body 58 cm (23 in), tail 15 cm (5.9 in). Females grow to a maximum total length of 58 cm (23 in). The males are surprisingly long and slender compared to the females.\nThe head has a short snout, more so in males than in females.\nThe eyes are large and surrounded by 9–16 circumorbital scales. The orbits (eyes) are separated by 7–9 scales.",
                    })
                );

                rightSubBlock.add(subSubBlock1, subSubBlock2);

                //

                const contentContainer = new ThreeMeshUI.Block({
                    contentDirection: "row",
                    padding: 0.4 * containerSize,
                    margin: 0.5 * containerSize,
                    backgroundOpacity: 0,
                });

                contentContainer.add(leftSubBlock, rightSubBlock);
                container.add(contentContainer);

                //

                new THREE.TextureLoader().load("spiny_bush_viper.jpg", (texture) => {
                    leftSubBlock.set({
                        backgroundTexture: texture,
                    });
                });




            const dir = new THREE.Vector3(planeTest.position.x, planeTest.position.y, planeTest.position.z);



//normalize the direction vector (convert to vector of length 1)
            dir.normalize();

            const origin = new THREE.Vector3( 0, 0, planeTest.position.z );
            const length = 50;
            const hex = 0xffff00;

            const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
            scene.add( arrowHelper );


            const geometry = new THREE.CircleGeometry( 5, 128 );
            const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
            const circle = new THREE.Mesh( geometry, material );
            scene.add( circle );




            // const container = new ThreeMeshUI.Block({
            //     height: 75,
            //     width: 50,
            // });
            //
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




            var controls = new TrackballControls(camera, renderer.domElement);
            controls.zoomSpeed = 0.7;
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



            function animate() {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
                controls.update();
                ThreeMeshUI.update();
                circle.position.x =  camera.position.x
                circle.position.y =  camera.position.y
                 arrowHelper.position.x = (camera.position.x)
                 arrowHelper.position.y = camera.position.y
                //arrowHelper.setDirection(new THREE.Vector3(300, 40, 0))

                // arrowHelper.position.z = 0
                 arrowHelper.setDirection(new THREE.Vector3(planeTest.position.x - camera.position.x, planeTest.position.y - camera.position.y, planeTest.position.z).normalize())




//normalize the direction vector (convert to vector of length 1)






                //cameraPivot.rotation.y += 0.004;

            }

            animate();
            //renderer.setClearColor( 0x212529, 1 );
            //renderer.setClearColor( 0x000000, 0 );
        })

    },[])

    return(
        <div ref={ref} style={{width: '100px', height: '100px', zIndex: '100', position:'absolute', marginLeft: '265px', marginTop: '-23px'}}/>
    )

}
export default ThreeDImageVisualization
