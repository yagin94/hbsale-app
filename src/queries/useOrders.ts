import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { sheetsService, type Order } from '../services/sheetsService'

export function useOrders() {
  const queryClient = useQueryClient()

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: sheetsService.getOrders
  })

  const addOrderMutation = useMutation({
    mutationFn: sheetsService.addOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, isFulfilled }: { orderId: string; isFulfilled: boolean }) =>
      sheetsService.updateOrderStatus(orderId, isFulfilled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  const updateOrderPaidMutation = useMutation({
    mutationFn: ({ orderId, isPaid }: { orderId: string; isPaid: boolean }) =>
      sheetsService.updateOrderPaid(orderId, isPaid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  const updateOrderMutation = useMutation({
    mutationFn: sheetsService.updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  const deleteOrderMutation = useMutation({
    mutationFn: sheetsService.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  return {
    orders,
    isLoading,
    error,
    addOrder: addOrderMutation.mutate,
    updateOrderStatus: updateOrderStatusMutation.mutate,
    updateOrderPaid: updateOrderPaidMutation.mutate,
    updateOrder: updateOrderMutation.mutate,
    deleteOrder: deleteOrderMutation.mutate
  }
} 