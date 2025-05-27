<template>
  <div class="p-8 bg-white/90 rounded-2xl shadow-xl border border-indigo-100">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-extrabold text-indigo-700">Product Management</h2>
      <button @click="openAddModal"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Add Product
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 rounded-xl overflow-hidden shadow-md bg-white">
        <thead class="bg-indigo-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Color
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cost Price
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cell Price
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Orders
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id" class="hover:bg-indigo-50 transition">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ product.productName }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="mt-2 flex items-center justify-center">
                <img :src="product.imagePath" class="w-[64px] h-[64px] object-cover rounded" />
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ product.size.join(', ') }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ product.color.join(', ') }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ product.cost }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ product.sell }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ product.ordersCount }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex space-x-2">
                <button @click="openEditModal(product)"
                  class="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline">
                  Edit
                </button>
                <button @click="deleteProduct(product.id)"
                  class="text-red-600 hover:text-red-900 focus:outline-none focus:underline">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Product Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-indigo-700">
            {{ isEditing ? 'Edit Product' : 'Add Product' }}
          </h3>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Product Name</label>
              <input v-model="formData.productName" type="text" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Image</label>
              <input type="file" accept="image/*" @change="handleFileChange"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              <div v-if="formData.imagePath" class="mt-2 flex items-center justify-center">
                <img :src="formData.imagePath" class="w-[64px] h-[64px] object-cover rounded" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Size</label>
              <input v-model="formData.size" type="text" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Color</label>
              <input v-model="formData.color" type="text" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Cost Price</label>
              <input v-model="formData.cost" type="number" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Selling Price</label>
              <input v-model="formData.sell" type="number" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
          </div>
          <div class="flex justify-end space-x-4">
            <button type="button" @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Cancel
            </button>
            <button type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {{ isEditing ? 'Save Changes' : 'Add Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productService, type Product } from '../../services/productService'

const props = defineProps<{
  orders: Order[]
}>()

const products = ref<Product[]>([])
const isModalOpen = ref(false)
const isEditing = ref(false)
const selectedProduct = ref<Product | null>(null)
const isDataLoaded = ref(false)

const formData = ref<Omit<Product, 'id'>>({
  productName: '',
  imagePath: '',
  size: [],
  color: [],
  ordersCount: 0,
  cost: 0,
  sell: 0
})

const loadProducts = async () => {
  if (isDataLoaded.value) {
    return
  }

  try {
    products.value = await productService.getProducts()
    updateProductOrderCounts()
    isDataLoaded.value = true
  } catch (error) {
    console.error('Error loading products:', error)
    alert('Failed to load products. Please try again.')
  }
}

const updateProductOrderCounts = () => {
  products.value = products.value.map((product) => ({
    ...product,
    ordersCount: props.orders.filter((order) => order.product === product.productName).length,
  }))
}

const openAddModal = () => {
  isEditing.value = false
  formData.value = {
    productName: '',
    imagePath: '',
    size: [],
    color: [],
    ordersCount: 0,
    cost: 0,
    sell: 0
  }
  isModalOpen.value = true
}

const openEditModal = (product: Product) => {
  isEditing.value = true
  selectedProduct.value = product
  formData.value = { ...product }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedProduct.value = null
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const file = input.files[0]
  const fileName = file.name

  formData.value.imagePath = `/images/${fileName}`
}

const handleSubmit = async () => {
  try {
    if (isEditing.value && selectedProduct.value) {
      const updatedProduct = {
        ...formData.value,
        id: selectedProduct.value.id,
      }
      await productService.updateProduct(updatedProduct)
    } else {
      await productService.addProduct(formData.value)
    }
    isDataLoaded.value = false
    await loadProducts()
    closeModal()
  } catch (error) {
    console.error('Error saving product:', error)
    alert('Failed to save product. Please try again.')
  }
}

const deleteProduct = async (id: string) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await productService.deleteProduct(id)
      isDataLoaded.value = false
      await loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product. Please try again.')
    }
  }
}

onMounted(async () => {
  await loadProducts()
})
</script>