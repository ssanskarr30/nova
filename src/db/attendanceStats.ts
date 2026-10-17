
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
 * ONLY THEORY + PRACTICAL CLASSES COUNT.
 *
 * Activities, breaks, and other class types are excluded.
 * Cancelled + Holiday are NOT counted in totalClasses.
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

  const eligibleRecords =
    records.filter(
      (record) =>
        record.classType === 'theory' ||
        record.classType === 'practical',
    )

  const present =
    eligibleRecords.filter(
      (record) =>
        record.status === 'present',
    ).length

  const absent =
    eligibleRecords.filter(
      (record) =>
        record.status === 'absent',
    ).length

  const cancelled =
    eligibleRecords.filter(
      (record) =>
        record.status === 'cancelled',
    ).length

  const holiday =
    eligibleRecords.filter(
      (record) =>
        record.status === 'holiday',
    ).length

  const totalClasses =
    present + absent

  const percentage =
    totalClasses === 0
      ? null
      : (present / totalClasses) * 100

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
  percentage: number | null,
): number | null {

  if (
    percentage === null ||
    !Number.isFinite(percentage)
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
    totalClasses,
  } = stats

  if (totalClasses === 0) {
    return 0
  }

  /*
   * Compare using integers to avoid floating-point
   * precision problems around exactly 75%.
   */

  if (
    present * 4 >= totalClasses * 3
  ) {
    return 0
  }

  /*
   * (present + x) / (totalClasses + x) >= 3/4
   *
   * 4 * present + 4 * x >=
   * 3 * totalClasses + 3 * x
   *
   * x >= 3 * totalClasses - 4 * present
   */

  return Math.max(
    0,
    3 * totalClasses - 4 * present,
  )
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
    totalClasses,
  } = stats

  /*
   * No attendance yet.
   */

  if (totalClasses === 0) {
    return 0
  }

  /*
   * Below 75%.
   */

  if (
    present * 4 < totalClasses * 3
  ) {
    return 0
  }

  /*
   * present / (totalClasses + x) >= 3/4
   *
   * x <= (4 * present - 3 * totalClasses) / 3
   */

  return Math.max(
    0,
    Math.floor(
      (4 * present - 3 * totalClasses) / 3,
    ),
  )
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

  const {
    present,
    totalClasses,
    percentage,
  } = stats

  if (
    totalClasses === 0 ||
    percentage === null
  ) {
    return 'no-data'
  }

  /*
   * Use exact integer comparisons for the 75% boundary.
   */

  if (
    present * 4 < totalClasses * 3
  ) {
    return 'shortage'
  }

  if (
    present * 4 === totalClasses * 3
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
