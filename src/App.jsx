import './App.css'

import StorageContext from './reducers/storageReducer'
import { useContext, useRef } from 'react'

import LeafletTesting from './components/leafletTest'

import PointCloudViewer from './components/PointCloudViewer'
import PointCloudStats from './components/PointCloudStats'

function App() {
  const [storage, dispatch] = useContext(StorageContext)

  const CoordinatesDisplay = () => {
    if (storage) {
      if ('lat' in storage && 'lng' in storage){
        return <p>Latitude: {storage.lat}, Longitude: {storage.lng}</p>
      }
    }

    return <p> Click map to select coordinates </p>;
  }

  const childRef = useRef()

  const clickEvent = () => {
    if (storage) {
      if ('lat' in storage && 'lng' in storage){
        childRef.current.setScene({lat: storage.lat, lng: storage.lng})
        return
      }
    }

    console.log('App Click error: latlng undefined')
  }

  return (
    <div>
      <CoordinatesDisplay/>
      <button onClick={() => clickEvent()}>fetch elevation map</button>
      <button onClick={() => childRef.current.resetCamera()}>Reset camera</button>

      <div className='DualContainer'>

        <div style={{borderColor: "grey", borderStyle: "solid", borderWidth:"2px"}}>
          <LeafletTesting/>
        </div>

        <div style={{borderColor:"grey", borderStyle:"solid", borderWidth:"2px", width:"500px", height:"500px"}}>
          <PointCloudViewer ref={childRef}/>
        </div>

      </div>
      
      <button onClick={() => dispatch({type: "SET_INFO", payload: {size: 250, high: 10, low: 2}})}>set map stat</button>
      <button onClick={() => dispatch({type: "SET_CURSOR", payload: {x:1, y:1, z:1}})}>set map stat</button>

      <PointCloudStats/>
    </div>
  )
}

export default App
