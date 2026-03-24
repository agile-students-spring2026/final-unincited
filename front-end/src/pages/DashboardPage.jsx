import { useEffect, useMemo, useState } from "react";
import './DashboardPage.css'
import ArticleCard from "../components/ArticleCard";
import { fetchMockArticles } from "../data/mockData";
function DashboardPage() {

  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadArticles = async () => {
      try {
        const payload = await fetchMockArticles();
        if (isMounted) {
          setArticles(payload);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Could not load article feed.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadArticles();

    return () => {
      isMounted = false;
    };
  }, []);

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
          />
        ))}
      </div>

  </div>
}

export default DashboardPage