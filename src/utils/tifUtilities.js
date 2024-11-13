import axios from 'axios'
import { BufferGeometry, Color, Float32BufferAttribute, Points, PointsMaterial, SRGBColorSpace } from 'three/src/Three.js'
import { decode } from 'tiff'


const colorMap = (x, in_min, in_max) => {
    // used for linear mapping.
    return (x - in_min) / (in_max - in_min);
}


export const getTif = async (urlPath) => {
    // responseType: 'arraybuffer' is critical, tiff decode or utiff decode both work on buffers
    const request = axios.get(urlPath, {responseType: 'arraybuffer'})

    return request
        .then(response => {return response.data})
        .catch(error => {return Promise.reject(error)})
}


export const tif2pcd = (data) => {
    // the purpose of this function
    // decode .tif file into readable format
    // calculate values like minZ maxZ and mean
    // create xyz array for threejs geometry position
    // create rgb array for threejs geometry color

    // https://github.com/image-js/tiff
    // decode tiff file into readable format 
    const tiff = decode(data)[0]
    

    // get z min and max for elevation to color linear mapping
    let min_value = Number.MAX_VALUE
    let max_value = 0
    let mean_value = 0
    for(var i = 0; i < tiff.size; i++){
        const z = tiff.data[i]

        if (z > max_value){
            max_value = z
        }

        if (z < min_value){
            min_value = z
        }

        mean_value += z
    }

    mean_value = mean_value / tiff.size

    // tiff.data is a 1 dimensional array: 500x500 file is 250000 long
    // so we loop for y(500), then for x(500) and get z value from index(250000)
    const position = []  // creating x y z array for for 3js geometry
    const color = [] // creating rgb for 3js material?
    const c = new Color()

    let index = 0

    for (var y = 0; y < tiff.height; y++){
        for (var x = 0; x < tiff.width; x++){
            const z = tiff.data[index]

            // geometry
            position.push(y) // x for 3js geometry
            position.push(x) // y for 3js geometry
            position.push(z) // z for 3js geometry

            // color
            const rgb_value = colorMap(z, min_value, max_value)  // z 70m-130m -> 0.0 - 1.0
            c.setRGB(rgb_value, rgb_value, rgb_value, SRGBColorSpace) //rgb values 0.0 - 1.0
            color.push( c.r, c.g, c.b )

            index++
        }
    }

    return {
        geometry: {position, color}, 
        data: {min_value, max_value, mean_value, size: tiff.size, width: tiff.width, height: tiff.height, resolution: tiff.resolutionUnit}
    }
}
  

export const pcd2points = ({position, color}) => {
    // https://github.com/mrdoob/three.js/blob/master/examples/jsm/loaders/PCDLoader.js
    // build 3js geometry
    const geometry = new BufferGeometry()

    if ( position.length > 0 ) geometry.setAttribute( 'position', new Float32BufferAttribute( position, 3 ) );
    if ( color.length > 0 ) geometry.setAttribute( 'color', new Float32BufferAttribute( color, 3 ) );

    geometry.computeBoundingSphere()

    // build material

    const material = new PointsMaterial( { size: 0.005 } )

    if ( color.length > 0 ) {

        material.vertexColors = true;

    }

    // build point cloud

    return new Points( geometry, material )
}


export const tif2pcd3dcolor = (data) => {
    // https://github.com/image-js/tiff
    // decode tiff file into readable format 
    const tiff = decode(data)[0]
    

    // get z min and max for depth to color mapping
    let min_value = Number.MAX_VALUE
    let max_value = 0
    for(var i = 0; i < tiff.size; i++){
        const z = tiff.data[i]
        if (z > max_value){
            max_value = z
        }
        if (z < min_value){
            min_value = z
        }
    }

    // tiff.data is a 1 dimensional array: 500x500 file is 250000 long
    // so we loop for y(500), then for x(500) and get z value from index(250000)
    // x and y might be filled around?
    const position = []  // creating x y z array for for 3js geometry
    const color = [] // creating rgb for 3js material?
    const c = new Color()

    let index = 0

    for (var y = 0; y < tiff.height; y++){
        for (var x = 0; x < tiff.width; x++){
            const z = tiff.data[index]

            // geometry
            position.push(y) // x for 3js geometry
            position.push(x) // y for 3js geometry
            position.push(z) // z for 3js geometry

            // color
            const rgb_value = colorMap(z, min_value, max_value)  // z 70m-130m -> 0.0 - 1.0
            c.setRGB(rgb_value, rgb_value, rgb_value, SRGBColorSpace) //rgb values 0.0 - 1.0
            color.push( c.r, c.g, c.b )

            index++
        }
    }

    // https://github.com/mrdoob/three.js/blob/master/examples/jsm/loaders/PCDLoader.js
    // build 3js geometry
    const geometry = new BufferGeometry()

    if ( position.length > 0 ) geometry.setAttribute( 'position', new Float32BufferAttribute( position, 3 ) );
    if ( color.length > 0 ) geometry.setAttribute( 'color', new Float32BufferAttribute( color, 3 ) );

    geometry.computeBoundingSphere()

    // build material

    const material = new PointsMaterial( { size: 0.005 } )

    if ( color.length > 0 ) {

        material.vertexColors = true;

    }

    // build point cloud

    return new Points( geometry, material )
}


export const tif2pcd3d = (data) => {
    // https://github.com/image-js/tiff
    // decode tiff file into readable format 
    const tiff = decode(data)[0]
    
    const position = []  //creating x y z array for for 3js geometry

    // tiff.data is a 1 dimensional array: 500x500 file is 250000 long
    // so we loop for y(500), then for x(500) and get z value from index(250000)
    // x and y might be filled around?
    let index = 0

    for (var y = 0; y < tiff.height; y++){
        for (var x = 0; x < tiff.width; x++){
            position.push(y) // x for 3js geometry
            position.push(x) // y for 3js geometry
            position.push(tiff.data[index]) // z for 3js geometry
            index++
        }
    }

    // https://github.com/mrdoob/three.js/blob/master/examples/jsm/loaders/PCDLoader.js
    // build 3js geometry
    const geometry = new BufferGeometry()

    if ( position.length > 0 ) geometry.setAttribute( 'position', new Float32BufferAttribute( position, 3 ) );

    geometry.computeBoundingSphere()

    // build material

    const material = new PointsMaterial( { size: 0.005 } )

    // build point cloud

    return new Points( geometry, material )
}


const arduinoMap = (x, in_min, in_max, out_min, out_max) => {
    // https://docs.arduino.cc/language-reference/en/functions/math/map/
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
