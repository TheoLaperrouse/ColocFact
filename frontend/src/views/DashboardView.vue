<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-neutral-text">
          Bonjour, {{ user?.firstName }} !
        </h1>
        <p class="text-neutral-text-secondary">Voici un résumé de vos dépenses partagées.</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>

      <template v-else>
        <div v-if="groups.length === 0" class="card text-center py-12">
          <svg class="mx-auto h-12 w-12 text-neutral-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <h3 class="mt-2 text-lg font-medium text-neutral-text">Commencez par créer un groupe</h3>
          <p class="mt-1 text-neutral-text-secondary">Créez votre premier groupe pour commencer à partager vos dépenses.</p>
          <RouterLink to="/groups" class="mt-4 btn-primary inline-block">
            Voir mes groupes
          </RouterLink>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="group in groups"
            :key="group.id"
            class="card"
          >
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="text-xl font-semibold text-neutral-text">{{ group.name }}</h2>
                  <p class="text-sm text-neutral-text-secondary">{{ group.members?.length || 0 }} membres</p>
                </div>
                <RouterLink
                  :to="`/groups/${group.id}`"
                  class="btn-secondary text-sm"
                >
                  Voir le groupe
                </RouterLink>
              </div>

              <div v-if="groupStats[group.id]" class="grid sm:grid-cols-4 gap-4">
                <div class="bg-neutral-bg rounded-lg p-4">
                  <p class="text-sm text-neutral-text-secondary">Total des dépenses</p>
                  <p class="text-2xl font-bold text-neutral-text">
                    {{ formatAmount(groupStats[group.id].totalExpenses) }}
                  </p>
                </div>

                <div class="bg-neutral-bg rounded-lg p-4">
                  <p class="text-sm text-neutral-text-secondary">Nombre de dépenses</p>
                  <p class="text-2xl font-bold text-neutral-text">
                    {{ groupStats[group.id].expenseCount }}
                  </p>
                </div>

                <div class="bg-neutral-bg rounded-lg p-4">
                  <p class="text-sm text-neutral-text-secondary">Vous devez</p>
                  <p class="text-2xl font-bold text-danger-500">
                    {{ formatAmount(groupStats[group.id].myDebts?.totalOwes) }}
                  </p>
                </div>

                <div class="bg-neutral-bg rounded-lg p-4">
                  <p class="text-sm text-neutral-text-secondary">On vous doit</p>
                  <p class="text-2xl font-bold text-secondary-500">
                    {{ formatAmount(groupStats[group.id].myDebts?.totalOwedBy) }}
                  </p>
                </div>
              </div>

              <div v-if="groupStats[group.id]?.myDebts" class="mt-4">
                <div v-if="groupStats[group.id].myDebts.owes?.length > 0" class="mb-2">
                  <p class="text-sm font-medium text-neutral-text mb-1">Vous devez :</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="debt in groupStats[group.id].myDebts.owes"
                      :key="debt.to.id"
                      class="inline-flex items-center px-3 py-1 bg-danger-50 text-danger-600 rounded-full text-sm"
                    >
                      {{ debt.to.firstName }} : {{ formatAmount(debt.amount) }}
                    </span>
                  </div>
                </div>

                <div v-if="groupStats[group.id].myDebts.owedBy?.length > 0">
                  <p class="text-sm font-medium text-neutral-text mb-1">On vous doit :</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="debt in groupStats[group.id].myDebts.owedBy"
                      :key="debt.from.id"
                      class="inline-flex items-center px-3 py-1 bg-secondary-50 text-secondary-600 rounded-full text-sm"
                    >
                      {{ debt.from.firstName }} : {{ formatAmount(debt.amount) }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="groupStats[group.id].myDebts.owes?.length === 0 && groupStats[group.id].myDebts.owedBy?.length === 0"
                  class="text-sm text-neutral-text-secondary italic"
                >
                  Tout est équilibré dans ce groupe !
                </div>
              </div>

              <div class="mt-4 pt-4 border-t border-neutral-border flex flex-wrap gap-2">
                <RouterLink :to="`/groups/${group.id}/expenses`" class="text-primary-500 hover:text-primary-600 text-sm font-medium">
                  Voir les dépenses
                </RouterLink>
                <span class="text-neutral-border">|</span>
                <RouterLink :to="`/groups/${group.id}/balances`" class="text-primary-500 hover:text-primary-600 text-sm font-medium">
                  Voir l'équilibrage
                </RouterLink>
                <span class="text-neutral-border">|</span>
                <RouterLink :to="`/groups/${group.id}/statistics`" class="text-primary-500 hover:text-primary-600 text-sm font-medium">
                  Voir les statistiques
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from '@/components/common/AppLayout.vue'
import { useGroupsStore } from '@/stores/groups'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const groupsStore = useGroupsStore()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const groups = computed(() => groupsStore.groups)

const loading = ref(true)
const groupStats = ref({})

onMounted(async () => {
  await groupsStore.fetchGroups()

  for (const group of groups.value) {
    try {
      const [statsRes, debtsRes] = await Promise.all([
        api.get(`/groups/${group.id}/statistics`),
        api.get(`/groups/${group.id}/debts/me`)
      ])
      groupStats.value[group.id] = {
        ...statsRes.data.statistics,
        myDebts: debtsRes.data
      }
    } catch (err) {
      console.error('Failed to load stats for group', group.id)
    }
  }

  loading.value = false
})

function formatAmount(amount) {
  return parseFloat(amount || 0).toFixed(2) + ' €'
}
</script>
