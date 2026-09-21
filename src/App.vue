<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  GitBranch,
  Grid2X2,
  Mail,
  Search,
  Shuffle,
  Sparkles,
  TrainFront,
} from '@lucide/vue'
import AppSidebar from './components/AppSidebar.vue'
import BackToTop from './components/BackToTop.vue'
import CommandPalette from './components/CommandPalette.vue'
import HitokotoLine from './components/HitokotoLine.vue'
import NewsPanel from './components/NewsPanel.vue'
import ResourceSection from './components/ResourceSection.vue'
import TopSearch from './components/TopSearch.vue'
import { navigationSections, searchEngines, securityFeeds } from './data/navigation'

const FAVORITE_KEY = 'sce-nav:favorites'

const searchText = ref('')
const activeSectionId = ref('all')
const selectedEngineId = ref(searchEngines[0].id)
const commandOpen = ref(false)
const scrolled = ref(false)
const railStuck = ref(false)
const favorites = ref([])
const animatedDays = ref(0)
const barsReady = ref(false)

const siteNotice = '欢迎访问 T00ls.cc 安全导航站，收录入口持续更新中'

const sections = computed(() => navigationSections)

const allResources = computed(() =>
  sections.value.flatMap((section) =>
    section.resources.map((resource) => normalizeResource(resource, section)),
  ),
)

const selectedEngine = computed(
  () =>
    searchEngines.find((engine) => engine.id === selectedEngineId.value) ?? searchEngines[0],
)

const normalizedQuery = computed(() => searchText.value.trim().toLowerCase())

function matchesQuery(resource, query) {
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
}

const searchedSections = computed(() =>
  sections.value
    .map((section) => ({
      ...section,
      resources: section.resources
        .map((resource) => normalizeResource(resource, section))
        .filter((resource) => matchesQuery(resource, normalizedQuery.value)),
    }))
    .filter((section) => section.resources.length > 0),
)

const favoriteResources = computed(() => {
  const picked = new Set(favorites.value)

  return allResources.value.filter(
    (resource) => picked.has(resource.url) && matchesQuery(resource, normalizedQuery.value),
  )
})

const favoritesSection = computed(() => ({
  id: 'favorites',
  name: '我的收藏',
  accent: '#f5a524',
  description: '你收藏的常用入口，保存在本地浏览器中。',
  resources: favoriteResources.value,
}))

const displaySections = computed(() => {
  const list = favoriteResources.value.length > 0 ? [favoritesSection.value] : []

  return [...list, ...searchedSections.value]
})

const sectionMenu = computed(() => [
  { id: 'all', name: '全部', kind: 'all', count: allResources.value.length },
  ...(favorites.value.length > 0
    ? [
        {
          id: 'favorites',
          name: '我的收藏',
          kind: 'favorite',
          accent: '#f5a524',
          count: favorites.value.length,
        },
      ]
    : []),
  ...sections.value.map((section) => ({
    id: section.id,
    name: section.name,
    kind: 'category',
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

/* -------------------------------------------------------------- favorites */

function loadFavorites() {
  try {
    const raw = window.localStorage.getItem(FAVORITE_KEY)
    const parsed = raw ? JSON.parse(raw) : []

    favorites.value = Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    favorites.value = []
  }
}

function persistFavorites() {
  try {
    window.localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites.value))
  } catch {
    /* storage unavailable — keep the in-memory list */
  }
}

function toggleFavorite(resource) {
  const next = new Set(favorites.value)

  if (next.has(resource.url)) {
    next.delete(resource.url)
  } else {
    next.add(resource.url)
  }

  favorites.value = [...next]
  persistFavorites()
}

/* ------------------------------------------------------------- navigation */

let spyLocked = false
let spyLockTimer = 0

function spyOffset() {
  const header = document.querySelector('.main-header')
  const rail = document.querySelector('.rail-shell')

  return (header?.offsetHeight ?? 62) + (rail?.offsetHeight ?? 60) + 26
}

function updateActiveSection() {
  const offset = spyOffset()
  const doc = document.documentElement
  let current = 'all'

  // At the end of the document the trailing sections can never cross the spy
  // line, so pin the highlight to the last rendered category instead.
  const rendered = document.querySelectorAll('.link-type-list')
  const scrollable = doc.scrollHeight > window.innerHeight + 8

  if (scrollable && window.scrollY > 0 && window.scrollY + window.innerHeight >= doc.scrollHeight - 4) {
    const last = rendered[rendered.length - 1]

    if (last?.id) {
      activeSectionId.value = last.id
      return
    }
  }

  if (document.getElementById('favorites')?.getBoundingClientRect().top - offset <= 0) {
    current = 'favorites'
  }

  sections.value.forEach((section) => {
    const node = document.getElementById(section.id)

    if (node && node.getBoundingClientRect().top - offset <= 0) {
      current = section.id
    }
  })

  activeSectionId.value = current
}

function goToSection(id) {
  const target = id === 'all' ? null : document.getElementById(id)

  // When a search filter hides the requested category there is nothing to
  // scroll to, so leave the highlight where it is instead of stranding it.
  if (id !== 'all' && !target) {
    return
  }

  activeSectionId.value = id
  spyLocked = true
  window.clearTimeout(spyLockTimer)
  spyLockTimer = window.setTimeout(() => {
    spyLocked = false
    updateActiveSection()
  }, 720)

  if (id === 'all') {
    const rail = document.querySelector('.rail-shell')
    const top = (rail?.getBoundingClientRect().top ?? 0) + window.scrollY - spyOffset() + 8

    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    return
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* ----------------------------------------------------------------- scroll */

let frame = 0

function syncScrollState() {
  frame = 0

  const top = window.scrollY
  scrolled.value = top > 8

  const railTop = document.querySelector('.rail-shell')?.getBoundingClientRect().top ?? 0
  railStuck.value = railTop <= (document.querySelector('.main-header')?.offsetHeight ?? 62) + 1

  if (!spyLocked) {
    updateActiveSection()
  }
}

function onScroll() {
  if (frame) {
    return
  }

  frame = window.requestAnimationFrame(syncScrollState)
}

/* ----------------------------------------------------------------- search */

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
  if (!resource) {
    return
  }

  window.open(resource.url, '_blank', 'noopener,noreferrer')
  commandOpen.value = false
}

function openRandomResource() {
  if (allResources.value.length === 0) {
    return
  }

  openResource(allResources.value[Math.floor(Math.random() * allResources.value.length)])
}

function handleKeydown(event) {
  const target = event.target
  const typing =
    target instanceof HTMLElement &&
    (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    commandOpen.value = true
    return
  }

  if (event.key === 'Escape') {
    commandOpen.value = false
    return
  }

  if (event.key === '/' && !typing) {
    event.preventDefault()
    document.getElementById('nav-search-input')?.focus()
  }
}

function animateCountdown() {
  const total = springCountdown.value.days
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  if (reduce || total <= 0) {
    animatedDays.value = total
    return
  }

  const duration = 1100
  const start = performance.now()

  const step = (now) => {
    const progress = Math.min(1, (now - start) / duration)
    const eased = 1 - (1 - progress) ** 3

    animatedDays.value = Math.round(total * eased)

    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }

  window.requestAnimationFrame(step)
}

watch(commandOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  loadFavorites()
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)

  syncScrollState()
  window.requestAnimationFrame(() => {
    barsReady.value = true
    animateCountdown()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  window.clearTimeout(spyLockTimer)
  document.body.style.overflow = ''
  if (frame) {
    window.cancelAnimationFrame(frame)
  }
})
</script>

<template>
  <div class="page-shell">
    <header class="main-header" :class="{ 'is-scrolled': scrolled }">
      <nav class="main-nav shell-inner" aria-label="顶部导航">
        <a class="site-name" href="/" aria-label="T00ls-SceNav 首页">
          <img class="site-logo" src="/logo.webp" alt="" />
          <span>T00ls-SceNav</span>
        </a>

        <div class="nav-actions">
          <a
            class="icon-btn"
            href="https://memme.cn"
            target="_blank"
            rel="noreferrer noopener"
            title="前往 HelloMason 博客"
          >
            <TrainFront :size="20" />
            <span class="sr-only">HelloMason 博客</span>
          </a>

          <button
            class="icon-btn optional-action"
            type="button"
            title="随机打开一个入口"
            aria-label="随机打开一个入口"
            @click="openRandomResource"
          >
            <Shuffle :size="20" />
          </button>

          <button
            class="icon-btn"
            type="button"
            title="快捷搜索（Ctrl + K）"
            aria-label="快捷搜索"
            @click="commandOpen = true"
          >
            <Search :size="21" />
          </button>

          <button
            class="icon-btn optional-action"
            type="button"
            title="快捷面板（Ctrl + K）"
            aria-label="打开快捷面板"
            @click="commandOpen = true"
          >
            <Grid2X2 :size="20" />
          </button>
        </div>
      </nav>
    </header>

    <main>
      <section class="banner">
        <span class="banner-eyebrow">
          <Sparkles :size="14" />
          已收录 {{ allResources.length }} 个安全导航入口
        </span>

        <h1 class="banner-title">T00ls-SceNav <em>安全导航</em></h1>

        <p class="banner-sub">
          聚合安全社区、漏洞情报、资产测绘、在线工具与 SRC 众测入口，
          用最短的路径抵达你需要的资源。按 <kbd>/</kbd> 可快速聚焦搜索框。
        </p>

        <TopSearch
          v-model:query="searchText"
          v-model:engine="selectedEngineId"
          :engines="searchEngines"
          @open-palette="commandOpen = true"
          @submit="runExternalSearch"
        />

        <HitokotoLine />

        <p class="site-notice">
          <span class="dot" aria-hidden="true" />
          {{ siteNotice }}
        </p>
      </section>

      <div class="rail-shell" :class="{ 'is-stuck': railStuck }">
        <div class="rail shell-inner">
          <AppSidebar
            :active-section-id="activeSectionId"
            :sections="sectionMenu"
            @select-section="goToSection"
          />
        </div>
      </div>

      <div class="layout shell-inner">
        <div class="layout-main">
          <section v-if="displaySections.length === 0" class="empty-module">
            <strong>没有找到匹配的资源</strong>
            <span>试试更换关键词，或清空搜索框浏览全部导航入口。</span>
          </section>

          <ResourceSection
            v-for="section in displaySections"
            :key="section.id"
            :section="section"
            :favorites="favorites"
            @toggle-favorite="toggleFavorite"
          />

          <div class="mobile-aside-panel">
            <NewsPanel :feeds="securityFeeds" />
          </div>
        </div>

        <aside class="layout-aside">
          <NewsPanel :feeds="securityFeeds" />

          <section class="author-card">
            <div class="hello-pill">傍晚好，是时候放松一下了</div>
            <img class="author-avatar" src="/logo.webp" alt="HelloMason" />
            <div class="author-bottom">
              <div>
                <strong>HelloMason</strong>
                <span>T00ls-SceNav</span>
              </div>
              <div class="author-actions">
                <a
                  href="https://github.com/Mario-Call"
                  target="_blank"
                  rel="noreferrer noopener"
                  title="GitHub"
                >
                  <GitBranch :size="20" />
                </a>
                <a href="mailto:admin@memme.cn" title="邮件">
                  <Mail :size="20" />
                </a>
              </div>
            </div>
          </section>

          <section class="count-card">
            <div class="count-left">
              <span>距离</span>
              <strong>春节</strong>
              <b>{{ animatedDays }}</b>
              <small>{{ springCountdown.date }}</small>
            </div>
            <div class="count-bars">
              <div v-for="(row, index) in springCountdown.rows" :key="row.label" class="count-row">
                <span>{{ row.label }}</span>
                <div>
                  <i
                    :style="{
                      width: barsReady ? `${row.value}%` : '0%',
                      transitionDelay: `${index * 90}ms`,
                    }"
                  >
                    {{ row.value.toFixed(2) }}%
                  </i>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>

    <footer class="site-footer shell-inner">
      <span>Copyright © 2026 By Mason</span>
      <a href="https://memme.cn" target="_blank" rel="noreferrer noopener">友情链接 HelloMason</a>
    </footer>

    <BackToTop />

    <CommandPalette
      :is-open="commandOpen"
      :resources="allResources"
      @close="commandOpen = false"
      @open-resource="openResource"
    />
  </div>
</template>
