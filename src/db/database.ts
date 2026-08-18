import Dexie, {
  type EntityTable,
} from 'dexie'


/* =====================================================
   ATTENDANCE
===================================================== */

export type AttendanceStatus =
  | 'present'
  | 'absent'
  | 'cancelled'
  | 'holiday'

export type ClassType =
  | 'theory'
  | 'practical'
  | 'activity'
  | 'break'
  | 'holiday'

export interface AttendanceRecord {
  id: string
  date: string
  sessionId: string
  subject: string
  subjectCode: string
  classType: ClassType
  batch?: 'A' | 'B' | 'C'
  status: AttendanceStatus
  createdAt: string
  updatedAt: string
}


/* =====================================================
   TASKS
===================================================== */

export interface TaskRecord {
  id: string
  title: string
  dueAt: string
  completed: boolean
  completedAt?: string
  createdAt: string
  updatedAt: string
  reminderSent: boolean
}


/* =====================================================
   FOCUS SESSIONS
===================================================== */

export interface FocusSessionRecord {
  id: string
  subject: string
  startedAt: string
  endedAt: string
  durationMs: number
}


/* =====================================================
   NOTES
===================================================== */

export interface NoteRecord {
  id: string

  title: string

  content: string

  createdAt: string

  updatedAt: string
}


/* =====================================================
   DATABASE
===================================================== */

class NovaDatabase extends Dexie {

  attendance!: EntityTable<
    AttendanceRecord,
    'id'
  >

  tasks!: EntityTable<
    TaskRecord,
    'id'
  >

  focusSessions!: EntityTable<
    FocusSessionRecord,
    'id'
  >

  notes!: EntityTable<
    NoteRecord,
    'id'
  >


  constructor() {
    super('NOVA')


    /* ===============================================
       VERSION 1
    =============================================== */

    this.version(1).stores({
      attendance:
        'id, date, sessionId, subjectCode, classType, [subjectCode+classType], status',
    })


    /* ===============================================
       VERSION 2
    =============================================== */

    this.version(2).stores({
      attendance:
        'id, date, sessionId, subjectCode, classType, [subjectCode+classType], status',

      tasks:
        'id, dueAt, completed, reminderSent',

      focusSessions:
        'id, startedAt, subject',
    })


    /* ===============================================
       VERSION 3
       
       NOTES
    =============================================== */

    this.version(3).stores({
      attendance:
        'id, date, sessionId, subjectCode, classType, [subjectCode+classType], status',

      tasks:
        'id, dueAt, completed, reminderSent',

      focusSessions:
        'id, startedAt, subject',

      notes:
        'id, updatedAt, createdAt',
    })
  }
}


/* =====================================================
   DATABASE INSTANCE
===================================================== */

export const db =
  new NovaDatabase()