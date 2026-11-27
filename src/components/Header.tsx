import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { clearSession, getToken, getUsername } from '../utils/auth'

const links = [
  { to: '/roster', label: 'Roster' },
  { to: '/battle', label: 'Battle' },
  { to: '/leaderboard', label: 'Ranks' },
]

const linkBase =
  'brut-sm press px-4 py-2 text-lg font-bold leading-none whitespace-nowrap'

export default function Header() {
  const nav = useNavigate()
  useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const loggedIn = Boolean(getToken())
  const username = getUsername() ?? "Trainer"
  const canAccessPrivatePages = loggedIn 

  const logout = () => {
    clearSession()
    setMenuOpen(false)
    nav('/login')
  }

  return (
    <header className="bg-primary border-b-4 border-border sticky top-0 z-50 lg:sticky lg:top-0 lg:z-50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <NavLink
          to="/"
          className="flex items-center gap-3"
          onClick={() => {
            setMenuOpen(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <img
            src="/pokeball.webp"
            alt="PokéArena"
            className="size-10 shrink-0 sm:size-11"
          />{' '}
          <span className="font-pixel text-xl text-primary-foreground sm:text-2xl">
            PokéArena
          </span>
        </NavLink>

        <button
          type="button"
          className="brut-sm press flex size-11 items-center justify-center bg-card text-foreground lg:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <nav
          id="primary-navigation"
          className={`${menuOpen ? 'flex' : 'hidden'} w-full flex-col items-stretch gap-3 lg:flex lg:w-auto lg:flex-row lg:items-center`}
        >
          {links
            .filter(
              ({ to }) =>
                canAccessPrivatePages ||
                 to !== '/roster' && to !== '/battle',
            )
            .map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `${linkBase} w-full lg:w-auto ${
                    isActive ? 'bg-accent' : 'bg-card'
                  } text-foreground`
                }
              >
                {label}
              </NavLink>
            ))}

          {loggedIn ? (
            <>
            <span
      title={username}
      className="brut-sm flex w-full items-center justify-center gap-2 bg-accent px-4 py-2 text-lg font-bold leading-none text-foreground lg:w-auto"
    >
      <span
        aria-hidden="true"
        className="grid size-7 place-items-center rounded-full border-2 border-border bg-card font-pixel text-[10px]"
      >
        {username.charAt(0).toUpperCase()}
      </span>
      <span className="max-w-40 truncate">{username}</span>
    </span>
            <button
              type="button"
              onClick={logout}
              className={`${linkBase} w-full bg-foreground text-background lg:w-auto`}
            >
              Logout
            </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={`${linkBase} w-full bg-foreground text-background lg:w-auto`}
              >
                Login
              </NavLink>
              
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
