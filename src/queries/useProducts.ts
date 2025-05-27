import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { productService, type Product } from '../services/productService'

export function useProducts() {
  const queryClient = useQueryClient()

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts
  })

  const addProductMutation = useMutation({
    mutationFn: productService.addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const updateProductMutation = useMutation({
    mutationFn: productService.updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const deleteProductMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  return {
    products,
    isLoading,
    error,
    addProduct: addProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate
  }
} 