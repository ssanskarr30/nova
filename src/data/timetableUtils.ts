import type {
  Day,
  TimetableSession,
} from './timetable'

import {
  dayOrder,
  getSessionsForDay,
} from './timetable'

export interface TimetableOccurrence
  extends TimetableSession {
  occurrenceId: string
  date: string
}

export function getDayFromDate(date: Date): Day {
  const dayIndex = date.getDay()

  if (dayIndex === 0) return 'Sunday'
  if (dayIndex === 1) return 'Monday'
  if (dayIndex === 2) return 'Tuesday'
  if (dayIndex === 3) return 'Wednesday'
  if (dayIndex === 4) return 'Thursday'
  if (dayIndex === 5) return 'Friday'

  return 'Saturday'
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0')
  const day = String(
    date.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getSessionsForDate(
  date: Date,
): TimetableOccurrence[] {
  const day = getDayFromDate(date)
  const dateKey = formatDateKey(date)

  return getSessionsForDay(day).map((session) => ({
    ...session,
    date: dateKey,
    occurrenceId: `${dateKey}_${session.id}`,
  }))
}

export function getTodaySessions(
  date: Date = new Date(),
): TimetableOccurrence[] {
  return getSessionsForDate(date)
}

export function getSessionsForDayName(day: Day) {
  return getSessionsForDay(day)
}

export function getCurrentClass(
  date: Date = new Date(),
): TimetableOccurrence | null {
  const today = getSessionsForDate(date)

  const currentMinutes =
    date.getHours() * 60 +
    date.getMinutes()

  for (const session of today) {
    const [startHour, startMinute] =
      session.startTime.split(':').map(Number)

    const [endHour, endMinute] =
      session.endTime.split(':').map(Number)

    const start =
      startHour * 60 + startMinute

    const end =
      endHour * 60 + endMinute

    if (
      currentMinutes >= start &&
      currentMinutes < end
    ) {
      return session
    }
  }

  return null
}

export function getNextClass(
  date: Date = new Date(),
): TimetableOccurrence | null {
  const today = getSessionsForDate(date)

  const currentMinutes =
    date.getHours() * 60 +
    date.getMinutes()

  for (const session of today) {
    if (
      session.type === 'holiday' ||
      session.type === 'break'
    ) {
      continue
    }

    const [hour, minute] =
      session.startTime.split(':').map(Number)

    const startMinutes =
      hour * 60 + minute

    if (startMinutes > currentMinutes) {
      return session
    }
  }

  return null
}

export function formatTime(time: string) {
  const [hourString, minute] =
    time.split(':')

  const hour = Number(hourString)

  const period =
    hour >= 12 ? 'PM' : 'AM'

  const displayHour =
    hour % 12 === 0
      ? 12
      : hour % 12

  return `${displayHour}:${minute} ${period}`
}

export function getDayAbbreviation(
  day: Day,
) {
  const abbreviations: Record<
    Day,
    string
  > = {
    Monday: 'MON',
    Tuesday: 'TUE',
    Wednesday: 'WED',
    Thursday: 'THU',
    Friday: 'FRI',
    Saturday: 'SAT',
    Sunday: 'SUN',
  }

  return abbreviations[day]
}

export function getOrderedDays() {
  return dayOrder
}