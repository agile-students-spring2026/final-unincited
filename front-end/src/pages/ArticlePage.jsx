import { useNavigate } from 'react-router-dom'
import './ArticlePage.css'

export default function ArticlePage() {
  const navigate = useNavigate()

  return (
    <div className="article-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ◀ Back
      </button>

      <div className="article-detail">
        <img className="article-image" src="" alt="Article" />

        <div className="article-header">
          <span className="source-name">SOURCE NAME</span>
          <button className="bookmark-btn">★</button>
        </div>

        <h1 className="article-title">Article Title</h1>

        <div className="article-meta">
          <span className="author">Author Name</span>
          <span className="date">2026-00-00</span>
        </div>

        <div className="analysis-section">
          <div className="analysis-item">
            <span className="analysis-label">Bias</span>
            <span className="analysis-value">CENTER</span>
          </div>
          <div className="analysis-item">
            <span className="analysis-label">Sentiment</span>
            <span className="analysis-value">NEUTRAL</span>
          </div>
        </div>

        <div className="article-content">
          <p>Article content goes here. Highlights will be colored based on bias indicators.</p>
        </div>
      </div>
    </div>
  )
}