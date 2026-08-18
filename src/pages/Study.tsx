import {
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
} from 'lucide-react'

import {
  useLiveQuery,
} from 'dexie-react-hooks'

import {
  db,
} from '../db/database'

import {
  setAttendance,
  removeAttendance,
} from '../db/attendance'

import type {
  AttendanceStatus,
} from '../db/database'

import type {
  Day,
} from '../data/timetable'

import {
  getSessionsForDate,
  getCurrentClass,
  getNextClass,
  getDayFromDate,
  getDayAbbreviation,
  formatTime,
  formatDateKey,
} from '../data/timetableUtils'

import AttendanceModal from '../components/AttendanceModal'


const days: Day[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]


function Study() {

  /* =====================================================
     CURRENT DATE
  ===================================================== */

  const todayDate =
    new Date()

  const today =
    getDayFromDate(
      todayDate,
    )


  /* =====================================================
     SELECTED DAY
  ===================================================== */

  const [
    selectedDay,
    setSelectedDay,
  ] = useState<Day>(
    today,
  )

  const [
    selectedDate,
    setSelectedDate,
  ] = useState<Date>(
    todayDate,
  )

  const dateInputRef =
  useRef<HTMLInputElement | null>(
    null,
  )

  function handleDateChange(
  event: React.ChangeEvent<HTMLInputElement>,
) {
  const value = event.target.value

  if (!value) {
    return
  }

  const date =
    new Date(
      `${value}T00:00:00`,
    )

  setSelectedDate(date)

  setSelectedDay(
    getDayFromDate(date),
  )
}


  /* =====================================================
     SELECTED SESSION
  ===================================================== */

  const [
    selectedSessionId,
    setSelectedSessionId,
  ] = useState<
    string | null
  >(null)


  /* =====================================================
     SESSIONS
  ===================================================== */

  const sessions =
    useMemo(
      () =>
        getSessionsForDate(
          selectedDate,
        ),
      [
        selectedDate,
      ],
    )


  /* =====================================================
     DATE KEY
  ===================================================== */

  const selectedDateKey =
    formatDateKey(
      selectedDate,
    )


  /* =====================================================
     LIVE ATTENDANCE
  ===================================================== */

  const attendanceRecords =
    useLiveQuery(
      () =>
        db.attendance
          .where('date')
          .equals(
            selectedDateKey,
          )
          .toArray(),

      [
        selectedDateKey,
      ],

      [],
    )


  /* =====================================================
     CURRENT / NEXT CLASS
  ===================================================== */

  const currentClass =
    getCurrentClass(
      todayDate,
    )

  const nextClass =
    getNextClass(
      todayDate,
    )


  /* =====================================================
     SELECTED SESSION
  ===================================================== */

  const selectedSession =
    sessions.find(
      (session) =>
        session.occurrenceId ===
        selectedSessionId,
    ) ?? null


  /* =====================================================
     GET STATUS
  ===================================================== */

  function getStatusForSession(
    occurrenceId: string,
  ): AttendanceStatus | null {

    const record =
      attendanceRecords.find(
        (item) =>
          item.id ===
          occurrenceId,
      )

    return (
      record?.status ??
      null
    )
  }


  /* =====================================================
     SELECT DAY
  ===================================================== */

  function selectDay(
    day: Day,
  ) {

    const date =
      new Date(
        selectedDate,
      )

    const currentDayIndex =
      (date.getDay() + 6) %
      7

    const targetDayIndex =
      days.indexOf(
        day,
      )

    const difference =
      targetDayIndex -
      currentDayIndex

    date.setDate(
      date.getDate() +
        difference,
    )

    setSelectedDay(
      day,
    )

    setSelectedDate(
      date,
    )
  }


  /* =====================================================
     MOVE DAY
  ===================================================== */

  function moveDay(
    direction: number,
  ) {

    const currentIndex =
      days.indexOf(
        selectedDay,
      )

    let newIndex =
      currentIndex +
      direction

    if (
      newIndex < 0
    ) {
      newIndex =
        days.length - 1
    }

    if (
      newIndex >=
      days.length
    ) {
      newIndex = 0
    }

    const date =
      new Date(
        selectedDate,
      )

    date.setDate(
      date.getDate() +
        direction,
    )

    setSelectedDay(
      days[newIndex],
    )

    setSelectedDate(
      date,
    )
  }


  /* =====================================================
     OPEN ATTENDANCE
  ===================================================== */

  function openAttendance(
    occurrenceId: string,
  ) {

    const session =
      sessions.find(
        (item) =>
          item.occurrenceId ===
          occurrenceId,
      )

    if (!session) {
      return
    }

    /*
     * Only actual classes
     * can have attendance.
     */

    if (
      session.type !==
        'theory' &&
      session.type !==
        'practical'
    ) {
      return
    }

    setSelectedSessionId(
      occurrenceId,
    )
  }


  /* =====================================================
     SAVE / EDIT ATTENDANCE
  ===================================================== */

  async function handleAttendanceSave(
    status: AttendanceStatus,
  ) {

    if (
      !selectedSession
    ) {
      return
    }

    /*
     * setAttendance uses
     * db.attendance.put()
     *
     * Therefore:
     *
     * New record → created
     *
     * Existing record →
     * updated
     */

    await setAttendance(
      selectedSession,
      status,
    )

    /*
     * Close modal.
     *
     * useLiveQuery automatically
     * detects the IndexedDB change.
     */

    setSelectedSessionId(
      null,
    )
  }


  async function handleAttendanceUnmark() {
  if (!selectedSession) {
    return
  }

  await removeAttendance(
    selectedSession.occurrenceId,
  )

  setSelectedSessionId(null)
}


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="page timetable-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="page-header">

        <div>

          <p className="eyebrow">
            SECOND PROFESSIONAL • BATCH C
          </p>

          <h1>
            Timetable
          </h1>

        </div>


       <button
  type="button"
  className="timetable-calendar-button"
  aria-label="Choose a date"
  onClick={() =>
    dateInputRef.current?.click()
  }
>
  <CalendarDays
    size={20}
  />

  <input
    ref={dateInputRef}
    type="date"
    value={formatDateKey(
      selectedDate,
    )}
    onChange={
      handleDateChange
    }
    className="timetable-date-input"
    aria-label="Choose timetable date"
  />
</button>

      </header>


      {/* =================================================
          CURRENT CLASS
      ================================================= */}
{currentClass &&
  selectedDate.toDateString() ===
    todayDate.toDateString() && (
  <section className="current-class-card">

          <div className="current-class-label">

            <span className="live-dot" />

            CURRENTLY

          </div>

          <h2>
            {currentClass.subject}
          </h2>

          <div className="current-class-meta">

            {formatTime(
              currentClass.startTime,
            )}

            {' – '}

            {formatTime(
              currentClass.endTime,
            )}

            {currentClass.type ===
              'practical' && (

              <span className="badge">
                PRACTICAL
              </span>

            )}

          </div>

        </section>

      )}


      {/* =================================================
          NEXT CLASS
      ================================================= */}

      {!currentClass &&
  nextClass &&
  selectedDate.toDateString() ===
    todayDate.toDateString() && (

          <section className="next-class-card">

            <div className="next-class-label">
              NEXT CLASS
            </div>

            <h2>
              {nextClass.subject}
            </h2>

            <div className="next-class-time">

              <Clock3
                size={15}
              />

              {formatTime(
                nextClass.startTime,
              )}

              {' – '}

              {formatTime(
                nextClass.endTime,
              )}

            </div>

          </section>

        )}


      {/* =================================================
          DAY SELECTOR
      ================================================= */}

      <section className="day-selector-section">

        <div className="day-selector-header">

          <button
            type="button"
            className="day-arrow"
            onClick={() =>
              moveDay(-1)
            }
            aria-label="Previous day"
          >
            <ChevronLeft
              size={18}
            />
          </button>


          <div className="selected-day-heading">

            <span className="section-overline">
              WEEKLY SCHEDULE
            </span>

            <h2>
              {selectedDay}
            </h2>

            <div className="selected-date">

              <CalendarDays
                size={14}
              />

              <span>
                {selectedDate.toLocaleDateString(
                  'en-IN',
                  {
                    day:
                      'numeric',
                    month:
                      'long',
                    year:
                      'numeric',
                  },
                )}
              </span>

            </div>

          </div>


          <button
            type="button"
            className="day-arrow"
            onClick={() =>
              moveDay(1)
            }
            aria-label="Next day"
          >
            <ChevronRight
              size={18}
            />
          </button>

        </div>


        {/* DAY PILLS */}

        <div className="day-pills">

          {days.map(
            (day) => (

              <button
                type="button"
                key={day}

                className={`day-pill ${
                  selectedDay ===
                  day
                    ? 'selected'
                    : ''
                } ${
                  today === day
                    ? 'today'
                    : ''
                }`}

                onClick={() =>
                  selectDay(
                    day,
                  )
                }
              >

                {getDayAbbreviation(
                  day,
                )}

              </button>

            ),
          )}

        </div>

      </section>


      {/* =================================================
          SCHEDULE
      ================================================= */}

      <section className="schedule-section">

        {sessions.length ===
        0 ? (

          <div className="holiday-card">

            <div className="holiday-icon">

              <CalendarDays
                size={22}
              />

            </div>

            <h2>
              No Classes
            </h2>

            <p>
              There are no scheduled
              classes for this day.
            </p>

          </div>

        ) : (

          <div className="schedule-list">

            {sessions.map(
              (session) => {

                const status =
                  getStatusForSession(
                    session.occurrenceId,
                  )

                const isCurrent =
                  currentClass
                    ?.occurrenceId ===
                  session.occurrenceId

                const isAttendanceClass =
                  session.type ===
                    'theory' ||
                  session.type ===
                    'practical'


                return (

                  <button
                    type="button"

                    key={
                      session.occurrenceId
                    }

                    className={`schedule-card ${
                      isCurrent
                        ? 'current'
                        : ''
                    } ${
                      session.type ===
                      'break'
                        ? 'break-card'
                        : ''
                    } ${
                      session.type ===
                      'activity'
                        ? 'activity-card'
                        : ''
                    } ${
                      status
                        ? `attendance-${status}`
                        : ''
                    } ${
                      isAttendanceClass
                        ? 'attendance-class'
                        : 'non-attendance-class'
                    }`}

                    onClick={() =>
                      openAttendance(
                        session.occurrenceId,
                      )
                    }

                  >

                    {/* TIME */}

                    <div className="schedule-time">

                      <strong>
                        {formatTime(
                          session.startTime,
                        )}
                      </strong>

                      <span>
                        {formatTime(
                          session.endTime,
                        )}
                      </span>

                    </div>


                    {/* CONTENT */}

                    <div className="schedule-content">

                      <div className="schedule-title-row">

                        <h3>
                          {session.subject}
                        </h3>

                        {session.code && (

                          <span className="subject-code">
                            {session.code}
                          </span>

                        )}

                      </div>


                      <div className="schedule-tags">

                        <span
                          className={`type-tag ${session.type}`}
                        >

                          {session.type ===
                          'theory'
                            ? 'THEORY'
                            : session.type ===
                              'practical'
                            ? 'PRACTICAL'
                            : session.type ===
                              'activity'
                            ? 'ACTIVITY'
                            : session.type ===
                              'break'
                            ? 'BREAK'
                            : 'HOLIDAY'}

                        </span>


                        {session.batch && (

                          <span className="batch-tag">

                            BATCH{' '}

                            {
                              session.batch
                            }

                          </span>

                        )}

                      </div>


                      {session.location && (

                        <div className="location">

                          <MapPin
                            size={13}
                          />

                          {
                            session.location
                          }

                        </div>

                      )}


                      {/* ATTENDANCE */}

                      {isAttendanceClass && (

                        status ? (

                          <div
                            className={`attendance-status ${status}`}
                          >

                            {status ===
                              'present' &&
                              '✓ Present'}

                            {status ===
                              'absent' &&
                              '✕ Absent'}

                            {status ===
                              'cancelled' &&
                              '⊘ Cancelled'}

                            {status ===
                              'holiday' &&
                              '○ Holiday'}

                          </div>

                        ) : (

                          <div className="attendance-status not-marked">

                            Tap to mark
                            attendance

                          </div>

                        )

                      )}

                    </div>

                  </button>
                )
              },
            )}

          </div>

        )}

      </section>


      {/* =================================================
          LEGEND
      ================================================= */}

      <section className="timetable-info">

        <div className="info-row">

          <div className="info-dot theory-dot" />

          <span>
            Theory class
          </span>

        </div>


        <div className="info-row">

          <div className="info-dot practical-dot" />

          <span>
            Practical • Batch C
          </span>

        </div>


        <div className="info-row">

          <div className="info-dot activity-dot" />

          <span>
            Activity / Library / NCC
          </span>

        </div>

      </section>


      {/* =================================================
          MODAL
      ================================================= */}

      {selectedSession && (

       <AttendanceModal
  session={selectedSession}
  currentStatus={
    getStatusForSession(
      selectedSession.occurrenceId,
    )
  }
  onSave={
    handleAttendanceSave
  }
  onUnmark={
    handleAttendanceUnmark
  }
  onClose={() =>
    setSelectedSessionId(null)
  }
/>

      )}

    </div>
  )
}


export default Study