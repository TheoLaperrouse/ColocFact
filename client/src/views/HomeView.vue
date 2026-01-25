<template>
  <div class="min-h-screen bg-neutral-bg overflow-hidden">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-soft"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-soft stagger-2"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-400/10 rounded-full blur-3xl"></div>

        <!-- Floating shapes -->
        <div class="absolute top-20 left-[10%] w-4 h-4 bg-white/20 rounded-full animate-float"></div>
        <div class="absolute top-40 right-[15%] w-6 h-6 bg-accent-400/30 rounded-full animate-float stagger-2"></div>
        <div class="absolute bottom-40 left-[20%] w-3 h-3 bg-white/30 rounded-full animate-float stagger-3"></div>
        <div class="absolute top-1/3 right-[25%] w-5 h-5 bg-secondary-400/20 rounded-full animate-float stagger-1"></div>
        <div class="absolute bottom-1/4 right-[10%] w-4 h-4 bg-white/20 rounded-full animate-float stagger-4"></div>

        <!-- Grid pattern -->
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div class="container mx-auto px-4 py-20 relative z-10">
        <div class="text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-8 animate-fade-in-down">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-secondary-400"></span>
            </span>
            Gestion simplifiée des factures partagées
          </div>

          <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight animate-fade-in-up">
            Coloc
            <span class="relative">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-200 to-accent-300">Factures</span>
              <svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 4 150 4 198 10" stroke="url(#underline-gradient)" stroke-width="3" stroke-linecap="round" class="animate-draw"/>
                <defs>
                  <linearGradient id="underline-gradient" x1="0" y1="0" x2="200" y2="0">
                    <stop stop-color="#fff" stop-opacity="0.8"/>
                    <stop offset="1" stop-color="#8E7CF0" stop-opacity="0.8"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p class="text-xl md:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed opacity-0 animate-fade-in-up stagger-2">
            Fini les calculs compliqués et les tensions entre colocataires.
            <span class="text-white font-medium">Gérez vos factures en toute simplicité.</span>
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up stagger-3">
            <RouterLink
              to="/register"
              class="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-2xl shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <span class="relative z-10 flex items-center">
                Commencer gratuitement
                <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-primary-50 to-accent-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </RouterLink>
            <RouterLink
              to="/login"
              class="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              Se connecter
            </RouterLink>
          </div>

          <!-- Stats -->
          <div class="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto opacity-0 animate-fade-in-up stagger-4">
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-white" ref="stat1">0</div>
              <div class="text-primary-200 text-sm mt-1">Utilisateurs</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-white" ref="stat2">0</div>
              <div class="text-primary-200 text-sm mt-1">Factures gérées</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-white" ref="stat3">0%</div>
              <div class="text-primary-200 text-sm mt-1">Satisfaction</div>
            </div>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div class="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div class="w-1.5 h-3 bg-white/60 rounded-full animate-scroll-indicator"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-24 bg-neutral-bg relative" ref="howItWorks">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-4">
            Simple comme bonjour
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-neutral-text mb-4">
            Comment ça <span class="text-gradient-primary">marche</span> ?
          </h2>
          <p class="text-neutral-text-secondary text-lg max-w-2xl mx-auto">
            Trois étapes simples pour ne plus jamais se prendre la tête avec les factures
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          <!-- Connection line -->
          <div class="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200"></div>

          <div
            v-for="(step, index) in steps"
            :key="index"
            class="relative opacity-0 translate-y-8"
            :class="{ 'animate-step-in': isHowItWorksVisible }"
            :style="{ animationDelay: `${index * 0.2}s` }"
          >
            <div class="bg-neutral-card rounded-3xl p-8 text-center border border-neutral-border hover:border-primary-300 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-500 group">
              <div class="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-primary-500/30">
                <component :is="step.icon" class="w-10 h-10 text-white" />
                <span class="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary-600 font-bold shadow-lg">
                  {{ index + 1 }}
                </span>
              </div>
              <h3 class="text-xl font-bold text-neutral-text mb-3">{{ step.title }}</h3>
              <p class="text-neutral-text-secondary leading-relaxed">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features with App Preview -->
    <section class="py-24 bg-gradient-to-b from-neutral-bg to-primary-50/30 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>

      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <!-- Features List -->
          <div>
            <span class="inline-block px-4 py-1.5 bg-accent-100 text-accent-600 rounded-full text-sm font-medium mb-4">
              Fonctionnalités
            </span>
            <h2 class="text-4xl md:text-5xl font-bold text-neutral-text mb-6">
              Tout ce dont vous avez <span class="text-gradient-accent">besoin</span>
            </h2>
            <p class="text-neutral-text-secondary text-lg mb-10">
              Une application complète pour gérer toutes vos dépenses partagées sans effort.
            </p>

            <div class="space-y-6">
              <div
                v-for="(feature, index) in features"
                :key="index"
                class="group flex gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 cursor-pointer"
                @mouseenter="activeFeature = index"
              >
                <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <component :is="feature.icon" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-neutral-text mb-1 group-hover:text-primary-600 transition-colors">{{ feature.title }}</h3>
                  <p class="text-neutral-text-secondary text-sm">{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- App Preview -->
          <div class="relative">
            <div class="relative bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl p-8 shadow-2xl shadow-primary-500/20">
              <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] rounded-3xl"></div>

              <!-- Mock App Screen -->
              <div class="relative bg-neutral-bg rounded-2xl overflow-hidden shadow-xl">
                <!-- App Header -->
                <div class="bg-neutral-card px-4 py-3 border-b border-neutral-border flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg"></div>
                    <span class="font-semibold text-neutral-text">Coloc Factures</span>
                  </div>
                  <div class="flex gap-1">
                    <div class="w-3 h-3 rounded-full bg-danger-400"></div>
                    <div class="w-3 h-3 rounded-full bg-warning-400"></div>
                    <div class="w-3 h-3 rounded-full bg-secondary-400"></div>
                  </div>
                </div>

                <!-- App Content -->
                <div class="p-4 space-y-4">
                  <!-- Balance Card -->
                  <div class="bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl p-4 text-white">
                    <p class="text-sm opacity-80">Votre solde</p>
                    <p class="text-2xl font-bold">+45.50 EUR</p>
                  </div>

                  <!-- Recent Expenses -->
                  <div class="space-y-2">
                    <p class="text-sm font-medium text-neutral-text">Dernières factures</p>
                    <div v-for="i in 3" :key="i" class="flex items-center justify-between p-3 bg-neutral-card rounded-lg border border-neutral-border">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                          <span class="text-lg">{{ ['💡', '💧', '🔥'][i-1] }}</span>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-neutral-text">{{ ['Electricite', 'Eau', 'Gaz'][i-1] }}</p>
                          <p class="text-xs text-neutral-text-secondary">{{ ['15 Jan', '10 Jan', '05 Jan'][i-1] }}</p>
                        </div>
                      </div>
                      <span class="font-semibold text-neutral-text">{{ ['89.00', '42.50', '65.00'][i-1] }} EUR</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Floating Elements -->
              <div class="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl animate-float">
                <div class="flex items-center gap-2">
                  <div class="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-neutral-text-secondary">Facture ajoutée</p>
                    <p class="text-sm font-semibold text-neutral-text">+89.00 EUR</p>
                  </div>
                </div>
              </div>

              <div class="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl animate-float stagger-2">
                <div class="flex items-center gap-2">
                  <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-neutral-text-secondary">Colocataires</p>
                    <p class="text-sm font-semibold text-neutral-text">4 membres</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-24 bg-neutral-bg">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 bg-secondary-100 text-secondary-600 rounded-full text-sm font-medium mb-4">
            Catégories
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-neutral-text mb-4">
            Toutes vos <span class="text-gradient-primary">factures</span> au meme endroit
          </h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div
            v-for="(cat, index) in categories"
            :key="index"
            class="group bg-neutral-card rounded-2xl p-6 text-center border border-neutral-border hover:border-primary-300 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2"
          >
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300" :class="cat.bg">
              {{ cat.emoji }}
            </div>
            <h3 class="font-semibold text-neutral-text">{{ cat.name }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-24 bg-gradient-to-b from-neutral-bg to-primary-50/50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 bg-warning-100 text-warning-600 rounded-full text-sm font-medium mb-4">
            Temoignages
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-neutral-text mb-4">
            Ce qu'en pensent nos <span class="text-gradient-accent">utilisateurs</span>
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div
            v-for="(testimonial, index) in testimonials"
            :key="index"
            class="bg-white rounded-3xl p-8 shadow-lg shadow-primary-500/5 border border-neutral-border hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-500"
          >
            <div class="flex gap-1 mb-4">
              <svg v-for="i in 5" :key="i" class="w-5 h-5 text-warning-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <p class="text-neutral-text-secondary mb-6 leading-relaxed italic">"{{ testimonial.text }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold">
                {{ testimonial.name.charAt(0) }}
              </div>
              <div>
                <p class="font-semibold text-neutral-text">{{ testimonial.name }}</p>
                <p class="text-sm text-neutral-text-secondary">{{ testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-gradient-hero relative overflow-hidden">
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      <div class="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl"></div>

      <div class="container mx-auto px-4 relative z-10 text-center">
        <h2 class="text-4xl md:text-6xl font-bold text-white mb-6">
          Prêt a simplifier vos factures ?
        </h2>
        <p class="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
          Rejoignez des milliers de colocataires qui ont déjà adopté Coloc Factures.
        </p>
        <RouterLink
          to="/register"
          class="inline-flex items-center justify-center px-10 py-5 bg-white text-primary-600 font-bold text-lg rounded-2xl shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 hover:-translate-y-1"
        >
          Commencer maintenant
          <svg class="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </RouterLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-neutral-card border-t border-neutral-border py-12">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold">CF</span>
            </div>
            <span class="font-bold text-neutral-text">Coloc Factures</span>
          </div>
          <p class="text-neutral-text-secondary text-sm">
            2026 Coloc Factures. Fait avec amour pour les colocataires.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue'
import { RouterLink } from 'vue-router'

// Icons as render functions
const UsersIcon = () => h('svg', { class: 'w-10 h-10 text-white', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
])

const ReceiptIcon = () => h('svg', { class: 'w-10 h-10 text-white', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' })
])

const CalculatorIcon = () => h('svg', { class: 'w-10 h-10 text-white', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' })
])

const ChartIcon = () => h('svg', { class: 'w-6 h-6 text-white', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
])

const BellIcon = () => h('svg', { class: 'w-6 h-6 text-white', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' })
])

const LockIcon = () => h('svg', { class: 'w-6 h-6 text-white', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' })
])

const DeviceIcon = () => h('svg', { class: 'w-6 h-6 text-white', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' })
])

// Data
const steps = [
  { title: 'Créez votre groupe', description: 'Invitez vos colocataires à rejoindre votre espace partagé en quelques clics.', icon: UsersIcon },
  { title: 'Ajoutez vos factures', description: 'Enregistrez vos factures d\'eau, électricité, gaz ou assurance en toute simplicité.', icon: ReceiptIcon },
  { title: 'Laissez-nous calculer', description: 'L\'application calcule automatiquement qui doit combien à qui. Fini les prises de tête !', icon: CalculatorIcon }
]

const features = [
  { title: 'Statistiques détaillées', description: 'Visualisez vos dépenses par catégorie et par mois avec des graphiques clairs.', icon: ChartIcon },
  { title: 'Notifications', description: 'Recevez des alertes quand une nouvelle facture est ajoutée ou qu\'un paiement est attendu.', icon: BellIcon },
  { title: 'Securisé', description: 'Vos données sont protégées et accessibles uniquement par les membres de votre groupe.', icon: LockIcon },
  { title: 'Multi-plateforme', description: 'Accessible depuis n\'importe quel appareil : ordinateur, tablette ou smartphone.', icon: DeviceIcon }
]

const categories = [
  { name: 'Eau', emoji: '💧', bg: 'bg-blue-100' },
  { name: 'Electricité', emoji: '💡', bg: 'bg-yellow-100' },
  { name: 'Gaz', emoji: '🔥', bg: 'bg-orange-100' },
  { name: 'Assurance', emoji: '🏠', bg: 'bg-green-100' }
]

const testimonials = [
  { name: 'Marie L.', role: 'Etudiante', text: 'Enfin une app qui simplifie la vie en coloc ! Plus de disputes pour savoir qui a paye quoi.' },
  { name: 'Thomas D.', role: 'Jeune actif', text: 'Interface super intuitive, je recommande à tous mes amis en colocation.' },
  { name: 'Sophie M.', role: 'Colocataire', text: 'Le calcul automatique des remboursements, c\'est génial. On gagne un temps fou !' }
]

const activeFeature = ref(0)
const howItWorks = ref(null)
const isHowItWorksVisible = ref(false)
const stat1 = ref(null)
const stat2 = ref(null)
const stat3 = ref(null)

// Animate counter
const animateCounter = (element, target, suffix = '') => {
  if (!element) return
  let current = 0
  const increment = target / 50
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current).toLocaleString() + suffix
  }, 30)
}

onMounted(() => {
  // Intersection Observer for "How it works" section
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isHowItWorksVisible.value = true
          observer.disconnect()
        }
      })
    },
    { threshold: 0.2 }
  )

  if (howItWorks.value) {
    observer.observe(howItWorks.value)
  }

  // Animate stats after a delay
  setTimeout(() => {
    animateCounter(stat1.value, 2500, '+')
    animateCounter(stat2.value, 15000, '+')
    animateCounter(stat3.value, 99, '%')
  }, 1000)
})
</script>

<style scoped>
@keyframes draw {
  from {
    stroke-dasharray: 200;
    stroke-dashoffset: 200;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.animate-draw {
  animation: draw 1.5s ease-out forwards;
  animation-delay: 0.5s;
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
}

@keyframes scroll-indicator {
  0%, 100% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(6px);
    opacity: 0.5;
  }
}

.animate-scroll-indicator {
  animation: scroll-indicator 1.5s ease-in-out infinite;
}

@keyframes step-in {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-step-in {
  animation: step-in 0.6s ease-out forwards;
}
</style>
