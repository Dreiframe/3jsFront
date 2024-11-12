import "leaflet/dist/leaflet.css"
import { useState } from "react"

import { MapContainer, TileLayer, useMapEvents, Rectangle } from "react-leaflet"

import StorageContext from '../reducers/storageReducer'
import { useContext } from 'react'

import bboxFromLatLng from "../utils/bboxFromLatLng"

// https://react-leaflet.js.org/docs/example-events/
const LeafletTesting = () => {
    const [storage, dispatch] = useContext(StorageContext)
    const [bbox, setbbox] = useState(bboxFromLatLng(62.66591065727223, 29.81011475983172))

    // Event listener on map clicks and 1km2 square rectangle at coordinates
    const LocationMarker = () => {
        useMapEvents({
            click(event){
                const clickCoordinates = event.latlng
                dispatch({type: "SET_COORDINATES", payload: {lat: clickCoordinates.lat, lng: clickCoordinates.lng}})

                setbbox(bboxFromLatLng(clickCoordinates.lat, clickCoordinates.lng))
            }
        })

        return (
            <Rectangle bounds={bbox} pathOptions={{color: "black"}}/>
        )
    }


    return (
        <div>
            <MapContainer center={[62.66591065727223, 29.81011475983172]} zoom={14} style={{ height: "500px", width: "500px" }}>
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