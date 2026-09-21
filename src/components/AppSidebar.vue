<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { LayoutGrid, Star } from '@lucide/vue'

const props = defineProps({
  activeSectionId: {
    type: String,
    required: true,
  },
  sections: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['select-section'])

const scrollerRef = ref(null)
const trackRef = ref(null)
const buttonRefs = ref([])
const indicator = ref({ x: 0, w: 0, ready: false })

function setButtonRef(el, index) {
  if (el) {
    buttonRefs.value[index] = el
  }
}

function measure() {
  const activeIndex = props.sections.findIndex((item) => item.id === props.activeSectionId)
  const button = buttonRefs.value[activeIndex]
  const track = trackRef.value
  const scroller = scrollerRef.value

  if (!button || !track || !scroller) {
    indicator.value = { ...indicator.value, ready: false }
    return
  }

  const trackRect = track.getBoundingClientRect()
  const buttonRect = button.getBoundingClientRect()
  const borderLeft = Number.parseFloat(getComputedStyle(track).borderLeftWidth) || 0

  indicator.value = {
    x: buttonRect.left - trackRect.left - borderLeft,
    w: buttonRect.width,
    ready: true,
  }

  if (scroller.scrollWidth > scroller.clientWidth) {
    const target = buttonRect.left - trackRect.left - scroller.clientWidth / 2 + buttonRect.width / 2
    scroller.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
  }
}

watch(
  () => [props.activeSectionId, props.sections.length],
  async () => {
    await nextTick()
    measure()
  },
  { immediate: true },
)

let resizeObserver = null

onMounted(() => {
  measure()

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => measure())

    if (trackRef.value) {
      resizeObserver.observe(trackRef.value)
    }
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <nav ref="scrollerRef" class="rail-scroller" aria-label="资源分类导航">
    <div ref="trackRef" class="rail-track">
      <span
        class="rail-indicator"
        :class="{ 'is-ready': indicator.ready }"
        :style="{ width: `${indicator.w}px`, transform: `translateX(${indicator.x}px)` }"
        aria-hidden="true"
      />

      <button
        v-for="(section, index) in sections"
        :key="section.id"
        :ref="(el) => setButtonRef(el, index)"
        class="rail-btn"
        :class="{ active: activeSectionId === section.id, fav: section.kind === 'favorite' }"
        type="button"
        :aria-current="activeSectionId === section.id ? 'true' : undefined"
        @click="emit('select-section', section.id)"
      >
        <LayoutGrid v-if="section.kind === 'all'" :size="15" aria-hidden="true" />
        <Star v-else-if="section.kind === 'favorite'" :size="15" aria-hidden="true" />
        {{ section.name }}
        <i>{{ section.count }}</i>
      </button>
    </div>
  </nav>
</template>
