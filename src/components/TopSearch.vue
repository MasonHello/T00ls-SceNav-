<script setup>
import { computed } from 'vue'
import { Search, X } from '@lucide/vue'
import { resourceIcons } from '../data/resourceIcons'

const props = defineProps({
  engines: {
    type: Array,
    required: true,
  },
})

const engineItems = computed(() =>
  props.engines.map((engine) => ({
    ...engine,
    icon: engine.domain ? (resourceIcons[engine.domain] ?? '') : '',
  })),
)

const query = defineModel('query', {
  type: String,
  default: '',
})

const engine = defineModel('engine', {
  type: String,
  default: '',
})

defineEmits(['open-palette', 'submit'])
</script>

<template>
  <div class="banner-search-wrap">
    <form class="banner-search" role="search" @submit.prevent="$emit('submit')">
      <Search class="search-icon" :size="20" aria-hidden="true" />

      <label class="sr-only" for="nav-search-input">搜索导航资源</label>
      <input
        id="nav-search-input"
        v-model="query"
        type="search"
        placeholder="搜索站内资源，回车用所选引擎继续检索"
        autocomplete="off"
        spellcheck="false"
      />

      <button
        v-if="query"
        class="clear-btn"
        type="button"
        title="清空"
        aria-label="清空搜索内容"
        @click="query = ''"
      >
        <X :size="16" />
      </button>

      <button
        class="palette-btn"
        type="button"
        title="打开快捷面板"
        aria-label="打开快捷搜索面板"
        @click="$emit('open-palette')"
      >
        <kbd>Ctrl</kbd>
        <kbd>K</kbd>
      </button>
    </form>

    <div class="engine-tabs" role="group" aria-label="搜索引擎">
      <button
        v-for="item in engineItems"
        :key="item.id"
        class="engine-tab"
        :class="{ active: item.id === engine }"
        type="button"
        :aria-pressed="item.id === engine"
        @click="engine = item.id"
      >
        <img v-if="item.icon" :src="item.icon" alt="" width="14" height="14" />
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
