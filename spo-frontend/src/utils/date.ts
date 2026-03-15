import { MONTH_MAP } from '../features/dailyTrack/constants/dateMapping'
import type { Month } from '../types/calendar'

export type CalendarCell = {
  date: Date | null
  dateKey: string | null
  dayNumber: number | null
  isCurrentMonth: boolean
}

export function getMonthIndex(month: Month): number {
  return MONTH_MAP.indexOf(month)
}

export function getMonthLabel(month: Month): string {
  return `${getMonthIndex(month) + 1}월`
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function buildCalendarCells(year: number, month: Month): CalendarCell[] {
  const monthIndex = getMonthIndex(month)
  const firstDate = new Date(year, monthIndex, 1)
  const lastDate = new Date(year, monthIndex + 1, 0)

  const firstDay = firstDate.getDay() // 0: Sun, 6: Sat
  const daysInMonth = lastDate.getDate()

  const cells: CalendarCell[] = []

  for (let i = 0; i < firstDay; i += 1) {
    cells.push({
      date: null,
      dateKey: null,
      dayNumber: null,
      isCurrentMonth: false,
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, monthIndex, day)
    cells.push({
      date,
      dateKey: formatDateKey(date),
      dayNumber: day,
      isCurrentMonth: true,
    })
  }

  const remain = cells.length % 7
  const tailCount = remain === 0 ? 0 : 7 - remain

  for (let i = 0; i < tailCount; i += 1) {
    cells.push({
      date: null,
      dateKey: null,
      dayNumber: null,
      isCurrentMonth: false,
    })
  }

  return cells
}

export function getPrevYearMonth(year: number, month: Month) {
  const monthIndex = getMonthIndex(month)

  if (monthIndex === 0) {
    return {
      year: year - 1,
      month: MONTH_MAP[11],
    }
  }

  return {
    year,
    month: MONTH_MAP[monthIndex - 1],
  }
}

export function getNextYearMonth(year: number, month: Month) {
  const monthIndex = getMonthIndex(month)

  if (monthIndex === 11) {
    return {
      year: year + 1,
      month: MONTH_MAP[0],
    }
  }

  return {
    year,
    month: MONTH_MAP[monthIndex + 1],
  }
}

export function getTodayDate() {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `📅 ${year}.${month}.${day}`
}

export function formatDailyTrackDate(dateString: string) {
  const date = new Date(dateString)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}`
}

export function getYearMonth() {
  const today = new Date()

  const year = today.getFullYear()
  const month: Month = MONTH_MAP[today.getMonth()]

  return { year, month }
}
