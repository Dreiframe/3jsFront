import StorageContext from '../reducers/storageReducer'
import { useContext } from 'react'

export default function PointCloudStats () {
    const [storage, dispatch] = useContext(StorageContext)

    const MapStats = () => {
        if (storage === undefined) {
            return (<div> <p>no storage</p> </div>)
        }
        if (!('stats' in storage)) {
            return (<div> <p>no stats</p> </div>)
        }
        if (storage.stats.high === undefined){
            return (<div> <p>undefined stats</p> </div>)
        }

        return(
            <div>
                <h4 style={{margin: 0}}>Map:</h4>

                <p>size: {storage.stats.size}</p>
                <p>high: {storage.stats.high}</p>
                <p>low: {storage.stats.low}</p>
            </div>
        )
    }

    const CursorStats = () => {
        if (storage === undefined) {
            return (<div> <p>no storage</p> </div>)
        }
        if (!('cursor' in storage)) {
            return (<div> <p>no cursor</p> </div>)
        }
        if (storage.cursor.x === undefined){
            return (<div> <p>undefined cursor</p> </div>)
        }

        return (
            <div>
                <h4 style={{margin: 0}}>Cursor:</h4>

                <p>x: {storage.cursor.x}</p>
                <p>y: {storage.cursor.y}</p>
                <p>z: {storage.cursor.z}</p>
            </div>
        )
    }

    return (
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
            <MapStats/>
            <CursorStats/>
        </div>
    )
}