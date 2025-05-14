<template>
  <div class="p-8 bg-white/90 rounded-2xl shadow-xl border border-indigo-100">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-extrabold text-indigo-700">Orders</h2>
      <div class="flex items-center space-x-4">
        <input v-model="searchQuery" type="text" placeholder="Search by customer name..."
          class="rounded-lg border-gray-300 shadow focus:border-indigo-400 focus:ring-indigo-400 px-4 py-2 bg-indigo-50 placeholder-indigo-300" />
        <div class="text-lg font-semibold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg shadow-sm">
          Total Revenue: {{ formatCurrency(totalRevenue) }}
        </div>
        <div class="text-lg font-semibold bg-pink-100 text-pink-700 px-3 py-1 rounded-lg shadow-sm">
          Total Profit: {{ formatCurrency(totalProfit) }}
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 rounded-xl overflow-hidden shadow-md bg-white">
        <thead class="bg-indigo-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Facebook Link
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ImagePath
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Color
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Selling Price
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cost Price
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Profit
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fulfilled
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-indigo-50 transition">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ order.customerName }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ order.facebookLink }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ order.address }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ order.product }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="order.imagePath" class="mt-2 flex items-center justify-center">
                <img :src="order.imagePath" class="w-[64px] h-[64px] object-cover rounded" />
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ order.size }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ order.color }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ formatCurrency(order.sellingPrice) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ formatCurrency(order.costPrice) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm" :class="getProfitClass(order)">
                {{ formatCurrency(calculateProfit(order)) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <input type="checkbox" v-model="order.isFulfilled" @change="updateOrderStatus(order)"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex space-x-2">
                <button @click="openEditModal(order)"
                  class="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline">
                  Edit
                </button>
                <button @click="deleteOrder(order)"
                  class="text-red-600 hover:text-red-900 focus:outline-none focus:underline">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EditOrderModal :is-open="isEditModalOpen" :order="selectedOrder" @close="closeEditModal" @save="handleEditSave" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import EditOrderModal from './EditOrderModal.vue'
import { sheetsService } from '../../services/sheetsService'
import type { Order } from '../../services/sheetsService'

const orders = ref<Order[]>([])
const searchQuery = ref('')
const isEditModalOpen = ref(false)
const selectedOrder = ref<Order | null>(null)

const fetchOrders = async () => {
  try {
    orders.value = await sheetsService.getOrders()
  } catch (error) {
    console.error('Error fetching orders:', error)
    alert('Failed to fetch orders. Please try again.')
  }
}

const filteredOrders = computed(() => {
  if (!searchQuery.value) return orders.value
  return orders.value.filter((order) =>
    order.customerName.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalRevenue = computed(() => {
  return orders.value.reduce((sum, order) => sum + order.sellingPrice, 0)
})

const totalProfit = computed(() => {
  return orders.value.reduce((sum, order) => sum + (order.sellingPrice - order.costPrice), 0)
})

const calculateProfit = (order: Order) => {
  return order.sellingPrice - order.costPrice
}

const getProfitClass = (order: Order) => {
  const profit = calculateProfit(order)
  return {
    'text-green-600': profit > 0,
    'text-red-600': profit < 0,
    'text-gray-600': profit === 0,
  }
}

const updateOrderStatus = async (order: Order) => {
  try {
    await sheetsService.updateOrderStatus(order.id, order.isFulfilled)
  } catch (error) {
    console.error('Error updating order:', error)
    alert('Failed to update order status. Please try again.')
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

const deleteOrder = async (order: Order) => {
  if (!confirm('Are you sure you want to delete this order?')) return

  try {
    await sheetsService.deleteOrder(order.id)
    await fetchOrders()
    alert('Order deleted successfully!')
  } catch (error) {
    console.error('Error deleting order:', error)
    alert('Failed to delete order. Please try again.')
  }
}

const openEditModal = (order: Order) => {
  selectedOrder.value = order
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  selectedOrder.value = null
  isEditModalOpen.value = false
}

const handleEditSave = async (updatedOrder: Order) => {
  try {
    await sheetsService.updateOrder(updatedOrder)
    await fetchOrders()
    closeEditModal()
    alert('Order updated successfully!')
  } catch (error) {
    console.error('Error updating order:', error)
    alert('Failed to update order. Please try again.')
  }
}

onMounted(() => {
  fetchOrders()
})
</script>
