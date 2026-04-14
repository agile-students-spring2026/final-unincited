import { useEffect, useMemo, useState } from "react";
import './DashboardPage.css'
import ArticleCard from "../components/ArticleCard";
import { apiRequest } from '../lib/api';

function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleToggleSave = async (articleId, currentlySaved) => {
    try {
      const endpoint = currentlySaved
        ? `/articles/unsave`
        : `/articles/save`

      const articleToUpdate = articles.find(
        (a) => String(a.id) === String(articleId)
      )

      const body = currentlySaved
        ? { articleId }
        : { article: articleToUpdate }

      await apiRequest(endpoint, {
        method: 'POST',
       
        body: JSON.stringify(body),
      })


      setArticles((prev) =>
        prev.map((a) =>
          String(a.id) === String(articleId)
            ? { ...a, isBookmarked: !currentlySaved }
            : a
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    let isMounted = true;

    const loadArticles = async () => {
      try {
        const [articlesData, userData] = await Promise.all([
          apiRequest(`/articles`),
          apiRequest(`/articles/me`),
        ]);
    
        const savedIds = new Set(
          (userData.savedArticles || []).map(a => String(a.id))
        )
        articlesData.articles.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        //fix articles to match prev mock data structure
        const mappedArticles = (articlesData.articles || []).map((article) => ({
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
          isBookmarked: savedIds.has(String(article.id)),
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

        
    
        if (isMounted) {
          setArticles(mappedArticles)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Could not load article feed.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadArticles();

    return () => {
      isMounted = false;
    };
  }, []);

  //filtering
  const filteredArticles = useMemo(
    () =>
      articles.filter((article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [articles, searchTerm]
  );

  return <div className="dashboard-page">
      <div className="dashboard-title">Recent Articles</div>
      <div className="dashboard-subtitle">Articles with bias analysis</div>
      
      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search articles..."
          className="dashboard-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="articles-list">
        {loading && <div>Loading articles...</div>}
        {!loading && error && <div>{error}</div>}

        {!loading && !error && filteredArticles.map((article) => (
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
            onToggleSave={handleToggleSave}
          />
        ))}
      </div>

  </div>
}

export default DashboardPage