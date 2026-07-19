<script setup>
import { ChevronsRight } from '@lucide/vue'

defineProps({
  activeSectionId: {
    type: String,
    required: true,
  },
  sections: {
    type: Array,
    required: true,
  },
})

defineEmits(['select-section'])
</script>

<template>
  <section class="type-bar">
    <div class="type-list">
      <button
        v-for="section in sections.slice(0, 5)"
        :key="section.id"
        type="button"
        :class="{ active: activeSectionId === section.id }"
        @click="$emit('select-section', section.id)"
      >
        {{ section.name }}
      </button>
    </div>

    <div
      class="more-menu"
      :class="{ active: !sections.slice(0, 5).some((section) => section.id === activeSectionId) }"
    >
      <ChevronsRight :size="23" />
      <select :value="activeSectionId" @change="$emit('select-section', $event.target.value)">
        <option v-for="section in sections" :key="section.id" :value="section.id">
          {{ section.name }}
        </option>
      </select>
      <span>更多</span>
    </div>
  </section>
</template>


