export type AttendanceStatus =
  | 'present'
  | 'absent'
  | 'cancelled'
  | 'holiday'

export interface AttendanceRecord {
  occurrenceId: string
  date: string
  sessionId: string
  status: AttendanceStatus
  updatedAt: string
}

const STORAGE_KEY = 'nova-attendance-v1'

function loadRecords(): Record<string, AttendanceRecord> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return {}
    }

    return JSON.parse(saved) as Record<
      string,
      AttendanceRecord
    >
  } catch {
    return {}
  }
}

function saveRecords(
  records: Record<string, AttendanceRecord>,
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(records),
  )
}

export function getAttendanceRecord(
  occurrenceId: string,
): AttendanceRecord | null {
  const records = loadRecords()

  return records[occurrenceId] ?? null
}

export function getAttendanceStatus(
  occurrenceId: string,
): AttendanceStatus | null {
  return (
    getAttendanceRecord(occurrenceId)?.status ?? null
  )
}

export function setAttendance(
  occurrenceId: string,
  date: string,
  sessionId: string,
  status: AttendanceStatus,
) {
  const records = loadRecords()

  records[occurrenceId] = {
    occurrenceId,
    date,
    sessionId,
    status,
    updatedAt: new Date().toISOString(),
  }

  saveRecords(records)
}

export function removeAttendance(
  occurrenceId: string,
) {
  const records = loadRecords()

  delete records[occurrenceId]

  saveRecords(records)
}

export function getAllAttendance(): AttendanceRecord[] {
  return Object.values(loadRecords())
}