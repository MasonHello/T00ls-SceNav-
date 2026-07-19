<script setup>
import { Search } from '@lucide/vue'

const query = defineModel('query', {
  type: String,
  default: '',
})

defineEmits(['open-palette', 'submit'])
</script>

<template>
  <form class="banner-search" @submit.prevent="$emit('submit')">
    <Search :size="20" />
    <input v-model="query" type="search" placeholder="搜索 T00ls-SceNav 导航资源" autocomplete="off" />
    <button type="button" aria-label="打开快捷搜索" @click="$emit('open-palette')">
      <kbd>Ctrl</kbd>
      <kbd>K</kbd>
    </button>
  </form>
</template>


