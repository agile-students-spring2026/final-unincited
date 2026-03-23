import { NavLink } from 'react-router-dom'
import './Nav.css'

function Nav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" className="nav-item">
        <img className="icon" src="/nav-dashboard.png"></img>
      </NavLink>

      <NavLink to="/analytics" className="nav-item">
        <img className="icon" src="/nav-stats.png"></img>
      </NavLink>

      <NavLink to="/my-articles" className="nav-item">
        <img className="icon" src="/nav-myarticles.png"></img>
      </NavLink>

      <NavLink to="/about" className="nav-item">
        <img className="icon" src="/nav-about.png"></img>
      </NavLink>
    </nav>
  )
}

export default Nav