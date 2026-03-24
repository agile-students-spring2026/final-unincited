import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import { mockArticles } from '../data/mockData'
import './MyArticlesPage.css'

function MyArticlesPage() {
  const [activeTab, setActiveTab] = useState('submitted')
  const navigate = useNavigate()

  const submittedArticles = mockArticles
    .filter(a => a.isSubmitted)
    .sort((a, b) => (a.status === 'pending' ? -1 : 1) - (b.status === 'pending' ? -1 : 1))
  const savedArticles = mockArticles
    .filter(a => a.isBookmarked)
    .sort((a, b) => (a.status === 'pending' ? -1 : 1) - (b.status === 'pending' ? -1 : 1))

  const displayedArticles = activeTab === 'submitted' ? submittedArticles : savedArticles

  return (
    <div className="my-articles-page">
      <div className="my-articles-title">My Articles</div>
      <div className="my-articles-subtitle">Submitted and saved articles</div>

      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'submitted' ? 'active' : ''}`}
          onClick={() => setActiveTab('submitted')}
        >
          SUBMITTED
        </button>
        <button
          className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          SAVED
        </button>
        <button
          className="tab-btn"
          onClick={() => navigate('/submit')}
        >
          + SUBMIT
        </button>
      </div>

      <div className="articles-list">
        {displayedArticles.map(article => (
          <ArticleCard
            key={article.id}
            id={article.id}
            source={article.sourceName}
            title={article.title}
            summary={article.summary}
            date={article.publishDate}
            sentiment={article.analysis.sentiment.label}
            bias={article.analysis.bias.label}
            thumbnail={article.coverImageUrl}
            isBookmarked={article.isBookmarked}
            status={article.status}
          />
        ))}
      </div>
    </div>
  )
}

export default MyArticlesPage
