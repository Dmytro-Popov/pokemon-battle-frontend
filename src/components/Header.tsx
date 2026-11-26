import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { clearToken, getToken } from '../utils/auth'

const links = [
  { to: '/pokedex', label: 'Pokédex' },
  { to: '/roster', label: 'Roster' },
  { to: '/battle', label: 'Battle' },
  { to: '/ranks', label: 'Ranks' },
]

const linkBase =
  'brut-sm press px-4 py-2 text-lg font-bold leading-none whitespace-nowrap'

export default function Header() {
  const nav = useNavigate()
  useLocation()
  const loggedIn = Boolean(getToken())
  const canAccessPrivatePages = loggedIn || import.meta.env.DEV

  const logout = () => {
    clearToken()
    nav('/login')
  }

  return (
    <header className="bg-primary border-b-4 border-border">
      <div className="flex items-center justify-between gap-4 px-6 py-3 mx-auto max-w-6xl p-4">
        <NavLink to="/" className="flex items-center gap-4">
          <img
            src="/pokeball.webp"
            alt="PokéArena"
            className="size-11 shrink-0"
          />{' '}
          <span className="font-pixel text-2xl text-primary-foreground">
            PokéArena
          </span>
        </NavLink>

        <nav className="flex items-center gap-3">
          {links
            .filter(
              ({ to }) =>
                canAccessPrivatePages ||
                to !== '/roster',
            )
            .map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive ? 'bg-accent' : 'bg-card'
                } text-foreground`
              }
            >
              {label}
            </NavLink>
            ))}

          {loggedIn ? (
            <button
              type="button"
              onClick={logout}
              className={`${linkBase} bg-foreground text-background`}
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={`${linkBase} bg-foreground text-background`}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={`${linkBase} bg-card text-foreground`}
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
