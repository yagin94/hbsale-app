<template>
  <input
    type="checkbox"
    :checked="(typeof props.params.onTogglePaid === 'function') ? params.data.isPaid : params.data.isFulfilled"
    @change="onChange"
    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
  />
</template>

<script lang="ts" setup>
import type { ICellRendererParams } from 'ag-grid-community'

const props = defineProps<{
  params: ICellRendererParams & {
    onTogglePaid?: (data: any) => void
    onToggleStatus?: (data: any) => void
  }
}>()

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const checked = target.checked
if (typeof props.params.onTogglePaid === 'function') {
    props.params.onTogglePaid({ ...props.params.data, isPaid: checked })
}
if (typeof props.params.onToggleStatus === 'function') {
    props.params.onToggleStatus({ ...props.params.data, isFulfilled: checked })
}
}
</script>
