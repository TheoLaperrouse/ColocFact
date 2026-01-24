<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto">
      <div v-if="groupsStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>

      <template v-else-if="group">
        <div class="mb-6">
          <div class="flex items-center gap-4 mb-4">
            <RouterLink to="/groups" class="text-neutral-text-secondary hover:text-neutral-text">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </RouterLink>
            <h1 class="text-2xl font-bold text-neutral-text flex-1">{{ group.name }}</h1>
            <div class="flex gap-2">
              <button @click="showInviteModal = true" class="btn-secondary">
                Inviter
              </button>
              <button v-if="isAdmin" @click="showEditModal = true" class="btn-secondary">
                Modifier
              </button>
            </div>
          </div>
          <p v-if="group.description" class="text-neutral-text-secondary">{{ group.description }}</p>
        </div>

        <div class="grid sm:grid-cols-3 gap-4 mb-8">
          <RouterLink
            :to="`/groups/${group.id}/expenses`"
            class="card hover:shadow-md transition-shadow"
          >
            <div class="card-body text-center">
              <svg class="w-8 h-8 mx-auto text-primary-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 class="font-semibold text-neutral-text">Dépenses</h3>
              <p class="text-sm text-neutral-text-secondary">Gérer les dépenses</p>
            </div>
          </RouterLink>

          <RouterLink
            :to="`/groups/${group.id}/balances`"
            class="card hover:shadow-md transition-shadow"
          >
            <div class="card-body text-center">
              <svg class="w-8 h-8 mx-auto text-secondary-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
              </svg>
              <h3 class="font-semibold text-neutral-text">Équilibrage</h3>
              <p class="text-sm text-neutral-text-secondary">Qui doit combien</p>
            </div>
          </RouterLink>

          <RouterLink
            :to="`/groups/${group.id}/statistics`"
            class="card hover:shadow-md transition-shadow"
          >
            <div class="card-body text-center">
              <svg class="w-8 h-8 mx-auto text-accent-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <h3 class="font-semibold text-neutral-text">Statistiques</h3>
              <p class="text-sm text-neutral-text-secondary">Analyse des dépenses</p>
            </div>
          </RouterLink>
        </div>

        <div class="card">
          <div class="card-body">
            <h2 class="text-lg font-semibold text-neutral-text mb-4">
              Membres ({{ group.members?.length || 0 }})
            </h2>

            <div class="space-y-3">
              <div
                v-for="member in group.members"
                :key="member.id"
                class="flex items-center p-3 bg-neutral-bg rounded-lg"
              >
                <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-primary-700 font-medium">
                    {{ member.firstName?.[0] }}{{ member.lastName?.[0] }}
                  </span>
                </div>
                <div class="ml-3 flex-1">
                  <p class="font-medium text-neutral-text">
                    {{ member.firstName }} {{ member.lastName }}
                    <span v-if="member.id === currentUserId" class="text-neutral-text-secondary">(vous)</span>
                  </p>
                  <p class="text-sm text-neutral-text-secondary">{{ member.email }}</p>
                </div>
                <span
                  v-if="member.GroupMember?.role === 'admin'"
                  class="badge-primary mr-2"
                >
                  Admin
                </span>
                <button
                  v-if="isAdmin && member.id !== currentUserId"
                  @click="removeMember(member.id)"
                  class="text-danger-500 hover:text-danger-600"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 card border-danger-200">
          <div class="card-body">
            <h2 class="text-lg font-semibold text-danger-500 mb-4">Zone de danger</h2>
            <div class="flex flex-wrap gap-3">
              <button
                v-if="!isAdmin"
                @click="leaveGroup"
                class="btn-danger"
              >
                Quitter le groupe
              </button>
              <button
                v-if="isAdmin"
                @click="showDeleteModal = true"
                class="btn-danger"
              >
                Supprimer le groupe
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <Modal :show="showInviteModal" title="Inviter des membres" @close="showInviteModal = false">
      <div class="text-center">
        <p class="text-neutral-text-secondary mb-4">
          Partagez ce code d'invitation pour permettre à d'autres personnes de rejoindre le groupe.
        </p>
        <div class="bg-neutral-bg rounded-lg p-4 mb-4">
          <p class="text-3xl font-mono font-bold tracking-widest text-neutral-text">
            {{ group?.inviteCode }}
          </p>
        </div>
        <div class="flex justify-center gap-3">
          <button @click="copyInviteCode" class="btn-primary">
            {{ copySuccess ? 'Copié !' : 'Copier le code' }}
          </button>
          <button v-if="isAdmin" @click="regenerateCode" :disabled="loading" class="btn-secondary">
            Régénérer
          </button>
        </div>
      </div>
    </Modal>

    <Modal :show="showEditModal" title="Modifier le groupe" @close="showEditModal = false">
      <form @submit.prevent="updateGroup" class="space-y-4">
        <div>
          <label class="label">Nom du groupe</label>
          <input v-model="editName" type="text" class="input" required />
        </div>
        <div>
          <label class="label">Description</label>
          <textarea v-model="editDescription" class="input" rows="3"></textarea>
        </div>
        <div class="flex justify-end gap-3">
          <button type="button" @click="showEditModal = false" class="btn-secondary">
            Annuler
          </button>
          <button type="submit" :disabled="loading" class="btn-primary">
            {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </Modal>

    <Modal :show="showDeleteModal" title="Supprimer le groupe" @close="showDeleteModal = false">
      <p class="text-neutral-text-secondary mb-4">
        Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible et supprimera toutes les dépenses associées.
      </p>
      <div class="flex justify-end gap-3">
        <button @click="showDeleteModal = false" class="btn-secondary">
          Annuler
        </button>
        <button @click="deleteGroup" :disabled="loading" class="btn-danger">
          {{ loading ? 'Suppression...' : 'Supprimer' }}
        </button>
      </div>
    </Modal>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import AppLayout from '@/components/common/AppLayout.vue'
import Modal from '@/components/common/Modal.vue'
import { useGroupsStore } from '@/stores/groups'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const groupsStore = useGroupsStore()
const authStore = useAuthStore()

const group = computed(() => groupsStore.currentGroup)
const currentUserId = computed(() => authStore.user?.id)

const showInviteModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editName = ref('')
const editDescription = ref('')
const loading = ref(false)
const copySuccess = ref(false)

const isAdmin = computed(() => {
  const member = group.value?.members?.find(m => m.id === currentUserId.value)
  return member?.GroupMember?.role === 'admin'
})

onMounted(async () => {
  await groupsStore.fetchGroup(route.params.id)
  if (group.value) {
    editName.value = group.value.name
    editDescription.value = group.value.description || ''
  }
})

async function copyInviteCode() {
  if (group.value?.inviteCode) {
    await navigator.clipboard.writeText(group.value.inviteCode)
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  }
}

async function regenerateCode() {
  loading.value = true
  try {
    await groupsStore.regenerateInviteCode(group.value.id)
  } finally {
    loading.value = false
  }
}

async function updateGroup() {
  loading.value = true
  try {
    await groupsStore.updateGroup(group.value.id, {
      name: editName.value,
      description: editDescription.value
    })
    showEditModal.value = false
  } finally {
    loading.value = false
  }
}

async function deleteGroup() {
  loading.value = true
  try {
    await groupsStore.deleteGroup(group.value.id)
    router.push('/groups')
  } finally {
    loading.value = false
  }
}

async function leaveGroup() {
  if (confirm('Voulez-vous vraiment quitter ce groupe ?')) {
    loading.value = true
    try {
      await groupsStore.removeMember(group.value.id, currentUserId.value)
      router.push('/groups')
    } finally {
      loading.value = false
    }
  }
}

async function removeMember(userId) {
  if (confirm('Voulez-vous vraiment retirer ce membre ?')) {
    await groupsStore.removeMember(group.value.id, userId)
    await groupsStore.fetchGroup(group.value.id)
  }
}
</script>
