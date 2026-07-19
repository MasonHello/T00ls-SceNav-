<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  GitBranch,
  Grid2X2,
  Mail,
  Search,
  Shuffle,
  TrainFront,
} from '@lucide/vue'
import AppSidebar from './components/AppSidebar.vue'
import CommandPalette from './components/CommandPalette.vue'
import HitokotoLine from './components/HitokotoLine.vue'
import NewsPanel from './components/NewsPanel.vue'
import ResourceSection from './components/ResourceSection.vue'
import TopSearch from './components/TopSearch.vue'
import {
  navigationSections,
  searchEngines,
  securityFeeds,
} from './data/navigation'

const searchText = ref('')
const activeSectionId = ref('all')
const selectedEngineId = ref(searchEngines[0].id)
const commandOpen = ref(false)
const siteNotice = '欢迎访问T00ls.cc安全导航站'

const sections = computed(() => navigationSections)

const allResources = computed(() =>
  sections.value.flatMap((section) =>
    section.resources.map((resource) => normalizeResource(resource, section)),
  ),
)

const selectedEngine = computed(
  () =>
    searchEngines.find((engine) => engine.id === selectedEngineId.value) ??
    searchEngines[0],
)

const normalizedQuery = computed(() => searchText.value.trim().toLowerCase())

const visibleSections = computed(() => {
  const query = normalizedQuery.value

  return sections.value
    .filter((section) => activeSectionId.value === 'all' || section.id === activeSectionId.value)
    .map((section) => {
      const resources = section.resources
        .map((resource) => normalizeResource(resource, section))
        .filter((resource) => {
          if (!query) {
            return true
          }

          return [
            resource.title,
            resource.description,
            resource.domain,
            resource.sectionName,
            ...(resource.tags ?? []),
          ]
            .join(' ')
            .toLowerCase()
            .includes(query)
        })

      return { ...section, resources }
    })
    .filter((section) => section.resources.length > 0)
})

const sectionMenu = computed(() => [
  {
    id: 'all',
    name: '首页',
    count: allResources.value.length,
  },
  ...sections.value.map((section) => ({
    id: section.id,
    name: section.name,
    count: section.resources.length,
    accent: section.accent,
  })),
])

const springCountdown = computed(() => {
  const target = new Date('2027-02-27T00:00:00+08:00')
  const today = new Date()
  const days = Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86400000))

  return {
    days,
    date: '2027-02-27',
    rows: [
      { label: '今日', value: 75 },
      { label: '本周', value: 85.71 },
      { label: '本月', value: 54.84 },
      { label: '本年', value: 54.25 },
    ],
  }
})

function normalizeResource(resource, section) {
  return {
    ...resource,
    id: resource.id ?? `${section.id}:${resource.url}`,
    sectionId: section.id,
    sectionName: section.name,
    accent: section.accent,
  }
}

function runExternalSearch() {
  const query = searchText.value.trim()

  if (!query) {
    return
  }

  const encoded =
    selectedEngine.value.encode === 'base64' ? encodeBase64(query) : encodeURIComponent(query)

  window.open(`${selectedEngine.value.action}${encoded}`, '_blank', 'noopener,noreferrer')
}

function encodeBase64(value) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

function openResource(resource) {
  window.open(resource.url, '_blank', 'noopener,noreferrer')
  commandOpen.value = false
}

function handleKeydown(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    commandOpen.value = true
  }

  if (event.key === 'Escape') {
    commandOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="page-shell">
    <header class="main-header">
      <nav class="main-nav" aria-label="顶部导航">
        <a class="site-name" href="/" aria-label="T00ls-SceNav">
          <img class="site-logo" src="/logo.webp" alt="T00ls-SceNav" />
          <span>T00ls-SceNav</span>
        </a>

        <div class="nav-actions">
          <a href="https://memme.cn" target="_blank" rel="noreferrer" title="开往">
            <TrainFront :size="21" />
          </a>
          <button type="button" title="随机资源" @click="openResource(allResources[Math.floor(Math.random() * allResources.length)])">
            <Shuffle :size="21" />
          </button>
          <button type="button" title="搜索" @click="commandOpen = true">
            <Search :size="24" />
          </button>
          <button type="button" title="快捷面板" @click="commandOpen = true">
            <Grid2X2 :size="22" />
          </button>
        </div>
      </nav>
    </header>

    <section class="banner">
      <TopSearch
        v-model:query="searchText"
        @open-palette="commandOpen = true"
        @submit="runExternalSearch"
      />
      <HitokotoLine />
      <div class="site-notice">{{ siteNotice }}</div>
    </section>

    <div class="home-content">
      <div class="posts-content">
        <AppSidebar
          :active-section-id="activeSectionId"
          :sections="sectionMenu"
          @select-section="activeSectionId = $event"
        />

        <div class="mobile-aside-panel">
          <NewsPanel :feeds="securityFeeds" />
        </div>

        <section v-if="visibleSections.length === 0" class="empty-module">
          <strong>未找到匹配资源</strong>
          <span>可以清空搜索或在配置文件中补充链接。</span>
        </section>

        <ResourceSection
          v-for="section in visibleSections"
          :key="section.id"
          :section="section"
        />
      </div>

      <aside class="main-aside">
        <NewsPanel :feeds="securityFeeds" />

        <section class="author-card">
          <div class="hello-pill">傍晚好，是时候放松一下了！</div>
          <img class="author-avatar" src="/logo.webp" alt="HelloMason" />
          <div class="author-bottom">
            <div>
              <strong>HelloMason</strong>
              <span>T00ls-SceNav</span>
            </div>
            <div class="author-actions">
              <a href="https://github.com/Mario-Call" target="_blank" rel="noreferrer" title="GitHub">
                <GitBranch :size="22" />
              </a>
              <a href="mailto:admin@memme.cn" title="邮件">
                <Mail :size="22" />
              </a>
            </div>
          </div>
        </section>

        <section class="count-card">
          <div class="count-left">
            <span>距离</span>
            <strong>春节</strong>
            <b>{{ springCountdown.days }}</b>
            <small>{{ springCountdown.date }}</small>
          </div>
          <div class="count-bars">
            <div v-for="row in springCountdown.rows" :key="row.label" class="count-row">
              <span>{{ row.label }}</span>
              <div>
                <i :style="{ width: `${row.value}%` }">{{ row.value.toFixed(2) }}%</i>
              </div>
            </div>
          </div>
        </section>

      </aside>
    </div>

    <footer class="site-footer">
      <span>Copyright © 2026 By Mason</span>
      <a href="https://memme.cn" target="_blank" rel="noreferrer">友情链接 HelloMason</a>
    </footer>

    <CommandPalette
      :is-open="commandOpen"
      :resources="allResources"
      @close="commandOpen = false"
      @open-resource="openResource"
    />
  </div>
</template>

