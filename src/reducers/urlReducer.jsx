import { useReducer, createContext } from "react"

export const urlReducer = (state, action) => {
    switch (action.type){
        case "SET":
            return action.payload
        
        default:
            return state
    }
}

const UrlContext = createContext()

export const UrlContextProvider = (props) => {
    const [tifUrl, tifUrlDispatch] = useReducer(urlReducer, undefined)

    return(
        <UrlContext.Provider value={[tifUrl, tifUrlDispatch]}>
            {props.children}
        </UrlContext.Provider>
    )
}

export default UrlContext