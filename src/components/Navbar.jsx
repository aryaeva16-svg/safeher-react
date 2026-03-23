import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const location = useLocation()
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/login')
    setMenuOpen(false)
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">

      {/* Logo */}
      <Link to="/" className="logo-link" onClick={closeMenu}>
        <img src="/logo.png" alt="SafeHer Logo" className="nav-logo"/>
      </Link>

      {/* Hamburger icon — only shows on mobile */}
      <button
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Nav links */}
      <ul className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
        <li>
          <Link to="/"
            className={location.pathname === '/' ? 'active-link' : ''}
            onClick={closeMenu}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/helplines"
            className={location.pathname === '/helplines' ? 'active-link' : ''}
            onClick={closeMenu}>
            Helplines
          </Link>
        </li>
        <li>
          <Link to="/contacts"
            className={location.pathname === '/contacts' ? 'active-link' : ''}
            onClick={closeMenu}>
            My Contacts
          </Link>
        </li>
        <li>
          <Link to="/about"
            className={location.pathname === '/about' ? 'active-link' : ''}
            onClick={closeMenu}>
            About
          </Link>
        </li>
        {currentUser && (
          <li>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </li>
        )}
      </ul>

    </nav>
  )
}

export default Navbar