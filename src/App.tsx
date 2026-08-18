import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

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


function App() {

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