import { NavLink } from 'react-router-dom'

import {
  Home,
  BookOpen,
  ClipboardCheck,
  MoreHorizontal,
} from 'lucide-react'


const navigationItems = [
  {
    label: 'Home',
    path: '/',
    icon: Home,
  },
  {
    label: 'Study',
    path: '/study',
    icon: BookOpen,
  },
  {
    label: 'Attendance',
    path: '/attendance',
    icon: ClipboardCheck,
  },
  {
    label: 'More',
    path: '/more',
    icon: MoreHorizontal,
  },
]


function BottomNav() {
  return (
    <nav className="bottom-nav">

      <div className="bottom-nav-inner">

        {navigationItems.map(
          (item) => {

            const Icon =
              item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={
                  item.path === '/'
                }
                className={({
                  isActive,
                }) =>
                  `nav-item ${
                    isActive
                      ? 'active'
                      : ''
                  }`
                }
              >

                <Icon
                  size={21}
                  strokeWidth={2}
                />

                <span>
                  {item.label}
                </span>

              </NavLink>
            )
          },
        )}

      </div>

    </nav>
  )
}


export default BottomNav