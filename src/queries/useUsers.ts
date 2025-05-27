import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { userService, type User } from '../services/userService'

export function useUsers() {
  const queryClient = useQueryClient()

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers
  })

  const addUserMutation = useMutation({
    mutationFn: userService.addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  return {
    users,
    isLoading,
    error,
    addUser: addUserMutation.mutate
  }
} 