import { useReducer, createContext } from "react"

export const storageReducer = (state, action) => {
    switch (action.type){
        case "SET_INFO":
            console.log(state)
            return {
                ...state,
                set: action.payload
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