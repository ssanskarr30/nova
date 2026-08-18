import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  CalendarClock,
  Check,
  CheckCircle2,
  Clock3,
  Edit3,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'

import {
  useLiveQuery,
} from 'dexie-react-hooks'

import {
  db,
} from '../db/database'

import {
  createTask,
  deleteTask,
  toggleTask,
  updateTask,
} from '../db/tasks'

import {
  saveFocusSession,
} from '../db/focus'

import {
  checkTaskReminders,
  requestNotificationPermission,
} from '../utils/notifications'


/* =====================================================
   SUBJECTS
===================================================== */

const subjects = [
  'Animal Nutrition',
  'Veterinary Biochemistry',
  'Veterinary Pathology',
  'Veterinary Microbiology',
  'Animal Genetics & Breeding',
  'Other',
]


/* =====================================================
   HELPERS
===================================================== */

function formatTaskDeadline(
  dueAt: string,
) {
  const date =
    new Date(dueAt)

  return date.toLocaleString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    },
  )
}


function getRemainingText(
  dueAt: string,
) {
  const remaining =
    new Date(
      dueAt,
    ).getTime() -
    Date.now()

  if (
    remaining <= 0
  ) {
    return 'Overdue'
  }

  const minutes =
    Math.floor(
      remaining /
        (60 * 1000),
    )

  const days =
    Math.floor(
      minutes /
        (60 * 24),
    )

  const hours =
    Math.floor(
      (
        minutes %
          (60 * 24)
      ) /
        60,
    )

  const mins =
    minutes % 60

  if (
    days > 0
  ) {
    return `${days}d ${hours}h left`
  }

  if (
    hours > 0
  ) {
    return `${hours}h ${mins}m left`
  }

  return `${mins}m left`
}


function formatFocusTime(
  milliseconds: number,
) {
  const minutes =
    Math.floor(
      milliseconds /
        (60 * 1000),
    )

  const hours =
    Math.floor(
      minutes / 60,
    )

  const remainingMinutes =
    minutes % 60

  if (
    hours > 0
  ) {
    return `${hours}h ${remainingMinutes}m`
  }

  return `${minutes}m`
}


/* =====================================================
   HOME
===================================================== */

function Home() {

  /* ===================================================
     MODALS
  =================================================== */

  const [
    taskModalOpen,
    setTaskModalOpen,
  ] = useState(false)

  const [
    editingTaskId,
    setEditingTaskId,
  ] = useState<
    string | null
  >(null)

  const [
    focusModalOpen,
    setFocusModalOpen,
  ] = useState(false)

  const [
    runningFocus,
    setRunningFocus,
  ] = useState(false)


  /* ===================================================
     TASK DATABASE
  =================================================== */

  const tasks =
    useLiveQuery(
      () =>
        db.tasks
          .orderBy('dueAt')
          .toArray(),
      [],
      [],
    )


  /* ===================================================
     FOCUS DATABASE
  =================================================== */

  const focusSessions =
    useLiveQuery(
      () =>
        db.focusSessions
          .toArray(),
      [],
      [],
    )


  /* ===================================================
     TODAY'S TASKS
  =================================================== */

  const pendingTasks =
    useMemo(
      () =>
        tasks.filter(
          (task) =>
            !task.completed,
        ),
      [tasks],
    )


  const completedToday =
    useMemo(
      () => {
        const today =
          new Date()

        const key =
          today
            .toISOString()
            .slice(
              0,
              10,
            )

        return tasks.filter(
          (task) =>
            task.completed &&
            task.updatedAt.startsWith(
              key,
            ),
        ).length
      },
      [tasks],
    )


  /* ===================================================
     TODAY FOCUS
  =================================================== */

  const todayFocus =
    useMemo(
      () => {
        const today =
          new Date()
            .toISOString()
            .slice(
              0,
              10,
            )

        return focusSessions
          .filter(
            (session) =>
              session.startedAt.startsWith(
                today,
              ),
          )
          .reduce(
            (
              total,
              session,
            ) =>
              total +
              session.durationMs,
            0,
          )
      },
      [focusSessions],
    )


  /* ===================================================
     TASK REMINDER CHECK
  =================================================== */

  useEffect(() => {

    checkTaskReminders(
      tasks,
    )

    const interval =
      window.setInterval(
        () => {
          checkTaskReminders(
            tasks,
          )
        },
        60 * 1000,
      )

    return () =>
      window.clearInterval(
        interval,
      )

  }, [tasks])


  /* ===================================================
     REQUEST NOTIFICATION PERMISSION
  =================================================== */

  async function enableNotifications() {
    await requestNotificationPermission()
  }


  /* ===================================================
     TASK MODAL
  =================================================== */

  function openAddTask() {
    setEditingTaskId(null)
    setTaskModalOpen(true)
  }


  function openEditTask(
    id: string,
  ) {
    setEditingTaskId(id)
    setTaskModalOpen(true)
  }


  /* ===================================================
     FOCUS
  =================================================== */

  function openFocus() {
    if (
      runningFocus
    ) {
      return
    }

    setFocusModalOpen(true)
  }


  return (
    <div className="page nova-home">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="home-header">

        <div>

          <p className="eyebrow">
            YOUR SPACE
          </p>

          <h1>
            NOVA
          </h1>

        </div>


        <button
          className="round-button"
          aria-label="Notifications"
          onClick={
            enableNotifications
          }
        >
          <Sparkles
            size={19}
          />
        </button>

      </header>


      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">

        <div className="hero-content">

          <span className="hero-overline">
            GOOD EVENING
          </span>

          <h2>
            Make today
            <br />
            count.
          </h2>

          <p>
            Stay focused, keep things
            simple, and get things done.
          </p>

        </div>


        <div className="hero-orb">

          <Sparkles
            size={28}
          />

        </div>

      </section>


      {/* =================================================
          OVERVIEW
      ================================================= */}

      <section className="section">

        <div className="section-header">

          <div>

            <span className="section-overline">
              OVERVIEW
            </span>

            <h2>
              Today
            </h2>

          </div>

        </div>


        <div className="stats">

          <div className="stat-card">

            <div className="stat-icon">

              <CheckCircle2
                size={18}
              />

            </div>

            <strong>
              {completedToday}
            </strong>

            <span>
              Tasks completed
            </span>

          </div>


          <div className="stat-card">

            <div className="stat-icon">

              <Clock3
                size={18}
              />

            </div>

            <strong>
              {formatFocusTime(
                todayFocus,
              )}
            </strong>

            <span>
              Focus time
            </span>

          </div>

        </div>

      </section>


      {/* =================================================
          PENDING TASKS
      ================================================= */}

      {pendingTasks.length > 0 && (

        <section className="section home-task-section">

          <div className="section-header">

            <div>

              <span className="section-overline">
                PENDING
              </span>

              <h2>
                Your tasks
              </h2>

            </div>

            <span className="task-count">
              {pendingTasks.length}
            </span>

          </div>


          <div className="home-task-list">

            {pendingTasks
              .slice(0, 5)
              .map(
                (task) => {

                  const overdue =
                    new Date(
                      task.dueAt,
                    ).getTime() <
                    Date.now()

                  return (

                    <div
                      key={
                        task.id
                      }
                      className={`home-task-card ${
                        overdue
                          ? 'overdue'
                          : ''
                      }`}
                    >

                      <button
                        className="task-check-button"
                        onClick={() =>
                          toggleTask(
                            task.id,
                          )
                        }
                        aria-label="Complete task"
                      >
                        <Check
                          size={15}
                        />
                      </button>


                      <div className="task-card-content">

                        <strong>
                          {task.title}
                        </strong>

                        <span>

                          <CalendarClock
                            size={12}
                          />

                          {formatTaskDeadline(
                            task.dueAt,
                          )}

                        </span>

                      </div>


                      <div className="task-card-actions">

                        <span className="task-remaining">
                          {getRemainingText(
                            task.dueAt,
                          )}
                        </span>

                        <button
                          className="task-action-button"
                          onClick={() =>
                            openEditTask(
                              task.id,
                            )
                          }
                          aria-label="Edit task"
                        >
                          <Edit3
                            size={14}
                          />
                        </button>

                        <button
                          className="task-action-button danger"
                          onClick={() =>
                            deleteTask(
                              task.id,
                            )
                          }
                          aria-label="Delete task"
                        >
                          <Trash2
                            size={14}
                          />
                        </button>

                      </div>

                    </div>

                  )
                },
              )}

          </div>

        </section>

      )}


      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <section className="section">

        <div className="section-header">

          <div>

            <span className="section-overline">
              QUICK ACTIONS
            </span>

            <h2>
              Get started
            </h2>

          </div>

        </div>


        <div className="quick-actions">

          <button
            className="quick-action"
            onClick={
              openAddTask
            }
          >

            <div className="quick-icon">

              <Plus
                size={20}
              />

            </div>

            <div>

              <strong>
                Add a task
              </strong>

              <span>
                Create something you need to do
              </span>

            </div>

          </button>


          <button
            className="quick-action"
            onClick={
              openFocus
            }
          >

            <div className="quick-icon">

              <Clock3
                size={20}
              />

            </div>

            <div>

              <strong>
                Start focus
              </strong>

              <span>
                Begin a focused study session
              </span>

            </div>

          </button>

        </div>

      </section>


      {/* =================================================
          READY CARD
      ================================================= */}

      {pendingTasks.length === 0 && (

        <section className="ready-card">

          <div className="ready-icon">

            <Sparkles
              size={20}
            />

          </div>

          <h3>
            Your space is ready.
          </h3>

          <p>
            Add your first task or
            start a focused study
            session.
          </p>

        </section>

      )}


      {/* =================================================
          TASK MODAL
      ================================================= */}

      {taskModalOpen && (

        <TaskModal
          task={
            editingTaskId
              ? tasks.find(
                  (task) =>
                    task.id ===
                    editingTaskId,
                ) ?? null
              : null
          }
          onClose={() =>
            setTaskModalOpen(
              false,
            )
          }
        />

      )}


      {/* =================================================
          FOCUS MODAL
      ================================================= */}

      {focusModalOpen && (

        <FocusModal
          onClose={() =>
            setFocusModalOpen(
              false,
            )
          }
          onStarted={() => {
            setFocusModalOpen(
              false,
            )

            setRunningFocus(
              true,
            )
          }}
        />

      )}

      {/* 
       * Running focus state is handled
       * by the modal itself.
       *
       * The parent flag prevents
       * another session being started
       * while one is active.
       */}
      {runningFocus && (
        <RunningFocus
          onStop={() =>
            setRunningFocus(
              false,
            )
          }
        />
      )}

    </div>
  )
}


/* =====================================================
   TASK MODAL
===================================================== */

function TaskModal({
  task,
  onClose,
}: {
  task: {
    id: string
    title: string
    dueAt: string
  } | null

  onClose: () => void
}) {

  const existingDate =
    task
      ? new Date(
          task.dueAt,
        )
      : null

  const [
    title,
    setTitle,
  ] = useState(
    task?.title ?? '',
  )

  const [
    date,
    setDate,
  ] = useState(
    existingDate
      ? `${existingDate.getFullYear()}-${String(
          existingDate.getMonth() + 1,
        ).padStart(2, '0')}-${String(
          existingDate.getDate(),
        ).padStart(2, '0')}`
      : '',
  )

  const [
    time,
    setTime,
  ] = useState(
    existingDate
      ? `${String(
          existingDate.getHours(),
        ).padStart(2, '0')}:${String(
          existingDate.getMinutes(),
        ).padStart(2, '0')}`
      : '',
  )


  async function handleSave() {

    if (
      !title.trim() ||
      !date ||
      !time
    ) {
      return
    }

    const dueAt =
      new Date(
        `${date}T${time}:00`,
      ).toISOString()

    if (task) {

      await updateTask(
        task.id,
        title,
        dueAt,
      )

    } else {

      await createTask(
        title,
        dueAt,
      )

    }

    onClose()
  }


  return (

    <div
      className="nova-modal-overlay"
      onMouseDown={
        onClose
      }
    >

      <div
        className="nova-modal"
        onMouseDown={(
          event,
        ) =>
          event.stopPropagation()
        }
      >

        <div className="nova-modal-header">

          <div>

            <span className="section-overline">
              {task
                ? 'EDIT TASK'
                : 'NEW TASK'}
            </span>

            <h2>
              {task
                ? 'Update task'
                : 'What needs to be done?'}
            </h2>

          </div>

          <button
            className="modal-close"
            onClick={
              onClose
            }
          >
            <X
              size={19}
            />
          </button>

        </div>


        <label className="nova-field">

          <span>
            Task
          </span>

          <input
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value,
              )
            }
            placeholder="e.g. Revise Veterinary Pathology"
            autoFocus
          />

        </label>


        <div className="nova-field-row">

          <label className="nova-field">

            <span>
              Due date
            </span>

            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(
                  event.target.value,
                )
              }
            />

          </label>


          <label className="nova-field">

            <span>
              Due time
            </span>

            <input
              type="time"
              value={time}
              onChange={(event) =>
                setTime(
                  event.target.value,
                )
              }
            />

          </label>

        </div>


        <div className="nova-reminder-info">

          <CalendarClock
            size={17}
          />

          <div>

            <strong>
              3-hour reminder
            </strong>

            <span>
              NOVA will remind you while
              the task is still pending.
            </span>

          </div>

        </div>


        <button
          className="nova-primary-button"
          onClick={
            handleSave
          }
        >
          {task
            ? 'Save changes'
            : 'Add task'}
        </button>

      </div>

    </div>
  )
}


/* =====================================================
   FOCUS MODAL
===================================================== */

function FocusModal({
  onClose,
  onStarted,
}: {
  onClose: () => void
  onStarted: () => void
}) {

  const [
    subject,
    setSubject,
  ] = useState(
    subjects[0],
  )

  const [
    mode,
    setMode,
  ] = useState<
    'preset' |
    'custom' |
    'stopwatch'
  >('preset')

  const [
    duration,
    setDuration,
  ] = useState(25)

  const [
    customMinutes,
    setCustomMinutes,
  ] = useState(30)


  function start() {

    let durationMs =
      duration *
      60 *
      1000

    if (
      mode === 'custom'
    ) {
      durationMs =
        customMinutes *
        60 *
        1000
    }

    if (
      mode === 'stopwatch'
    ) {
      durationMs = 0
    }

    /*
     * Store the configuration
     * temporarily.
     */
    sessionStorage.setItem(
      'nova_focus_config',
      JSON.stringify({
        subject,
        durationMs,
        stopwatch:
          mode ===
          'stopwatch',
      }),
    )

    onStarted()
  }


  return (

    <div
      className="nova-modal-overlay"
      onMouseDown={
        onClose
      }
    >

      <div
        className="nova-modal"
        onMouseDown={(
          event,
        ) =>
          event.stopPropagation()
        }
      >

        <div className="nova-modal-header">

          <div>

            <span className="section-overline">
              FOCUS SESSION
            </span>

            <h2>
              What are you studying?
            </h2>

          </div>

          <button
            className="modal-close"
            onClick={
              onClose
            }
          >
            <X
              size={19}
            />
          </button>

        </div>


        <label className="nova-field">

          <span>
            Subject
          </span>

          <select
            value={subject}
            onChange={(event) =>
              setSubject(
                event.target.value,
              )
            }
          >

            {subjects.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ),
            )}

          </select>

        </label>


        <div className="focus-mode-label">
          How long?
        </div>


        <div className="focus-duration-grid">

          {[25, 45, 60, 90].map(
            (minutes) => (

              <button
                key={
                  minutes
                }
                className={`focus-duration ${
                  mode ===
                    'preset' &&
                  duration ===
                    minutes
                    ? 'selected'
                    : ''
                }`}
                onClick={() => {
                  setMode(
                    'preset',
                  )
                  setDuration(
                    minutes,
                  )
                }}
              >
                {minutes} min
              </button>

            ),
          )}


          <button
            className={`focus-duration ${
              mode ===
              'custom'
                ? 'selected'
                : ''
            }`}
            onClick={() =>
              setMode(
                'custom',
              )
            }
          >
            Custom
          </button>


          <button
            className={`focus-duration ${
              mode ===
              'stopwatch'
                ? 'selected'
                : ''
            }`}
            onClick={() =>
              setMode(
                'stopwatch',
              )
            }
          >
            No limit
          </button>

        </div>


        {mode ===
          'custom' && (

          <label className="nova-field">

            <span>
              Minutes
            </span>

            <input
              type="number"
              min="1"
              max="600"
              value={
                customMinutes
              }
              onChange={(
                event,
              ) =>
                setCustomMinutes(
                  Math.max(
                    1,
                    Number(
                      event.target
                        .value,
                    ),
                  ),
                )
              }
            />

          </label>

        )}


        {mode ===
          'stopwatch' && (

          <div className="focus-unlimited-note">

            <Clock3
              size={17}
            />

            <span>
              This timer will keep
              running until you
              manually stop it.
            </span>

          </div>

        )}


        <button
          className="nova-primary-button"
          onClick={
            start
          }
        >
          Start focus
        </button>

      </div>

    </div>
  )
}


/* =====================================================
   RUNNING FOCUS
===================================================== */

function RunningFocus({
  onStop,
}: {
  onStop: () => void
}) {

  const config =
    useMemo(() => {

      try {

        return JSON.parse(
          sessionStorage.getItem(
            'nova_focus_config',
          ) ?? '{}',
        )

      } catch {

        return {}

      }

    }, [])


  const [
    startedAt,
  ] = useState(
    Date.now(),
  )

  const [
    elapsed,
    setElapsed,
  ] = useState(0)


  useEffect(() => {

    const interval =
      window.setInterval(
        () => {

          const now =
            Date.now()

          const value =
            now -
            startedAt

          setElapsed(
            value,
          )

          /*
           * Automatically stop
           * a normal timed session.
           */
          if (
            config.durationMs >
              0 &&
            value >=
              config.durationMs
          ) {
            finish(
              value,
            )
          }

        },
        500,
      )

    return () =>
      window.clearInterval(
        interval,
      )

  }, [
    startedAt,
    config.durationMs,
  ])


  async function finish(
    actualDuration: number,
  ) {

    const end =
      new Date()

    await saveFocusSession(
      config.subject ??
        'General Study',
      new Date(
        startedAt,
      ).toISOString(),
      end.toISOString(),
      actualDuration,
    )

    sessionStorage.removeItem(
      'nova_focus_config',
    )

    onStop()
  }


  const displayMs =
    config.durationMs >
    0
      ? Math.max(
          0,
          config.durationMs -
            elapsed,
        )
      : elapsed


  const totalSeconds =
    Math.floor(
      displayMs / 1000,
    )

  const hours =
    Math.floor(
      totalSeconds /
        3600,
    )

  const minutes =
    Math.floor(
      (
        totalSeconds %
          3600
      ) /
        60,
    )

  const seconds =
    totalSeconds %
    60


  const timeText =
    hours > 0
      ? `${String(hours).padStart(
          2,
          '0',
        )}:${String(minutes).padStart(
          2,
          '0',
        )}:${String(seconds).padStart(
          2,
          '0',
        )}`
      : `${String(minutes).padStart(
          2,
          '0',
        )}:${String(seconds).padStart(
          2,
          '0',
        )}`


  return (

    <div className="focus-running-bar">

      <div className="focus-running-info">

        <div className="focus-running-icon">

          <Clock3
            size={17}
          />

        </div>


        <div>

          <span>
            FOCUSING
          </span>

          <strong>
            {config.subject ??
              'Study'}
          </strong>

        </div>

      </div>


      <div className="focus-running-time">

        {timeText}

      </div>


      <button
        className="focus-stop-button"
        onClick={() =>
          finish(
            elapsed,
          )
        }
      >
        Stop
      </button>

    </div>
  )
}


export default Home