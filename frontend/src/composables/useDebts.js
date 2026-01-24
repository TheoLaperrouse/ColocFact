import { ref } from 'vue'
import api from '@/services/api'

export function useDebts(groupId) {
  const balances = ref([])
  const debts = ref([])
  const myDebts = ref(null)
  const payments = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function loadBalances() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/groups/${groupId}/balances`)
      balances.value = response.data.balances
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to load balances'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadDebts() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/groups/${groupId}/debts`)
      debts.value = response.data.debts
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to load debts'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadMyDebts() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/groups/${groupId}/debts/me`)
      myDebts.value = response.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to load my debts'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadPayments(status = null) {
    loading.value = true
    error.value = null
    try {
      const params = status ? { status } : {}
      const response = await api.get(`/groups/${groupId}/payments`, { params })
      payments.value = response.data.payments
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to load payments'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createPayment(data) {
    const response = await api.post(`/groups/${groupId}/payments`, data)
    payments.value.unshift(response.data.payment)
    return response.data.payment
  }

  async function confirmPayment(id) {
    const response = await api.put(`/groups/${groupId}/payments/${id}`, { status: 'confirmed' })
    const index = payments.value.findIndex(p => p.id === id)
    if (index !== -1) {
      payments.value[index] = response.data.payment
    }
    return response.data.payment
  }

  async function rejectPayment(id) {
    const response = await api.put(`/groups/${groupId}/payments/${id}`, { status: 'rejected' })
    const index = payments.value.findIndex(p => p.id === id)
    if (index !== -1) {
      payments.value[index] = response.data.payment
    }
    return response.data.payment
  }

  async function deletePayment(id) {
    await api.delete(`/groups/${groupId}/payments/${id}`)
    payments.value = payments.value.filter(p => p.id !== id)
  }

  return {
    balances,
    debts,
    myDebts,
    payments,
    loading,
    error,
    loadBalances,
    loadDebts,
    loadMyDebts,
    loadPayments,
    createPayment,
    confirmPayment,
    rejectPayment,
    deletePayment
  }
}
