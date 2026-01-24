<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-neutral-text mb-6">Équilibrage</h1>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>

      <template v-else>
        <div class="border-b border-neutral-border mb-6">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'debts'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'debts'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-neutral-text-secondary hover:text-neutral-text hover:border-neutral-border'
              ]"
            >
              Qui doit quoi
            </button>
            <button
              @click="activeTab = 'balances'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'balances'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-neutral-text-secondary hover:text-neutral-text hover:border-neutral-border'
              ]"
            >
              Soldes
            </button>
            <button
              @click="activeTab = 'payments'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'payments'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-neutral-text-secondary hover:text-neutral-text hover:border-neutral-border'
              ]"
            >
              Paiements
            </button>
          </nav>
        </div>

        <div v-if="activeTab === 'debts'">
          <div v-if="debts.length === 0" class="card text-center py-12">
            <svg class="mx-auto h-12 w-12 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="mt-2 text-lg font-medium text-neutral-text">Tout est équilibré !</h3>
            <p class="mt-1 text-neutral-text-secondary">Aucune dette en cours dans le groupe.</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(debt, index) in debts"
              :key="index"
              class="card"
            >
              <div class="card-body flex items-center">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-neutral-text">
                      {{ debt.from.firstName }} {{ debt.from.lastName }}
                    </span>
                    <svg class="w-5 h-5 text-neutral-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                    <span class="font-medium text-neutral-text">
                      {{ debt.to.firstName }} {{ debt.to.lastName }}
                    </span>
                  </div>
                  <p class="text-2xl font-bold text-primary-500 mt-1">
                    {{ formatAmount(debt.amount) }}
                  </p>
                </div>
                <button
                  v-if="debt.from.id === currentUserId"
                  @click="openPaymentModal(debt)"
                  class="btn-primary"
                >
                  Payer
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'balances'">
          <div class="space-y-4">
            <div
              v-for="balance in balances"
              :key="balance.user.id"
              class="card"
            >
              <div class="card-body flex items-center">
                <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-primary-700 font-medium">
                    {{ balance.user.firstName?.[0] }}{{ balance.user.lastName?.[0] }}
                  </span>
                </div>
                <div class="ml-4 flex-1">
                  <p class="font-medium text-neutral-text">
                    {{ balance.user.firstName }} {{ balance.user.lastName }}
                  </p>
                  <p class="text-sm text-neutral-text-secondary">
                    A payé: {{ formatAmount(balance.totalPaid) }} |
                    Doit: {{ formatAmount(balance.totalOwed) }}
                  </p>
                </div>
                <div class="text-right">
                  <p :class="['text-xl font-bold', getBalanceClass(balance.balance)]">
                    {{ balance.balance >= 0 ? '+' : '' }}{{ formatAmount(balance.balance) }}
                  </p>
                  <p class="text-sm text-neutral-text-secondary">
                    {{ balance.balance > 0 ? 'à recevoir' : balance.balance < 0 ? 'à payer' : 'équilibré' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'payments'">
          <div v-if="payments.length === 0" class="card text-center py-12">
            <svg class="mx-auto h-12 w-12 text-neutral-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h3 class="mt-2 text-lg font-medium text-neutral-text">Aucun paiement</h3>
            <p class="mt-1 text-neutral-text-secondary">Les paiements enregistrés apparaîtront ici.</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="payment in payments"
              :key="payment.id"
              class="card"
            >
              <div class="card-body">
                <div class="flex items-center">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium text-neutral-text">
                        {{ payment.sender.firstName }} {{ payment.sender.lastName }}
                      </span>
                      <svg class="w-5 h-5 text-neutral-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                      <span class="font-medium text-neutral-text">
                        {{ payment.receiver.firstName }} {{ payment.receiver.lastName }}
                      </span>
                      <span :class="getPaymentStatusClass(payment.status)">
                        {{ getPaymentStatusLabel(payment.status) }}
                      </span>
                    </div>
                    <p v-if="payment.note" class="text-sm text-neutral-text-secondary">{{ payment.note }}</p>
                  </div>
                  <p class="text-xl font-bold text-neutral-text">
                    {{ formatAmount(payment.amount) }}
                  </p>
                </div>

                <div
                  v-if="payment.status === 'pending' && payment.toUser === currentUserId"
                  class="mt-4 pt-4 border-t border-neutral-border flex justify-end gap-2"
                >
                  <button @click="handleRejectPayment(payment)" class="btn-secondary text-danger-500">
                    Rejeter
                  </button>
                  <button @click="handleConfirmPayment(payment)" class="btn-success">
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <Modal :show="showPaymentModal" title="Enregistrer un paiement" @close="showPaymentModal = false">
      <form @submit.prevent="submitPayment" class="space-y-4">
        <div v-if="paymentError" class="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded-lg text-sm">
          {{ paymentError }}
        </div>

        <div>
          <label class="label">Destinataire</label>
          <select v-model="paymentForm.toUser" class="input" required>
            <option value="">Sélectionnez un membre</option>
            <option
              v-for="member in group?.members?.filter(m => m.id !== currentUserId)"
              :key="member.id"
              :value="member.id"
            >
              {{ member.firstName }} {{ member.lastName }}
            </option>
          </select>
        </div>

        <div>
          <label class="label">Montant (€)</label>
          <input
            v-model="paymentForm.amount"
            type="number"
            step="0.01"
            min="0.01"
            class="input"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label class="label">Note (optionnelle)</label>
          <input
            v-model="paymentForm.note"
            type="text"
            class="input"
            placeholder="Ex: Virement bancaire"
          />
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button type="button" @click="showPaymentModal = false" class="btn-secondary">
            Annuler
          </button>
          <button type="submit" :disabled="paymentLoading" class="btn-primary">
            {{ paymentLoading ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </Modal>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/common/AppLayout.vue'
import Modal from '@/components/common/Modal.vue'
import { useGroupsStore } from '@/stores/groups'
import { useAuthStore } from '@/stores/auth'
import { useDebts } from '@/composables/useDebts'

const route = useRoute()
const groupsStore = useGroupsStore()
const authStore = useAuthStore()

const groupId = computed(() => route.params.groupId)
const group = computed(() => groupsStore.currentGroup)
const currentUserId = computed(() => authStore.user?.id)

const {
  balances,
  debts,
  payments,
  loading,
  loadBalances,
  loadDebts,
  loadPayments,
  createPayment,
  confirmPayment,
  rejectPayment
} = useDebts(groupId.value)

const showPaymentModal = ref(false)
const paymentForm = ref({
  toUser: '',
  amount: '',
  note: ''
})
const paymentError = ref('')
const paymentLoading = ref(false)

const activeTab = ref('debts')

onMounted(async () => {
  if (!group.value || group.value.id !== groupId.value) {
    await groupsStore.fetchGroup(groupId.value)
  }
  await Promise.all([
    loadBalances(),
    loadDebts(),
    loadPayments()
  ])
})

function formatAmount(amount) {
  return parseFloat(amount).toFixed(2) + ' €'
}

function getBalanceClass(balance) {
  if (balance > 0) return 'text-secondary-500'
  if (balance < 0) return 'text-danger-500'
  return 'text-neutral-text-secondary'
}

function openPaymentModal(debt) {
  paymentForm.value = {
    toUser: debt.to.id,
    amount: debt.amount.toString(),
    note: ''
  }
  paymentError.value = ''
  showPaymentModal.value = true
}

async function submitPayment() {
  if (!paymentForm.value.amount || parseFloat(paymentForm.value.amount) <= 0) {
    paymentError.value = 'Le montant doit être supérieur à 0'
    return
  }

  paymentLoading.value = true
  paymentError.value = ''

  try {
    await createPayment({
      toUser: paymentForm.value.toUser,
      amount: parseFloat(paymentForm.value.amount),
      note: paymentForm.value.note
    })
    showPaymentModal.value = false
    await Promise.all([loadBalances(), loadDebts()])
  } catch (err) {
    paymentError.value = err.response?.data?.error?.message || 'Erreur lors de l\'enregistrement'
  } finally {
    paymentLoading.value = false
  }
}

async function handleConfirmPayment(payment) {
  if (!confirm('Confirmer la réception de ce paiement ?')) return
  try {
    await confirmPayment(payment.id)
    await Promise.all([loadBalances(), loadDebts()])
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Erreur')
  }
}

async function handleRejectPayment(payment) {
  if (!confirm('Rejeter ce paiement ?')) return
  try {
    await rejectPayment(payment.id)
    await Promise.all([loadBalances(), loadDebts()])
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Erreur')
  }
}

function getPaymentStatusClass(status) {
  switch (status) {
    case 'confirmed': return 'badge-success'
    case 'rejected': return 'badge-danger'
    default: return 'badge-warning'
  }
}

function getPaymentStatusLabel(status) {
  switch (status) {
    case 'confirmed': return 'Confirmé'
    case 'rejected': return 'Rejeté'
    default: return 'En attente'
  }
}
</script>
