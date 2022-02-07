import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import index, { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import {Card, Carousel} from "react-bootstrap";
import './ThreeDWorldVisualization.css';
import React, {useRef, useEffect, useState} from "react";
import axios from "axios";




export const ThreeDWorldVisualization = ({setFilteredNews}) => {
    const ref = useRef();

    useEffect(()=>{

        const canvas = document.querySelector('#c');
        const renderer = new THREE.WebGLRenderer({canvas,
        antialias: true});

        const fov = 60;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 10;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 2.5;

        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.rotateSpeed = 0.3
        controls.enablePan = false;
        controls.minDistance = 1.2;
        controls.maxDistance = 4;
        controls.update();

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#0');

        //create raycaster
        const raycaster = new THREE.Raycaster();

        {
            const loader = new THREE.TextureLoader();
            const texture = loader.load('https://threejsfundamentals.org/threejs/resources/data/world/country-outlines-4k.png', render);
            const geometry = new THREE.SphereGeometry(1, 128, 32);
            const material = new THREE.MeshBasicMaterial({map: texture});
            const worldSphere = new THREE.Mesh(geometry, material)
            console.log(worldSphere.position)
            scene.add(worldSphere);
        }

        async function loadJSON(url) {
            const req = await fetch(url);
            return req.json();
        }

        let countryInfos;
        async function loadCountryData() {
            countryInfos = await loadJSON('https://threejsfundamentals.org/threejs/resources/data/world/country-info.json');

            const lonFudge = Math.PI * 1.5;
            const latFudge = Math.PI;
            // these helpers will make it easy to position the boxes
            // We can rotate the lon helper on its Y axis to the longitude
            const lonHelper = new THREE.Object3D();
            // We rotate the latHelper on its X axis to the latitude
            const latHelper = new THREE.Object3D();
            lonHelper.add(latHelper);
            // The position helper moves the object to the edge of the sphere
            const positionHelper = new THREE.Object3D();
            positionHelper.position.z = 1;
            latHelper.add(positionHelper);

            const labelParentElem = document.querySelector('#labels');
            for (const countryInfo of countryInfos) {
                const {lat, lon, min, max, name} = countryInfo;

                const geometry = new THREE.SphereGeometry(0.005, 64, 10);
                const material = new THREE.MeshBasicMaterial({color: "#B22222"});
                const circle = new THREE.Mesh(geometry, material)
                circle.position.z = 1
                scene.add(circle);



                // adjust the helpers to point to the latitude and longitude
                lonHelper.rotation.y = THREE.MathUtils.degToRad(lon) + lonFudge;
                latHelper.rotation.x = THREE.MathUtils.degToRad(lat) + latFudge;

                // get the position of the lat/lon
                positionHelper.updateWorldMatrix(true, false);
                const position = new THREE.Vector3();
                positionHelper.getWorldPosition(position);
                countryInfo.position = position;
                circle.position.set(position.x, position.y, position.z)

                // compute the area for each country
                const width = max[0] - min[0];
                const height = max[1] - min[1];
                const area = width * height;
                countryInfo.area = area;

                // add an element for each country
                const elem = document.createElement('div');
                elem.textContent = name;
                circle.name = name
                console.log(name)
                labelParentElem.appendChild(elem);
                countryInfo.elem = elem;
                //console.log(circle)
            }
            requestRenderIfNotRequested();
        }
        loadCountryData();

        const tempV = new THREE.Vector3();
        const cameraToPoint = new THREE.Vector3();
        const cameraPosition = new THREE.Vector3();
        const normalMatrix = new THREE.Matrix3();

        const settings = {
            minArea: 20,
            maxVisibleDot: -0.2,
        };

        var gui = new GUI({width:150, autoPlace: false });

        var customContainer = document.getElementById("my-gui-container");
        customContainer.appendChild(gui.domElement);
        gui.add(settings, 'minArea', 0, 50).onChange(requestRenderIfNotRequested);
        gui.add(settings, 'maxVisibleDot', -1, 1, 0.01).onChange(requestRenderIfNotRequested);

        function updateLabels() {
            if (!countryInfos) {
                return;
            }

            const large = settings.minArea * settings.minArea;
            // get a matrix that represents a relative orientation of the camera
            normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
            // get the camera's position
            camera.getWorldPosition(cameraPosition);
            for (const countryInfo of countryInfos) {
                const {position, elem, area} = countryInfo;
                // large enough?
                if (area < large) {
                    elem.style.display = 'none';
                    continue;
                }

                // Orient the position based on the camera's orientation.
                // Since the sphere is at the origin and the sphere is a unit sphere
                // this gives us a camera relative direction vector for the position.
                tempV.copy(position);
                tempV.applyMatrix3(normalMatrix);

                // compute the direction to this position from the camera
                cameraToPoint.copy(position);
                cameraToPoint.applyMatrix4(camera.matrixWorldInverse).normalize();

                // get the dot product of camera relative direction to this position
                // on the globe with the direction from the camera to that point.
                // -1 = facing directly towards the camera
                // 0 = exactly on tangent of the sphere from the camera
                // > 0 = facing away
                const dot = tempV.dot(cameraToPoint);

                // if the orientation is not facing us hide it.
                if (dot > settings.maxVisibleDot) {
                    elem.style.display = 'none';
                    continue;
                }

                // restore the element to its default display style
                elem.style.display = '';

                // get the normalized screen coordinate of that position
                // x and y will be in the -1 to +1 range with x = -1 being
                // on the left and y = -1 being on the bottom
                tempV.copy(position);
                tempV.project(camera);

                // convert the normalized position to CSS coordinates
                const x = (tempV.x *  .5 + .5) * canvas.clientWidth;
                const y = (tempV.y * -.5 + .5) * canvas.clientHeight;

                // move the elem to that position
                elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

                // set the zIndex for sorting
                elem.style.zIndex = (-tempV.z * .5 + .5) * 100000 | 0;
            }
        }

        function myOnMouseDownFunction( event ) {
            event.preventDefault();
            const mouse = new THREE.Vector2();
            let canvasBounds = renderer.domElement.getBoundingClientRect();
            mouse.x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
            mouse.y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;

            raycaster.setFromCamera( mouse, camera );
            const intersects = raycaster.intersectObjects(scene.children, true);

            //o ultimo && é para disntinguir entre o mundo e as esferas vermelhas, todas as esferas vermelhas têm um raio menor que 1
            if ( intersects.length > 0 && intersects[0].object.geometry.type === 'SphereGeometry' && intersects[0].object.geometry.parameters.radius < 1) {
                controls.enabled = false;
                console.log("entrei no axios")
                axios.get('http://localhost:3000/api/request/' + intersects[0].object.name,{
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                        'Access-Control-Allow-Headers': 'application/json'
                    }
                }).then(response =>{

                    console.log("esta é a nova data mas nova nova")
                    setFilteredNews(response.data.body.hits.hits)
                    console.log(response.data.body.hits.hits)

                })

                console.log("entrei aqui no txi")
            }else {
                controls.enabled = true;
            }
            console.log("I am being called");
            controls.enabled = true;
        }

        function resizeRendererToDisplaySize(renderer) {
            const canvas = renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
                renderer.setSize(width, height, false);
            }
            return needResize;
        }

        let renderRequested = false;

        function render() {
            renderRequested = undefined;

            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            controls.update();

            updateLabels();

            renderer.render(scene, camera);
        }
        render();

        function requestRenderIfNotRequested() {
            if (!renderRequested) {
                renderRequested = true;
                requestAnimationFrame(render);
            }
        }

        window.addEventListener('click',myOnMouseDownFunction ,false);
        controls.addEventListener('change', requestRenderIfNotRequested);
        window.addEventListener('resize', requestRenderIfNotRequested);

    },[])

    return(

        <div id="container">
            <div id="my-gui-container" style={{position:"absolute"}}/>
            <canvas id="c"/>
            <div id="labels"></div>

        </div>

    )
}

export default ThreeDWorldVisualization
