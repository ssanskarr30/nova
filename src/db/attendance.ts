import { db } from './database'

import type {
  AttendanceRecord,
  AttendanceStatus,
  ClassType,
} from './database'

import type {
  TimetableOccurrence,
} from '../data/timetableUtils'


/* =====================================================
   GET ONE ATTENDANCE RECORD
===================================================== */

export async function getAttendanceRecord(
  occurrenceId: string,
): Promise<AttendanceRecord | null> {
  const record =
    await db.attendance.get(
      occurrenceId,
    )

  return record ?? null
}


/* =====================================================
   GET ATTENDANCE STATUS
===================================================== */

export async function getAttendanceStatus(
  occurrenceId: string,
): Promise<AttendanceStatus | null> {
  const record =
    await getAttendanceRecord(
      occurrenceId,
    )

  return record?.status ?? null
}


/* =====================================================
   SAVE / UPDATE ATTENDANCE
===================================================== */

export async function setAttendance(
  session: TimetableOccurrence,
  status: AttendanceStatus,
) {
  const now =
    new Date().toISOString()

  const existing =
    await db.attendance.get(
      session.occurrenceId,
    )

  const record: AttendanceRecord = {
    id: session.occurrenceId,

    date: session.date,

    sessionId: session.id,

    subject: session.subject,

    subjectCode:
      session.code ?? '',

    classType:
      session.type as ClassType,

    ...(session.batch
      ? {
          batch: session.batch as
            | 'A'
            | 'B'
            | 'C',
        }
      : {}),

    status,

    createdAt:
      existing?.createdAt ?? now,

    updatedAt: now,
  }

  await db.attendance.put(
    record,
  )
}


/* =====================================================
   DELETE ATTENDANCE
===================================================== */

export async function removeAttendance(
  occurrenceId: string,
) {
  await db.attendance.delete(
    occurrenceId,
  )
}


/* =====================================================
   GET ALL ATTENDANCE
===================================================== */

export async function getAllAttendance() {
  return db.attendance.toArray()
}


/* =====================================================
   GET ATTENDANCE FOR A DATE
===================================================== */

export async function getAttendanceForDate(
  date: string,
) {
  return db.attendance
    .where('date')
    .equals(date)
    .toArray()
}


/* =====================================================
   GET ATTENDANCE FOR A SUBJECT
===================================================== */

export async function getAttendanceForSubject(
  subjectCode: string,
) {
  return db.attendance
    .where('subjectCode')
    .equals(subjectCode)
    .toArray()
}


/* =====================================================
   GET ATTENDANCE FOR A SUBJECT + TYPE
===================================================== */

export async function getAttendanceForSubjectType(
  subjectCode: string,
  classType: 'theory' | 'practical',
) {
  return db.attendance
    .where('[subjectCode+classType]')
    .equals([
      subjectCode,
      classType,
    ])
    .toArray()
}

/* =====================================================
   CLEAR ALL ATTENDANCE
===================================================== */

export async function clearAllAttendance() {
  await db.attendance.clear()
}