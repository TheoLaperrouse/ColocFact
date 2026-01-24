<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-neutral-text">Dépenses</h1>
        <button @click="openAddModal" class="btn-primary">
          Ajouter une dépense
        </button>
      </div>

      <div v-if="expensesStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>

      <div v-else-if="expenses.length === 0" class="card text-center py-12">
        <svg class="mx-auto h-12 w-12 text-neutral-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-neutral-text">Aucune dépense</h3>
        <p class="mt-1 text-neutral-text-secondary">Commencez par ajouter votre première dépense.</p>
        <button @click="openAddModal" class="mt-4 btn-primary">
          Ajouter une dépense
        </button>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="expense in expenses"
          :key="expense.id"
          class="card"
        >
          <div class="card-body">
            <div class="flex items-start">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-semibold text-neutral-text">{{ expense.description }}</h3>
                  <span class="badge-primary">{{ getCategoryLabel(expense.category) }}</span>
                </div>
                <p class="text-sm text-neutral-text-secondary">
                  Payé par {{ expense.payer?.firstName }} {{ expense.payer?.lastName }}
                  le {{ formatDate(expense.date) }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-xl font-bold text-neutral-text">{{ formatAmount(expense.amount) }}</p>
                <p class="text-sm text-neutral-text-secondary">
                  {{ expense.shares?.length || 0 }} personnes
                </p>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-neutral-border">
              <p class="text-sm font-medium text-neutral-text mb-2">Répartition :</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="share in expense.shares"
                  :key="share.id"
                  class="inline-flex items-center px-3 py-1 bg-neutral-bg rounded-full text-sm"
                >
                  {{ share.user?.firstName }} : {{ formatAmount(share.amount) }}
                </span>
              </div>
            </div>

            <div v-if="canEditExpense(expense)" class="mt-4 pt-4 border-t border-neutral-border flex justify-end gap-2">
              <button @click="openEditModal(expense)" class="text-primary-500 hover:text-primary-600 text-sm font-medium">
                Modifier
              </button>
              <button @click="deleteExpense(expense)" class="text-danger-500 hover:text-danger-600 text-sm font-medium">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Modal :show="showAddModal" title="Ajouter une dépense" size="lg" @close="showAddModal = false">
      <form @submit.prevent="createExpense" class="space-y-4">
        <div v-if="error" class="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Montant (€)</label>
            <input
              v-model="form.amount"
              type="number"
              step="0.01"
              min="0.01"
              class="input"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label class="label">Date</label>
            <input
              v-model="form.date"
              type="date"
              class="input"
              required
            />
          </div>
        </div>

        <div>
          <label class="label">Description</label>
          <input
            v-model="form.description"
            type="text"
            class="input"
            placeholder="Ex: Courses Carrefour"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Catégorie</label>
            <select v-model="form.category" class="input">
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="label">Payé par</label>
            <select v-model="form.paidBy" class="input">
              <option v-for="member in group?.members" :key="member.id" :value="member.id">
                {{ member.firstName }} {{ member.lastName }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="label">Répartition</label>
          <div class="flex gap-4">
            <label class="flex items-center">
              <input
                v-model="form.splitType"
                type="radio"
                value="equal"
                class="text-primary-500"
              />
              <span class="ml-2 text-sm">Partage égal</span>
            </label>
          </div>
          <p class="mt-1 text-sm text-neutral-text-secondary">
            La dépense sera divisée équitablement entre tous les membres du groupe.
          </p>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button type="button" @click="showAddModal = false" class="btn-secondary">
            Annuler
          </button>
          <button type="submit" :disabled="loading" class="btn-primary">
            {{ loading ? 'Ajout...' : 'Ajouter' }}
          </button>
        </div>
      </form>
    </Modal>

    <Modal :show="showEditModal" title="Modifier la dépense" size="lg" @close="showEditModal = false">
      <form @submit.prevent="updateExpense" class="space-y-4">
        <div v-if="error" class="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Montant (€)</label>
            <input
              v-model="form.amount"
              type="number"
              step="0.01"
              min="0.01"
              class="input"
              required
            />
          </div>
          <div>
            <label class="label">Date</label>
            <input
              v-model="form.date"
              type="date"
              class="input"
              required
            />
          </div>
        </div>

        <div>
          <label class="label">Description</label>
          <input
            v-model="form.description"
            type="text"
            class="input"
            required
          />
        </div>

        <div>
          <label class="label">Catégorie</label>
          <select v-model="form.category" class="input">
            <option v-for="cat in categories" :key="cat.value" :value="cat.value">
              {{ cat.label }}
            </option>
          </select>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button type="button" @click="showEditModal = false" class="btn-secondary">
            Annuler
          </button>
          <button type="submit" :disabled="loading" class="btn-primary">
            {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </Modal>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/common/AppLayout.vue'
import Modal from '@/components/common/Modal.vue'
import { useGroupsStore } from '@/stores/groups'
import { useExpensesStore } from '@/stores/expenses'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const groupsStore = useGroupsStore()
const expensesStore = useExpensesStore()
const authStore = useAuthStore()

const groupId = computed(() => route.params.groupId)
const group = computed(() => groupsStore.currentGroup)
const expenses = computed(() => expensesStore.expenses)
const currentUserId = computed(() => authStore.user?.id)

const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedExpense = ref(null)
const loading = ref(false)
const error = ref('')

const categories = [
  { value: 'groceries', label: 'Courses' },
  { value: 'utilities', label: 'Charges' },
  { value: 'rent', label: 'Loyer' },
  { value: 'internet', label: 'Internet' },
  { value: 'entertainment', label: 'Loisirs' },
  { value: 'transport', label: 'Transport' },
  { value: 'household', label: 'Maison' },
  { value: 'other', label: 'Autre' }
]

const form = ref({
  amount: '',
  description: '',
  category: 'other',
  date: new Date().toISOString().split('T')[0],
  splitType: 'equal',
  paidBy: ''
})

onMounted(async () => {
  if (!group.value || group.value.id !== groupId.value) {
    await groupsStore.fetchGroup(groupId.value)
  }
  await expensesStore.fetchExpenses(groupId.value)
  form.value.paidBy = currentUserId.value
})

watch(currentUserId, (value) => {
  if (value && !form.value.paidBy) {
    form.value.paidBy = value
  }
})

function getCategoryLabel(value) {
  return categories.find(c => c.value === value)?.label || value
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function formatAmount(amount) {
  return parseFloat(amount).toFixed(2) + ' €'
}

function openAddModal() {
  form.value = {
    amount: '',
    description: '',
    category: 'other',
    date: new Date().toISOString().split('T')[0],
    splitType: 'equal',
    paidBy: currentUserId.value
  }
  error.value = ''
  showAddModal.value = true
}

function openEditModal(expense) {
  selectedExpense.value = expense
  form.value = {
    amount: expense.amount,
    description: expense.description,
    category: expense.category,
    date: expense.date,
    splitType: expense.splitType,
    paidBy: expense.paidBy
  }
  error.value = ''
  showEditModal.value = true
}

async function createExpense() {
  if (!form.value.amount || parseFloat(form.value.amount) <= 0) {
    error.value = 'Le montant doit être supérieur à 0'
    return
  }
  if (!form.value.description.trim()) {
    error.value = 'La description est requise'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await expensesStore.createExpense(groupId.value, {
      amount: parseFloat(form.value.amount),
      description: form.value.description,
      category: form.value.category,
      date: form.value.date,
      splitType: form.value.splitType,
      paidBy: form.value.paidBy
    })
    showAddModal.value = false
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Erreur lors de la création'
  } finally {
    loading.value = false
  }
}

async function updateExpense() {
  if (!form.value.amount || parseFloat(form.value.amount) <= 0) {
    error.value = 'Le montant doit être supérieur à 0'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await expensesStore.updateExpense(groupId.value, selectedExpense.value.id, {
      amount: parseFloat(form.value.amount),
      description: form.value.description,
      category: form.value.category,
      date: form.value.date
    })
    showEditModal.value = false
    selectedExpense.value = null
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Erreur lors de la modification'
  } finally {
    loading.value = false
  }
}

async function deleteExpense(expense) {
  if (!confirm('Voulez-vous vraiment supprimer cette dépense ?')) return

  try {
    await expensesStore.deleteExpense(groupId.value, expense.id)
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Erreur lors de la suppression')
  }
}

function canEditExpense(expense) {
  const membership = group.value?.members?.find(m => m.id === currentUserId.value)
  return expense.paidBy === currentUserId.value || membership?.GroupMember?.role === 'admin'
}
</script>
