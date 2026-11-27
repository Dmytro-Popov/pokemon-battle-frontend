# Pokémon Battle — Frontend

Web client for the **Pokémon Battle** game ("PokéArena"). Browse Pokémon from [PokéAPI](https://pokeapi.co/), build a roster of up to six, battle a random opposing team and climb the leaderboard.

Backend: [pokemon-battle-backend](https://github.com/Dmytro-Popov/pokemon-battle-backend) (Auth service + Game API).

## Features

- **Register / Login** with email, username and password; session kept via a short-lived access token and an `httpOnly` refresh cookie (silent refresh on `401`)
- **Home** — all Pokémon from PokéAPI as cards with search and infinite scroll; click a card for stats, types and abilities
- **Roster** — add and remove Pokémon (max 6), saved in `localStorage`
- **Battle** *(login required)* — turn-based fight against a random team: stat- and type-based damage, STAB, type effectiveness, attack animations and sounds
- **Leaderboard** — top players by points; points for a win are saved automatically after the battle
- Protected routes redirect unauthenticated users to `/login`
- Responsive layout (mobile and desktop)

## Tech stack

React 19 · TypeScript · Vite · React Router 7 · Tailwind CSS 4 · oxlint

## Getting started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm
- The backend services running locally (see the backend README), or deployed URLs

### Install and run

```bash
git clone https://github.com/Dmytro-Popov/pokemon-battle-frontend.git
cd pokemon-battle-frontend
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

The app is available at `http://localhost:5173`.

### Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_AUTH_URL` | `http://localhost:5002` | Base URL of the Auth service (`/auth/*`) |
| `VITE_API_URL` | `http://localhost:5001` | Base URL of the Game API (`/leaderboard`) |

The Auth service must list the frontend origin in its `FRONTEND_URL` (CORS with credentials), e.g. `http://localhost:5173`.

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run oxlint |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |

## Routes

| Path | Page | Access |
| --- | --- | --- |
| `/` | Home — Pokémon list and search | public |
| `/register` | Register | public |
| `/login` | Login | public |
| `/leaderboard` | Leaderboard | public |
| `/roster` | My Roster | logged in |
| `/battle` | Battle | logged in |
| `*` | Not found | public |

## How the battle works

1. Your team is the roster (up to 6); the opponent team is picked at random from PokéAPI.
2. Each turn you choose an attack (Tackle, Quick Attack, Heavy Hit or the special Type Blast); the opponent answers.
3. Damage depends on attack power, the attacker's attack and the defender's defense stats (special stats for Type Blast), same-type bonus (STAB), type effectiveness and a small random factor.
4. When you win, you earn `100 × opponent team size + 50 × surviving Pokémon` points, sent to `POST /leaderboard`.

## Authentication flow

- `POST /auth/login` and `/auth/register` return an `accessToken` (stored in `localStorage`) and set the refresh cookie.
- Requests to the Game API go through `authFetch`, which attaches `Authorization: Bearer <token>`. On a `401` it calls `POST /auth/refresh` once, then retries.
- If refresh fails, the session is cleared and the user must log in again.

## Project structure

```text
src/
├── App.tsx            # Routes
├── main.tsx           # Entry point
├── pages/             # Home, Login, Register, Roster, Battle, Leaderboard, NotFound
├── components/        # Layout, Header, PokemonCard, PokemonModal, Battle* parts, ProtectedRoute, ...
└── utils/             # auth, leaderboard, pokeApi, roster, battle logic, hooks, sounds
public/
└── _redirects         # SPA fallback for Netlify-style hosting
```

## Deployment

`public/_redirects` rewrites all paths to `index.html`, so client-side routing works on Netlify-style hosts. Set `VITE_AUTH_URL` and `VITE_API_URL` to the deployed backend URLs at build time. In production the refresh cookie is `secure` with `sameSite=none`, so both services must be served over HTTPS.

## Credits

Pokémon data and sprites from [PokéAPI](https://pokeapi.co/). Pokémon is a trademark of Nintendo / Game Freak; this is an educational project.
