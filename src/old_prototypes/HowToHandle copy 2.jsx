import * as THREE from 'three';
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';


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


// when page is initially loaded use local pcd file, because mml api takes for ever..
var isLocal = true // false = get map from maanmittauslaitos
// main component function
const HowToHandle = forwardRef((props, ref) => {
    const refContainer = useRef(null)
    const [testState, setTestState] = useState('main_test.pcd')

    //console.log('HowToHandle Loaded, state:', testState)

    useImperativeHandle(ref, () => ({

        setScene(fileName) {
            resetScene()
            setTestState(fileName)
        }
    
    }));
    
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
        </div>
    )
})

export default HowToHandle