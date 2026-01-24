import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  async function checkAuth() {
    if (token.value) {
      try {
        const response = await api.get('/auth/me')
        user.value = response.data.user
      } catch (error) {
        logout()
      }
    }
  }

  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    token.value = response.data.token
    user.value = response.data.user
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    return response.data
  }

  async function register(userData) {
    const response = await api.post('/auth/register', userData)
    token.value = response.data.token
    user.value = response.data.user
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    return response.data
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function updateProfile(data) {
    const response = await api.put('/auth/me', data)
    user.value = response.data.user
    localStorage.setItem('user', JSON.stringify(response.data.user))
    return response.data
  }

  async function changePassword(currentPassword, newPassword) {
    await api.put('/auth/me/password', { currentPassword, newPassword })
  }

  return {
    user,
    token,
    isAuthenticated,
    checkAuth,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  }
})
