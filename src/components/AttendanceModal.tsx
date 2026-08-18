import {
  Check,
  X,
  Ban,
  Umbrella,
  XCircle,
  RotateCcw,
} from 'lucide-react'

import type {
  AttendanceStatus,
} from '../db/database'

import type {
  TimetableOccurrence,
} from '../data/timetableUtils'

import {
  formatTime,
} from '../data/timetableUtils'


interface AttendanceModalProps {
  session: TimetableOccurrence

  currentStatus:
    | AttendanceStatus
    | null

  onSave: (
    status: AttendanceStatus,
  ) => void

  onUnmark: () => void

  onClose: () => void
}


/* =====================================================
   OPTIONS
===================================================== */

const options: {
  status: AttendanceStatus
  label: string
  description: string
}[] = [
  {
    status: 'present',
    label: 'Present',
    description:
      'I attended this class',
  },
  {
    status: 'absent',
    label: 'Absent',
    description:
      'I missed this class',
  },
  {
    status: 'cancelled',
    label: 'Cancelled',
    description:
      'The class did not take place',
  },
  {
    status: 'holiday',
    label: 'Holiday',
    description:
      'This was an official holiday',
  },
]


/* =====================================================
   ICON
===================================================== */

function AttendanceIcon({
  status,
}: {
  status: AttendanceStatus
}) {

  if (
    status === 'present'
  ) {
    return (
      <Check size={21} />
    )
  }

  if (
    status === 'absent'
  ) {
    return (
      <X size={21} />
    )
  }

  if (
    status === 'cancelled'
  ) {
    return (
      <Ban size={21} />
    )
  }

  return (
    <Umbrella size={21} />
  )
}


/* =====================================================
   MODAL
===================================================== */

function AttendanceModal({
  session,
  currentStatus,
  onSave,
  onUnmark,
  onClose,
}: AttendanceModalProps) {

  const hasAttendance =
    currentStatus !== null


  return (
    <div
      className="attendance-overlay"
      onMouseDown={onClose}
    >

      <div
        className="attendance-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* =========================================
            HANDLE
        ========================================= */}

        <div className="attendance-modal-handle" />


        {/* =========================================
            HEADER
        ========================================= */}

        <div className="attendance-modal-header">

          <div className="attendance-modal-heading">

            <p className="eyebrow">
              {hasAttendance
                ? 'EDIT ATTENDANCE'
                : 'MARK ATTENDANCE'}
            </p>

            <h2>
              {session.subject}
            </h2>

          </div>


          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <XCircle size={21} />
          </button>

        </div>


        {/* =========================================
            DATE / CLASS INFO
        ========================================= */}

        <div className="attendance-modal-date">

          <div className="attendance-modal-date-icon">
            <CalendarIcon />
          </div>

          <div>
            <strong>
              {formatSessionDate(
                session.date,
              )}
            </strong>

            <span>
              {formatTime(
                session.startTime,
              )}
              {' – '}
              {formatTime(
                session.endTime,
              )}
            </span>
          </div>

        </div>


        {/* =========================================
            TAGS
        ========================================= */}

        <div className="attendance-session-info">

          <span>
            {session.type ===
            'practical'
              ? 'PRACTICAL'
              : 'THEORY'}
          </span>


          {session.batch && (
            <span>
              BATCH {session.batch}
            </span>
          )}

          {session.code && (
            <span>
              {session.code}
            </span>
          )}

        </div>


        {/* =========================================
            OPTIONS
        ========================================= */}

        <div className="attendance-options">

          {options.map(
            (option) => {

              const selected =
                currentStatus ===
                option.status

              return (

                <button
                  type="button"

                  key={
                    option.status
                  }

                  className={`attendance-option ${
                    option.status
                  } ${
                    selected
                      ? 'selected'
                      : ''
                  }`}

                  onClick={() =>
                    onSave(
                      option.status,
                    )
                  }
                >

                  <div className="attendance-option-icon">

                    <AttendanceIcon
                      status={
                        option.status
                      }
                    />

                  </div>


                  <div className="attendance-option-text">

                    <strong>
                      {option.label}
                    </strong>

                    <span>
                      {
                        option.description
                      }
                    </span>

                  </div>


                  {selected && (

                    <div className="attendance-selected">

                      <Check
                        size={14}
                      />

                    </div>

                  )}

                </button>
              )
            },
          )}

        </div>


        {/* =========================================
            UNMARK
        ========================================= */}

        {hasAttendance && (

          <button
            type="button"
            className="attendance-unmark-button"
            onClick={
              onUnmark
            }
          >

            <RotateCcw
              size={16}
            />

            <span>
              Unmark attendance
            </span>

          </button>

        )}


        {/* =========================================
            FOOTER
        ========================================= */}

        <p className="attendance-modal-footer">

          {hasAttendance
            ? 'You can change or remove this record anytime.'
            : 'Choose the status for this class.'}

        </p>

      </div>

    </div>
  )
}


/* =====================================================
   SMALL CALENDAR ICON
===================================================== */

function CalendarIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="3"
      />

      <line
        x1="16"
        y1="2"
        x2="16"
        y2="6"
      />

      <line
        x1="8"
        y1="2"
        x2="8"
        y2="6"
      />

      <line
        x1="3"
        y1="10"
        x2="21"
        y2="10"
      />
    </svg>
  )
}


/* =====================================================
   DATE
===================================================== */

function formatSessionDate(
  dateString: string,
) {

  const date =
    new Date(
      `${dateString}T00:00:00`,
    )

  return date.toLocaleDateString(
    'en-IN',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  )
}


export default AttendanceModal