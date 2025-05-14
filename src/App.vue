<script setup lang="ts">
import { ref } from 'vue'
import OrderForm from './components/OrderManagerment/OrderForm.vue'
import OrderTable from './components/OrderManagerment/OrderTable.vue'
import ProductManagement from './components/ProductManagement.vue'

const activeTab = ref('orders')
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
    <header class="bg-white shadow-lg rounded-b-2xl">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <h1 class="text-4xl font-extrabold text-indigo-700 tracking-tight drop-shadow">HanBoongBeBe Order Quản lí</h1>
        <img src="https://img.icons8.com/color/96/000000/shopping-cart--v2.png" alt="Order Icon" class="h-12 w-12" />
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <!-- Tabs -->
          <div class="mb-8">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <button @click="activeTab = 'orders'" :class="[
                  activeTab === 'orders'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]">
                  Order Management
                </button>
                <button @click="activeTab = 'products'" :class="[
                  activeTab === 'products'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]">
                  Product Management
                </button>
              </nav>
            </div>
          </div>

          <!-- Tab Content -->
          <div v-if="activeTab === 'orders'" class="flex flex-row space-x-8">
            <div class="w-1/4">
              <OrderForm />
            </div>
            <div class="w-3/4">
              <OrderTable />
            </div>
          </div>
          <div v-else-if="activeTab === 'products'">
            <ProductManagement />
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
