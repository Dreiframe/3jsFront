import * as THREE from 'three';
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

import { getTifFile } from "../services/mmlAp";
import { getTif, tif2pcd3dcolor, tif2pcd, pcd2points } from '../utils/tifUtilities';


// three.js setup ##########################################################################
const size = 500 // window.innerWidth

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(75, size / size, 0.1, 1000)
var renderer = new THREE.WebGLRenderer()
const loader = new PCDLoader()
const light = new THREE.HemisphereLight()

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
    // on initial page load get local pcd example file, faster than getting from mml api.
    useEffect(() => {
        async function loadPointCloud(tifData) {
            if(!tifData) return undefined

            const pcData = tif2pcd(tifData)
            console.log(pcData)
            const points = pcd2points(pcData.geometry)
            
            points.geometry.center();
            points.name = 'point_cloud';
            points.material.size = 0.8

            //points.geometry.rotateY((Math.PI / 2) * 3) // rotate 90 degreee three times
            points.geometry.rotateX((Math.PI / 2) * 3) // rotate 90 degreee three times
            points.geometry.rotateY((Math.PI / 2) * 3) // rotate 90 degreee three times

            scene.add( points );
        
            render()
        }


        if( isLocal ){
            getTif('tif/main_test.tif')
                .then(data => {
                    loadPointCloud(data)
                })
        } else {
            console.log('fetching data from mml api')

            if (!testState) return;

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
        <div ref={refContainer}>
        </div>
    )
})

export default PointCloudViewer