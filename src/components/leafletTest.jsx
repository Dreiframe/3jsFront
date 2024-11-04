import "leaflet/dist/leaflet.css"
import { useState } from "react"

import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet"

import UrlContext from '../reducers/urlReducer'
import { useContext } from 'react'

// https://react-leaflet.js.org/docs/example-events/
const LeafletTesting = () => {
    const [tifUrl, dispatch] = useContext(UrlContext)
    const [coordinates, setCoordinates] = useState(null)

    // Event listener on map clicks and marker for coordinates
    const LocationMarker = () => {
        const map = useMapEvents({
            click(){}
        })
    
        map.on("click", event => {
            const clickCoordinates = event.latlng
            setCoordinates(clickCoordinates)
            dispatch({type: "SET", payload: {lat: clickCoordinates.lat, lng: clickCoordinates.lng}})
        })

        return coordinates === null ? null : (
            <Marker position={coordinates}>
            </Marker>
          )
    }

    const DisplayCoordinates = ({coordinates}) => {
        if (coordinates){
            return (
                <p>{coordinates.lat} {coordinates.lng}</p>
            )
        } else {
            return (
                <p>no coords</p>
            )
        }
    }

    return (
        <div>
            <DisplayCoordinates coordinates={coordinates}/>
            <MapContainer center={[62.663354542428245, 29.815711062371737]} zoom={12} style={{ height: "400px", width: "400px" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker/>
            </MapContainer>
        </div>
    )
}

export default LeafletTesting