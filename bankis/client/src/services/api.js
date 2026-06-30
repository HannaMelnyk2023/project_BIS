import axios from 'axios'

const API_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api')

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

export const sendContact = async ({ name, phone, comment, product }) => {
    const response = await axios.post(
        `${API_URL}/contact`,
        { name, phone, comment, product },
        { timeout: 20_000 },
    )
    return response.data
}
