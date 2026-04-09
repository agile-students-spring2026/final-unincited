import { useEffect, useMemo, useState } from 'react'
import './AnalyticsPage.css'
import { API_BASE_URL } from '../lib/api';

function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('All Time')
  const [sourceFilter, setSourceFilter] = useState('All Sources')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadArticles = async () => {
      try {

        const articlesRes = await fetch(`${API_BASE_URL}/articles`)
        if (!articlesRes.ok) {
          throw new Error('Could not load articles.')
        }

        const data = await articlesRes.json()

        const mappedArticles = (data.articles || []).map((article) => ({
          id: article.id,
          sourceName: article.source || "Unknown Source",
          title: article.title || "Untitled Article",
          summary:
            article.explanation ||
            (article.articleText
              ? `${article.articleText.slice(0, 145).trimEnd()}...`
              : ""),
          publishDate: article.publicationDate
            ? article.publicationDate.slice(0, 10)
            : "",
          coverImageUrl:
            article.thumbnail ||
            `https://picsum.photos/seed/${article.id}/640/420`,
          isBookmarked: false,
          status: "analyzed",
          analysis: {
            sentiment: {
              label: article.sentimentLabel || "NEUTRAL",
              score: article.sentimentScore ?? 0,
            },
            bias: {
              label: article.biasLabel || "CENTER",
              score: article.biasScore ?? 0,
            },
          },
          originalArticle: article,
        }));

        if (isMounted) setArticles(mappedArticles)

      } catch (err) {
        if (isMounted) setError(err.message || 'Could not load articles.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadArticles()
    return () => { isMounted = false }
  }, [])

  const sources = useMemo(() => {
    const unique = [...new Set(articles.map(a => a.sourceName).filter(Boolean))]
    return unique.sort()
  }, [articles])

  const filtered = useMemo(() => {
    const now = new Date()
    let cutoff = null

    if (timeRange === 'Past Week') cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    else if (timeRange === 'Past Month') cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    else if (timeRange === 'Past Year') cutoff = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    return articles.filter(a => {
      if (a.status !== 'analyzed') return false
      if (cutoff && a.publishDate && new Date(a.publishDate) < cutoff) return false
      if (sourceFilter !== 'All Sources' && a.sourceName !== sourceFilter) return false
      return true
    })
  }, [articles, timeRange, sourceFilter])

  const articlesCount = filtered.length
  const avgBias = filtered.length
    ? (filtered.reduce((sum, a) => sum + a.analysis.bias.score, 0) / filtered.length).toFixed(2)
    : 0
  const avgSentiment = filtered.length
    ? (filtered.reduce((sum, a) => sum + a.analysis.sentiment.score, 0) / filtered.length).toFixed(2)
    : 0

  return (
    <div className="analytics-page">

      <div className="analytics-header">
        <div>
          <div className="analytics-title">Bias Analytics</div>
          <div className="analytics-subtitle">Visual Insights and Statistics</div>
        </div>
        <select
          className="time-range-select"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option>All Time</option>
          <option>Past Week</option>
          <option>Past Month</option>
          <option>Past Year</option>
        </select>
      </div>

      <select
        className="source-filter-select"
        value={sourceFilter}
        onChange={(e) => setSourceFilter(e.target.value)}
      >
        <option>All Sources</option>
        {sources.map(s => <option key={s}>{s}</option>)}
      </select>

      {loading && <div className="analytics-status">Loading...</div>}
      {!loading && error && <div className="analytics-status">{error}</div>}

      <div className="stats-card">
        <div className="stat-row">
          <span className="stat-number">{articlesCount}</span>
          <span className="stat-label"> articles analyzed</span>
        </div>
        <div className="stat-row">
          <span className="stat-number">{avgBias > 0 ? `+${avgBias}` : avgBias}</span>
          <span className="stat-label"> average bias (-1 to 1)</span>
        </div>
        <div className="stat-row">
          <span className="stat-number">{avgSentiment > 0 ? `+${avgSentiment}` : avgSentiment}</span>
          <span className="stat-label"> average sentiment (-1 to 1)</span>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-label">Chart 1 - Bias Distribution</div>
        <div className="chart-placeholder" />
      </div>

      <div className="chart-card">
        <div className="chart-label">Chart 2 - Sentiment Trend</div>
        <div className="chart-placeholder" />
      </div>

    </div>
  )
}

export default AnalyticsPage
