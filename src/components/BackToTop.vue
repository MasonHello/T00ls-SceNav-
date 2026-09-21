<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ChevronUp } from '@lucide/vue'

const RADIUS = 21
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const visible = ref(false)
const progress = ref(0)

const dashOffset = computed(() => CIRCUMFERENCE * (1 - progress.value))

let frame = 0

function update() {
  frame = 0

  const doc = document.documentElement
  const scrollable = doc.scrollHeight - window.innerHeight
  const top = window.scrollY || doc.scrollTop

  progress.value = scrollable > 0 ? Math.min(1, Math.max(0, top / scrollable)) : 0
  visible.value = top > 480
}

function onScroll() {
  if (frame) {
    return
  }

  frame = window.requestAnimationFrame(update)
}

function toTop() {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (frame) {
    window.cancelAnimationFrame(frame)
  }
})
</script>

<template>
  <button
    class="to-top"
    :class="{ 'is-visible': visible }"
    type="button"
    title="回到顶部"
    aria-label="回到顶部"
    :aria-hidden="!visible"
    :tabindex="visible ? 0 : -1"
    @click="toTop"
  >
    <svg class="to-top-ring" viewBox="0 0 46 46" aria-hidden="true">
      <circle
        cx="23"
        cy="23"
        :r="RADIUS"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <ChevronUp :size="20" />
  </button>
</template>
