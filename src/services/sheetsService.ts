import axios from 'axios'

const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbzJiH_Um5Q_UttwmsH-P8Ma3e3oJEAIerSJvBGSo76YZEo-4DckDgkme43Q7dkYJBDbsA/exec'

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
      const response = await axios.get(`${SHEETS_API_URL}?action=getOrders`)
      return response.data
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  },

  async addOrder(order: Omit<Order, 'id'>): Promise<void> {
    try {
      await axios.post(SHEETS_API_URL, {
        action: 'addOrder',
        data: order
      })
    } catch (error) {
      console.error('Error adding order:', error)
      throw error
    }
  },

  async updateOrderStatus(orderId: string, isFulfilled: boolean): Promise<void> {
    try {
      await axios.put(SHEETS_API_URL, {
        action: 'updateOrderStatus',
        orderId,
        isFulfilled
      })
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  }
} 