import './App.css'
import PointCloud from './components/PointCloud'

import { getTifUrl } from './services/mmlAp'
import UrlContext from './reducers/urlReducer'
import { useContext } from 'react'

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


  return (
    <div>
      <p>hello</p>
      
      <div style={{borderColor:"grey", borderStyle:"solid", borderWidth:"2px", width:"400px", height:"400px"}}>
        <HowToHandle/>
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
