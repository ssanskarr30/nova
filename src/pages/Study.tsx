import {
  useMemo,
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


/* =====================================================
   DAYS
===================================================== */

const days: Day[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]


/* =====================================================
   CALENDAR HELPERS
===================================================== */

function startOfMonth(
  date: Date,
) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
  )
}


function getDaysInMonth(
  date: Date,
) {
  return new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate()
}


function getCalendarOffset(
  date: Date,
) {
  /*
   * JavaScript:
   *
   * Sunday = 0
   * Monday = 1
   * ...
   *
   * Convert so Monday = 0.
   */

  return (
    startOfMonth(date).getDay() +
    6
  ) % 7
}


function formatCalendarMonth(
  date: Date,
) {
  return date.toLocaleDateString(
    'en-IN',
    {
      month: 'long',
      year: 'numeric',
    },
  )
}


/* =====================================================
   STUDY PAGE
===================================================== */

function Study() {

  /* =====================================================
     TODAY
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


  /* =====================================================
     CALENDAR STATE
  ===================================================== */

  const [
    calendarOpen,
    setCalendarOpen,
  ] = useState(false)


  const [
    calendarMonth,
    setCalendarMonth,
  ] = useState<Date>(
    startOfMonth(
      todayDate,
    ),
  )


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
     TIMETABLE SESSIONS
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
     SELECTED DATE KEY
  ===================================================== */

  const selectedDateKey =
    formatDateKey(
      selectedDate,
    )


  /* =====================================================
     LIVE ATTENDANCE
     FOR SELECTED DAY
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
     ALL ATTENDANCE
     
     Used by calendar to determine
     which dates have attendance.
  ===================================================== */

  const allAttendance =
    useLiveQuery(
      () =>
        db.attendance
          .toArray(),

      [],

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
     SELECTED SESSION OBJECT
  ===================================================== */

  const selectedSession =
    sessions.find(
      (session) =>
        session.occurrenceId ===
        selectedSessionId,
    ) ?? null


  /* =====================================================
     GET ATTENDANCE STATUS
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
     GET DAY ATTENDANCE SUMMARY
     
     absent > present > other
  ===================================================== */

  function getDayAttendanceStatus(
    date: Date,
  ) {

    const dateKey =
      formatDateKey(
        date,
      )

    const records =
      allAttendance.filter(
        (record) =>
          record.date ===
          dateKey,
      )

    if (
      records.length === 0
    ) {
      return null
    }


    /*
     * If there is even one absent
     * class on that day, show RED.
     */

    if (
      records.some(
        (record) =>
          record.status ===
          'absent',
      )
    ) {
      return 'absent'
    }


    /*
     * Otherwise if there is a
     * present class, show GREEN.
     */

    if (
      records.some(
        (record) =>
          record.status ===
          'present',
      )
    ) {
      return 'present'
    }


    /*
     * Cancelled / holiday etc.
     */

    return 'other'
  }


  /* =====================================================
     SELECT DATE FROM CALENDAR
  ===================================================== */

  function selectCalendarDate(
    date: Date,
  ) {

    const nextDate =
      new Date(
        date,
      )

    setSelectedDate(
      nextDate,
    )

    setSelectedDay(
      getDayFromDate(
        nextDate,
      ),
    )

    setCalendarMonth(
      startOfMonth(
        nextDate,
      ),
    )

    setCalendarOpen(
      false,
    )
  }


  /* =====================================================
     OPEN / CLOSE CALENDAR
  ===================================================== */

  function openCalendar() {

    setCalendarMonth(
      startOfMonth(
        selectedDate,
      ),
    )

    setCalendarOpen(
      (value) =>
        !value,
    )
  }


  /* =====================================================
     PREVIOUS CALENDAR MONTH
  ===================================================== */

  function previousCalendarMonth() {

    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() - 1,
        1,
      ),
    )
  }


  /* =====================================================
     NEXT CALENDAR MONTH
  ===================================================== */

  function nextCalendarMonth() {

    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + 1,
        1,
      ),
    )
  }


  /* =====================================================
     SELECT DAY PILL
  ===================================================== */

  function selectDay(
    day: Day,
  ) {

    const date =
      new Date(
        selectedDate,
      )

    const currentDayIndex =
      (
        date.getDay() +
        6
      ) % 7

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

    setCalendarMonth(
      startOfMonth(
        date,
      ),
    )
  }


  /* =====================================================
     MOVE ONE DAY
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

    setCalendarMonth(
      startOfMonth(
        date,
      ),
    )
  }


  /* =====================================================
     OPEN ATTENDANCE MODAL
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
     * Only theory and practical
     * classes have attendance.
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

    await setAttendance(
      selectedSession,
      status,
    )

    setSelectedSessionId(
      null,
    )
  }


  /* =====================================================
     UNMARK ATTENDANCE
  ===================================================== */

  async function handleAttendanceUnmark() {

    if (
      !selectedSession
    ) {
      return
    }

    await removeAttendance(
      selectedSession.occurrenceId,
    )

    setSelectedSessionId(
      null,
    )
  }


  /* =====================================================
     CALENDAR DAYS
  ===================================================== */

  const calendarDays =
    useMemo(() => {

      const totalDays =
        getDaysInMonth(
          calendarMonth,
        )

      const offset =
        getCalendarOffset(
          calendarMonth,
        )

      const cells: (
        Date | null
      )[] = []


      /*
       * Empty cells before
       * first day of month.
       */

      for (
        let index = 0;
        index < offset;
        index++
      ) {

        cells.push(
          null,
        )

      }


      /*
       * Actual month days.
       */

      for (
        let day = 1;
        day <= totalDays;
        day++
      ) {

        cells.push(
          new Date(
            calendarMonth.getFullYear(),
            calendarMonth.getMonth(),
            day,
          ),
        )

      }


      return cells

    }, [
      calendarMonth,
    ])


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


        {/* =================================================
            CALENDAR BUTTON
        ================================================= */}

        <div className="timetable-calendar-wrapper">

          <button
            type="button"
            className={`timetable-calendar-button ${
              calendarOpen
                ? 'active'
                : ''
            }`}
            aria-label="Choose a date"
            aria-expanded={
              calendarOpen
            }
            onClick={
              openCalendar
            }
          >

            <CalendarDays
              size={20}
            />

          </button>


          {/* =================================================
              CALENDAR POPUP
          ================================================= */}

          {calendarOpen && (

            <div className="attendance-calendar-popover">

              {/* =========================================
                  CALENDAR HEADER
              ========================================= */}

              <div className="attendance-calendar-header">

                <button
                  type="button"
                  className="attendance-calendar-nav"
                  onClick={
                    previousCalendarMonth
                  }
                  aria-label="Previous month"
                >

                  <ChevronLeft
                    size={17}
                  />

                </button>


                <div className="attendance-calendar-title">

                  <strong>
                    {formatCalendarMonth(
                      calendarMonth,
                    )}
                  </strong>


                  <button
                    type="button"
                    onClick={() =>
                      selectCalendarDate(
                        new Date(),
                      )
                    }
                  >
                    Go to today
                  </button>

                </div>


                <button
                  type="button"
                  className="attendance-calendar-nav"
                  onClick={
                    nextCalendarMonth
                  }
                  aria-label="Next month"
                >

                  <ChevronRight
                    size={17}
                  />

                </button>

              </div>


              {/* =========================================
                  WEEKDAYS
              ========================================= */}

              <div className="attendance-calendar-weekdays">

                {[
                  'M',
                  'T',
                  'W',
                  'T',
                  'F',
                  'S',
                  'S',
                ].map(
                  (
                    day,
                    index,
                  ) => (

                    <span
                      key={`${day}-${index}`}
                    >
                      {day}
                    </span>

                  ),
                )}

              </div>


              {/* =========================================
                  CALENDAR DAYS
              ========================================= */}

              <div className="attendance-calendar-grid">

                {calendarDays.map(
                  (
                    date,
                    index,
                  ) => {

                    /*
                     * Empty calendar cell.
                     */

                    if (!date) {

                      return (
                        <div
                          key={`empty-${index}`}
                          aria-hidden="true"
                        />
                      )

                    }


                    const dateKey =
                      formatDateKey(
                        date,
                      )


                    const selected =
                      dateKey ===
                      selectedDateKey


                    const isToday =
                      date.toDateString() ===
                      todayDate.toDateString()


                    const attendanceStatus =
                      getDayAttendanceStatus(
                        date,
                      )


                    return (

                      <button
                        type="button"

                        key={
                          dateKey
                        }

                        className={`attendance-calendar-day ${
                          selected
                            ? 'selected'
                            : ''
                        } ${
                          isToday
                            ? 'today'
                            : ''
                        }`}

                        onClick={() =>
                          selectCalendarDate(
                            date,
                          )
                        }

                        aria-label={
                          `${date.toLocaleDateString(
                            'en-IN',
                            {
                              day:
                                'numeric',
                              month:
                                'long',
                              year:
                                'numeric',
                            },
                          )}${
                            attendanceStatus ===
                            'absent'
                              ? ', absent marked'
                              : attendanceStatus ===
                                'present'
                              ? ', present marked'
                              : attendanceStatus ===
                                'other'
                              ? ', other attendance marked'
                              : ''
                          }`
                        }
                      >

                        <span className="calendar-day-number">

                          {
                            date.getDate()
                          }

                        </span>


                        {attendanceStatus && (

                          <span className="calendar-attendance-dots">

                            <span
                              className={`calendar-dot ${attendanceStatus}`}
                            />

                          </span>

                        )}

                      </button>

                    )

                  },
                )}

              </div>


              {/* =========================================
                  CALENDAR LEGEND
              ========================================= */}

              <div className="attendance-calendar-legend">

                <span>

                  <i className="calendar-dot present" />

                  Present

                </span>


                <span>

                  <i className="calendar-dot absent" />

                  Absent

                </span>


                <span>

                  <i className="calendar-dot other" />

                  Other

                </span>

              </div>

            </div>

          )}

        </div>

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


        {/* =================================================
            DAY PILLS
        ================================================= */}

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

                    {/* =================================
                        TIME
                    ================================= */}

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


                    {/* =================================
                        CONTENT
                    ================================= */}

                    <div className="schedule-content">

                      {/* SUBJECT */}

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


                      {/* TAGS */}

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


                      {/* LOCATION */}

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


                      {/* =================================
                          ATTENDANCE
                      ================================= */}

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
          ATTENDANCE MODAL
      ================================================= */}

      {selectedSession && (

        <AttendanceModal

          session={
            selectedSession
          }

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
            setSelectedSessionId(
              null,
            )
          }

        />

      )}

    </div>
  )
}


export default Study