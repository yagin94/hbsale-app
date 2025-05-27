<script setup lang="ts">
import { ref } from 'vue'
import OrderForm from './components/OrderManagerment/OrderForm.vue'
import OrderTable from './components/OrderManagerment/OrderTable.vue'
import ProductManagement from './components/ProductManagement/ProductManagement.vue'
import { useOrders } from './queries/useOrders'

const activeTab = ref('orders')

const { orders, isLoading: ordersLoading, addOrder, updateOrderStatus, updateOrderPaid, updateOrder, deleteOrder } = useOrders()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
    <header class="sticky top-0 z-50 bg-white shadow-lg rounded-b-2xl">
      <div class="mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <h1 class="text-4xl font-extrabold text-indigo-700 tracking-tight drop-shadow">HanBoongBeBe Order Management
        </h1>
        <img src="https://img.icons8.com/color/96/000000/shopping-cart--v2.png" alt="Order Icon" class="h-12 w-12" />
      </div>
    </header>
    <main>
      <div class="mx-auto sm:px-6 lg:px-8">
        <div class="px-4 sm:px-0">
          <!-- Tabs -->
          <div class="mb-8 sticky top-[120px] z-40 bg-white">
            <div class="border-b border-gray-200" style="background-color: blanchedalmond;">
              <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <button @click="activeTab = 'orders'" :class="[
                  activeTab === 'orders'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-large font-bold text-sm'
                ]">
                  Order Management
                </button>
                <button @click="activeTab = 'products'" :class="[
                  activeTab === 'products'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-large font-bold text-sm'
                ]">
                  Product Management
                </button>
              </nav>
            </div>
          </div>

          <!-- Tab Content -->
          <div v-if="activeTab === 'orders'" class="flex flex-row space-x-8">
            <div class="w-1/4">
              <OrderForm :addOrder="addOrder" />
            </div>
            <div class="w-3/4">
              <OrderTable :orders="orders" :isLoading="ordersLoading" :updateOrderStatus="updateOrderStatus"
                :updateOrderPaid="updateOrderPaid" :updateOrder="updateOrder" :deleteOrder="deleteOrder" />
            </div>
          </div>
          <div v-else-if="activeTab === 'products'">
            <ProductManagement :orders="orders" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
