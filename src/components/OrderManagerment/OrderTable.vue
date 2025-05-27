<template>
  <div class="p-8 bg-white/90 rounded-2xl shadow-xl border border-indigo-100 relative">
    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-white/80 flex items-center justify-center z-50"
    >
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p class="mt-4 text-indigo-600 font-medium">Loading...</p>
      </div>
    </div>

    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-extrabold text-indigo-700">Orders</h2>
      <div class="flex items-center space-x-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by customer name..."
          class="rounded-lg border-gray-300 shadow focus:border-indigo-400 focus:ring-indigo-400 px-4 py-2 bg-indigo-50 placeholder-indigo-300"
        />
        <div
          class="text-lg font-semibold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg shadow-sm"
        >
          Total Revenue: {{ formatCurrency(totalRevenue) }}
        </div>
        <div class="text-lg font-semibold bg-pink-100 text-pink-700 px-3 py-1 rounded-lg shadow-sm">
          Total Profit: {{ formatCurrency(totalProfit) }}
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <div
          class="text-lg font-semibold bg-green-100 text-green-500 px-3 py-1 rounded-lg shadow-sm"
        >
          Total Orders: {{ orders.length }}
        </div>
        <div
          class="text-lg font-semibold bg-green-100 text-green-500 px-3 py-1 rounded-lg shadow-sm cursor-pointer hover:bg-green-50"
          @click="handleSort('isFulfilled')"
        >
          Fulfilled Orders: {{ orders.filter((order) => order.isFulfilled).length }}
        </div>
        <div
          class="text-lg font-semibold bg-green-100 text-green-500 px-3 py-1 rounded-lg shadow-sm cursor-pointer hover:bg-green-50"
          @click="handleSort('isPaid')"
        >
          Paid Orders: {{ orders.filter((order) => order.isPaid).length }}
        </div>
        <div
          class="text-lg font-semibold bg-green-100 text-green-500 px-3 py-1 rounded-lg shadow-sm cursor-pointer hover:bg-green-50"
          @click="handleSort('customerName')"
        >
          Total Customers:
          {{ Array.from(new Set(orders.map((order) => order.phone).filter(Boolean))).length }}
        </div>
        <div
          class="text-lg font-semibold bg-green-100 text-green-500 px-3 py-1 rounded-lg shadow-sm cursor-pointer hover:bg-green-50"
          @click="handleSort('note')"
        >
          Special Orders: {{ orders.filter((order) => order.note.trim().length > 0).length }}
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table
        class="min-w-full divide-y divide-gray-200 rounded-xl overflow-hidden shadow-md bg-white"
      >
        <thead class="bg-indigo-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'customerName' }"
              @click="handleSort('customerName')"
            >
              <div class="flex items-center">
                Customer Name
                <span v-if="sortColumn === 'customerName'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'facebookLink' }"
              @click="handleSort('facebookLink')"
            >
              <div class="flex items-center">
                Facebook Link
                <span v-if="sortColumn === 'facebookLink'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'address' }"
              @click="handleSort('address')"
            >
              <div class="flex items-center">
                Address
                <span v-if="sortColumn === 'address'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'phone' }"
              @click="handleSort('phone')"
            >
              <div class="flex items-center">
                Phone
                <span v-if="sortColumn === 'phone'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'product' }"
              @click="handleSort('product')"
            >
              <div class="flex items-center">
                Product
                <span v-if="sortColumn === 'product'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'imagePath' }"
              @click="handleSort('imagePath')"
            >
              <div class="flex items-center">
                Image
                <span v-if="sortColumn === 'imagePath'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'size' }"
              @click="handleSort('size')"
            >
              <div class="flex items-center">
                Size
                <span v-if="sortColumn === 'size'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'color' }"
              @click="handleSort('color')"
            >
              <div class="flex items-center">
                Color
                <span v-if="sortColumn === 'color'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'sellingPrice' }"
              @click="handleSort('sellingPrice')"
            >
              <div class="flex items-center">
                Selling Price
                <span v-if="sortColumn === 'sellingPrice'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'costPrice' }"
              @click="handleSort('costPrice')"
            >
              <div class="flex items-center">
                Cost Price
                <span v-if="sortColumn === 'costPrice'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'profit' }"
              @click="handleSort('profit')"
            >
              <div class="flex items-center">
                Profit
                <span v-if="sortColumn === 'profit'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'isFulfilled' }"
              @click="handleSort('isFulfilled')"
            >
              <div class="flex items-center">
                Status
                <span v-if="sortColumn === 'isFulfilled'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'isPaid' }"
              @click="handleSort('isPaid')"
            >
              <div class="flex items-center">
                Paid
                <span v-if="sortColumn === 'isPaid'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'createdAt' }"
              @click="handleSort('createdAt')"
            >
              <div class="flex items-center">
                Created At
                <span v-if="sortColumn === 'createdAt'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-indigo-100': sortColumn === 'note' }"
              @click="handleSort('note')"
            >
              <div class="flex items-center">
                Note
                <span v-if="sortColumn === 'note'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="order in paginatedOrders"
            :key="order.id"
            class="hover:bg-indigo-50 transition"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ order.customerName }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">
                <a
                  class="redirect-fb"
                  :href="order.facebookLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ order.facebookLink }}</a
                >
              </div>
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
              <input
                type="checkbox"
                v-model="order.isFulfilled"
                @change="handleUpdateOrderStatus(order)"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <input
                type="checkbox"
                v-model="order.isPaid"
                @change="handleUpdateOrderPaid(order)"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ order.createdAt }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ order.note }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex space-x-2">
                <button
                  @click="openEditModal(order)"
                  class="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
                >
                  Edit
                </button>
                <button
                  @click="handleDeleteOrder(order)"
                  class="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
    >
      <div class="flex justify-between flex-1">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
            to
            <span class="font-medium">{{
              Math.min(currentPage * itemsPerPage, filteredOrders.length)
            }}</span>
            of
            <span class="font-medium">{{ filteredOrders.length }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50"
            >
              <span class="sr-only">Previous</span>
              <svg
                class="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <template v-for="(page, index) in paginationRange" :key="index">
              <button
                v-if="typeof page === 'number'"
                @click="goToPage(page)"
                :class="[
                  currentPage === page
                    ? 'relative z-10 inline-flex items-center px-4 py-2 border border-indigo-500 bg-indigo-50 text-sm font-medium text-indigo-600'
                    : 'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50',
                ]"
              >
                {{ page }}
              </button>
              <span
                v-else
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
              >
                {{ page }}
              </span>
            </template>
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50"
            >
              <span class="sr-only">Next</span>
              <svg
                class="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <EditOrderModal
      :is-open="isEditModalOpen"
      :order="selectedOrder"
      @close="closeEditModal"
      @save="handleEditSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import EditOrderModal from './EditOrderModal.vue'
import type { Order } from '../../services/sheetsService'

const props = defineProps<{
  orders: Order[]
  isLoading: boolean
  updateOrderStatus: (params: { orderId: string; isFulfilled: boolean }) => Promise<void>
  updateOrderPaid: (params: { orderId: string; isPaid: boolean }) => Promise<void>
  updateOrder: (order: Order) => Promise<void>
  deleteOrder: (orderId: string) => Promise<void>
}>()

const searchQuery = ref('')
const isEditModalOpen = ref(false)
const selectedOrder = ref<Order | null>(null)
const sortColumn = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const itemsPerPage = 5

const filteredOrders = computed(() => {
  if (!searchQuery.value) return props.orders
  return props.orders.filter((order) =>
    order.customerName.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalRevenue = computed(() => {
  return props.orders.reduce((sum, order) => sum + Number(order.sellingPrice), 0)
})

const totalProfit = computed(() => {
  return props.orders.reduce((sum, order) => sum + (order.sellingPrice - order.costPrice), 0)
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

const handleUpdateOrderStatus = async (order: Order) => {
  try {
    await props.updateOrderStatus({ orderId: order.id, isFulfilled: order.isFulfilled })
  } catch (error) {
    console.error('Error updating order status:', error)
    alert('Failed to update order status. Please try again.')
  }
}

const handleUpdateOrderPaid = async (order: Order) => {
  try {
    await props.updateOrderPaid({ orderId: order.id, isPaid: order.isPaid })
  } catch (error) {
    console.error('Error updating order paid status:', error)
    alert('Failed to update order paid status. Please try again.')
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

const handleDeleteOrder = async (order: Order) => {
  if (!confirm('Are you sure you want to delete this order?')) return
  try {
    await props.deleteOrder(order.id)
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
    await props.updateOrder(updatedOrder)
    closeEditModal()
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
      sortColumn.value = null
      sortDirection.value = 'asc'
      return
    }
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredOrders.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage))

const paginationRange = computed(() => {
  const delta = 3
  const range: number[] = []
  const rangeWithDots: (number | string)[] = []
  let l: number | undefined

  for (let i = 1; i <= totalPages.value; i++) {
    if (
      i === 1 ||
      i === totalPages.value ||
      (i >= currentPage.value - delta && i <= currentPage.value + delta)
    ) {
      range.push(i)
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>
