import { useMemo, useState } from 'react'

import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  TrendingUp,
} from 'lucide-react'

import { useLiveQuery } from 'dexie-react-hooks'

import { db } from '../db/database'

import type { AttendanceRecord } from '../db/database'

import {
  calculateAttendance,
  getAttendanceTarget,
  roundPercentage,
} from '../db/attendanceStats'

/* =====================================================
   DATE HELPERS
===================================================== */

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`)

  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatShortDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`)

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })
}

function formatMonth(dateString: string) {
  const date = new Date(`${dateString}-01T00:00:00`)

  return date.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  })
}

function getMonthKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${year}-${month}`
}

/* =====================================================
   ATTENDANCE PAGE
===================================================== */

function Attendance() {
  /*
   * Load every attendance record from IndexedDB.
   * This query remains live, so the page updates when
   * attendance is marked, edited, or removed.
   *
   * No records are deleted or modified by this page.
   */

  const attendanceQuery = useLiveQuery(
    () =>
      db.attendance
        .orderBy('date')
        .reverse()
        .toArray(),
    [],
  )

  const records: AttendanceRecord[] = attendanceQuery ?? []

  /* ===================================================
     SELECTED MONTH
  =================================================== */

  const [selectedMonth, setSelectedMonth] = useState(
    getMonthKey(new Date()),
  )

  /* ===================================================
     EXPANDED SUBJECT
  =================================================== */

  const [expandedSubject, setExpandedSubject] = useState<
    string | null
  >(null)

  /* ===================================================
     MONTHLY SUMMARY

     calculateAttendance in attendanceStats.ts should
     count only theory and practical classes.
  =================================================== */

  const monthlyRecords = useMemo(
    () =>
      records.filter((record) =>
        record.date.startsWith(selectedMonth),
      ),
    [records, selectedMonth],
  )

  const monthlyStats = useMemo(
    () => calculateAttendance(monthlyRecords),
    [monthlyRecords],
  )

  /* ===================================================
     SUBJECT LIST

     Use ALL records so subjects remain visible even
     when the selected month has no attendance.
  =================================================== */

  const subjects = useMemo(() => {
    const subjectMap = new Map<
      string,
      { code: string; subject: string }
    >()

    records.forEach((record) => {
      if (!record.subjectCode) return

      if (!subjectMap.has(record.subjectCode)) {
        subjectMap.set(record.subjectCode, {
          code: record.subjectCode,
          subject: record.subject,
        })
      }
    })

    return Array.from(subjectMap.values()).sort((a, b) =>
      a.subject.localeCompare(b.subject),
    )
  }, [records])

  /* ===================================================
     SUBJECT RECORDS

     All-time records and selected-month records are
     kept separate to avoid mixing percentages.
  =================================================== */

  function getSubjectRecords(code: string) {
    return records.filter(
      (record) => record.subjectCode === code,
    )
  }

  function getMonthlySubjectRecords(code: string) {
    return records.filter(
      (record) =>
        record.subjectCode === code &&
        record.date.startsWith(selectedMonth),
    )
  }

  /* ===================================================
     SUBJECT STATISTICS

     Overall:
       All theory + practical records across all months.

     Monthly:
       Theory + practical records for selected month.

     Theory:
       All-time theory attendance.

     Practical:
       All-time practical attendance.

     Monthly theory / practical:
       Separate breakdown for selected month.
  =================================================== */

  function getSubjectStats(code: string) {
    const subjectRecords = getSubjectRecords(code)

    const monthlySubjectRecords =
      getMonthlySubjectRecords(code)

    const theoryRecords = subjectRecords.filter(
      (record) => record.classType === 'theory',
    )

    const practicalRecords = subjectRecords.filter(
      (record) => record.classType === 'practical',
    )

    const monthlyTheoryRecords = monthlySubjectRecords.filter(
      (record) => record.classType === 'theory',
    )

    const monthlyPracticalRecords = monthlySubjectRecords.filter(
      (record) => record.classType === 'practical',
    )

    return {
      overall: calculateAttendance(subjectRecords),

      monthly: calculateAttendance(monthlySubjectRecords),

      theory: calculateAttendance(theoryRecords),

      practical: calculateAttendance(practicalRecords),

      monthlyTheory: calculateAttendance(monthlyTheoryRecords),

      monthlyPractical: calculateAttendance(monthlyPracticalRecords),
    }
  }

  /* ===================================================
     RENDER
  =================================================== */

  return (
    <div className="page attendance-page">
      <header className="page-header attendance-page-header">
        <div>
          <p className="eyebrow">
            SECOND PROFESSIONAL • BATCH C
          </p>

          <h1>Attendance</h1>

          <p className="attendance-header-subtitle">
            Track every theory and practical class.
          </p>
        </div>

        <div className="attendance-header-icon">
          <TrendingUp size={20} />
        </div>
      </header>

      {/* MONTH SELECTOR */}

      <section className="attendance-month-card">
        <div className="month-card-icon">
          <CalendarDays size={19} />
        </div>

        <div className="month-card-content">
          <span className="section-overline">
            SELECTED MONTH
          </span>

          <strong>{formatMonth(selectedMonth)}</strong>

          <span>
            {monthlyStats.present} present ·{' '}
            {monthlyStats.absent} absent
          </span>
        </div>

        <select
          value={selectedMonth}
          onChange={(event) =>
            setSelectedMonth(event.target.value)
          }
          className="month-select"
          aria-label="Select attendance month"
        >
          {getAvailableMonths(records).map((month) => (
            <option key={month} value={month}>
              {formatMonth(month)}
            </option>
          ))}
        </select>
      </section>

      {/* SUBJECT-WISE ATTENDANCE */}

      <section className="attendance-subject-section">
        <div className="attendance-section-heading">
          <div>
            <span className="section-overline">
              SUBJECT-WISE
            </span>

            <h2>Attendance</h2>
          </div>

          <span className="subject-count">
            {subjects.length}
          </span>
        </div>

        {records.length === 0 ? (
          <div className="attendance-empty">
            <div className="attendance-empty-icon">
              <CalendarDays size={23} />
            </div>

            <h3>No attendance recorded</h3>

            <p>
              Mark your theory and practical classes
              from the timetable to see your attendance
              here.
            </p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="attendance-empty">
            <div className="attendance-empty-icon">
              <CalendarDays size={23} />
            </div>

            <h3>No subject codes found</h3>

            <p>
              Saved attendance records do not contain
              subject codes, so subject-wise statistics
              cannot be grouped reliably.
            </p>
          </div>
        ) : (
          <div className="attendance-subject-list">
            {subjects.map((subject) => {
              const stats = getSubjectStats(subject.code)

              /*
               * The combined 75% target uses all-time
               * theory + practical attendance.
               */

              const target = getAttendanceTarget(
                stats.overall,
              )

              const subjectRecords =
                getSubjectRecords(subject.code)

              const isExpanded =
                expandedSubject === subject.code

              return (
                <SubjectCard
                  key={subject.code}
                  subject={subject}
                  stats={stats}
                  target={target}
                  expanded={isExpanded}
                  onToggle={() =>
                    setExpandedSubject(
                      isExpanded ? null : subject.code,
                    )
                  }
                  records={subjectRecords}
                  selectedMonth={selectedMonth}
                />
              )
            })}
          </div>
        )}
      </section>

      {/* RECENT HISTORY */}

      {records.length > 0 && (
        <section className="attendance-history-section">
          <div className="attendance-section-heading">
            <div>
              <span className="section-overline">
                RECENT ACTIVITY
              </span>

              <h2>Attendance History</h2>
            </div>
          </div>

          <RecentHistory records={records} />
        </section>
      )}
    </div>
  )
}

/* =====================================================
   SUBJECT CARD
===================================================== */

function SubjectCard({
  subject,
  stats,
  target,
  expanded,
  onToggle,
  records,
  selectedMonth,
}: {
  subject: {
    code: string
    subject: string
  }

  stats: {
    overall: ReturnType<typeof calculateAttendance>
    monthly: ReturnType<typeof calculateAttendance>
    theory: ReturnType<typeof calculateAttendance>
    practical: ReturnType<typeof calculateAttendance>
    monthlyTheory: ReturnType<typeof calculateAttendance>
    monthlyPractical: ReturnType<typeof calculateAttendance>
  }

  target: ReturnType<typeof getAttendanceTarget>
  expanded: boolean
  onToggle: () => void
  records: AttendanceRecord[]
  selectedMonth: string
}) {
  /*
   * Main percentage = all recorded months.
   */

  const overallPercentage = stats.overall.percentage

  /*
   * Monthly percentage = selected month only.
   */

  const monthlyPercentage = stats.monthly.percentage

  return (
    <article
      className={`attendance-subject-card ${
        expanded ? 'expanded' : ''
      }`}
    >
      {/* SUBJECT HEADER: OVERALL PERCENTAGE */}

      <button
        type="button"
        className="attendance-subject-button"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <div className="attendance-subject-main">
          <div className="attendance-subject-title">
            <h3>{subject.subject}</h3>

            <span className="attendance-subject-code">
              {subject.code}
            </span>
          </div>

          <div className="subject-progress-track">
            <div
              className={`subject-progress-fill ${target.safety}`}
              style={{
                width: `${Math.min(
                  overallPercentage ?? 0,
                  100,
                )}%`,
              }}
            />

            <div
              className="subject-target-line"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="attendance-subject-percentage">
          <strong>
            {overallPercentage === null
              ? '—'
              : `${roundPercentage(overallPercentage)}%`}
          </strong>

          <span className="attendance-expand-icon">
            {expanded ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </span>
        </div>
      </button>

      {/* SELECTED MONTH COMBINED SUMMARY */}

      <div className="subject-month-summary">
        <div>
          <span>
            {formatMonth(selectedMonth)} · Combined
          </span>

          <strong>
            {stats.monthly.present} /{' '}
            {stats.monthly.totalClasses}
          </strong>
        </div>

        <span className="subject-month-label">
          {monthlyPercentage === null
            ? 'No theory or practical attendance this month'
            : `${roundPercentage(monthlyPercentage)}% this month`}
        </span>
      </div>

      {/* SELECTED-MONTH THEORY / PRACTICAL BREAKDOWN */}

      <div className="subject-type-grid">
        <MonthlyTypeAttendance
          label="Theory this month"
          stats={stats.monthlyTheory}
        />

        <MonthlyTypeAttendance
          label="Practical this month"
          stats={stats.monthlyPractical}
        />
      </div>

      {/* OVERALL THEORY / PRACTICAL BREAKDOWN */}

      <div className="subject-type-grid">
        <TypeAttendance
          label="Theory · Overall"
          stats={stats.theory}
        />

        <TypeAttendance
          label="Practical · Overall"
          stats={stats.practical}
        />
      </div>

      {/* OVERALL COMBINED 75% SAFETY */}

      <AttendanceSafetyMessage target={target} />

      {/* EXPANDED ALL-TIME HISTORY */}

      {expanded && (
        <div className="subject-history">
          <div className="subject-history-header">
            <div>
              <span className="section-overline">
                HISTORY
              </span>

              <strong>All recorded classes</strong>
            </div>

            <span>{records.length}</span>
          </div>

          {records.length === 0 ? (
            <p className="no-history">
              No attendance recorded.
            </p>
          ) : (
            <div className="subject-history-list">
              {records
                .slice()
                .sort((a, b) =>
                  b.date.localeCompare(a.date),
                )
                .map((record) => (
                  <div
                    key={record.id}
                    className="history-row"
                  >
                    <div className="history-date-block">
                      <strong>
                        {formatDate(record.date)}
                      </strong>

                      <span>
                        {record.classType === 'practical'
                          ? 'Practical'
                          : record.classType === 'theory'
                            ? 'Theory'
                            : record.classType}

                        {record.batch
                          ? ` • Batch ${record.batch}`
                          : ''}
                      </span>
                    </div>

                    <span
                      className={`history-status ${record.status}`}
                    >
                      {record.status === 'present' &&
                        '✓ Present'}

                      {record.status === 'absent' &&
                        '✕ Absent'}

                      {record.status === 'cancelled' &&
                        '⊘ Cancelled'}

                      {record.status === 'holiday' &&
                        '○ Holiday'}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </article>
  )
}

/* =====================================================
   OVERALL THEORY / PRACTICAL CARD

   Each card gets its own independent 75% target.
===================================================== */

function TypeAttendance({
  label,
  stats,
}: {
  label: string
  stats: ReturnType<typeof calculateAttendance>
}) {
  const target = getAttendanceTarget(stats)
  const percentage = stats.percentage

  return (
    <div className="attendance-type-card">
      <div className="attendance-type-top">
        <span>{label}</span>

        <strong>
          {percentage === null
            ? '—'
            : `${roundPercentage(percentage)}%`}
        </strong>
      </div>

      <div className="attendance-type-count">
        <span>{stats.present} present</span>
        <span>{stats.absent} absent</span>
      </div>

      {stats.totalClasses === 0 ? (
        <span className="attendance-type-safety">
          No classes marked
        </span>
      ) : (
        <span
          className={`attendance-type-safety ${target.safety}`}
        >
          {target.safety === 'shortage' &&
            `Attend ${target.classesNeeded} more`}

          {target.safety === 'minimum' &&
            'At 75% minimum'}

          {target.safety === 'safe' &&
            `Can miss ${target.classesCanMiss}`}
        </span>
      )}
    </div>
  )
}

/* =====================================================
   MONTHLY THEORY / PRACTICAL SUMMARY

   Shows the selected month's figures only.
   The overall 75% target is displayed separately.
===================================================== */

function MonthlyTypeAttendance({
  label,
  stats,
}: {
  label: string
  stats: ReturnType<typeof calculateAttendance>
}) {
  const percentage = stats.percentage

  return (
    <div className="attendance-type-card">
      <div className="attendance-type-top">
        <span>{label}</span>

        <strong>
          {percentage === null
            ? '—'
            : `${roundPercentage(percentage)}%`}
        </strong>
      </div>

      <div className="attendance-type-count">
        <span>{stats.present} present</span>
        <span>{stats.absent} absent</span>
      </div>

      {stats.totalClasses === 0 && (
        <span className="attendance-type-safety">
          No classes marked
        </span>
      )}
    </div>
  )
}

/* =====================================================
   75% SAFETY MESSAGE

   This message represents combined overall attendance
   for the subject: theory + practical across all months.
===================================================== */

function AttendanceSafetyMessage({
  target,
}: {
  target: ReturnType<typeof getAttendanceTarget>
}) {
  if (target.safety === 'no-data') {
    return null
  }

  if (target.safety === 'shortage') {
    return (
      <div className="attendance-safety-message shortage">
        <div className="safety-message-icon">
          <AlertTriangle size={16} />
        </div>

        <div>
          <strong>Overall attendance shortage</strong>

          <p>
            Based on combined overall attendance, attend your
            next <b>{target.classesNeeded}</b>{' '}
            {target.classesNeeded === 1
              ? 'class'
              : 'classes'} consecutively to reach 75%.
          </p>
        </div>
      </div>
    )
  }

  if (target.safety === 'minimum') {
    return (
      <div className="attendance-safety-message minimum">
        <div className="safety-message-icon">
          <CircleAlert size={16} />
        </div>

        <div>
          <strong>You're at the 75% minimum</strong>

          <p>
            Your combined overall attendance is exactly 75%.
            Avoid missing classes to stay at or above 75%.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="attendance-safety-message safe">
      <div className="safety-message-icon">
        <Check size={16} />
      </div>

      <div>
        <strong>Combined attendance is safe</strong>

        <p>
          Based on combined overall attendance, you can miss{' '}
          <b>{target.classesCanMiss}</b>{' '}
          {target.classesCanMiss === 1
            ? 'class'
            : 'classes'} and still stay at 75%.
        </p>
      </div>
    </div>
  )
}

/* =====================================================
   RECENT HISTORY
===================================================== */

function RecentHistory({
  records,
}: {
  records: AttendanceRecord[]
}) {
  const grouped = new Map<string, AttendanceRecord[]>()

  records.forEach((record) => {
    const existing = grouped.get(record.date) ?? []

    existing.push(record)
    grouped.set(record.date, existing)
  })

  const dates = Array.from(grouped.keys())
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 5)

  return (
    <div className="recent-history">
      {dates.map((date) => {
        const dayRecords = grouped.get(date) ?? []

        /*
         * calculateAttendance counts only theory and
         * practical records when attendanceStats.ts
         * applies the class-type filter.
         */

        const stats = calculateAttendance(dayRecords)

        return (
          <div
            key={date}
            className="recent-history-day"
          >
            <div className="recent-history-date">
              <strong>{formatShortDate(date)}</strong>

              <span>
                {stats.present} / {stats.totalClasses}
                {' attended'}
              </span>
            </div>

            <div className="recent-history-statuses">
              {dayRecords.map((record) => (
                <span
                  key={record.id}
                  className={`history-mini-status ${record.status}`}
                  title={`${record.subject} · ${record.classType}`}
                >
                  {record.status === 'present' && '✓'}
                  {record.status === 'absent' && '✕'}
                  {record.status === 'cancelled' && '⊘'}
                  {record.status === 'holiday' && '○'}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* =====================================================
   AVAILABLE MONTHS
===================================================== */

function getAvailableMonths(
  records: AttendanceRecord[],
): string[] {
  const months = new Set<string>()

  records.forEach((record) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(record.date)) {
      months.add(record.date.slice(0, 7))
    }
  })

  // Always include the current month.
  months.add(getMonthKey(new Date()))

  return Array.from(months).sort((a, b) =>
    b.localeCompare(a),
  )
}

export default Attendance