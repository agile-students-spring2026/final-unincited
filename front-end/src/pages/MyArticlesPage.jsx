import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import './MyArticlesPage.css'

function MyArticlesPage() {
  const [activeTab, setActiveTab] = useState('submitted')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleToggleSave = async (articleId, currentlySaved) => {
    try {
      const endpoint = currentlySaved
        ? 'http://localhost:3000/articles/unsave'
        : 'http://localhost:3000/articles/save'
  
      const articleToUpdate = articles.find((article) => String(article.id) === String(articleId))
  
      const body = currentlySaved
        ? { userId: 1, articleId }
        : { userId: 1, article: articleToUpdate }
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.message || 'Could not update saved articles.')
      }
  
      setArticles(data.savedArticles || [])
    } catch (err) {
      setError(err.message || 'Could not update saved articles.')
    }
  }

  useEffect(() => {
    let isMounted = true

    // Fetch user's saved and submitted articles from backend
    const loadArticles = async () => {
      try {
        const response = await fetch('http://localhost:3000/articles/user/1')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Could not load articles.')
        }

        if (isMounted) {
          setArticles(data.savedArticles || [])
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Could not load articles.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadArticles()

    return () => {
      isMounted = false
    }
  }, [])

  const submittedArticles = useMemo(
    () => [],
    []
  )

  const savedArticles = useMemo(
    () => articles,
    [articles]
  )

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
        {loading && <div>Loading articles...</div>}
        {!loading && error && <div>{error}</div>}
        {!loading && !error && displayedArticles.map(article => (
          <ArticleCard
            key={article.id}
            id={article.id}
            source={article.sourceName}
            title={article.title}
            summary={article.summary}
            date={article.publishDate}
            sentiment={article.analysis?.sentiment?.label || 'N/A'}
            bias={article.analysis?.bias?.label || 'N/A'}
            thumbnail={article.coverImageUrl}
            isBookmarked={true}
            status={article.status}
            onToggleSave={handleToggleSave}
          />
        ))}
      </div>
    </div>
  )
}

export default MyArticlesPage