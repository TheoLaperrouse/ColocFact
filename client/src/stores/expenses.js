import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useExpensesStore = defineStore('expenses', () => {
  const expenses = ref([])
  const pagination = ref({ page: 1, limit: 20, total: 0, pages: 0 })
  const loading = ref(false)
  const error = ref(null)

  async function fetchExpenses(groupId, params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/groups/${groupId}/expenses`, { params })
      expenses.value = response.data.expenses
      pagination.value = response.data.pagination
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch expenses'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createExpense(groupId, data) {
    const response = await api.post(`/groups/${groupId}/expenses`, data)
    expenses.value.unshift(response.data.expense)
    return response.data.expense
  }

  async function updateExpense(groupId, id, data) {
    const response = await api.put(`/groups/${groupId}/expenses/${id}`, data)
    const index = expenses.value.findIndex(e => e.id === id)
    if (index !== -1) {
      expenses.value[index] = response.data.expense
    }
    return response.data.expense
  }

  async function deleteExpense(groupId, id) {
    await api.delete(`/groups/${groupId}/expenses/${id}`)
    expenses.value = expenses.value.filter(e => e.id !== id)
  }

  function clearExpenses() {
    expenses.value = []
    pagination.value = { page: 1, limit: 20, total: 0, pages: 0 }
  }

  return {
    expenses,
    pagination,
    loading,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    clearExpenses
  }
})
