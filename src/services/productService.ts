import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export interface Product {
  id: string
  productName: string
  size: string[]
  color: string[]
  imagePath: string
  ordersCount: number
}

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await axios.get(`${API_URL}/products`)
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  async addProduct(product: Omit<Product, 'id' | 'ordersCount'>): Promise<Product> {
    try {
      const response = await axios.post(`${API_URL}/products`, { ...product, ordersCount: 0 })
      return response.data
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  },

  async updateProduct(product: Product): Promise<Product> {
    try {
      const response = await axios.put(`${API_URL}/products/${product.id}`, product)
      return response.data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/products/${id}`)
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }
} 