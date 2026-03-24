import { useEffect, useMemo, useState } from 'react'
import { fetchMockArticles } from '../data/mockData'
import './AnalyticsPage.css'

function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('Past Month')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadArticles = async () => {
      try {
        const payload = await fetchMockArticles()
        if (isMounted) setArticles(payload)
      } catch (err) {
        if (isMounted) setError(err.message || 'Could not load articles.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadArticles()
    return () => { isMounted = false }
  }, [])

  const analyzed = useMemo(() => articles.filter(a => a.status === 'analyzed'), [articles])

  const articlesCount = analyzed.length
  const avgBias = analyzed.length
    ? (analyzed.reduce((sum, a) => sum + a.analysis.bias.score, 0) / analyzed.length).toFixed(2)
    : 0
  const avgSentiment = analyzed.length
    ? (analyzed.reduce((sum, a) => sum + a.analysis.sentiment.score, 0) / analyzed.length).toFixed(2)
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
          <option>Past Week</option>
          <option>Past Month</option>
          <option>Past Year</option>
        </select>
      </div>

      {loading && <div className="analytics-status">Loading...</div>}
      {!loading && error && <div className="analytics-status">{error}</div>}

      <div className="stats-card">
        <div className="stat-row">
          <span className="stat-number">{articlesCount}</span>
          <span className="stat-label"> articles analyzed</span>
        </div>
        <div className="stat-row">
          <span className="stat-number">{avgBias > 0 ? `+${avgBias}` : avgBias}</span>
          <span className="stat-label"> average bias</span>
        </div>
        <div className="stat-row">
          <span className="stat-number">{avgSentiment > 0 ? `+${avgSentiment}` : avgSentiment}</span>
          <span className="stat-label"> average sentiment</span>
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
