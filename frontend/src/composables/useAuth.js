import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  async function login(email, password) {
    try {
      await authStore.login(email, password)
      const redirect = router.currentRoute.value.query.redirect || '/dashboard'
      router.push(redirect)
    } catch (error) {
      throw error
    }
  }

  async function register(userData) {
    try {
      await authStore.register(userData)
      router.push('/dashboard')
    } catch (error) {
      throw error
    }
  }

  function logout() {
    authStore.logout()
    router.push('/login')
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout
  }
}
