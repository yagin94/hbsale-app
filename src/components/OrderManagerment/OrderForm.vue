<template>
  <div
    class="p-8 bg-white/90 rounded-2xl shadow-xl border border-indigo-100 transition hover:shadow-2xl"
  >
    <h2 class="text-2xl font-extrabold mb-6 text-indigo-700">Add new order</h2>
    <form @submit.prevent="submitOrder" class="space-y-6">
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
          <label class="block text-sm font-medium text-gray-700">Số Điện Thoại</label>
          <div class="relative">
            <input
              v-model="formData.phone"
              type="text"
              required
              @input="handlePhoneInput"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <!-- Phone suggestions dropdown -->
            <div
              v-if="showPhoneSuggestions && filteredUsers.length > 0"
              class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto"
            >
              <div
                v-for="user in filteredUsers"
                :key="user.id"
                @click="selectUser(user)"
                class="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
              >
                <div class="font-medium">{{ user.customerName }}</div>
                <div class="text-sm text-gray-500">{{ user.phone }}</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Product</label>
          <select
            v-model="selectedProduct"
            @change="handleProductChange"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
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
          <select
            v-model="formData.size"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a size</option>
            <option v-for="size in availableSizes" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Color</label>
          <select
            v-model="formData.color"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a color</option>
            <option v-for="color in availableColors" :key="color" :value="color">
              {{ color }}
            </option>
          </select>
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
      <div class="flex items-center">
        <input
          v-model="formData.isPaid"
          type="checkbox"
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label class="ml-2 block text-sm text-gray-900"> Paid </label>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Note</label>
        <input
          v-model="formData.note"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
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
import { ref, onMounted, computed } from 'vue'
import { sheetsService } from '@/services/sheetsService'
import { productService, type Product } from '@/services/productService'
import { userService, type User } from '../../services/userService'

interface OrderFormData {
  customerName: string
  facebookLink: string
  address: string
  phone: string
  product: string
  size: string
  color: string
  sellingPrice: number
  costPrice: number
  isFulfilled: boolean
  isPaid: boolean
  imagePath: string
  note: string
}

const initialFormData: OrderFormData = {
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
}

const formData = ref<OrderFormData>({ ...initialFormData })
const products = ref<Product[]>([])
const selectedProduct = ref<Product | null>(null)
const users = ref<User[]>([])
const showPhoneSuggestions = ref(false)
const filteredUsers = ref<User[]>([])

const availableSizes = computed(() => {
  return selectedProduct.value?.size || []
})

const availableColors = computed(() => {
  return selectedProduct.value?.color || []
})

const loadProducts = async () => {
  try {
    products.value = await productService.getProducts()
  } catch (error) {
    console.error('Error loading products:', error)
    alert('Failed to load products. Please try again.')
  }
}

const loadUsers = async () => {
  try {
    users.value = await userService.getUsers()
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

const handleProductChange = () => {
  if (selectedProduct.value) {
    formData.value.product = selectedProduct.value.productName
    formData.value.imagePath = selectedProduct.value.imagePath
    // Reset size and color when product changes
    formData.value.size = ''
    formData.value.color = ''
  }
}

const handlePhoneInput = () => {
  if (formData.value.phone.length > 0) {
    filteredUsers.value = users.value.filter((user) =>
      user.phone.toLowerCase().includes(formData.value.phone.toLowerCase())
    )
    showPhoneSuggestions.value = true
  } else {
    showPhoneSuggestions.value = false
  }
}

const selectUser = (user: User) => {
  formData.value.customerName = user.customerName
  formData.value.phone = user.phone
  formData.value.address = user.address
  formData.value.facebookLink = user.facebookLink
  showPhoneSuggestions.value = false
}

const resetForm = () => {
  formData.value = { ...initialFormData }
  selectedProduct.value = null
}

const submitOrder = async () => {
  try {
    // Save user information if it's a new user
    if (!users.value.some((user) => user.phone === formData.value.phone)) {
      await userService.addUser({
        customerName: formData.value.customerName,
        phone: formData.value.phone,
        address: formData.value.address,
        facebookLink: formData.value.facebookLink,
      })
    }

    // Create the order
    await sheetsService.addOrder(formData.value)
    resetForm()
    alert('Order created successfully!')
  } catch (error) {
    console.error('Error creating order:', error)
    alert('Failed to create order')
  }
}

onMounted(() => {
  loadProducts()
  loadUsers()
})
</script>