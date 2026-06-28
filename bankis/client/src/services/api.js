import axios from 'axios'

// const API_URL = 'http://localhost:5000/api'
// const API_URL = '/api'
const API_URL = 'http://localhost:5000/api'

export const getCategories = async () => {
    const response = await axios.get(`${API_URL}/categories`)
    return response.data
}

export const getProducts = async () => {
    const response = await axios.get(`${API_URL}/products`)
    return response.data
}

export const getSpecs = async () => {
    const response = await axios.get(`${API_URL}/specs`)
    return response.data
}