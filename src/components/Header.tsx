import { NavLink } from 'react-router-dom'

const links = [
  { to: '/pokedex', label: 'Pokédex' },
  { to: '/roster', label: 'Roster' },
  { to: '/battle', label: 'Battle' },
  { to: '/ranks', label: 'Ranks' },
]

const linkBase =
  'brut-sm press px-4 py-2 text-lg font-bold leading-none whitespace-nowrap'

export default function Header() {
  return (
    <header className="bg-primary border-b-4 border-border">
      <div className="flex items-center justify-between gap-4 px-6 py-3 ">
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
          {links.map(({ to, label }) => (
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

          <NavLink
            to="/login"
            className={`${linkBase} bg-foreground text-background`}
          >
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
