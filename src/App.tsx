import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import {
  useEffect,
} from 'react'

import AppLayout from './layouts/AppLayout'

import Home from './pages/Home'
import Study from './pages/Study'
import Tools from './pages/Tools'
import More from './pages/More'

import Attendance from './pages/Attendance'

import Notes from './pages/Notes'
import Habits from './pages/Habits'
import Appearance from './pages/Appearance'
import Settings from './pages/Settings'


/* =====================================================
   THEME HELPERS
===================================================== */

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


function applySavedTheme() {

  const savedTheme =
    localStorage.getItem(
      'nova_theme',
    ) as Theme | null


  const theme: Theme =
    savedTheme === 'dark' ||
    savedTheme === 'light' ||
    savedTheme === 'system'
      ? savedTheme
      : 'light'


  const actualTheme =
    theme === 'system'
      ? getSystemTheme()
      : theme


  document.documentElement.dataset.theme =
    actualTheme
}


/* =====================================================
   APP
===================================================== */

function App() {

  /*
   * Apply the saved theme whenever
   * the application starts.
   *
   * This makes dark/light mode survive:
   *
   * - page refresh
   * - navigation
   * - closing the app
   * - reopening the app
   */

  useEffect(() => {

    applySavedTheme()

  }, [])


  return (

    <Routes>

      <Route
        element={
          <AppLayout />
        }
      >

        {/* ========================================
            MAIN
        ======================================== */}

        <Route
          path="/"
          element={
            <Home />
          }
        />

        <Route
          path="/study"
          element={
            <Study />
          }
        />

        <Route
          path="/tools"
          element={
            <Tools />
          }
        />

        <Route
          path="/more"
          element={
            <More />
          }
        />


        {/* ========================================
            ATTENDANCE
        ======================================== */}

        <Route
          path="/attendance"
          element={
            <Attendance />
          }
        />


        {/* ========================================
            PERSONAL
        ======================================== */}

        <Route
          path="/notes"
          element={
            <Notes />
          }
        />

        <Route
          path="/habits"
          element={
            <Habits />
          }
        />

        <Route
          path="/appearance"
          element={
            <Appearance />
          }
        />

        <Route
          path="/settings"
          element={
            <Settings />
          }
        />


        {/* ========================================
            FALLBACK
        ======================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Route>

    </Routes>

  )
}


export default App