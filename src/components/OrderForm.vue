<template>
  <div
    class="p-8 bg-white/90 rounded-2xl shadow-xl border border-indigo-100 transition hover:shadow-2xl"
  >
    <h2 class="text-2xl font-extrabold mb-6 text-indigo-700">Nhập đơn mới</h2>
    <form @submit.prevent="submitOrder" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Tên khách hàng</label>
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
          <label class="block text-sm font-medium text-gray-700">Địa chỉ</label>
          <input
            v-model="formData.address"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">SĐT</label>
          <input
            v-model="formData.address"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Sản Phẩm</label>
          <input
            type="file"
            accept="image/*"
            @change="handleFileChange"
            required
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
          <label class="block text-sm font-medium text-gray-700">Màu</label>
          <input
            v-model="formData.color"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Giá bán</label>
          <input
            v-model="formData.sellingPrice"
            type="number"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Giá nhập</label>
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
        <label class="ml-2 block text-sm text-gray-900">Đi đơn</label>
      </div>
      <button
        type="submit"
        class="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold shadow hover:from-indigo-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition"
      >
        Add Order
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { sheetsService } from '../services/sheetsService'

interface OrderFormData {
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

const initialFormData: OrderFormData = {
  customerName: '',
  facebookLink: '',
  address: '',
  product: '',
  size: '',
  color: '',
  sellingPrice: 0,
  costPrice: 0,
  isFulfilled: false,
}

const formData = ref<OrderFormData>({ ...initialFormData })

const resetForm = () => {
  formData.value = { ...initialFormData }
}

const submitOrder = async () => {
  try {
    await sheetsService.addOrder(formData.value)
    // Reset form
    resetForm()
    alert('Order added successfully!')
  } catch (error) {
    console.error('Error adding order:', error)
    alert('Failed to add order. Please try again.')
  }
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  const fileName = file.name;

  formData.value.product = `/images/${fileName}`
}

</script> 