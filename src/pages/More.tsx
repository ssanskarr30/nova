import {
  Moon,
  Settings,
  StickyNote,
  Target,
  ChevronRight,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router-dom'


function More() {

  const navigate =
    useNavigate()


  return (
    <div className="page">

      {/* ============================================
          HEADER
      ============================================ */}

      <header className="page-header">

        <div>

          <p className="eyebrow">
            PERSONAL
          </p>

          <h1>
            More
          </h1>

        </div>

      </header>


      {/* ============================================
          FEATURES
      ============================================ */}

      <div className="feature-list">


        {/* ==========================================
            NOTES
        ========================================== */}

        <button
          className="feature-card"
          onClick={() =>
            navigate('/notes')
          }
        >

          <div className="feature-icon">

            <StickyNote
              size={20}
            />

          </div>


          <div className="feature-card-content">

            <strong>
              Notes
            </strong>

            <span>
              Save thoughts, ideas and important things.
            </span>

          </div>


          <ChevronRight
            className="feature-arrow"
            size={18}
          />

        </button>


        {/* ==========================================
            HABITS
        ========================================== */}

        <button
          className="feature-card"
          onClick={() =>
            navigate('/habits')
          }
        >

          <div className="feature-icon">

            <Target
              size={20}
            />

          </div>


          <div className="feature-card-content">

            <strong>
              Habits
            </strong>

            <span>
              Build small habits and track consistency.
            </span>

          </div>


          <ChevronRight
            className="feature-arrow"
            size={18}
          />

        </button>


        {/* ==========================================
            APPEARANCE
        ========================================== */}

        <button
          className="feature-card"
          onClick={() =>
            navigate('/appearance')
          }
        >

          <div className="feature-icon">

            <Moon
              size={20}
            />

          </div>


          <div className="feature-card-content">

            <strong>
              Appearance
            </strong>

            <span>
              Customize how NOVA looks.
            </span>

          </div>


          <ChevronRight
            className="feature-arrow"
            size={18}
          />

        </button>


        {/* ==========================================
            SETTINGS
        ========================================== */}

        <button
          className="feature-card"
          onClick={() =>
            navigate('/settings')
          }
        >

          <div className="feature-icon">

            <Settings
              size={20}
            />

          </div>


          <div className="feature-card-content">

            <strong>
              Settings
            </strong>

            <span>
              Manage your NOVA experience.
            </span>

          </div>


          <ChevronRight
            className="feature-arrow"
            size={18}
          />

        </button>


      </div>

    </div>
  )
}


export default More
