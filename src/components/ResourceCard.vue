<script setup>
import { computed, ref, watch } from 'vue'
import { Star } from '@lucide/vue'
import { resourceIcons } from '../data/resourceIcons'
import { withAlpha } from '../utils/color'

const props = defineProps({
  resource: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle-favorite'])

// Prefer the copy of the site's own favicon that ships with the app, fall back
// to a favicon service, and only then to the initial letter.
const localIcon = computed(() => resourceIcons[props.resource.domain] ?? '')
const remoteIcon = computed(
  () => `https://icons.duckduckgo.com/ip3/${props.resource.domain}.ico`,
)

const stage = ref(localIcon.value ? 'local' : 'remote')

watch(
  () => props.resource.domain,
  () => {
    stage.value = localIcon.value ? 'local' : 'remote'
  },
)

const iconSrc = computed(() => {
  if (stage.value === 'local') {
    return localIcon.value
  }
  return stage.value === 'remote' ? remoteIcon.value : ''
})

const initial = computed(() => props.resource.title.slice(0, 1).toUpperCase())

function handleIconError() {
  stage.value = stage.value === 'local' ? 'remote' : 'letter'
}

const accentStyle = computed(() => {
  const accent = props.resource.accent ?? '#425aef'

  return {
    '--i': Math.min(props.index, 11),
    '--accent': accent,
    '--accent-soft': withAlpha(accent, 0.1),
    '--accent-line': withAlpha(accent, 0.28),
  }
})
</script>

<template>
  <article class="link-card" :style="accentStyle">
    <a
      class="link-hit"
      :href="resource.url"
      target="_blank"
      rel="noreferrer noopener"
      :aria-label="`打开 ${resource.title}（${resource.domain}）`"
    >
      <span class="sr-only">{{ resource.title }} — {{ resource.description }}</span>
    </a>

    <div class="link-cover" aria-hidden="true">
      <img
        v-if="iconSrc"
        :src="iconSrc"
        alt=""
        loading="lazy"
        decoding="async"
        @error="handleIconError"
      />
      <b v-else>{{ initial }}</b>
    </div>

    <div class="link-body">
      <h3 class="link-name">{{ resource.title }}</h3>
      <p class="link-desc">{{ resource.description }}</p>

      <div class="link-meta">
        <span class="link-host">{{ resource.domain }}</span>
        <span v-for="tag in resource.tags?.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>

    <button
      class="fav-btn"
      :class="{ 'is-on': favorite }"
      type="button"
      :aria-pressed="favorite"
      :title="favorite ? '取消收藏' : '加入收藏'"
      @click="$emit('toggle-favorite', resource)"
    >
      <Star :size="16" />
      <span class="sr-only">{{ favorite ? '取消收藏' : '加入收藏' }}</span>
    </button>
  </article>
</template>
