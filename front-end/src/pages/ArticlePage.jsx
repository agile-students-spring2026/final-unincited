import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './ArticlePage.css'
import { API_BASE_URL } from '../lib/api'

export default function ArticlePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSaveArticle = async () => {
    try {
      const endpoint = saved
        ? `${API_BASE_URL}/articles/unsave`
        : `${API_BASE_URL}/articles/save`

      const body = saved
        ? { userId: 1, articleId: article.id }
        : { userId: 1, article }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      console.log('save response', response.status, data)

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update saved article')
      }

      setSaved(!saved)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Could not update saved article')
    }
  }

  useEffect(() => {
    let isMounted = true

    const loadArticle = async () => {
      try {
        const articleRes =  await fetch(`${API_BASE_URL}/articles/${id}`)

        const articleData = await articleRes.json()

        const raw = articleData?.article
        if (!raw) {
          setError('Article not found.')
          return
        }

        const selectedArticle = {
            id: raw.id,
            sourceName: raw.source || "Unknown Source",
            title: raw.title,
            author: raw.author,
            publishDate: raw.publicationDate?.slice(0, 10) || "",
            coverImageUrl:
              raw.thumbnail || `https://picsum.photos/seed/${raw.id}/640/420`,
            content: raw.articleText || "",
            highlights: raw.evidenceLines || [],
            analysis: {
              sentiment: {
                label: raw.sentimentLabel || "NEUTRAL",
                score: raw.sentimentScore ?? 0,
              },
              bias: {
                label: raw.biasLabel || "CENTER",
                score: raw.biasScore ?? 0,
              },
            },
        }
        if (!isMounted) return

        setArticle(selectedArticle)

        const res = await fetch(`${API_BASE_URL}/articles/user/1`)
        const data = await res.json()

        const isSaved = (data.savedArticles || []).some(
          (a) => String(a.id) === String(selectedArticle.id)
        )

        setSaved(isSaved)
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
    if (!article) return []

    const content = article.content || ''
    const highlights = Array.isArray(article.highlights)
      ? [...article.highlights].filter(h => h.startIndex != null && h.endIndex != null).sort((a, b) => a.startIndex - b.startIndex)
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
          description: highlight.description || '',
        })
      }

      cursor = end
    })

    if (cursor < content.length) {
      parts.push({ type: 'text', value: content.slice(cursor) })
    }

    return parts
  }, [article])

  const biasToSliderPosition = (score) => `${score * 100}%`
  const sentimentToSliderPosition = (score) => `${((score + 1) / 2) * 100}%`

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
        <img
          className="article-image"
          src={article.coverImageUrl}
          alt={article.title}
        />

        <div className="article-header">
          <span className="source-name">{article.sourceName}</span>
          <button className="bookmark-btn" onClick={handleSaveArticle}>
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
              <span className="analysis-value">
                {article.analysis.bias.label}
              </span>
            </div>
            <div className="analysis-slider">
              <span className="analysis-track" />
              <span
                className="analysis-marker"
                style={{
                  left: biasToSliderPosition(article.analysis.bias.score),
                }}
              />
            </div>
          </div>

          <div className="analysis-item">
            <div className="analysis-row-header">
              <span className="analysis-label">Sentiment</span>
              <span className="analysis-value">
                {article.analysis.sentiment.label}
              </span>
            </div>
            <div className="analysis-slider">
              <span className="analysis-track" />
              <span
                className="analysis-marker"
                style={{
                  left: sentimentToSliderPosition(article.analysis.sentiment.score),
                }}
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