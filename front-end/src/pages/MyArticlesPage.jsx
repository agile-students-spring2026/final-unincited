import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import { fetchMockArticles } from '../data/mockData'
import './MyArticlesPage.css'

function MyArticlesPage() {
  const [activeTab, setActiveTab] = useState('submitted')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const loadArticles = async () => {
      try {
        const payload = await fetchMockArticles()
        if (isMounted) {
          setArticles(payload)
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
    () =>
      articles
        .filter(a => a.isSubmitted)
        .sort((a, b) => (a.status === 'pending' ? -1 : 1) - (b.status === 'pending' ? -1 : 1)),
    [articles]
  )

  const savedArticles = useMemo(
    () =>
      articles
        .filter(a => a.isBookmarked)
        .sort((a, b) => (a.status === 'pending' ? -1 : 1) - (b.status === 'pending' ? -1 : 1)),
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
