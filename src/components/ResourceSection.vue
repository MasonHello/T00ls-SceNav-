<script setup>
import ResourceCard from './ResourceCard.vue'

defineProps({
  section: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section class="link-type-list" :id="section.id">
    <div class="title">
      <h2 class="name">
        <span class="name-text">{{ section.name }}</span>
        <span class="name-count">（{{ section.resources.length }}）</span>
      </h2>
      <span class="tip">{{ section.description }}</span>
    </div>

    <div class="all-link">
      <ResourceCard
        v-for="resource in section.resources"
        :key="resource.id"
        :resource="resource"
      />
    </div>
  </section>
</template>


