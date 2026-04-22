import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import './MyArticlesPage.css'
import { apiRequest } from '../lib/api'

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
        ? '/articles/unsave'
        : '/articles/save'
  
  
      const body =  { articleId }
   
  
      const data = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      })

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

        //gets user submitted articles
        const userData = await apiRequest(`/articles/me`)
        userData.savedArticles.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
        });
        userData.submittedArticles.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setSavedArticlesState(userData.savedArticles || [])
        setSubmittedArticlesState(userData.submittedArticles || [])
        
      } catch (err) {
        if (isMounted) {
          if (err.message === 'No token provided' || err.message === 'Invalid or expired token') {
            navigate('/')
            return
          }

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
  }, [navigate])

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
            key={article._id}
            id={article._id}
            source={article.sourceName || article.source || 'Unknown Source'}
            title={article.title}
            summary={article.summary || article.explanation || article.articleText?.slice(0, 145) || ''}
            date={article.publishDate || article.publicationDate?.slice(0, 10) || ''}
            sentiment={article.analysis?.sentiment?.label || article.sentimentLabel || 'N/A'}
            bias={article.analysis?.bias?.label || article.biasLabel || 'N/A'}
            thumbnail={article.coverImageUrl || article.thumbnail}
            isBookmarked={savedArticlesState.some(s => String(s._id) === String(article._id))}
            status={article.status}
            onToggleSave={handleToggleSave}
          />
        ))}
      </div>
    </div>
  )
}

export default MyArticlesPage