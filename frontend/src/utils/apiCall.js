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