<template>
  <div class="h-full flex">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-neutral-text/50 backdrop-blur-sm z-20 lg:hidden"
        @click="sidebarOpen = false"
      ></div>
    </Transition>

    <aside
      :class="[
        'fixed inset-y-0 left-0 z-30 w-72 bg-neutral-card shadow-2xl transform transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:inset-auto lg:shadow-lg',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="h-full flex flex-col">
        <div class="h-20 flex items-center px-6 border-b border-neutral-border">
          <RouterLink to="/dashboard" class="flex items-center gap-3 group">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <span class="text-xl font-bold text-gradient-primary">Coloc Factures</span>
          </RouterLink>
        </div>

        <Transition
          enter-active-class="animate-fade-in-down"
          leave-active-class="animate-fade-out"
        >
          <div v-if="currentGroup" class="mx-4 mt-4 p-4 bg-gradient-to-r from-primary-500/10 to-accent-500/5 rounded-xl border border-primary-200/50">
            <p class="text-xs text-primary-500 font-semibold uppercase tracking-wider mb-1">Groupe actuel</p>
            <p class="text-sm font-bold text-neutral-text truncate">{{ currentGroup.name }}</p>
          </div>
        </Transition>

        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <RouterLink
            v-for="(item, index) in navigation"
            :key="item.path"
            :to="item.path"
            :class="[
              'nav-item',
              isActive(item.path) ? 'nav-item-active' : 'nav-item-inactive'
            ]"
            :style="{ animationDelay: `${index * 0.05}s` }"
            @click="sidebarOpen = false"
          >
            <svg v-if="item.icon === 'home'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <svg v-else-if="item.icon === 'users'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <svg v-else-if="item.icon === 'receipt'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            <svg v-else-if="item.icon === 'scale'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
            </svg>
            <svg v-else-if="item.icon === 'chart'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            {{ item.name }}
          </RouterLink>
        </nav>

        <div class="border-t border-neutral-border p-4">
          <div class="flex items-center p-3 rounded-xl bg-neutral-bg/50">
            <div class="avatar w-11 h-11">
              {{ user?.firstName?.[0] }}{{ user?.lastName?.[0] }}
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <p class="text-sm font-semibold text-neutral-text truncate">
                {{ user?.firstName }} {{ user?.lastName }}
              </p>
              <p class="text-xs text-neutral-text-secondary truncate">{{ user?.email }}</p>
            </div>
            <RouterLink to="/profile" class="icon-btn">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </RouterLink>
          </div>
          <button
            @click="logout"
            class="mt-3 w-full btn-secondary text-sm group"
          >
            <svg class="w-4 h-4 mr-2 group-hover:text-danger-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Déconnexion
          </button>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-16 bg-neutral-card/80 backdrop-blur-lg shadow-sm flex items-center px-4 lg:px-6 border-b border-neutral-border sticky top-0 z-10">
        <button
          class="lg:hidden icon-btn -ml-2"
          @click="sidebarOpen = true"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <div class="flex-1"></div>
        <RouterLink to="/profile" class="icon-btn">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </RouterLink>
      </header>

      <main class="flex-1 overflow-y-auto bg-neutral-bg p-4 lg:p-8">
        <div class="animate-fade-in-up">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useGroupsStore } from '@/stores/groups'

const { user, logout } = useAuth()
const route = useRoute()
const groupsStore = useGroupsStore()

const sidebarOpen = ref(false)
const currentGroup = computed(() => groupsStore.currentGroup)

const navigation = computed(() => {
  const items = [
    { name: 'Tableau de bord', path: '/dashboard', icon: 'home' },
    { name: 'Mes groupes', path: '/groups', icon: 'users' }
  ]

  if (currentGroup.value) {
    items.push(
      { name: 'Dépenses', path: `/groups/${currentGroup.value.id}/expenses`, icon: 'receipt' },
      { name: 'Équilibrage', path: `/groups/${currentGroup.value.id}/balances`, icon: 'scale' },
      { name: 'Statistiques', path: `/groups/${currentGroup.value.id}/statistics`, icon: 'chart' }
    )
  }

  return items
})

function isActive(path) {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>
