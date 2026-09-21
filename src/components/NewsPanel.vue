<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Newspaper, RefreshCw } from '@lucide/vue'

const props = defineProps({
  feeds: {
    type: Array,
    required: true,
  },
})

const activeId = ref(props.feeds[0]?.id ?? '')
const loadingIds = ref([])
const rssItems = ref({})

const activeFeed = computed(() => props.feeds.find((feed) => feed.id === activeId.value) ?? props.feeds[0])
const activeItems = computed(() => rssItems.value[activeFeed.value?.id] ?? activeFeed.value?.items ?? [])

async function loadFeed(feed = activeFeed.value) {
  if (!feed?.rss) {
    return
  }

  loadingIds.value = [...new Set([...loadingIds.value, feed.id])]

  try {
    const response = await fetch(feed.rss)
    const xmlText = await response.text()
    const parsedItems = parseRss(xmlText)

    if (parsedItems.length > 0) {
      rssItems.value = {
        ...rssItems.value,
        [feed.id]: parsedItems,
      }
    }
  } catch {
    rssItems.value = {
      ...rssItems.value,
      [feed.id]: feed.items ?? [],
    }
  } finally {
    loadingIds.value = loadingIds.value.filter((id) => id !== feed.id)
  }
}

function parseRss(xmlText) {
  const xml = new DOMParser().parseFromString(xmlText, 'application/xml')

  if (xml.querySelector('parsererror')) {
    return []
  }

  const rssItemsList = Array.from(xml.querySelectorAll('item'))
  const atomItemsList = Array.from(xml.querySelectorAll('entry'))
  const nodes = rssItemsList.length > 0 ? rssItemsList : atomItemsList

  return nodes.slice(0, 8).map((node) => {
    const title = getNodeText(node, 'title') || '未命名文章'
    const linkNode = node.querySelector('link')
    const url = getNodeText(node, 'link') || linkNode?.getAttribute('href') || '#'

    return { title, url }
  })
}

function getNodeText(node, selector) {
  return node.querySelector(selector)?.textContent?.trim() ?? ''
}

watch(activeId, () => {
  loadFeed()
})

onMounted(() => {
  loadFeed()
})
</script>

<template>
  <section class="article-card">
    <header>
      <div>
        <Newspaper :size="18" />
        <h2>实时安全文章</h2>
      </div>
      <button type="button" title="刷新" aria-label="刷新文章列表" @click="loadFeed()">
        <RefreshCw :class="{ rotating: loadingIds.includes(activeFeed?.id) }" :size="18" />
      </button>
    </header>

    <div class="article-tabs">
      <button
        v-for="feed in feeds"
        :key="feed.id"
        type="button"
        :class="{ active: feed.id === activeId }"
        :aria-pressed="feed.id === activeId"
        @click="activeId = feed.id"
      >
        {{ feed.name }}
      </button>
    </div>

    <div class="article-list">
      <a
        v-for="(item, index) in activeItems"
        :key="item.title"
        :href="item.url"
        target="_blank"
        rel="noreferrer"
      >
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        <strong>{{ item.title }}</strong>
      </a>
    </div>
  </section>
</template>


