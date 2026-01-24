<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-neutral-text">Mes groupes</h1>
        <div class="flex gap-2">
          <button @click="showJoinModal = true" class="btn-secondary">
            Rejoindre
          </button>
          <button @click="showCreateModal = true" class="btn-primary">
            Créer un groupe
          </button>
        </div>
      </div>

      <div v-if="groupsStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>

      <div v-else-if="groupsStore.groups.length === 0" class="card text-center py-12">
        <svg class="mx-auto h-12 w-12 text-neutral-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-neutral-text">Aucun groupe</h3>
        <p class="mt-1 text-neutral-text-secondary">Créez un groupe ou rejoignez-en un avec un code d'invitation.</p>
        <div class="mt-6 flex justify-center gap-3">
          <button @click="showJoinModal = true" class="btn-secondary">
            Rejoindre un groupe
          </button>
          <button @click="showCreateModal = true" class="btn-primary">
            Créer un groupe
          </button>
        </div>
      </div>

      <div v-else class="grid gap-4">
        <RouterLink
          v-for="group in groupsStore.groups"
          :key="group.id"
          :to="`/groups/${group.id}`"
          class="card hover:shadow-md transition-shadow"
        >
          <div class="card-body flex items-center">
            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-primary-700 font-semibold text-lg">
                {{ group.name[0].toUpperCase() }}
              </span>
            </div>
            <div class="ml-4 flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-neutral-text">{{ group.name }}</h3>
              <p class="text-sm text-neutral-text-secondary">
                {{ group.members?.length || 0 }} membres
              </p>
            </div>
            <svg class="w-5 h-5 text-neutral-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </RouterLink>
      </div>
    </div>

    <Modal :show="showCreateModal" title="Créer un groupe" @close="showCreateModal = false">
      <form @submit.prevent="createGroup" class="space-y-4">
        <div v-if="error" class="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <div>
          <label class="label">Nom du groupe</label>
          <input
            v-model="newGroupName"
            type="text"
            class="input"
            placeholder="Ex: Appartement rue de la Paix"
          />
        </div>

        <div>
          <label class="label">Description (optionnelle)</label>
          <textarea
            v-model="newGroupDescription"
            class="input"
            rows="3"
            placeholder="Description du groupe..."
          ></textarea>
        </div>

        <div class="flex justify-end gap-3">
          <button type="button" @click="showCreateModal = false" class="btn-secondary">
            Annuler
          </button>
          <button type="submit" :disabled="loading" class="btn-primary">
            {{ loading ? 'Création...' : 'Créer' }}
          </button>
        </div>
      </form>
    </Modal>

    <Modal :show="showJoinModal" title="Rejoindre un groupe" @close="showJoinModal = false">
      <form @submit.prevent="joinGroup" class="space-y-4">
        <div v-if="error" class="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <div>
          <label class="label">Code d'invitation</label>
          <input
            v-model="inviteCode"
            type="text"
            class="input text-center text-lg tracking-widest uppercase"
            placeholder="XXXXXXXX"
            maxlength="8"
          />
          <p class="mt-1 text-sm text-neutral-text-secondary">
            Demandez le code à un membre du groupe.
          </p>
        </div>

        <div class="flex justify-end gap-3">
          <button type="button" @click="showJoinModal = false" class="btn-secondary">
            Annuler
          </button>
          <button type="submit" :disabled="loading" class="btn-primary">
            {{ loading ? 'Validation...' : 'Rejoindre' }}
          </button>
        </div>
      </form>
    </Modal>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from '@/components/common/AppLayout.vue'
import Modal from '@/components/common/Modal.vue'
import { useGroupsStore } from '@/stores/groups'

const groupsStore = useGroupsStore()

const showCreateModal = ref(false)
const showJoinModal = ref(false)
const newGroupName = ref('')
const newGroupDescription = ref('')
const inviteCode = ref('')
const error = ref('')
const loading = ref(false)

onMounted(async () => {
  await groupsStore.fetchGroups()
})

async function createGroup() {
  if (!newGroupName.value.trim()) {
    error.value = 'Le nom du groupe est requis'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await groupsStore.createGroup({
      name: newGroupName.value,
      description: newGroupDescription.value
    })
    showCreateModal.value = false
    newGroupName.value = ''
    newGroupDescription.value = ''
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Erreur lors de la création'
  } finally {
    loading.value = false
  }
}

async function joinGroup() {
  if (!inviteCode.value.trim()) {
    error.value = 'Le code d\'invitation est requis'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await groupsStore.joinGroup(inviteCode.value)
    showJoinModal.value = false
    inviteCode.value = ''
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Code d\'invitation invalide'
  } finally {
    loading.value = false
  }
}
</script>
