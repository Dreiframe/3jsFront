import axios from "axios"

const baseUrl = 'http://localhost:3001'

export const getTifUrl = async (latitude, longitude) => {
    return await axios.post(
        baseUrl + '/api/2m',
        {latitude, longitude}
    ).then(result => {
        // error/failure handling???
        return result.data.path
    })
}

export const getTifFile = async (latitude, longitude) => {
    return await axios.post(
        baseUrl + '/api/2mtif',
        {latitude, longitude},
        {responseType: 'arraybuffer'}
    ).then(result => {
        // error/failure handling???
        return result.data
    })
}