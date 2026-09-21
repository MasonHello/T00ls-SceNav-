/**
 * Downloads a local copy of every navigation target's own favicon.
 *
 *   node scripts/fetch-resource-icons.mjs          # only fetch what is missing
 *   node scripts/fetch-resource-icons.mjs --force  # re-fetch everything
 *
 * Icons land in public/icons/ and src/data/resourceIcons.js is regenerated from
 * whatever is on disk, so the app never depends on a third-party icon service at
 * runtime. Requires network access.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ICON_DIR = join(REPO, 'public', 'icons')
const NAV_FILE = join(REPO, 'src', 'data', 'navigation.js')
const MANIFEST_FILE = join(REPO, 'src', 'data', 'resourceIcons.js')

const FORCE = process.argv.includes('--force')
const CONCURRENCY = 6
const TIMEOUT = 15000
const MAX_BYTES = 300 * 1024
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

/** favicon.im answers with this generic glyph when it cannot find a real icon. */
const PROXY_PLACEHOLDER = 'fill="#808080"'

const IMAGE_TYPES = {
  ico: [0x00, 0x00, 0x01, 0x00],
  png: [0x89, 0x50, 0x4e, 0x47],
  jpg: [0xff, 0xd8, 0xff],
  gif: [0x47, 0x49, 0x46],
}

function sniff(buffer) {
  for (const [type, magic] of Object.entries(IMAGE_TYPES)) {
    if (magic.every((byte, i) => buffer[i] === byte)) return type
  }
  if (
    buffer.slice(0, 4).toString('latin1') === 'RIFF' &&
    buffer.slice(8, 12).toString('latin1') === 'WEBP'
  ) {
    return 'webp'
  }
  const head = buffer.slice(0, 400).toString('utf8').trim().toLowerCase()
  if (head.startsWith('<svg') || (head.startsWith('<?xml') && head.includes('<svg'))) {
    return 'svg'
  }
  return null
}

async function request(url, asText = false) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT)
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': UA,
        Accept: asText ? 'text/html,application/xhtml+xml,*/*;q=0.8' : 'image/*,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
    })
    if (!res.ok) return null
    if (asText) return await res.text()
    const buffer = Buffer.from(await res.arrayBuffer())
    if (!buffer.length || buffer.length > MAX_BYTES) return null
    return buffer
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

/** Bigger declared sizes win; apple-touch-icons are usually the crispest. */
function score(sizes, rel) {
  const numbers = [...String(sizes ?? '').matchAll(/(\d+)x(\d+)/gi)].map((m) => Number(m[1]))
  const base = /apple-touch/.test(rel) ? 45 : 0
  if (numbers.length) return base + Math.max(...numbers)
  return base + (String(sizes ?? '').includes('any') ? 60 : 12)
}

async function fetchIcon(entry) {
  const pageUrl = entry.url.startsWith('http') ? entry.url : `https://${entry.domain}/`
  const candidates = []

  const html = await request(pageUrl, true)
  if (html) {
    const declared = []
    for (const tag of html.matchAll(/<link\b[^>]*>/gi)) {
      const snippet = tag[0]
      const rel = (snippet.match(/rel\s*=\s*["']([^"']+)["']/i)?.[1] ?? '').toLowerCase()
      const href = snippet.match(/href\s*=\s*["']([^"']+)["']/i)?.[1]
      if (!href || !/icon/.test(rel)) continue
      declared.push({ href, score: score(snippet.match(/sizes\s*=\s*["']([^"']+)["']/i)?.[1], rel) })
    }
    declared.sort((a, b) => b.score - a.score)
    for (const item of declared.slice(0, 4)) {
      try {
        candidates.push(new URL(item.href, pageUrl).href)
      } catch {
        /* ignore malformed hrefs */
      }
    }
  }

  try {
    candidates.push(new URL('/favicon.ico', new URL(pageUrl).origin).href)
  } catch {
    candidates.push(`https://${entry.domain}/favicon.ico`)
  }

  for (const url of [...new Set(candidates)]) {
    const buffer = await request(url)
    const type = buffer && sniff(buffer)
    if (type) return { buffer, type, source: url }
  }

  // Some hosts block direct requests; a proxy still returns the site's own icon.
  for (const url of [
    `https://favicon.im/${entry.domain}?larger=true`,
    `https://icon.horse/icon/${entry.domain}`,
  ]) {
    const buffer = await request(url)
    if (!buffer || buffer.toString('utf8').includes(PROXY_PLACEHOLDER)) continue
    const type = buffer && sniff(buffer)
    if (type) return { buffer, type, source: `${url} (proxy)`, proxy: true }
  }

  return null
}

/* ------------------------------------------------------------------ main */

const nav = readFileSync(NAV_FILE, 'utf8')
const wanted = new Map()

for (const match of nav.matchAll(/resource\(\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'/g)) {
  wanted.set(match[3], { domain: match[3], url: match[2], title: match[1] })
}

// search-engine chips reuse the same icon store
for (const match of nav.matchAll(/action:\s*'(https?:\/\/[^']+)'/g)) {
  try {
    const host = new URL(match[1]).hostname.replace(/^www\./, '')
    if (!wanted.has(host)) wanted.set(host, { domain: host, url: `https://${host}/`, title: host })
  } catch {
    /* ignore */
  }
}

mkdirSync(ICON_DIR, { recursive: true })

const present = new Set(
  readdirSync(ICON_DIR).map((name) => name.replace(/\.[a-z0-9]+$/i, '')),
)

const queue = [...wanted.values()].filter((entry) => FORCE || !present.has(entry.domain))
console.log(`${wanted.size} domains, ${queue.length} to fetch`)

let cursor = 0
const fetched = []
const failed = []

async function worker() {
  while (cursor < queue.length) {
    const entry = queue[cursor]
    cursor += 1
    const icon = await fetchIcon(entry)

    if (!icon) {
      failed.push(entry.domain)
      console.log(`  fail  ${entry.domain}`)
      continue
    }

    const file = `${entry.domain}.${icon.type}`
    writeFileSync(join(ICON_DIR, file), icon.buffer)
    fetched.push({ domain: entry.domain, file, proxy: icon.proxy })
    console.log(`  ok    ${entry.domain.padEnd(26)} ${icon.type.padEnd(4)} ${String(icon.buffer.length).padStart(7)}B  ${icon.source}`)
  }
}

await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length || 1) }, worker))

/* --------------------------------------------------- regenerate manifest */

const manifest = {}
const problems = []

for (const name of readdirSync(ICON_DIR).sort()) {
  const full = join(ICON_DIR, name)
  const buffer = readFileSync(full)
  const domain = name.replace(/\.[a-z0-9]+$/i, '')
  const type = sniff(buffer)
  const ext = name.split('.').pop().toLowerCase()

  if (!type) problems.push(`${name}: not a recognised image`)
  else if (ext !== type && !(type === 'jpg' && ext === 'jpeg')) {
    problems.push(`${name}: extension .${ext} but content is ${type}`)
  }
  if (!wanted.has(domain)) problems.push(`${name}: no matching navigation domain`)

  manifest[domain] = `/icons/${name}`
}

const missing = [...wanted.keys()].filter((domain) => !manifest[domain])
const body = Object.keys(manifest)
  .sort()
  .map((domain) => `  '${domain}': '${manifest[domain]}',`)
  .join('\n')

writeFileSync(
  MANIFEST_FILE,
  `// Generated by scripts/fetch-resource-icons.mjs — do not edit by hand.\n` +
    `// A local copy of each navigation target's own favicon, so the grid never\n` +
    `// depends on a third-party icon service at runtime. Regenerate after adding\n` +
    `// resources, or after a site changes its icon.\n` +
    `export const resourceIcons = {\n${body}\n}\n`,
)

const total = readdirSync(ICON_DIR).reduce((sum, n) => sum + statSync(join(ICON_DIR, n)).size, 0)

console.log(
  `\nicons: ${Object.keys(manifest).length}  total: ${(total / 1024).toFixed(1)} KB  ` +
    `regenerated src/data/resourceIcons.js`,
)
if (fetched.some((f) => f.proxy)) {
  console.log(
    'via proxy (source host unreachable):',
    fetched.filter((f) => f.proxy).map((f) => f.domain).join(', '),
  )
}
if (missing.length) console.log('MISSING:', missing.join(', '))
if (problems.length) console.log('PROBLEMS:\n  ' + problems.join('\n  '))
if (failed.length) console.log('FAILED:', failed.join(', '))
process.exit(missing.length || problems.length ? 1 : 0)
