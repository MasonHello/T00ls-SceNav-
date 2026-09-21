<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Anchor } from '@lucide/vue'
import ResourceCard from './ResourceCard.vue'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
  favorites: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['toggle-favorite'])

const root = ref(null)
const revealed = ref(false)
const favoriteSet = computed(() => new Set(props.favorites))

let observer = null

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    revealed.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealed.value = true
          observer?.disconnect()
        }
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.04 },
  )

  if (root.value) {
    observer.observe(root.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <section
    :id="section.id"
    ref="root"
    class="link-type-list"
    :class="{ 'is-revealed': revealed }"
    :style="{ '--accent': section.accent }"
    :aria-labelledby="`section-title-${section.id}`"
  >
    <div class="section-head">
      <div class="section-head-main">
        <span class="section-accent" aria-hidden="true" />
        <h2 :id="`section-title-${section.id}`" class="section-title">
          {{ section.name }}
          <span class="section-count">{{ section.resources.length }} 个入口</span>
        </h2>
      </div>

      <p class="section-tip">{{ section.description }}</p>

      <a
        class="section-anchor"
        :href="`#${section.id}`"
        :title="`锚点链接：${section.name}`"
        :aria-label="`复制或跳转到 ${section.name} 的锚点`"
      >
        <Anchor :size="16" />
      </a>
    </div>

    <div class="link-grid">
      <ResourceCard
        v-for="(resource, index) in section.resources"
        :key="resource.id"
        :resource="resource"
        :index="index"
        :favorite="favoriteSet.has(resource.url)"
        @toggle-favorite="$emit('toggle-favorite', $event)"
      />
    </div>
  </section>
</template>
