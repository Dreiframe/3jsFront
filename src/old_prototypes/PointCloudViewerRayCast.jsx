import * as THREE from 'three';
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

import { getTifFile } from "../services/mmlAp";
import { tif2pcd3dcolor } from '../utils/tifUtilities';


// three.js setup ##########################################################################
const size = 500 // window.innerWidth

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(75, size / size, 0.1, 1000)
var renderer = new THREE.WebGLRenderer()
const loader = new PCDLoader()
const light = new THREE.HemisphereLight()

let pointcloud

// diagnose mode
if (false) { 
    let texture = new THREE.TextureLoader().load( 'https://threejs.org/examples/textures/uv_grid_opengl.jpg' );
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    // The X axis is red. The Y axis is green. The Z axis is blue. 
    const axesHelper = new THREE.AxesHelper( 50 )
    scene.add( axesHelper );
}

renderer.setSize(size, size)
camera.position.y = 350

const controls = new OrbitControls( camera, renderer.domElement )
controls.addEventListener( 'change', render )
controls.minDistance = 25
controls.maxDistance = 350
controls.zoomSpeed = 2


scene.add(light)
// #########################################################################################

// DRRUUUUu &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
const pointer = new THREE.Vector2();
document.addEventListener( 'pointermove', onPointerMove );

let raycaster, intersects;
raycaster = new THREE.Raycaster();
//raycaster.params.Points.threshold = 1;

function onPointerMove( event ) {
    /*
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    */
   
    const rect = renderer.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    pointer.x = ( x / size ) *  2 - 1;
    pointer.y = ( y / size ) * - 2 + 1

}

// DRRUUUUu &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


function render() {
    renderer.render( scene, camera )
}

function resetScene() {
    const object = scene.getObjectByName('point_cloud')
    scene.remove(object)
}

function resetControls() {
    controls.reset()
}

function clickEvent(){
    console.log('click')

    raycaster.setFromCamera( pointer, camera );

	intersects = raycaster.intersectObject( pointcloud );

    //console.log(intersects)

    if ( intersects.length > 0 ) {
        for (let x in intersects) {
            const indexi = intersects[x].index
            pointcloud.geometry.attributes.color.setXYZ(indexi, 1, 0, 0) 
        }
    }

    //const object = scene.getObjectByName('point_cloud')
    //pointcloud.geometry.attributes.color.setXYZ(0, 1, 0, 0)  // index, r, g, b
    pointcloud.geometry.attributes.color.needsUpdate = true
    render()
}


// when page is initially loaded use local pcd file, because mml api takes for ever..
var isLocal = true // false = get map from maanmittauslaitos
// main component function
const PointCloudViewer = forwardRef((props, ref) => {
    const refContainer = useRef(null)
    const [testState, setTestState] = useState(null)

    useImperativeHandle(ref, () => ({

        setScene(coordinates) {
            console.log('setScene:', coordinates)
            if ( coordinates.lat &&  coordinates.lng) {
                resetScene()
                isLocal = false
                setTestState({lat: coordinates.lat, lng: coordinates.lng})
            }
        },

        resetCamera() {
            resetControls()
        }
    
    }));
    
    // useRef renderer initialize
    useEffect(() => {
        refContainer.current && refContainer.current.appendChild( renderer.domElement )
    },[])

    
    // pcd loader setup, update on state change.
    useEffect(() => {
        // on initial page load get local pcd example file, faster than getting from mml api.
        if( isLocal ){

            loader.load( '/pcd/main_test.pcd', function ( points ) {
                points.geometry.center();
                points.name = 'point_cloud';
                points.material.size = 0.8

                // DRRRR &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
                //points.geometry.rotateY((Math.PI / 2) * 3) // rotate 90 degreee three times
                points.geometry.rotateX((Math.PI / 2) * 3) // rotate 90 degreee three times
                points.geometry.rotateY((Math.PI / 2) * 3) // rotate 90 degreee three times

                //points.geometry.attributes.color.setXYZ(0, 1, 1, 1)

                pointcloud = points

                scene.add( pointcloud );
         
                render()
            })

        } else {
            console.log('fetching data from mml api')

            if (!testState) return;

            getTifFile(testState.lat, testState.lng)
                .then(data => {
                    console.log('converting fetched data to pointcloud')

                    const points = tif2pcd3dcolor(data)

                    console.log('done fetching')
                    
                    points.geometry.center()
                    points.name = 'point_cloud';
                    points.material.size = 0.8

                    points.geometry.rotateX((Math.PI / 2) * 3) // rotate 90 degreee three times
                    points.geometry.rotateY((Math.PI / 2) * 3) // rotate 90 degreee three times

                    scene.add( points );
                
                    render()
            })
                .catch(error => {
                    // backend down, or other issues?
                    console.log('error:', error)
            })

        }

    }, [testState])

    return (
        <div ref={refContainer} onClick={() => clickEvent()}>
        </div>
    )
})

export default PointCloudViewer