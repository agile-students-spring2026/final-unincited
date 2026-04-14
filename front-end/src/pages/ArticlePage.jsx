import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams} from 'react-router-dom'
import './ArticlePage.css'
import { apiRequest } from '../lib/api'

const HIGHLIGHT_META = {
  'affective-manipulation': { label: 'Affective Manipulation' },
  'lexical-distortion': { label: 'Lexical Distortion' },
  'vague-attribution': { label: 'Vague Attribution' },
  'evidentiary-void': { label: 'Evidentiary Void' },
  'speculative-projection': { label: 'Speculative Projection' },
  'binary-forcing': { label: 'Binary Forcing' },
  'reductive-framing': { label: 'Reductive Framing' },
  'ad-hominem-attack': { label: 'Ad Hominem Attack' },
  'false-equivalence': { label: 'False Equivalence' },
  'prescriptive-imperative': { label: 'Prescriptive Imperative' },
}

export default function ArticlePage() {
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const{ id }= useParams()

  const handleSaveArticle = async () => {
    try {
      const endpoint = saved
        ? `/articles/unsave`
        : `/articles/save`

      const body = saved
        ? {  articleId: id }
        : {  article }

      const data = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      })

    
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
        const articleData =  await apiRequest(`/articles/${id}`)


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
            highlights: Array.isArray(raw.evidenceLines)
              ? raw.evidenceLines.map((line) => {
                  const quote = typeof line === 'string'
                    ? line
                    : (line.quote || line.highlight || '')
                  const taxonomyTag = typeof line === 'object' && line.taxonomyTag
                    ? line.taxonomyTag
                    : 'lexical-distortion'

                  return {
                    ...line,
                    quote,
                    highlight: quote,
                    taxonomyTag,
                    taxonomyLabel:
                      (typeof line === 'object' && line.taxonomyLabel) ||
                      HIGHLIGHT_META[taxonomyTag]?.label ||
                      'Lexical Distortion',
                    reason:
                      (typeof line === 'object' && (line.reason || line.description)) ||
                      '',
                  }
                })
              : [],
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

        const data = await apiRequest(`/articles/me`)

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

    highlights.forEach((highlight) => {
      const start = Math.max(0, Math.min(content.length, highlight.startIndex))
      const end = Math.max(start, Math.min(content.length, highlight.endIndex))

      if (start > cursor) {
        parts.push({ type: 'text', value: content.slice(cursor, start) })
      }

      if (end > start) {
        const taxonomyTag = highlight.taxonomyTag || 'lexical-distortion'
        const taxonomyLabel = highlight.taxonomyLabel || HIGHLIGHT_META[taxonomyTag]?.label || 'Lexical Distortion'
        const reason = highlight.reason || highlight.description || ''

        parts.push({
          type: 'highlight',
          value: content.slice(start, end),
          cssClass: `highlight-${taxonomyTag}`,
          taxonomyLabel,
          taxonomyTag,
          description: reason,
        })
      }

      cursor = end
    })

    if (cursor < content.length) {
      parts.push({ type: 'text', value: content.slice(cursor) })
    }

    return parts
  }, [article])

  const evidenceList = useMemo(() => {
    if (!Array.isArray(article?.highlights)) return []

    return article.highlights
      .filter((highlight) => highlight.startIndex != null && highlight.endIndex != null)
      .map((highlight) => {
        const taxonomyTag = highlight.taxonomyTag || 'lexical-distortion'
        return {
          ...highlight,
          taxonomyTag,
          taxonomyLabel: highlight.taxonomyLabel || HIGHLIGHT_META[taxonomyTag]?.label || 'Lexical Distortion',
          reason: highlight.reason || highlight.description || 'No explanation provided.',
        }
      })
  }, [article])

  const usedTaxonomyTags = useMemo(() => {
    const seen = new Set(evidenceList.map((item) => item.taxonomyTag))
    return Array.from(seen)
  }, [evidenceList])

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
                  left: toSliderPosition(article.analysis.bias.score),
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
                  left: toSliderPosition(article.analysis.sentiment.score),
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
                  title={`${part.taxonomyLabel}: ${part.description}`}
                >
                  {part.value}
                </span>
              ) : (
                <span key={`text-${index}`}>{part.value}</span>
              )
            )}
          </p>
        </div>

        {usedTaxonomyTags.length > 0 && (
          <div className="highlight-key">
            <h2 className="highlight-key-title">Highlight Key</h2>
            <div className="highlight-key-grid">
              {usedTaxonomyTags.map((tag) => (
                <span key={tag} className={`highlight-chip highlight-${tag}`}>
                  {HIGHLIGHT_META[tag]?.label || tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {evidenceList.length > 0 && (
          <div className="evidence-notes">
            <h2 className="evidence-notes-title">Evidence Notes</h2>
            <div className="evidence-notes-list">
              {evidenceList.map((item, idx) => (
                <div className="evidence-note" key={`${item.startIndex}-${item.endIndex}-${idx}`}>
                  <span className={`evidence-note-tag highlight-${item.taxonomyTag}`}>
                    {item.taxonomyLabel}
                  </span>
                  <p className="evidence-note-quote">"{item.quote || item.highlight}"</p>
                  <p className="evidence-note-reason">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}