import './AboutPage.css'
import { useNavigate } from 'react-router-dom'

function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="about-page">
      <header className="about-header">
        <div className="about-title">About</div>
        <div className="about-subtitle">Understanding Media Bias</div>
      </header>

      <div className="about-content">
        <section className="about-mission">
          <div className="mission-title">Our Mission</div>
          <div className="mission-text">
            We help readers identify how wording, framing, and tone can shape
            political perception. Our goal is to make bias analysis readable,
            transparent, and useful in day-to-day news consumption.
          </div>
        </section>

        <section className="about-methodology">
          <div className="methodology-title">Methodology</div>
          <div className="methodology-text">
            Each submitted article is analyzed for sentiment, loaded language,
            and framing patterns that often correlate with political slant.
            Results are surfaced as interpretable scores so users can compare
            articles and understand why they were classified a certain way.
          </div>
        </section>

        <section className="about-principles">
          <div className="principles-title">Design Principles</div>
          <ul className="principles-list">
            <li>Explain results in plain language, not black-box labels.</li>
            <li>Support article-to-article comparison across sources.</li>
            <li>Encourage media literacy without forcing one viewpoint.</li>
          </ul>
        </section>
      </div>

      <div className="about-footer">
        <button
          className="about-button about-button-secondary"
          onClick={() => {
            navigate('/dashboard')
          }}
        >
          Back To Dashboard
        </button>

        <button
          className="about-button about-button-primary"
          onClick={() => {
            navigate('/')
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  )
}

export default AboutPage