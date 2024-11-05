import './App.css'
import PointCloud from './components/PointCloud'

import { getTifUrl } from './services/mmlAp'
import UrlContext from './reducers/urlReducer'
import { useContext, useRef } from 'react'

import LeafletTesting from './components/leafletTest'

//DELETE LATER
import HowToHandle from './components/HowToHandle'

function App() {
  const [tifUrl, dispatch] = useContext(UrlContext)

  const TifUrlDisplay = () => {
    if (tifUrl) {
      return (
        <p>{tifUrl.lat} {tifUrl.lng}</p>
      )
    } else {
      return (
        <p> no coordinates </p>
      )
    }
  }

  const childRef = useRef()

  return (
    <div>
      <TifUrlDisplay/>
      <button onClick={() => childRef.current.setScene({lat: tifUrl.lat, lng: tifUrl.lng})}>fetch</button>

      <div className='DualContainer'>

        <div style={{borderStyle: "solid", borderColor: "red", borderWidth:1}}>
          <LeafletTesting/>
        </div>

        <div style={{borderColor:"grey", borderStyle:"solid", borderWidth:"2px", width:"500px", height:"500px"}}>
          <HowToHandle ref={childRef}/>
        </div>

      </div>
    </div>
  )
  /*
  return (
    <>
      <TifUrlDisplay/>
      <h1>Testing:</h1>

      <div className='DualContainer'>
        <div style={{borderStyle: "solid", borderColor: "red", borderWidth:1}}>
          <LeafletTesting/>
        </div>

        <div style={{borderColor:"grey", borderStyle:"solid", borderWidth:"2px", width:"400px", height:"400px"}}>
          <PointCloud/>
        </div>
      </div>
    </>
  )
    */
}

export default App
