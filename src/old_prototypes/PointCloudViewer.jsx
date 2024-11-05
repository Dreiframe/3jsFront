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

let texture = new THREE.TextureLoader().load( 'uv_grid_opengl.jpg' );
texture.mapping = THREE.EquirectangularReflectionMapping;
scene.background = texture;

renderer.setSize(size, size)
camera.position.z = 350
camera.up.set(-1, 0, 0)

const controls = new OrbitControls( camera, renderer.domElement )
controls.addEventListener( 'change', render )
controls.minDistance = 50
controls.maxDistance = 350

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
    useEffect(() => {
        // on initial page load get local pcd example file, faster than getting from mml api.
        if( isLocal ){

            loader.load( '/pcd/main_test.pcd', function ( points ) {
                points.geometry.center();
                points.name = 'point_cloud';
                points.material.size = 0.8
                scene.add( points );
        
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
        <div ref={refContainer}>
        </div>
    )
})

export default PointCloudViewer