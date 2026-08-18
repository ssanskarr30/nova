export type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

export type SessionType =
  | 'theory'
  | 'practical'
  | 'activity'
  | 'break'
  | 'holiday'

export type PracticalBatch = 'A' | 'B' | 'C'

export interface TimetableSession {
  id: string
  day: Day
  startTime: string
  endTime: string
  subject: string
  code?: string
  type: SessionType
  batch?: PracticalBatch
  location?: string
  description?: string
}

/*
 * NOVA — Second Professional B.V.Sc. & A.H.
 *
 * Academic Session: 2026–27
 * Classes begin: 19 August 2026
 *
 * IMPORTANT:
 * Practical classes below are specifically for BATCH C.
 */

export const semesterInfo = {
  course: 'Second Professional B.V.Sc. & A.H.',
  academicSession: '2026–27',
  semesterStart: '2026-08-19',
  annualExamStart: '2027-06-21',
  annualExamEnd: '2027-07-31',
  nextAcademicSession: '2027-08-23',
  practicalBatch: 'C' as PracticalBatch,
}

export const timetable: TimetableSession[] = [
  // =========================
  // MONDAY
  // =========================

  {
    id: 'mon-ann-theory',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'Animal Nutrition',
    code: 'ANN',
    type: 'theory',
    location: 'Lecture Hall',
  },

  {
    id: 'mon-vbc-theory',
    day: 'Monday',
    startTime: '10:00',
    endTime: '11:00',
    subject: 'Veterinary Biochemistry',
    code: 'VBC',
    type: 'theory',
    location: 'Lecture Hall',
  },

  {
    id: 'mon-vmc-practical',
    day: 'Monday',
    startTime: '11:00',
    endTime: '13:00',
    subject: 'Veterinary Microbiology',
    code: 'VMC',
    type: 'practical',
    batch: 'C',
    location: 'Respective Department',
  },

  {
    id: 'mon-lunch',
    day: 'Monday',
    startTime: '13:00',
    endTime: '14:00',
    subject: 'Lunch Break',
    type: 'break',
  },

  {
    id: 'mon-library',
    day: 'Monday',
    startTime: '14:00',
    endTime: '15:00',
    subject: 'Library / Advisory',
    type: 'activity',
  },

  // =========================
  // TUESDAY
  // =========================

  {
    id: 'tue-ann-theory',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'Animal Nutrition',
    code: 'ANN',
    type: 'theory',
    location: 'Lecture Hall',
  },

  {
    id: 'tue-vbc-theory',
    day: 'Tuesday',
    startTime: '10:00',
    endTime: '11:00',
    subject: 'Veterinary Biochemistry',
    code: 'VBC',
    type: 'theory',
    location: 'Lecture Hall',
  },

  {
    id: 'tue-vpp-practical',
    day: 'Tuesday',
    startTime: '11:00',
    endTime: '13:00',
    subject: 'Veterinary Pathology',
    code: 'VPP',
    type: 'practical',
    batch: 'C',
    location: 'Respective Department',
  },

  {
    id: 'tue-lunch',
    day: 'Tuesday',
    startTime: '13:00',
    endTime: '14:00',
    subject: 'Lunch Break',
    type: 'break',
  },

  {
    id: 'tue-library',
    day: 'Tuesday',
    startTime: '14:00',
    endTime: '15:00',
    subject: 'Library / Advisory',
    type: 'activity',
  },

  // =========================
  // WEDNESDAY
  // =========================

  {
    id: 'wed-ann-theory',
    day: 'Wednesday',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'Animal Nutrition',
    code: 'ANN',
    type: 'theory',
    location: 'Lecture Hall',
  },

  {
    id: 'wed-vpp-theory',
    day: 'Wednesday',
    startTime: '10:00',
    endTime: '11:00',
    subject: 'Veterinary Pathology',
    code: 'VPP',
    type: 'theory',
    location: 'Lecture Hall',
  },

  {
    id: 'wed-ann-practical',
    day: 'Wednesday',
    startTime: '11:00',
    endTime: '13:00',
    subject: 'Animal Nutrition',
    code: 'ANN',
    type: 'practical',
    batch: 'C',
    location: 'Respective Department',
  },

  {
    id: 'wed-lunch',
    day: 'Wednesday',
    startTime: '13:00',
    endTime: '14:00',
    subject: 'Lunch Break',
    type: 'break',
  },

  {
    id: 'wed-library',
    day: 'Wednesday',
    startTime: '14:00',
    endTime: '15:00',
    subject: 'Library / Advisory',
    type: 'activity',
  },

  {
    id: 'wed-vbc-practical',
    day: 'Wednesday',
    startTime: '15:00',
    endTime: '17:00',
    subject: 'Veterinary Biochemistry',
    code: 'VBC',
    type: 'practical',
    batch: 'C',
    location: 'Respective Department',
  },

  // =========================
  // THURSDAY
  // =========================

  {
    id: 'thu-vmc-theory',
    day: 'Thursday',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'Veterinary Microbiology',
    code: 'VMC',
    type: 'theory',
    location: 'Lecture Hall',
  },

  {
    id: 'thu-vpp-theory',
    day: 'Thursday',
    startTime: '10:00',
    endTime: '11:00',
    subject: 'Veterinary Pathology',
    code: 'VPP',
    type: 'theory',
    location: 'Lecture Hall',
  },

  {
    id: 'thu-vmc-practical',
    day: 'Thursday',
    startTime: '11:00',
    endTime: '13:00',
    subject: 'Veterinary Microbiology',
    code: 'VMC',
    type: 'practical',
    batch: 'C',
    location: 'Respective Department',
  },

  {
    id: 'thu-lunch',
    day: 'Thursday',
    startTime: '13:00',
    endTime: '14:00',
    subject: 'Lunch Break',
    type: 'break',
  },

  {
    id: 'thu-agb-theory',
    day: 'Thursday',
    startTime: '14:00',
    endTime: '15:00',
    subject: 'Animal Genetics and Breeding',
    code: 'AGB',
    type: 'theory',
    location: 'Lecture Hall',
  },

  // =========================
  // FRIDAY
  // =========================

  {
    id: 'fri-vmc-theory',
    day: 'Friday',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'Veterinary Microbiology',
    code: 'VMC',
    type: 'theory',
    location: 'Lecture Hall',
  },

  {
    id: 'fri-vpp-theory',
    day: 'Friday',
    startTime: '10:00',
    endTime: '11:00',
    subject: 'Veterinary Pathology',
    code: 'VPP',
    type: 'theory',
    location: 'Lecture Hall',
  },

  {
    id: 'fri-vpp-practical',
    day: 'Friday',
    startTime: '11:00',
    endTime: '13:00',
    subject: 'Veterinary Pathology',
    code: 'VPP',
    type: 'practical',
    batch: 'C',
    location: 'Respective Department',
  },

  {
    id: 'fri-lunch',
    day: 'Friday',
    startTime: '13:00',
    endTime: '14:00',
    subject: 'Lunch Break',
    type: 'break',
  },

  {
    id: 'fri-agb-theory',
    day: 'Friday',
    startTime: '14:00',
    endTime: '15:00',
    subject: 'Animal Genetics and Breeding',
    code: 'AGB',
    type: 'theory',
    location: 'Lecture Hall',
  },

  {
    id: 'fri-ncc',
    day: 'Friday',
    startTime: '15:00',
    endTime: '17:00',
    subject: 'NCC / NSS',
    type: 'activity',
  },

  // =========================
  // SATURDAY
  // =========================

  {
    id: 'sat-vmc-theory',
    day: 'Saturday',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'Veterinary Microbiology',
    code: 'VMC',
    type: 'theory',
    location: 'Lecture Hall',
  },

  {
    id: 'sat-vpp-theory',
    day: 'Saturday',
    startTime: '10:00',
    endTime: '11:00',
    subject: 'Veterinary Pathology',
    code: 'VPP',
    type: 'theory',
    location: 'Lecture Hall',
  },

  {
    id: 'sat-agb-practical',
    day: 'Saturday',
    startTime: '11:00',
    endTime: '13:00',
    subject: 'Animal Genetics and Breeding',
    code: 'AGB',
    type: 'practical',
    batch: 'C',
    location: 'Respective Department',
  },

  {
    id: 'sat-lunch',
    day: 'Saturday',
    startTime: '13:00',
    endTime: '14:00',
    subject: 'Lunch Break',
    type: 'break',
  },

  {
    id: 'sat-agb-theory',
    day: 'Saturday',
    startTime: '14:00',
    endTime: '15:00',
    subject: 'Animal Genetics and Breeding',
    code: 'AGB',
    type: 'theory',
    location: 'Lecture Hall',
  },

  {
    id: 'sat-ncc',
    day: 'Saturday',
    startTime: '15:00',
    endTime: '17:00',
    subject: 'NCC / NSS',
    type: 'activity',
  },

  // =========================
  // SUNDAY
  // =========================

  {
    id: 'sun-holiday',
    day: 'Sunday',
    startTime: '00:00',
    endTime: '23:59',
    subject: 'Holiday',
    type: 'holiday',
  },
]

export const dayOrder: Day[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export function getSessionsForDay(day: Day) {
  return timetable.filter((session) => session.day === day)
}

export function getAcademicSessionsForDay(day: Day) {
  return getSessionsForDay(day).filter(
    (session) =>
      session.type === 'theory' ||
      session.type === 'practical',
  )
}