import './App.css'
import PointCloud from './components/PointCloud'

import { getTifUrl } from './services/mmlAp'
import UrlContext from './reducers/urlReducer'
import { useContext } from 'react'

function App() {
  const [tifUrl, dispatch] = useContext(UrlContext)

  
  const tiftest = () => {
    console.log('....')
    getTifUrl(62.63919412494686, 29.805031887871078).then(path => {
      dispatch({type: "SET", payload: path})
    }).catch(e => {
      console.log('error', e)
    })
  }

  const btest = () => {
    dispatch({type: "SET", payload: 'http://localhost:3001/tif'})
  }


  return (
    <>
      <p>{tifUrl}</p>
      <button onClick={() => tiftest()}>fucking cors..</button>
      <button onClick={() => btest()}>localhost</button>
      <h1>Testing:</h1>
      <div style={{borderColor:"grey", borderStyle:"solid", borderWidth:"2px", width:"400px", height:"400px"}}>
        <PointCloud/>
      </div>
    </>
  )
}

export default App
