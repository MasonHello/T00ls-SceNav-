<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  resource: {
    type: Object,
    required: true,
  },
})

const imageFailed = ref(false)

const faviconUrl = computed(
  () => `https://icons.duckduckgo.com/ip3/${props.resource.domain}.ico`,
)
</script>

<template>
  <a class="link-card" :href="resource.url" target="_blank" rel="noreferrer">
    <div class="cover">
      <img
        v-if="!imageFailed"
        :src="faviconUrl"
        :alt="`${resource.title} 图标`"
        loading="lazy"
        @error="imageFailed = true"
      />
      <span v-else>{{ resource.title.slice(0, 1).toUpperCase() }}</span>
    </div>
    <div class="data">
      <span class="name">{{ resource.title }}</span>
      <span class="desc">{{ resource.description }}</span>
      <span class="tag-line">
        <span v-for="tag in resource.tags?.slice(0, 2)" :key="tag">{{ tag }}</span>
      </span>
    </div>
    <span class="domain">{{ resource.badge || resource.domain }}</span>
  </a>
</template>


