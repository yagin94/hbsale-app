<script setup lang="ts">
import OrderForm from './components/OrderForm.vue'
import OrderTable from './components/OrderTable.vue'
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
          <div class="flex flex-row space-x-8">
            <div class="w-1/4">
              <OrderForm />
            </div>
            <div class="w-3/4">
              <OrderTable />
            </div>
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
