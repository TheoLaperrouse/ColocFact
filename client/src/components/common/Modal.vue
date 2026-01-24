<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto"
      >
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="fixed inset-0 bg-neutral-text/60 backdrop-blur-sm"
            @click="emit('close')"
          ></div>

          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-90 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-90 translate-y-4"
          >
            <div
              v-if="show"
              :class="['relative bg-neutral-card rounded-2xl shadow-2xl w-full border border-neutral-border', sizeClasses[size]]"
            >
              <div v-if="title" class="flex items-center justify-between px-6 py-5 border-b border-neutral-border">
                <h3 class="text-xl font-bold text-neutral-text">{{ title }}</h3>
                <button
                  @click="emit('close')"
                  class="icon-btn -mr-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div class="p-6">
                <slot></slot>
              </div>

              <div v-if="$slots.footer" class="px-6 py-4 border-t border-neutral-border bg-neutral-bg/50 rounded-b-2xl">
                <slot name="footer"></slot>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
})

const emit = defineEmits(['close'])

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
}

watch(() => props.show, (value) => {
  if (value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>
