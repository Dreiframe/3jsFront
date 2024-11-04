import * as THREE from 'three';
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { useRef, useEffect, useState } from 'react';


// three.js setup ##########################################################################
const size = 400 // window.innerWidth

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(75, size / size, 0.1, 1000)
var renderer = new THREE.WebGLRenderer()
const loader = new PCDLoader()
const light = new THREE.HemisphereLight()

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


// main component function
function HowToHandle () {
    const refContainer = useRef(null)
    const [testState, setTestState] = useState('main_test.pcd')

    //console.log('HowToHandle Loaded, state:', testState)

    const clickEvent = (fileName) => {
        console.log('click')
        resetScene()
        setTestState(fileName)
    }
    
    // useRef renderer initialize
    useEffect(() => {
        console.log('useEffect 1, state:', testState)
        refContainer.current && refContainer.current.appendChild( renderer.domElement )
    },[])

    // pcd loader setup, update on state change.
    useEffect(() => {
        console.log('useEffect 2, state:', testState)

        loader.load( '/pcd/' + testState, function ( points ) {
            points.geometry.center();
            points.name = 'point_cloud';
            scene.add( points );
    
            render()
        })
    }, [testState])

    return (
        <div ref={refContainer}>
            <button onClick={() => clickEvent('main_test.pcd')}>pcd1</button>
            <button onClick={() => clickEvent('main_test2.pcd')}>pcd2</button>
        </div>
    )
}

export default HowToHandle