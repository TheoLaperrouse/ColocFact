<template>
  <div class="min-h-screen flex bg-neutral-bg">
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-soft"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-soft stagger-2"></div>
      </div>
      <div class="relative z-10 flex flex-col justify-center items-center p-12 text-center">
        <div class="animate-float">
          <svg class="w-24 h-24 text-white/90 mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-white mb-4">Coloc Factures</h2>
        <p class="text-primary-100 text-lg max-w-md">
          Gérez vos dépenses partagées en toute simplicité avec vos colocataires.
        </p>
      </div>
    </div>

    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-md animate-fade-in-up">
        <div class="text-center mb-8">
          <RouterLink to="/" class="inline-block lg:hidden mb-6">
            <span class="text-2xl font-bold text-gradient-primary">Coloc Factures</span>
          </RouterLink>
          <h1 class="text-3xl font-bold text-neutral-text mb-2">Connexion</h1>
          <p class="text-neutral-text-secondary">
            Pas encore de compte ?
            <RouterLink to="/register" class="text-primary-500 hover:text-primary-600 font-medium transition-colors">
              Créer un compte
            </RouterLink>
          </p>
        </div>

        <div class="card hover:shadow-xl">
          <div class="card-body">
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <Transition
                enter-active-class="animate-fade-in-down"
                leave-active-class="animate-fade-out"
              >
                <div v-if="error" class="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ error }}
                </div>
              </Transition>

              <div class="space-y-1">
                <label for="email" class="label">Adresse email</label>
                <div class="relative">
                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    required
                    class="input pl-11"
                    placeholder="votre@email.com"
                  />
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text-secondary">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="space-y-1">
                <label for="password" class="label">Mot de passe</label>
                <div class="relative">
                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="input pl-11 pr-11"
                    placeholder="Votre mot de passe"
                  />
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text-secondary">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-text-secondary hover:text-neutral-text transition-colors"
                  >
                    <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="btn-primary w-full py-3.5 text-base ripple"
              >
                <span v-if="loading" class="flex items-center justify-center gap-2">
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connexion...
                </span>
                <span v-else>Se connecter</span>
              </button>
            </form>
          </div>
        </div>

        <div class="text-center mt-6">
          <RouterLink to="/" class="text-sm text-neutral-text-secondary hover:text-primary-500 transition-colors inline-flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Retour à l'accueil
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    await login(email.value, password.value)
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}
</script>
