<template>
  <div class="min-h-screen bg-gradient-hero relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-soft"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-soft stagger-2"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-400/10 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-4 py-16 relative z-10">
      <div class="text-center animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-8 animate-fade-in-down">
          <span class="w-2 h-2 bg-secondary-400 rounded-full animate-pulse"></span>
          Gestion simplifiée des dépenses partagées
        </div>

        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Coloc <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-200 to-accent-300">Factures</span>
        </h1>

        <p class="text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up stagger-2">
          Simplifiez la gestion de vos dépenses partagées entre colocataires.
          Ajoutez des dépenses, calculez automatiquement qui doit combien à qui.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up stagger-3">
          <RouterLink
            to="/register"
            class="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-2xl shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 hover:-translate-y-1"
          >
            <span>Commencer gratuitement</span>
            <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </RouterLink>
          <RouterLink
            to="/login"
            class="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
          >
            Se connecter
          </RouterLink>
        </div>
      </div>

      <div class="mt-24 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div class="group bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 opacity-0 animate-fade-in-up stagger-1">
          <div class="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Ajout de dépenses</h3>
          <p class="text-primary-100/80 leading-relaxed">Ajoutez facilement vos dépenses et répartissez-les entre les membres.</p>
        </div>

        <div class="group bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 opacity-0 animate-fade-in-up stagger-2">
          <div class="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Calcul automatique</h3>
          <p class="text-primary-100/80 leading-relaxed">L'application calcule automatiquement qui doit combien à qui.</p>
        </div>

        <div class="group bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 opacity-0 animate-fade-in-up stagger-3">
          <div class="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Statistiques</h3>
          <p class="text-primary-100/80 leading-relaxed">Visualisez vos dépenses par catégorie et par mois.</p>
        </div>
      </div>

      <div class="mt-20 text-center opacity-0 animate-fade-in stagger-4">
        <p class="text-white/60 text-sm">
          Rejoignez des milliers d'utilisateurs satisfaits
        </p>
        <div class="flex justify-center items-center gap-1 mt-3">
          <svg v-for="i in 5" :key="i" class="w-5 h-5 text-warning-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span class="text-white/80 ml-2 font-medium">4.9/5</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
