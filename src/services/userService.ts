import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export interface User {
    id: string
    customerName: string
    phone: string
    address: string
    facebookLink: string
    createdAt: string
}

export const userService = {
    async getUsers(): Promise<User[]> {
        try {
            const response = await axios.get(`${API_URL}/users`)
            return response.data
        } catch (error) {
            console.error('Error fetching users:', error)
            throw error
        }
    },

    async addUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
        try {
            const response = await axios.post(`${API_URL}/users`, user)
            return response.data
        } catch (error) {
            console.error('Error adding user:', error)
            throw error
        }
    }
} 