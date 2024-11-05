import './App.css'

import UrlContext from './reducers/urlReducer'
import { useContext, useRef } from 'react'

import LeafletTesting from './components/leafletTest'

//DELETE LATER
import HowToHandle from './components/HowToHandle'

function App() {
  const [tifUrl, dispatch] = useContext(UrlContext)

  const TifUrlDisplay = () => {
    if (tifUrl) {
      return <p>Latitude: {tifUrl.lat}, Longitude: {tifUrl.lng}</p>
    } else return <p> Click map to select coordinates </p>;
  }

  const childRef = useRef()

  const clickEvent = () => {
    if (tifUrl) {
      childRef.current.setScene({lat: tifUrl.lat, lng: tifUrl.lng})
    } else console.log('App Click error: latlng undefined')
  }

  return (
    <div>
      <TifUrlDisplay/>
      <button onClick={() => clickEvent()}>fetch elevation map</button>

      <div className='DualContainer'>

        <div style={{borderColor: "grey", borderStyle: "solid", borderWidth:"2px"}}>
          <LeafletTesting/>
        </div>

        <div style={{borderColor:"grey", borderStyle:"solid", borderWidth:"2px", width:"500px", height:"500px"}}>
          <HowToHandle ref={childRef}/>
        </div>

      </div>
    </div>
  )
}

export default App
