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
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'customerName' }" @click="handleSort('customerName')">
              <div class="flex items-center">
                Customer Name
                <span v-if="sortColumn === 'customerName'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'facebookLink' }" @click="handleSort('facebookLink')">
              <div class="flex items-center">
                Facebook Link
                <span v-if="sortColumn === 'facebookLink'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'address' }" @click="handleSort('address')">
              <div class="flex items-center">
                Address
                <span v-if="sortColumn === 'address'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'phone' }" @click="handleSort('phone')">
              <div class="flex items-center">
                Phone
                <span v-if="sortColumn === 'phone'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'product' }" @click="handleSort('product')">
              <div class="flex items-center">
                Product
                <span v-if="sortColumn === 'product'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'imagePath' }" @click="handleSort('imagePath')">
              <div class="flex items-center">
                Image
                <span v-if="sortColumn === 'imagePath'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'size' }" @click="handleSort('size')">
              <div class="flex items-center">
                Size
                <span v-if="sortColumn === 'size'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'color' }" @click="handleSort('color')">
              <div class="flex items-center">
                Color
                <span v-if="sortColumn === 'color'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'sellingPrice' }" @click="handleSort('sellingPrice')">
              <div class="flex items-center">
                Selling Price
                <span v-if="sortColumn === 'sellingPrice'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'costPrice' }" @click="handleSort('costPrice')">
              <div class="flex items-center">
                Cost Price
                <span v-if="sortColumn === 'costPrice'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'profit' }" @click="handleSort('profit')">
              <div class="flex items-center">
                Profit
                <span v-if="sortColumn === 'profit'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'isFulfilled' }" @click="handleSort('isFulfilled')">
              <div class="flex items-center">
                Status
                <span v-if="sortColumn === 'isFulfilled'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'isPaid' }" @click="handleSort('isPaid')">
              <div class="flex items-center">
                Paid
                <span v-if="sortColumn === 'isPaid'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'createdAt' }" @click="handleSort('createdAt')">
              <div class="flex items-center">
                Created At
                <span v-if="sortColumn === 'createdAt'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in sortedOrders" :key="order.id" class="hover:bg-indigo-50 transition">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ order.customerName }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500"><a class="redirect-fb" :href="order.facebookLink" target="_blank"
                  rel="noopener noreferrer">{{ order.facebookLink }}</a></div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ order.address }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ order.phone }}</div>
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
              <input type="checkbox" v-model="order.isPaid" @change="updateOrderPaid(order)"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ order.createdAt }}</div>
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
const sortColumn = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

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

const updateOrderPaid = async (order: Order) => {
  try {
    await sheetsService.updateOrderPaid(order.id, order.isFulfilled)
  } catch (error) {
    console.error('Error updating order:', error)
    alert('Failed to update order paid. Please try again.')
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

const handleSort = (column: string) => {
  if (sortColumn.value === column) {
    if (sortDirection.value === 'asc') {
      sortDirection.value = 'desc'
    } else {
      // Reset sorting if clicking the same column again
      sortColumn.value = null
      sortDirection.value = 'asc'
    }
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const sortedOrders = computed(() => {
  if (!sortColumn.value) return filteredOrders.value

  return [...filteredOrders.value].sort((a, b) => {
    let aValue = a[sortColumn.value as keyof Order]
    let bValue = b[sortColumn.value as keyof Order]

    // Handle profit calculation
    if (sortColumn.value === 'profit') {
      aValue = calculateProfit(a)
      bValue = calculateProfit(b)
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection.value === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection.value === 'asc'
        ? aValue - bValue
        : bValue - aValue
    }

    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return sortDirection.value === 'asc'
        ? (aValue === bValue ? 0 : aValue ? -1 : 1)
        : (aValue === bValue ? 0 : aValue ? 1 : -1)
    }

    return 0
  })
})

onMounted(() => {
  fetchOrders()
})
</script>
