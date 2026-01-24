import { computed } from 'vue'
import { useExpensesStore } from '@/stores/expenses'

export function useExpenses(groupId) {
  const store = useExpensesStore()

  const expenses = computed(() => store.expenses)
  const loading = computed(() => store.loading)
  const error = computed(() => store.error)
  const pagination = computed(() => store.pagination)

  async function loadExpenses(params = {}) {
    await store.fetchExpenses(groupId, params)
  }

  async function addExpense(data) {
    return await store.createExpense(groupId, data)
  }

  async function editExpense(id, data) {
    return await store.updateExpense(groupId, id, data)
  }

  async function removeExpense(id) {
    await store.deleteExpense(groupId, id)
  }

  return {
    expenses,
    loading,
    error,
    pagination,
    loadExpenses,
    addExpense,
    editExpense,
    removeExpense
  }
}
