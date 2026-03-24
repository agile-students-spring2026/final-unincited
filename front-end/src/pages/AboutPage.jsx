import './AboutPage.css'
import { useNavigate } from 'react-router-dom'
function AboutPage() {
  
    
  const navigate = useNavigate()

  return <div className="about-page">
    <div className="about-title">About</div>
    <div className="about-subtitle">Understanding Media Bias</div>

    <div className="about-content">
      <div className="about-mission">
            <div className="mission-title">Our Mission</div>
            <div className="mission-text">Provide interpretable insights into how language influences perceived political bias.</div>
      </div>

      <div className="about-methodology">
        <div className="methodology-title">Methodology</div>
        <div className="methodology-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
        </div>
      </div>

      
    </div>
    <button className="logout-button" onClick={() => {
    navigate(`/`);}}>LOG OUT</button>
    
    

  </div>
  
}

export default AboutPage