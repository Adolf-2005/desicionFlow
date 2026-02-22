import axios from 'axios'
import { getToken } from './authdecode'
const backendURL = import.meta.env.VITE_BACKEND_URL

export async function apiCall(endpoint, method = 'GET', data = null) {
  try {
    const config = {
      method,
      url: `${backendURL}/${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) // Agregar token si existe
      },
      ...(data ? { data } : {}) // Incluir datos si existen
    }
    const response = await axios(config)
    return response // Retornar solo los datos en JSON
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error de conexión' }
  }
}

export async function apiCallFiles(endpoint, method = 'POST', formData = null) {
  try {
    const config = {
      method,
      url: `${backendURL}/${endpoint}`,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
      },
      data: formData
    }
    const response = await axios(config)
    return response
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error de conexión' }
  }
}

export async function uploadFilesWithFetch(endpoint, formData) {
  try {
    const url = `${backendURL}/${endpoint}`

    const headers = {}
    if (getToken()) {
      headers['Authorization'] = `Bearer ${getToken()}`
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: formData
    })
    const data = await response.json()
    if (!response.ok) {
      throw data
    }

    return { data, status: response.status }

  } catch (error) {
    console.error('❌ Error en fetch:', error)
    throw error
  }
}
