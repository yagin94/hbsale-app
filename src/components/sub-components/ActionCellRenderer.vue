<template>
  <div class="flex gap-2">
    <button
      class="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
      @click="onEdit"
    >
      Edit
    </button>
    <button
      class="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
      @click="onDelete"
    >
      Delete
    </button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps<{
  params: any
}>()
const onEdit = () => props.params.onEdit?.(props.params.data)

const onDelete = () => props.params.onDelete?.(props.params.data)
</script>
