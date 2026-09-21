<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { CornerDownLeft, ExternalLink, Search, X } from '@lucide/vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  resources: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['close', 'open-resource'])

const paletteQuery = ref('')
const activeIndex = ref(0)
const inputRef = ref(null)
const listRef = ref(null)

const filteredResources = computed(() => {
  const query = paletteQuery.value.trim().toLowerCase()
  const matches = query
    ? props.resources.filter((resource) =>
        [
          resource.title,
          resource.description,
          resource.domain,
          resource.sectionName,
          ...(resource.tags ?? []),
        ]
          .join(' ')
          .toLowerCase()
          .includes(query),
      )
    : props.resources

  return matches.slice(0, 16)
})

function move(step) {
  const total = filteredResources.value.length

  if (total === 0) {
    return
  }

  activeIndex.value = (activeIndex.value + step + total) % total
  scrollActiveIntoView()
}

function scrollActiveIntoView() {
  nextTick(() => {
    listRef.value
      ?.querySelector('.command-item.is-active')
      ?.scrollIntoView({ block: 'nearest' })
  })
}

function confirm() {
  const resource = filteredResources.value[activeIndex.value]

  if (resource) {
    emit('open-resource', resource)
  }
}

watch(paletteQuery, () => {
  activeIndex.value = 0
})

watch(
  () => props.isOpen,
  async (value) => {
    if (!value) {
      paletteQuery.value = ''
      return
    }

    activeIndex.value = 0
    await nextTick()
    inputRef.value?.focus()
  },
)
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="command-overlay" @click.self="emit('close')">
      <section class="command-panel" role="dialog" aria-modal="true" aria-label="快速查找资源">
        <header class="command-head">
          <Search :size="20" aria-hidden="true" />
          <input
            ref="inputRef"
            v-model="paletteQuery"
            type="search"
            placeholder="快速查找资源（↑ ↓ 选择，回车打开）"
            autocomplete="off"
            aria-label="快速查找资源"
            @keydown.down.prevent="move(1)"
            @keydown.up.prevent="move(-1)"
            @keydown.enter.prevent="confirm"
          />
          <button class="icon-btn" type="button" title="关闭" aria-label="关闭面板" @click="emit('close')">
            <X :size="18" />
          </button>
        </header>

        <div ref="listRef" class="command-list">
          <button
            v-for="(resource, index) in filteredResources"
            :key="resource.id"
            class="command-item"
            :class="{ 'is-active': index === activeIndex }"
            :style="{ '--i': index }"
            type="button"
            @mouseenter="activeIndex = index"
            @click="emit('open-resource', resource)"
          >
            <span class="command-dot" :style="{ background: resource.accent }" />
            <span>
              <strong>{{ resource.title }}</strong>
              <small>{{ resource.sectionName }} / {{ resource.domain }}</small>
            </span>
            <CornerDownLeft v-if="index === activeIndex" :size="16" aria-hidden="true" />
            <ExternalLink v-else :size="16" aria-hidden="true" />
          </button>

          <div v-if="filteredResources.length === 0" class="command-empty">
            没有匹配 “{{ paletteQuery }}” 的资源
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>
