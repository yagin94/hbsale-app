import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export interface Order {
  id: string
  customerName: string
  facebookLink: string
  address: string
  product: string
  size: string
  color: string
  sellingPrice: number
  costPrice: number
  isFulfilled: boolean
}

export const sheetsService = {
  async getOrders(): Promise<Order[]> {
    try {
      const response = await axios.get(`${API_URL}/orders`)
      return response.data
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  },

  async addOrder(order: Omit<Order, 'id'>): Promise<void> {
    try {
      await axios.post(`${API_URL}/orders`, order)
    } catch (error) {
      console.error('Error adding order:', error)
      throw error
    }
  },

  async updateOrderStatus(orderId: string, isFulfilled: boolean): Promise<void> {
    try {
      await axios.put(`${API_URL}/orders/${orderId}/status`, { isFulfilled })
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  },
  async deleteOrder(orderId: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/orders/${orderId}`)
    } catch (error) {
      console.error('Error deleting order:', error)
      throw error
    }
  },
}
