// I dont think this is a good solution for my problem, change later?

import { useReducer, createContext } from "react"

/* 
interface storage {
    lat: number,
    lng: number,

    stats: {
        size,
        high,
        low,
        median?
    },

    cursor: {
        x, y, z
    }
}
*/


    /*
    <p>Size:</p>
            <p>Highest:</p>
            <p>Lowest:</p>
            <p>Median?:</p>

            <p>Selected</p>
            <p>x y z</p>
    */

export const storageReducer = (state, action) => {
    switch (action.type){
        case "SET_INFO":
            console.log(state)
            return {
                ...state,
                stats: {
                    size: action.payload.size,
                    high: action.payload.high,
                    low: action.payload.low
                }
            }

        case "SET_CURSOR":
            return {
                ...state,
                cursor: {
                    x: action.payload.x,
                    y: action.payload.y,
                    z: action.payload.z
                }
            }

        case "SET_COORDINATES":
            return {
                ...state,
                lat: action.payload.lat,
                lng : action.payload.lng,
            }
        
        default:
            return state
    }
}

const StorageContext = createContext()

export const StorageContextProvider = (props) => {
    const [storage, storageDispatch] = useReducer(storageReducer, undefined)

    return(
        <StorageContext.Provider value={[storage, storageDispatch]}>
            {props.children}
        </StorageContext.Provider>
    )
}

export default StorageContext