<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-neutral-text mb-6">Mon profil</h1>

      <div class="card mb-6">
        <div class="card-body">
          <h2 class="text-lg font-semibold text-neutral-text mb-4">Informations personnelles</h2>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <div v-if="error" class="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded-lg text-sm">
              {{ error }}
            </div>
            <div v-if="success" class="bg-secondary-50 border border-secondary-200 text-secondary-600 px-4 py-3 rounded-lg text-sm">
              {{ success }}
            </div>

            <div>
              <label class="label">Email</label>
              <input
                type="email"
                :value="user?.email"
                class="input bg-neutral-bg"
                disabled
              />
              <p class="mt-1 text-sm text-neutral-text-secondary">L'email ne peut pas être modifié.</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Prénom</label>
                <input
                  v-model="form.firstName"
                  type="text"
                  class="input"
                  required
                />
              </div>
              <div>
                <label class="label">Nom</label>
                <input
                  v-model="form.lastName"
                  type="text"
                  class="input"
                  required
                />
              </div>
            </div>

            <div class="flex justify-end">
              <button type="submit" :disabled="loading" class="btn-primary">
                {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h2 class="text-lg font-semibold text-neutral-text mb-4">Changer le mot de passe</h2>

          <form @submit.prevent="changePassword" class="space-y-4">
            <div v-if="passwordError" class="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded-lg text-sm">
              {{ passwordError }}
            </div>
            <div v-if="passwordSuccess" class="bg-secondary-50 border border-secondary-200 text-secondary-600 px-4 py-3 rounded-lg text-sm">
              {{ passwordSuccess }}
            </div>

            <div>
              <label class="label">Mot de passe actuel</label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                class="input"
                required
              />
            </div>

            <div>
              <label class="label">Nouveau mot de passe</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                class="input"
                placeholder="Minimum 6 caractères"
                required
              />
            </div>

            <div>
              <label class="label">Confirmer le nouveau mot de passe</label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                class="input"
                required
              />
            </div>

            <div class="flex justify-end">
              <button type="submit" :disabled="passwordLoading" class="btn-primary">
                {{ passwordLoading ? 'Modification...' : 'Modifier le mot de passe' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/components/common/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const form = ref({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const passwordLoading = ref(false)
const success = ref('')
const error = ref('')
const passwordError = ref('')
const passwordSuccess = ref('')

async function updateProfile() {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await authStore.updateProfile({
      firstName: form.value.firstName,
      lastName: form.value.lastName
    })
    success.value = 'Profil mis à jour avec succès'
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Erreur lors de la mise à jour'
  } finally {
    loading.value = false
  }
}

async function changePassword() {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Les mots de passe ne correspondent pas'
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }

  passwordLoading.value = true
  passwordError.value = ''
  passwordSuccess.value = ''

  try {
    await authStore.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    )
    passwordSuccess.value = 'Mot de passe modifié avec succès'
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (err) {
    passwordError.value = err.response?.data?.error?.message || 'Erreur lors du changement'
  } finally {
    passwordLoading.value = false
  }
}
</script>
