import * as THREE from 'three';
import vertex from './shaders/vertex'
import fragment from './shaders/fragment'
import atmosphereVertex from './shaders/atmosphereVertex'
import atmosphereFragment from './shaders/atmosphereFragment'
import atmosphereVertexShader from "./shaders/atmosphereVertex";
import atmosphereFragmentShader from "./shaders/atmosphereFragment";
import {useRef, useEffect} from "react";

export const Background = () => {

    const ref = useRef();

    useEffect(()=>{

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )

    const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true

        }
    )

    renderer.setSize(window.innerWidth/7, window.innerHeight/7)
    renderer.setPixelRatio(window.devicePixelRatio)
    document.body.appendChild((renderer.domElement))
    ref.current.appendChild(renderer.domElement);



//create a sphere

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 50, 50),
        new THREE.ShaderMaterial({

            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                globeTexture: {
                    value: new THREE.TextureLoader().load('./earth.jpg')
                }
            }

        })
    )

        const moon = new THREE.Mesh(new THREE.SphereGeometry(5, 50, 50),
            new THREE.ShaderMaterial({

                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                    globeTexture: {
                        value: new THREE.TextureLoader().load('./moon_texture.jpg')
                    }
                }

            })
        )



    //create atmosphere
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(5, 50, 50),
        new THREE.ShaderMaterial({

            vertexShader: atmosphereVertexShader,
            fragmentShader: atmosphereFragmentShader,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide

        })
    )

        const cloud = new THREE.Mesh(new THREE.SphereGeometry(5.02, 50, 50),
            new THREE.ShaderMaterial({

                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                    globeTexture: {
                        //value: new THREE.TextureLoader().load('./fair_clouds_8k.jpg'),
                        transparent: true,
                    }
                }
            })
        )



        // let fontLoader = new THREE.FontLoader();
        //     fontLoader.load('./font.json', function (font)
        // {
        //     let geometrySetting = {
        //         font: font,
        //         size: 1.3,
        //         height: 0.2,
        //         curveSegments: 10,
        //
        //
        //     };
        //
        //     let textGeoNewsSeek = new THREE.TextGeometry('NewsSeek', geometrySetting);
        //     let textMatNewsSeek = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('./news.jpg')})
        //
        //     let textNewsSeek = new THREE.Mesh(textGeoNewsSeek, textMatNewsSeek)
        //
        //    textNewsSeek.position.set(-5.65, -7, 1); // y = 5.4 para colocar em cima e x = -4
        //     //scene.add(textNewsSeek)
        //     //const textPivot = new THREE.Object3D();
        //    // cameraPivot.add(textPivot)
        //     //textPivot.add(textNewsSeek)
        //     //textNewsSeek.scale.set(1.2, 1.2, 1.2)
        //
        // });



            let ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
            scene.add(ambientLight)




        const moonPivot = new THREE.Object3D();
        sphere.add(moonPivot);
        moonPivot.add(moon);

        const cameraPivot = new THREE.Object3D();
        sphere.add(cameraPivot);

        cameraPivot.add(camera);

        sphere.scale.set(1, 1, 1)
        atmosphere.scale.set(1.1, 1.1, 1.1)
        moon.scale.set(0.1, 0.1, 0.1)
        moon.position.x = 7;
        //scene.add(cloud)
        //sphere.position.y = 60
        scene.add(sphere)
        //scene.add(atmosphere)
        scene.add(moon)


    camera.position.z = 15

        console.log(sphere.position)



    function animate() {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
        sphere.rotation.y += 0.017;
        moon.rotation.y -= 0.01;
        cameraPivot.rotation.y += 0.004;

    }

    animate();
    //renderer.setClearColor( 0x212529, 1 );
        //renderer.setClearColor( 0x000000, 0 );



    },[])

    return(
        <div ref={ref} style={{width: '100px', height: '100px', zIndex: '100', position:'absolute', marginLeft: '265px', marginTop: '-23px'}}/>
    )

}
export default Background
