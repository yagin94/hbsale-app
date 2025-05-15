<template>
  <div v-if="isOpen" class="fixed inset-0 w-full h-full bg-gray-900 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-indigo-700">Edit Order</h3>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Customer name</label>
              <input
                v-model="formData.customerName"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Facebook Link</label>
              <input
                v-model="formData.facebookLink"
                type="url"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Address</label>
              <input
                v-model="formData.address"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Product</label>
              <input
                type="file"
                accept="image/*"
                @change="handleFileChange"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              <div v-if="formData.product" class="mt-2 flex items-center justify-center">
                <img :src="formData.product" class="w-[64px] h-[64px] object-cover rounded" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Size</label>
              <input
                v-model="formData.size"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Color</label>
              <input
                v-model="formData.color"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Selling price</label>
              <input
                v-model="formData.sellingPrice"
                type="number"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Cost price</label>
              <input
                v-model="formData.costPrice"
                type="number"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div class="flex items-center">
            <input
              v-model="formData.isFulfilled"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">Fullfilled</label>
          </div>
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '@/services/sheetsService'
import { ref, watch } from 'vue'

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
  product: '',
  size: '',
  color: '',
  sellingPrice: 0,
  costPrice: 0,
  isFulfilled: false,
})

watch(
  () => props.order,
  (newOrder) => {
    if (newOrder) {
      formData.value = { ...newOrder }
    }
  },
  { immediate: true }
)

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const file = input.files[0]
  const fileName = file.name

  formData.value.product = `/images/${fileName}`
}

const handleSubmit = () => {
  emit('save', formData.value)
}

const closeModal = () => {
  emit('close')
}
</script> 