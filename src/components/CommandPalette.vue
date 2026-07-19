<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { ExternalLink, Search, X } from '@lucide/vue'

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
const inputRef = ref(null)

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

watch(
  () => props.isOpen,
  async (value) => {
    if (!value) {
      paletteQuery.value = ''
      return
    }

    await nextTick()
    inputRef.value?.focus()
  },
)
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="command-overlay" @click.self="emit('close')">
      <section class="command-panel" role="dialog" aria-modal="true" aria-label="快速查找">
        <header class="command-head">
          <Search :size="20" />
          <input ref="inputRef" v-model="paletteQuery" type="search" placeholder="快速查找资源" />
          <button class="icon-button" type="button" title="关闭" @click="emit('close')">
            <X :size="18" />
          </button>
        </header>

        <div class="command-list">
          <button
            v-for="resource in filteredResources"
            :key="resource.id"
            class="command-item"
            type="button"
            @click="emit('open-resource', resource)"
          >
            <span class="command-dot" :style="{ background: resource.accent }" />
            <span>
              <strong>{{ resource.title }}</strong>
              <small>{{ resource.sectionName }} / {{ resource.domain }}</small>
            </span>
            <ExternalLink :size="16" />
          </button>

          <div v-if="filteredResources.length === 0" class="command-empty">无匹配结果</div>
        </div>
      </section>
    </div>
  </Teleport>
</template>




