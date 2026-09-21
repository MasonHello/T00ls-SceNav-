/**
 * Turns a `#rgb` / `#rrggbb` brand color into an `rgba()` string.
 * Falls back to the passed value when the input is not a plain hex color,
 * so CSS keywords and `rgb()` values still work.
 */
export function withAlpha(hex, alpha) {
  if (typeof hex !== 'string') {
    return `rgba(66, 90, 239, ${alpha})`
  }

  const raw = hex.trim().replace('#', '')

  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(raw)) {
    return hex
  }

  const full = raw.length === 3
    ? raw
        .split('')
        .map((char) => char + char)
        .join('')
    : raw

  const value = Number.parseInt(full, 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
