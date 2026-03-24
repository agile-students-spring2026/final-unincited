import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchMockArticles } from '../data/mockData'
import './ArticlePage.css'

export default function ArticlePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadArticle = async () => {
      try {
        const articles = await fetchMockArticles()
        const selectedArticle = articles.find((item) => item.id === id)

        if (!isMounted) {
          return
        }

        if (!selectedArticle) {
          setError('Article not found.')
          return
        }

        setArticle(selectedArticle)
        setSaved(Boolean(selectedArticle.isBookmarked))
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Could not load article details.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadArticle()

    return () => {
      isMounted = false
    }
  }, [id])

  const contentParts = useMemo(() => {
    if (!article) {
      return []
    }

    const content = article.content || ''
    const highlights = Array.isArray(article.highlights)
      ? [...article.highlights].sort((a, b) => a.startIndex - b.startIndex)
      : []

    if (highlights.length === 0) {
      return [{ type: 'text', value: content }]
    }

    const parts = []
    let cursor = 0

    highlights.forEach((highlight, index) => {
      const start = Math.max(0, Math.min(content.length, highlight.startIndex))
      const end = Math.max(start, Math.min(content.length, highlight.endIndex))

      if (start > cursor) {
        parts.push({ type: 'text', value: content.slice(cursor, start) })
      }

      if (end > start) {
        parts.push({
          type: 'highlight',
          value: content.slice(start, end),
          cssClass: `highlight-tone-${index % 5}`,
          description: highlight.description || ''
        })
      }

      cursor = end
    })

    if (cursor < content.length) {
      parts.push({ type: 'text', value: content.slice(cursor) })
    }

    return parts
  }, [article])

  const toSliderPosition = (score) => `${((score + 1) / 2) * 100}%`

  if (loading) {
    return (
      <div className="article-page">
        <button className="back-button" onClick={() => navigate(-1)}>
          ◀ Back
        </button>
        <div className="article-loading">Loading article...</div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="article-page">
        <button className="back-button" onClick={() => navigate(-1)}>
          ◀ Back
        </button>
        <div className="article-error">{error || 'Article not found.'}</div>
      </div>
    )
  }

  return (
    <div className="article-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ◀ Back
      </button>

      <div className="article-detail">
        <img className="article-image" src={article.coverImageUrl} alt={article.title} />

        <div className="article-header">
          <span className="source-name">{article.sourceName}</span>
          <button className="bookmark-btn" onClick={() => setSaved((prev) => !prev)}>
            {saved ? '★' : '☆'}
          </button>
        </div>

        <h1 className="article-title">{article.title}</h1>

        <div className="article-meta">
          <span className="author">{article.author}</span>
          <span className="date">{article.publishDate}</span>
        </div>

        <div className="analysis-section">
          <div className="analysis-item">
            <div className="analysis-row-header">
              <span className="analysis-label">Bias</span>
              <span className="analysis-value">{article.analysis.bias.label}</span>
            </div>
            <div className="analysis-slider" aria-label="Bias summary slider">
              <span className="analysis-track" />
              <span
                className="analysis-marker"
                style={{ left: toSliderPosition(article.analysis.bias.score) }}
              />
            </div>
          </div>

          <div className="analysis-item">
            <div className="analysis-row-header">
              <span className="analysis-label">Sentiment</span>
              <span className="analysis-value">{article.analysis.sentiment.label}</span>
            </div>
            <div className="analysis-slider" aria-label="Sentiment summary slider">
              <span className="analysis-track" />
              <span
                className="analysis-marker"
                style={{ left: toSliderPosition(article.analysis.sentiment.score) }}
              />
            </div>
          </div>
        </div>

        <div className="article-content">
          <p>
            {contentParts.map((part, index) =>
              part.type === 'highlight' ? (
                <span
                  key={`highlight-${index}`}
                  className={`highlight ${part.cssClass}`}
                  title={part.description}
                >
                  {part.value}
                </span>
              ) : (
                <span key={`text-${index}`}>{part.value}</span>
              )
            )}
          </p>
        </div>
      </div>
    </div>
  )
}