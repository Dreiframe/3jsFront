import './App.css'

import UrlContext from './reducers/urlReducer'
import { useContext, useRef } from 'react'

import LeafletTesting from './components/leafletTest'

//DELETE LATER
import PointCloudViewer from './components/PointCloudViewer'

function App() {
  const [coordinates, dispatch] = useContext(UrlContext)

  const CoordinatesDisplay = () => {
    if (coordinates) {
      return <p>Latitude: {coordinates.lat}, Longitude: {coordinates.lng}</p>
    } else return <p> Click map to select coordinates </p>;
  }

  const childRef = useRef()

  const clickEvent = () => {
    if (coordinates) {
      childRef.current.setScene({lat: coordinates.lat, lng: coordinates.lng})
    } else console.log('App Click error: latlng undefined')
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
    </div>
  )
}

export default App
