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
    <div class="ag-theme-alpine" style="height: 500px; width: 100%">
      <ag-grid-vue :rowData="rowData" :columnDefs="columnDefs" style="height: 500px"> </ag-grid-vue>
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
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef } from 'ag-grid-community'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import ActionCellRenderer from '../sub-components/ActionCellRenderer.vue'
import CheckboxCellRenderer from '../sub-components/CheckboxCellRenderer.vue'

ModuleRegistry.registerModules([AllCommunityModule])

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
const sortedOrder = ref<Order[]>(props.orders)
// Row Data: The data to be displayed.
const rowData = ref(props.orders)

// Column Definitions: Defines the columns to be displayed.
const columnDefs = ref<ColDef[]>([
  { headerName: 'Customer Name', field: 'customerName', sortable: true, filter: true },
  {
    headerName: 'Facebook Link',
    field: 'facebookLink',
    sortable: true,
    filter: true,
    cellRenderer: (params: any) => `<a href="${params.value}" target="_blank">${params.value}</a>`,
  },
  { headerName: 'Address', field: 'address', sortable: true, filter: true },
  { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
  { headerName: 'Product', field: 'product', sortable: true, filter: true },
  {
    headerName: 'Image',
    field: 'imagePath',
    cellRenderer: (params: any) =>
      params.value
        ? `<img src="${params.value}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;" />`
        : '',
    sortable: false,
    filter: false,
  },
  { headerName: 'Size', field: 'size', sortable: true, filter: true },
  { headerName: 'Color', field: 'color', sortable: true, filter: true },
  {
    headerName: 'Selling Price',
    field: 'sellingPrice',
    sortable: true,
    filter: true,
    valueFormatter: (params: any) => formatCurrency(params.value),
  },
  {
    headerName: 'Cost Price',
    field: 'costPrice',
    sortable: true,
    filter: true,
    valueFormatter: (params: any) => formatCurrency(params.value),
  },
  {
    headerName: 'Profit',
    field: 'profit',
    valueGetter: (params: any) => params.data.sellingPrice - params.data.costPrice,
    valueFormatter: (params: any) => formatCurrency(params.value),
    sortable: true,
    filter: true,
  },
  {
    headerName: 'Fulfilled',
    field: 'isFulfilled',
    sortable: true,
    filter: true,
    cellRenderer: CheckboxCellRenderer,
    cellRendererParams: {
      onToggleStatus: (param: any) => {
        handleUpdateOrderStatus(param)
      },
    },
  },
  {
    headerName: 'Paid',
    field: 'isPaid',
    sortable: true,
    filter: true,
    cellRenderer: CheckboxCellRenderer,
    cellRendererParams: {
      onTogglePaid: (param: any) => {
        handleUpdateOrderPaid(param)
      },
    },
  },
  { headerName: 'Created At', field: 'createdAt', sortable: true, filter: true },
  { headerName: 'Note', field: 'note', sortable: true, filter: true },
  {
    headerName: 'Actions',
    field: 'actions',
    cellRenderer: ActionCellRenderer,
    cellRendererParams: {
      onEdit: (data: any) => {
        openEditModal(data)
      },
      onDelete: (data: any) => {
        console.log('Delete', data)
      },
    },
    sortable: false,
    filter: false,
  },
])

const filteredOrders = computed(() => {
  if (!searchQuery.value) return sortedOrder.value
  return sortedOrder.value.filter((order) =>
    order.customerName.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalRevenue = computed(() => {
  return sortedOrder.value.reduce((sum, order) => sum + Number(order.sellingPrice), 0)
})

const totalProfit = computed(() => {
  return sortedOrder.value.reduce((sum, order) => sum + (order.sellingPrice - order.costPrice), 0)
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
  // Add logic sort here
  if (sortColumn.value) {
    sortedOrder.value = [...sortedOrder.value].sort((a, b) => {
      const aValue = a[sortColumn.value as keyof Order] ?? ''
      const bValue = b[sortColumn.value as keyof Order] ?? ''
      if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
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
