import { useState } from 'react'
import { NavLink } from 'react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/athletes', label: 'Athletes' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/results', label: 'Results' },
]

function NavItem({ to, label, onClick }) {
  return (
    <Button variant="ghost" asChild>
      <NavLink
        to={to}
        end={to === '/'}
        onClick={onClick}
        className={({ isActive }) =>
          isActive ? 'bg-blue-100 text-blue-900' : ''
        }
      >
        {label}
      </NavLink>
    </Button>
  )
}

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
          {isAuthenticated && <NavItem to="/admin" label="Admin" />}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <NavLink to="/login">Login</NavLink>
            </Button>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-2 flex flex-col gap-1">
          {links.map((link) => (
            <NavItem key={link.to} {...link} onClick={closeMenu} />
          ))}
          {isAuthenticated && <NavItem to="/admin" label="Admin" onClick={closeMenu} />}
          <div className="border-t border-gray-200 pt-2 mt-1">
            {isAuthenticated ? (
              <Button variant="outline" size="sm" className="w-full" onClick={() => { logout(); closeMenu() }}>
                Logout
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="w-full" asChild>
                <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation
