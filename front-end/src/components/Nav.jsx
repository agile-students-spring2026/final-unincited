import { NavLink } from 'react-router-dom'
import './Nav.css'

function Nav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" className="nav-item">
        Dashboard
      </NavLink>

      <NavLink to="/analytics" className="nav-item">
        Analytics
      </NavLink>

      <NavLink to="/your-articles" className="nav-item">
        Your Articles
      </NavLink>

      <NavLink to="/about" className="nav-item">
        About
      </NavLink>
    </nav>
  )
}

export default Nav