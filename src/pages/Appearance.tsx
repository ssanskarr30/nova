import {
  ArrowLeft,
  Check,
  Moon,
  Monitor,
  Sun,
} from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'


type Theme =
  | 'light'
  | 'dark'
  | 'system'


function getSystemTheme(): 'light' | 'dark' {

  return window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches
    ? 'dark'
    : 'light'
}


function applyTheme(
  theme: Theme,
) {

  const actualTheme =
    theme === 'system'
      ? getSystemTheme()
      : theme

  document.documentElement.dataset.theme =
    actualTheme

  localStorage.setItem(
    'nova_theme',
    theme,
  )
}


function Appearance() {

  const navigate =
    useNavigate()


  const [
    theme,
    setTheme,
  ] = useState<Theme>(
    () =>
      (
        localStorage.getItem(
          'nova_theme',
        ) as Theme
      ) || 'light',
  )


  useEffect(() => {

    applyTheme(theme)

  }, [theme])


  function selectTheme(
    value: Theme,
  ) {

    setTheme(value)

    applyTheme(value)
  }


  const options = [
    {
      value: 'light' as Theme,
      label: 'Light',
      description:
        'Clean and bright',
      icon: Sun,
    },
    {
      value: 'dark' as Theme,
      label: 'Dark',
      description:
        'Easy on the eyes at night',
      icon: Moon,
    },
    {
      value: 'system' as Theme,
      label: 'System',
      description:
        'Follow your device settings',
      icon: Monitor,
    },
  ]


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
            CUSTOMIZE
          </p>

          <h1>
            Appearance
          </h1>

        </div>

      </header>


      <section className="appearance-section">

        <span className="section-overline">
          THEME
        </span>

        <h2>
          Choose your look
        </h2>


        <div className="appearance-options">

          {options.map(
            (option) => {

              const Icon =
                option.icon

              const selected =
                theme ===
                option.value

              return (

                <button
                  key={
                    option.value
                  }
                  className={`appearance-option ${
                    selected
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() =>
                    selectTheme(
                      option.value,
                    )
                  }
                >

                  <div className="appearance-icon">

                    <Icon
                      size={19}
                    />

                  </div>


                  <div className="appearance-text">

                    <strong>
                      {option.label}
                    </strong>

                    <span>
                      {option.description}
                    </span>

                  </div>


                  {selected && (

                    <div className="appearance-check">

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

      </section>


      <section className="appearance-preview">

        <span className="section-overline">
          PREVIEW
        </span>

        <div className="appearance-preview-card">

          <div className="appearance-preview-icon">

            <Moon
              size={18}
            />

          </div>

          <div>

            <strong>
              NOVA
            </strong>

            <span>
              Your personal study space
            </span>

          </div>

        </div>

      </section>

    </div>

  )
}


export default Appearance