import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import { useRef, useEffect, useState, forwardRef, useImperativeHandle, useContext } from 'react';

import { getTifFile } from "../services/mmlAp";
import { getTif, tif2pcd, pcd2points, arduinoMap } from '../utils/tifUtilities';
import StorageContext from '../reducers/storageReducer';

// three.js setup ##########################################################################
console.log('Setting up three.js')
const diagnoseMode = true
const size = 500 // window.innerWidth

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(75, size / size, 0.1, 1000)
var renderer = new THREE.WebGLRenderer()
const light = new THREE.HemisphereLight()

// diagnose mode
if (diagnoseMode) { 
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


// Ray cast setup ##########################################################################
let pointcloud

const pointer = new THREE.Vector2();
document.addEventListener( 'pointermove', onPointerMove );

let raycaster, intersects;
raycaster = new THREE.Raycaster();

// onClick triggers on drag, so if this variable changes during onMouseDown and onClick the screen was dragged.
let lastControlsAzimuth
let lastControlsPolar

function onPointerMove( event ) {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    pointer.x = ( x / size ) *  2 - 1;
    pointer.y = ( y / size ) * - 2 + 1
}

function onClickDownEvent(){
    // onClick and drag conflict workaround
    lastControlsAzimuth = controls.getAzimuthalAngle()
    lastControlsPolar = controls.getPolarAngle()
}

function drawRay(raycaster) {
    // Remove the previous line if it exists
    const prevLine = scene.getObjectByName("rayLine");
    if (prevLine) {
        scene.remove(prevLine);
    }

    // The raycaster.ray contains the origin and direction
    const origin = raycaster.ray.origin;
    const direction = raycaster.ray.direction
        .clone()
        .multiplyScalar(1000); // Extend the direction
    const end = origin.clone().add(direction);

    const geometry = new THREE.BufferGeometry().setFromPoints(
        [origin, end]
    );
    const material = new THREE.LineBasicMaterial({
        color: 0xff0000, // Make it RED
    });
    const line = new THREE.Line(geometry, material);
    line.name = "rayLine"; // Name the line for easy reference

    scene.add(line);
}

// #########################################################################################


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


// when page is initially loaded use local file, because fetching from api might take 20seconds.
var isLocal = true

// main component function
const PointCloudViewer = forwardRef((props, ref) => {
    const refContainer = useRef(null)
    const [testState, setTestState] = useState(null)
    const [storage, dispatch] = useContext(StorageContext)


    function clickEvent(){
        // dont execute if controls angles have changed since onMouseDown={() => onClickDownEvent()}, screen was dragged.
        if (Math.abs(lastControlsAzimuth - controls.getAzimuthalAngle()) >= 0.01 &&
            Math.abs(lastControlsPolar - controls.getPolarAngle()) >= 0.01){
            return
        }
    
        raycaster.setFromCamera( pointer, camera );
    
        intersects = raycaster.intersectObject( pointcloud );
    
        if (diagnoseMode){
            drawRay(raycaster)
        }
    
        if (intersects.length > 0) {
            // elevation could be from 20 - 60 meters from sea level
            // but pointcloud geometry could be for example -20 - +20
            // using arduino map to linearly scale from geometry to sea level meters
            // also pointcloud geometry has z and y axis flipped, so we are using y instea of z.
            const selectedz = intersects[0].point.y
            const bminz = pointcloud.geometry.boundingBox.min.y
            const bmaxz = pointcloud.geometry.boundingBox.max.y
            // const elevation = arduinoMap(selectedz, bminz, bmaxz, pointcloudStats.min_value, pointcloudStats.max_value)
            const elevation = arduinoMap(selectedz, bminz, bmaxz, storage.stats.low, storage.stats.high)

            //console.log(intersects[0].point)

            dispatch({type: "SET_CURSOR", payload: {x:intersects[0].point.x + 250, y:intersects[0].point.z + 250, z:elevation}})
        }
    
        render()
    }


    // these functions are called outside of this component
    // like resetting camera on button click
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
    
    // useRef renderer initialize, attach three.js renderer to react element
    useEffect(() => {
        refContainer.current && refContainer.current.appendChild( renderer.domElement )
    },[])

    
    // pcd loader setup, update on state change.
    // on initial page load get local pcd example file, faster than getting from mml api.
    useEffect(() => {
        async function loadPointCloud(tifData) {
            if(!tifData) return undefined

            // turn .tif file into pointcloud format, returns geometry colors and data info
            const pcData = tif2pcd(tifData)

            // this is for displaying pointcloud data in other components
            dispatch({
                type: "SET_INFO",
                payload: {
                    size: pcData.data.size, 
                    high: pcData.data.max_value, 
                    low: pcData.data.min_value,
                }
            })

            pointcloud = pcd2points(pcData.geometry)

            //pointcloud.geometry.computeBoundingBox()
            //console.log('pointcloud bbox', points.geometry.boundingBox.min)
            //prints pointcloud bbox { x: 0, y: 0, z: 92.41200256347656 }
            
            pointcloud.geometry.center();
            pointcloud.name = 'point_cloud';
            pointcloud.material.size = 0.8

            //points.geometry.rotateY((Math.PI / 2) * 3) // rotate 90 degreee three times
            pointcloud.geometry.rotateX((Math.PI / 2) * 3) // rotate 90 degreee three times
            pointcloud.geometry.rotateY((Math.PI / 2) * 3) // rotate 90 degreee three times

            scene.add( pointcloud );
        
            render()
        }


        // true = load local file, false = fetch from maanmittauslaitos api.
        if( isLocal ){
            getTif('tif/main_test.tif')
                .then(data => {
                    loadPointCloud(data)
                })
        } else {
            console.log('fetching data from mml api')

            getTifFile(testState.lat, testState.lng)
                .then(data => {
                    loadPointCloud(data)
            })
                .catch(error => {
                    // backend down, or other issues?
                    console.log('error:', error)
            })
        }

    }, [testState])

    return (
        <div ref={refContainer} onClick={() => clickEvent()} onMouseDown={() => onClickDownEvent()}>
        </div>
    )
})

export default PointCloudViewer