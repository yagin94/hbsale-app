import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export interface Product {
  id: string
  productName: string
  imagePath: string
  size: string[] | string
  color: string[] | string
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

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    try {
      const productData = {
        ...product,
        size: typeof product.size === 'string' ? product.size.split(',').map(s => s.trim()) : product.size,
        color: typeof product.color === 'string' ? product.color.split(',').map(c => c.trim()) : product.color
      }
      const response = await axios.post(`${API_URL}/products`, productData)
      return response.data
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  },

  async updateProduct(product: Product): Promise<Product> {
    try {
      const productData = {
        ...product,
        size: typeof product.size === 'string' ? product.size.split(',').map(s => s.trim()) : product.size,
        color: typeof product.color === 'string' ? product.color.split(',').map(c => c.trim()) : product.color
      }
      const response = await axios.put(`${API_URL}/products/${product.id}`, productData)
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