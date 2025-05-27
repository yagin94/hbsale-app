<template>
  <div v-if="isOpen"
    class="fixed inset-0 w-full h-full bg-gray-900/50 bg-opacity-50 z-50 flex items-center justify-center">
    <div class="absolute inset-0 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-indigo-700">Edit Order</h3>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Customer name</label>
              <input v-model="formData.customerName" type="text" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Facebook Link</label>
              <input v-model="formData.facebookLink" type="url" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Address</label>
              <input v-model="formData.address" type="text" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Product</label>
              <select v-model="selectedProduct" @change="handleProductChange" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="">Select a product</option>
                <option v-for="product in products" :key="product.id" :value="product">
                  {{ product.productName }}
                </option>
              </select>
              <div v-if="selectedProduct?.imagePath" class="mt-2 flex items-center justify-center">
                <img :src="selectedProduct.imagePath" class="w-[64px] h-[64px] object-cover rounded" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Size</label>
              <select v-model="formData.size" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="">Select a size</option>
                <option v-for="size in availableSizes" :key="size" :value="size">
                  {{ size }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Color</label>
              <select v-model="formData.color" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="">Select a color</option>
                <option v-for="color in availableColors" :key="color" :value="color">
                  {{ color }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Selling price</label>
              <input v-model="formData.sellingPrice" type="number" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Cost price</label>
              <input v-model="formData.costPrice" type="number" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
          </div>
          <div class="flex items-center">
            <input v-model="formData.isFulfilled" type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
            <label class="ml-2 block text-sm text-gray-900">Fullfilled</label>
          </div>
          <div class="flex items-center">
            <input v-model="formData.isPaid" type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
            <label class="ml-2 block text-sm text-gray-900">Paid</label>
          </div>
          <div class="flex items-center">
            <input v-model="formData.note" type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
            <label class="ml-2 block text-sm text-gray-900">Note</label>
          </div>
          <div class="flex justify-end space-x-4">
            <button type="button" @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Cancel
            </button>
            <button type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productService, type Product } from '@/services/productService'
import type { Order } from '@/services/sheetsService'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  order: Order | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', order: Order): void
}>()

const formData = ref<Order>({
  id: '',
  customerName: '',
  facebookLink: '',
  address: '',
  phone: '',
  product: '',
  size: '',
  color: '',
  sellingPrice: 0,
  costPrice: 0,
  isFulfilled: false,
  isPaid: false,
  imagePath: '',
  note: '',
})

const products = ref<Product[]>([])
const selectedProduct = ref<Product | null>(null)

watch(
  () => props.order,
  (newOrder) => {
    if (newOrder) {
      formData.value = { ...newOrder }
      if (products.value.length > 0) {
        selectedProduct.value =
          products.value.find((p) => p.productName === newOrder.product) || null
      }
    }
  },
  { immediate: true }
)
const loadProducts = async () => {
  try {
    products.value = await productService.getProducts()
    if (formData.value.product) {
      selectedProduct.value =
        products.value.find((p) => p.productName === formData.value.product) || null
    }
  } catch (error) {
    console.error('Error loading products:', error)
    alert('Failed to load products. Please try again.')
  }
}

const availableSizes = computed(() => {
  return selectedProduct.value?.size || []
})

const availableColors = computed(() => {
  return selectedProduct.value?.color || []
})

const handleProductChange = () => {
  if (selectedProduct.value) {
    formData.value.product = selectedProduct.value.productName
    formData.value.imagePath = selectedProduct.value.imagePath
    // Reset size and color when product changes
    formData.value.size = ''
    formData.value.color = ''
  }
}

const handleSubmit = () => {
  emit('save', formData.value)
}

const closeModal = () => {
  emit('close')
}

onMounted(() => {
  loadProducts()
})
</script>