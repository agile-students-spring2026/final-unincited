import { useEffect, useMemo, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell, ReferenceLine
} from 'recharts'
import { apiRequest } from '../lib/api'
import './AnalyticsPage.css'

const avg = (arr) => arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0

// consistent color per outlet across all charts
const OUTLET_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6']
const getOutletColor = (outlet, outlets) => OUTLET_COLORS[outlets.indexOf(outlet) % OUTLET_COLORS.length]

// custom tooltip for scatter plot bubbles
function ScatterTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="chart-tooltip">
      <div className="tooltip-source">{d.source}</div>
      <div>Avg Bias: <strong>{d.avgBias.toFixed(2)}</strong></div>
      <div>Avg Sentiment: <strong>{d.avgSentiment.toFixed(2)}</strong></div>
      <div>Articles: <strong>{d.count}</strong></div>
    </div>
  )
}

function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('All Time')
  const [selectedTopic, setSelectedTopic] = useState('All Topics')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadArticles = async () => {
      try {
        const data = await apiRequest(`/articles`)
        
        if (isMounted) setArticles(data.articles || [])
      } catch (err) {
        if (isMounted) setError(err.message || 'Could not load articles.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadArticles()
    return () => { isMounted = false }
  }, [])

  // Apply time range filter
  const timeFiltered = useMemo(() => {
    const now = new Date()
    let cutoff = null
    if (timeRange === 'Past Week') cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    else if (timeRange === 'Past Month') cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    else if (timeRange === 'Past Year') cutoff = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    return articles.filter(a => {
      if (cutoff && a.publicationDate && new Date(a.publicationDate) < cutoff) return false
      return true
    })
  }, [articles, timeRange])

  // unique topics and outlets for dropdowns and color mapping
  const topics = useMemo(() => {
    const unique = [...new Set(timeFiltered.map(a => a.detectedTopic).filter(Boolean))]
    return unique.sort()
  }, [timeFiltered])

  const allOutlets = useMemo(() => {
    const unique = [...new Set(timeFiltered.map(a => a.source).filter(Boolean))]
    return unique.sort()
  }, [timeFiltered])

  // Articles filtered by selected topic — drives charts 1 & 2 and stats card
  const topicArticles = useMemo(() => {
    if (selectedTopic === 'All Topics') return timeFiltered
    return timeFiltered.filter(a => a.detectedTopic === selectedTopic)
  }, [timeFiltered, selectedTopic])

  // Chart 1 and 2 are per outlet averages within selected topic
  const outletTopicData = useMemo(() => {
    const byOutlet = {}
    topicArticles.forEach(a => {
      const key = a.source || 'Unknown'
      if (!byOutlet[key]) byOutlet[key] = []
      byOutlet[key].push(a)
    })
    return Object.entries(byOutlet).map(([outlet, arts]) => ({
      outlet,
      avgBias: parseFloat(avg(arts.map(a => a.biasScore ?? 0)).toFixed(2)),
      avgSentiment: parseFloat(avg(arts.map(a => a.sentimentScore ?? 0)).toFixed(2)),
      count: arts.length,
    }))
  }, [topicArticles])

  // stats card numbers reflect selected topic
  const articlesCount = topicArticles.length
  const avgBiasStat = topicArticles.length
    ? avg(topicArticles.map(a => a.biasScore ?? 0)).toFixed(2)
    : 0
  const avgSentimentStat = topicArticles.length
    ? avg(topicArticles.map(a => a.sentimentScore ?? 0)).toFixed(2)
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

      {/* Topic filter */}
      <select
        className="source-filter-select"
        value={selectedTopic}
        onChange={(e) => setSelectedTopic(e.target.value)}
      >
        <option>All Topics</option>
        {topics.map(t => <option key={t}>{t}</option>)}
      </select>

      {loading && <div className="analytics-status">Loading...</div>}
      {!loading && error && <div className="analytics-status">{error}</div>}

      {/* Stats card */}
      <div className="stats-card">
        <div className="stat-row">
          <span className="stat-number">{articlesCount}</span>
          <span className="stat-label"> articles analyzed</span>
        </div>
        <div className="stat-row">
          <span className="stat-number">{avgBiasStat > 0 ? `+${avgBiasStat}` : avgBiasStat}</span>
          <span className="stat-label"> average bias (-1 to +1)</span>
        </div>
        <div className="stat-row">
          <span className="stat-number">{avgSentimentStat > 0 ? `+${avgSentimentStat}` : avgSentimentStat}</span>
          <span className="stat-label"> average sentiment (-1 to +1)</span>
        </div>
      </div>

      {/* Chart 1 — Avg Bias by Outlet */}
      <div className="chart-card">
        <div className="chart-label">
          Avg Bias by Outlet{selectedTopic !== 'All Topics' ? ` — ${selectedTopic}` : ''}
        </div>
        <div className="chart-note">-1 = Far Left &nbsp;·&nbsp; 0 = Center &nbsp;·&nbsp; +1 = Far Right</div>
        {outletTopicData.length === 0 ? (
          <div className="chart-empty">No data for selected filters</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={outletTopicData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="outlet" tick={{ fontSize: 11 }} />
              <YAxis domain={[-1, 1]} tickCount={5} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => v.toFixed(2)} />
              <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="4 2" />
              <Bar dataKey="avgBias" radius={[4, 4, 0, 0]}>
                {outletTopicData.map((entry) => (
                  <Cell key={entry.outlet} fill={getOutletColor(entry.outlet, allOutlets)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart 2 — Avg Sentiment by Outlet */}
      <div className="chart-card">
        <div className="chart-label">
          Avg Sentiment by Outlet{selectedTopic !== 'All Topics' ? ` — ${selectedTopic}` : ''}
        </div>
        <div className="chart-note">-1 = Very Negative &nbsp;·&nbsp; 0 = Neutral &nbsp;·&nbsp; +1 = Very Positive</div>
        {outletTopicData.length === 0 ? (
          <div className="chart-empty">No data for selected filters</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={outletTopicData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="outlet" tick={{ fontSize: 11 }} />
              <YAxis domain={[-1, 1]} tickCount={5} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => v.toFixed(2)} />
              <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="4 2" />
              <Bar dataKey="avgSentiment" radius={[4, 4, 0, 0]}>
                {outletTopicData.map((entry) => (
                  <Cell key={entry.outlet} fill={getOutletColor(entry.outlet, allOutlets)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart 3 — Scatter: Bias vs Sentiment per outlet, filtered by topic */}
      <div className="chart-card">
        <div className="chart-label">
          Outlet Bias vs Sentiment{selectedTopic !== 'All Topics' ? ` — ${selectedTopic}` : ' — All Topics'}
        </div>
        <div className="chart-note">Bubble size = number of articles. X = avg bias, Y = avg sentiment</div>
        {outletTopicData.length === 0 ? (
          <div className="chart-empty">No data for selected filters</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart margin={{ top: 16, right: 24, left: -10, bottom: 16 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="avgBias"
                domain={[-1, 1]}
                tickCount={5}
                tick={{ fontSize: 11 }}
                label={{ value: 'Avg Bias', position: 'insideBottom', offset: -10, fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="avgSentiment"
                domain={[-1, 1]}
                tickCount={5}
                tick={{ fontSize: 11 }}
                label={{ value: 'Avg Sentiment', angle: -90, position: 'insideLeft', offset: 14, fontSize: 11 }}
              />
              <ZAxis type="number" dataKey="count" range={[60, 400]} />
              <Tooltip content={<ScatterTooltip />} />
              <ReferenceLine x={0} stroke="#9ca3af" strokeDasharray="4 2" />
              <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="4 2" />
              <Scatter data={outletTopicData}>
                {outletTopicData.map((entry) => (
                  <Cell key={entry.outlet} fill={getOutletColor(entry.outlet, allOutlets)} fillOpacity={0.85} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}
        <div className="scatter-legend">
          {outletTopicData.map(d => (
            <div key={d.outlet} className="legend-item">
              <span className="legend-dot" style={{ background: getOutletColor(d.outlet, allOutlets) }} />
              <span className="legend-label">{d.outlet}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default AnalyticsPage
