import { useEffect, useRef, useState } from "react";

import * as THREE from 'three';
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import GUI from 'lil-gui'

import { getTif, tif2pcd3dcolor } from '../utils/tifUtilities';

import UrlContext from '../reducers/urlReducer'
import { useContext } from 'react'
import { getTifFile } from "../services/mmlAp";


// when page is initially loaded use local pcd file, because mml api takes for ever..
let isLocal = true // false = get map from maanmittauslaitos


function PointCloud() {
  const [tifUrl, dispatch] = useContext(UrlContext)
  const refContainer = useRef(null);

  const [leafCoords, setLeafCoords] = useState(null)


  // on click event whone component reloads and this is set to true again..
  // reloads whole component... why??? because of useContext???
  // let isLocal = true // false = get map from maanmittauslaitos
  console.log('RELOADED WHOLE FUCKING COMPONENTS')

  /*
  if (tifUrl !== undefined){
    isLocal = false
  }
  */


  // on click set coordinates which useEffect reloads 3js again, and set local to false so we get data from mml api
  const clickEvent = (event) => {
    console.log(tifUrl)
    event.preventDefault()

    if(tifUrl){
      console.log('done')
      isLocal = false
      setLeafCoords({lat: tifUrl.lat, lng: tifUrl.lng})
    } else {
      console.log('nope')
    }
  }
  

  useEffect(() => {
    const size = 400//window.innerHeight

    // === THREE.JS CODE START ===
    var scene = new THREE.Scene();
    //var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var camera = new THREE.PerspectiveCamera(75, size / size, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(size, size);
    camera.position.z = 350;
    camera.up.set(-1, 0, 0);

    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    refContainer.current && refContainer.current.appendChild( renderer.domElement );

    // orbit controls
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); // use if there is no animation loop
    controls.minDistance = 50;
    controls.maxDistance = 350;
    // controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };

    console.log(isLocal)
    // pointcloud
    if (!isLocal){
      //getTifFile(62.64568469181762, 29.81714359294687)
      getTifFile(tifUrl.lat, tifUrl.lng)
        .then(data => {
          const points = tif2pcd3dcolor(data)

          console.log('asd')
          
          points.geometry.center()
          points.name = 'pointclouddatafile.pcd';
          scene.add( points );
    
          render()
      })
        .catch(error => {
          // backend down, or other issues?
          console.log('error:', error)
        })
      /*
      getTif(tifUrl).then(data => {
        const points = tif2pcd3dcolor(data)

        console.log('asd')
        
        points.geometry.center()
        points.name = 'pointclouddatafile.pcd';
        scene.add( points );
  
        render()
      })
      */
    } else {
      const loader = new PCDLoader();
      // 'http://localhost:3001/pcd' or '/pcd/main_test.pcd'
      loader.load( '/pcd/main_test.pcd', function ( points ) {

        points.geometry.center();
        //points.geometry.rotateX( Math.PI );
        //points.geometry.rotateY( Math.PI );
        //points.geometry.rotateZ( Math.PI );
        points.name = 'test.pcd';
        scene.add( points );

        //
        const gui = new GUI();

        gui.add( points.material, 'size', 0.1, 1 ).onChange( render );
        gui.addColor( points.material, 'color' ).onChange( render );
        gui.open();
        //

        render();
    } );
    }

    //light
    const light = new THREE.HemisphereLight();
    scene.add(light);

    function render() {
        renderer.render( scene, camera );
    }

    render()
  }, [leafCoords]);
  
  return (
    <div ref={refContainer}>
      <button onClick={(e) => clickEvent(e)}>get map</button>
    </div>
  );
}

export default PointCloud