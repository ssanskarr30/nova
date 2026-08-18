import type {
  AttendanceRecord,
} from './database'


export interface AttendanceStats {
  present: number
  absent: number
  cancelled: number
  holiday: number
  totalClasses: number
  percentage: number | null
}


/*
 * =====================================================
 * BASIC ATTENDANCE CALCULATION
 *
 * Cancelled + Holiday are NOT counted.
 *
 * Attendance =
 *
 * Present
 * ───────────────── × 100
 * Present + Absent
 * =====================================================
 */

export function calculateAttendance(
  records: AttendanceRecord[],
): AttendanceStats {

  const present =
    records.filter(
      (record) =>
        record.status ===
        'present',
    ).length

  const absent =
    records.filter(
      (record) =>
        record.status ===
        'absent',
    ).length

  const cancelled =
    records.filter(
      (record) =>
        record.status ===
        'cancelled',
    ).length

  const holiday =
    records.filter(
      (record) =>
        record.status ===
        'holiday',
    ).length

  const totalClasses =
    present + absent

  const percentage =
    totalClasses === 0
      ? null
      : (present /
          totalClasses) *
        100

  return {
    present,
    absent,
    cancelled,
    holiday,
    totalClasses,
    percentage,
  }
}


/*
 * =====================================================
 * ROUND PERCENTAGE
 * =====================================================
 */

export function roundPercentage(
  percentage:
    | number
    | null,
): number | null {

  if (
    percentage === null
  ) {
    return null
  }

  return Math.round(
    percentage * 10,
  ) / 10
}


/*
 * =====================================================
 * CLASSES NEEDED TO REACH 75%
 *
 * Example:
 *
 * Present = 8
 * Absent = 4
 *
 * Current = 66.7%
 *
 * Need:
 *
 * (8 + x) / (12 + x) >= 0.75
 *
 * x = 4
 * =====================================================
 */

export function classesNeededFor75(
  stats: AttendanceStats,
): number {

  const {
    present,
    absent,
  } = stats

  const total =
    present + absent

  /*
   * Already at or above 75%.
   */

  if (
    total === 0 ||
    present / total >= 0.75
  ) {
    return 0
  }

  let classes = 0

  while (
    (present + classes) /
      (total + classes) <
    0.75
  ) {
    classes += 1
  }

  return classes
}


/*
 * =====================================================
 * CLASSES THAT CAN BE MISSED
 *
 * Example:
 *
 * Present = 17
 * Absent = 3
 *
 * 17 / 20 = 85%
 *
 * Can miss 2:
 *
 * 17 / 22 = 77.3%
 *
 * Cannot miss 3:
 *
 * 17 / 23 = 73.9%
 * =====================================================
 */

export function classesCanMissAt75(
  stats: AttendanceStats,
): number {

  const {
    present,
    absent,
  } = stats

  const total =
    present + absent

  /*
   * No attendance yet.
   */

  if (
    total === 0
  ) {
    return 0
  }

  /*
   * Below 75%.
   */

  if (
    present / total < 0.75
  ) {
    return 0
  }

  let classes = 0

  while (
    present /
      (total + classes + 1) >=
    0.75
  ) {
    classes += 1
  }

  return classes
}


/*
 * =====================================================
 * 75% STATUS
 * =====================================================
 */

export type AttendanceSafety =
  | 'no-data'
  | 'shortage'
  | 'minimum'
  | 'safe'


export function getAttendanceSafety(
  stats: AttendanceStats,
): AttendanceSafety {

  if (
    stats.totalClasses === 0
  ) {
    return 'no-data'
  }

  if (
    stats.percentage === null
  ) {
    return 'no-data'
  }

  if (
    stats.percentage < 75
  ) {
    return 'shortage'
  }

  if (
    stats.percentage === 75
  ) {
    return 'minimum'
  }

  return 'safe'
}


/*
 * =====================================================
 * SUBJECT 75% INFORMATION
 * =====================================================
 */

export interface AttendanceTarget {
  safety: AttendanceSafety
  classesNeeded: number
  classesCanMiss: number
}


export function getAttendanceTarget(
  stats: AttendanceStats,
): AttendanceTarget {

  const safety =
    getAttendanceSafety(
      stats,
    )

  return {
    safety,

    classesNeeded:
      classesNeededFor75(
        stats,
      ),

    classesCanMiss:
      classesCanMissAt75(
        stats,
      ),
  }
}