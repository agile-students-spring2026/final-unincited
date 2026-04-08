let articles = []
let nextId = 1

function toNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toIsoDate(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

function buildAnalysis(article) {
  return {
    bias: {
      label: article.biasLabel || 'Unknown',
      score: toNumber(article.biasScore)
    },
    sentiment: {
      label: article.sentimentLabel || 'Unknown',
      score: toNumber(article.sentimentScore)
    }
  }
}

function buildHighlights(article) {
  if (Array.isArray(article.highlights) && article.highlights.length > 0) {
    return article.highlights
  }

  if (!Array.isArray(article.evidenceLines)) {
    return []
  }

  return article.evidenceLines
}

function sortByCreatedAtDesc(left, right) {
  return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
}

export function saveArticle(article) {
  const createdAt = toIsoDate(article.createdAt)
  const normalized = {
    id: article.id || `article_${nextId++}`,
    url: article.url || null,
    title: article.title || 'Untitled Article',
    source: article.source || article.sourceName || null,
    sourceName: article.sourceName || article.source || 'Unknown Source',
    author: article.author || null,
    publicationDate: article.publicationDate || article.publishDate || null,
    publishDate: article.publishDate || article.publicationDate || null,
    thumbnail: article.thumbnail || article.coverImageUrl || null,
    coverImageUrl: article.coverImageUrl || article.thumbnail || null,
    articleText: article.articleText || article.content || '',
    content: article.content || article.articleText || '',
    detectedTopic: article.detectedTopic || 'Unknown',
    sentimentLabel: article.sentimentLabel || 'Unknown',
    sentimentScore: toNumber(article.sentimentScore),
    biasLabel: article.biasLabel || 'Unknown',
    biasScore: toNumber(article.biasScore),
    confidenceScore: toNumber(article.confidenceScore),
    explanation: article.explanation || null,
    evidenceLines: Array.isArray(article.evidenceLines) ? article.evidenceLines : [],
    highlights: buildHighlights(article),
    analysis: article.analysis || buildAnalysis(article),
    submittedBy: article.submittedBy || null,
    status: article.status || 'analyzed',
    createdAt
  }

  const existingIndex = articles.findIndex((item) =>
    item.id === normalized.id || (normalized.url && item.url === normalized.url)
  )

  if (existingIndex >= 0) {
    articles[existingIndex] = {
      ...articles[existingIndex],
      ...normalized,
      analysis: buildAnalysis(normalized),
      highlights: buildHighlights(normalized)
    }
    return { ...articles[existingIndex] }
  }

  articles.push(normalized)
  articles.sort(sortByCreatedAtDesc)
  return { ...normalized }
}

export function getAllArticles() {
  return articles.map((article) => ({ ...article }))
}

export function getArticleById(id) {
  const article = articles.find((item) => item.id === id)
  return article ? { ...article } : null
}

export function getArticleStats() {
  const totalArticles = articles.length

  if (totalArticles === 0) {
    return {
      totalArticles: 0,
      averageBiasScore: 0,
      averageSentimentScore: 0
    }
  }

  const averageBiasScore = Number(
    (articles.reduce((sum, article) => sum + toNumber(article.biasScore), 0) / totalArticles).toFixed(2)
  )
  const averageSentimentScore = Number(
    (articles.reduce((sum, article) => sum + toNumber(article.sentimentScore), 0) / totalArticles).toFixed(2)
  )

  return {
    totalArticles,
    averageBiasScore,
    averageSentimentScore
  }
}
