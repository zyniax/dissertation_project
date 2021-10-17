import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
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

        axios.get('http://localhost:3000/api/request/umap3D',{
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
                console.log(response)

                for(var i = 0; i < response.data.embeddings.length; i++){
                    const geometry = new THREE.PlaneGeometry(2, 2, 1);
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

                    plane.position.set(response.data.embeddings[i][0] * 400, response.data.embeddings[i][1]*400, response.data.embeddings[i][2] * 100)
                    scene.add(plane)
                }

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
                var currentIntersection = null;

                if (intersects.length > 0 && intersects[0].object.geometry.type === 'PlaneGeometry')
                    flyToPanel(intersects[0].object.position)




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


            } })

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
                var currentIntersection = null;

                if (intersects.length > 0) {
                    currentIntersection = intersects[0].object;
                    arrowHelper.cone.material.opacity = 0
                } else {
                    if (currentIntersection === null) {
                        arrowHelper.cone.material.opacity = 1
                    }
                }

            })


            createPanels(response)


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


            const origin = new THREE.Vector3( 0, 0, 100 );
            const length = 50;
            const hex = 0x004999;


            const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
            arrowHelper.line.visible = false
            arrowHelper.setLength (50, 20, 12)
            console.log(arrowHelper.cone)
            scene.add( arrowHelper );

            const sphere = new THREE.Mesh(new THREE.SphereGeometry(15, 50, 500),
                new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./news.jpg')}))



            scene.add( sphere );




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

            function flyToPanel(clickedPlanePosition) {
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
                console.log("entrei")
                console.log(planeTest.position.x)
                console.log(planeTest.position.y)
                console.log(camera.position)

                var quaternion = controls.quaternion0






                var camera2 = new THREE.PerspectiveCamera(
                    50,
                    window.innerWidth / window.innerHeight,
                    0.1,
                    1000
                )

                var lastPosition;
                var time = 0,
                    q0 = camera.quaternion.clone();





                controls.target.set(clickedPlanePosition.x, clickedPlanePosition.y, clickedPlanePosition.z + 10)
                var position = { x : clickedPlanePosition.x, y: clickedPlanePosition.y };
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
                   console.log(camera.position)
                    lastPosition = camera.position
                    console.log(lastPosition)


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

            }

            var controls = new TrackballControls(camera, renderer.domElement);
            defineTrackballControlsSettings();

            const vFOV = (camera.fov * Math.PI) / 180;
            const heightFov = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z);
            const width = heightFov * camera.aspect;

            function updateHelperPosition() {



                sphere.position.x =  camera.position.x;
                sphere.position.y =  camera.position.y + heightFov / 2 - 100;
                sphere.position.z = 100
                arrowHelper.position.x = camera.position.x //- width/2
                arrowHelper.position.y = camera.position.y + heightFov / 2 - 100;
                arrowHelper.setDirection(new THREE.Vector3(planeTest.position.x - camera.position.x, planeTest.position.y - camera.position.y - heightFov / 2 + 100, planeTest.position.z).normalize())

            }







            function animate() {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
                controls.update();
                ThreeMeshUI.update();
                TWEEN.update();
                updateHelperPosition();

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
