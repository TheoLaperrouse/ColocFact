<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold text-neutral-text mb-6">Statistiques</h1>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>

      <template v-else>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="card">
            <div class="card-body">
              <p class="text-sm text-neutral-text-secondary">Total des dépenses</p>
              <p class="text-2xl font-bold text-neutral-text">
                {{ formatAmount(statistics?.totalExpenses) }}
              </p>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <p class="text-sm text-neutral-text-secondary">Nombre de dépenses</p>
              <p class="text-2xl font-bold text-neutral-text">
                {{ statistics?.expenseCount || 0 }}
              </p>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <p class="text-sm text-neutral-text-secondary">Moyenne par dépense</p>
              <p class="text-2xl font-bold text-neutral-text">
                {{ formatAmount(statistics?.averageExpense) }}
              </p>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <p class="text-sm text-neutral-text-secondary">Moyenne par personne</p>
              <p class="text-2xl font-bold text-neutral-text">
                {{ formatAmount(statistics?.averagePerPerson) }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-6 mb-8">
          <div class="card">
            <div class="card-body">
              <h2 class="text-lg font-semibold text-neutral-text mb-4">
                Dépenses par mois ({{ monthlyStats.year }})
              </h2>
              <div class="h-64">
                <Bar
                  v-if="monthlyStats.months.length > 0"
                  :data="monthlyChartData"
                  :options="monthlyChartOptions"
                />
                <p v-else class="text-center text-neutral-text-secondary py-12">
                  Pas de données disponibles
                </p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <h2 class="text-lg font-semibold text-neutral-text mb-4">
                Dépenses par catégorie
              </h2>
              <div class="h-64">
                <Doughnut
                  v-if="categoryStats.length > 0"
                  :data="categoryChartData"
                  :options="categoryChartOptions"
                />
                <p v-else class="text-center text-neutral-text-secondary py-12">
                  Pas de données disponibles
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-8">
          <div class="card-body">
            <h2 class="text-lg font-semibold text-neutral-text mb-4">Détail par catégorie</h2>
            <div v-if="categoryStats.length === 0" class="text-center text-neutral-text-secondary py-8">
              Aucune dépense enregistrée
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="cat in categoryStats"
                :key="cat.category"
                class="flex items-center"
              >
                <div class="w-32 text-sm text-neutral-text">
                  {{ categoryLabels[cat.category] || cat.category }}
                </div>
                <div class="flex-1 mx-4">
                  <div class="w-full bg-neutral-bg rounded-full h-4">
                    <div
                      class="bg-primary-500 h-4 rounded-full"
                      :style="{ width: `${cat.percentage}%` }"
                    ></div>
                  </div>
                </div>
                <div class="w-24 text-right text-sm text-neutral-text font-medium">
                  {{ formatAmount(cat.total) }}
                </div>
                <div class="w-16 text-right text-sm text-neutral-text-secondary">
                  {{ cat.percentage }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <h2 class="text-lg font-semibold text-neutral-text mb-4">Détail par membre</h2>
            <div v-if="memberStats.length === 0" class="text-center text-neutral-text-secondary py-8">
              Aucun membre
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-neutral-border">
                <thead>
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-neutral-text-secondary uppercase">Membre</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-neutral-text-secondary uppercase">Total payé</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-neutral-text-secondary uppercase">Part due</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-neutral-text-secondary uppercase">Nb dépenses</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-neutral-text-secondary uppercase">Solde</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-border">
                  <tr v-for="member in memberStats" :key="member.user.id">
                    <td class="px-4 py-3">
                      <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                          <span class="text-primary-700 text-sm font-medium">
                            {{ member.user.firstName?.[0] }}{{ member.user.lastName?.[0] }}
                          </span>
                        </div>
                        <span class="text-sm font-medium text-neutral-text">
                          {{ member.user.firstName }} {{ member.user.lastName }}
                        </span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-right text-sm text-neutral-text">
                      {{ formatAmount(member.totalPaid) }}
                    </td>
                    <td class="px-4 py-3 text-right text-sm text-neutral-text">
                      {{ formatAmount(member.totalOwed) }}
                    </td>
                    <td class="px-4 py-3 text-right text-sm text-neutral-text-secondary">
                      {{ member.expenseCount }}
                    </td>
                    <td class="px-4 py-3 text-right text-sm font-medium"
                        :class="member.balance >= 0 ? 'text-secondary-500' : 'text-danger-500'">
                      {{ member.balance >= 0 ? '+' : '' }}{{ formatAmount(member.balance) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js'
import AppLayout from '@/components/common/AppLayout.vue'
import { useGroupsStore } from '@/stores/groups'
import api from '@/services/api'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
)

const route = useRoute()
const groupsStore = useGroupsStore()

const groupId = computed(() => route.params.groupId)
const group = computed(() => groupsStore.currentGroup)

const loading = ref(true)
const statistics = ref(null)
const categoryStats = ref([])
const monthlyStats = ref({ year: new Date().getFullYear(), months: [] })
const memberStats = ref([])

const categoryLabels = {
  groceries: 'Courses',
  utilities: 'Charges',
  rent: 'Loyer',
  internet: 'Internet',
  entertainment: 'Loisirs',
  transport: 'Transport',
  household: 'Maison',
  other: 'Autre'
}

const categoryColors = [
  '#3A7DFF', '#2ECC71', '#F4C430', '#FF6B6B',
  '#8E7CF0', '#ec4899', '#06b6d4', '#7A7A7A'
]

onMounted(async () => {
  if (!group.value || group.value.id !== groupId.value) {
    await groupsStore.fetchGroup(groupId.value)
  }

  try {
    const [statsRes, catRes, monthRes, memberRes] = await Promise.all([
      api.get(`/groups/${groupId.value}/statistics`),
      api.get(`/groups/${groupId.value}/statistics/by-category`),
      api.get(`/groups/${groupId.value}/statistics/by-month`),
      api.get(`/groups/${groupId.value}/statistics/by-member`)
    ])

    statistics.value = statsRes.data.statistics
    categoryStats.value = catRes.data.categories
    monthlyStats.value = monthRes.data
    memberStats.value = memberRes.data.members
  } catch (err) {
    console.error('Failed to load statistics', err)
  }

  loading.value = false
})

const categoryChartData = computed(() => ({
  labels: categoryStats.value.map(c => categoryLabels[c.category] || c.category),
  datasets: [{
    data: categoryStats.value.map(c => c.total),
    backgroundColor: categoryColors.slice(0, categoryStats.value.length)
  }]
}))

const monthlyChartData = computed(() => ({
  labels: monthlyStats.value.months.map(m => m.name.substring(0, 3)),
  datasets: [{
    label: 'Dépenses',
    data: monthlyStats.value.months.map(m => m.total),
    backgroundColor: '#3A7DFF'
  }]
}))

const monthlyChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => value + ' €'
      }
    }
  }
}

const categoryChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right'
    }
  }
}

function formatAmount(amount) {
  return parseFloat(amount || 0).toFixed(2) + ' €'
}
</script>
