import {
  ArrowLeft,
  Check,
  Plus,
  Target,
  Trash2,
} from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'


interface Habit {
  id: string
  name: string
  completedDates: string[]
}


const STORAGE_KEY =
  'nova_habits'


function getTodayKey() {

  const date =
    new Date()

  const year =
    date.getFullYear()

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, '0')

  const day =
    String(
      date.getDate(),
    ).padStart(2, '0')

  return `${year}-${month}-${day}`
}


function Habits() {

  const navigate =
    useNavigate()


  const [
    habits,
    setHabits,
  ] = useState<Habit[]>([])


  const [
    newHabit,
    setNewHabit,
  ] = useState('')


  const [
    showAdd,
    setShowAdd,
  ] = useState(false)


  const today =
    getTodayKey()


  /* ================================================
     LOAD
  ================================================ */

  useEffect(() => {

    const saved =
      localStorage.getItem(
        STORAGE_KEY,
      )

    if (saved) {

      try {
        setHabits(
          JSON.parse(saved),
        )
      } catch {
        setHabits([])
      }

    }

  }, [])


  function saveHabits(
    updated: Habit[],
  ) {

    setHabits(updated)

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated),
    )
  }


  /* ================================================
     ADD HABIT
  ================================================ */

  function addHabit() {

    if (!newHabit.trim()) {
      return
    }

    const habit: Habit = {
      id:
        crypto.randomUUID(),

      name:
        newHabit.trim(),

      completedDates: [],
    }

    saveHabits([
      ...habits,
      habit,
    ])

    setNewHabit('')

    setShowAdd(false)
  }


  /* ================================================
     TOGGLE TODAY
  ================================================ */

  function toggleToday(
    habit: Habit,
  ) {

    const completed =
      habit.completedDates.includes(
        today,
      )

    const updated =
      habits.map(
        (item) => {

          if (
            item.id !==
            habit.id
          ) {
            return item
          }

          return {
            ...item,

            completedDates:
              completed
                ? item.completedDates.filter(
                    (date) =>
                      date !== today,
                  )
                : [
                    ...item.completedDates,
                    today,
                  ],
          }

        },
      )

    saveHabits(updated)
  }


  /* ================================================
     DELETE
  ================================================ */

  function deleteHabit(
    id: string,
  ) {

    saveHabits(
      habits.filter(
        (habit) =>
          habit.id !== id,
      ),
    )
  }


  return (

    <div className="page">

      <header className="page-header">

        <div>

          <button
            className="back-inline"
            onClick={() =>
              navigate('/more')
            }
          >
            <ArrowLeft
              size={16}
            />

            More
          </button>

          <p className="eyebrow">
            CONSISTENCY
          </p>

          <h1>
            Habits
          </h1>

        </div>


        <button
          className="round-button"
          onClick={() =>
            setShowAdd(
              !showAdd,
            )
          }
          aria-label="Add habit"
        >
          <Plus
            size={20}
          />
        </button>

      </header>


      {showAdd && (

        <div className="habit-add-card">

          <input
            className="habit-input"
            value={newHabit}
            onChange={(event) =>
              setNewHabit(
                event.target.value,
              )
            }
            onKeyDown={(event) => {
              if (
                event.key ===
                'Enter'
              ) {
                addHabit()
              }
            }}
            placeholder="e.g. Revise anatomy"
            autoFocus
          />

          <button
            className="habit-add-button"
            onClick={addHabit}
          >
            Add habit
          </button>

        </div>

      )}


      {habits.length === 0 ? (

        <div className="notes-empty">

          <div className="notes-empty-icon">

            <Target
              size={23}
            />

          </div>

          <h2>
            Build your routine
          </h2>

          <p>
            Add habits you want to
            stay consistent with.
          </p>

          <button
            className="notes-create-button"
            onClick={() =>
              setShowAdd(true)
            }
          >
            <Plus
              size={17}
            />

            Add first habit
          </button>

        </div>

      ) : (

        <div className="habit-list">

          {habits.map(
            (habit) => {

              const completed =
                habit.completedDates.includes(
                  today,
                )

              return (

                <div
                  key={habit.id}
                  className={`habit-card ${
                    completed
                      ? 'completed'
                      : ''
                  }`}
                >

                  <button
                    className="habit-check"
                    onClick={() =>
                      toggleToday(
                        habit,
                      )
                    }
                  >

                    {completed && (
                      <Check
                        size={17}
                      />
                    )}

                  </button>


                  <div className="habit-content">

                    <strong>
                      {habit.name}
                    </strong>

                    <span>
                      {completed
                        ? 'Completed today'
                        : 'Not completed today'}
                    </span>

                  </div>


                  <button
                    className="habit-delete"
                    onClick={() =>
                      deleteHabit(
                        habit.id,
                      )
                    }
                    aria-label="Delete habit"
                  >
                    <Trash2
                      size={15}
                    />
                  </button>

                </div>

              )
            },
          )}

        </div>

      )}

    </div>

  )
}


export default Habits