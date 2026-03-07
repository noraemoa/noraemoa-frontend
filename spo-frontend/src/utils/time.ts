export function formatFeedTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()

  const diff = now.getTime() - date.getTime()

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return '방금 전'

  if (diff < hour) {
    return `${Math.floor(diff / minute)}분 전`
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}시간 전`
  }

  if (diff < day * 3) {
    return `${Math.floor(diff / day)}일 전`
  }

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')

  return `${y}-${m}-${d} ${h}:${min}`
}
