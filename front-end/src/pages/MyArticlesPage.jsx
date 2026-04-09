import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import './MyArticlesPage.css'
import { API_BASE_URL } from '../lib/api'

function MyArticlesPage() {
  const [activeTab, setActiveTab] = useState('submitted')
  const [savedArticlesState, setSavedArticlesState] = useState([])
  const [submittedArticlesState, setSubmittedArticlesState] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  

  const handleToggleSave = async (articleId, currentlySaved) => {
    try {
      const endpoint = currentlySaved
        ? `${API_BASE_URL}/articles/unsave`
        : `${API_BASE_URL}/articles/save`
  
      const articleToUpdate =
        savedArticlesState.find((article) => String(article.id) === String(articleId)) ||
        submittedArticlesState.find((article) => String(article.id) === String(articleId))
  
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
      data.savedArticles.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
      });
  
      setSavedArticlesState(data.savedArticles || [])
    } catch (err) {
      setError(err.message || 'Could not update saved articles.')
    }
  }

  useEffect(() => {
    let isMounted = true

    // Fetch user's saved and submitted articles from backend
    const loadArticles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/articles/user/1`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Could not load articles.')
        }

        if (isMounted) {

          data.savedArticles.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
          });
          data.submittedArticles.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setSavedArticlesState(data.savedArticles || [])
          setSubmittedArticlesState(data.submittedArticles || [])
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
    () => submittedArticlesState,
    [submittedArticlesState]
  )

  const savedArticles = useMemo(
    () => savedArticlesState,
    [savedArticlesState]
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
            source={article.sourceName || article.source || 'Unknown Source'}
            title={article.title}
            summary={article.summary || article.explanation || article.articleText?.slice(0, 145) || ''}
            date={article.publishDate || article.publicationDate?.slice(0, 10) || ''}
            sentiment={article.analysis?.sentiment?.label || article.sentimentLabel || 'N/A'}
            bias={article.analysis?.bias?.label || article.biasLabel || 'N/A'}
            thumbnail={article.coverImageUrl || article.thumbnail}
            isBookmarked={savedArticlesState.some(s => String(s.id) === String(article.id))}
            status={article.status}
            onToggleSave={handleToggleSave}
          />
        ))}
      </div>
    </div>
  )
}

export default MyArticlesPage