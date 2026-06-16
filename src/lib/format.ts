export function secondsToTimestamp(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`
  }

  return `${minutes}:${pad(seconds)}`
}

export function timestampUrl(url: string, startSec?: number) {
  if (typeof startSec !== 'number') {
    return url
  }

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}t=${startSec}s`
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function pad(value: number) {
  return value.toString().padStart(2, '0')
}
