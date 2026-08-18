import {
  ArrowLeft,
  Bell,
  Info,
  RotateCcw,
  Target,
  Trash2,
  AlertTriangle,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  clearAllAttendance,
} from '../db/attendance'


function Settings() {

  const navigate =
    useNavigate()


  /* =====================================================
     RESET APPEARANCE
  ===================================================== */

  function resetAppearance() {

    localStorage.removeItem(
      'nova_theme',
    )

    document.documentElement.dataset.theme =
      'light'

    window.location.reload()
  }


  /* =====================================================
     RESET ATTENDANCE
  ===================================================== */

  async function resetAttendance() {

    const confirmed =
      window.confirm(
        'Reset all attendance?\n\nThis will permanently delete every attendance record, including your attendance history and subject percentages.',
      )

    if (!confirmed) {
      return
    }

    try {

      await clearAllAttendance()

      window.alert(
        'All attendance records have been reset.',
      )

      /*
       * Refresh the app so every
       * attendance screen immediately
       * reflects the empty database.
       */

      window.location.reload()

    } catch (error) {

      console.error(
        'Failed to reset attendance:',
        error,
      )

      window.alert(
        'Something went wrong while resetting attendance.',
      )

    }
  }


  return (

    <div className="page settings-page">

      {/* =================================================
          HEADER
      ================================================= */}

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
            NOVA
          </p>


          <h1>
            Settings
          </h1>

        </div>

      </header>


      {/* =================================================
          ATTENDANCE
      ================================================= */}

      <section className="settings-section">

        <span className="section-overline">
          STUDY
        </span>


        <div className="settings-list">

          <div className="settings-row">

            <div className="settings-row-icon">

              <Target
                size={18}
              />

            </div>


            <div>

              <strong>
                Attendance target
              </strong>

              <span>
                Minimum attendance required
              </span>

            </div>


            <strong className="settings-value">
              75%
            </strong>

          </div>

        </div>

      </section>


      {/* =================================================
          NOTIFICATIONS
      ================================================= */}

      <section className="settings-section">

        <span className="section-overline">
          NOTIFICATIONS
        </span>


        <div className="settings-list">

          <div className="settings-row">

            <div className="settings-row-icon">

              <Bell
                size={18}
              />

            </div>


            <div>

              <strong>
                Task reminders
              </strong>

              <span>
                Remind you about pending tasks
              </span>

            </div>


            <span className="settings-badge">
              ON
            </span>

          </div>

        </div>

      </section>


      {/* =================================================
          APP INFO
      ================================================= */}

      <section className="settings-section">

        <span className="section-overline">
          ABOUT
        </span>


        <div className="settings-list">

          <div className="settings-row">

            <div className="settings-row-icon">

              <Info
                size={18}
              />

            </div>


            <div>

              <strong>
                NOVA
              </strong>

              <span>
                Personal study & productivity space
              </span>

            </div>


            <span className="settings-value">
              v1.0
            </span>

          </div>

        </div>

      </section>


      {/* =================================================
          RESET
      ================================================= */}

      <section className="settings-section">

        <span className="section-overline">
          RESET
        </span>


        <div className="settings-list">


          {/* RESET ATTENDANCE */}

          <button
            className="settings-row settings-danger-row"
            onClick={
              resetAttendance
            }
          >

            <div className="settings-row-icon danger">

              <Trash2
                size={18}
              />

            </div>


            <div>

              <strong>
                Reset all attendance
              </strong>

              <span>
                Delete attendance history and
                subject percentages
              </span>

            </div>


          </button>


          {/* RESET APPEARANCE */}

          <button
            className="settings-row settings-action-row"
            onClick={
              resetAppearance
            }
          >

            <div className="settings-row-icon">

              <RotateCcw
                size={17}
              />

            </div>


            <div>

              <strong>
                Reset appearance
              </strong>

              <span>
                Return NOVA to the light theme
              </span>

            </div>

          </button>


        </div>


        {/* WARNING */}

        <div className="settings-warning">

          <AlertTriangle
            size={15}
          />

          <span>
            Resetting attendance permanently
            removes all saved attendance records.
          </span>

        </div>

      </section>

    </div>

  )
}


export default Settings