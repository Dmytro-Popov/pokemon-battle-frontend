import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/roster" element={<p>This page is not yet ready</p>} />
          <Route path="/battle" element={<p>This page is not yet ready</p>} />
        </Route>

        <Route path="*" element={<p>This page is not yet ready</p>} />
      </Route>
    </Routes>
  )
}