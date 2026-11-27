import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Battle from './pages/Battle'
import Leaderboard from './pages/Leaderboard'
import Roster from './pages/Roster';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/roster" element={<Roster />} />
        <Route path="/battle" element={<Battle />} />
        </Route>

        <Route path="*" element={<NotFound/>} />
      </Route>
    </Routes>
  )
}
