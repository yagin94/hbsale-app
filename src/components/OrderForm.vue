<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Add New Order</h2>
    <form @submit.prevent="submitOrder" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Customer Name</label>
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
            v-model="formData.product"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
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
          <label class="block text-sm font-medium text-gray-700">Selling Price</label>
          <input
            v-model="formData.sellingPrice"
            type="number"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Cost Price</label>
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
        <label class="ml-2 block text-sm text-gray-900">Order Fulfilled (Đi đơn)</label>
      </div>
      <button
        type="submit"
        class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Add Order
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { sheetsService } from '../services/sheetsService'

const formData = ref({
  customerName: '',
  facebookLink: '',
  address: '',
  product: '',
  size: '',
  color: '',
  sellingPrice: 0,
  costPrice: 0,
  isFulfilled: false
})

const submitOrder = async () => {
  try {
    await sheetsService.addOrder(formData.value)
    // Reset form
    Object.keys(formData.value).forEach(key => {
      if (typeof formData.value[key] === 'boolean') {
        formData.value[key] = false
      } else if (typeof formData.value[key] === 'number') {
        formData.value[key] = 0
      } else {
        formData.value[key] = ''
      }
    })
    alert('Order added successfully!')
  } catch (error) {
    console.error('Error adding order:', error)
    alert('Failed to add order. Please try again.')
  }
}
</script> 