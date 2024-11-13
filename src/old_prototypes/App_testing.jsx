import './App.css'
import { tif2pcd, getTif, pcd2points } from './utils/tifUtilities'

import PointCloudViewer from './components/PointCloudViewer'

function App(){

    const whatthefuck = (data) => {
        console.log(data)
    }

    const clickEvent = async () => {
        console.log('clicked')
        const tifData = await getTif('tif/main_test.tif')
                                .catch(e => {console.log('getTif error'); return undefined})

        if(!tifData) return

        const pcData = tif2pcd(tifData)
        const points = pcd2points(pcData.geometry)
        console.log(points)
    }

    return(
        <div>
            <p>hello</p>
            <button onClick={() => clickEvent()}>BUTTON</button>
            <PointCloudViewer/>
        </div>
    )
}      
export default App